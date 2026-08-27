import type { Category } from "../types/product";

export const CATEGORIES: Category[] = [
  { id: "fruits-vegetables", name: "Fresh Fruits & Vegetable", color: "#e8f6ea" },
  { id: "cooking-oil-ghee", name: "Cooking Oil & Ghee", color: "#fdf3e3" },
  { id: "meat-fish", name: "Meat & Fish", color: "#fbe9e9" },
  { id: "bakery-snacks", name: "Bakery & Snacks", color: "#f3e9fb" },
  { id: "beverages", name: "Beverages", color: "#e3f1fd" },
  { id: "eggs-dairy", name: "Eggs & Dairy", color: "#fdf6df" },
  { id: "noodles-pasta", name: "Noodles & Pasta", color: "#fdece3" },
  { id: "chips-crisps", name: "Chips & Crisps", color: "#f9f0d9" },
  { id: "fast-food", name: "Fast Food", color: "#fde3ea" },
];

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}
