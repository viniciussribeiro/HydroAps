const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.hydropulse.local';
export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

type RequestOptions = RequestInit & { timeoutMs?: number };

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const body = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new ApiError(
        (body as { message?: string } | undefined)?.message ?? 'Falha ao comunicar com o servidor.',
        response.status,
        body,
      );
    }
    return body as T;
  } finally {
    clearTimeout(timeout);
  }
}
