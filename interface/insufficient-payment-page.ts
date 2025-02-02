export interface ApiResponse {
    status: number;
    message: string;
    data: InsufficientPaymentData;
}

interface InsufficientPaymentData {
    message: string;
    data: InsufficientPaymentDetails;
}

interface InsufficientPaymentDetails {
    siswa: Siswa;
    InsufficientComponents: InsufficientComponent[];
}

interface Siswa {
    nis: string;
    namaSiswa: string;
    gender: string;
    tingkat: number;
    kdRombel: string;
    statusAkademik: string;
}

interface InsufficientComponent {
    kodeKomponen: number;
    namaKomponen: string;
    jatuhTempo: string; // ISO date string
    totalBayar: number;
    totalPaid: number;
    instalment: Instalment[];
    remainingAmount: number;
}

interface Instalment {
    kdTrans: string;
    nominalinstalment: number;
    paymentTime: string;
}
