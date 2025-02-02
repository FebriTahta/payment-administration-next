import { baseUrl } from "@/lib/url";

export const createFcmWebToken = async (payload: object, token: string) => {
    try {
        const url = baseUrl();
        const response = await fetch(`${url}/store-firebase-web-token`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload), // Mengonversi payload ke string JSON
        });
  
        return response.json(); // Kembalikan data JSON jika berhasil

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
    }
};
