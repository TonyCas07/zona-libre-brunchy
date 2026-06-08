import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/admin";
import { buildWhatsAppLink, personalizeCampaignMessage } from "@/lib/privacy";
import { toCsv } from "@/lib/csv";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const profile = await requireProfile(["super_admin", "admin"]);
  const supabase = createSupabaseAdminClient();
  const { data: campaign } = await supabase.from("campaigns").select("*").eq("id", params.id).single();
  if (!campaign) return NextResponse.json({ error: "Campaña no encontrada." }, { status: 404 });

  const filters = campaign.segment_filters || {};
  let query = supabase.from("members_with_stats").select("*").eq("status", "validated").eq("commercial_consent", true);
  for (const key of ["zone", "local_relationship", "preferred_contact_channel", "preferred_consumption_type", "wants_delivery_future"]) {
    if (filters[key] !== undefined && filters[key] !== "") query = query.eq(key, filters[key]);
  }
  if (filters.without_sales) query = query.eq("purchase_count", 0);

  const { data: members } = await query.limit(2000);
  const rows = (members || []).map((member) => {
    const message = personalizeCampaignMessage(campaign.message_template, member);
    return {
      Nombre: member.full_name,
      WhatsApp: member.whatsapp,
      "Código de miembro": member.member_code,
      "Tipo de miembro": member.local_relationship,
      Zona: member.zone,
      "Canal preferido": member.preferred_contact_channel,
      "Mensaje personalizado": message,
      "Link WhatsApp": buildWhatsAppLink(member.whatsapp, message)
    };
  });

  await supabase.from("campaign_exports").insert({ campaign_id: campaign.id, exported_by: profile.id, export_count: rows.length });
  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="campana-${campaign.id}.csv"`
    }
  });
}
