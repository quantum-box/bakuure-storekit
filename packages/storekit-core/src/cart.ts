import type { Cart, CreateCartOptions, StorekitConfig } from "./types.js";
import {
  ADD_CART_ITEM_MUTATION,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_CART_ITEM_MUTATION,
  UPDATE_CART_ITEM_MUTATION,
} from "./gql.js";
import { gqlRequest } from "./http.js";

export function createCartClient(config: StorekitConfig) {
  return {
    async create(options: CreateCartOptions = {}): Promise<Cart> {
      const data = await gqlRequest<{ createCart: Cart }>(
        config,
        CREATE_CART_MUTATION,
        { userId: options.userId, sessionId: options.sessionId },
      );
      return data.createCart;
    },

    async get(cartId: string): Promise<Cart> {
      const data = await gqlRequest<{ cart: Cart }>(
        config,
        GET_CART_QUERY,
        { cartId },
      );
      return data.cart;
    },

    async add(
      cartId: string,
      productId: string,
      quantity: number,
    ): Promise<Cart> {
      const data = await gqlRequest<{ addCartItem: Cart }>(
        config,
        ADD_CART_ITEM_MUTATION,
        { cartId, productId, quantity },
      );
      return data.addCartItem;
    },

    async update(
      cartId: string,
      itemId: string,
      quantity: number,
    ): Promise<Cart> {
      const data = await gqlRequest<{ updateCartItem: Cart }>(
        config,
        UPDATE_CART_ITEM_MUTATION,
        { cartId, itemId, quantity },
      );
      return data.updateCartItem;
    },

    async remove(cartId: string, itemId: string): Promise<boolean> {
      const data = await gqlRequest<{ removeCartItem: boolean }>(
        config,
        REMOVE_CART_ITEM_MUTATION,
        { cartId, itemId },
      );
      return data.removeCartItem;
    },
  };
}
