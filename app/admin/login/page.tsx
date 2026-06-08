"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });

    if (authError) {
      setError("Credenciales inválidas o usuario sin acceso.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Acceso administrativo</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input name="email" type="email" className="min-h-11 rounded-md border border-border px-3" placeholder="correo@brunchy.do" />
          <input name="password" type="password" className="min-h-11 rounded-md border border-border px-3" placeholder="Contraseña" />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </main>
  );
}
