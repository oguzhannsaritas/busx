import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    common: {
        printer:{print:"Print / Download PDF"},
        successPayment:{successPay: "The payment was successful. Booking successful!", successReservation:"Your Reservation Has Been Completed Successfully!" ,pnr:"PNR CODE", goHome: "Back to home", printNote:"Note: This printout can be used for pre-trip checking. Presentation of official ticket and ID is mandatory."},
        dayNames:{sun:"Sun", mon:"Mon", tue:"Tue", wed:"Wed", thu:"Thu", fri:"Fri", sat:"Sat"},
        monthNames:{may:"May", january: "January", february: "February", march: "March", april: "April", june: "June", august: "August", september: "September", october: "October", november: "November", july:"July", december: "December"},
      app: { title: 'Bus Ticket App' },
      nav: { search: 'Search', summary: 'Summary' },
      form: { from: 'From', to: 'To', date: 'Date', passengers: 'Passengers', submit: 'Search', fromPlaceholder:"Select Departure Point", toPlaceholder:"Select Destination " },
      trips: { title: 'Available trips', select: 'Continue' , emptySeat:"Empty Seat" , filter:"Filter", allCompanies:"All Companies",
      sort:{
          timeAsc:"Time Asc",
          timeDesc:"Time Desc",
          priceAsc:"Price Asc",
          priceDesc:"Price Desc",
          seatDesc:"Seat Desc",
          seatAsc:"Seat Asc",

      },
          sequencing:"Sequencing",
          listTitle:"Expedition list"
      },
      seats: {suggestedShort:"Suggestion", maxLimit:"You can choose up to 4 seats", loading: "Loading seat map…", title: 'Choose your seat', available: 'Available', selected: 'Selected', unavailable: 'Unavailable' ,seat:"Seat", selectedSeats:"Selected Seats",emptyState:"Seat Not selected",item:"Seat Selection"},
      errors: { notFound: 'No results', required: 'This field is required',remove:"Remove" },
        actions: { back: "Back", continue: "Continue", changeLanguage: "Change language" },
        home: { searchTitle: "Search Bus Tickets", subtitle: "Atlas Software BusX System" },
        cart:{total:"Total"},
        passenger: {
            title: "Passenger Information", titleShort: "Passengers",
            subtitle: "Please fill out information for all passengers.",
            cardTitle: "Seat {{no}} - Passenger",
            firstName: "First name", lastName: "Last name", idNo: "ID Number", gender: "Gender",passportNo: "Passport No",
            seatGender: "Seat {{no}} · {{gender}}"
        },
        sequencing:"Sequencing",
        gender: { male: "Male", female: "Female" },
        contact: { title: "Contact Information", email: "Email", phone: "Phone" },
        consent: { kvkk: "I accept the Privacy Policy and Terms.", please:"Please confirm the KVKK text", mandatory:"Phone is mandatory",currentPhone:"Enter a valid phone" ,email:"Enter valid Email",id:"Enter the 11-digit Turkish ID number", passport:"6–9 characters, A–Z and 0–9 only",emailMandatory:"Email is mandatory", errorMandatory:"This field is required" },
        trip: { info: "Trip Information", company: "Company", date: "Date", depart: "Departure", arrival: "Arrival" },
        price: { label: "Fiyat", unit: "Unit", qty: "Quantity", total: "Total" },
        summary: { title: "Reservation Summary", subtitle: "Please review your reservation" },
        payment: { goToPay: "Proceed to Payment" },
      validation: {
        fromMin: 'Departure Point Must Be Selected',
        toMin: 'Destination Must Be Selected',
        dateRequired: 'Date is required',
          info:"Departure and Arrival must be different"
      },
        error:{errorInfo:"Something went wrong !",retry:"Retry Again",goBackHome:"Home page", message:"Refresh the page or return to the Main page." },
    }
  },
  tr: {
    common: {
        printer:{print:"Yazdır / PDF İndir"},
        nav: { search: 'Ara', summary: 'Özet' },
      form: { from: 'Kalkış', to: 'Varış', date: 'Tarih', passengers: 'Yolcu', submit: 'Ara', fromPlaceholder:"Kalkış Noktasını Seçin", toPlaceholder:"Varış Noktasını Seçin" },
      trips: { title: 'Uygun seferler', select: 'Devam et',emptySeat:"Boş Koltuk", filter:"Filtre",allCompanies:"Tüm Firmalar" ,
          sort:{
              timeAsc:"Saat (Erken)",
              timeDesc:"Saat (Geç)",
              priceAsc:"Fiyat (Artan)",
              priceDesc:"Fiyat (Azalan",
              seatDesc:"Boş Koltuk (Çok)",
              seatAsc:"Boş Koltuk (Az)",

          },
          sequencing:"Sırala",
          listTitle:"Sefer Listesi"

      },

      seats: {suggestedShort:"Öneri", maxLimit:"En fazla 4 Koltuk Seçebilirsiniz", title: 'Koltuk seç', available: 'Müsait', selected: 'Seçili', unavailable: 'Dolu',seat:"Koltuk",selectedSeats:"Seçilen Koltuklar", emptyState:"Koltuk Seçilmedi",item:"Koltuk Seçimi",remove:"Kaldır", loading: "Koltuk planı yükleniyor…"  },
      errors: { notFound: 'Sonuç yok', required: 'Zorunlu alan' },
      validation: {
        fromMin: 'Kalkış Noktası Seçilmelidir',
        toMin: 'Varış Noktası Seçilmelidir',
        dateRequired: 'Tarih zorunludur',
          info:"Kalkış ve Varış farklı olmalı"
      },
        cart:{total:"Toplam"},
        actions: { back: "Geri", continue: "Devam Et", changeLanguage: "Dili değiştir" },
        home: { searchTitle: "Otobüs Bileti Ara", subtitle: "Atlas Yazılım BusX Sistemi" },
        passenger: {
            title: "Yolcu Bilgileri", titleShort: "Yolcu Bilgileri",
            subtitle: "Lütfen tüm yolcular için bilgileri doldurun.",
            cardTitle: "Koltuk {{no}} - Yolcu Bilgileri",
            firstName: "Ad", lastName: "Soyad", idNo: "TC Kimlik No", gender: "Cinsiyet",passportNo:"Pasaport Numarası",
            seatGender: "Koltuk {{no}} · {{gender}}"
        },
        gender: { male: "Erkek", female: "Kadın" },
        contact: { title: "İletişim Bilgileri", email: "E-posta", phone: "Telefon" },
        consent: { kvkk: "KVKK ve kullanım şartlarını kabul ediyorum", please:"Lütfen KVKK metnini onaylayın", currentPhone:"Geçerli bir telefon girin (5..., 05..., 905...)", mandatory:"Telefon zorunludur" ,email:"Geçerli E-Posta girin",id:"11 haneli TCKN girin", passport:"6–9 karakter, yalnızca A–Z ve 0–9",emailMandatory:"Eposta zorunludur",errorMandatory:"Bu alan zorunludur" },
        trip: { info: "Sefer Bilgileri", company: "Firma", date: "Tarih", depart: "Kalkış", arrival: "Varış" },
        price: { unit: "Birim", qty: "Adet", total: "Toplam", label: "Fiyat" },
        summary: { title: "Rezervasyon Özeti", subtitle: "Rezervasyon bilgilerinizi kontrol edin" },
        payment: { goToPay: "Ödemeye Geç" },
        monthNames:{may:"Mayıs", january:"Ocak", february:"Şubat", march:"Mart", april:"Nisan",june:"Haziran", july:"Temmuz", august:"Ağustos", september:"Eylül", october:"Ekim", november:"Kasım", december:"Aralık" },
        dayNames:{sun:"Paz", mon:"Pzt", tue:"Sal", wed:"Çar", thu:"Per", fri:"Cum", sat:"Cmt"},
        successPayment:{successPay: " Ödeme başarılı bir şekilde geçekleşti. Rezervasyon başarılı!", successReservation:"Rezervasyonunuz Başarıyla Tamamlandı!", pnr:"PNR KODU", goHome:"Ana Sayfaya Dön",printNote:"Not: Bu çıktı yolculuk öncesi kontrol için kullanılabilir. Resmi bilet ve kimlik ibrazı zorunludur."},
        error:{errorInfo:"Bir şeyler ters gitti !", retry: "Yeniden Dene", goBackHome: "Ana Sayfa", message:"Sayfayı yenileyin veya Ana sayfaya dönün."}
    }
  }
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['querystring', 'localStorage', 'navigator'], caches: ['localStorage'] }
  })

export default i18n
