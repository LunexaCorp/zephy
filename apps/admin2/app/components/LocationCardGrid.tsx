// components/LocationCardGrid.tsx

// Asegúrate de que la ruta de MediaCard sea correcta
import MediaCard from "../components/ui/MediaCard";

type Location = {
  id: string;
  name: string;
  description: string | null;
  img: string;
  latitud: number;
  longitud: number;
};

interface LocationCardGridProps {
    locations: Location[]; // Recibe la lista completa como prop
}

export default function LocationCardGrid({ locations }: LocationCardGridProps) {
    if (locations.length === 0) {
        return <p className="text-gray-400">No hay ubicaciones registradas aún.</p>;
    }

    return (
        // 💡 Usamos un grid responsivo con gap entre los elementos
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {locations.map((location) => (
                <MediaCard
                    key={location.id}
                    id={location.id}
                    image={location.img || "https://via.placeholder.com/345x140?text=No+Image"}
                    title={location.name}
                    description={location.description || "Sin descripción disponible."}
                    //locationId={location.id} // Necesitas pasar el ID para las acciones de Editar/Eliminar
                />
            ))}
        </div>
    );
}
