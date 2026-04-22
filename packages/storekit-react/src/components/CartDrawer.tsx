"use client";

import type { Cart } from "@bakuure/storekit-core";
import type { ReactNode } from "react";

export interface CartDrawerProps {
  cart: Cart | null;
  open: boolean;
  onClose: () => void;
  onUpdateItem?: (itemId: string, quantity: number) => void | Promise<void>;
  onRemoveItem?: (itemId: string) => void | Promise<void>;
  onCheckout?: () => void | Promise<void>;
  /** Override the entire drawer content */
  children?: ReactNode;
  className?: string;
}

export function CartDrawer({
  cart,
  open,
  onClose,
  onUpdateItem,
  onRemoveItem,
  onCheckout,
  children,
  className,
}: CartDrawerProps) {
  if (!open) return null;

  const itemCount = cart?.items.length ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--storekit-overlay-bg, rgba(0,0,0,0.4))",
          zIndex: "var(--storekit-drawer-z, 40)" as unknown as number,
        }}
      />
      {/* Drawer */}
      <div
        className={className}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "var(--storekit-drawer-width, 400px)",
          maxWidth: "100vw",
          background: "var(--storekit-surface, #fff)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          zIndex: "var(--storekit-drawer-z-content, 50)" as unknown as number,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--storekit-spacing-md, 16px)",
            borderBottom: "1px solid var(--storekit-border-color, #e2e8f0)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "var(--storekit-font-size-lg, 1.25rem)",
              fontWeight: 700,
              color: "var(--storekit-text-primary, #1a202c)",
            }}
          >
            Cart ({itemCount})
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.25rem",
              color: "var(--storekit-text-secondary, #718096)",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--storekit-spacing-md, 16px)" }}>
          {children ?? (
            <>
              {!cart || itemCount === 0 ? (
                <p style={{ color: "var(--storekit-text-secondary, #718096)" }}>
                  Your cart is empty.
                </p>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {cart.items.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        border: "1px solid var(--storekit-border-color, #e2e8f0)",
                        borderRadius: "var(--storekit-radius-sm, 4px)",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 600,
                            fontSize: "var(--storekit-font-size-sm, 0.875rem)",
                            color: "var(--storekit-text-primary, #1a202c)",
                          }}
                        >
                          {item.productId}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "var(--storekit-font-size-sm, 0.875rem)",
                            color: "var(--storekit-text-secondary, #718096)",
                          }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {onUpdateItem && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateItem(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              style={{
                                width: "28px",
                                height: "28px",
                                border: "1px solid var(--storekit-border-color, #e2e8f0)",
                                borderRadius: "4px",
                                cursor: "pointer",
                                background: "none",
                              }}
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateItem(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              style={{
                                width: "28px",
                                height: "28px",
                                border: "1px solid var(--storekit-border-color, #e2e8f0)",
                                borderRadius: "4px",
                                cursor: "pointer",
                                background: "none",
                              }}
                            >
                              +
                            </button>
                          </>
                        )}
                        {onRemoveItem && (
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label="Remove item"
                            style={{
                              width: "28px",
                              height: "28px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              background: "none",
                              color: "var(--storekit-danger, #e53e3e)",
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {onCheckout && itemCount > 0 && (
          <div
            style={{
              padding: "var(--storekit-spacing-md, 16px)",
              borderTop: "1px solid var(--storekit-border-color, #e2e8f0)",
            }}
          >
            <button
              type="button"
              onClick={onCheckout}
              style={{
                width: "100%",
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
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
