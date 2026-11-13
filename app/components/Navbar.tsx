import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-4 px-6 shadow-sm flex justify-between items-center max-w-6xl mx-auto mb-8">
      <Link
        href="/"
        className="font-black text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
      >
        EskulKu
      </Link>
      <div className="flex gap-4 text-sm font-semibold">
        <Link
          href="/ekskul"
          className="text-slate-600 hover:text-blue-600 transition"
        >
          Katalog
        </Link>
        <Link
          href="/saya"
          className="text-slate-600 hover:text-blue-600 transition"
        >
          Eskul Saya
        </Link>
      </div>
    </nav>
  );
}
