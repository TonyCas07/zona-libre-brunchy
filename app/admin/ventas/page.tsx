import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { createSupabaseServerClient } from "@/lib/supabase";

type SaleRow = {
  id: string;
  member_id: string;
  sale_date: string;
  purchase_channel: string;
  product_category: string | null;
  gross_amount: number | string;
  discount_amount: number | string;
  net_amount: number | string;
  members: { full_name: string; member_code: string | null } | null;
};

export default async function SalesPage() {
  const supabase = createSupabaseServerClient();
  const { data: sales } = await supabase.from("sales").select("*, members(full_name, member_code)").order("sale_date", { ascending: false }).limit(100);

  return (
    <AdminShell>
      <h1 className="text-3xl font-bold">Ventas</h1>
      <p className="mt-1 text-foreground/65">El registro manual de compras se realiza desde el detalle de cada miembro.</p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted text-left"><tr>{["Fecha", "Miembro", "Canal", "Categoría", "Bruto", "Descuento", "Neto"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {((sales || []) as SaleRow[]).map((sale) => (
              <tr key={sale.id} className="border-t border-border">
                <td className="p-3">{new Date(sale.sale_date).toLocaleDateString("es-DO")}</td>
                <td className="p-3"><Link className="text-primary" href={`/admin/miembros/${sale.member_id}`}>{sale.members?.full_name}</Link></td>
                <td className="p-3">{sale.purchase_channel}</td>
                <td className="p-3">{sale.product_category || "-"}</td>
                <td className="p-3">RD${Number(sale.gross_amount).toFixed(2)}</td>
                <td className="p-3">RD${Number(sale.discount_amount).toFixed(2)}</td>
                <td className="p-3">RD${Number(sale.net_amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
