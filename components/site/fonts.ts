import { Martian_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";

export const mono = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export const sans = GeistSans;
