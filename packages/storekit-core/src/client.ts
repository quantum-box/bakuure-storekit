import type { StorekitConfig } from "./types.js";
import { createCartClient } from "./cart.js";
import { createCheckoutClient } from "./checkout.js";
import { createProductsClient } from "./products.js";

export interface StorekitClient {
  products: ReturnType<typeof createProductsClient>;
  cart: ReturnType<typeof createCartClient>;
  checkout: ReturnType<typeof createCheckoutClient>;
}

/**
 * Create a bakuure storekit client.
 *
 * @example
 * ```ts
 * import { createClient } from "@bakuure/storekit-core"
 *
 * const client = createClient({
 *   tenantId: "tn_01hjryxysgey07h5jz5wagqj0m",
 *   apiBaseUrl: "https://api.bakuure.quantum-box.com",
 *   apiKey: "bk_live_...",
 * })
 *
 * const products = await client.products.list({ limit: 20 })
 * const cart = await client.cart.create()
 * await client.cart.add(cart.id, products.items[0].id, 1)
 * const order = await client.checkout.create({
 *   cartId: cart.id,
 *   successUrl: "https://your-site.com/success",
 *   cancelUrl: "https://your-site.com/cart",
 * })
 * ```
 */
export function createClient(config: StorekitConfig): StorekitClient {
  return {
    products: createProductsClient(config),
    cart: createCartClient(config),
    checkout: createCheckoutClient(config),
  };
}
