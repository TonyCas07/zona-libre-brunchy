import { describe, expect, it } from "vitest";
import { memberRegistrationSchema } from "@/lib/validators";

const validPayload = {
  full_name: "Ana Pérez",
  document_type: "Cédula dominicana",
  document_number: "001-1234567-8",
  whatsapp: "8095551212",
  email: "ana@example.com",
  local_relationship: "Trabajo en la zona",
  zone: "Ciudad Colonial",
  local_reference: "Empresa ubicada en calle El Conde",
  declaration_truth: true,
  terms_accepted: true,
  wants_delivery_future: false
};

describe("validación de registro", () => {
  it("acepta un registro válido", () => {
    expect(memberRegistrationSchema.safeParse(validPayload).success).toBe(true);
  });

  it("usa un método de validación interno cuando no se pregunta en el formulario corto", () => {
    const result = memberRegistrationSchema.parse(validPayload);
    expect(result.validation_method).toBe("Otro");
  });

  it("requiere dirección si solicita delivery futuro", () => {
    const result = memberRegistrationSchema.safeParse({ ...validPayload, wants_delivery_future: true, delivery_address: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza email inválido si se completa", () => {
    const result = memberRegistrationSchema.safeParse({ ...validPayload, email: "correo-malo" });
    expect(result.success).toBe(false);
  });
});
