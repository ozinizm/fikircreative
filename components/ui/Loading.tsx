export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-red-600 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner />
      <p className="text-gray-400 mt-4">Yükleniyor...</p>
    </div>
  );
}
