import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-xl mx-auto text-center bg-white/80 backdrop-blur-md p-10 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="inline-block p-3 bg-blue-50 text-blue-600 rounded-2xl text-2xl font-bold mb-2">
          🏆
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Selamat Datang di <span className="text-blue-600">EskulKu</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Sistem pendaftaran ekstrakurikuler sekolah yang modern, cepat, dan
          mudah digunakan untuk mengembangkan bakatmu.
        </p>
        <div className="pt-4">
          <Link
            href="/ekskul"
            className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Lihat Katalog Ekstrakurikuler &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
