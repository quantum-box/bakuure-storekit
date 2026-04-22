import type {
  Category,
  Product,
  ProductListOptions,
  ProductListResult,
  StorekitConfig,
} from "./types.js";
import {
  STOREFRONT_CATEGORIES_QUERY,
  STOREFRONT_PRODUCT_QUERY,
  STOREFRONT_PRODUCTS_QUERY,
} from "./gql.js";
import { gqlRequest } from "./http.js";

const SORT_MAP: Record<NonNullable<ProductListOptions["sort"]>, string> = {
  price_asc: "PRICE_ASC",
  price_desc: "PRICE_DESC",
  name_asc: "NAME_ASC",
};

export function createProductsClient(config: StorekitConfig) {
  return {
    async list(options: ProductListOptions = {}): Promise<ProductListResult> {
      const { sort, ...rest } = options;
      const variables = {
        ...rest,
        sort: sort ? SORT_MAP[sort] : undefined,
        limit: options.limit ?? 20,
        offset: options.offset ?? 0,
      };
      const data = await gqlRequest<{
        storefrontProducts: ProductListResult;
      }>(config, STOREFRONT_PRODUCTS_QUERY, variables);
      return data.storefrontProducts;
    },

    async get(productId: string): Promise<Product> {
      const data = await gqlRequest<{ storefrontProduct: Product }>(
        config,
        STOREFRONT_PRODUCT_QUERY,
        { productId },
      );
      return data.storefrontProduct;
    },

    async listCategories(): Promise<Category[]> {
      const data = await gqlRequest<{
        storefrontCategories: Category[];
      }>(config, STOREFRONT_CATEGORIES_QUERY);
      return data.storefrontCategories;
    },
  };
}
