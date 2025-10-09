// components/LocationViewSwitcher.tsx
"use client"; // 👈 Debe ser un Client Component

import { useState } from 'react';
import { List, Grid3X3 } from 'lucide-react';

import LocationsTablePresentation from './LocationsTablePresentation';
import LocationCardGrid from './LocationCardGrid';

// Importa tus componentes de presentación
//import LocationsTable from './LocationsTablePresentation';
//import LocationCardGrid from './LocationCardGrid';

// Tipos (pueden ser importados desde otro archivo si quieres)
type Location = { id: string; name: string; description: string | null; latitud: number; longitud: number; img: string; };

interface LocationViewSwitcherProps {
    initialLocations: Location[];
}



export default function LocationViewSwitcher({ initialLocations }: LocationViewSwitcherProps) {
    // 💡 Estado para alternar entre 'table' y 'card'
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table'); // Estado inicial: tabla

    return (
        <div>
            {/* 1. BOTONES DE ALTERNANCIA */}
            <div className="flex justify-end mb-4 space-x-2">
                <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    title="Ver como Tabla"
                >
                    <List size={20} />
                </button>
                <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-lg transition ${viewMode === 'card' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    title="Ver como Tarjetas"
                >
                    <Grid3X3 size={20} />
                </button>
            </div>

            {/* 2. RENDERIZADO CONDICIONAL */}
            {viewMode === 'table' ? (
                // La tabla recibe los datos
                <LocationsTablePresentation locations={initialLocations} />
            ) : (
                // El grid de tarjetas recibe los datos
                <LocationCardGrid locations={initialLocations} />
            )}
        </div>
    );
}
