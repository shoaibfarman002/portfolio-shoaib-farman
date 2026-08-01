import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Shoaib Farman | Frontend Developer & UI/UX Designer",
  description:
    "Premium interactive portfolio of Shoaib Farman, a frontend developer and UI/UX designer crafting modern React experiences.",
};

export default function Home() {
  return <PortfolioClient />;
}
