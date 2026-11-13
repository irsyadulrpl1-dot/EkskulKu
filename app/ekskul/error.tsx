"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md space-y-4">
        <h2 className="text-xl font-bold text-red-600">
          Terjadi Kesalahan (Galat)
        </h2>
        <p className="text-sm text-gray-500">
          Gagal memuat data ekstrakurikuler dari server.
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
