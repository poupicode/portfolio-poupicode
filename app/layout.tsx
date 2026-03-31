import type { Metadata } from "next";
import "./globals.css";
import { Bebas_Neue } from "next/font/google";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Portfolio - PoupiCode",
  description: "Développeur Web Full Stack - Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={bebasNeue.className}>
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
