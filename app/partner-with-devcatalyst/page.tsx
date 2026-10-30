import type { Metadata } from "next";
import PartnerWithDevCatalyst from "@/components/sections/partner-with-devcatalyst";

export const metadata: Metadata = {
  title: "Why Partner with DevCatalyst?",
  description: "Explore ways for companies and industry teams to collaborate with the DevCatalyst student community.",
};

export default function PartnerPage() {
  return <PartnerWithDevCatalyst />;
}
