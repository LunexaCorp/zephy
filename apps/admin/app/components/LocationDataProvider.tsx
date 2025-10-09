// components/LocationDataProvider.tsx

// IMPORTANTE: Mantenemos el fetch aquí para aprovechar el Server Component y el caching de Next.js.
import LocationViewSwitcher from './LocationViewSwitcher'; // 👈 Nuevo Client Component

type Location = {
  id: string;
  name: string;
  description: string | null;
  latitud: number;
  longitud: number;
  img: string;
};

type ApiResponse = {
  locations: Location[];
};

export default async function LocationDataProvider() {
  let locations: Location[] = [];

  try {
    const res = await fetch('http://localhost:3000/api/locations', {
      cache: 'no-store', // o 'force-cache' si quieres usar la caché de la API
    });

    if (!res.ok) {
        // En un Server Component, es mejor lanzar un error o usar `notFound`
        // o devolver un mensaje de error como ya lo hacías.
        return (
             <div className="text-red-500 bg-gray-900 p-4 rounded-lg">
                 Error al cargar los datos de ubicación.
             </div>
         );
    }

    const data = (await res.json()) as ApiResponse;
    locations = data.locations;

  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return (
      <div className="text-red-500 bg-gray-900 p-4 rounded-lg">
        Error al cargar los datos de ubicación. Por favor, inténtalo de nuevo.
      </div>
    );
  }

  // Si no hay ubicaciones
  if (locations.length === 0) {
    return <p className="text-gray-400">No hay ubicaciones registradas aún.</p>;
  }

  // 💡 PASAMOS LOS DATOS AL COMPONENTE CLIENTE
  return <LocationViewSwitcher initialLocations={locations} />;
}
