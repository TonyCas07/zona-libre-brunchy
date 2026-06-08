import Link from "next/link";
import { requireProfile } from "@/lib/admin";

const nav = [
  ["/admin", "Dashboard"],
  ["/admin/miembros", "Miembros"],
  ["/admin/ventas", "Ventas"],
  ["/admin/campanas", "Campañas"],
  ["/admin/codigos-aliados", "Códigos aliados"],
  ["/admin/reportes", "Reportes"],
  ["/admin/configuracion", "Configuración"]
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white p-5 lg:block">
        <Link href="/admin" className="text-xl font-bold text-primary">
          Zona Libre
        </Link>
        <p className="mt-1 text-xs text-foreground/60">{profile.full_name || profile.role}</p>
        <nav className="mt-8 grid gap-1 text-sm font-medium">
          {nav.map(([href, label]) => (
            <Link key={href} className="rounded-md px-3 py-2 hover:bg-muted" href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="border-b border-border bg-white lg:hidden">
          <div className="container-page flex h-16 items-center justify-between">
            <span className="font-bold text-primary">Zona Libre</span>
            <Link href="/admin/miembros" className="text-sm font-semibold">
              Miembros
            </Link>
          </div>
        </div>
        <div className="container-page py-8">{children}</div>
      </main>
    </div>
  );
}
