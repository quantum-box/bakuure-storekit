import type { CheckoutOptions, Order, StorekitConfig } from "./types.js";
import { CHECKOUT_MUTATION } from "./gql.js";
import { gqlRequest } from "./http.js";

export function createCheckoutClient(config: StorekitConfig) {
  return {
    async create(options: CheckoutOptions): Promise<Order> {
      const data = await gqlRequest<{ checkout: Order }>(
        config,
        CHECKOUT_MUTATION,
        { input: options },
      );
      return data.checkout;
    },
  };
}
