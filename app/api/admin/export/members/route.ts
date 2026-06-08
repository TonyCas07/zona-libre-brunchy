import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/admin";
import { toCsv } from "@/lib/csv";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  await requireProfile(["super_admin", "admin"]);
  const supabase = createSupabaseServerClient();
  const { data: members } = await supabase.from("members_with_stats").select("*").limit(5000);
  const rows = (members || []).map((member) => ({
    "Código miembro": member.member_code,
    Nombre: member.full_name,
    WhatsApp: member.whatsapp,
    Email: member.email,
    "Tipo miembro": member.local_relationship,
    Zona: member.zone,
    Estado: member.status,
    "Canal preferido": member.preferred_contact_channel,
    "Consentimiento comercial": member.commercial_consent ? "Sí" : "No",
    "Fecha registro": member.created_at,
    "Última compra": member.last_purchase_at,
    "Número compras": member.purchase_count,
    "Ticket promedio": member.average_ticket
  }));

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=miembros-operativa.csv"
    }
  });
}
