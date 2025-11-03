import i18n from "@/app/i18n"

export const currentLocale = () =>
    i18n.resolvedLanguage?.toLowerCase().startsWith("en") ? "en-US" : "tr-TR"

export const money = (amount: number, currency: string = "TRY") =>
    new Intl.NumberFormat(currentLocale(), {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount)
