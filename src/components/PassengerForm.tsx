import React, { useMemo, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { lsGet, lsSet } from "@/utils/storage"
import CustomDropdown from "@/components/CustomDropdown"
import i18n from "i18next";

export type Passenger = {
    seat: number
    firstName: string
    lastName: string
    idType: "tckn" | "passport"
    idNo: string
    gender: "male" | "female"
}
export type Contact = { email: string; phone: string }
export type PassengerFormValues = { contact: Contact; passengers: Passenger[] }

const FORM_KEY = "busx:form"
const NAME_ALLOWED_RE = /^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/u
const NAME_STRIP_RE = /[^A-Za-zÇĞİÖŞÜçğıöşü\s]/gu
const DIGIT_STRIP_RE = /[^0-9]/g
const PASSPORT_STRIP_RE = /[^A-Za-z0-9]/g

function isValidPhoneDigits(input: string): boolean {
    const d = input.replace(/\D/g, "")
    return /^5\d{9}$/.test(d) || /^05\d{9}$/.test(d) || /^905\d{9}$/.test(d)
}

type Props = { seats: number[]; onSubmit?: (v: PassengerFormValues) => void }

function makeDefaults(saved: PassengerFormValues | null, seats: number[]): PassengerFormValues {
    return {
        contact: saved?.contact ?? { email: "", phone: "" },
        passengers: seats.map((s) => {
            const found = saved?.passengers?.find((p) => p.seat === s)
            return (
                found ?? {
                    seat: s,
                    firstName: "",
                    lastName: "",
                    idType: "tckn",
                    idNo: "",
                    gender: "male",
                }
            )
        }),
    }
}

function allowOnlyLettersBeforeInput(e: React.FormEvent<HTMLInputElement>) {
    const ne = e.nativeEvent as InputEvent
    if (ne.data && !/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/u.test(ne.data)) e.preventDefault()
}
function sanitizeLettersOnInput(e: React.FormEvent<HTMLInputElement>) {
    const el = e.currentTarget
    const cleaned = el.value.replace(NAME_STRIP_RE, "")
    if (cleaned !== el.value) el.value = cleaned
}
function allowOnlyDigitsBeforeInput(e: React.FormEvent<HTMLInputElement>) {
    const ne = e.nativeEvent as InputEvent
    if (ne.data && /\D/.test(ne.data)) e.preventDefault()
}
function sanitizeDigitsOnInput(e: React.FormEvent<HTMLInputElement>, maxLen?: number) {
    const el = e.currentTarget
    let v = el.value.replace(DIGIT_STRIP_RE, "")
    if (typeof maxLen === "number") v = v.slice(0, maxLen)
    if (v !== el.value) el.value = v
}
function allowAlnumBeforeInput(e: React.FormEvent<HTMLInputElement>) {
    const ne = e.nativeEvent as InputEvent
    if (ne.data && /[^A-Za-z0-9]/.test(ne.data)) e.preventDefault()
}
function sanitizePassportOnInput(e: React.FormEvent<HTMLInputElement>, maxLen = 9) {
    const el = e.currentTarget
    let v = el.value.replace(PASSPORT_STRIP_RE, "").toUpperCase()
    v = v.slice(0, maxLen)
    if (v !== el.value) el.value = v
}

export default function PassengerForm({ seats, onSubmit }: Props) {
    const { t } = useTranslation()
    const saved = lsGet<PassengerFormValues>(FORM_KEY, null)

    const {
        register,
        handleSubmit,
        formState: { isValid, errors, touchedFields , isSubmitted },
        trigger,
        reset,
        control,
        setValue,
    } = useForm<PassengerFormValues>({
        mode: "onChange",
        defaultValues: makeDefaults(saved, seats),
    })

    const phoneMsg = useMemo(() => ({
        required: t("consent.mandatory"),
        invalid:  t("consent.currentPhone"),
    }), [t])

    const emailMsg = useMemo(() => ({
        required: t("consent.emailMandatory"),
        invalid:  t("consent.email"),
    }), [t])

    const nameMsg = useMemo(() => ({
        required: t("consent.errorMandatory"),
    }), [t])

    const idMsg = useMemo(() => ({
        required: t("consent.errorMandatory"),
        invalid:  t("consent.id"),
    }), [t])

    const pasMsg = useMemo(() => ({
        required: t("consent.errorMandatory" ),
        invalid:  t("consent.passport"),
    }), [t])

    const passengersWatch = useWatch({ control, name: "passengers" })

    useEffect(() => {
        passengersWatch?.forEach((_, i) => {
            if (touchedFields?.passengers?.[i]?.firstName) {
                trigger(`passengers.${i}.firstName` as const)
            }
            if (touchedFields?.passengers?.[i]?.lastName) {
                trigger(`passengers.${i}.lastName` as const)
            }
            if (touchedFields?.passengers?.[i]?.idNo) {
                trigger(`passengers.${i}.idNo` as const)
            }
        })
        if (touchedFields?.contact?.phone)  trigger("contact.phone")
        if (touchedFields?.contact?.email)  trigger("contact.email")
    }, [i18n.resolvedLanguage, touchedFields, trigger, passengersWatch])

    useEffect(() => {
        if (saved) reset(makeDefaults(saved, seats))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seats.join(",")])

    const inputBase =
        "h-11 rounded-xl border px-4 text-[15px] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-0 " +
        "border-gray-300 bg-white text-gray-900 focus:border-gray-400 " +
        "hover:dark:border-neutral-700   dark:text-black dark:placeholder:text-neutral-400 "

    const hintBase = "mt-1 text-xs text-red-600 "

    return (
        <form
            onSubmit={handleSubmit((v) => {
                lsSet(FORM_KEY, v)
                onSubmit?.(v)
            })}
            className="container mx-auto max-w-5xl px-4 py-8 space-y-6 "
            noValidate
        >
            <header className="mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {t("passenger.title")}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-white">
                    {t("passenger.subtitle")}
                </p>
            </header>

            {seats.map((seat, idx) => {
                const idType: "tckn" | "passport" = (passengersWatch?.[idx]?.idType as any) ?? "tckn"
                const gender: "male" | "female" = (passengersWatch?.[idx]?.gender as any) ?? "male"

                return (
                    <section key={seat} className="rounded-2xl border bg-white shadow-sm p-6">
                        <h2 className="text-base font-semibold mb-4 dark:text-black">
                            {t("passenger.cardTitle", { defaultValue: "Koltuk {{no}} - Yolcu Bilgileri", no: seat })}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium dark:text-black">
                                    {t("passenger.firstName")}
                                </label>
                                <input
                                    className={inputBase}
                                    aria-invalid={!!errors.passengers?.[idx]?.firstName}
                                    onBeforeInput={allowOnlyLettersBeforeInput}
                                    onInput={sanitizeLettersOnInput}
                                    {...register(`passengers.${idx}.firstName`, {
                                        required: { value: true, message: nameMsg.required },
                                        validate: (v) => NAME_ALLOWED_RE.test(v) ,
                                    })}
                                />
                                {(touchedFields?.passengers?.[idx]?.firstName || isSubmitted) &&
                                    errors.passengers?.[idx]?.firstName && (
                                        <span className={hintBase}>
                                            {String(errors.passengers[idx]?.firstName?.message)}
                                        </span>
                                    )}
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium dark:text-black">{t("passenger.lastName")}</label>
                                <input
                                    className={inputBase}
                                    aria-invalid={!!errors.passengers?.[idx]?.lastName}
                                    onBeforeInput={allowOnlyLettersBeforeInput}
                                    onInput={sanitizeLettersOnInput}
                                    {...register(`passengers.${idx}.lastName`, {
                                        required: { value: true, message: nameMsg.required },
                                        validate: (v) => NAME_ALLOWED_RE.test(v) ,
                                    })}
                                />
                                {(touchedFields?.passengers?.[idx]?.lastName || isSubmitted) &&
                                    errors.passengers?.[idx]?.lastName && (
                                        <span className={hintBase}>
                                            {String(errors.passengers[idx]?.lastName?.message)}
                                        </span>
                                    )}
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium dark:text-black">
                                    {idType === "tckn" ? t("passenger.idNo") : t("passenger.passportNo")}
                                </label>

                                <input type="hidden" {...register(`passengers.${idx}.idType`, { required: true })} />
                                <CustomDropdown
                                    value={idType}
                                    onChange={(val) =>
                                        setValue(`passengers.${idx}.idType`, val as "tckn" | "passport", { shouldValidate: true })
                                    }
                                    options={[
                                        { value: "tckn", label: "T.C. Kimlik No" },
                                        { value: "passport", label: "Pasaport" },
                                    ]}
                                    error={!!errors.passengers?.[idx]?.idType}
                                    size="sm"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium dark:text-black">
                                    {idType === "tckn" ? t("passenger.idNo") : t("passenger.passportNo")}
                                </label>

                                {idType === "tckn" ? (
                                    <input
                                        className={inputBase}
                                        inputMode="numeric"
                                        maxLength={11}
                                        aria-invalid={!!errors.passengers?.[idx]?.idNo}
                                        onBeforeInput={allowOnlyDigitsBeforeInput}
                                        onInput={(e) => sanitizeDigitsOnInput(e, 11)}
                                        placeholder="11 hane"
                                        {...register(`passengers.${idx}.idNo`, {
                                            required: { value: true, message: nameMsg.required },
                                            validate: (v) => /^\d{11}$/.test(v) || idMsg.invalid
                                        })}
                                    />
                                ) : (
                                    <input
                                        className={inputBase}
                                        aria-invalid={!!errors.passengers?.[idx]?.idNo}
                                        onBeforeInput={allowAlnumBeforeInput}
                                        onInput={sanitizePassportOnInput}
                                        placeholder="6–9 karakter, A–Z ve 0–9"
                                        {...register(`passengers.${idx}.idNo`, {
                                            required: { value: true, message: nameMsg.required },
                                            validate: (v) => /^[A-Z0-9]{6,9}$/.test(v) || pasMsg.invalid,
                                        })}
                                    />
                                )}

                                {(touchedFields?.passengers?.[idx]?.idNo || isSubmitted) &&
                                    errors.passengers?.[idx]?.idNo && (
                                        <span className={hintBase}>
                                            {String(errors.passengers[idx]?.idNo?.message)}
                                        </span>
                                    )}
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium dark:text-black">
                                    {t("passenger.gender")}
                                </label>
                                <input type="hidden" {...register(`passengers.${idx}.gender`, { required: true })} />
                                <CustomDropdown
                                    value={gender}
                                    onChange={(val) =>
                                        setValue(`passengers.${idx}.gender`, val as "male" | "female", { shouldValidate: true })
                                    }
                                    options={[
                                        { value: "male", label: t("gender.male") },
                                        { value: "female", label: t("gender.female") },
                                    ]}
                                    size="sm"
                                    error={!!errors.passengers?.[idx]?.gender}
                                />
                            </div>
                        </div>

                        <input type="hidden" {...register(`passengers.${idx}.seat` as const)} value={seat} />
                    </section>
                )
            })}

            <section className="rounded-2xl border bg-white shadow-sm p-6">
                <h3 className="text-base font-semibold mb-4 dark:text-black">{t("contact.title")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium dark:text-black">{t("contact.email")}</label>
                        <input
                            type="email"
                            placeholder="mail@example.com"
                            className={inputBase}
                            aria-invalid={!!errors.contact?.email}
                            {...register("contact.email", {
                                required: { value: true, message: emailMsg.required },
                                validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || emailMsg.invalid,
                            })}
                        />
                        {(touchedFields?.contact?.email || isSubmitted) && errors.contact?.email && (
                            <span className={hintBase}>{String(errors.contact.email.message)}</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium dark:text-black">{t("contact.phone")}</label>
                        <input
                            placeholder="5XXXXXXXXX / 05XXXXXXXXX / 905XXXXXXXXX"
                            className={inputBase}
                            inputMode="numeric"
                            aria-invalid={!!errors.contact?.phone}
                            onBeforeInput={allowOnlyDigitsBeforeInput}
                            onInput={(e) => sanitizeDigitsOnInput(e)}
                            {...register("contact.phone", {
                                required: { value: true, message: phoneMsg.required },
                                validate: (v) => isValidPhoneDigits(v) || phoneMsg.invalid,
                            })}
                        />
                        {(touchedFields?.contact?.phone || isSubmitted) && errors.contact?.phone && (
                            <span className={hintBase}>{String(errors.contact.phone.message)}</span>
                        )}
                    </div>
                </div>

                <label className="mt-4 flex items-center gap-3 text-sm text-gray-700 ">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-black dark:border-black"
                        {...register("contact.kvkk" as any, { required: true , onChange: () => trigger() })}
                    />
                    {t("consent.kvkk")}
                </label>
                {errors.contact && (errors as any).contact?.kvkk && (
                    <div className={hintBase}> {t("consent.please")}</div>
                )}
            </section>

            <div className="flex items-center justify-end">
                <button
                    type="submit"
                    disabled={!isValid}
                    className={`h-10 rounded-xl px-5 font-medium text-white transition ${
                        isValid ? "bg-black hover:bg-black/90 dark:bg-white dark:text-black" : "bg-gray-400 cursor-not-allowed dark:bg-white/50 dark:text-black"
                    }`}
                >
                    {t("actions.continue")}
                </button>
            </div>
        </form>
    )
}
