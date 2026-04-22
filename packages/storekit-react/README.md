# @bakuure/storekit-react

React hooks and headless UI components for the bakuure commerce API.

- Works with Next.js App Router (Server + Client components)
- CSS custom properties for theming — no Tailwind dependency
- Fully typed props

## Install

```bash
npm install @bakuure/storekit-core @bakuure/storekit-react
```

## Usage

```tsx
import { StorekitProvider, ProductList, useCart, CartDrawer } from "@bakuure/storekit-react"

export function Shop() {
  const { cart, createCart, addItem } = useCart()

  return (
    <StorekitProvider config={{ tenantId: "tn_...", apiBaseUrl: "...", apiKey: "..." }}>
      <ProductList
        options={{ limit: 20 }}
        renderProduct={(product) => (
          <div>
            <h3>{product.name}</h3>
            <button onClick={async () => {
              const c = cart ?? await createCart()
              await addItem(product.id, 1)
            }}>
              Add to Cart
            </button>
          </div>
        )}
      />
    </StorekitProvider>
  )
}
```

See the [root README](../../README.md) for full API reference.
