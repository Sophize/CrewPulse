export class ApiError extends Error {
  constructor(
    public status: number,
    public body: any,
    message?: string,
  ) {
    super(message || `HTTP ${status}`);
    this.name = "ApiError";
  }
}

export interface FetchJsonOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>;
}

export async function fetchJson<T = any>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { query, ...fetchOptions } = options;

  const baseUrl =
    typeof window === "undefined"
      ? `http://localhost:${process.env.PORT || 3000}`
      : window.location.origin;

  const fullUrl = new URL(url, baseUrl);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[API] ${fetchOptions.method || "GET"} ${fullUrl.pathname}${fullUrl.search}`,
    );
  }

  const response = await fetch(fullUrl.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  let body: any;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ✗ ${response.status}`, body);
    }
    throw new ApiError(response.status, body);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[API] ✓ ${response.status}`);
  }

  return body;
}
