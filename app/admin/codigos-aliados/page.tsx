import { AdminShell } from "@/components/admin/admin-shell";
import { AllyCodesManager } from "@/components/admin/ally-codes-manager";

export default function AllyCodesPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-bold">Códigos aliados</h1>
      <p className="mt-1 text-foreground/65">Códigos para captar trabajadores y comercios cercanos, manteniendo validación administrativa.</p>
      <AllyCodesManager />
    </AdminShell>
  );
}
