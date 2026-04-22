"use client";

import type { ReactNode } from "react";
import { useProduct } from "../hooks.js";

export interface ProductDetailProps {
  productId: string;
  onAddToCart?: (productId: string, quantity: number) => void | Promise<void>;
  loadingFallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
  className?: string;
}

export function ProductDetail({
  productId,
  onAddToCart,
  loadingFallback,
  errorFallback,
  className,
}: ProductDetailProps) {
  const { data: product, loading, error } = useProduct(productId);

  if (loading) {
    return (
      <div className={className}>
        {loadingFallback ?? (
          <p style={{ color: "var(--storekit-text-secondary, #718096)" }}>
            Loading...
          </p>
        )}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={className}>
        {error && errorFallback
          ? errorFallback(error)
          : <p>Product not found.</p>}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--storekit-spacing-md, 16px)",
      }}
    >
      {product.imageIds.length > 0 && (
        <div
          style={{
            aspectRatio: "4 / 3",
            background: "var(--storekit-image-bg, #f7fafc)",
            borderRadius: "var(--storekit-radius, 8px)",
          }}
        />
      )}
      <h1
        style={{
          margin: 0,
          fontSize: "var(--storekit-font-size-xl, 1.5rem)",
          fontWeight: 700,
          color: "var(--storekit-text-primary, #1a202c)",
        }}
      >
        {product.name}
      </h1>
      {product.description && (
        <p
          style={{
            margin: 0,
            color: "var(--storekit-text-secondary, #718096)",
          }}
        >
          {product.description}
        </p>
      )}
      <p
        style={{
          margin: 0,
          fontSize: "var(--storekit-font-size-lg, 1.25rem)",
          fontWeight: 700,
          color: "var(--storekit-accent, #3182ce)",
        }}
      >
        ¥{product.listPrice.toLocaleString()}
      </p>
      {onAddToCart && (
        <button
          type="button"
          onClick={() => onAddToCart(product.id, 1)}
          style={{
            padding: "var(--storekit-btn-padding, 12px 24px)",
            background: "var(--storekit-btn-bg, #3182ce)",
            color: "var(--storekit-btn-text, #fff)",
            border: "none",
            borderRadius: "var(--storekit-radius, 8px)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "var(--storekit-font-size-base, 1rem)",
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
