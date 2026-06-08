"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  BUYS_FOR,
  CONTACT_CHANNELS,
  CONSUMPTION_TYPES,
  DOCUMENT_TYPES,
  LOCAL_RELATIONSHIPS,
  PAYMENT_METHODS,
  PEOPLE_OPTIONS,
  PURCHASE_CHANNELS,
  PURCHASE_FREQUENCIES,
  TIME_SLOTS,
  VALIDATION_METHODS,
  ZONES
} from "@/lib/constants";
import { MemberRegistrationInput, memberRegistrationSchema } from "@/lib/validators";

function Options({ items }: { items: readonly string[] }) {
  return (
    <>
      <option value="">Seleccionar</option>
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 rounded-lg border border-border bg-white p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export function RegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<MemberRegistrationInput>({
    resolver: zodResolver(memberRegistrationSchema),
    defaultValues: {
      wants_delivery_future: false,
      commercial_consent: false,
      segmentation_consent: false,
      allies_consent: false
    }
  });

  async function onSubmit(values: MemberRegistrationInput) {
    setServerError("");
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setServerError(result.error || "No pudimos procesar el registro.");
      return;
    }

    router.push("/zona-libre/gracias");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <Section title="Datos personales">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre completo" error={errors.full_name?.message}>
            <Input {...register("full_name")} />
          </Field>
          <Field label="Tipo de documento" error={errors.document_type?.message}>
            <Select {...register("document_type")}><Options items={DOCUMENT_TYPES} /></Select>
          </Field>
          <Field label="Número de cédula, residencia o documento" error={errors.document_number?.message}>
            <Input {...register("document_number")} />
          </Field>
          <Field label="Teléfono WhatsApp" error={errors.whatsapp?.message}>
            <Input {...register("whatsapp")} placeholder="+1 809 000 0000" />
          </Field>
          <Field label="Correo electrónico" error={errors.email?.message}>
            <Input {...register("email")} type="email" />
          </Field>
          <Field label="Fecha de nacimiento">
            <Input {...register("birth_date")} type="date" />
          </Field>
          <Field label="Instagram">
            <Input {...register("instagram")} placeholder="@usuario" />
          </Field>
        </div>
      </Section>

      <Section title="Relación con la zona">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="¿Cuál es tu relación con la Ciudad Colonial o zonas aledañas?" error={errors.local_relationship?.message}>
            <Select {...register("local_relationship")}><Options items={LOCAL_RELATIONSHIPS} /></Select>
          </Field>
          <Field label="Zona donde vive, trabaja o estudia" error={errors.zone?.message}>
            <Select {...register("zone")}><Options items={ZONES} /></Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Dirección, edificio, comercio, empresa, institución o referencia local" error={errors.local_reference?.message}>
              <Textarea {...register("local_reference")} />
            </Field>
          </div>
          <Field label="Nombre de empresa, comercio, institución, edificio o residencia">
            <Input {...register("organization_name")} />
          </Field>
          <Field label="Cargo o actividad, si trabaja en la zona">
            <Input {...register("role_or_activity")} />
          </Field>
          <Field label="Código de comercio aliado">
            <Input {...register("ally_code")} placeholder="BRUNCHYTEST" />
          </Field>
        </div>
      </Section>

      <Section title="Validación local">
        <Field label="Medio usado para validar la membresía" error={errors.validation_method?.message}>
          <Select {...register("validation_method")}><Options items={VALIDATION_METHODS} /></Select>
        </Field>
        <label className="flex gap-3 text-sm">
          <input type="checkbox" {...register("declaration_truth")} />
          <span>Declaro que la información suministrada es verdadera y que vivo, trabajo, estudio o hago vida recurrente en la Ciudad Colonial o zonas aledañas.</span>
        </label>
        {errors.declaration_truth ? <p className="text-sm text-danger">{errors.declaration_truth.message}</p> : null}
      </Section>

      <Section title="Preferencias comerciales">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Canal preferido para recibir menú, promociones y beneficios">
            <Select {...register("preferred_contact_channel")}><Options items={CONTACT_CHANNELS} /></Select>
          </Field>
          <Field label="Canal preferido para comprar">
            <Select {...register("preferred_purchase_channel")}><Options items={PURCHASE_CHANNELS} /></Select>
          </Field>
          <Field label="Tipo de consumo más frecuente">
            <Select {...register("preferred_consumption_type")}><Options items={CONSUMPTION_TYPES} /></Select>
          </Field>
          <Field label="Frecuencia estimada de compra">
            <Select {...register("purchase_frequency")}><Options items={PURCHASE_FREQUENCIES} /></Select>
          </Field>
          <Field label="Horario en que normalmente consume">
            <Select {...register("preferred_time_slot")}><Options items={TIME_SLOTS} /></Select>
          </Field>
          <Field label="Compra normalmente para">
            <Select {...register("buys_for")}><Options items={BUYS_FOR} /></Select>
          </Field>
          <Field label="Cantidad aproximada de personas">
            <Select {...register("approximate_people")}><Options items={PEOPLE_OPTIONS} /></Select>
          </Field>
          <Field label="Método de pago preferido">
            <Select {...register("preferred_payment_method")}><Options items={PAYMENT_METHODS} /></Select>
          </Field>
        </div>
      </Section>

      <Section title="Delivery futuro">
        <label className="flex gap-3 text-sm">
          <input type="checkbox" {...register("wants_delivery_future")} />
          <span>Deseo ser considerado para delivery local cuando esté disponible.</span>
        </label>
        {watch("wants_delivery_future") ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Dirección de entrega dentro de la zona" error={errors.delivery_address?.message}>
              <Input {...register("delivery_address")} />
            </Field>
            <Field label="Referencia de ubicación">
              <Input {...register("delivery_reference")} />
            </Field>
            <Field label="Horario ideal de entrega">
              <Input {...register("delivery_preferred_time")} />
            </Field>
            <Field label="Instrucciones especiales">
              <Textarea {...register("delivery_notes")} />
            </Field>
          </div>
        ) : null}
      </Section>

      <Section title="Consentimientos">
        <label className="flex gap-3 text-sm"><input type="checkbox" {...register("data_consent")} /><span>Autorizo a Brunchy / Zona Libre a recolectar, registrar y utilizar mis datos personales para validar mi membresía, identificarme como miembro local, administrar beneficios, evitar registros duplicados, atender pedidos y gestionar mi relación comercial con el programa.</span></label>
        <label className="flex gap-3 text-sm"><input type="checkbox" {...register("commercial_consent")} /><span>Autorizo recibir por WhatsApp, llamada, SMS, correo electrónico o redes sociales información comercial relacionada con menús, promociones, descuentos, beneficios, nuevos productos, campañas especiales, recordatorios, encuestas y ofertas directas de Brunchy / Zona Libre.</span></label>
        <label className="flex gap-3 text-sm"><input type="checkbox" {...register("segmentation_consent")} /><span>Autorizo que Brunchy / Zona Libre use mi historial de compras, preferencias, zona, frecuencia de consumo y canal preferido para enviarme ofertas y beneficios personalizados.</span></label>
        <label className="flex gap-3 text-sm"><input type="checkbox" {...register("allies_consent")} /><span>Autorizo que, cuando Zona Libre Ciudad Colonial incorpore restaurantes o comercios aliados, mis datos básicos de membresía puedan ser utilizados para validar beneficios dentro del programa.</span></label>
        <label className="flex gap-3 text-sm"><input type="checkbox" {...register("terms_accepted")} /><span>Acepto los términos y condiciones de Zona Libre Brunchy.</span></label>
        <p className="text-sm text-foreground/70">Puedes solicitar la actualización, corrección, suspensión o eliminación de tus datos del programa, así como retirar tu autorización para recibir comunicaciones comerciales.</p>
        {errors.data_consent ? <p className="text-sm text-danger">{errors.data_consent.message}</p> : null}
        {errors.terms_accepted ? <p className="text-sm text-danger">{errors.terms_accepted.message}</p> : null}
      </Section>

      {serverError ? <p className="rounded-md bg-danger/10 p-3 text-sm text-danger">{serverError}</p> : null}
      <Button className="w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
