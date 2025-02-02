interface PaymentDetails {
    kodeKomponen: number;
    namaKomponen: string;
    jatuhTempo: string; // ISO 8601 format
    totalBayar: number;
    nominalBayar: number;
}

interface Payment {
    kdTrans: string;
    tanggalPembayaran: string; // ISO 8601 format
    totalBayar: number;
    totalPaid: number;
    remainingAmount: number;
    paymentStatus: string;
    details: PaymentDetails[];
}

interface Siswa {
    nis: string;
    namaSiswa: string;
    gender: string; // "L" or "P"
    tingkat: number;
    kdRombel: string;
    statusAkademik: string;
}

interface PaymentData {
    siswa: Siswa;
    payments: Payment[];
}

interface ResponseData {
    message: string;
    data: PaymentData;
}

export interface ApiResponse {
    status: number;
    message: string;
    data: ResponseData;
}
