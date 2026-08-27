import type { Brand, CategoryId } from "../types/product";

const BRANDS: Brand[] = ["Individual Collection", "Cocola", "Ifad", "Kazi Farmas"];

// The exact four category checkboxes shown on the Figma Filters screen.
const FILTERABLE_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "eggs-dairy", label: "Eggs" },
  { id: "noodles-pasta", label: "Noodles & Pasta" },
  { id: "chips-crisps", label: "Chips & Crisps" },
  { id: "fast-food", label: "Fast Food" },
];

interface FiltersPanelProps {
  selectedCategories: CategoryId[];
  onToggleCategory: (categoryId: CategoryId) => void;
  selectedBrands: Brand[];
  onToggleBrand: (brand: Brand) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  onClear: () => void;
}

export function FiltersPanel({
  selectedCategories,
  onToggleCategory,
  selectedBrands,
  onToggleBrand,
  inStockOnly,
  onToggleInStockOnly,
  onClear,
}: FiltersPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Categories</h3>
        <div className="flex flex-col gap-2.5">
          {FILTERABLE_CATEGORIES.map(({ id, label }) => (
            <label key={id} className="flex items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={selectedCategories.includes(id)}
                onChange={() => onToggleCategory(id)}
                className="h-4 w-4 rounded border-black/20 text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Brand</h3>
        <div className="flex flex-col gap-2.5">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onToggleBrand(brand)}
                className="h-4 w-4 rounded border-black/20 text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Availability</h3>
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onToggleInStockOnly}
            className="h-4 w-4 rounded border-black/20 text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500"
          />
          In stock only
        </label>
      </div>

      <button type="button" onClick={onClear} className="self-start text-sm font-medium text-brand-600 hover:underline">
        Clear all filters
      </button>
    </div>
  );
}
