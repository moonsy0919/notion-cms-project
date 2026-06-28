import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오 시작하기",
  description: "Notion API Key를 입력해 나만의 개발 포트폴리오를 시작하세요.",
  openGraph: {
    title: "포트폴리오 시작하기",
    description: "Notion API Key를 입력해 나만의 개발 포트폴리오를 시작하세요.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
