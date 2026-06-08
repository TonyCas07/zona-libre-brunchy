import Link from "next/link";
import { PublicHeader } from "@/components/public/public-header";
import { Card } from "@/components/ui/card";

export default function GraciasPage() {
  return (
    <>
      <PublicHeader />
      <main className="container-page grid min-h-[70vh] place-items-center py-10">
        <Card className="max-w-xl text-center">
          <p className="text-sm font-semibold uppercase text-primary">Pendiente de validación</p>
          <h1 className="mt-3 text-3xl font-bold">Recibimos tu solicitud.</h1>
          <p className="mt-4 text-foreground/72">Tu registro quedó pendiente de validación. Cuando sea aprobado, recibirás tu código de miembro por el canal autorizado.</p>
          <Link className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-white" href="/zona-libre">
            Volver a Zona Libre
          </Link>
        </Card>
      </main>
    </>
  );
}
