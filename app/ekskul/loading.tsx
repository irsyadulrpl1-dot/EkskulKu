export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex items-center justify-center">
      <div className="text-center space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mx-auto"></div>
        <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        <p className="text-sm text-gray-500 font-medium">
          Memuat data ekskul...
        </p>
      </div>
    </div>
  );
}
