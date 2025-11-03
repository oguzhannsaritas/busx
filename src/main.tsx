import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import '@/app/i18n'
import './index.css'
import { initTheme } from "@/app/theme"
import ErrorBoundary from "@/app/ErrorBoundary";
initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
    </React.StrictMode>
)
