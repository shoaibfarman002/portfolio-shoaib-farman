import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:5173";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Shoaib Farman | Frontend Developer & UI/UX Designer",
      template: "%s | Shoaib Farman",
    },
    description:
      "Premium modern interactive developer portfolio for Shoaib Farman, frontend developer and UI/UX designer.",
    keywords: [
      "Shoaib Farman",
      "Frontend Developer",
      "React Developer",
      "UI UX Designer",
      "Tailwind CSS",
      "Developer Portfolio",
    ],
    authors: [{ name: "Shoaib Farman" }],
    creator: "Shoaib Farman",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Shoaib Farman | Interactive Developer Portfolio",
      description:
        "A polished portfolio for a frontend developer crafting modern React.js and UI/UX experiences.",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1664,
          height: 928,
          alt: "Shoaib Farman frontend developer portfolio preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Shoaib Farman | Interactive Developer Portfolio",
      description:
        "Frontend developer and UI/UX designer crafting modern React.js experiences.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
