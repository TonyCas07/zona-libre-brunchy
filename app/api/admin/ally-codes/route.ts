import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { allyCodeSchema } from "@/lib/validators";

export async function GET() {
  await requireProfile(["super_admin", "admin"]);
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("ally_codes_with_counts").select("*").order("created_at", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  await requireProfile(["super_admin", "admin"]);
  const parsed = allyCodeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("ally_codes").insert(parsed.data);
  if (error) return NextResponse.json({ error: "No se pudo crear el código." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
