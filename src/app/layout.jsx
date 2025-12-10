import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "/fonts/Geist-Regular.woff2",
  variable: "--font-geist-sans",
  weight: "400",
});

const geistMono = localFont({
  src: "/fonts/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
  weight: "400",
});


export const metadata = {
  title: "Courier Application",
  description: "Developed by A&A Technologies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
