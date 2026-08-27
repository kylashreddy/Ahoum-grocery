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
  // In-memory only (see `partialize`). Without this, StrictMode's double
  // effect call runs reconcile() twice, and the second call — finding
  // nothing left to fix — wipes the first call's notes. See DEBUGGING.md.
  hasReconciledThisSession: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  reconcile: () => void;
  dismissReconciliation: () => void;
}

export const MAX_QUANTITY_PER_ITEM = 20;

/** The single source of truth for "how many of this product can one cart line hold". */
export function maxAllowedQuantity(product: Product): number {
  return Math.min(product.stock, MAX_QUANTITY_PER_ITEM);
}

// Reconciles one persisted line against live data: missing product or
// zero stock -> drop; bad quantity -> clamp; stale price -> adopt live price.
// Pure so it's unit-testable without a store. See DECISIONS.md #3.
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

  const cappedQuantity = Math.min(line.quantity, maxAllowedQuantity(product));
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
      hasReconciledThisSession: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const cap = maxAllowedQuantity(product);
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, cap);
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id ? { ...l, quantity: nextQty, priceAtAdd: product.price } : l,
              ),
            };
          }
          const qty = Math.min(quantity, cap);
          if (qty <= 0) return state;
          return { lines: [...state.lines, { productId: product.id, quantity: qty, priceAtAdd: product.price }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) }));
      },

      setQuantity: (productId, quantity) => {
        // Enforces the same cap as addItem — it didn't used to. See DEBUGGING.md.
        set((state) => {
          if (quantity <= 0) {
            return { lines: state.lines.filter((l) => l.productId !== productId) };
          }
          const product = PRODUCTS.find((p) => p.id === productId);
          const safeQuantity = product ? Math.min(quantity, maxAllowedQuantity(product)) : quantity;
          return {
            lines: state.lines.map((l) => (l.productId === productId ? { ...l, quantity: safeQuantity } : l)),
          };
        });
      },

      clear: () => set({ lines: [], lastReconciliation: [] }),

      reconcile: () => {
        if (get().hasReconciledThisSession) return;
        const { lines } = get();
        const nextLines: CartLine[] = [];
        const notes: CartReconciliationNote[] = [];
        for (const line of lines) {
          const { line: fixed, note } = reconcileLine(line);
          if (fixed) nextLines.push(fixed);
          if (note) notes.push(note);
        }
        set({ lines: nextLines, lastReconciliation: notes, hasReconciledThisSession: true });
      },

      dismissReconciliation: () => set({ lastReconciliation: [] }),
    }),
    {
      name: "ahoum-cart",
      // Only `lines` is persisted: reconciliation notes and the in-session
      // guard above must not survive a reload, or they'd desync from it.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
