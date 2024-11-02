import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./layouts/Header"; // Fixed the typo from Hedaer to Header
import RootContextProvider from "./store";
import clsx from "clsx";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Patlytics - take home assignment",
  description: "Patlytics - take home assignment.",
  // metadataBase: new URL("https://lifetime.cx"), // Replace with your actual domain
  // openGraph: {
  //   images: [
  //     {
  //       url: "/thumbnail2.png",
  //       width: 800,
  //       height: 450,
  //       alt: "Logo",
  //     },
  //   ],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
        <script src="https://unpkg.com/p5.js-svg@1.5.1"></script> */}
      </head>
      <RootContextProvider>
        <body suppressHydrationWarning className={clsx(inter.className, "")}>
          <Header className="z-20" /> {/* Fixed the typo here as well */}
          <div className="flex w-full overflow-x-hidden max-w-[1920px] mx-auto">
            {children}
          </div>
        </body>
      </RootContextProvider>
    </html>
  );
}
