import { test, expect, chromium } from '@playwright/test';

test('Seat map select test', async ({  }) => {
    const browser = await chromium.launch({ headless: false, slowMo: 600 });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:5173');
    await page.locator('#from').click();
    console.log("Kalkış Noktasını Seçin Combobox'u Tıklanıldı")
    await page.locator('#from-listbox > li:nth-child(1) > button').click();
    console.log("İstanbul - Alibeyköy Seçeneği tıklanıldı")
    await page.locator('#to').click();
    console.log("Sefer Noktasını Seçin Combobox'u Tıklanıldı")
    await page.locator('#to-listbox > li:nth-child(3) > button').click();
    console.log("Ankara - AŞTİ Seçeneği tıklanıldı")
    await page.locator('#date').click();
    console.log("Tarih Combobox'u tıklanıldı")
    await page.locator('//*[@id="date-calendar"]/div[3]/button[30]').click();
    console.log("Tarih Seçildi")
    await page.locator('#root > main > section > div > div > div > form > div.md\\:col-span-12.lg\\:col-span-12.flex.justify-center.md\\:justify-start > button').click();
    console.log("Arama butonuna tıklanıldı")
    await page.waitForTimeout(9000);
    console.log("APı'dan gelen veri için manuel 9 saniye bekleniyor")
    await page.locator('#root > main > div > section > div > div.mt-6.space-y-6 > article:nth-child(1) > div.mt-6.grid.grid-cols-3.md\\:grid-cols-12.gap-6.items-center > div.col-span-3.md\\:col-span-12 > button').click();
    console.log("Atlas Lines Firması Seçildi")
    await page.locator('#root > main > div.grid.gap-6.lg\\:grid-cols-\\[1fr_320px\\] > div > div.px-3.pb-3.md\\:px-5.md\\:pb-5 > div > div.mx-auto.hidden.md\\:grid.w-fit.gap-2 > button:nth-child(44)').click();
    console.log("35'inci koltuk Seçildi")
    await page.locator('#root > main > div.flex.items-center.justify-end > button').click();
    console.log("Devam et butonu tıklanıldı")


    await context.close();
    await browser.close();

});