/**
 * CMI (Centre Monétique Interbancaire) — Morocco payment gateway
 *
 * Flow:
 *  1. Merchant builds a signed HTML form and redirects the user to CMI.
 *  2. User pays on CMI's hosted page.
 *  3. CMI POSTs a callback to MERCHANT_OK_URL / MERCHANT_FAIL_URL with a
 *     HASH for verification.
 *
 * Docs reference: CMI Paiement en ligne — Guide d'intégration v4.x
 */
import crypto from "crypto"

const CMI_BASE_URL     = process.env.CMI_BASE_URL     ?? "https://payment.cmi.co.ma/fim/est3Dgate"
const CMI_CLIENT_ID    = process.env.CMI_CLIENT_ID    ?? ""
const CMI_STORE_KEY    = process.env.CMI_STORE_KEY    ?? ""
const CMI_OK_URL       = process.env.CMI_OK_URL       ?? `${process.env.NEXT_PUBLIC_APP_URL}/paiement/succes`
const CMI_FAIL_URL     = process.env.CMI_FAIL_URL     ?? `${process.env.NEXT_PUBLIC_APP_URL}/paiement/echec`
const CMI_CALLBACK_URL = process.env.CMI_CALLBACK_URL ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cmi`
const CMI_CURRENCY     = "504" // ISO 4217 — Moroccan Dirham

export interface CMIParams {
  orderId:    string
  amount:     number  // MAD, e.g. 59.00
  email:      string
  firstName?: string
  lastName?:  string
  tel?:       string
  lang?:      "fr" | "ar" | "en"
}

export function buildCMIForm(params: CMIParams): { url: string; fields: Record<string, string> } {
  const amountStr = params.amount.toFixed(2)
  const rnd       = Math.random().toString(36).slice(2, 12).toUpperCase()
  const lang      = params.lang ?? "fr"

  const fields: Record<string, string> = {
    clientid:       CMI_CLIENT_ID,
    oid:            params.orderId,
    amount:         amountStr,
    currency:       CMI_CURRENCY,
    okUrl:          CMI_OK_URL,
    failUrl:        CMI_FAIL_URL,
    callbackUrl:    CMI_CALLBACK_URL,
    shopurl:        process.env.NEXT_PUBLIC_APP_URL ?? "",
    lang,
    rnd,
    encoding:       "UTF-8",
    email:          params.email,
    BillToName:     `${params.firstName ?? ""} ${params.lastName ?? ""}`.trim(),
    BillToAddrCity: "Casablanca",
    tel:            params.tel ?? "",
    hashAlgorithm:  "ver3",
  }

  fields.hash = computeCMIHash(fields)
  return { url: CMI_BASE_URL, fields }
}

/**
 * Verify the HASH that CMI sends in its callback POST.
 * Returns true if the signature is valid.
 */
export function verifyCMICallback(body: Record<string, string>): boolean {
  const received = body.HASH
  if (!received) return false

  const computed = computeCMIHash(body, /* excludeHash */ true)
  return crypto.timingSafeEqual(
    Buffer.from(received.toLowerCase()),
    Buffer.from(computed.toLowerCase()),
  )
}

/* ── Internal ── */

function computeCMIHash(
  fields: Record<string, string>,
  excludeHash = false,
): string {
  const EXCLUDED = new Set(["hash", "encoding"])
  if (excludeHash) EXCLUDED.add("hash")

  const sorted = Object.keys(fields)
    .filter((k) => !EXCLUDED.has(k.toLowerCase()))
    .sort((a, b) => a.localeCompare(b))

  const plaintext = sorted.map((k) => fields[k]).join("|") + "|" + CMI_STORE_KEY

  return crypto.createHash("sha512").update(plaintext, "utf8").digest("hex")
}
