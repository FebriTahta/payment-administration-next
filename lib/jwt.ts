import { jwtVerify } from "jose";
import { jwtDecode } from 'jwt-decode';
import { AuthPayload } from "@/interface/home-page";

export const validateJWT = async (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || 'secret';
  if (!secretKey) {
    throw new Error("JWT secret key tidak diset");
  }

  try {
    // Verifikasi token menggunakan secret key
    const decodedToken = jwtDecode<AuthPayload>(token);
    if (decodedToken && (!decodedToken.exp || decodedToken.exp * 1000 > Date.now())) {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
      return payload; // Kembalikan payload jika valid
    }
    return null;
  } catch (error) {
    console.error("JWT validation error:", error);
    return null; // Kembalikan null jika token tidak valid
  }
};


export const checkTokenActive = (): 
  | { status: true; data: AuthPayload; cookieToken: string }
  | { status: false; data: number | string | null; cookieToken: string } => {
  const cookieAuth = document.cookie.split('; ').find((row) => row.startsWith('authToken='))?.split('=')[1];
  if (cookieAuth) {
    try {
      const decodedToken = jwtDecode<AuthPayload>(cookieAuth);

      if (decodedToken && (!decodedToken.exp || decodedToken.exp * 1000 > Date.now())) {
        return { status: true, data: decodedToken, cookieToken: cookieAuth }; // Token valid
      }
      console.log("Token tidak valid atau kedaluwarsa");
      return { status: false, data: 401, cookieToken: cookieAuth }; // Token invalid
    } catch (err) {
      console.error("Kesalahan validasi token:", err);
      return { status: false, data: null, cookieToken: cookieAuth }; // Error parsing
    }
  } else {
    return { status: false, data: null, cookieToken: cookieAuth || '-' }; // Tidak ada token
  }
};