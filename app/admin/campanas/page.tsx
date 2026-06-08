import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function CampaignsPage() {
  const supabase = createSupabaseServerClient();
  const { data: campaigns } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campañas</h1>
          <p className="mt-1 text-foreground/65">Genera listas exportables para WhatsApp. No se envían mensajes automáticamente.</p>
        </div>
        <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href="/admin/campanas/nueva">Nueva campaña</Link>
      </div>
      <div className="grid gap-3">
        {(campaigns || []).map((campaign) => (
          <div key={campaign.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="font-bold">{campaign.name}</h2>
                <p className="text-sm text-foreground/65">{campaign.objective || "Sin objetivo"}</p>
              </div>
              <a className="rounded-md border border-border px-3 py-2 text-sm font-semibold" href={`/api/admin/campaigns/${campaign.id}/export`}>Exportar CSV</a>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
