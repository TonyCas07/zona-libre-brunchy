import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { saleSchema } from "@/lib/validators";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const profile = await requireProfile(["super_admin", "admin", "staff"]);
  const parsed = saleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sales").insert({
    member_id: params.id,
    ...parsed.data,
    sale_date: parsed.data.sale_date || new Date().toISOString(),
    created_by: profile.id
  });

  if (error) return NextResponse.json({ error: "No se pudo registrar la compra." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
