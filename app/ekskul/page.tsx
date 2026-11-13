import { Metadata } from "next";
import { ambilSemuaEkskul } from "@/app/Data/ambil";
import {
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
} from "@/app/Data/ekskul";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar Ekskul",
};

type PageProps = {
  searchParams: Promise<{
    kategori?: string;
    hari?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const semuaEkskul = await ambilSemuaEkskul();

  const kategoriFilter = params.kategori || "Semua kategori";
  const hariFilter = params.hari || "Semua hari";

  const filteredEkskul = semuaEkskul.filter((item) => {
    const matchKategori =
      kategoriFilter === "Semua kategori" || item.kategori === kategoriFilter;
    const matchHari = hariFilter === "Semua hari" || item.hari === hariFilter;
    return matchKategori && matchHari;
  });

  const getBadgeColor = (kategori: string) => {
    switch (kategori) {
      case "Olahraga":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "Seni":
        return "bg-pink-50 text-pink-600 border-pink-200";
      case "Teknologi":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "Akademik":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      default:
        return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 md:p-12 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Kartu Header Utama yang Menyatu dengan Menu Navigasi & Filter */}
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          {/* Baris Atas: Logo EskulKu & Menu Navigasi (Katalog / Eskul Saya) */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-100">
            <Link
              href="/"
              className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              EskulKu
            </Link>
            <div className="flex gap-6 text-sm font-semibold">
              <Link
                href="/ekskul"
                className="text-blue-600 font-bold transition"
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
          </div>

          {/* Baris Bawah: Judul Katalog & Form Saring/Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                Katalog Ekstrakurikuler
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Temukan ekstrakurikuler impianmu dan kembangkan bakatmu di
                sekolah!
              </p>
            </div>

            {/* Form Filter Saring */}
            <form
              method="GET"
              className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto"
            >
              <select
                name="kategori"
                defaultValue={kategoriFilter}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Semua kategori">Semua Kategori</option>
                {DAFTAR_KATEGORI.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>

              <select
                name="hari"
                defaultValue={hariFilter}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Semua hari">Semua Hari</option>
                {DAFTAR_HARI.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm transition shadow-md shadow-blue-500/20 active:scale-95"
              >
                Saring
              </button>
            </form>
          </div>
        </div>

        {/* Info Jumlah Hasil */}
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {filteredEkskul.length} ekstrakurikuler ditemukan
          </p>
        </div>

        {/* Grid Kartu Ekskul */}
        {filteredEkskul.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-100 text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-slate-700">
              Tidak ada ekskul yang cocok.
            </h3>
            <p className="text-sm text-slate-400">
              Coba ubah filter kategori atau hari pencarianmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEkskul.map((item) => {
              const jumlahPendaftar = pendaftar.filter(
                (p) => p.ekskulId === item.id,
              ).length;
              const sisaTempat = item.kuota - jumlahPendaftar;
              const isPenuh = sisaTempat <= 0;

              return (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadgeColor(item.kategori)}`}
                      >
                        {item.kategori}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Pembina: {item.pembina}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.nama}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-50 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📅</span>
                        <span>
                          {item.hari}, Sesi {item.sesi} ({JAM_SESI[item.sesi]})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">👥</span>
                        <span>
                          {isPenuh ? (
                            <span className="text-red-500 font-extrabold bg-red-50 px-2 py-0.5 rounded-md">
                              Penuh
                            </span>
                          ) : (
                            <span className="text-slate-700 font-semibold">
                              Sisa {sisaTempat} dari {item.kuota} tempat
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`/ekskul/${item.id}`}
                      className="w-full block text-center bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm active:scale-98"
                    >
                      Daftar & Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
