import type { Metadata, Viewport } from "next";
import { MaxWidthWrapper, cn, ThemeProvider } from "@/lib";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Header } from "@/components/reusables";
import Loader from "@/components/Loader"; // Add this import

export const metadata: Metadata = {
  title: "LoFT3 | Web3 Events",
  description: "Exclusive Web3 events and experiences",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("m-auto min-h-screen bg-background bg-center bg-no-repeat scroll-smooth antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Changed to dark for black/gold theme
          enableSystem
          disableTransitionOnChange
        >
          {/* Loading Screen - Shows first, then auto-hides */}
          <Loader />
          
          {/* Progress Bar */}
          <NextTopLoader
            color="#D4AF37" // Gold color
            height={3}
            showSpinner={false}
            easing="ease"
            shadow="0 0 10px #D4AF37, 0 0 5px #D4AF37"
          />
          
          {/* Your Header */}
          <Header />
          
          {/* Main Content */}
          <MaxWidthWrapper>{children}</MaxWidthWrapper>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            expand={false}
            theme="dark"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                border: '1px solid #D4AF37',
                color: '#fff',
              },
            }}
          />
          
          {/* Analytics */}
          <GoogleAnalytics gaId="" />
          <GoogleTagManager gtmId="" />
        </ThemeProvider>
      </body>
    </html>
  );
}