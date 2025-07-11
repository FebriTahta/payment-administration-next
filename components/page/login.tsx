"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchVerif , getDetailSiswa} from "@/api/verif";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {validateJWT} from "@/lib/jwt";
import FullscreenButton from "../button-full-screen";

import Image from "next/image";

interface SiswaData {
  KODEROMBEL: string;
  TINGKAT: string;
  KDJURUSAN: string;
  NIS: string;
  NAMASISWA: string;
  id: number;
  siswa_id: number;
  rombel_id: number;
  tahun_ajaran: string;
}

export function Login() {
  const { toast } = useToast();
  const [nis, setNis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailSiswa, setDetailSiswa] = useState<SiswaData[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [tahunAjaran, setTahunAjaran] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    console.log("detailSiswa state changed:", detailSiswa);
  }, [detailSiswa]);

  useEffect(() => {
    console.log("tahunAjaran state changed:", tahunAjaran);
  }, [tahunAjaran]);

  // Fungsi untuk mengupdate tahun ajaran berdasarkan pilihan riwayat kelas
  const handleSiswaSelection = (kodeRombel: string) => {
    setSelectedSiswa(kodeRombel);
    
    // Cari data siswa yang sesuai dengan kode rombel yang dipilih
    const selectedSiswaData = detailSiswa.find(item => item.KODEROMBEL === kodeRombel);
    
    if (selectedSiswaData) {
      setTahunAjaran(selectedSiswaData.tahun_ajaran);
      console.log("Tahun ajaran diupdate:", selectedSiswaData.tahun_ajaran);
    }
  };

  const handleGetDetailSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nis.trim()) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Silakan masukkan NIS terlebih dahulu",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const payload = JSON.stringify({ nis: nis });
      console.log("Sending payload:", payload);
      const response = await getDetailSiswa(payload);
      console.log("Response from API:", response);
      
      if (response && response.status === 200 && response.data) {
        console.log("Setting detailSiswa:", response.data);
        setDetailSiswa(response.data);
        setSelectedSiswa(""); // Reset pilihan
        setTahunAjaran(""); // Reset tahun ajaran
        if (response.data.length > 0) {
          setNis(response.data[0].NIS);
        }
        toast({
          title: "Berhasil!",
          description: `Ditemukan ${response.data.length} riwayat kelas`,
        });
      } else {
        console.log("No data found or invalid response");
        setDetailSiswa([]);
        setSelectedSiswa("");
        setTahunAjaran("");
        setError("Tidak ada data riwayat kelas ditemukan");
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Tidak ada data riwayat kelas ditemukan",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data";
      setError(errorMessage);
      setDetailSiswa([]);
      setSelectedSiswa("");
      setTahunAjaran("");
      toast({
        variant: "destructive",
        title: "Oops!",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerif = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSiswa) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Silakan pilih riwayat kelas terlebih dahulu",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const payload  = JSON.stringify({ nis: nis }); // Mengubah payload menjadi JSON string
      const response = await fetchVerif(payload);

      // Pastikan response adalah objek, bukan string
      const resJson = await response; // Assuming `response` is an object.

      if (resJson && resJson.status === 200 || resJson.status === 201) {
        // Simpan token di cookie
        Cookies.set("authToken", resJson.data, { expires: 1 }); // Token valid selama 1 hari
        
        try {
          const payloadJwt = await validateJWT(resJson.data);
          if (payloadJwt) {
            toast({
              title: "Hi..!",
              description: "Welcome back: " + payloadJwt.NAMASISWA,
            });
            router.push('/home-page');
          } else {
            toast({
              variant: "destructive",
              title: "Oops!",
              description: "Akses tidak dikenali",
            });
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          toast({
            variant: 'destructive',
            title: 'Opps!',
            description: errorMessage,
          });
        }
        
        
      } else {
        throw new Error(resJson.message || "Login gagal.");
      }

    } catch (err: unknown) {

      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(errorMessage);
      
      toast({
        variant: 'destructive',
        title: 'Opps!',
        description: errorMessage,
      })

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <CardHeader className="items-center">
      <Image alt="logo" className="block dark:hidden" src={'/web-03.png'} width={120} height={50}/>
      <Image alt="logo" className="hidden dark:block" src={'/web-02.png'} width={120} height={50}/>
    </CardHeader>
    <Card className="w-[350px] dark:bg-transparent">

      <form onSubmit={handleGetDetailSiswa}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Place your credential here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nis">Username / NIS</Label>
              <div className="flex flex-row gap-x-2">
                <Input
                  id="nis"
                  placeholder="....."
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  type="number"
                  className="flex"
                />
                <Button
                  type="submit" 
                  className="flex cursor-pointer hover:scale-100 z-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "find"}
                </Button>
              </div>
              {error && <Label className="text-red-500 mt-2">{error}</Label>}
            </div>
          </div>
        </CardContent>
      </form>
      
      <form onSubmit={handleVerif}>
        <CardContent>
          <div className="w-full gap-4 hidden">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="nis"
                placeholder="....."
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                type="number"
              />
                {error && <Label className="text-red-500 mt-2">{error}</Label>}
            </div>
          </div>

          {detailSiswa.length > 0 && (
            <div className="w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="siswa-select">Riwayat Kelas</Label>
                <select
                  id="siswa-select"
                  value={selectedSiswa}
                  onChange={(e) => handleSiswaSelection(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Pilih riwayat kelas</option>
                  {detailSiswa.map((item, index) => (
                    <option key={index} value={item.KODEROMBEL}>
                      {item.KODEROMBEL} - {item.tahun_ajaran}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Tampilkan tahun ajaran yang dipilih */}
          {selectedSiswa && tahunAjaran && (
            <div className="w-full gap-4 mt-5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="tahun-ajaran">Tahun Ajaran</Label>
                <Input
                  id="tahun-ajaran"
                  value={tahunAjaran}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
            </div>
          )}


        </CardContent>
        <CardFooter className="flex gap-3 justify-end">
          <FullscreenButton/>
          {detailSiswa.length > 0 && (
            <Button
              type="submit" 
              className="flex cursor-pointer hover:scale-100 z-50"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
    </>
  )
}
