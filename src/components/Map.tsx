
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/components/ui/sonner';

interface Province {
  name: string;
  coordinates: [number, number];
  description: string;
  code: string; // Añadimos el código de provincia para los archivos JSON
}

// Mantenemos el array de provincias con información y añadimos códigos para los archivos
const provinces: Province[] = [
  { name: 'Buenos Aires', coordinates: [-60.0000, -36.0000], description: 'La provincia más poblada de Argentina, sede de importantes centros urbanos e industriales.', code: 'BUENOSAIRES' },
  { name: 'Córdoba', coordinates: [-64.1833, -31.4167], description: 'Centro cultural y educativo, conocida por sus sierras y universidades.', code: 'CORDOBA' },
  { name: 'Santa Fe', coordinates: [-60.6667, -31.6333], description: 'Principal centro agroindustrial y puerto importante del país.', code: 'SANTAFE' },
  { name: 'Mendoza', coordinates: [-68.8333, -32.8833], description: 'Famosa por sus viñedos y el Monte Aconcagua.', code: 'MENDOZA' },
  { name: 'Tucumán', coordinates: [-65.2167, -26.8167], description: 'El jardín de la República, cuna de la independencia argentina.', code: 'TUCUMAN' },
  { name: 'Entre Ríos', coordinates: [-58.2333, -31.7333], description: 'Tierra de suaves colinas y ríos caudalosos.', code: 'ENTRERIOS' },
  { name: 'Salta', coordinates: [-65.4167, -24.7833], description: 'La Linda, conocida por su rica arquitectura colonial y paisajes.', code: 'SALTA' },
  { name: 'Misiones', coordinates: [-54.5167, -26.9167], description: 'Hogar de las Cataratas del Iguazú y selvas subtropicales.', code: 'MISIONES' },
  { name: 'Chaco', coordinates: [-59.0333, -27.4500], description: 'Región de gran diversidad cultural y natural.', code: 'CHACO' },
  { name: 'Santiago del Estero', coordinates: [-64.2667, -27.7833], description: 'La Madre de Ciudades, primera ciudad fundada en Argentina.', code: 'SANTIAGO' },
  { name: 'San Juan', coordinates: [-68.5167, -31.5333], description: 'Tierra del sol y del buen vino.', code: 'SANJUAN' },
  { name: 'Jujuy', coordinates: [-65.2997, -24.1858], description: 'Famosa por la Quebrada de Humahuaca y sus cerros multicolores.', code: 'JUJUY' },
  { name: 'Río Negro', coordinates: [-67.0833, -40.8000], description: 'Destino turístico con hermosos lagos y montañas.', code: 'RIONEGRO' },
  { name: 'Neuquén', coordinates: [-68.0591, -38.9516], description: 'Centro de deportes de invierno y paleontología.', code: 'NEUQUEN' },
  { name: 'Formosa', coordinates: [-58.1781, -26.1775], description: 'Rica en biodiversidad y culturas originarias.', code: 'FORMOSA' },
  { name: 'Chubut', coordinates: [-65.1026, -43.3002], description: 'Hogar de la ballena franca austral y pingüinos.', code: 'CHUBUT' },
  { name: 'San Luis', coordinates: [-66.3356, -33.3022], description: 'Provincia de las sierras y los diques.', code: 'SANLUIS' },
  { name: 'Corrientes', coordinates: [-58.8344, -27.4806], description: 'Tierra del Chamamé y los Esteros del Iberá.', code: 'CORRIENTES' },
  { name: 'La Pampa', coordinates: [-64.2875, -36.6167], description: 'Corazón de la región pampeana argentina.', code: 'LAPAMPA' },
  { name: 'Catamarca', coordinates: [-65.7859, -28.4696], description: 'Tierra de antiguos pueblos y paisajes lunares.', code: 'CATAMARCA' },
  { name: 'La Rioja', coordinates: [-66.8511, -29.4131], description: 'Provincia de parques naturales y viñedos.', code: 'LARIOJA' },
  { name: 'Santa Cruz', coordinates: [-69.2166, -48.8166], description: 'Hogar del Glaciar Perito Moreno.', code: 'SANTACRUZ' },
  { name: 'Tierra del Fuego', coordinates: [-67.7000, -54.8000], description: 'El fin del mundo, punto más austral de Argentina.', code: 'TIERRADELFUEGO' }
];

// Nueva URL base para los datos GeoJSON de provincias argentinas
const baseGeoJSONUrl = 'https://raw.githubusercontent.com/alvarezgarcia/provincias-argentinas-geojson/refs/heads/master/';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [provincesData, setProvincesData] = useState<Record<string, any>>({});
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos GeoJSON de las provincias individualmente
  useEffect(() => {
    const fetchProvinceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const provData: Record<string, any> = {};
        const loadingTracker: Record<string, boolean> = {};
        let errorCount = 0;
        
        // Cargar cada provincia por separado
        const promises = provinces.map(async (province) => {
          loadingTracker[province.code] = true;
          
          try {
            const url = `${baseGeoJSONUrl}${province.code}.json`;
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`Error al cargar ${province.name}: ${response.status}`);
            }
            
            const data = await response.json();
            provData[province.code] = data;
            loadingTracker[province.code] = false;
            
          } catch (provinceError) {
            console.error(`Error cargando ${province.name}:`, provinceError);
            errorCount++;
            loadingTracker[province.code] = false;
          }
        });
        
        await Promise.allSettled(promises);
        setProvincesData(provData);
        setLoadingStatus(loadingTracker);
        
        if (errorCount === provinces.length) {
          throw new Error("No se pudo cargar ninguna provincia");
        } else if (errorCount > 0) {
          toast.warning(`No se pudieron cargar ${errorCount} provincias`);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos de provincias:", error);
        setError(`No se pudieron cargar las provincias. ${error instanceof Error ? error.message : 'Error desconocido'}`);
        setLoading(false);
      }
    };

    fetchProvinceData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || loading) return;
    
    // Si hay un error y no hay datos, no inicializar el mapa
    if (error && Object.keys(provincesData).length === 0) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-64.0000, -38.4161],
      zoom: 4
    });

    // Agregar controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      try {
        // Agregar cada provincia como una fuente y capa separada
        Object.entries(provincesData).forEach(([code, data]) => {
          const provinceInfo = provinces.find(p => p.code === code);
          if (!provinceInfo) return;
          
          const sourceId = `province-${code}`;
          const fillLayerId = `province-fill-${code}`;
          const borderLayerId = `province-border-${code}`;
          
          // Añadir fuente
          map.current!.addSource(sourceId, {
            type: 'geojson',
            data: data as any
          });
          
          // Añadir capa de relleno
          map.current!.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: sourceId,
            layout: {},
            paint: {
              'fill-color': '#0080ff',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.7,
                0.5
              ]
            }
          });
          
          // Añadir capa de borde
          map.current!.addLayer({
            id: borderLayerId,
            type: 'line',
            source: sourceId,
            layout: {},
            paint: {
              'line-color': '#ffffff',
              'line-width': 1
            }
          });
          
          // Eventos para cambiar el cursor y el hover
          map.current!.on('mouseenter', fillLayerId, () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });
          
          map.current!.on('mouseleave', fillLayerId, () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });
          
          // Evento de clic para mostrar información
          map.current!.on('click', fillLayerId, () => {
            new mapboxgl.Popup()
              .setLngLat(provinceInfo.coordinates)
              .setHTML(`<h3 class="font-bold text-lg">${provinceInfo.name}</h3>
                        <p class="text-sm mt-1">${provinceInfo.description}</p>`)
              .addTo(map.current!);
          });
        });
        
      } catch (mapError) {
        console.error("Error al configurar el mapa:", mapError);
        toast.error(`Error al configurar el mapa: ${mapError instanceof Error ? mapError.message : 'Error desconocido'}`);
      }
    });

    return () => map.current?.remove();
  }, [mapboxToken, provincesData, loading, error]);

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
        {loading && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-gray-600">Cargando datos del mapa...</p>
          </div>
        )}
        
        {error && Object.keys(provincesData).length === 0 && (
          <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
            <p className="text-red-500 text-center mb-2">{error}</p>
            <p className="text-sm text-gray-600 text-center">
              Verifica tu conexión a Internet o utiliza una URL alternativa.
            </p>
          </div>
        )}
        
        <div ref={mapContainer} className={`w-full h-full ${loading || (error && Object.keys(provincesData).length === 0) ? 'hidden' : ''}`} />
      </div>
      
      <p className="text-sm text-gray-600 text-center">
        Haz clic en las provincias para ver información sobre cada una
      </p>
    </div>
  );
};

export default Map;
