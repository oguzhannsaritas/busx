import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom"
import {t} from "i18next";

export default function RouteErrorBoundary() {
    const err = useRouteError() as any
    const navigate = useNavigate()

    let title =t("error.errorInfo")
    let message = t("error.message")

    if (isRouteErrorResponse(err)) {
        title = `${err.status} ${err.statusText}`
        message = err.data?.message || message
    } else if (err instanceof Error) {
        message = err.message
    }

    return (
        <main className="min-h-screen grid place-items-center p-8">
            <div className="max-w-md w-full rounded-2xl border bg-white shadow p-6 text-center">
                <h1 className="text-lg font-semibold text-black"> {title}</h1>
                <p className="mt-2 text-sm text-black  break-all">{message}</p>
                <div className="mt-4 grid gap-2">
                    <button className="h-11 rounded-xl bg-black text-white" onClick={() => window.location.reload()}>
                        {t("error.retry")}
                    </button>
                    <button className="h-11 rounded-xl border text-black" onClick={() => navigate("/", { replace: true })}>
                        {t("error.goBackHome")}
                    </button>
                </div>
            </div>
        </main>
    )
}
