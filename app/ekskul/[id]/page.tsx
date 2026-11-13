import { Metadata } from "next";
import { ambilEkskul } from "@/app/Data/ambil";
import {
  ekskul as dataEkskul,
  pendaftar,
  JAM_SESI,
  tambahPendaftar,
  batalkanPendaftaran,
} from "@/app/Data/ekskul";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import Navbar from "@/app/components/Navbar";
import FormPendaftaran from "@/app/components/FormPendaftaran";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const ekskul = await ambilEkskul(Number(resolvedParams.id));
  if (!ekskul) return { title: "Eskul tidak ditemukan" };
  return { title: ekskul.nama };
}

export default async function DetailEkskulPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const ekskul = await ambilEkskul(id);

  if (!ekskul) notFound();

  const cookieStore = await cookies();
  const initialNama = cookieStore.get("nama_siswa")?.value || "";
  const initialKelas = cookieStore.get("kelas_siswa")?.value || "";

  const anggotaEkskul = pendaftar.filter((p) => p.ekskulId === id);
  const sisaTempat = ekskul.kuota - anggotaEkskul.length;
  const isPenuh = sisaTempat <= 0;

  async function handleDaftarAction(prevState: any, formData: FormData) {
    "use server";
    const nama = (formData.get("nama") as string)?.trim();
    const kelas = (formData.get("kelas") as string)?.trim();

    let errorNama = "";
    let errorKelas = "";

    if (!nama || nama.length < 3) {
      errorNama = "Nama minimal 3 huruf.";
    }
    if (!kelas || kelas.length < 3) {
      errorKelas = "Kelas minimal 3 karakter.";
    }

    if (errorNama || errorKelas) {
      return { errorNama, errorKelas, savedNama: nama, savedKelas: kelas };
    }

    // Cek ID ekskul valid
    const targetEkskul = dataEkskul.find((e) => e.id === id);
    if (!targetEkskul) {
      return {
        message: "ID ekstrakurikuler tidak valid.",
        savedNama: nama,
        savedKelas: kelas,
      };
    }

    // Cek kuota penuh
    const currentAnggota = pendaftar.filter((p) => p.ekskulId === id).length;
    if (currentAnggota >= targetEkskul.kuota) {
      return {
        message: `Kuota ${targetEkskul.nama} sudah penuh (${targetEkskul.kuota} orang).`,
        savedNama: nama,
        savedKelas: kelas,
      };
    }

    // Cek sudah terdaftar (case insensitive)
    const sudahTerdaftar = pendaftar.some(
      (p) =>
        p.ekskulId === id &&
        p.nama.toLowerCase() === nama.toLowerCase() &&
        p.kelas.toLowerCase() === kelas.toLowerCase(),
    );
    if (sudahTerdaftar) {
      return {
        message: `${nama} (${kelas}) sudah terdaftar di ${targetEkskul.nama}.`,
        savedNama: nama,
        savedKelas: kelas,
      };
    }

    // Cek bentrok jadwal
    const eskulMurid = pendaftar.filter(
      (p) =>
        p.nama.toLowerCase() === nama.toLowerCase() &&
        p.kelas.toLowerCase() === kelas.toLowerCase(),
    );
    for (const p of eskulMurid) {
      const eLain = dataEkskul.find((e) => e.id === p.ekskulId);
      if (
        eLain &&
        eLain.hari === targetEkskul.hari &&
        eLain.sesi === targetEkskul.sesi
      ) {
        return {
          message: `Jadwal bentrok dengan ${eLain.nama} (${eLain.hari}, sesi ${eLain.sesi}).`,
          savedNama: nama,
          savedKelas: kelas,
        };
      }
    }

    const nomorBaru = tambahPendaftar({ ekskulId: id, nama, kelas });

    // Simpan ke cookie
    cookieStore.set("nama_siswa", nama);
    cookieStore.set("kelas_siswa", kelas);

    revalidatePath(`/ekskul/${id}`);
    revalidatePath("/ekskul");

    return {
      success: `Pendaftaran #${nomorBaru} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi} (${JAM_SESI[targetEkskul.sesi]}).`,
      savedNama: nama,
      savedKelas: kelas,
    };
  }

  async function handleBatalAction(formData: FormData) {
    "use server";
    const nomor = Number(formData.get("nomor"));
    batalkanPendaftaran(nomor);
    revalidatePath(`/ekskul/${id}`);
    revalidatePath("/ekskul");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 md:p-12 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <Navbar />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              {ekskul.kategori}
            </span>
            <h1 className="text-3xl font-black text-slate-900">
              {ekskul.nama}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Pembina: {ekskul.pembina}
            </p>
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm text-slate-600">
              <p>
                📅 <b>Hari:</b> {ekskul.hari}, Sesi {ekskul.sesi} (
                {JAM_SESI[ekskul.sesi]})
              </p>
              <p>
                👥 <b>Kuota:</b>{" "}
                {isPenuh ? (
                  <span className="text-red-500 font-bold">Penuh</span>
                ) : (
                  `Sisa ${sisaTempat} dari ${ekskul.kuota} tempat`
                )}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              Formulir Pendaftaran
            </h2>
            <FormPendaftaran
              action={handleDaftarAction}
              isPenuh={isPenuh}
              initialNama={initialNama}
              initialKelas={initialKelas}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Daftar Anggota Terdaftar ({anggotaEkskul.length})
          </h3>
          {anggotaEkskul.length === 0 ? (
            <p className="text-sm text-slate-400 italic">
              Belum ada siswa yang mendaftar di ekskul ini.
            </p>
          ) : (
            <div className="space-y-2">
              {anggotaEkskul.map((p) => (
                <div
                  key={p.nomor}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl text-sm"
                >
                  <div>
                    <p className="font-bold text-slate-800">{p.nama}</p>
                    <p className="text-xs text-slate-500">{p.kelas}</p>
                  </div>
                  <form action={handleBatalAction}>
                    <input type="hidden" name="nomor" value={p.nomor} />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold transition"
                    >
                      Batalkan
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
