"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  DOCUMENT_TYPES,
  LOCAL_RELATIONSHIPS,
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
    formState: { errors, isSubmitting }
  } = useForm<MemberRegistrationInput>({
    resolver: zodResolver(memberRegistrationSchema),
    defaultValues: {
      wants_delivery_future: false,
      data_consent: false,
      commercial_consent: false,
      segmentation_consent: false,
      allies_consent: false,
      validation_method: "Otro"
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
            <Field label="Referencia local verificable" error={errors.local_reference?.message}>
              <Textarea {...register("local_reference")} />
            </Field>
          </div>
          <Field label="Empresa, comercio, institución o edificio (opcional)">
            <Input {...register("organization_name")} />
          </Field>
          <Field label="Código aliado (opcional)">
            <Input {...register("ally_code")} placeholder="BRUNCHYTEST" />
          </Field>
        </div>
      </Section>

      <Section title="Declaración y términos">
        <label className="flex gap-3 text-sm">
          <input type="checkbox" {...register("declaration_truth")} />
          <span>Declaro que la información suministrada es verdadera y que vivo, trabajo, estudio o hago vida recurrente en la Ciudad Colonial o zonas aledañas.</span>
        </label>
        {errors.declaration_truth ? <p className="text-sm text-danger">{errors.declaration_truth.message}</p> : null}
        <label className="flex gap-3 text-sm">
          <input type="checkbox" {...register("terms_accepted")} />
          <span>
            Acepto los{" "}
            <a className="font-semibold text-primary underline" href="/zona-libre/terminos" target="_blank">
              términos y condiciones
            </a>{" "}
            de Zona Libre Brunchy, incluyendo las autorizaciones de datos y comunicación comercial indicadas allí.
          </span>
        </label>
        <p className="text-sm text-foreground/70">Puedes solicitar la actualización, corrección, suspensión o eliminación de tus datos del programa, así como retirar tu autorización para recibir comunicaciones comerciales.</p>
        {errors.terms_accepted ? <p className="text-sm text-danger">{errors.terms_accepted.message}</p> : null}
      </Section>

      {serverError ? <p className="rounded-md bg-danger/10 p-3 text-sm text-danger">{serverError}</p> : null}
      <Button className="w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
