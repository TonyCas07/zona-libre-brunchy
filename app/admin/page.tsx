import { AdminShell } from "@/components/admin/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { Card } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { count: total } = await supabase.from("members").select("*", { count: "exact", head: true });
  const statuses = await Promise.all(
    ["pending", "validated", "rejected", "suspended"].map(async (status) => {
      const { count } = await supabase.from("members").select("*", { count: "exact", head: true }).eq("status", status);
      return [status, count || 0] as const;
    })
  );
  const { count: commercial } = await supabase.from("members").select("*", { count: "exact", head: true }).eq("commercial_consent", true);
  const { count: delivery } = await supabase.from("members").select("*", { count: "exact", head: true }).eq("wants_delivery_future", true);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { count: last7 } = await supabase.from("members").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo);
  const { count: last30 } = await supabase.from("members").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-foreground/65">Indicadores básicos del PMV Zona Libre Brunchy.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total de registros" value={total || 0} />
        {statuses.map(([status, count]) => <KpiCard key={status} label={status} value={count} />)}
        <KpiCard label="Últimos 7 días" value={last7 || 0} />
        <KpiCard label="Últimos 30 días" value={last30 || 0} />
        <KpiCard label="Autorización comercial" value={commercial || 0} />
        <KpiCard label="Interés en delivery" value={delivery || 0} />
      </div>
      <Card className="mt-6">
        <h2 className="font-bold">Reportes disponibles</h2>
        <p className="mt-2 text-sm text-foreground/70">Usa las secciones de miembros, campañas y ventas para filtrar y exportar. Los documentos sensibles no se exportan.</p>
      </Card>
    </AdminShell>
  );
}
