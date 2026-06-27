"use client"

import { useCart } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Item {
  id: string
  name: string
  price: number
  menuItemId: string
  macros: { kcal: number; protein: number; carbs: number; fat: number }
}

export default function AddToCartButton({ item }: { item: Item }) {
  const { dispatch } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    dispatch({
      type: "ADD_ITEM",
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        menuItemId: item.menuItemId,
        macros: item.macros,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button size="lg" onClick={handleAdd} className="flex-1">
      {added ? "✓ Ajouté au panier" : "Commander →"}
    </Button>
  )
}
