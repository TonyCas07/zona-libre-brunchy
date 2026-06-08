import { PublicHeader } from "@/components/public/public-header";
import { RegistrationForm } from "@/components/public/registration-form";

export default function RegistroPage() {
  return (
    <>
      <PublicHeader />
      <main className="container-page py-10">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold">Registro de miembro local</h1>
          <p className="mt-3 text-foreground/70">Completa tus datos para solicitar tu membresía Zona Libre Brunchy. Revisaremos tu vínculo con la Ciudad Colonial o zonas aledañas antes de activar tus beneficios.</p>
        </div>
        <RegistrationForm />
      </main>
    </>
  );
}
