"use client";

import { useState } from "react";
import {
  ekskul,
  pendaftar,
  DAFTAR_KATEGORI,
  JAM_SESI,
  tambahPendaftar,
  batalkanPendaftaran,
} from "@/app/data/ekskul";

export default function Home() {
  const [filterKategori, setFilterKategori] = useState<string>("Semua");
  const [search, setSearch] = useState<string>("");

  const [namaSiswa, setNamaSiswa] = useState("");
  const [kelasSiswa, setKelasSiswa] = useState("");
  const [selectedEkskulId, setSelectedEkskulId] = useState<number | null>(null);
  const [pesan, setPesan] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [activeEkskulId, setActiveEkskulId] = useState<number | null>(null);

  const filteredEkskul = ekskul.filter((item) => {
    const matchKategori =
      filterKategori === "Semua" || item.kategori === filterKategori;
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.pembina.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  const handleDaftar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa || !kelasSiswa || !selectedEkskulId) {
      setPesan({
        text: "Nama, kelas, dan pilihan ekskul harus diisi!",
        type: "error",
      });
      return;
    }

    const targetEkskul = ekskul.find((e) => e.id === selectedEkskulId);
    if (!targetEkskul) return;

    // 1. Cek apakah sudah terdaftar di ekskul yang sama
    const sudahTerdaftar = pendaftar.some(
      (p) =>
        p.nama.toLowerCase() === namaSiswa.toLowerCase() &&
        p.kelas.toLowerCase() === kelasSiswa.toLowerCase() &&
        p.ekskulId === selectedEkskulId,
    );
    if (sudahTerdaftar) {
      setPesan({
        text: "Gagal: Murid sudah terdaftar di ekstrakurikuler ini!",
        type: "error",
      });
      return;
    }

    // 2. Cek kuota penuh
    const jumlahAnggota = pendaftar.filter(
      (p) => p.ekskulId === selectedEkskulId,
    ).length;
    if (jumlahAnggota >= targetEkskul.kuota) {
      setPesan({
        text: "Gagal: Kuota ekstrakurikuler ini sudah penuh!",
        type: "error",
      });
      return;
    }

    // 3. Cek bentrok jadwal (Hari + Sesi sama)
    const ekskulMurid = pendaftar.filter(
      (p) =>
        p.nama.toLowerCase() === namaSiswa.toLowerCase() &&
        p.kelas.toLowerCase() === kelasSiswa.toLowerCase(),
    );

    for (const p of ekskulMurid) {
      const ekskulLain = ekskul.find((e) => e.id === p.ekskulId);
      if (
        ekskulLain &&
        ekskulLain.hari === targetEkskul.hari &&
        ekskulLain.sesi === targetEkskul.sesi
      ) {
        setPesan({
          text: `Gagal: Jadwal bentrok dengan ekskul ${ekskulLain.nama} (${ekskulLain.hari}, Sesi ${ekskulLain.sesi})!`,
          type: "error",
        });
        return;
      }
    }

    tambahPendaftar({
      ekskulId: selectedEkskulId,
      nama: namaSiswa,
      kelas: kelasSiswa,
    });

    setPesan({
      text: `Berhasil mendaftar ke ${targetEkskul.nama}!`,
      type: "success",
    });
    setNamaSiswa("");
    setKelasSiswa("");
    setSelectedEkskulId(null);
  };

  const handleBatal = (nomorPendaftaran: number) => {
    if (confirm("Yakin ingin membatalkan pendaftaran ini?")) {
      batalkanPendaftaran(nomorPendaftaran);
      setPesan({ text: "Pendaftaran berhasil dibatalkan.", type: "success" });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-600">EskulKu</h1>
            <p className="text-sm text-gray-500">
              Sistem Pendaftaran Ekstrakurikuler Sekolah
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Cari ekskul / pembina..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Kategori</option>
              {DAFTAR_KATEGORI.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifikasi */}
        {pesan && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${pesan.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {pesan.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daftar Ekskul */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Daftar Ekstrakurikuler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEkskul.map((item) => {
                const anggotaEkskul = pendaftar.filter(
                  (p) => p.ekskulId === item.id,
                );
                const sisaKuota = item.kuota - anggotaEkskul.length;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {item.kategori}
                      </span>
                      <h3 className="text-lg font-bold mt-2">{item.nama}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Pembina: {item.pembina}
                      </p>
                      <div className="mt-3 text-sm space-y-1 text-gray-600">
                        <p>
                          📅 {item.hari}, Sesi {item.sesi} (
                          {JAM_SESI[item.sesi]})
                        </p>
                        <p>
                          👥 Kuota:{" "}
                          <span
                            className={
                              sisaKuota === 0
                                ? "text-red-500 font-bold"
                                : "font-semibold"
                            }
                          >
                            {anggotaEkskul.length} / {item.kuota}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => setSelectedEkskulId(item.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition"
                      >
                        Daftar
                      </button>
                      <button
                        onClick={() => setActiveEkskulId(item.id)}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium transition"
                      >
                        Anggota
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form & Anggota */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Form Pendaftaran</h2>
              <form onSubmit={handleDaftar} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    NAMA SISWA
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={namaSiswa}
                    onChange={(e) => setNamaSiswa(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    KELAS
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XI RPL 1"
                    value={kelasSiswa}
                    onChange={(e) => setKelasSiswa(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    PILIH EKSTRAKURIKULER
                  </label>
                  <select
                    value={selectedEkskulId || ""}
                    onChange={(e) =>
                      setSelectedEkskulId(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pilih Ekskul --</option>
                    {ekskul.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nama} ({e.hari})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Kirim Pendaftaran
                </button>
              </form>
            </div>

            {activeEkskulId && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    Anggota: {ekskul.find((e) => e.id === activeEkskulId)?.nama}
                  </h3>
                  <button
                    onClick={() => setActiveEkskulId(null)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Tutup
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {pendaftar.filter((p) => p.ekskulId === activeEkskulId)
                    .length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      Belum ada anggota terdaftar.
                    </p>
                  ) : (
                    pendaftar
                      .filter((p) => p.ekskulId === activeEkskulId)
                      .map((p) => (
                        <div
                          key={p.nomor}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-xl text-xs"
                        >
                          <div>
                            <p className="font-semibold">{p.nama}</p>
                            <p className="text-gray-500">{p.kelas}</p>
                          </div>
                          <button
                            onClick={() => handleBatal(p.nomor)}
                            className="text-red-500 hover:text-red-700 font-medium px-2 py-1 bg-white border border-red-100 rounded-lg shadow-xs"
                          >
                            Batal
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
