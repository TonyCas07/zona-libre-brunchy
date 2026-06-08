import { NextRequest, NextResponse } from "next/server";
import { hashDocumentNumber, normalizeDocumentNumber, normalizePhone } from "@/lib/privacy";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { memberRegistrationSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = memberRegistrationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Datos inválidos." }, { status: 400 });
  }

  const input = parsed.data;
  const supabase = createSupabaseAdminClient();
  const normalizedDocument = normalizeDocumentNumber(input.document_number);
  const documentHash = hashDocumentNumber(normalizedDocument);
  const documentLast4 = normalizedDocument.slice(-4);
  const whatsappNormalized = normalizePhone(input.whatsapp);

  const { data: allyCode, error: allyError } = input.ally_code
    ? await supabase.from("ally_codes").select("id,status").eq("code", input.ally_code.toUpperCase().replace(/\s+/g, "")).maybeSingle()
    : { data: null, error: null };

  if (allyError) {
    return NextResponse.json({ error: "No pudimos validar el código aliado." }, { status: 400 });
  }

  if (input.ally_code && (!allyCode || allyCode.status !== "active")) {
    return NextResponse.json({ error: "El código aliado no existe o no está activo." }, { status: 400 });
  }

  const { data: duplicate } = await supabase
    .from("members")
    .select("id")
    .or(`document_number_hash.eq.${documentHash},whatsapp_normalized.eq.${whatsappNormalized}`)
    .maybeSingle();

  if (duplicate) {
    return NextResponse.json({ error: "Ya existe una solicitud asociada a este documento o WhatsApp." }, { status: 409 });
  }

  const { error } = await supabase.from("members").insert({
    status: "pending",
    full_name: input.full_name,
    document_type: input.document_type,
    document_number_hash: documentHash,
    document_number_last4: documentLast4,
    whatsapp: input.whatsapp,
    whatsapp_normalized: whatsappNormalized,
    email: input.email || null,
    birth_date: input.birth_date || null,
    instagram: input.instagram || null,
    local_relationship: input.local_relationship,
    zone: input.zone,
    local_reference: input.local_reference,
    organization_name: input.organization_name || null,
    role_or_activity: input.role_or_activity || null,
    ally_code_id: allyCode?.id || null,
    validation_method: input.validation_method,
    declaration_truth: input.declaration_truth,
    preferred_contact_channel: input.preferred_contact_channel || null,
    preferred_purchase_channel: input.preferred_purchase_channel || null,
    preferred_consumption_type: input.preferred_consumption_type || null,
    purchase_frequency: input.purchase_frequency || null,
    preferred_time_slot: input.preferred_time_slot || null,
    buys_for: input.buys_for || null,
    approximate_people: input.approximate_people || null,
    preferred_payment_method: input.preferred_payment_method || null,
    wants_delivery_future: input.wants_delivery_future,
    delivery_address: input.delivery_address || null,
    delivery_reference: input.delivery_reference || null,
    delivery_preferred_time: input.delivery_preferred_time || null,
    delivery_notes: input.delivery_notes || null,
    data_consent: input.terms_accepted,
    commercial_consent: input.terms_accepted,
    segmentation_consent: input.terms_accepted,
    allies_consent: input.terms_accepted,
    terms_accepted: input.terms_accepted,
    source_channel: allyCode ? "comercio aliado" : "registro público"
  });

  if (error) {
    return NextResponse.json({ error: "No pudimos guardar el registro." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
