import { describe, expect, it } from "vitest";
import { reconcileLine, type CartLine } from "../stores/cartStore";
import { PRODUCTS } from "../mocks/products";

const live = PRODUCTS[0];
if (!live) throw new Error("Expected at least one mock product for tests.");

describe("reconcileLine (engineering challenge B: persisted cart consistency)", () => {
  it("drops a line whose product no longer exists in the dataset", () => {
    const line: CartLine = { productId: "does-not-exist", quantity: 2, priceAtAdd: 9.99 };
    const { line: result, note } = reconcileLine(line);
    expect(result).toBeNull();
    expect(note?.kind).toBe("removed");
  });

  it("adopts the live price when the persisted price is stale", () => {
    const staleLine: CartLine = { productId: live.id, quantity: 1, priceAtAdd: live.price + 5 };
    const { line: result, note } = reconcileLine(staleLine);
    expect(result?.priceAtAdd).toBe(live.price);
    expect(note?.kind).toBe("price-changed");
  });

  it("clamps a quantity above the current stock (and the max-per-item cap) down to the lower bound", () => {
    const overLine: CartLine = { productId: live.id, quantity: live.stock + 50, priceAtAdd: live.price };
    const { line: result } = reconcileLine(overLine);
    expect(result?.quantity).toBe(Math.min(live.stock, 20));
    expect(result?.quantity).toBeLessThan(overLine.quantity);
  });

  it("drops a line whose quantity has become zero", () => {
    const zeroLine: CartLine = { productId: live.id, quantity: 0, priceAtAdd: live.price };
    const { line: result, note } = reconcileLine(zeroLine);
    expect(result).toBeNull();
    expect(note?.kind).toBe("removed");
  });

  it("drops a line for a product that is now out of stock", () => {
    const outOfStock = PRODUCTS.find((p) => p.stock === 0);
    if (!outOfStock) throw new Error("Expected a fixture product with zero stock.");
    const line: CartLine = { productId: outOfStock.id, quantity: 1, priceAtAdd: outOfStock.price };
    const { line: result, note } = reconcileLine(line);
    expect(result).toBeNull();
    expect(note?.detail).toMatch(/out of stock/i);
  });

  it("leaves an untouched, valid line unchanged (no note)", () => {
    const validLine: CartLine = { productId: live.id, quantity: 1, priceAtAdd: live.price };
    const { line: result, note } = reconcileLine(validLine);
    expect(result).toEqual(validLine);
    expect(note).toBeNull();
  });
});
