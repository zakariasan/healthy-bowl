import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMacro(value: number, unit = "g"): string {
  return `${Math.round(value)}${unit}`;
}

export function calculateBMI(weight: number, height: number): number {
  return weight / Math.pow(height / 100, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function generateReferralCode(userId: string): string {
  return `HB-${userId.slice(-6).toUpperCase()}`;
}
