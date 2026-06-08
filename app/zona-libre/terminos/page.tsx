import { PublicHeader } from "@/components/public/public-header";

export default function TerminosPage() {
  return (
    <>
      <PublicHeader />
      <main className="container-page py-10">
        <article className="grid max-w-3xl gap-4 rounded-lg border border-border bg-white p-6 leading-7">
          <h1 className="text-3xl font-bold">Términos y condiciones</h1>
          <p>Zona Libre Brunchy es un programa de beneficios para miembros locales verificados de la Ciudad Colonial y zonas aledañas. Pueden aplicar personas dominicanas o extranjeras que vivan, trabajen, estudien o desarrollen actividad recurrente en la zona, previa validación.</p>
          <p>La validación podrá realizarse mediante cédula dominicana, cédula de extranjero residente, carnet o tarjeta de residencia, carnet laboral, carnet estudiantil, código de comercio aliado, comprobante de domicilio, contrato de alquiler o validación interna por consumo frecuente.</p>
          <p>El beneficio aplica únicamente en compras directas autorizadas por Brunchy, incluyendo consumo en tienda, pick-up, WhatsApp y delivery propio cuando esté disponible.</p>
          <p>El beneficio no aplica en plataformas de delivery, visitantes ocasionales, promociones acumuladas, eventos especiales ni productos previamente rebajados.</p>
          <p><strong>El descuento equivalente al ITBIS se aplica como beneficio comercial del programa. No constituye exención fiscal ni eliminación del impuesto correspondiente.</strong></p>
          <p>Brunchy se reserva el derecho de validar, aprobar, rechazar, suspender o modificar una membresía en caso de información incorrecta, uso indebido o cambios en las condiciones del programa.</p>
          <p>Los datos suministrados podrán ser utilizados para validar la membresía, administrar beneficios, atender pedidos, evitar duplicados y comunicarse comercialmente con los miembros que otorguen autorización. El miembro podrá solicitar actualización, corrección, suspensión o eliminación de sus datos, así como retirar su autorización para comunicaciones comerciales.</p>
        </article>
      </main>
    </>
  );
}
