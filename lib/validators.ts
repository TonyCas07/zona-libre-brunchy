import { z } from "zod";
import {
  CONTACT_CHANNELS,
  CONSUMPTION_TYPES,
  BUYS_FOR,
  DISCOUNT_TYPES,
  DOCUMENT_TYPES,
  LOCAL_RELATIONSHIPS,
  PAYMENT_METHODS,
  PEOPLE_OPTIONS,
  PRODUCT_CATEGORIES,
  PURCHASE_CHANNELS,
  PURCHASE_FREQUENCIES,
  SALE_CHANNELS,
  TIME_SLOTS,
  VALIDATION_METHODS,
  ZONES
} from "@/lib/constants";

const requiredMessage = "Este campo es obligatorio.";
const optionalText = z.string().trim().optional().or(z.literal(""));
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), z.enum(values).optional());

export const memberRegistrationSchema = z
  .object({
    full_name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres."),
    document_type: z.enum(DOCUMENT_TYPES, { required_error: requiredMessage }),
    document_number: z.string().trim().min(3, "Indica el número de documento."),
    whatsapp: z.string().trim().min(8, "Indica un WhatsApp válido."),
    email: z.string().trim().email("Correo inválido.").optional().or(z.literal("")),
    birth_date: optionalText,
    instagram: optionalText,
    local_relationship: z.enum(LOCAL_RELATIONSHIPS, { required_error: requiredMessage }),
    zone: z.enum(ZONES, { required_error: requiredMessage }),
    local_reference: z.string().trim().min(5, "Indica una referencia local verificable."),
    organization_name: optionalText,
    role_or_activity: optionalText,
    ally_code: optionalText,
    validation_method: z.enum(VALIDATION_METHODS).default("Otro"),
    declaration_truth: z.coerce.boolean().refine(Boolean, "Debes confirmar la declaración."),
    preferred_contact_channel: optionalEnum(CONTACT_CHANNELS),
    preferred_purchase_channel: optionalEnum(PURCHASE_CHANNELS),
    preferred_consumption_type: optionalEnum(CONSUMPTION_TYPES),
    purchase_frequency: optionalEnum(PURCHASE_FREQUENCIES),
    preferred_time_slot: optionalEnum(TIME_SLOTS),
    buys_for: optionalEnum(BUYS_FOR),
    approximate_people: optionalEnum(PEOPLE_OPTIONS),
    preferred_payment_method: optionalEnum(PAYMENT_METHODS),
    wants_delivery_future: z.coerce.boolean().default(false),
    delivery_address: optionalText,
    delivery_reference: optionalText,
    delivery_preferred_time: optionalText,
    delivery_notes: optionalText,
    data_consent: z.coerce.boolean().default(false),
    commercial_consent: z.coerce.boolean().default(false),
    segmentation_consent: z.coerce.boolean().default(false),
    allies_consent: z.coerce.boolean().default(false),
    terms_accepted: z.coerce.boolean().refine(Boolean, "Debes aceptar los términos.")
  })
  .superRefine((data, ctx) => {
    if (data.wants_delivery_future && !data.delivery_address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["delivery_address"],
        message: "Indica la dirección de entrega para delivery futuro."
      });
    }
  });

export const statusUpdateSchema = z.object({
  status: z.enum(["validated", "rejected", "suspended", "inactive", "pending"]),
  reason: z.string().trim().optional()
});

export const saleSchema = z.object({
  purchase_channel: z.enum(SALE_CHANNELS),
  sale_date: z.string().optional(),
  gross_amount: z.coerce.number().positive("El monto bruto debe ser mayor que cero."),
  discount_type: optionalEnum(DISCOUNT_TYPES),
  discount_amount: z.coerce.number().min(0).default(0),
  net_amount: z.coerce.number().min(0),
  product_category: optionalEnum(PRODUCT_CATEGORIES),
  notes: optionalText
});

export const campaignSchema = z.object({
  name: z.string().trim().min(3, "Indica el nombre de la campaña."),
  objective: optionalText,
  message_template: z.string().trim().min(10, "El mensaje debe tener más detalle."),
  segment_filters: z.record(z.unknown()).default({})
});

export const allyCodeSchema = z.object({
  organization_name: z.string().trim().min(2, "Indica el nombre del comercio."),
  code: z.string().trim().min(3, "Indica un código aliado.").transform((value) => value.toUpperCase().replace(/\s+/g, "")),
  contact_name: optionalText,
  contact_phone: optionalText,
  zone: optionalText,
  status: z.enum(["active", "inactive"]).default("active"),
  notes: optionalText
});

export type MemberRegistrationInput = z.infer<typeof memberRegistrationSchema>;
