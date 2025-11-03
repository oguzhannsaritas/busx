import { createBrowserRouter } from 'react-router-dom'
import SearchPage from '@/pages/SearchPage'
import SeatSelectionPage from '@/pages/SeatSelectionPage'
import SummaryPage from '@/pages/SummaryPage'
import ReservationSummaryPage from '@/pages/ReservationSummaryPage'
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import AppShell from "@/app/AppShell";
import RouteErrorBoundary from "@/app/RouteErrorBoundary";
import { Suspense } from "react";
const withSuspense = (el: JSX.Element) => <Suspense fallback={<p>Loading…</p>}>{el}</Suspense>;


export const router = createBrowserRouter([
    {
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
        children: [
            { path: "/", element: withSuspense(<SearchPage />) },
            { path: "/seats", element: withSuspense(<SeatSelectionPage />) },
            { path: "/summary", element: withSuspense(<SummaryPage />) },
            { path: '/reservation-summary',  element: withSuspense(<ReservationSummaryPage />) },
        ],
    },
    { path: '/payment-success', element:withSuspense(<PaymentSuccessPage />) , errorElement: <RouteErrorBoundary /> },

])