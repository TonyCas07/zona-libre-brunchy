import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, generateMemberCode, maskDocumentNumber, normalizeDocumentNumber, normalizePhone, personalizeCampaignMessage } from "@/lib/privacy";

describe("helpers de privacidad y campañas", () => {
  it("normaliza y enmascara documentos", () => {
    expect(normalizeDocumentNumber("001-1234567-8")).toBe("00112345678");
    expect(maskDocumentNumber("001-1234567-8")).toBe("***-****5678");
  });

  it("normaliza teléfonos dominicanos e internacionales", () => {
    expect(normalizePhone("(809) 555-1212")).toBe("+18095551212");
    expect(normalizePhone("+34 600 000 000")).toBe("+34600000000");
  });

  it("genera código de miembro", () => {
    expect(generateMemberCode(42)).toBe("ZLB-000042");
  });

  it("personaliza mensajes de campaña y link de WhatsApp", () => {
    const message = personalizeCampaignMessage("Hola {nombre}, código {codigo_miembro}, {producto_recomendado}", {
      full_name: "Ana Pérez",
      member_code: "ZLB-000001",
      preferred_consumption_type: "Brunch"
    });
    expect(message).toBe("Hola Ana, código ZLB-000001, Brunch");
    expect(buildWhatsAppLink("8095551212", message)).toContain("https://wa.me/18095551212?text=");
  });
});
