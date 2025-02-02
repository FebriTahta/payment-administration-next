"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchVerif } from "@/api/verif";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {validateJWT} from "@/lib/jwt";
import FullscreenButton from "../button-full-screen";

export function Login() {
  const { toast } = useToast();
  const [nis, setNis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerif = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <Card className="w-[350px] dark:bg-transparent">
       <form onSubmit={handleVerif}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Place your credential here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nis">Username / NIS</Label>
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
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <FullscreenButton/>
          <Button
            type="submit" 
            className="flex cursor-pointer hover:scale-125 z-50"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
