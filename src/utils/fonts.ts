import {
  Poppins as FontPoppins,
  Saira as FontSaira,
  Oswald as FontOswald,
  PT_Sans_Narrow as FontPTSansNarrow,
} from "next/font/google";

export const Poppins = FontPoppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const Saira = FontSaira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
});

export const Oswald = FontOswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const PTSansNarrow = FontPTSansNarrow({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans-narrow",
});
