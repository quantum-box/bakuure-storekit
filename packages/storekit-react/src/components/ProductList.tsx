"use client";

import type { Product, ProductListOptions } from "@bakuure/storekit-core";
import type { ReactNode } from "react";
import { useProducts } from "../hooks.js";

export interface ProductListProps {
  options?: ProductListOptions;
  /**
   * Render a single product card. Receives a product and whether
   * the add-to-cart action is in progress.
   */
  renderProduct?: (product: Product) => ReactNode;
  /** Shown while loading */
  loadingFallback?: ReactNode;
  /** Shown on error */
  errorFallback?: (error: Error) => ReactNode;
  /** Shown when list is empty */
  emptyFallback?: ReactNode;
  className?: string;
}

function DefaultProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        border: "1px solid var(--storekit-border-color, #e2e8f0)",
        borderRadius: "var(--storekit-radius, 8px)",
        padding: "var(--storekit-spacing-md, 16px)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {product.imageIds.length > 0 && (
        <div
          style={{
            aspectRatio: "1 / 1",
            background: "var(--storekit-image-bg, #f7fafc)",
            borderRadius: "var(--storekit-radius-sm, 4px)",
          }}
        />
      )}
      <p
        style={{
          margin: 0,
          fontWeight: 600,
          fontSize: "var(--storekit-font-size-base, 1rem)",
          color: "var(--storekit-text-primary, #1a202c)",
        }}
      >
        {product.name}
      </p>
      {product.description && (
        <p
          style={{
            margin: 0,
            fontSize: "var(--storekit-font-size-sm, 0.875rem)",
            color: "var(--storekit-text-secondary, #718096)",
          }}
        >
          {product.description}
        </p>
      )}
      <p
        style={{
          margin: 0,
          fontWeight: 700,
          color: "var(--storekit-accent, #3182ce)",
        }}
      >
        ¥{product.listPrice.toLocaleString()}
      </p>
    </div>
  );
}

export function ProductList({
  options,
  renderProduct,
  loadingFallback,
  errorFallback,
  emptyFallback,
  className,
}: ProductListProps) {
  const { data, loading, error } = useProducts(options);

  if (loading) {
    return (
      <div className={className}>
        {loadingFallback ?? (
          <p style={{ color: "var(--storekit-text-secondary, #718096)" }}>
            Loading products...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        {errorFallback ? errorFallback(error) : <p>Error: {error.message}</p>}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className={className}>
        {emptyFallback ?? <p>No products found.</p>}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(var(--storekit-card-min-width, 240px), 1fr))",
        gap: "var(--storekit-gap, 16px)",
      }}
    >
      {data.items.map((product) =>
        renderProduct ? (
          renderProduct(product)
        ) : (
          <DefaultProductCard key={product.id} product={product} />
        ),
      )}
    </div>
  );
}
