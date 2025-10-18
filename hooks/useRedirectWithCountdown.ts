// hooks/useRedirectWithCountdown.ts
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRedirectWithCountdown(seconds: number, target: string) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(seconds || 5);

  useEffect(() => {
    if (countdown <= 0) {
      router.replace(target as any);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, target]);

  return countdown;
}
