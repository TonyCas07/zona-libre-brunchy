import { createHmac } from "node:crypto";

export function normalizeDocumentNumber(value: string) {
  return value.trim().toUpperCase().replace(/[\s-]+/g, "");
}

export function maskDocumentNumber(value: string) {
  const normalized = normalizeDocumentNumber(value);
  const last4 = normalized.slice(-4);
  return last4 ? `***-****${last4}` : "";
}

export function hashDocumentNumber(value: string, secret = process.env.DOCUMENT_HASH_SECRET) {
  if (!secret) {
    throw new Error("DOCUMENT_HASH_SECRET no está configurado.");
  }

  return createHmac("sha256", secret).update(normalizeDocumentNumber(value)).digest("hex");
}

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (trimmed.startsWith("+") && digits.length >= 8) {
    return `+${digits}`;
  }

  return digits;
}

export function generateMemberCode(sequence: number) {
  return `ZLB-${String(sequence).padStart(6, "0")}`;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const digits = normalizePhone(phone).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function personalizeCampaignMessage(
  template: string,
  member: { full_name: string; member_code?: string | null; zone?: string | null; preferred_consumption_type?: string | null },
  benefit = "beneficio como miembro local validado"
) {
  const firstName = member.full_name.split(" ")[0] || member.full_name;
  return template
    .replaceAll("{nombre}", firstName)
    .replaceAll("{codigo_miembro}", member.member_code || "")
    .replaceAll("{zona}", member.zone || "")
    .replaceAll("{beneficio}", benefit)
    .replaceAll("{producto_recomendado}", member.preferred_consumption_type || "tu producto favorito");
}
