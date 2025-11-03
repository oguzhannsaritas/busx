import { ArrowLeft, Bus, Languages } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ThemeSwitch from "@/components/ThemeSwitch"

export default function HeaderBar() {
    const navigate = useNavigate()
    const { i18n, t } = useTranslation()

    const isTR = i18n.language?.toLowerCase().startsWith("tr")
    const nextLang = isTR ? "en" : "tr"
    const nextLabel = isTR ? "EN" : "TR"

    const changeLang = async () => {
        await i18n.changeLanguage(nextLang)
        try { localStorage.setItem("i18nextLng", nextLang) } catch {}
    }

    return (
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur
                       border-gray-200 dark:border-neutral-800
                       dark:bg-neutral-900/90">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-medium
                     text-gray-800 hover:opacity-80 dark:text-neutral-100"
                    aria-label={t("actions.back")}
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t("actions.back")}</span>
                </button>


                <button
                    onClick={() => navigate("/")}
                    className="inline-flex select-none items-center gap-2"
                    aria-label="BusX"
                    title="BusX"
                >
                    <Bus className="h-5 w-5 text-gray-900 dark:text-neutral-100" />
                    <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100">BusX</span>
                </button>


                <div className="flex items-center gap-2">
                    <button
                        onClick={changeLang}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold
                       hover:bg-gray-50 dark:hover:bg-neutral-800
                       border-gray-300 dark:border-neutral-700
                       text-gray-900 dark:text-neutral-100"
                        aria-label={t("actions.changeLanguage")}
                    >
                        <Languages className="h-4 w-4" />
                        <span>{nextLabel}</span>
                    </button>

                    <ThemeSwitch />
                </div>
            </div>
        </header>
    )
}
