"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfile, useLogout } from "@/features/auth";

export default function Home() {
  const router = useRouter();
  const { data: profile, isLoading } = useGetProfile();
  const logout = useLogout();

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">
        Xin chào, {profile?.firstName ?? "bạn"}!
      </h1>

      <p className="text-muted-foreground">Dashboard đang được xây dựng...</p>

      <Button
        variant="outline"
        onClick={() =>
          logout.mutate(undefined, { onSuccess: () => router.push("/login") })
        }
        disabled={logout.isPending}
      >
        {logout.isPending && <Spinner data-icon="inline-start" />}
        Đăng xuất
      </Button>
    </div>
  );
}
