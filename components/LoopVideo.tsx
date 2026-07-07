"use client";

import EagerLoopVideo from "@/components/EagerLoopVideo";

type Props = {
  /** Base path without extension, e.g. "/video/brand". Looks up .webm/.mp4/.jpg. */
  src: string;
  className?: string;
  priority?: boolean;
};

export default function LoopVideo({ src, className = "" }: Props) {
  return <EagerLoopVideo base={src} className={className} />;
}
