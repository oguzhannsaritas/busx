import { Outlet, useLocation } from "react-router-dom"
import HeaderBar from "@/components/HeaderBar"
import ErrorBoundary from "@/app/ErrorBoundary";

export default function AppShell() {
    const { pathname } = useLocation()
    const hideHeader =
        pathname.startsWith("/payment") ||
        pathname.startsWith("/success") ||
        pathname.startsWith("/checkout")

    return (
        <>
            {!hideHeader && <HeaderBar />}
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>


        </>
    )
}
