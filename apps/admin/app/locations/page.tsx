import AddButton from "@/app/components/AddButton";
// 💡 Solo importamos el Data Provider
import LocationDataProvider from "@/app/components/LocationDataProvider";

export default function LocationsPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1>Administración de Ubicaciones</h1>
                <AddButton href="/locations/new" text="Añadir Nueva Ubicación" />
            </div>

            {/* FETCH Y EL CAMBIO DE VISTA */}
            <LocationDataProvider />
        </div>
    );
}
