import type { GqlError, GqlResponse, StorekitConfig } from "./types.js";
import { StorekitError } from "./types.js";

export async function gqlRequest<T>(
  config: StorekitConfig,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const url = `${config.apiBaseUrl}/v1/graphql`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "x-operator-id": config.tenantId,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore parse error
    }
    throw new StorekitError(message, res.status);
  }

  const json: GqlResponse<T> = await res.json();

  if (json.errors && json.errors.length > 0) {
    const err = json.errors[0] as GqlError;
    const code = err.extensions?.["code"] as string | undefined;
    throw new StorekitError(err.message, 200, code);
  }

  if (!json.data) {
    throw new StorekitError("Empty response from API", 200);
  }

  return json.data;
}
