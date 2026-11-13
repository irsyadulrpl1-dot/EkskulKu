import Link from "next/link";
import { Ekskul } from "@/app/Data/ekskul";

type Props = {
  item: Ekskul;
  jumlahPendaftar: number;
  jamSesi: string;
};

export default function KartuEkskul({ item, jumlahPendaftar, jamSesi }: Props) {
  const sisaTempat = item.kuota - jumlahPendaftar;
  const isPenuh = sisaTempat <= 0;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
            {item.kategori}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Pembina: {item.pembina}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
          {item.nama}
        </h3>

        <div className="space-y-2 pt-2 border-t border-slate-50 text-xs font-medium text-slate-600">
          <p>
            📅 {item.hari}, Sesi {item.sesi} ({jamSesi})
          </p>
          <p>
            👥{" "}
            {isPenuh ? (
              <span className="text-red-500 font-extrabold bg-red-50 px-2 py-0.5 rounded-md">
                Penuh
              </span>
            ) : (
              <span className="text-slate-700 font-semibold">
                Sisa {sisaTempat} dari {item.kuota} tempat
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="pt-6 flex gap-2">
        <Link
          href={`/ekskul/${item.id}`}
          className="w-full block text-center bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm"
        >
          Daftar & Detail
        </Link>
      </div>
    </div>
  );
}
