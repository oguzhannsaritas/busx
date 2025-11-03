import { useTranslation } from "react-i18next"
import { money } from "@/utils/i18nFormat"

type Props = { unitPrice: number; seats: number[] }

export default function PriceSummary({ unitPrice, seats }: Props) {
    const { t } = useTranslation()
    const total = unitPrice * seats.length

    return (
        <div className="border p-4 rounded-2xl
                bg-white
                border-gray-200 dark:border-neutral-800
                text-gray-900 dark:bg-white">

        <div className="flex justify-between dark:text-black ">
                <span >{t("price.unit")}</span>
                <span>{money(unitPrice)}</span>
            </div>
            <div className="flex justify-between dark:text-black">
                <span>{t("price.qty")}</span>
                <span>{seats.length}</span>
            </div>
            <hr className="my-2 dark:text-black" />
            <div className="flex justify-between font-semibold dark:text-black">
                <span>{t("price.total")}</span>
                <span>{money(total)}</span>
            </div>
        </div>
    )
}
