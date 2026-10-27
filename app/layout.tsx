import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevCatalyst | Student Community",
  description: "A student community that builds connection through technology, events, and collaboration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
