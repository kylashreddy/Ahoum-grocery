import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore, MAX_QUANTITY_PER_ITEM } from "../stores/cartStore";
import { PRODUCTS } from "../mocks/products";

const highStockProduct = PRODUCTS.find((p) => p.stock > MAX_QUANTITY_PER_ITEM);
if (!highStockProduct) throw new Error("Expected a fixture product with stock above the per-item cap.");

beforeEach(() => {
  useCartStore.setState({ lines: [], lastReconciliation: [], hasReconciledThisSession: false });
});

describe("cart quantity cap (regression: setQuantity used to bypass MAX_QUANTITY_PER_ITEM)", () => {
  it("caps addItem at MAX_QUANTITY_PER_ITEM even when stock is higher", () => {
    useCartStore.getState().addItem(highStockProduct, MAX_QUANTITY_PER_ITEM + 50);
    const line = useCartStore.getState().lines.find((l) => l.productId === highStockProduct.id);
    expect(line?.quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it("also caps setQuantity at MAX_QUANTITY_PER_ITEM for the same product (previously it did not)", () => {
    useCartStore.getState().addItem(highStockProduct, 1);
    useCartStore.getState().setQuantity(highStockProduct.id, MAX_QUANTITY_PER_ITEM + 50);
    const line = useCartStore.getState().lines.find((l) => l.productId === highStockProduct.id);
    expect(line?.quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  it("setQuantity still removes the line when set to zero", () => {
    useCartStore.getState().addItem(highStockProduct, 1);
    useCartStore.getState().setQuantity(highStockProduct.id, 0);
    expect(useCartStore.getState().lines).toHaveLength(0);
  });
});
