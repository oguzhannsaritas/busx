const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

const server = jsonServer.create()
const dbPath = path.join(__dirname, '..', 'public', 'mock-data.json')
if (!fs.existsSync(dbPath)) {
    console.error('mock-data.json not found:', dbPath)
    process.exit(1)
}
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults({ logger: true })

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use((_, res, next) => { res.header('Cache-Control', 'no-store'); next() })

server.get('/api/reference/agencies', (req, res) => {
    res.jsonp(router.db.get('agencies').value())
})

server.get('/api/schedules', (req, res) => {
    const { from, to, date } = req.query

    let list = router.db.get('schedules').value()

    if (from) list = list.filter(x => x.from === from)
    if (to) list = list.filter(x => x.to === to)

    if (date) {
        list = list.filter(x => {
            const byField = x.date
            const byDeparture = typeof x.departure === 'string' ? x.departure.slice(0, 10) : null
            return (byField || byDeparture) === date
        })
    }

    const cleaned = list.map(({ date, ...rest }) => rest)

    const delay = 2000 + Math.floor(Math.random() * 1000)
    setTimeout(() => res.jsonp(cleaned), delay)
})

server.get('/api/seatSchemas/:tripId', (req, res) => {
    const item = router.db.get('seatSchemas').find({ tripId: req.params.tripId }).value()
    if (!item) return res.status(404).jsonp({ error: 'Seat schema not found' })

    const withCells = ensureCells(item)
    res.jsonp(withCells)
})

function ensureCells(schema) {
    if (schema?.layout?.cells?.length) return schema

    const rows = schema.layout.rows
    const cols = schema.layout.cols

    const seatCols = new Set(schema.seats.map(s => s.col))
    const corridorCols = []
    for (let c = 1; c <= cols; c++) {
        if (!seatCols.has(c)) corridorCols.push(c)
    }
    const door = corridorCols.length ? { row: 1, col: corridorCols[0] } : null

    const cells = Array.from({ length: rows }, () => Array(cols).fill(0))

    for (let r = 0; r < rows; r++) {
        for (const c of corridorCols) cells[r][c - 1] = 2
    }
    if (door) {
        cells[door.row - 1][door.col - 1] = 3
    }

    return {
        ...schema,
        layout: { ...schema.layout, cells }
    }
}

server.post('/api/tickets/sell', (req, res) => {
    const { tripId, seats, contact, passengers } = req.body || {}
    if (!tripId || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).jsonp({ ok: false, message: 'tripID and at least one seat mandatory' })
    }
    const iso = new Date().toISOString().slice(0,10).replace(/-/g,'')
    const rnd = Math.random().toString(36).slice(2,5).toUpperCase()
    const pnr = `AT-${iso}-${rnd}`
    try {
        router.db.get('tickets').push({ createdAt: new Date().toISOString(), tripId, seats, contact, passengers, pnr }).write()
    } catch {}
    res.jsonp({ ok: true, pnr, message: 'Payment step mocked.' })
})

server.use('/api', router)

server.listen(5174, () => console.log('Mock API: http://localhost:5174'))
