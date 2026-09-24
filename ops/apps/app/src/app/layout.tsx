import "./globals.css";

export const metadata = {
  title: "eevolvv ops",
  description: "eevolvv operator review. This app is not the marketing site.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
