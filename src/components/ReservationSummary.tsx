"use client"

import {useEffect, useMemo, useState} from "react"
import {useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import type {Passenger, Contact, PassengerFormValues} from "./PassengerForm"
import { lsSet, lsGet } from "@/utils/storage"
import {currentLocale, money} from "@/utils/i18nFormat"

type Trip = { company: string; dateISO: string; depart: string; arrival: string; price: number }

type Props = {
    trip: Trip,
    onBack?: () => void,
    onPay?: (payload: { trip: Trip; passengers: Passenger[]; contact: Contact; total: number }) => void,
    passengers?: Passenger[],
    contact?: Contact
}

const FORM_KEY = "busx:form"

export default function ReservationSummary({trip, onBack, onPay}: Props) {
    const {t} = useTranslation()
    const location = useLocation()
    const stateForm = (location.state as any)?.form as PassengerFormValues | undefined
    const [form, setForm] = useState<PassengerFormValues | null>(stateForm ?? null)

    useEffect(() => {
        if (stateForm) {
               lsSet(FORM_KEY, stateForm)
               setForm(stateForm)
             } else if (!form) {
               const saved = lsGet<PassengerFormValues>(FORM_KEY, null)
                   if (saved) setForm(saved)
             }
    }, [stateForm])

    const passengers = form?.passengers ?? []
    const contact = form?.contact ?? {email: "", phone: ""}
    const total = useMemo(() => passengers.length * trip.price, [passengers.length, trip.price])

    if (!form) return null

    const dateStr = new Date(trip.dateISO).toLocaleDateString(currentLocale(), {
        day: "numeric", month: "long", year: "numeric",
    })

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
            <header>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {t("summary.title" )}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-white">
                    {t("summary.subtitle")}
                </p>
            </header>

            <section className="rounded-2xl border bg-white shadow-sm p-6
                    dark:bg-white dark:border-neutral-800">

            <h2 className="text-sm font-semibold mb-4 dark:text-black">{t("trip.info")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-sm text-gray-600 ">{t("trip.company")}</div>
                        <div className="text-lg font-semibold dark:text-black">{trip.company}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">{t("trip.date")}</div>
                        <div className="text-lg font-semibold dark:text-black">{dateStr}</div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-sm text-gray-600">{t("trip.depart")}</div>
                        <div className="text-lg font-semibold dark:text-black">{trip.depart}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">{t("trip.arrival")}</div>
                        <div className="text-lg font-semibold dark:text-black" >{trip.arrival}</div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border bg-white shadow-sm p-6">
                <h2 className="text-sm font-semibold mb-4 dark:text-black">{t("passenger.titleShort")}</h2>
                <div className="space-y-3">
                    {passengers.map((p) => (
                        <div key={p.seat}
                             className="flex items-center justify-between rounded-xl border bg-gray-100 px-4 py-3">
                            <div>
                                <div className="text-sm dark:text-black">
                                    {t("passenger.firstName")}: {p.firstName}
                                </div>
                                <div className="text-sm dark:text-black">
                                    {t("passenger.lastName")}: {p.lastName}
                                </div>
                                <div className="text-sm dark:text-black">
                                    {(p.idType === "tckn" ? t("passenger.idNo") : t("passenger.passportNo"))}: {p.idNo}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-black">
                                    {t("passenger.seatGender", { defaultValue: "Koltuk {{no}} · {{gender}}", no: p.seat, gender: p.gender === "male" ? t("gender.male") : t("gender.female"),})}
                                </div>
                            </div>
                            <div className="font-semibold dark:text-black">{money(trip.price)}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border bg-white shadow-sm p-6">
                <h2 className="text-sm font-semibold mb-4 dark:text-black">{t("contact.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-sm text-gray-600">{t("contact.email")}</div>
                        <div className="text-lg font-semibold break-all dark:text-black">{contact.email}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">{t("contact.phone")}</div>
                        <div className="text-lg font-semibold dark:text-black">{contact.phone}</div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-5">
                    <div className="text-lg font-semibold dark:text-black">{t("price.total")}</div>
                    <div className="text-xl font-extrabold dark:text-black">{money(total)}</div>
                </div>
            </section>

            <div className="flex items-center justify-end">

                <button
                    onClick={() => (onPay ? onPay({trip, passengers, contact, total}) : undefined)}
                    className="h-10 rounded-xl bg-black px-5 font-medium text-white hover:bg-black/90 dark:text-black dark:bg-white"
                >
                    {t("payment.goToPay")}
                </button>
            </div>
        </div>
    )
}
