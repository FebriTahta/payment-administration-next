import { PaymentResponse } from "@/interface/payment-detail-page";
import { baseUrl } from "@/lib/url";
  
export const detailPaymentComponent = async (nis: string, kd_rombel: string, komponen: string, token: string): Promise<PaymentResponse> => {
  try {
    const url = baseUrl();
    const response = await fetch(`${url}/detail-payment-components/${nis}/${kd_rombel}/${komponen}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    console.log('paymentComponentDetail: Response Available Payment Components:', response.status);

    if (!response.ok) {
        const errorData = await response.json();
        // console.error('Error Data:', errorData);
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
