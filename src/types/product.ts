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

export type Brand =
  | "Individual Collection"
  | "Osaria"
  | "Rald"
  | "Kid Famous";

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
