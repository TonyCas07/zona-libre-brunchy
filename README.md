# Zona Libre Brunchy

MVP web para gestionar el programa de fidelización y venta directa **Zona Libre Brunchy**. La fase 1 permite registro público, validación administrativa, gestión de miembros, registro manual de compras, campañas exportables y preparación para delivery local y aliados futuros.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + RLS
- React Hook Form + Zod
- API Routes para lógica sensible
- CSV export para campañas y miembros operativos
- Vitest para validaciones críticas

## Instalación

```bash
cd Codex/zona-libre-brunchy
npm install
cp .env.example .env.local
npm run dev
```

Variables requeridas:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DOCUMENT_HASH_SECRET=
DOCUMENT_ENCRYPTION_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`DOCUMENT_HASH_SECRET` debe ser un secreto largo y estable. Si cambia, no se podrán detectar duplicados contra hashes anteriores.

## Supabase

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/migrations/001_initial_schema.sql` en el SQL editor o con Supabase CLI.
3. Ejecutar `supabase/seed/seed.sql`.
4. Crear usuarios internos desde Supabase Auth.
5. Insertar el perfil correspondiente en `profiles`:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_UUID', 'Admin Brunchy', 'super_admin');
```

Roles disponibles: `super_admin`, `admin`, `staff`, `read_only`, `partner_future`.

## Rutas

Públicas:

- `/zona-libre`
- `/zona-libre/registro`
- `/zona-libre/gracias`
- `/zona-libre/terminos`
- `/zl` redirige al registro y es la ruta recomendada para QR
- `/registro` redirige al registro en Vercel

Admin:

- `/admin/login`
- `/admin`
- `/admin/miembros`
- `/admin/miembros/[id]`
- `/admin/ventas`
- `/admin/campanas`
- `/admin/campanas/nueva`
- `/admin/codigos-aliados`
- `/admin/reportes`
- `/admin/configuracion`

## Seguridad y privacidad

- El registro público se procesa por `/api/members` usando service role en servidor.
- El cliente público no lee registros.
- El documento se normaliza, se hashea con HMAC SHA-256 y solo se conserva `document_number_last4` para visualización.
- La UI muestra documento enmascarado como `***-****1234`.
- Las exportaciones de campañas y miembros no incluyen documento completo, hash ni notas internas.
- Las campañas filtran por miembros `validated` con `commercial_consent = true`.
- RLS limita lectura y escritura según perfiles internos.

## Funcionalidades implementadas

- Landing pública y términos con texto comercial/no fiscal.
- Formulario público por secciones con validaciones Zod.
- Validación de código aliado activo.
- Duplicados por documento hasheado o WhatsApp normalizado.
- Estado inicial `pending`.
- Login admin con Supabase Auth.
- Dashboard KPI básico.
- Tabla de miembros con filtros.
- Detalle de miembro con datos, consentimiento, ventas, notas y auditoría.
- Aprobar, rechazar, suspender y reactivar.
- Generación de código `ZLB-000001`.
- Registro manual de compras.
- Campañas con variables y exportación CSV segura.
- Códigos aliados.
- Estructura para delivery local y restaurantes aliados futuros.

## Pruebas y calidad

```bash
npm run test
npm run lint
npm run build
```

## Despliegue recomendado

- Vercel para la app Next.js.
- Supabase para Auth, PostgreSQL y RLS.
- Configurar variables en Vercel como secrets.
- No exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.
- Usar dominios permitidos en Supabase Auth para producción.

Dominio recomendado:

```text
https://zonalibre.brunchyrd.com
```

URL corta recomendada para QR:

```text
https://zonalibre.brunchyrd.com/zl
```

Si `brunchyrd.com` también apunta a Vercel, se puede crear una redirección externa:

```text
https://brunchyrd.com/zl -> https://zonalibre.brunchyrd.com/zl
```

## Pendientes sugeridos para fase 2

- Pantallas CRUD completas para usuarios internos.
- Edición granular de miembros.
- Reportes con gráficos Recharts conectados a agregaciones SQL.
- Configuración editable de zonas de delivery.
- Jobs o vistas materializadas para segmentos comerciales complejos.
