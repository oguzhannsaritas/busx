import { useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, Printer } from "lucide-react"
import { lsDel } from "@/utils/storage"
import { useTranslation } from "react-i18next"

type LocationState = { pnr?: string }
const FORM_KEY = "busx:form"

export default function PaymentSuccessPage() {
    const navigate = useNavigate()
    const { state } = useLocation() as { state?: LocationState }
    const { t, i18n } = useTranslation()

    useEffect(() => {
        sessionStorage.setItem("busx:step", "5")
        if (state?.pnr) sessionStorage.setItem("lastPNR", state.pnr)
        lsDel(FORM_KEY)
        sessionStorage.removeItem("selectedSeats")
        sessionStorage.removeItem("busx:tripForSeats")
    }, [state?.pnr])

    const pnr = useMemo(
        () => state?.pnr ?? sessionStorage.getItem("lastPNR") ?? "",
        [state?.pnr]
    )

    useEffect(() => {
        const onPop = () => navigate("/", { replace: true })
        window.history.pushState(null, "", window.location.href)
        window.addEventListener("popstate", onPop)
        return () => window.removeEventListener("popstate", onPop)
    }, [navigate])

    const nowStr = useMemo(() => {
        const lang = i18n.resolvedLanguage || i18n.language || "tr"
        const locale = lang.startsWith("tr") ? "tr-TR" : "en-GB"
        return new Date().toLocaleString(locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }, [i18n.resolvedLanguage, i18n.language])

    return (
        <main className="min-h-screen grid place-items-center bg-gray-50 print:bg-white print:block">
            <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-8 text-center
                      print:max-w-none print:w-auto print:text-left print:shadow-none print:rounded-none print:border-gray-300 print:p-8 avoid-break">
                <header className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {t("successPayment.successReservation")}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">{nowStr}</p>
                </header>
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <section className="mt-4">
                    <div className="text-xs text-gray-500">{t("successPayment.pnr")}</div>
                    <div className="mt-1 text-2xl font-extrabold tracking-wider text-gray-900">
                        {pnr || "—"}
                    </div>
                </section>
                <hr className="my-6" />
                <p className="text-sm text-gray-700">
                    {t("successPayment.successPay")}
                </p>
                <div className="mt-6 grid gap-3 no-print">
                    <button
                        className="w-full h-11 rounded-xl bg-black text-white font-medium hover:bg-black/90"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        {t("successPayment.goHome")}
                    </button>
                    <button
                        className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
                        onClick={() => window.print()}
                    >
                        <Printer className="h-5 w-5" />
                        {t("printer.print")}
                    </button>
                </div>
                <p className="hidden print:block mt-6 text-[11px] text-gray-500">
                    {t("successPayment.printNote")}
                </p>
            </div>
        </main>
    )
}
