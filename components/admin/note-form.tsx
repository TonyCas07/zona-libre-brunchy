"use client";

import { Button } from "@/components/ui/button";

export function NoteForm({ memberId }: { memberId: string }) {
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await fetch(`/api/admin/members/${memberId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: formData.get("note") })
    });
    form.reset();
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-3">
      <textarea name="note" className="min-h-24 rounded-md border border-border p-3 text-sm" placeholder="Agregar nota interna" />
      <Button type="submit" variant="ghost">Guardar nota</Button>
    </form>
  );
}
