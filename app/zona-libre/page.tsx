import Link from "next/link";
import { Coffee, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { Card } from "@/components/ui/card";

export default function ZonaLibrePage() {
  const highlights: Array<[LucideIcon, string, string]> = [
    [Users, "Vínculo local verificable", "Residentes, trabajadores, estudiantes y personas con actividad recurrente en la zona."],
    [Coffee, "Compra directa", "Beneficios para consumo en restaurante, pick-up, WhatsApp y canales directos autorizados."],
    [ShieldCheck, "Validación responsable", "El beneficio se activa solo cuando el equipo confirma la membresía."]
  ];

  return (
    <>
      <PublicHeader />
      <main>
        <section className="bg-primary text-white">
          <div className="container-page grid min-h-[72vh] items-center gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">Programa de miembros locales verificados</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight md:text-7xl">Zona Libre Brunchy</h1>
              <p className="mt-5 max-w-2xl text-xl text-white/86">Beneficios para quienes viven, trabajan, estudian o hacen vida en la Ciudad Colonial.</p>
              <p className="mt-4 max-w-2xl text-white/78">Regístrate, valida tu membresía local y accede a beneficios exclusivos al comprar directo con Brunchy.</p>
              <Link className="mt-8 inline-flex rounded-md bg-accent px-5 py-3 font-bold text-foreground" href="/zona-libre/registro">
                Registrarme
              </Link>
              <p className="mt-5 max-w-2xl text-sm text-white/72">Aplica solo para miembros locales verificados. No aplica en plataformas, visitantes ocasionales ni promociones acumuladas.</p>
            </div>
            <div className="grid gap-4">
              {highlights.map(([Icon, title, text]) => (
                <Card key={title} className="bg-white/96">
                  <Icon className="mb-3 h-6 w-6 text-primary" />
                  <h2 className="font-bold">{title}</h2>
                  <p className="mt-1 text-sm text-foreground/70">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
