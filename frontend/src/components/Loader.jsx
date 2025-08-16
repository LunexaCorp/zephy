export default function Loader({ message }) {
  return (
    <div className="fixed inset-0 bg-gray-900/90 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
      <p className="text-emerald-400">{message || "Cargando..."}</p>
    </div>
  );
}
