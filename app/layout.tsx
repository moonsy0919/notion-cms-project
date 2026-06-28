import type { Metadata } from "next";
import { cookies } from "next/headers";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("developer-profile")?.value;
  let name = "개발자";
  if (raw) {
    try {
      const profile = JSON.parse(raw) as { name?: string };
      if (profile.name) name = profile.name;
    } catch {
      // 파싱 실패 시 기본값 사용
    }
  }
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name} | 포트폴리오`,
    },
    description: "Notion CMS 기반 개인 포트폴리오 웹사이트",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
