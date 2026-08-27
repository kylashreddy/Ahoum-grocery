import type { Product } from "../types/product";
import { placeholderImage } from "../lib/placeholderImage";

const img = placeholderImage;

export const PRODUCTS: Product[] = [
  // Fresh Fruits & Vegetable
  { id: "p-apple-red", name: "Natural Red Apple", description: "Crisp, sweet red apples picked at peak ripeness.", categoryId: "fruits-vegetables", brand: "Individual Collection", unit: "1 kg", price: 6.99, image: img("🍎", "#e8f6ea"), stock: 42, tags: ["fresh", "fruit"] },
  { id: "p-banana-organic", name: "Organic Bananas", description: "Naturally ripened organic bananas.", categoryId: "fruits-vegetables", brand: "Osaria", unit: "1 dozen", price: 3.0, image: img("🍌", "#e8f6ea"), stock: 60, tags: ["fresh", "fruit", "organic"] },
  { id: "p-ginger", name: "Fresh Ginger", description: "Aromatic ginger root, great for tea and cooking.", categoryId: "fruits-vegetables", brand: "Rald", unit: "250 g", price: 2.99, image: img("🫚", "#e8f6ea"), stock: 30, tags: ["fresh"] },
  { id: "p-bell-pepper-red", name: "Bell Pepper Red", description: "Sweet and crunchy red bell peppers.", categoryId: "fruits-vegetables", brand: "Individual Collection", unit: "500 g", price: 4.99, image: img("🫑", "#e8f6ea"), stock: 25, tags: ["fresh", "vegetable"] },
  { id: "p-carrot", name: "Carrots", description: "Farm-fresh carrots, great for snacking or cooking.", categoryId: "fruits-vegetables", brand: "Osaria", unit: "1 kg", price: 2.49, image: img("🥕", "#e8f6ea"), stock: 55, tags: ["fresh", "vegetable"] },
  { id: "p-avocado", name: "Avocado", description: "Creamy Hass avocados, ready to eat.", categoryId: "fruits-vegetables", brand: "Rald", unit: "2 pcs", price: 5.49, image: img("🥑", "#e8f6ea"), stock: 18, tags: ["fresh", "fruit"] },

  // Cooking Oil & Ghee
  { id: "p-sunflower-oil", name: "Sunflower Cooking Oil", description: "Light, all-purpose sunflower oil.", categoryId: "cooking-oil-ghee", brand: "Individual Collection", unit: "1 L", price: 8.49, image: img("🛢️", "#fdf3e3"), stock: 40, tags: ["pantry"] },
  { id: "p-ghee", name: "Pure Desi Ghee", description: "Traditional clarified butter, slow-cooked.", categoryId: "cooking-oil-ghee", brand: "Osaria", unit: "500 ml", price: 12.99, image: img("🧈", "#fdf3e3"), stock: 20, tags: ["pantry"] },
  { id: "p-olive-oil", name: "Extra Virgin Olive Oil", description: "Cold-pressed, single-origin olive oil.", categoryId: "cooking-oil-ghee", brand: "Rald", unit: "500 ml", price: 14.99, image: img("🫒", "#fdf3e3"), stock: 0, tags: ["pantry"] },

  // Meat & Fish
  { id: "p-chicken-red", name: "Egg Chicken Red", description: "Free-range chicken eggs, farm sourced.", categoryId: "eggs-dairy", brand: "Individual Collection", unit: "12 pcs", price: 1.99, image: img("🥚", "#fdf6df"), stock: 70, tags: ["eggs"] },
  { id: "p-chicken-white", name: "Egg Chicken White", description: "White shell eggs, protein-rich.", categoryId: "eggs-dairy", brand: "Osaria", unit: "12 pcs", price: 1.5, image: img("🥚", "#fdf6df"), stock: 65, tags: ["eggs"] },
  { id: "p-salmon", name: "Fresh Salmon Fillet", description: "Wild-caught salmon, ready to cook.", categoryId: "meat-fish", brand: "Rald", unit: "500 g", price: 16.99, image: img("🐟", "#fbe9e9"), stock: 12, tags: ["fresh", "seafood"] },
  { id: "p-chicken-breast", name: "Chicken Breast Fillet", description: "Boneless, skinless chicken breast.", categoryId: "meat-fish", brand: "Individual Collection", unit: "1 kg", price: 9.99, image: img("🍗", "#fbe9e9"), stock: 22, tags: ["fresh", "meat"] },
  { id: "p-shrimp", name: "Jumbo Shrimp", description: "Peeled and deveined jumbo shrimp.", categoryId: "meat-fish", brand: "Kid Famous", unit: "400 g", price: 13.49, image: img("🍤", "#fbe9e9"), stock: 8, tags: ["fresh", "seafood"] },

  // Bakery & Snacks
  { id: "p-sourdough", name: "Sourdough Loaf", description: "Naturally leavened, crusty sourdough bread.", categoryId: "bakery-snacks", brand: "Osaria", unit: "1 loaf", price: 5.99, image: img("🍞", "#f3e9fb"), stock: 15, tags: ["bakery"] },
  { id: "p-croissant", name: "Butter Croissants", description: "Flaky, buttery croissants, pack of 4.", categoryId: "bakery-snacks", brand: "Rald", unit: "4 pcs", price: 6.49, image: img("🥐", "#f3e9fb"), stock: 20, tags: ["bakery"] },
  { id: "p-cookies", name: "Oatmeal Cookies", description: "Chewy oatmeal raisin cookies.", categoryId: "bakery-snacks", brand: "Kid Famous", unit: "300 g", price: 4.25, image: img("🍪", "#f3e9fb"), stock: 33, tags: ["snacks"] },

  // Beverages
  { id: "p-diet-cola", name: "Diet Cola", description: "Zero sugar cola, classic taste.", categoryId: "beverages", brand: "Individual Collection", unit: "330 ml", price: 1.99, image: img("🥤", "#e3f1fd"), stock: 90, tags: ["drinks"] },
  { id: "p-sprite-can", name: "Sprite Can", description: "Crisp lemon-lime soda.", categoryId: "beverages", brand: "Osaria", unit: "330 ml", price: 1.5, image: img("🥤", "#e3f1fd"), stock: 88, tags: ["drinks"] },
  { id: "p-apple-grape-juice", name: "Apple & Grape Juice", description: "100% pressed fruit juice, no added sugar.", categoryId: "beverages", brand: "Rald", unit: "1 L", price: 15.99, image: img("🧃", "#e3f1fd"), stock: 27, tags: ["drinks", "juice"] },
  { id: "p-orange-juice", name: "Orange Juice", description: "Freshly squeezed orange juice.", categoryId: "beverages", brand: "Kid Famous", unit: "1 L", price: 15.99, image: img("🍊", "#e3f1fd"), stock: 3, tags: ["drinks", "juice"] },
  { id: "p-sparkling-water", name: "Sparkling Water", description: "Naturally carbonated mineral water.", categoryId: "beverages", brand: "Individual Collection", unit: "1 L", price: 2.29, image: img("💧", "#e3f1fd"), stock: 50, tags: ["drinks"] },

  // Noodles & Pasta
  { id: "p-egg-noodles", name: "Egg Noodles", description: "Springy egg noodles, ready in 3 minutes.", categoryId: "noodles-pasta", brand: "Osaria", unit: "1 L pack", price: 15.99, image: img("🍜", "#fdece3"), stock: 24, tags: ["pantry", "noodles"] },
  { id: "p-spaghetti", name: "Spaghetti Pasta", description: "Durum wheat spaghetti, al dente every time.", categoryId: "noodles-pasta", brand: "Individual Collection", unit: "500 g", price: 3.49, image: img("🍝", "#fdece3"), stock: 44, tags: ["pantry", "pasta"] },
  { id: "p-instant-ramen", name: "Instant Ramen Pack", description: "Rich miso-flavoured instant ramen, pack of 5.", categoryId: "noodles-pasta", brand: "Rald", unit: "5 pack", price: 6.99, image: img("🍲", "#fdece3"), stock: 36, tags: ["pantry", "noodles"] },

  // Chips & Crisps
  { id: "p-potato-chips", name: "Sea Salt Potato Chips", description: "Kettle-cooked chips with sea salt.", categoryId: "chips-crisps", brand: "Kid Famous", unit: "150 g", price: 2.79, image: img("🥔", "#f9f0d9"), stock: 60, tags: ["snacks"] },
  { id: "p-tortilla-chips", name: "Tortilla Chips", description: "Crunchy corn tortilla chips.", categoryId: "chips-crisps", brand: "Rald", unit: "200 g", price: 3.19, image: img("🌽", "#f9f0d9"), stock: 48, tags: ["snacks"] },
  { id: "p-veggie-crisps", name: "Mixed Veggie Crisps", description: "Beetroot, carrot and parsnip crisps.", categoryId: "chips-crisps", brand: "Osaria", unit: "120 g", price: 3.49, image: img("🥬", "#f9f0d9"), stock: 0, tags: ["snacks"] },

  // Fast Food (ready-to-eat)
  { id: "p-veg-burger-patty", name: "Veg Burger Patty", description: "Plant-based patties, pack of 4, ready to grill.", categoryId: "fast-food", brand: "Individual Collection", unit: "4 pcs", price: 7.99, image: img("🍔", "#fde3ea"), stock: 16, tags: ["frozen", "ready-to-eat"] },
  { id: "p-chicken-nuggets", name: "Chicken Nuggets", description: "Crispy breaded chicken nuggets, oven-ready.", categoryId: "fast-food", brand: "Kid Famous", unit: "500 g", price: 6.49, image: img("🍗", "#fde3ea"), stock: 21, tags: ["frozen", "ready-to-eat"] },
  { id: "p-frozen-fries", name: "Frozen French Fries", description: "Golden, crispy straight-cut fries.", categoryId: "fast-food", brand: "Osaria", unit: "1 kg", price: 4.49, image: img("🍟", "#fde3ea"), stock: 39, tags: ["frozen"] },

  // Eggs & Dairy (more)
  { id: "p-milk", name: "Whole Milk", description: "Fresh pasteurised whole milk.", categoryId: "eggs-dairy", brand: "Rald", unit: "1 L", price: 2.19, image: img("🥛", "#fdf6df"), stock: 54, tags: ["dairy"] },
  { id: "p-cheddar", name: "Aged Cheddar Cheese", description: "Sharp, aged cheddar block.", categoryId: "eggs-dairy", brand: "Individual Collection", unit: "250 g", price: 5.29, image: img("🧀", "#fdf6df"), stock: 19, tags: ["dairy"] },
  { id: "p-yogurt", name: "Greek Yogurt", description: "Thick and creamy natural Greek yogurt.", categoryId: "eggs-dairy", brand: "Osaria", unit: "500 g", price: 3.79, image: img("🥣", "#fdf6df"), stock: 28, tags: ["dairy"] },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
