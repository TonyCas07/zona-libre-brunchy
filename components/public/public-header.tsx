import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-white">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/zona-libre" className="text-lg font-bold text-primary">
          Zona Libre Brunchy
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/zona-libre/terminos">Términos</Link>
          <Link className="rounded-md bg-primary px-3 py-2 text-white" href="/zona-libre/registro">
            Registrarme
          </Link>
        </nav>
      </div>
    </header>
  );
}
