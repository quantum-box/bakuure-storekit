# @bakuure/storekit-core

Framework-agnostic TypeScript SDK for the bakuure commerce API.

- Zero runtime dependencies (uses `fetch`)
- Works in browser, Node.js, Edge runtimes, Deno
- Full TypeScript types

## Install

```bash
npm install @bakuure/storekit-core
```

## Usage

```ts
import { createClient } from "@bakuure/storekit-core"

const client = createClient({
  tenantId: "tn_01hjryxysgey07h5jz5wagqj0m",
  apiBaseUrl: "https://api.bakuure.quantum-box.com",
  apiKey: "bk_live_...",
})

const products = await client.products.list({ limit: 20 })
const cart = await client.cart.create()
await client.cart.add(cart.id, products.items[0].id, 1)
const order = await client.checkout.create({
  cartId: cart.id,
  successUrl: "https://your-site.com/success",
  cancelUrl: "https://your-site.com/cart",
})
```

See the [root README](../../README.md) for full API reference.
