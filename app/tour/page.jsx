// app/tour/page.jsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TourIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tour/briefing");
  }, [router]);

  return null;
}
