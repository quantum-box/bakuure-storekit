"use client";

import type { CheckoutOptions, Order } from "@bakuure/storekit-core";
import { type ReactNode, useState } from "react";
import { useStorekitClient } from "../context.js";

export interface CheckoutButtonProps {
  options: CheckoutOptions;
  onSuccess?: (order: Order) => void;
  onError?: (error: Error) => void;
  /**
   * When true and the order has a checkoutUrl (Stripe), automatically
   * redirect to the Stripe Checkout page.
   */
  autoRedirect?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CheckoutButton({
  options,
  onSuccess,
  onError,
  autoRedirect = true,
  disabled,
  children,
  className,
  style,
}: CheckoutButtonProps) {
  const client = useStorekitClient();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const order = await client.checkout.create(options);
      onSuccess?.(order);
      if (autoRedirect && order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      style={{
        padding: "var(--storekit-btn-padding, 12px 24px)",
        background: "var(--storekit-btn-bg, #3182ce)",
        color: "var(--storekit-btn-text, #fff)",
        border: "none",
        borderRadius: "var(--storekit-radius, 8px)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: "var(--storekit-font-size-base, 1rem)",
        opacity: disabled || loading ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? "Processing..." : (children ?? "Checkout")}
    </button>
  );
}
