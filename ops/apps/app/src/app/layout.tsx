export const metadata = {
  title: "eevolvv",
  description: "eevolvv ops",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
