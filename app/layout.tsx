import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";

import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Illamu.lk - Rent Anything, Anywhere in Sri Lanka",
  description: "Sri Lanka's Premier Rental Marketplace. Rent electronics, vehicles, equipment, and more securely.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <Navbar />

        {children}
        {/* position එක top-center කිරීමෙන් notification එක හරියටම මැදින් පැහැදිලිව පෙනේ */}
        <Toaster 
          richColors 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
              fontSize: '15px',
              padding: '16px 20px',
              borderRadius: '16px',
            },
          }}
        />
      </body>
    </html>
  );
}




// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>

//         <Navbar />
//         {children}
//         <Toaster richColors position="top-right" />
//       </body>
//     </html>
//   );
// }