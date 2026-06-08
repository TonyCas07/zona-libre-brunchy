import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

const reports = [
  "Miembros por estado", "Miembros por zona", "Miembros por tipo de relación local", "Miembros por canal de contacto",
  "Miembros por preferencia de consumo", "Miembros con interés en delivery", "Miembros captados por código aliado",
  "Ventas por canal", "Ventas por categoría de producto", "Ticket promedio", "Clientes sin compra", "Clientes recurrentes",
  "Clientes inactivos", "Base disponible para campañas comerciales"
];

export default function ReportsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-bold">Reportes</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => <Card key={report}><h2 className="font-bold">{report}</h2><p className="mt-2 text-sm text-foreground/65">Disponible mediante vistas SQL y filtros administrativos.</p></Card>)}
      </div>
    </AdminShell>
  );
}
