import { formatMacro } from "@/lib/utils";

interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export function NutritionLabel({ macros }: { macros: Macros }) {
  return (
    <div className="nutrition-label text-sm bg-white">
      <div className="border-b-8 border-charcoal pb-1 mb-1">
        <p className="text-2xl font-black">Valeurs Nutritionnelles</p>
        <p className="text-xs">Pour 1 portion</p>
      </div>
      <div className="border-b-4 border-charcoal pb-1 mb-1">
        <div className="flex justify-between items-baseline">
          <span className="font-bold">Calories</span>
          <span className="text-3xl font-black">{Math.round(macros.kcal)}</span>
        </div>
      </div>
      <div className="space-y-0.5 text-xs border-b border-gray-300 pb-1">
        <MacroRow label="Protéines" value={formatMacro(macros.protein)} bold />
        <MacroRow label="Glucides" value={formatMacro(macros.carbs)} bold />
        {macros.fiber !== undefined && (
          <MacroRow label="  dont Fibres" value={formatMacro(macros.fiber)} indent />
        )}
        <MacroRow label="Lipides" value={formatMacro(macros.fat)} bold />
      </div>
      <p className="text-xs mt-1 text-gray-500">
        * % des apports journaliers de référence
      </p>
    </div>
  );
}

function MacroRow({
  label,
  value,
  bold,
  indent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  indent?: boolean;
}) {
  return (
    <div className={`flex justify-between ${indent ? "pl-3" : ""}`}>
      <span className={bold ? "font-bold" : ""}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function MacroBar({ macros }: { macros: Macros }) {
  const total = macros.protein + macros.carbs + macros.fat;
  const pP = total > 0 ? (macros.protein / total) * 100 : 33;
  const pC = total > 0 ? (macros.carbs / total) * 100 : 34;
  const pF = total > 0 ? (macros.fat / total) * 100 : 33;

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-3 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 transition-all"
          style={{ width: `${pP}%` }}
          title={`Protéines: ${Math.round(macros.protein)}g`}
        />
        <div
          className="bg-orange-400 transition-all"
          style={{ width: `${pC}%` }}
          title={`Glucides: ${Math.round(macros.carbs)}g`}
        />
        <div
          className="bg-yellow-400 transition-all"
          style={{ width: `${pF}%` }}
          title={`Lipides: ${Math.round(macros.fat)}g`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          P: {Math.round(macros.protein)}g
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          G: {Math.round(macros.carbs)}g
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
          L: {Math.round(macros.fat)}g
        </span>
        <span className="font-semibold text-charcoal">
          {Math.round(macros.kcal)} kcal
        </span>
      </div>
    </div>
  );
}
