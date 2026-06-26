import { spawn } from "child_process";
import { rm } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

/** 개발 전용 — Notion 프로젝트 업데이트 API (fill-notion 실행 + ISR 캐시 초기화) */
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not allowed", { status: 403 });
  }

  const encoder = new TextEncoder();
  let child: ReturnType<typeof spawn> | null = null;

  /** SSE 이벤트 인코딩 */
  const encode = (obj: object) =>
    encoder.encode(`data: ${JSON.stringify(obj)}\n\n`);

  const stream = new ReadableStream({
    start(controller) {
      child = spawn(
        path.join(process.cwd(), "node_modules/.bin/tsx"),
        ["--env-file=.env.local", "scripts/github-to-notion.ts"],
        { cwd: process.cwd(), env: process.env, stdio: ["ignore", "pipe", "pipe"] }
      );

      /** stdout/stderr를 줄 단위로 SSE 스트리밍 */
      const pushLines = (chunk: Buffer) => {
        chunk
          .toString("utf-8")
          .split("\n")
          .filter(Boolean)
          .forEach((line) => controller.enqueue(encode({ type: "log", line })));
      };

      child.stdout?.on("data", pushLines);
      child.stderr?.on("data", pushLines);

      child.on("close", async (code) => {
        try {
          await rm(
            path.join(process.cwd(), ".next/cache/fetch-cache"),
            { recursive: true, force: true }
          );
          revalidatePath("/", "layout");
        } catch {
          // 캐시 디렉토리가 없어도 정상 진행
        }
        controller.enqueue(encode({ type: "done", success: code === 0 }));
        controller.close();
      });

      child.on("error", (err) => {
        controller.enqueue(encode({ type: "error", message: err.message }));
        controller.close();
      });
    },
    cancel() {
      child?.kill("SIGTERM");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
