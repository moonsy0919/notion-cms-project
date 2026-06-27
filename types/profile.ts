/** 개발자 프로필 데이터 구조 */
export interface DeveloperProfile {
  name: string;
  role: string;
  focus: string;
  location: string;
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
}

/** 프로필 미설정 시 기본값 */
export const DEFAULT_PROFILE: DeveloperProfile = {
  name: "개발자",
  role: "Frontend Developer",
  focus: "Next.js & TypeScript",
  location: "대한민국",
  skills: {
    frontend: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    backend: ["Node.js"],
    tools: ["Git", "Notion", "Vercel"],
  },
};
