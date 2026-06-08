import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/admin";
import { generateMemberCode } from "@/lib/privacy";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { statusUpdateSchema } from "@/lib/validators";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const profile = await requireProfile(["super_admin", "admin"]);
  const parsed = statusUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: member } = await supabase.from("members").select("*").eq("id", params.id).single();
  if (!member) return NextResponse.json({ error: "Miembro no encontrado." }, { status: 404 });

  const update: Record<string, unknown> = { status: parsed.data.status, updated_at: new Date().toISOString() };

  if (parsed.data.status === "validated") {
    const { data: nextValue } = await supabase.rpc("next_member_code_number");
    update.member_code = member.member_code || generateMemberCode(Number(nextValue || 1));
    update.validated_at = new Date().toISOString();
    update.validated_by = profile.id;
  }

  if (parsed.data.status === "rejected") {
    update.rejected_at = new Date().toISOString();
    update.rejected_by = profile.id;
    update.rejection_reason = parsed.data.reason || null;
  }

  if (parsed.data.status === "suspended") {
    update.suspended_at = new Date().toISOString();
    update.suspended_by = profile.id;
    update.suspension_reason = parsed.data.reason || null;
  }

  const { error } = await supabase.from("members").update(update).eq("id", params.id);
  if (error) return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });

  await supabase.from("audit_logs").insert({
    actor_id: profile.id,
    entity_type: "member",
    entity_id: params.id,
    action: `status:${member.status}->${parsed.data.status}`,
    old_value: { status: member.status },
    new_value: update
  });

  return NextResponse.json({ ok: true });
}
