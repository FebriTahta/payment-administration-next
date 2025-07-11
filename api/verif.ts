import { baseUrl } from "@/lib/url";

export const getDetailSiswa = async (payload: string) => {
    try {
        const url = baseUrl();
        const response = await fetch(`${url}/detail-siswa`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload, // FormData secara otomatis menetapkan boundary header untuk multipart/form-data
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: Fetching failed.`);
        }

        return response.json(); // Kembalikan data JSON jika berhasil

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
    }
}

export const fetchVerif = async (payload: string) => {
    try {
        const url = baseUrl();
        const response = await fetch(`${url}/verification`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload, // FormData secara otomatis menetapkan boundary header untuk multipart/form-data
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: Fetching failed.`);
        }
  
        return response.json(); // Kembalikan data JSON jika berhasil

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
    }
};
  
  