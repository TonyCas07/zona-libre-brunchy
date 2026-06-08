import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireProfile } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";

const noteSchema = z.object({ note: z.string().trim().min(2) });

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const profile = await requireProfile(["super_admin", "admin", "staff"]);
  const parsed = noteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Nota inválida." }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("member_notes").insert({
    member_id: params.id,
    note: parsed.data.note,
    created_by: profile.id
  });

  if (error) return NextResponse.json({ error: "No se pudo guardar la nota." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
