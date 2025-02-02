import { MonthlyRecapPaymentResponse } from "@/interface/home-page";
import { baseUrl } from "@/lib/url";
  
export const monthlyRecapPayment = async (params: string, token: string): Promise<MonthlyRecapPaymentResponse> => {
  try {
    const url = baseUrl();
    const response = await fetch(`${url}/monthly-recap-payment/${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    console.log('HOME: Response Status Monthly Payment:', response.status);

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: Fetching failed.`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(errorMessage);
  }
};
