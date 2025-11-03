import { Component, ReactNode } from "react"
import {t} from "i18next";

type Props = { children: ReactNode; fallback?: ReactNode; onError?: (err: Error, info: any) => void }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError() { return { hasError: true } }

    componentDidCatch(error: Error, info: any) {
        this.props.onError?.(error, info)
        console.error("[ErrorBoundary]", error, info)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <main className="min-h-screen grid place-items-center p-8">
                    <div className="max-w-md w-full rounded-2xl border bg-white shadow p-6 text-center">
                        <h1 className="text-lg font-semibold dark:text-black"> {t("error.errorInfo")}</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-black">
                            {t("error.message")}
                        </p>
                        <div className="mt-4 grid gap-2">
                            <button className="h-11 rounded-xl bg-black text-white "
                                    onClick={() => window.location.reload()}>
                                {t("error.retry")}
                            </button>
                            <button className="h-11 rounded-xl border dark:text-black"
                                    onClick={() => (window.location.href = "/")}>
                                {t("error.goBackHome")}
                            </button>
                        </div>
                    </div>
                </main>
            )
        }
        return this.props.children
    }
}
