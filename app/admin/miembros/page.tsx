import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function MembersPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const supabase = createSupabaseServerClient();
  const q = searchParams.q || "";
  const status = searchParams.status || "";
  let query = supabase
    .from("members_with_stats")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,whatsapp.ilike.%${q}%,member_code.ilike.%${q}%,document_number_last4.eq.${q}`);
  }
  if (status) query = query.eq("status", status);

  const { data: members } = await query;

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold">Miembros</h1>
          <p className="mt-1 text-foreground/65">Búsqueda por nombre, WhatsApp, código o últimos 4 dígitos.</p>
        </div>
        <a className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href="/api/admin/export/members">Exportar operativa</a>
      </div>
      <form className="mb-4 grid gap-3 rounded-lg border border-border bg-white p-4 md:grid-cols-[1fr_220px_120px]">
        <input name="q" defaultValue={q} className="min-h-11 rounded-md border border-border px-3" placeholder="Buscar miembro" />
        <select name="status" defaultValue={status} className="min-h-11 rounded-md border border-border px-3">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="validated">Validado</option>
          <option value="rejected">Rechazado</option>
          <option value="suspended">Suspendido</option>
        </select>
        <button className="rounded-md bg-primary px-4 py-2 font-semibold text-white">Filtrar</button>
      </form>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[1050px] border-collapse text-sm">
          <thead className="bg-muted text-left">
            <tr>
              {["Código", "Nombre", "WhatsApp", "Tipo", "Zona", "Estado", "Canal", "Consentimiento", "Registro", "Última compra", "Compras", "Ticket prom."].map((header) => (
                <th key={header} className="p-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(members || []).map((member) => (
              <tr key={member.id} className="border-t border-border">
                <td className="p-3"><Link className="font-semibold text-primary" href={`/admin/miembros/${member.id}`}>{member.member_code || "Sin código"}</Link></td>
                <td className="p-3">{member.full_name}</td>
                <td className="p-3">{member.whatsapp}</td>
                <td className="p-3">{member.local_relationship}</td>
                <td className="p-3">{member.zone}</td>
                <td className="p-3"><StatusBadge status={member.status} /></td>
                <td className="p-3">{member.preferred_contact_channel || "-"}</td>
                <td className="p-3">{member.commercial_consent ? "Sí" : "No"}</td>
                <td className="p-3">{new Date(member.created_at).toLocaleDateString("es-DO")}</td>
                <td className="p-3">{member.last_purchase_at ? new Date(member.last_purchase_at).toLocaleDateString("es-DO") : "-"}</td>
                <td className="p-3">{member.purchase_count || 0}</td>
                <td className="p-3">RD${Number(member.average_ticket || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
