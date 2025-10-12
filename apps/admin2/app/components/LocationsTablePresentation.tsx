import DeleteButton from "@/app/components/DeleteButton";
import EditButton from "@/app/components/EditButton";

interface LocationCardGridProps {
    locations: Location[]; // Recibe la lista completa como prop
}
type Location = {
  id: string;
  name: string;
  description: string | null;
  img: string; // La tarjeta necesita esta propiedad
  latitud: number; // Aunque no se muestren, se mantienen en el tipo
  longitud: number; // Aunque no se muestren, se mantienen en el tipo
};

export default function LocationsTablePresentation({ locations }: LocationCardGridProps) {

  return (
    <div className="overflow-x-auto bg-gray-800 shadow-xl rounded-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Latitud</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Longitud</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {locations.map((location) => (
            <tr key={location.id} className="hover:bg-gray-700 transition duration-150">
              <td className="px-6 py-4 font-medium text-white">{location.name}</td>
              <td className="px-6 py-4 truncate text-gray-300">{location.description}</td>
              <td className="px-6 py-4 text-gray-300">{location.latitud}</td>
              <td className="px-6 py-4 text-gray-300">{location.longitud}</td>
              <td className="px-6 py-4 flex justify-center space-x-3">
                <EditButton locationId={location.id} />
                <DeleteButton locationId={location.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
