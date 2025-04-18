
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Province {
  name: string;
  coordinates: [number, number];
  description: string;
}

const provinces: Province[] = [
  { name: 'Buenos Aires', coordinates: [-60.0000, -36.0000], description: 'La provincia más poblada de Argentina, sede de importantes centros urbanos e industriales.' },
  { name: 'Córdoba', coordinates: [-64.1833, -31.4167], description: 'Centro cultural y educativo, conocida por sus sierras y universidades.' },
  { name: 'Santa Fe', coordinates: [-60.6667, -31.6333], description: 'Principal centro agroindustrial y puerto importante del país.' },
  { name: 'Mendoza', coordinates: [-68.8333, -32.8833], description: 'Famosa por sus viñedos y el Monte Aconcagua.' },
  { name: 'Tucumán', coordinates: [-65.2167, -26.8167], description: 'El jardín de la República, cuna de la independencia argentina.' },
  { name: 'Entre Ríos', coordinates: [-58.2333, -31.7333], description: 'Tierra de suaves colinas y ríos caudalosos.' },
  { name: 'Salta', coordinates: [-65.4167, -24.7833], description: 'La Linda, conocida por su rica arquitectura colonial y paisajes.' },
  { name: 'Misiones', coordinates: [-54.5167, -26.9167], description: 'Hogar de las Cataratas del Iguazú y selvas subtropicales.' },
  { name: 'Chaco', coordinates: [-59.0333, -27.4500], description: 'Región de gran diversidad cultural y natural.' },
  { name: 'Santiago del Estero', coordinates: [-64.2667, -27.7833], description: 'La Madre de Ciudades, primera ciudad fundada en Argentina.' },
  { name: 'San Juan', coordinates: [-68.5167, -31.5333], description: 'Tierra del sol y del buen vino.' },
  { name: 'Jujuy', coordinates: [-65.2997, -24.1858], description: 'Famosa por la Quebrada de Humahuaca y sus cerros multicolores.' },
  { name: 'Río Negro', coordinates: [-67.0833, -40.8000], description: 'Destino turístico con hermosos lagos y montañas.' },
  { name: 'Neuquén', coordinates: [-68.0591, -38.9516], description: 'Centro de deportes de invierno y paleontología.' },
  { name: 'Formosa', coordinates: [-58.1781, -26.1775], description: 'Rica en biodiversidad y culturas originarias.' },
  { name: 'Chubut', coordinates: [-65.1026, -43.3002], description: 'Hogar de la ballena franca austral y pingüinos.' },
  { name: 'San Luis', coordinates: [-66.3356, -33.3022], description: 'Provincia de las sierras y los diques.' },
  { name: 'Corrientes', coordinates: [-58.8344, -27.4806], description: 'Tierra del Chamamé y los Esteros del Iberá.' },
  { name: 'La Pampa', coordinates: [-64.2875, -36.6167], description: 'Corazón de la región pampeana argentina.' },
  { name: 'Catamarca', coordinates: [-65.7859, -28.4696], description: 'Tierra de antiguos pueblos y paisajes lunares.' },
  { name: 'La Rioja', coordinates: [-66.8511, -29.4131], description: 'Provincia de parques naturales y viñedos.' },
  { name: 'Santa Cruz', coordinates: [-69.2166, -48.8166], description: 'Hogar del Glaciar Perito Moreno.' },
  { name: 'Tierra del Fuego', coordinates: [-67.7000, -54.8000], description: 'El fin del mundo, punto más austral de Argentina.' }
];

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-64.0000, -38.4161],
      zoom: 4
    });

    // Agregar controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Agregar marcadores y popups para cada provincia
    provinces.forEach(province => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3 class="font-bold text-lg">${province.name}</h3>
                  <p class="text-sm mt-1">${province.description}</p>`);

      new mapboxgl.Marker({
        color: "#1EAEDB"
      })
        .setLngLat(province.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => map.current?.remove();
  }, [mapboxToken]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2">Mapa Interactivo de Argentina</h1>
      {!mapboxToken && (
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Ingresa tu token público de Mapbox"
            className="w-full p-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <p className="text-sm text-gray-600 mt-1">
            Obtén tu token público en mapbox.com
          </p>
        </div>
      )}
      <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-lg">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      <p className="text-sm text-gray-600 text-center">
        Haz clic en los marcadores para ver información sobre cada provincia
      </p>
    </div>
  );
};

export default Map;
