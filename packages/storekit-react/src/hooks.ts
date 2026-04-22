"use client";

import type {
  Cart,
  Product,
  ProductListOptions,
  ProductListResult,
} from "@bakuure/storekit-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStorekitClient } from "./context.js";

// ── useProducts ───────────────────────────────────────────────────

export interface UseProductsResult {
  data: ProductListResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProducts(options: ProductListOptions = {}): UseProductsResult {
  const client = useStorekitClient();
  const [data, setData] = useState<ProductListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const counterRef = useRef(0);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    const id = ++counterRef.current;
    client.products
      .list(options)
      .then((result) => {
        if (id === counterRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (id === counterRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
  // Serialize options to avoid infinite loops on object identity change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, JSON.stringify(options)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── useProduct ────────────────────────────────────────────────────

export interface UseProductResult {
  data: Product | null;
  loading: boolean;
  error: Error | null;
}

export function useProduct(productId: string): UseProductResult {
  const client = useStorekitClient();
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    client.products
      .get(productId)
      .then((p) => {
        if (!cancelled) {
          setData(p);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [client, productId]);

  return { data, loading, error };
}

// ── useCart ───────────────────────────────────────────────────────

export interface UseCartResult {
  cart: Cart | null;
  loading: boolean;
  error: Error | null;
  createCart: (sessionId?: string) => Promise<Cart>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

export function useCart(cartId?: string): UseCartResult {
  const client = useStorekitClient();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(!!cartId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cartId) return;
    let cancelled = false;
    setLoading(true);
    client.cart
      .get(cartId)
      .then((c) => {
        if (!cancelled) {
          setCart(c);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [client, cartId]);

  const createCart = useCallback(
    async (sessionId?: string) => {
      const c = await client.cart.create({ sessionId });
      setCart(c);
      return c;
    },
    [client],
  );

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!cart) throw new Error("Cart not initialized");
      const updated = await client.cart.add(cart.id, productId, quantity);
      setCart(updated);
    },
    [client, cart],
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (!cart) throw new Error("Cart not initialized");
      const updated = await client.cart.update(cart.id, itemId, quantity);
      setCart(updated);
    },
    [client, cart],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!cart) throw new Error("Cart not initialized");
      await client.cart.remove(cart.id, itemId);
      setCart((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
          : null,
      );
    },
    [client, cart],
  );

  return { cart, loading, error, createCart, addItem, updateItem, removeItem };
}
