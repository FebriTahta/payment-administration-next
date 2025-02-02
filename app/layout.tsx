import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Lights } from "@/components/background/lights";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Header from "@/components/header";
import { PaymentDetailProvider } from "@/context/payment-detail-context";
import { PaymentOptionProvider } from "@/context/payment-option-context";
import { BottomMenu } from "@/components/navigation/bottom-menu";
import { Starfall } from "@/components/background/star-fall";
import { SearchDataProvider } from "@/context/search-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const appURL = () => {
  const isProd = process.env.NEXT_PUBLIC_STATUS_PROD === 'true';
  return isProd 
      ? process.env.NEXT_PUBLIC_PROD_URL 
      : process.env.NEXT_PUBLIC_DEMO_URL;
};

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend.paysmkkrian1.site"), // Ganti dengan domain produksi Anda
  title: "Payment Administration",
  description: "Welcome to the digital payment system for schools and active education levels",
  openGraph: {
    title: "Payment Administration",
    description: "Welcome to the digital payment system for schools and active education levels",
    url: "https://frontend.paysmkkrian1.site", // Pastikan ini sesuai dengan domain yang digunakan
    siteName: "Payment Administration",
    images: [
      {
        url: "https://frontend.paysmkkrian1.site/rp_logo.png", // Gunakan path absolut jika gambar tidak muncul
        width: 500,
        height: 500,
        alt: "Payment Administration Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment Administration",
    description: "Welcome to the digital payment system for schools and active education levels",
    images: ["https://frontend.paysmkkrian1.site/rp_logo.png"], // Gunakan path absolut jika gambar tidak muncul
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
       <body
        className={`${geistSans.variable} ${geistMono.variable} w-full min-h-screen relative overflow-hidden flex items-center justify-center antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <Starfall/>
          <Header />
          <Toaster />
          <PaymentDetailProvider>
            <PaymentOptionProvider>
              <SearchDataProvider>
                {children}
              </SearchDataProvider>
            </PaymentOptionProvider>
          </PaymentDetailProvider>
          <div className="absolute inset-0 z-0 animate-appear opacity-0">
            <Lights />
          </div>
          <BottomMenu/>
        </ThemeProvider>
      </body>
    </html>
  );
}
