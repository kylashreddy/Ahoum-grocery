import type { Category } from "../types/product";
import { categoryHeroImage } from "../lib/placeholderImage";

export const CATEGORIES: Category[] = [
  { id: "fruits-vegetables", name: "Fresh Fruits & Vegetable", color: "#e8f6ea", image: categoryHeroImage("🥦", "#eafaf0", "#8fdb9e") },
  { id: "cooking-oil-ghee", name: "Cooking Oil & Ghee", color: "#fdf3e3", image: categoryHeroImage("🛢️", "#fff6e0", "#f3c969") },
  { id: "meat-fish", name: "Meat & Fish", color: "#fbe9e9", image: categoryHeroImage("🥩", "#ffe9ea", "#ff9aa2") },
  { id: "bakery-snacks", name: "Bakery & Snacks", color: "#f3e9fb", image: categoryHeroImage("🥐", "#f3e8fb", "#c9a2e8") },
  { id: "beverages", name: "Beverages", color: "#e3f1fd", image: categoryHeroImage("🥤", "#e3f1fd", "#7ec8f7") },
  { id: "eggs-dairy", name: "Eggs & Dairy", color: "#fdf6df", image: categoryHeroImage("🥚", "#fff8e1", "#ffd76e") },
  { id: "noodles-pasta", name: "Noodles & Pasta", color: "#fdece3", image: categoryHeroImage("🍜", "#fdece3", "#f7a878") },
  { id: "chips-crisps", name: "Chips & Crisps", color: "#f9f0d9", image: categoryHeroImage("🍟", "#f9f0d9", "#e8c15c") },
  { id: "fast-food", name: "Fast Food", color: "#fde3ea", image: categoryHeroImage("🍔", "#fde3ea", "#ff7a92") },
];

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}
