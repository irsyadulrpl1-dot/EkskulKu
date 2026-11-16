"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ekskul, JAM_SESI } from "@/app/Data/ekskul";

export default function EskulSayaPage() {
  const [namaSiswa, setNamaSiswa] = useState("");
  const [kelasSiswa, setKelasSiswa] = useState("");
  const [daftarPendaftar, setDaftarPendaftar] = useState<any[]>([]);

  useEffect(() => {
    // Ambil cookie di sisi browser
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
      return "";
    };

    const nama = decodeURIComponent(getCookie("nama_siswa"));
    const kelas = decodeURIComponent(getCookie("kelas_siswa"));
    setNamaSiswa(nama);
    setKelasSiswa(kelas);

    // Ambil data pendaftar dari localStorage jika ada, atau gunakan default
    const savedPendaftar = localStorage.getItem("pendaftar_ekskul");
    if (savedPendaftar) {
      setDaftarPendaftar(JSON.parse(savedPendaftar));
    } else {
      setDaftarPendaftar([]);
    }
  }, []);

  const handleBatalkan = (nomor: number) => {
    const updated = daftarPendaftar.filter((p) => p.nomor !== nomor);
    setDaftarPendaftar(updated);
    localStorage.setItem("pendaftar_ekskul", JSON.stringify(updated));
  };

  const eskulDiikuti = daftarPendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === namaSiswa.toLowerCase() &&
      p.kelas.toLowerCase() === kelasSiswa.toLowerCase(),
  );

  if (!namaSiswa || !kelasSiswa) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 md:p-12 text-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white/85 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
            <Link
              href="/"
              className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              EskulKu
            </Link>
            <div className="flex gap-6 text-sm font-semibold">
              <Link
                href="/ekskul"
                className="text-slate-600 hover:text-blue-600 transition"
              >
                Katalog
              </Link>
              <Link href="/saya" className="text-blue-600 font-bold transition">
                Eskul Saya
              </Link>
            </div>
          </div>

          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
            <h1 className="text-2xl font-black text-slate-900">Eskul Saya</h1>
            <p className="text-sm text-slate-500">
              Kamu belum mendaftar apa pun.{" "}
              <Link
                href="/ekskul"
                className="text-blue-600 font-semibold underline hover:text-blue-700"
              >
                Cari ekskul sekarang
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 md:p-12 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/85 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
          <Link
            href="/"
            className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            EskulKu
          </Link>
          <div className="flex gap-6 text-sm font-semibold">
            <Link
              href="/ekskul"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Katalog
            </Link>
            <Link href="/saya" className="text-blue-600 font-bold transition">
              Eskul Saya
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Eskul Saya</h1>
          <p className="text-sm text-slate-600 font-medium">
            {namaSiswa} &middot; {kelasSiswa} &middot; {eskulDiikuti.length}{" "}
            eskul diikuti
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Daftar Kegiatan</h2>

          {eskulDiikuti.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-6 text-center">
              Belum ada eskul yang diikuti.
            </p>
          ) : (
            <div className="space-y-3">
              {eskulDiikuti.map((p) => {
                const itemEkskul = ekskul.find((e) => e.id === p.ekskulId);
                if (!itemEkskul) return null;

                return (
                  <div
                    key={p.nomor}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-2xl gap-4 border border-slate-100"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {itemEkskul.kategori}
                        </span>
                        <span className="text-xs text-slate-400">
                          Pendaftaran #{p.nomor}
                        </span>
                      </div>

                      <Link
                        href={`/ekskul/${itemEkskul.id}`}
                        className="text-base font-bold text-slate-800 hover:text-blue-600 transition block"
                      >
                        {itemEkskul.nama}
                      </Link>

                      <p className="text-xs text-slate-500">
                        {itemEkskul.hari}, Sesi {itemEkskul.sesi} (
                        {JAM_SESI[itemEkskul.sesi]}) &bull; Pembina:{" "}
                        {itemEkskul.pembina}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBatalkan(p.nomor)}
                      className="w-full sm:w-auto px-4 py-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
                    >
                      Batalkan
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
