import { baseUrl } from "@/lib/url";

export const createTransaction = async (payload: object, token: string) => {
    try {
        const url = baseUrl();
        const response = await fetch(`${url}/create-transaction`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload), // Mengonversi payload ke string JSON
        });
    
        // if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || `Error ${response.status}: Fetching failed.`);
        // }
  
        return response.json(); // Kembalikan data JSON jika berhasil

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
    }
};
