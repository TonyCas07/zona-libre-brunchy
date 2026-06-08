"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DISCOUNT_TYPES, PRODUCT_CATEGORIES, SALE_CHANNELS } from "@/lib/constants";

export function SaleForm({ memberId }: { memberId: string }) {
  const [gross, setGross] = useState("0");
  const [discount, setDiscount] = useState("0");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const grossAmount = Number(formData.get("gross_amount") || 0);
    const discountAmount = Number(formData.get("discount_amount") || 0);
    await fetch(`/api/admin/members/${memberId}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purchase_channel: formData.get("purchase_channel"),
        gross_amount: grossAmount,
        discount_type: formData.get("discount_type") || undefined,
        discount_amount: discountAmount,
        net_amount: Math.max(grossAmount - discountAmount, 0),
        product_category: formData.get("product_category") || undefined,
        notes: formData.get("notes")
      })
    });
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <select name="purchase_channel" className="min-h-11 rounded-md border border-border px-3">
        {SALE_CHANNELS.map((item) => <option key={item}>{item}</option>)}
      </select>
      <div className="grid gap-3 md:grid-cols-3">
        <input name="gross_amount" value={gross} onChange={(e) => setGross(e.target.value)} className="min-h-11 rounded-md border border-border px-3" placeholder="Monto bruto" />
        <input name="discount_amount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="min-h-11 rounded-md border border-border px-3" placeholder="Descuento" />
        <input readOnly value={Math.max(Number(gross) - Number(discount), 0).toFixed(2)} className="min-h-11 rounded-md border border-border bg-muted px-3" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <select name="discount_type" className="min-h-11 rounded-md border border-border px-3">
          <option value="">Tipo de descuento</option>
          {DISCOUNT_TYPES.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select name="product_category" className="min-h-11 rounded-md border border-border px-3">
          <option value="">Categoría</option>
          {PRODUCT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <textarea name="notes" className="min-h-20 rounded-md border border-border p-3" placeholder="Notas" />
      <Button type="submit">Registrar compra</Button>
    </form>
  );
}
