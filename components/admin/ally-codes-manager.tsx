"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZONES } from "@/lib/constants";

type AllyCode = {
  id: string;
  organization_name: string;
  code: string;
  zone: string | null;
  status: string;
  associated_registrations?: number;
};

export function AllyCodesManager() {
  const [codes, setCodes] = useState<AllyCode[]>([]);

  async function load() {
    const response = await fetch("/api/admin/ally-codes");
    setCodes(await response.json());
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch("/api/admin/ally-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    await load();
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[380px_1fr]">
      <Card>
        <h2 className="font-bold">Nuevo código</h2>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <input name="organization_name" className="min-h-11 rounded-md border border-border px-3" placeholder="Comercio / empresa / institución" />
          <input name="code" className="min-h-11 rounded-md border border-border px-3" placeholder="Código aliado" />
          <input name="contact_name" className="min-h-11 rounded-md border border-border px-3" placeholder="Persona de contacto" />
          <input name="contact_phone" className="min-h-11 rounded-md border border-border px-3" placeholder="Teléfono" />
          <select name="zone" className="min-h-11 rounded-md border border-border px-3"><option value="">Zona</option>{ZONES.map((item) => <option key={item}>{item}</option>)}</select>
          <textarea name="notes" className="min-h-20 rounded-md border border-border p-3" placeholder="Notas" />
          <Button type="submit">Guardar</Button>
        </form>
      </Card>
      <div className="grid content-start gap-3">
        {codes.map((code) => (
          <Card key={code.id}>
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="font-bold">{code.organization_name}</h2>
                <p className="text-sm text-foreground/65">{code.code} · {code.zone || "Sin zona"} · {code.associated_registrations || 0} registros</p>
              </div>
              <span className="text-sm font-semibold">{code.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
