export const DOCUMENT_TYPES = [
  "Cédula dominicana",
  "Cédula de extranjero residente",
  "Carnet o tarjeta de residencia",
  "Pasaporte + validación local",
  "Carnet laboral",
  "Carnet estudiantil",
  "Otro documento autorizado"
] as const;

export const LOCAL_RELATIONSHIPS = [
  "Vivo en la zona",
  "Trabajo en la zona",
  "Estudio en la zona",
  "Tengo o represento un comercio en la zona",
  "Soy cliente frecuente validado por Brunchy",
  "Otro vínculo local"
] as const;

export const ZONES = [
  "Ciudad Colonial",
  "Ciudad Nueva",
  "Gazcue",
  "San Carlos",
  "Villa Francisca",
  "San Miguel",
  "Otra zona cercana"
] as const;

export const VALIDATION_METHODS = [
  "Cédula dominicana",
  "Cédula de extranjero residente",
  "Tarjeta o carnet de residencia",
  "Carnet laboral",
  "Carnet estudiantil",
  "Código de comercio aliado",
  "Comprobante de domicilio",
  "Contrato de alquiler",
  "Validación interna por consumo frecuente",
  "Otro"
] as const;

export const CONTACT_CHANNELS = ["WhatsApp", "Llamada", "Correo electrónico", "Instagram", "SMS"] as const;

export const PURCHASE_CHANNELS = [
  "Consumo en restaurante",
  "Pick-up",
  "Pedido por WhatsApp",
  "Delivery propio cuando esté disponible",
  "Pedidos para oficina o grupo",
  "Catering / reuniones / eventos pequeños"
] as const;

export const CONSUMPTION_TYPES = [
  "Desayuno",
  "Brunch",
  "Almuerzo",
  "Café y panadería",
  "Waffles",
  "Bagels",
  "Sándwiches",
  "Panes de masa madre",
  "Combos de oficina",
  "Productos para llevar",
  "Otro"
] as const;

export const PURCHASE_FREQUENCIES = [
  "Diario",
  "2 a 3 veces por semana",
  "1 vez por semana",
  "2 veces al mes",
  "Ocasional"
] as const;

export const TIME_SLOTS = [
  "7:00 a. m. - 10:00 a. m.",
  "10:00 a. m. - 12:00 p. m.",
  "12:00 p. m. - 3:00 p. m.",
  "3:00 p. m. - 6:00 p. m."
] as const;

export const BUYS_FOR = [
  "Uso individual",
  "Pareja / familia",
  "Oficina",
  "Equipo de trabajo",
  "Clientes o reuniones",
  "Comercio / institución"
] as const;

export const PEOPLE_OPTIONS = ["1 persona", "2 personas", "3 a 5 personas", "6 a 10 personas", "Más de 10 personas"] as const;

export const PAYMENT_METHODS = ["Efectivo", "Tarjeta", "Transferencia", "Pago contra entrega", "Link de pago", "Otro"] as const;

export const MEMBER_STATUSES = ["pending", "validated", "rejected", "suspended", "inactive"] as const;

export const STATUS_LABELS: Record<(typeof MEMBER_STATUSES)[number], string> = {
  pending: "Pendiente de validación",
  validated: "Membresía validada",
  rejected: "No validado",
  suspended: "Suspendido",
  inactive: "Inactivo"
};

export const ROLES = ["super_admin", "admin", "staff", "read_only", "partner_future"] as const;

export const SALE_CHANNELS = ["Restaurante", "Pick-up", "WhatsApp", "Delivery propio", "Oficina / grupo", "Evento / catering"] as const;

export const DISCOUNT_TYPES = ["Equivalente ITBIS", "Promoción especial", "Cumpleaños", "Otro"] as const;

export const PRODUCT_CATEGORIES = [
  "Desayuno",
  "Brunch",
  "Almuerzo",
  "Café",
  "Panadería",
  "Waffles",
  "Bagels",
  "Sándwiches",
  "Masa madre",
  "Combo oficina",
  "Otro"
] as const;
