// GraphQL query/mutation strings for bakuure storefront API.
// Based on bakuure-api schema.graphql.

export const STOREFRONT_PRODUCTS_QUERY = `
  query StorefrontProducts(
    $categoryId: String
    $search: String
    $priceMin: Int
    $priceMax: Int
    $sort: ProductSortOrder
    $inStock: Boolean
    $limit: Int
    $offset: Int
  ) {
    storefrontProducts(
      categoryId: $categoryId
      search: $search
      priceMin: $priceMin
      priceMax: $priceMax
      sort: $sort
      inStock: $inStock
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        name
        description
        kind
        listPrice
        billingCycle
        publicationName
        publicationDescription
        imageIds
        categoryId
        weightGrams
      }
      limit
      offset
    }
  }
`;

export const STOREFRONT_PRODUCT_QUERY = `
  query StorefrontProduct($productId: ID!) {
    storefrontProduct(productId: $productId) {
      id
      name
      description
      kind
      listPrice
      billingCycle
      publicationName
      publicationDescription
      imageIds
      categoryId
      weightGrams
    }
  }
`;

export const STOREFRONT_CATEGORIES_QUERY = `
  query StorefrontCategories {
    storefrontCategories {
      id
      name
      slug
      parentId
      sortOrder
      imageUrl
    }
  }
`;

export const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(cartId: $cartId) {
      id
      tenantId
      userId
      sessionId
      status
      items {
        id
        productId
        quantity
        unitPriceNanodollar
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation CreateCart($userId: String, $sessionId: String) {
    createCart(input: { userId: $userId, sessionId: $sessionId }) {
      id
      tenantId
      userId
      sessionId
      status
      items {
        id
        productId
        quantity
        unitPriceNanodollar
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const ADD_CART_ITEM_MUTATION = `
  mutation AddCartItem($cartId: ID!, $productId: String!, $quantity: Int!) {
    addCartItem(cartId: $cartId, input: { productId: $productId, quantity: $quantity }) {
      id
      tenantId
      userId
      sessionId
      status
      items {
        id
        productId
        quantity
        unitPriceNanodollar
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = `
  mutation UpdateCartItem($cartId: ID!, $itemId: ID!, $quantity: Int!) {
    updateCartItem(cartId: $cartId, itemId: $itemId, input: { quantity: $quantity }) {
      id
      tenantId
      userId
      sessionId
      status
      items {
        id
        productId
        quantity
        unitPriceNanodollar
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_CART_ITEM_MUTATION = `
  mutation RemoveCartItem($cartId: ID!, $itemId: ID!) {
    removeCartItem(cartId: $cartId, itemId: $itemId)
  }
`;

export const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      id
      tenantId
      cartId
      userId
      sessionId
      status
      fulfillmentMethod
      paymentMethod
      shippingName
      shippingAddress
      shippingPhone
      customerEmail
      storeId
      subtotalNanodollar
      discountNanodollar
      shippingFeeNanodollar
      totalNanodollar
      items {
        id
        productId
        productName
        quantity
        unitPriceNanodollar
        subtotalNanodollar
      }
      checkoutUrl
      createdAt
      updatedAt
    }
  }
`;
