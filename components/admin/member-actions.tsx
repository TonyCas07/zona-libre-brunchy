"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MemberActions({ memberId }: { memberId: string }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: string) {
    setLoading(status);
    await fetch(`/api/admin/members/${memberId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason })
    });
    window.location.reload();
  }

  return (
    <div className="grid gap-3">
      <textarea
        className="min-h-24 rounded-md border border-border p-3 text-sm"
        placeholder="Razón interna para rechazo, suspensión o reactivación"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Button disabled={!!loading} onClick={() => updateStatus("validated")}>Aprobar</Button>
        <Button variant="ghost" disabled={!!loading} onClick={() => updateStatus("rejected")}>Rechazar</Button>
        <Button variant="secondary" disabled={!!loading} onClick={() => updateStatus("suspended")}>Suspender</Button>
        <Button variant="ghost" disabled={!!loading} onClick={() => updateStatus("pending")}>Reactivar a pendiente</Button>
      </div>
    </div>
  );
}
