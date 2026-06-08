import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { campaignSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const profile = await requireProfile(["super_admin", "admin"]);
  const parsed = campaignSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("campaigns").insert({ ...parsed.data, created_by: profile.id });
  if (error) return NextResponse.json({ error: "No se pudo crear la campaña." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
