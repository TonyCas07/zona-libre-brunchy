import { AdminShell } from "@/components/admin/admin-shell";
import { MemberActions } from "@/components/admin/member-actions";
import { NoteForm } from "@/components/admin/note-form";
import { SaleForm } from "@/components/admin/sale-form";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buildWhatsAppLink } from "@/lib/privacy";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: member } = await supabase.from("members_with_stats").select("*").eq("id", params.id).single();
  const { data: sales } = await supabase.from("sales").select("*").eq("member_id", params.id).order("sale_date", { ascending: false }).limit(25);
  const { data: notes } = await supabase.from("member_notes").select("*").eq("member_id", params.id).order("created_at", { ascending: false }).limit(20);
  const { data: logs } = await supabase.from("audit_logs").select("*").eq("entity_id", params.id).order("created_at", { ascending: false }).limit(20);

  if (!member) {
    return <AdminShell><h1 className="text-2xl font-bold">Miembro no encontrado</h1></AdminShell>;
  }

  const approvalMessage = `Hola ${member.full_name}, tu membresía Zona Libre Brunchy fue validada. Tu código es ${member.member_code || "{codigo}"}. Desde ahora puedes acceder a beneficios exclusivos al comprar directo con Brunchy. Recuerda que aplica según condiciones del programa.`;
  const rejectionMessage = `Hola ${member.full_name}, gracias por registrarte en Zona Libre Brunchy. En este momento no pudimos validar tu vínculo local con la Ciudad Colonial. Si deseas, puedes responder con una referencia adicional para revisar nuevamente tu solicitud.`;

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">{member.full_name}</h1>
          <p className="mt-1 text-foreground/65">{member.member_code || "Pendiente de código"} · Documento {member.document_masked}</p>
        </div>
        <StatusBadge status={member.status} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <Card>
            <h2 className="font-bold">Datos y relación local</h2>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div><dt className="text-foreground/55">WhatsApp</dt><dd>{member.whatsapp}</dd></div>
              <div><dt className="text-foreground/55">Email</dt><dd>{member.email || "-"}</dd></div>
              <div><dt className="text-foreground/55">Relación</dt><dd>{member.local_relationship}</dd></div>
              <div><dt className="text-foreground/55">Zona</dt><dd>{member.zone}</dd></div>
              <div className="md:col-span-2"><dt className="text-foreground/55">Referencia</dt><dd>{member.local_reference}</dd></div>
              <div><dt className="text-foreground/55">Organización</dt><dd>{member.organization_name || "-"}</dd></div>
              <div><dt className="text-foreground/55">Validación</dt><dd>{member.validation_method}</dd></div>
            </dl>
          </Card>
          <Card>
            <h2 className="font-bold">Preferencias y consentimientos</h2>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div><dt className="text-foreground/55">Canal</dt><dd>{member.preferred_contact_channel || "-"}</dd></div>
              <div><dt className="text-foreground/55">Compra</dt><dd>{member.preferred_purchase_channel || "-"}</dd></div>
              <div><dt className="text-foreground/55">Consumo</dt><dd>{member.preferred_consumption_type || "-"}</dd></div>
              <div><dt className="text-foreground/55">Comercial</dt><dd>{member.commercial_consent ? "Sí" : "No"}</dd></div>
              <div><dt className="text-foreground/55">Segmentación</dt><dd>{member.segmentation_consent ? "Sí" : "No"}</dd></div>
              <div><dt className="text-foreground/55">Delivery futuro</dt><dd>{member.wants_delivery_future ? "Sí" : "No"}</dd></div>
            </dl>
          </Card>
          <Card>
            <h2 className="font-bold">Historial de compras</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <tbody>
                  {(sales || []).map((sale) => (
                    <tr key={sale.id} className="border-t border-border">
                      <td className="p-2">{new Date(sale.sale_date).toLocaleDateString("es-DO")}</td>
                      <td className="p-2">{sale.purchase_channel}</td>
                      <td className="p-2">{sale.product_category || "-"}</td>
                      <td className="p-2">RD${Number(sale.net_amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold">Notas internas y auditoría</h2>
            <NoteForm memberId={member.id} />
            <div className="mt-4 grid gap-3 text-sm">
              {(notes || []).map((note) => <p key={note.id} className="rounded-md bg-muted p-3">{note.note}</p>)}
              {(logs || []).map((log) => <p key={log.id} className="text-foreground/60">{log.action} · {new Date(log.created_at).toLocaleString("es-DO")}</p>)}
            </div>
          </Card>
        </div>
        <div className="grid content-start gap-5">
          <Card>
            <h2 className="font-bold">Acciones</h2>
            <div className="mt-4"><MemberActions memberId={member.id} /></div>
          </Card>
          <Card>
            <h2 className="font-bold">Registrar compra</h2>
            <div className="mt-4"><SaleForm memberId={member.id} /></div>
          </Card>
          <Card>
            <h2 className="font-bold">Mensajes sugeridos</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <a className="rounded-md border border-border p-3 hover:bg-muted" href={buildWhatsAppLink(member.whatsapp, approvalMessage)} target="_blank">WhatsApp aprobación</a>
              <a className="rounded-md border border-border p-3 hover:bg-muted" href={buildWhatsAppLink(member.whatsapp, rejectionMessage)} target="_blank">WhatsApp revisión</a>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
