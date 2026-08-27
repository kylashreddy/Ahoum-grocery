import { ApiError, simulateNetwork } from "./client";

export interface CheckoutResult {
  orderId: string;
}

// Fails ~25% of the time so both checkout outcomes are easy to hit. See DECISIONS.md #4.
export async function placeOrder(total: number): Promise<CheckoutResult> {
  try {
    return await simulateNetwork(
      () => ({ orderId: `AH-${Math.floor(total * 100)}-${Math.floor(Math.random() * 9000 + 1000)}` }),
      { failRate: 0.25 },
    );
  } catch {
    throw new ApiError("We couldn't place your order. Your cart has been kept — please try again.");
  }
}
