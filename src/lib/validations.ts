import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  isStudent: z.boolean().optional().default(false),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const dietaryProfileSchema = z.object({
  goal: z.enum(["PERTE_DE_POIDS", "PRISE_DE_MASSE", "MAINTIEN", "ENERGIE"]),
  tastePrefs: z.array(z.enum(["SALE", "ACIDULE", "EPICE", "DOUX"])),
  defaultPortion: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  defaultSauceType: z.string().optional(),
  sauceFatLevel: z.enum(["LIGHT", "MEDIUM", "FULL"]),
  allergens: z.array(z.string()),
  excludedIngredients: z.array(z.string()),
});

export const orderSchema = z.object({
  fulfillmentType: z.enum(["DINE_IN", "TAKEAWAY", "CLICK_COLLECT"]),
  timeSlot: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().optional(),
      savedBowlId: z.string().optional(),
      customization: z.any().optional(),
      quantity: z.number().min(1),
    })
  ),
  promoCode: z.string().optional(),
  usePoints: z.number().optional().default(0),
  useCredits: z.number().optional().default(0),
  specialInstructions: z.string().optional(),
});

export const promoSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(["PERCENT", "FIXED_MAD", "FREE_MEAL", "FREE_ITEM"]),
  value: z.number().positive(),
  validFrom: z.string(),
  validTo: z.string(),
  maxUses: z.number().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DietaryProfileInput = z.infer<typeof dietaryProfileSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
