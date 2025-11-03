# BusX — React Front-End Case (Atlas Yazılım) / BusX — React Front-End Case (Atlas Software)

Modern React (Vite + TypeScript) ile **otobüs bileti satış** akışının (Arama → Sefer Listesi → Koltuk → Yolcu & Özet → Başarı) gerçekçi bir prototipi.  
UI/UX, erişilebilirlik (A11y), form validasyonu, mock API tüketimi, component mimarisi, testler ve performans odaklıdır.

A realistic prototype of the **bus ticket sales** flow (Search → Schedule List → Seat → Passenger & Summary → Success) using Modern React (Vite + TypeScript).  
Focused on UI/UX, accessibility (A11y), form validation, mock API consumption, component architecture, testing, and performance.

## Özellikler

- **Search**: Departure/Arrival (dropdown), date (next day), validation (Departure≠Arrival, date required)
- **Flight List**: Card view, **sorting** (Price ↑/↓, Time Early/Late), **filter** (Company)
- **Seat Plan**: 2+2 grid, **max 4 seats** rule, **side-by-side suggestion** (adjacency highlight), selected panel
- **Passenger & Contact**: First/Last name (letters only), **TCKN/Passport** branch verification, Gender, Phone & Email verification, **KVKK requirement**
- **Summary & Confirmation**: Trip info + (seat count × unit price), **TRY currency format**, **mock sale** with “**Proceed to Payment**”
- **Success Screen**: PNR display, print-friendly, clean flow
- **I18n**: Live switching between **TR/EN** with i18next
- **Theme**: Light/Dark **switch** (persistent, system preference)
- **Accessibility**: ARIA roles + **keyboard support** (navigate with ↓/↑, select with **Enter**, close with **Esc**)
- **Tests**: Vitest + Testing Library (unit) and **Playwright** (E2E)
- **Design**: TailwindCSS + lucide-react **UI RESPONSIVE MOBILE & DESKTOP**

- **Arama**: Kalkış/Varış (dropdown), tarih (gelecek gün), validasyon (Kalkış≠Varış, tarih zorunlu)
- **Sefer Listesi**: Kart görünümü, **sıralama** (Fiyat ↑/↓, Saat Erken/Geç), **filtre** (Firma)
- **Koltuk Planı**: 2+2 grid, **max 4 koltuk** kuralı, **yan yana öneri** (adjacency highlight), seçilenler paneli
- **Yolcu & İletişim**: Ad/Soyad (sadece harf), **TCKN/Passport** şubeli doğrulama, Cinsiyet, Telefon & E-posta doğrulama, **KVKK şartı**
- **Özet & Onay**: Sefer bilgisi + (koltuk sayısı × birim fiyat), **TRY para formatı**, “**Ödemeye Geç**” ile **mock satış**
- **Başarı Ekranı**: PNR gösterimi, yazdırma (print) dostu, akış temizliği
- **İ18n**: i18next ile **TR/EN** canlı değişim
- **Tema**: Light/Dark **switch** (kalıcı, system preference)
- **Erişilebilirlik**: ARIA rolleri + **klavye desteği** (↓/↑ ile gezin, **Enter** seç, **Esc** kapat)
- **Testler**: Vitest + Testing Library (unit) ve **Playwright** (E2E)
- **Tasarım**: TailwindCSS + lucide-react   **UI RESPONSİVE MOBİL VE MASAÜSTÜ** 
---


## 🔧 Kurulum

> **Gereksinimler**: Node 18+ , npm

```bash
# bağımlılıklar
npm i

# geliştirme (Vite)
npm run dev

# mock API + web together 
npm run dev:all