import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevCatalyst — Ship with momentum",
  description: "The developer workspace for teams who build fast.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
