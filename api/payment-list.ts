import { ApiResponse } from "@/interface/payment-list-page";
import { baseUrl } from "@/lib/url";
  
export const paymentList = async (nis: string, kd_rombel: string, token: string): Promise<ApiResponse> => {
  try {
    const url = baseUrl();
    const response = await fetch(`${url}/payment-list/${nis}/${kd_rombel}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    console.log('PAYMENT LIST: Response Payment List:', response.status);

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: Fetching failed.`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // throw new Error(errorMessage);
      throw errorMessage;
  }
};
