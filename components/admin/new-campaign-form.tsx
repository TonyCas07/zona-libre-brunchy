"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_CHANNELS, CONSUMPTION_TYPES, LOCAL_RELATIONSHIPS, ZONES } from "@/lib/constants";

export function NewCampaignForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const filters = {
      zone: formData.get("zone") || undefined,
      local_relationship: formData.get("local_relationship") || undefined,
      preferred_contact_channel: formData.get("preferred_contact_channel") || undefined,
      preferred_consumption_type: formData.get("preferred_consumption_type") || undefined,
      wants_delivery_future: formData.get("wants_delivery_future") === "on" ? true : undefined,
      without_sales: formData.get("without_sales") === "on" ? true : undefined
    };
    const response = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        objective: formData.get("objective"),
        message_template: formData.get("message_template"),
        segment_filters: filters
      })
    });

    if (!response.ok) {
      setError("No se pudo crear la campaña.");
      return;
    }

    router.push("/admin/campanas");
    router.refresh();
  }

  const defaultMessage = "Hola {nombre}, hoy tenemos beneficio especial para miembros Zona Libre Brunchy. Pide directo por WhatsApp y recibe tu beneficio como miembro local validado. Tu código es {codigo_miembro}.";

  return (
    <Card className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Nueva campaña</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input name="name" className="min-h-11 rounded-md border border-border px-3" placeholder="Nombre de campaña" />
        <input name="objective" className="min-h-11 rounded-md border border-border px-3" placeholder="Objetivo" />
        <textarea name="message_template" defaultValue={defaultMessage} className="min-h-32 rounded-md border border-border p-3" />
        <div className="grid gap-3 md:grid-cols-2">
          <select name="zone" className="min-h-11 rounded-md border border-border px-3"><option value="">Zona</option>{ZONES.map((item) => <option key={item}>{item}</option>)}</select>
          <select name="local_relationship" className="min-h-11 rounded-md border border-border px-3"><option value="">Tipo de miembro</option>{LOCAL_RELATIONSHIPS.map((item) => <option key={item}>{item}</option>)}</select>
          <select name="preferred_contact_channel" className="min-h-11 rounded-md border border-border px-3"><option value="">Canal preferido</option>{CONTACT_CHANNELS.map((item) => <option key={item}>{item}</option>)}</select>
          <select name="preferred_consumption_type" className="min-h-11 rounded-md border border-border px-3"><option value="">Consumo preferido</option>{CONSUMPTION_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <label className="flex gap-3 text-sm"><input name="wants_delivery_future" type="checkbox" />Interesados en delivery futuro</label>
        <label className="flex gap-3 text-sm"><input name="without_sales" type="checkbox" />Sin compra registrada</label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit">Crear campaña</Button>
      </form>
    </Card>
  );
}
