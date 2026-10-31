import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: number;
}

export function Marquee({ children, pauseOnHover = false, direction = "left", speed = 30, className, ...props }: MarqueeProps) {
  return (
    <div className={cn("w-full overflow-hidden motion-reduce:overflow-x-auto", className)} {...props}>
      <div className="relative flex py-5">
        <div
          className={cn("flex w-max animate-marquee motion-reduce:animate-none", pauseOnHover && "hover:[animation-play-state:paused]", direction === "right" && "animate-marquee-reverse")}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          <div className="shrink-0">{children}</div>
          <div aria-hidden="true" className="shrink-0 motion-reduce:hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
