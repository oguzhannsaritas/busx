import { test, expect } from '@playwright/test'

test('home opens', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await expect(page.getByRole('heading', { name: /Search Bus Tickets|Otobüs Bileti Ara/i })).toBeVisible()
})
