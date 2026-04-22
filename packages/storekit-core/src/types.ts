// ── Client config ────────────────────────────────────────────────

export interface StorekitConfig {
  /** Operator tenant ID (e.g. "tn_01hjryxysgey07h5jz5wagqj0m") */
  tenantId: string;
  /** bakuure-api base URL (e.g. "https://api.bakuure.quantum-box.com") */
  apiBaseUrl: string;
  /** API key for authentication (read scope for storefront operations) */
  apiKey: string;
}

// ── Products ─────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  /** Raw list price (integer, platform-defined unit) */
  listPrice: number;
  billingCycle: string;
  publicationName: string | null;
  publicationDescription: string | null;
  imageIds: string[];
  categoryId: string | null;
  weightGrams: number | null;
}

export interface ProductListResult {
  items: Product[];
  limit: number;
  offset: number;
}

export interface ProductListOptions {
  categoryId?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: "price_asc" | "price_desc" | "name_asc";
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  imageUrl: string | null;
}

// ── Cart ─────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  /** Price per unit in NanoDollars (as string to avoid float loss) */
  unitPriceNanodollar: string;
}

export interface Cart {
  id: string;
  tenantId: string;
  userId: string | null;
  sessionId: string | null;
  status: string;
  items: CartItem[];
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCartOptions {
  userId?: string;
  sessionId?: string;
}

// ── Checkout / Orders ─────────────────────────────────────────────

export interface CheckoutOptions {
  cartId: string;
  shippingName?: string;
  shippingAddress?: string;
  shippingPhone?: string;
  customerEmail?: string;
  storeId?: string;
  pickupRequestedAt?: string;
  /** "pickup" or "delivery" */
  fulfillmentMethod?: string;
  /** "in_store" or "online" */
  paymentMethod?: string;
  couponCode?: string;
  /** Stripe success redirect URL */
  successUrl?: string;
  /** Stripe cancel redirect URL */
  cancelUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceNanodollar: string;
  subtotalNanodollar: string;
}

export interface Order {
  id: string;
  tenantId: string;
  cartId: string | null;
  userId: string | null;
  sessionId: string | null;
  status: string;
  fulfillmentMethod: string | null;
  paymentMethod: string | null;
  shippingName: string | null;
  shippingAddress: string | null;
  shippingPhone: string | null;
  customerEmail: string | null;
  storeId: string | null;
  subtotalNanodollar: string;
  discountNanodollar: string;
  shippingFeeNanodollar: string;
  totalNanodollar: string;
  items: OrderItem[];
  /** Stripe Checkout Session URL — present when Stripe payment session created */
  checkoutUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Errors ───────────────────────────────────────────────────────

export class StorekitError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "StorekitError";
  }
}

// ── GraphQL response shapes ───────────────────────────────────────

export interface GqlError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface GqlResponse<T> {
  data?: T;
  errors?: GqlError[];
}
