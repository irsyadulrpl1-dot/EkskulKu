"use client";

import { useActionState } from "react";

type FormState = {
  message?: string;
  errorNama?: string;
  errorKelas?: string;
  success?: string;
  savedNama?: string;
  savedKelas?: string;
};

type Props = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  isPenuh: boolean;
  initialNama?: string;
  initialKelas?: string;
};

export default function FormPendaftaran({
  action,
  isPenuh,
  initialNama = "",
  initialKelas = "",
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {
      savedNama: initialNama,
      savedKelas: initialKelas,
    },
  );

  if (isPenuh) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold text-center">
        Maaf, kuota ekstrakurikuler ini sudah penuh.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
          {state.message}
        </div>
      )}

      {state?.success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-semibold">
          {state.success}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">
          NAMA LENGKAP
        </label>
        <input
          type="text"
          name="nama"
          key={state?.savedNama ?? initialNama} // Kunci unik agar input merefresh nilainya dengan benar tanpa mereset halaman
          defaultValue={state?.savedNama ?? initialNama}
          placeholder="Contoh: Budi Santoso"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state?.errorNama && (
          <p className="text-red-500 text-xs mt-1">{state.errorNama}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1">
          KELAS
        </label>
        <input
          type="text"
          name="kelas"
          key={state?.savedKelas ?? initialKelas}
          defaultValue={state?.savedKelas ?? initialKelas}
          placeholder="Contoh: XI RPL 1"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state?.errorKelas && (
          <p className="text-red-500 text-xs mt-1">{state.errorKelas}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center"
      >
        {pending ? "Memproses..." : "Kirim Pendaftaran"}
      </button>
    </form>
  );
}
