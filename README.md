# bakuure-storekit

Embeddable commerce SDK + React UI kit for the [bakuure](https://quantum-box.com) multi-tenant commerce API.

> **First production user**: The Wan Standard (TWS) storefront — a reference implementation of a fully-integrated bakuure storefront built with `@bakuure/storekit-react`.

## Packages

| Package | Description |
|---------|-------------|
| [`@bakuure/storekit-core`](./packages/storekit-core) | Framework-agnostic TypeScript SDK (fetch, no dependencies) |
| [`@bakuure/storekit-react`](./packages/storekit-react) | React hooks + headless-style UI components |

## Quick Start

### 1. Install

```bash
# npm
npm install @bakuure/storekit-core @bakuure/storekit-react

# pnpm
pnpm add @bakuure/storekit-core @bakuure/storekit-react
```

### 2. Initialize the client

```ts
import { createClient } from "@bakuure/storekit-core"

const client = createClient({
  tenantId: "tn_01hjryxysgey07h5jz5wagqj0m",   // your operator tenant ID
  apiBaseUrl: "https://api.bakuure.quantum-box.com", // bakuure-api URL (TBD — see note below)
  apiKey: "bk_live_...",                             // your bakuure API key (read scope)
})

// List products
const products = await client.products.list({ limit: 20 })

// Create a cart and add an item
const cart = await client.cart.create()
await client.cart.add(cart.id, products.items[0].id, 1)

// Checkout (creates a Stripe session if successUrl/cancelUrl are provided)
const order = await client.checkout.create({
  cartId: cart.id,
  successUrl: "https://your-site.com/success",
  cancelUrl: "https://your-site.com/cart",
})

if (order.checkoutUrl) {
  window.location.href = order.checkoutUrl  // redirect to Stripe Checkout
}
```

### 3. React integration

Wrap your app with `StorekitProvider`, then use the built-in hooks and components:

```tsx
import { StorekitProvider, ProductList, useCart, CartDrawer, CheckoutButton } from "@bakuure/storekit-react"

const storekitConfig = {
  tenantId: "tn_01hjryxysgey07h5jz5wagqj0m",
  apiBaseUrl: "https://api.bakuure.quantum-box.com",
  apiKey: process.env.NEXT_PUBLIC_BAKUURE_API_KEY!,
}

export default function App() {
  const { cart, createCart, addItem, removeItem } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <StorekitProvider config={storekitConfig}>
      {/* Product grid — renders default cards, or pass renderProduct for custom UI */}
      <ProductList
        options={{ limit: 20 }}
        renderProduct={(product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <button onClick={async () => {
              let c = cart
              if (!c) c = await createCart()
              await addItem(product.id, 1)
              setDrawerOpen(true)
            }}>
              Add to Cart
            </button>
          </div>
        )}
      />

      {/* Cart drawer */}
      <CartDrawer
        cart={cart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRemoveItem={removeItem}
        onCheckout={() => {/* see CheckoutButton below */}}
      />
    </StorekitProvider>
  )
}
```

## API Reference

### `@bakuure/storekit-core`

#### `createClient(config)` → `StorekitClient`

| Field | Type | Description |
|-------|------|-------------|
| `tenantId` | `string` | Your operator tenant ID (`tn_...`) |
| `apiBaseUrl` | `string` | bakuure-api base URL |
| `apiKey` | `string` | bakuure API key |

#### `client.products`

| Method | Description |
|--------|-------------|
| `list(options?)` | List products with optional filters |
| `get(productId)` | Get a single product |
| `listCategories()` | List product categories |

#### `client.cart`

| Method | Description |
|--------|-------------|
| `create(options?)` | Create a new cart |
| `get(cartId)` | Get cart by ID |
| `add(cartId, productId, quantity)` | Add item to cart |
| `update(cartId, itemId, quantity)` | Update item quantity |
| `remove(cartId, itemId)` | Remove item from cart |

#### `client.checkout`

| Method | Description |
|--------|-------------|
| `create(options)` | Create an order (optionally starts Stripe Checkout session) |

### `@bakuure/storekit-react`

| Export | Type | Description |
|--------|------|-------------|
| `StorekitProvider` | Component | Context provider — wrap your app |
| `useStorekitClient()` | Hook | Access the `StorekitClient` |
| `useProducts(options?)` | Hook | Fetch product list |
| `useProduct(productId)` | Hook | Fetch single product |
| `useCart(cartId?)` | Hook | Cart state + actions |
| `ProductList` | Component | Product grid with loading/error/empty states |
| `ProductDetail` | Component | Single product view with add-to-cart button |
| `CartDrawer` | Component | Slide-in cart panel |
| `CheckoutButton` | Component | Checkout trigger with Stripe redirect |

## Styling

All components use **CSS custom properties** for theming — no Tailwind dependency.

```css
:root {
  --storekit-accent: #3182ce;
  --storekit-btn-bg: #3182ce;
  --storekit-btn-text: #fff;
  --storekit-border-color: #e2e8f0;
  --storekit-radius: 8px;
  --storekit-radius-sm: 4px;
  --storekit-text-primary: #1a202c;
  --storekit-text-secondary: #718096;
  --storekit-surface: #fff;
  --storekit-card-min-width: 240px;
  --storekit-drawer-width: 400px;
  --storekit-spacing-md: 16px;
  --storekit-font-size-base: 1rem;
  --storekit-font-size-sm: 0.875rem;
  --storekit-font-size-lg: 1.25rem;
  --storekit-font-size-xl: 1.5rem;
}
```

Pass a `className` prop to each component for full CSS control.

## Authentication

> **Note**: The `apiKey` should have **read** scope for storefront browsing. For checkout (which creates orders), **write** scope may be required depending on your bakuure API key configuration.
>
> **Security**: Do not expose admin-scope keys in browser code. Read-scope keys are designed to be safely included in client-side bundles.
>
> The production API URL and full auth documentation are pending confirmation — see [PLT-761](https://linear.app/quantum-box/issue/PLT-761).

## Development

```bash
# Clone
git clone https://github.com/quantum-box/bakuure-storekit.git
cd bakuure-storekit

# Install (requires pnpm >= 9)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Typecheck
pnpm -r run typecheck
```

## License

MIT © [Quantum Box](https://quantum-box.com)
