import { test, expect, chromium } from '@playwright/test';

test('BusX e2e test', async ({  }) => {
    const browser = await chromium.launch({ headless: true, slowMo: 600 });
    const context = await browser.newContext();
    const page = await context.newPage();

    const agenciesResponse = page.waitForResponse((res) =>
        res.url().includes('api/reference/agencies') && res.ok(),
    );

    const sellResponse = page.waitForResponse((res) =>
        res.url().includes('api/tickets/sell') && res.ok(),
    );

    const schedulesResponse = page.waitForResponse((res) =>
        res.url().includes('api/schedules') && res.ok(),
    );


    await page.goto('http://localhost:5173/');
    const res = await agenciesResponse;
    expect(res.status()).toBe(200);
    const data = await res.json();
    console.log('> agencies API  response:', data);
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
    console.log("APı'dan gelen veri için manuel 9 saniye bekleniyor")
    await page.waitForTimeout(9000);
    const resSchedules = await schedulesResponse;
    expect(resSchedules.status()).toBe(200);
    const dataSchedules = await resSchedules.json();
    console.log('> Schedules API  response:', dataSchedules);
    await page.locator('#root > main > div > section > div > div.mt-6.space-y-6 > article:nth-child(1) > div.mt-6.grid.grid-cols-3.md\\:grid-cols-12.gap-6.items-center > div.col-span-3.md\\:col-span-12 > button').click();
    console.log("Atlas Lines Firması Seçildi")
    await page.locator('#root > main > div.grid.gap-6.lg\\:grid-cols-\\[1fr_320px\\] > div > div.px-3.pb-3.md\\:px-5.md\\:pb-5 > div > div.mx-auto.hidden.md\\:grid.w-fit.gap-2 > button:nth-child(44)').click();
    console.log("35'inci koltuk Seçildi")
    await page.locator('#root > main > div.flex.items-center.justify-end > button').click();
    console.log("Devam et butonu tıklanıldı")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[1]/input').fill("Oğuzhan")
    console.log("İsim Girildi")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[2]/input').fill("Sarıtaş")
    console.log("Soyisim Girildi")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[3]/div/button').click();
    console.log("Passport Seçeneği Seçmek için Combobox tıklanıldı ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[3]/div/div/ul/li[2]/button').click();
    console.log("Passport Seçeneği Seçildi ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[4]/input').fill("11563ADAD")
    console.log("Passport No Girildi ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[5]/div/button').click();
    console.log("Kadın Cinsiyeti Seçemk için Combobox tıklanıldı ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[1]/div/div[5]/div/div/ul/li[2]/button').click();
    console.log("Kadın Cinsiyeti Seçildi ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[2]/div/div[1]/input').fill("deneme@gmail.com")
    console.log("Email bilgisi girildi ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[2]/div/div[2]/input').fill("05373433443")
    console.log("Telefon bilgisi girildi ")
    await page.locator('//*[@id="root"]/main/div/section/form/section[2]/label/input').click();
    console.log("KVKK Checkbox tıklanıldı  ")
    await page.locator('//*[@id="root"]/main/div/section/form/div/button').click();
    console.log("Devam Et Butonu tıklanıldı  ")
    await expect(page.getByText(/(Rezervasyon Özeti|Reservation Summary)/i)).toBeVisible();
    console.log("Başlık kontrolü : Rezervasyon Özeti başlığı var   ")
    await page.locator('//*[@id="root"]/div/div/button').click();
    console.log("Ödemeye Geç Butonuna tıklanıldı  ")
    const resSell = await sellResponse;
    expect(res.status()).toBe(200);
    const dataSell = await resSell.json();
    console.log('> Sell API  response:', dataSell);
    await expect(page.getByText(/(Rezervasyonunuz Başarıyla Tamamlandı!|Your Reservation Has Been Completed Successfully!)/i)).toBeVisible();
    console.log("Başlık kontrolü : Rezervasyonunuz Başarıyla Tamamlandı! başlığı var   ")
    await page.locator('//*[@id="root"]/main/div/div[2]/button[1]').click();
    console.log("Ana Sayfaya Dön Butonuna tıklanıldı  ")
    console.log("TEST BAŞARILI BİR ŞEKİLDE SONA ERDİ  ")



    await context.close();
    await browser.close();

});