import { cn } from "@/lib/utils";

const DIET_BADGES = {
  vegan: { label: "🌱 Vegan", className: "badge-vegan" },
  "gluten-free": { label: "🚫🌾 Sans Gluten", className: "badge-gluten-free" },
  "high-protein": { label: "💪 Riche en Protéines", className: "badge-high-protein" },
  veggie: { label: "🥗 Végétarien", className: "badge-veggie" },
} as const;

type DietBadgeKey = keyof typeof DIET_BADGES;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | DietBadgeKey;
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const dietBadge = variant in DIET_BADGES ? DIET_BADGES[variant as DietBadgeKey] : null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-brand-light text-brand-green",
        variant === "outline" && "border border-brand-green text-brand-green",
        dietBadge && dietBadge.className,
        className
      )}
      {...props}
    >
      {dietBadge ? dietBadge.label : children}
    </span>
  );
}

export function DietBadges({
  isVegan,
  isGlutenFree,
  isHighProtein,
  isVeggie,
}: {
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isHighProtein?: boolean;
  isVeggie?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {isVegan && <Badge variant="vegan" />}
      {isGlutenFree && <Badge variant="gluten-free" />}
      {isHighProtein && <Badge variant="high-protein" />}
      {isVeggie && !isVegan && <Badge variant="veggie" />}
    </div>
  );
}
