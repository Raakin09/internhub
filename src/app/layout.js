import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  title: "InternHub — Find Your Dream Internship & Job",
  description:
    "India's leading platform for internships, fresher jobs, and online training. Discover thousands of opportunities from top companies worldwide. Apply, track, and land your dream role.",
  keywords: "internships, jobs, fresher jobs, online training, career, students, resume builder",
  openGraph: {
    title: "InternHub — Find Your Dream Internship & Job",
    description: "India's leading platform for internships, fresher jobs, and online training.",
    type: "website",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
