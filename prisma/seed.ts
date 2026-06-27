import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting Healthy Bowl seed...")

  // ── Location ───────────────────────────────────────────────
  const location = await prisma.location.upsert({
    where: { id: "loc-marrakech-campus" },
    update: {},
    create: {
      id: "loc-marrakech-campus",
      name: "Healthy Bowl — Campus Marrakech",
      address: "Avenue Abdelkrim Al Khattabi, Campus Universitaire",
      city: "Marrakech",
      country: "MA",
      lat: 31.6295,
      lng: -7.9811,
      phone: "+212 524 000 000",
      isActive: true,
      hours: {
        monday: { open: "11:00", close: "21:00" },
        tuesday: { open: "11:00", close: "21:00" },
        wednesday: { open: "11:00", close: "21:00" },
        thursday: { open: "11:00", close: "21:00" },
        friday: { open: "11:00", close: "21:00" },
        saturday: { open: "11:00", close: "17:00" },
        sunday: { open: null, close: null },
      },
    },
  })
  console.log("✅ Location created:", location.name)

  // ── Suppliers ──────────────────────────────────────────────
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: "sup-alkhadra" },
      update: {},
      create: {
        id: "sup-alkhadra",
        name: "Coopérative Al Khadra",
        isLocal: true,
        contact: "Hassan El Amrani",
        address: "Route de Fès, Marrakech",
        certifications: ["Bio Maroc", "HACCP"],
      },
    }),
    prisma.supplier.upsert({
      where: { id: "sup-atlas" },
      update: {},
      create: {
        id: "sup-atlas",
        name: "Atlas Protéines",
        isLocal: true,
        contact: "Khalid Mansouri",
        address: "Zone Industrielle, Marrakech",
        certifications: ["ISO 22000"],
      },
    }),
    prisma.supplier.upsert({
      where: { id: "sup-souss" },
      update: {},
      create: {
        id: "sup-souss",
        name: "Souss Fruits & Légumes",
        isLocal: true,
        contact: "Fatima Ait Brahim",
        address: "Marché de gros Souss, Agadir",
        certifications: ["GlobalGAP"],
      },
    }),
    prisma.supplier.upsert({
      where: { id: "sup-ocean" },
      update: {},
      create: {
        id: "sup-ocean",
        name: "Océan Frais Atlantique",
        isLocal: false,
        contact: "Youssef Benali",
        address: "Port d'Agadir",
        certifications: ["MSC", "HACCP"],
      },
    }),
  ])
  console.log(`✅ ${suppliers.length} suppliers created`)

  // ── Ingredients ────────────────────────────────────────────
  const ingredientData = [
    // BASES
    { id: "ing-roquette", name: "Roquette", nameEn: "Arugula", category: "BASE" as const, kcal: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, pricePerUnit: 0.05, stock: 5000, minStock: 1000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-epinard", name: "Épinards baby", nameEn: "Baby Spinach", category: "BASE" as const, kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, pricePerUnit: 0.05, stock: 4000, minStock: 1000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-laitue", name: "Laitue mixte", nameEn: "Mixed Greens", category: "BASE" as const, kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.8, pricePerUnit: 0.04, stock: 6000, minStock: 1000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-quinoa", name: "Quinoa", nameEn: "Quinoa", category: "BASE" as const, kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, pricePerUnit: 0.12, stock: 8000, minStock: 2000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-riz-brun", name: "Riz brun", nameEn: "Brown Rice", category: "BASE" as const, kcal: 110, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, pricePerUnit: 0.06, stock: 10000, minStock: 2000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-boulgour", name: "Boulgour", nameEn: "Bulgur Wheat", category: "BASE" as const, kcal: 115, protein: 4.3, carbs: 23, fat: 0.6, fiber: 4.5, pricePerUnit: 0.07, stock: 5000, minStock: 1000, isVegan: true, isGlutenFree: false, allergens: ["GLUTEN"], supplierId: "sup-souss" },

    // PROTEINS
    { id: "ing-poulet", name: "Poulet grillé", nameEn: "Grilled Chicken", category: "PROTEIN" as const, kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, pricePerUnit: 0.18, stock: 15000, minStock: 3000, isVegan: false, isGlutenFree: true, allergens: [], supplierId: "sup-atlas" },
    { id: "ing-tofu", name: "Tofu grillé", nameEn: "Grilled Tofu", category: "PROTEIN" as const, kcal: 144, protein: 17, carbs: 3, fat: 8, fiber: 0.3, pricePerUnit: 0.12, stock: 8000, minStock: 1500, isVegan: true, isGlutenFree: true, allergens: ["SOJA"], supplierId: "sup-souss" },
    { id: "ing-pois-chiches", name: "Pois chiches rôtis", nameEn: "Roasted Chickpeas", category: "PROTEIN" as const, kcal: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 7.6, pricePerUnit: 0.08, stock: 10000, minStock: 2000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-saumon", name: "Saumon atlantique", nameEn: "Atlantic Salmon", category: "PROTEIN" as const, kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, pricePerUnit: 0.25, stock: 6000, minStock: 1000, isVegan: false, isGlutenFree: true, allergens: ["POISSON"], supplierId: "sup-ocean" },
    { id: "ing-thon", name: "Thon Albacore", nameEn: "Albacore Tuna", category: "PROTEIN" as const, kcal: 132, protein: 29, carbs: 0, fat: 1, fiber: 0, pricePerUnit: 0.16, stock: 8000, minStock: 1500, isVegan: false, isGlutenFree: true, allergens: ["POISSON"], supplierId: "sup-ocean" },

    // TOPPINGS
    { id: "ing-tomate", name: "Tomates cerises", nameEn: "Cherry Tomatoes", category: "TOPPING" as const, kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, pricePerUnit: 0.03, stock: 8000, minStock: 1500, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-concombre", name: "Concombre", nameEn: "Cucumber", category: "TOPPING" as const, kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, pricePerUnit: 0.02, stock: 10000, minStock: 2000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-avocat", name: "Avocat", nameEn: "Avocado", category: "TOPPING" as const, kcal: 160, protein: 2, carbs: 9, fat: 15, fiber: 6.7, pricePerUnit: 0.08, stock: 5000, minStock: 800, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-betterave", name: "Betterave rôtie", nameEn: "Roasted Beet", category: "TOPPING" as const, kcal: 43, protein: 1.6, carbs: 9.6, fat: 0.2, fiber: 2.8, pricePerUnit: 0.03, stock: 6000, minStock: 1000, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-carotte", name: "Carottes râpées", nameEn: "Grated Carrot", category: "TOPPING" as const, kcal: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, pricePerUnit: 0.02, stock: 8000, minStock: 1500, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-poivron", name: "Poivrons grillés", nameEn: "Grilled Peppers", category: "TOPPING" as const, kcal: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, pricePerUnit: 0.03, stock: 5000, minStock: 800, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-alkhadra" },
    { id: "ing-oeuf", name: "Œuf dur", nameEn: "Hard-Boiled Egg", category: "TOPPING" as const, kcal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, pricePerUnit: 0.05, stock: 3000, minStock: 500, isVegan: false, isGlutenFree: true, allergens: ["OEUFS"], supplierId: "sup-atlas" },

    // SAUCES
    { id: "ing-tahini", name: "Tahini maison", nameEn: "Homemade Tahini", category: "SAUCE" as const, kcal: 90, protein: 2.7, carbs: 3.2, fat: 8, fiber: 1, pricePerUnit: 0.04, stock: 5000, minStock: 500, isVegan: true, isGlutenFree: true, allergens: ["SESAME"], supplierId: "sup-souss" },
    { id: "ing-vinaigrette", name: "Vinaigrette citronnée", nameEn: "Lemon Dressing", category: "SAUCE" as const, kcal: 45, protein: 0.1, carbs: 1, fat: 4.5, fiber: 0, pricePerUnit: 0.02, stock: 8000, minStock: 500, isVegan: true, isGlutenFree: true, allergens: [], supplierId: null },
    { id: "ing-houmous", name: "Houmous maison", nameEn: "Homemade Hummus", category: "SAUCE" as const, kcal: 70, protein: 3.5, carbs: 8, fat: 3, fiber: 3, pricePerUnit: 0.04, stock: 6000, minStock: 800, isVegan: true, isGlutenFree: true, allergens: ["SESAME"], supplierId: null },
    { id: "ing-yaourt", name: "Sauce yaourt & herbes", nameEn: "Herb Yogurt", category: "SAUCE" as const, kcal: 35, protein: 2.5, carbs: 4, fat: 1, fiber: 0, pricePerUnit: 0.03, stock: 4000, minStock: 500, isVegan: false, isGlutenFree: true, allergens: ["LACTOSE"], supplierId: "sup-atlas" },

    // ADDONS
    { id: "ing-chia", name: "Graines de chia", nameEn: "Chia Seeds", category: "ADDON" as const, kcal: 58, protein: 2, carbs: 5, fat: 3.7, fiber: 4.9, pricePerUnit: 0.05, stock: 3000, minStock: 300, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-courge", name: "Graines de courge", nameEn: "Pumpkin Seeds", category: "ADDON" as const, kcal: 55, protein: 3, carbs: 1.8, fat: 4.5, fiber: 0.5, pricePerUnit: 0.05, stock: 3000, minStock: 300, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-spiruline", name: "Spiruline", nameEn: "Spirulina", category: "ADDON" as const, kcal: 10, protein: 1.8, carbs: 0.9, fat: 0.3, fiber: 0.1, pricePerUnit: 0.06, stock: 1500, minStock: 200, isVegan: true, isGlutenFree: true, allergens: [], supplierId: "sup-souss" },
    { id: "ing-feta", name: "Feta AOP", nameEn: "Feta Cheese", category: "ADDON" as const, kcal: 35, protein: 2, carbs: 0.5, fat: 3, fiber: 0, pricePerUnit: 0.05, stock: 4000, minStock: 400, isVegan: false, isGlutenFree: true, allergens: ["LACTOSE"], supplierId: "sup-atlas" },
  ]

  for (const ing of ingredientData) {
    await prisma.ingredient.upsert({
      where: { id: ing.id },
      update: {},
      create: ing as never,
    })
  }
  console.log(`✅ ${ingredientData.length} ingredients created`)

  // ── Menu Categories ────────────────────────────────────────
  const categories = await Promise.all([
    prisma.menuCategory.upsert({
      where: { slug: "SALADES" },
      update: {},
      create: { id: "cat-salades", slug: "SALADES", name: "Salades", nameEn: "Salads", sortOrder: 1 },
    }),
    prisma.menuCategory.upsert({
      where: { slug: "BOWLS" },
      update: {},
      create: { id: "cat-bowls", slug: "BOWLS", name: "Bowls", nameEn: "Bowls", sortOrder: 2 },
    }),
    prisma.menuCategory.upsert({
      where: { slug: "JUS_SMOOTHIES" },
      update: {},
      create: { id: "cat-jus", slug: "JUS_SMOOTHIES", name: "Jus & Smoothies", nameEn: "Juices & Smoothies", sortOrder: 3 },
    }),
    prisma.menuCategory.upsert({
      where: { slug: "SNACKS" },
      update: {},
      create: { id: "cat-snacks", slug: "SNACKS", name: "Snacks", nameEn: "Snacks", sortOrder: 4 },
    }),
  ])
  console.log(`✅ ${categories.length} menu categories created`)

  // ── Menu Items ─────────────────────────────────────────────
  const menuItems = [
    // SALADES
    { id: "mi-salade-med", categoryId: "cat-salades", name: "Salade Méditerranéenne", description: "Roquette, feta, olives noires, tomates cerises, vinaigrette citronnée", basePrice: 55, baseMacros: { kcal: 320, protein: 12, carbs: 18, fat: 22, fiber: 4 }, allergens: ["LACTOSE"], isVegan: false, isGlutenFree: true, isHighProtein: false, customizable: true, sortOrder: 1 },
    { id: "mi-salade-cesar", categoryId: "cat-salades", name: "Salade César Poulet", description: "Romaine, poulet grillé, parmesan, croûtons dorés, sauce césar maison", basePrice: 65, baseMacros: { kcal: 480, protein: 38, carbs: 24, fat: 26, fiber: 3 }, allergens: ["GLUTEN", "LACTOSE", "OEUFS", "POISSON"], isVegan: false, isGlutenFree: false, isHighProtein: true, customizable: true, sortOrder: 2 },
    { id: "mi-salade-detox", categoryId: "cat-salades", name: "Salade Détox Verte", description: "Épinards, concombre, avocat, graines de courge, citron pressé, gingembre", basePrice: 50, baseMacros: { kcal: 280, protein: 8, carbs: 16, fat: 20, fiber: 8 }, allergens: [], isVegan: true, isGlutenFree: true, isHighProtein: false, customizable: true, sortOrder: 3 },

    // BOWLS
    { id: "mi-power-bowl", categoryId: "cat-bowls", name: "Power Bowl Protéines", description: "Quinoa, poulet grillé, œuf dur, houmous, betterave rôtie, épinards, tahini", basePrice: 75, baseMacros: { kcal: 620, protein: 45, carbs: 52, fat: 18, fiber: 9 }, allergens: ["OEUFS", "SESAME"], isVegan: false, isGlutenFree: true, isHighProtein: true, customizable: true, sortOrder: 1 },
    { id: "mi-buddha", categoryId: "cat-bowls", name: "Buddha Bowl Vegan", description: "Riz brun, pois chiches rôtis, betterave, avocat, carottes râpées, tahini citronné", basePrice: 68, baseMacros: { kcal: 540, protein: 22, carbs: 68, fat: 20, fiber: 12 }, allergens: ["SESAME"], isVegan: true, isGlutenFree: true, isHighProtein: false, customizable: true, sortOrder: 2 },
    { id: "mi-bowl-saumon", categoryId: "cat-bowls", name: "Bowl Saumon Teriyaki", description: "Riz brun, saumon atlantique, edamame, concombre, avocat, sauce teriyaki maison", basePrice: 85, baseMacros: { kcal: 580, protein: 40, carbs: 55, fat: 18, fiber: 6 }, allergens: ["POISSON", "SOJA"], isVegan: false, isGlutenFree: false, isHighProtein: true, customizable: true, sortOrder: 3 },

    // JUS & SMOOTHIES
    { id: "mi-green-detox", categoryId: "cat-jus", name: "Green Detox", description: "Épinards, concombre, citron vert, gingembre frais, pomme verte, menthe", basePrice: 35, baseMacros: { kcal: 110, protein: 3, carbs: 24, fat: 1, fiber: 4 }, allergens: [], isVegan: true, isGlutenFree: true, isHighProtein: false, customizable: false, sortOrder: 1 },
    { id: "mi-smoothie-mango", categoryId: "cat-jus", name: "Smoothie Mangue Protéiné", description: "Mangue fraîche, banane, protéines vanille, lait d'amande, graines de chia", basePrice: 42, baseMacros: { kcal: 280, protein: 22, carbs: 38, fat: 5, fiber: 5 }, allergens: ["FRUITS_A_COQUE"], isVegan: true, isGlutenFree: true, isHighProtein: true, customizable: false, sortOrder: 2 },
    { id: "mi-jus-immunite", categoryId: "cat-jus", name: "Jus Immunité", description: "Orange pressée, carotte, gingembre, curcuma, poivre noir, citron", basePrice: 32, baseMacros: { kcal: 120, protein: 2, carbs: 28, fat: 0, fiber: 2 }, allergens: [], isVegan: true, isGlutenFree: true, isHighProtein: false, customizable: false, sortOrder: 3 },

    // SNACKS
    { id: "mi-energy-balls", categoryId: "cat-snacks", name: "Energy Balls Dattes-Cacao", description: "Dattes Medjool, cacao cru, noix de cajou, graines de chia, noix de coco (3 pièces)", basePrice: 28, baseMacros: { kcal: 180, protein: 4, carbs: 26, fat: 8, fiber: 4 }, allergens: ["FRUITS_A_COQUE"], isVegan: true, isGlutenFree: true, isHighProtein: false, customizable: false, sortOrder: 1 },
    { id: "mi-houmous-legumes", categoryId: "cat-snacks", name: "Houmous & Légumes", description: "Houmous maison, bâtonnets carottes, concombre, poivrons, céleri", basePrice: 32, baseMacros: { kcal: 200, protein: 8, carbs: 22, fat: 9, fiber: 7 }, allergens: ["SESAME"], isVegan: true, isGlutenFree: true, isHighProtein: false, customizable: false, sortOrder: 2 },
    { id: "mi-granola", categoryId: "cat-snacks", name: "Granola Maison", description: "Flocons d'avoine, miel d'arganier, amandes, raisins secs, cannelle (100g)", basePrice: 25, baseMacros: { kcal: 320, protein: 8, carbs: 48, fat: 12, fiber: 5 }, allergens: ["GLUTEN", "FRUITS_A_COQUE"], isVegan: false, isGlutenFree: false, isHighProtein: false, customizable: false, sortOrder: 3 },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item as never,
    })
  }
  console.log(`✅ ${menuItems.length} menu items created`)

  // ── Subscription Plans ─────────────────────────────────────
  const plans = [
    { id: "plan-starter", plan: "STARTER" as const, name: "Starter", emoji: "🌱", description: "Idéal pour découvrir Healthy Bowl", priceMonthly: 299, mealCredits: 8, includesJuice: false, includesSmoothie: false, includesNutritionAdvice: false, requiresStudent: false, features: ["8 repas/mois", "Menu complet", "Fidélité x1"] },
    { id: "plan-active", plan: "ACTIVE" as const, name: "Active", emoji: "💪", description: "Pour les sportifs et actifs", priceMonthly: 449, mealCredits: 14, includesJuice: true, includesSmoothie: false, includesNutritionAdvice: false, requiresStudent: false, features: ["14 repas/mois", "1 jus/semaine offert", "Fidélité x1.5", "File prioritaire"] },
    { id: "plan-premium", plan: "PREMIUM" as const, name: "Premium", emoji: "⭐", description: "L'expérience Healthy Bowl complète", priceMonthly: 699, mealCredits: 22, includesJuice: true, includesSmoothie: true, includesNutritionAdvice: true, requiresStudent: false, features: ["22 repas/mois", "Jus & smoothies illimités", "Fidélité x2", "Conseils nutri mensuels", "Bowl exclusif mensuel"] },
    { id: "plan-etudiant", plan: "ETUDIANT" as const, name: "Étudiant", emoji: "🎓", description: "Tarif spécial carte étudiante validée", priceMonthly: 199, mealCredits: 10, includesJuice: false, includesSmoothie: false, includesNutritionAdvice: false, requiresStudent: true, features: ["10 repas/mois", "Tarif étudiant -33%", "Fidélité x1"] },
  ]

  for (const plan of plans) {
    await prisma.subscriptionPlanConfig.upsert({
      where: { plan: plan.plan },
      update: {},
      create: plan,
    })
  }
  console.log(`✅ ${plans.length} subscription plans created`)

  // ── Demo Users ─────────────────────────────────────────────
  const password = await bcrypt.hash("HealthyBowl123!", 12)

  const users = [
    { id: "user-admin", email: "admin@healthybowl.ma", name: "Admin Healthy Bowl", role: "ADMIN" as const, isStudent: false },
    { id: "user-manager", email: "manager@healthybowl.ma", name: "Sarah El Mansouri", role: "MANAGER" as const, isStudent: false },
    { id: "user-staff", email: "staff@healthybowl.ma", name: "Mohamed Alaoui", role: "STAFF" as const, isStudent: false },
    { id: "user-client", email: "client@example.com", name: "Leila Benali", role: "CUSTOMER" as const, isStudent: false },
    { id: "user-etudiant", email: "etudiant@example.com", name: "Yassine Kadiri", role: "CUSTOMER" as const, isStudent: true },
  ]

  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, passwordHash: password },
    })

    // Loyalty account for customers
    if (user.role === "CUSTOMER") {
      await prisma.loyaltyAccount.upsert({
        where: { userId: created.id },
        update: {},
        create: { userId: created.id, points: user.id === "user-client" ? 150 : 0, lifetime: user.id === "user-client" ? 150 : 0 },
      })

      await prisma.dietaryProfile.upsert({
        where: { userId: created.id },
        update: {},
        create: {
          userId: created.id,
          goal: user.id === "user-client" ? "MAINTIEN" : "ENERGIE",
          defaultPortion: "MEDIUM",
          sauceFatLevel: "MEDIUM",
        },
      })
    }

    // Staff profile
    if (["STAFF", "MANAGER"].includes(user.role)) {
      await prisma.staffMember.upsert({
        where: { userId: created.id },
        update: {},
        create: { userId: created.id, locationId: "loc-marrakech-campus", haccpTrained: true, haccpTrainedAt: new Date("2024-01-15") },
      })
    }
  }
  console.log(`✅ ${users.length} users created`)

  // ── Partners ───────────────────────────────────────────────
  await prisma.partner.upsert({
    where: { id: "partner-gym" },
    update: {},
    create: {
      id: "partner-gym",
      type: "GYM",
      name: "Atlas Fitness Marrakech",
      logo: "🏋️",
      website: "https://atlasfitness.ma",
      crossLoyalty: true,
      description: "Salle de sport partenaire — -10% sur votre abonnement HB avec votre carte membre Atlas.",
      isActive: true,
    },
  })

  await prisma.partner.upsert({
    where: { id: "partner-univ" },
    update: {},
    create: {
      id: "partner-univ",
      type: "UNIVERSITY",
      name: "Université Cadi Ayyad",
      logo: "🎓",
      website: "https://uca.ac.ma",
      crossLoyalty: false,
      description: "Partenaire université — plan Étudiant accessible à tous les étudiants UCA vérifiés.",
      isActive: true,
    },
  })
  console.log("✅ 2 partners created")

  // ── Promo Code ─────────────────────────────────────────────
  const validFrom = new Date()
  const validTo = new Date()
  validTo.setMonth(validTo.getMonth() + 12)

  await prisma.promo.upsert({
    where: { code: "WELCOME20" },
    update: {},
    create: {
      code: "WELCOME20",
      type: "PERCENT",
      value: 20,
      validFrom,
      validTo,
      maxUses: 1000,
      isActive: true,
      conditions: { minOrder: 40 },
    },
  })

  await prisma.promo.upsert({
    where: { code: "ETUDIANT15" },
    update: {},
    create: {
      code: "ETUDIANT15",
      type: "PERCENT",
      value: 15,
      validFrom,
      validTo,
      maxUses: 500,
      isActive: true,
      conditions: { requiresStudent: true },
    },
  })
  console.log("✅ 2 promo codes created (WELCOME20, ETUDIANT15)")

  console.log("\n🎉 Seed completed successfully!")
  console.log("\nDemo accounts (password: HealthyBowl123!):")
  console.log("  admin@healthybowl.ma (ADMIN)")
  console.log("  manager@healthybowl.ma (MANAGER)")
  console.log("  staff@healthybowl.ma (STAFF)")
  console.log("  client@example.com (CUSTOMER)")
  console.log("  etudiant@example.com (CUSTOMER étudiant)")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
