"use client";

import type { SubmitHandler } from "@formisch/react";
import { Form, Field as FormischField, useForm } from "@formisch/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LoginSchema, useLogin } from "@/features/auth";

/**
 * Trang login.
 *
 * Proxy Next.js đã đảm bảo:
 * - Nếu CHƯA có access_token cookie → cho vào trang này
 * - Nếu ĐÃ có access_token → redirect về / từ server
 *
 * Khi submit:
 *   client → /api/auth/login (BFF) → Django → set httpOnly cookie
 *   client KHÔNG thấy token bao giờ.
 */
export default function LoginPage() {
  return (
    <div className="flex flex-1 min-h-full items-center justify-center p-4">
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>con-wms</CardTitle>
          <CardDescription>Hệ thống quản lý vật tư</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  const form = useForm({ schema: LoginSchema });
  const login = useLogin();
  const router = useRouter();

  const handleSubmit: SubmitHandler<typeof LoginSchema> = (output) => {
    login.mutate(output, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <Form of={form} onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={["email"]}>
          {(field) => (
            <Field data-invalid={!!field.errors?.length || undefined}>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input
                {...field.props}
                id="login-email"
                type="email"
                value={field.input}
                autoComplete="email"
                placeholder="nhap@congty.vn"
              />
              <FieldError errors={field.errors?.map((e) => ({ message: e }))} />
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={["password"]}>
          {(field) => (
            <Field data-invalid={!!field.errors?.length || undefined}>
              <FieldLabel htmlFor="login-password">Mật khẩu</FieldLabel>
              <Input
                {...field.props}
                id="login-password"
                type="password"
                value={field.input}
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <FieldError errors={field.errors?.map((e) => ({ message: e }))} />
            </Field>
          )}
        </FormischField>

        {login.error && (
          <FieldError>
            {login.error.message ?? "Đăng nhập thất bại, vui lòng thử lại"}
          </FieldError>
        )}

        <Button type="submit" disabled={login.isPending} className="w-full">
          {login.isPending && <Spinner data-icon="inline-start" />}
          Đăng nhập
        </Button>
      </FieldGroup>
    </Form>
  );
}
