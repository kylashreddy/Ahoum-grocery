export type CategoryId =
  | "fruits-vegetables"
  | "cooking-oil-ghee"
  | "meat-fish"
  | "bakery-snacks"
  | "beverages"
  | "eggs-dairy"
  | "noodles-pasta"
  | "chips-crisps"
  | "fast-food";

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
}

// Exact brand names from the Figma Filters screen — kept verbatim for fidelity.
export type Brand =
  | "Individual Collection"
  | "Cocola"
  | "Ifad"
  | "Kazi Farmas";

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: CategoryId;
  brand: Brand;
  unit: string;
  price: number;
  image: string;
  stock: number;
  tags: string[];
}
