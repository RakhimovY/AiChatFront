"use client";

import { useDemoStore } from "@/store/demoStore";
import { useEffect, useState } from "react";

export default function DemoInfo() {
  const { requestCount } = useDemoStore();
  const [mounted, setMounted] = useState(false);

  // Only show the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same height and styling to prevent layout shift
    return (
      <div className="px-4 py-2 bg-primary/10 text-sm text-center">
        <span className="font-medium">Демо-режим:</span> Загрузка...
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-primary/10 text-sm text-center">
      <span className="font-medium">Демо-режим:</span> Использовано {requestCount} из 10 запросов
    </div>
  );
}