#!/bin/bash
# Stop 훅: 코드 작성 완료 후 TypeScript + ESLint 자동 검증
# exit 0 → 정상 종료 / exit 2 → Claude 재진입 강제 (오류 수정 유도)

MAX_RETRY=3

# ── 프로젝트 루트 자동 감지 ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COUNTER_FILE="/tmp/claude_verify_count_$(basename "$PROJECT_DIR")"

# ── 재진입 방어 1: stop_hook_active 플래그 ──────────────────────────
INPUT=$(cat)
HOOK_ACTIVE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('stop_hook_active','false'))" 2>/dev/null || echo "false")
if [ "$HOOK_ACTIVE" = "True" ] || [ "$HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

# ── 재진입 방어 2: 최대 재시도 횟수 ────────────────────────────────
RETRY_COUNT=0
if [ -f "$COUNTER_FILE" ]; then
  RETRY_COUNT=$(cat "$COUNTER_FILE")
fi

if [ "$RETRY_COUNT" -ge "$MAX_RETRY" ]; then
  echo "⚠️  검증을 ${MAX_RETRY}회 시도했으나 오류가 지속됩니다. 수동으로 확인해주세요."
  rm -f "$COUNTER_FILE"
  exit 0
fi

# ── 프로젝트 루트로 이동 ────────────────────────────────────────────
cd "$PROJECT_DIR" || exit 0

# ── TypeScript 타입 검사 ────────────────────────────────────────────
TSC_OUTPUT=$(npx --no tsc --noEmit 2>&1)
TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep "error TS")

# ── ESLint 검사 ─────────────────────────────────────────────────────
if [ -f "./node_modules/.bin/eslint" ]; then
  LINT_OUTPUT=$(./node_modules/.bin/eslint . 2>&1)
else
  LINT_OUTPUT=$(npm run lint 2>&1 | grep -v "^>" | grep -v "^$" | grep -v "^npm")
fi
LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep -E "^\s*(error|[0-9]+ error)" | head -20)

# ── 결과 분기 ───────────────────────────────────────────────────────
if [ -z "$TSC_ERRORS" ] && [ -z "$LINT_ERRORS" ]; then
  rm -f "$COUNTER_FILE"
  exit 0
fi

# ── 오류 발견: 카운터 증가 + 피드백 메시지 출력 ──────────────────────
RETRY_COUNT=$((RETRY_COUNT + 1))
echo "$RETRY_COUNT" > "$COUNTER_FILE"

FEEDBACK="코드 검증에서 오류가 발견되었습니다 (시도 ${RETRY_COUNT}/${MAX_RETRY}). 아래 오류를 모두 수정해주세요:\n\n"

if [ -n "$TSC_ERRORS" ]; then
  FEEDBACK+="## TypeScript 오류\n\`\`\`\n${TSC_ERRORS}\n\`\`\`\n\n"
fi

if [ -n "$LINT_ERRORS" ]; then
  FEEDBACK+="## ESLint 오류\n\`\`\`\n${LINT_OUTPUT}\n\`\`\`\n\n"
fi

FEEDBACK+="위 오류를 수정한 뒤 응답을 마무리해주세요."

printf "%b" "$FEEDBACK"
exit 2
