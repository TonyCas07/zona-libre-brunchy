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
          <h2 className="pt-2 text-xl font-bold">Autorizaciones incluidas al aceptar estos términos</h2>
          <p>Al aceptar estos términos, autorizas a Brunchy / Zona Libre a recolectar, registrar y utilizar tus datos personales para validar tu membresía, identificarte como miembro local, administrar beneficios, evitar registros duplicados, atender pedidos y gestionar tu relación comercial con el programa.</p>
          <p>También autorizas recibir por WhatsApp, llamada, SMS, correo electrónico o redes sociales información comercial relacionada con menús, promociones, descuentos, beneficios, nuevos productos, campañas especiales, recordatorios, encuestas y ofertas directas de Brunchy / Zona Libre.</p>
          <p>Autorizas que Brunchy / Zona Libre pueda utilizar tu historial de compras, preferencias, zona, frecuencia de consumo y canal preferido para enviarte ofertas y beneficios personalizados cuando esos datos estén disponibles.</p>
          <p>Cuando Zona Libre Ciudad Colonial incorpore restaurantes o comercios aliados, autorizas que tus datos básicos de membresía puedan ser utilizados para validar beneficios dentro del programa.</p>
          <p>Podrás solicitar la actualización, corrección, suspensión o eliminación de tus datos del programa, así como retirar tu autorización para recibir comunicaciones comerciales.</p>
        </article>
      </main>
    </>
  );
}
