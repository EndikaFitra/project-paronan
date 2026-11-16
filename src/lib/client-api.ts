/** Utilitas respons API untuk komponen client. */

export interface ApiResponseResult {
  ok: boolean;
  status: number;
  /** Pesan error dari API (Bahasa Indonesia) bila ada. */
  message: string | null;
  data: Record<string, unknown>;
}

/** Baca body JSON sebagai objek tanpa melempar error saat body kosong/rusak. */
export async function readApiResponse(
  response: Response,
): Promise<ApiResponseResult> {
  let data: Record<string, unknown> = {};
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && !Array.isArray(body)) {
      data = body as Record<string, unknown>;
    }
  } catch {
    // Respons tanpa body JSON — tetap lanjut dengan pesan default.
  }

  return {
    ok: response.ok,
    status: response.status,
    message: typeof data.message === "string" ? data.message : null,
    data,
  };
}

export const NETWORK_ERROR_MESSAGE =
  "Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.";
