// import './globals.css'; // your global styles, adjust if needed
// import { Poppins } from 'next/font/google';
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import KeepAlivePing from "@/components/global/KeepAlivePing";
// app/layout.tsx
// @ts-expect-error: no type declarations for this side-effect CSS import
import "./globals.css";
import { Raleway, Playfair_Display, Lato } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-opensans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${playfair.variable} ${lato.variable}`}
    >
      <head>
        <link rel="icon" href="/images/robofly.png" type="image/png" />
      </head>
      <body>
        <KeepAlivePing />
        <Navbar />

        <main className="min-h-screen overflow-x-hidden pt-16">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
