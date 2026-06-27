import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-06-24.dahlia",
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? ""

export const MAD_TO_CENTIMES = 100

export function madToCentimes(mad: number): number {
  return Math.round(mad * MAD_TO_CENTIMES)
}
