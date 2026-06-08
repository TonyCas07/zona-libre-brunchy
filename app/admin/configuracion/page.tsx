import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-bold">Configuración</h1>
      <Card className="mt-6">
        <h2 className="font-bold">Beneficio activo</h2>
        <p className="mt-2 text-sm text-foreground/70">Descuento equivalente ITBIS · 18% de referencia · beneficio comercial, no fiscal.</p>
        <p className="mt-3 rounded-md bg-muted p-3 text-sm">Beneficio aplicado como descuento comercial. No constituye exención fiscal.</p>
      </Card>
    </AdminShell>
  );
}
