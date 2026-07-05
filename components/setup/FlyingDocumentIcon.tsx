"use client";

import { useEffect, useState } from "react";
import { Files } from "lucide-react";

interface FlyingDocumentIconProps {
  startRect: DOMRect;
  endRect: DOMRect;
  iconBgClassName: string;
  onArrived: () => void;
}

/** 병합된 문서 아이콘이 "계속하기" 버튼 위치로 날아가 사라지는 오버레이 애니메이션 */
export function FlyingDocumentIcon({
  startRect,
  endRect,
  iconBgClassName,
  onArrived,
}: FlyingDocumentIconProps) {
  const [style, setStyle] = useState({ x: 0, y: 0, scale: 1, opacity: 1 });

  useEffect(() => {
    const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
    const scale = Math.max(0.4, endRect.height / startRect.height);
    const frame = requestAnimationFrame(() => {
      setStyle({ x: dx, y: dy, scale, opacity: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [startRect, endRect]);

  return (
    <div
      onTransitionEnd={onArrived}
      className={`pointer-events-none fixed z-50 flex items-center justify-center rounded-full border-2 border-green-500 transition-all duration-[600ms] ease-in ${iconBgClassName}`}
      style={{
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        transform: `translate(${style.x}px, ${style.y}px) scale(${style.scale})`,
        opacity: style.opacity,
      }}
    >
      <Files className="h-4 w-4 text-white" />
    </div>
  );
}
