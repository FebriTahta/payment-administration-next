import { AvailablePaymentComponentsResponse } from "@/interface/payment-component-list-page";
import { baseUrl } from "@/lib/url";
  
export const availablePaymentComponents = async (nis: string, kd_rombel: string, komponen: string | null , token: string, tahun_ajaran: string): Promise<AvailablePaymentComponentsResponse> => {
  try {
    const url = baseUrl();
    // Encode tahun_ajaran dengan btoa
    const encodedTahunAjaran = btoa(tahun_ajaran);
    const endpoint = komponen && komponen.trim() !== ""
      ? `${url}/available-payment-comppnent/${nis}/${kd_rombel}/${encodedTahunAjaran}/${komponen}`
      : `${url}/available-payment-comppnent/${nis}/${kd_rombel}/${encodedTahunAjaran}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('PAYMENT LIST: Response Available Payment Components:', response.status);

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
