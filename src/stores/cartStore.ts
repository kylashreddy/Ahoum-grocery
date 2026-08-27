import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";
import { PRODUCTS } from "../mocks/products";

export interface CartLine {
  productId: string;
  quantity: number;
  /** Price captured at add-to-cart time; reconciled against live data on load. */
  priceAtAdd: number;
}

export interface CartReconciliationNote {
  productId: string;
  productName: string;
  kind: "removed" | "price-changed" | "quantity-clamped";
  detail: string;
}

interface CartState {
  lines: CartLine[];
  /** Notes surfaced to the user after reconciling a persisted cart against live data. */
  lastReconciliation: CartReconciliationNote[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  reconcile: () => void;
  dismissReconciliation: () => void;
}

const MAX_QUANTITY_PER_ITEM = 20;

/**
 * Reconciles a persisted cart line against the live product catalogue.
 * Encodes the three cases required by engineering challenge B:
 *  - product no longer exists            -> drop the line
 *  - persisted price differs from live   -> adopt the live price, note it
 *  - quantity is zero / above stock      -> clamp into [1, stock] or drop
 * Returns the corrected line (or null if it should be dropped) plus a note
 * for the user when something changed. Kept pure so it can be unit tested.
 */
export function reconcileLine(
  line: CartLine,
): { line: CartLine | null; note: CartReconciliationNote | null } {
  const product = PRODUCTS.find((p) => p.id === line.productId);

  if (!product) {
    return {
      line: null,
      note: {
        productId: line.productId,
        productName: line.productId,
        kind: "removed",
        detail: "No longer available and was removed from your cart.",
      },
    };
  }

  if (product.stock <= 0) {
    return {
      line: null,
      note: {
        productId: product.id,
        productName: product.name,
        kind: "removed",
        detail: "Out of stock and was removed from your cart.",
      },
    };
  }

  const cappedQuantity = Math.min(line.quantity, product.stock, MAX_QUANTITY_PER_ITEM);
  const safeQuantity = Math.max(cappedQuantity, 0);

  if (safeQuantity <= 0) {
    return {
      line: null,
      note: {
        productId: product.id,
        productName: product.name,
        kind: "removed",
        detail: "Quantity was invalid and the item was removed.",
      },
    };
  }

  const notes: string[] = [];
  if (safeQuantity !== line.quantity) {
    notes.push(`quantity adjusted from ${line.quantity} to ${safeQuantity} (stock limit)`);
  }
  if (product.price !== line.priceAtAdd) {
    notes.push(`price updated from $${line.priceAtAdd.toFixed(2)} to $${product.price.toFixed(2)}`);
  }

  return {
    line: { productId: product.id, quantity: safeQuantity, priceAtAdd: product.price },
    note:
      notes.length > 0
        ? { productId: product.id, productName: product.name, kind: notes[0]?.startsWith("price") ? "price-changed" : "quantity-clamped", detail: notes.join("; ") }
        : null,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      lastReconciliation: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, product.stock, MAX_QUANTITY_PER_ITEM);
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id ? { ...l, quantity: nextQty, priceAtAdd: product.price } : l,
              ),
            };
          }
          const qty = Math.min(quantity, product.stock, MAX_QUANTITY_PER_ITEM);
          if (qty <= 0) return state;
          return { lines: [...state.lines, { productId: product.id, quantity: qty, priceAtAdd: product.price }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) }));
      },

      setQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { lines: state.lines.filter((l) => l.productId !== productId) };
          }
          return {
            lines: state.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
          };
        });
      },

      clear: () => set({ lines: [], lastReconciliation: [] }),

      reconcile: () => {
        const { lines } = get();
        const nextLines: CartLine[] = [];
        const notes: CartReconciliationNote[] = [];
        for (const line of lines) {
          const { line: fixed, note } = reconcileLine(line);
          if (fixed) nextLines.push(fixed);
          if (note) notes.push(note);
        }
        set({ lines: nextLines, lastReconciliation: notes });
      },

      dismissReconciliation: () => set({ lastReconciliation: [] }),
    }),
    { name: "ahoum-cart" },
  ),
);
