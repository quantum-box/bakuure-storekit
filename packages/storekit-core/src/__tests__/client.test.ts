import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "../client.js";
import { StorekitError } from "../types.js";

const config = {
  tenantId: "tn_test_01",
  apiBaseUrl: "https://api.example.com",
  apiKey: "test-key",
};

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

function mockGqlResponse(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data }),
  });
}

function mockGqlError(message: string) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ errors: [{ message }] }),
  });
}

function mockHttpError(status: number, message = "Error") {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ message }),
  });
}

describe("createClient", () => {
  it("creates a client with products, cart, and checkout", () => {
    const client = createClient(config);
    expect(client.products).toBeDefined();
    expect(client.cart).toBeDefined();
    expect(client.checkout).toBeDefined();
  });
});

describe("products.list", () => {
  it("returns product list on success", async () => {
    const client = createClient(config);
    const mockData = {
      items: [
        {
          id: "prod_1",
          name: "Test Product",
          description: null,
          kind: "physical",
          listPrice: 1000,
          billingCycle: "one_time",
          publicationName: null,
          publicationDescription: null,
          imageIds: [],
          categoryId: null,
          weightGrams: 100,
        },
      ],
      limit: 20,
      offset: 0,
    };
    mockGqlResponse({ storefrontProducts: mockData });

    const result = await client.products.list({ limit: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("Test Product");
    expect(mockFetch).toHaveBeenCalledOnce();

    const [url, opts] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Record<string, string>; body: string },
    ];
    expect(url).toBe("https://api.example.com/v1/graphql");
    expect(opts.headers["x-operator-id"]).toBe("tn_test_01");
    expect(opts.headers["Authorization"]).toBe("Bearer test-key");
  });

  it("throws StorekitError on GraphQL error", async () => {
    const client = createClient(config);
    mockGqlError("Product not found");

    await expect(client.products.list()).rejects.toMatchObject({
      name: "StorekitError",
      message: "Product not found",
    });
  });

  it("throws StorekitError on HTTP error", async () => {
    const client = createClient(config);
    mockHttpError(401, "Unauthorized");

    await expect(client.products.list()).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe("products.get", () => {
  it("returns a single product", async () => {
    const client = createClient(config);
    const mockProduct = {
      id: "prod_1",
      name: "Single Product",
      description: "A product",
      kind: "digital",
      listPrice: 500,
      billingCycle: "monthly",
      publicationName: "My Publication",
      publicationDescription: null,
      imageIds: ["img_1"],
      categoryId: "cat_1",
      weightGrams: null,
    };
    mockGqlResponse({ storefrontProduct: mockProduct });

    const result = await client.products.get("prod_1");
    expect(result.id).toBe("prod_1");
    expect(result.name).toBe("Single Product");
  });
});

describe("cart", () => {
  const mockCart = {
    id: "cart_1",
    tenantId: "tn_test_01",
    userId: null,
    sessionId: "sess_1",
    status: "active",
    items: [],
    expiresAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };

  it("creates a cart", async () => {
    const client = createClient(config);
    mockGqlResponse({ createCart: mockCart });

    const cart = await client.cart.create({ sessionId: "sess_1" });
    expect(cart.id).toBe("cart_1");
    expect(cart.status).toBe("active");
  });

  it("gets a cart by id", async () => {
    const client = createClient(config);
    mockGqlResponse({ cart: { ...mockCart, id: "cart_2" } });

    const cart = await client.cart.get("cart_2");
    expect(cart.id).toBe("cart_2");
  });

  it("adds item to cart", async () => {
    const client = createClient(config);
    const cartWithItem = {
      ...mockCart,
      items: [
        {
          id: "item_1",
          productId: "prod_1",
          quantity: 2,
          unitPriceNanodollar: "1000000000",
        },
      ],
    };
    mockGqlResponse({ addCartItem: cartWithItem });

    const cart = await client.cart.add("cart_1", "prod_1", 2);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  it("removes item from cart", async () => {
    const client = createClient(config);
    mockGqlResponse({ removeCartItem: true });

    const result = await client.cart.remove("cart_1", "item_1");
    expect(result).toBe(true);
  });
});

describe("checkout.create", () => {
  it("creates an order from checkout", async () => {
    const client = createClient(config);
    const mockOrder = {
      id: "order_1",
      tenantId: "tn_test_01",
      cartId: "cart_1",
      userId: null,
      sessionId: "sess_1",
      status: "pending",
      fulfillmentMethod: "delivery",
      paymentMethod: "online",
      shippingName: null,
      shippingAddress: null,
      shippingPhone: null,
      customerEmail: "buyer@example.com",
      storeId: null,
      subtotalNanodollar: "1000000000",
      discountNanodollar: "0",
      shippingFeeNanodollar: "0",
      totalNanodollar: "1000000000",
      items: [],
      checkoutUrl: "https://checkout.stripe.com/pay/cs_test_123",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    };
    mockGqlResponse({ checkout: mockOrder });

    const order = await client.checkout.create({
      cartId: "cart_1",
      customerEmail: "buyer@example.com",
      successUrl: "https://example.com/success",
      cancelUrl: "https://example.com/cart",
    });
    expect(order.id).toBe("order_1");
    expect(order.checkoutUrl).toContain("stripe.com");
  });
});
