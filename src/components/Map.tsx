import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Province {
  name: string;
  description: string;
  code: string;
}

// Mantenemos el array de provincias con información
const provinces: Province[] = [
  { name: 'Buenos Aires', description: 'La provincia más poblada de Argentina, sede de importantes centros urbanos e industriales.', code: 'BUENOSAIRES' },
  { name: 'Córdoba', description: 'Centro cultural y educativo, conocida por sus sierras y universidades.', code: 'CORDOBA' },
  { name: 'Santa Fe', description: 'Principal centro agroindustrial y puerto importante del país.', code: 'SANTAFE' },
  { name: 'Mendoza', description: 'Famosa por sus viñedos y el Monte Aconcagua.', code: 'MENDOZA' },
  { name: 'Tucumán', description: 'El jardín de la República, cuna de la independencia argentina.', code: 'TUCUMAN' },
  { name: 'Entre Ríos', description: 'Tierra de suaves colinas y ríos caudalosos.', code: 'ENTRERIOS' },
  { name: 'Salta', description: 'La Linda, conocida por su rica arquitectura colonial y paisajes.', code: 'SALTA' },
  { name: 'Misiones', description: 'Hogar de las Cataratas del Iguazú y selvas subtropicales.', code: 'MISIONES' },
  { name: 'Chaco', description: 'Región de gran diversidad cultural y natural.', code: 'CHACO' },
  { name: 'Santiago del Estero', description: 'La Madre de Ciudades, primera ciudad fundada en Argentina.', code: 'SANTIAGODELESTERO' },
  { name: 'San Juan', description: 'Tierra del sol y del buen vino.', code: 'SANJUAN' },
  { name: 'Jujuy', description: 'Famosa por la Quebrada de Humahuaca y sus cerros multicolores.', code: 'JUJUY' },
  { name: 'Río Negro', description: 'Destino turístico con hermosos lagos y montañas.', code: 'RIONEGRO' },
  { name: 'Neuquén', description: 'Centro de deportes de invierno y paleontología.', code: 'NEUQUEN' },
  { name: 'Formosa', description: 'Rica en biodiversidad y culturas originarias.', code: 'FORMOSA' },
  { name: 'Chubut', description: 'Hogar de la ballena franca austral y pingüinos.', code: 'CHUBUT' },
  { name: 'San Luis', description: 'Provincia de las sierras y los diques.', code: 'SANLUIS' },
  { name: 'Corrientes', description: 'Tierra del Chamamé y los Esteros del Iberá.', code: 'CORRIENTES' },
  { name: 'La Pampa', description: 'Corazón de la región pampeana argentina.', code: 'LAPAMPA' },
  { name: 'Catamarca', description: 'Tierra de antiguos pueblos y paisajes lunares.', code: 'CATAMARCA' },
  { name: 'La Rioja', description: 'Provincia de parques naturales y viñedos.', code: 'LARIOJA' },
  { name: 'Santa Cruz', description: 'Hogar del Glaciar Perito Moreno.', code: 'SANTACRUZ' },
  { name: 'Tierra del Fuego', description: 'El fin del mundo, punto más austral de Argentina.', code: 'TIERRADELFUEGO' }
];

// URL para los datos GeoJSON
const baseGeoJSONUrl = 'https://raw.githubusercontent.com/alvarezgarcia/provincias-argentinas-geojson/refs/heads/master/';

const Map = () => {
  const [provincesData, setProvincesData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState<string>("0 0 800 800");
  const [paths, setPaths] = useState<{ [key: string]: string }>({});
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [loadedProvinces, setLoadedProvinces] = useState<string[]>([]);
  const [failedProvinces, setFailedProvinces] = useState<string[]>([]);
  const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);

  // Cargar los datos GeoJSON de las provincias
  useEffect(() => {
    const fetchProvinceData = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadedProvinces([]);
        setFailedProvinces([]);
        
        const provData: Record<string, any> = {};
        let errorCount = 0;
        const loaded: string[] = [];
        const failed: string[] = [];
        
        // Cargar cada provincia por separado
        const promises = provinces.map(async (province) => {
          try {
            const url = `${baseGeoJSONUrl}${province.code}.json`;
            console.log(`Intentando cargar: ${province.name} desde ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`Error al cargar ${province.name}: ${response.status}`);
            }
            
            const data = await response.json();
            provData[province.code] = data;
            loaded.push(province.code);
            console.log(`Provincia cargada con éxito: ${province.name}`);
            
          } catch (provinceError) {
            console.error(`Error cargando ${province.name}:`, provinceError);
            errorCount++;
            failed.push(province.code);
          }
        });
        
        await Promise.allSettled(promises);
        setProvincesData(provData);
        setLoadedProvinces(loaded);
        setFailedProvinces(failed);
        
        if (errorCount === provinces.length) {
          throw new Error("No se pudo cargar ninguna provincia");
        } else if (errorCount > 0) {
          const failedNames = provinces
            .filter(p => failed.includes(p.code))
            .map(p => p.name)
            .join(", ");
          toast.warning(`No se pudieron cargar ${errorCount} provincias: ${failedNames}`);
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

  // Procesar los datos GeoJSON para generar los paths de SVG
  useEffect(() => {
    if (Object.keys(provincesData).length === 0) return;

    try {
      // Crear un objeto para almacenar los paths de cada provincia
      const svgPaths: { [key: string]: string } = {};
      
      // Encontrar los límites del mapa completo
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      
      Object.entries(provincesData).forEach(([code, data]) => {
        if (!data || !data.features) return;
        
        data.features.forEach((feature: any) => {
          if (feature.geometry && feature.geometry.coordinates) {
            const { geometry } = feature;
            
            // Procesar diferentes tipos de geometrías
            if (geometry.type === 'Polygon') {
              // Manejar polígonos individuales
              geometry.coordinates.forEach((ring: number[][]) => {
                const pathPoints = ring.map(coord => {
                  minX = Math.min(minX, coord[0]);
                  minY = Math.min(minY, coord[1]);
                  maxX = Math.max(maxX, coord[0]);
                  maxY = Math.max(maxY, coord[1]);
                  return `${coord[0]},${coord[1]}`;
                });
                
                const pathStr = `M ${pathPoints.join(' L ')} Z`;
                svgPaths[code] = (svgPaths[code] || '') + pathStr;
              });
            } 
            else if (geometry.type === 'MultiPolygon') {
              // Manejar multipolígonos (colecciones de polígonos)
              geometry.coordinates.forEach((polygon: number[][][]) => {
                polygon.forEach((ring: number[][]) => {
                  const pathPoints = ring.map(coord => {
                    minX = Math.min(minX, coord[0]);
                    minY = Math.min(minY, coord[1]);
                    maxX = Math.max(maxX, coord[0]);
                    maxY = Math.max(maxY, coord[1]);
                    return `${coord[0]},${coord[1]}`;
                  });
                  
                  const pathStr = `M ${pathPoints.join(' L ')} Z`;
                  svgPaths[code] = (svgPaths[code] || '') + pathStr;
                });
              });
            }
          }
        });
      });
      
      // Establecer el viewBox del SVG basado en los límites encontrados
      const width = maxX - minX;
      const height = maxY - minY;
      // Añadir un margen del 5% alrededor del mapa
      const margin = 0.05;
      setViewBox(`${minX - width * margin} ${minY - height * margin} ${width * (1 + 2 * margin)} ${height * (1 + 2 * margin)}`);
      
      setPaths(svgPaths);
      
      // Verificar si Córdoba está cargada
      if (!svgPaths['CORDOBA'] && !failedProvinces.includes('CORDOBA')) {
        console.warn("Córdoba no se cargó correctamente en el mapa");
        toast.error("No se pudo cargar la provincia de Córdoba");
      }
    } catch (error) {
      console.error("Error al procesar los datos GeoJSON:", error);
      toast.error("Error al procesar los datos del mapa");
    }
  }, [provincesData, failedProvinces]);

  // Función para manejar el clic en una provincia
  const handleProvinceClick = (code: string, event: React.MouseEvent) => {
    const province = provinces.find(p => p.code === code);
    if (province) {
      // Toggle selected province if clicking the same one
      if (selectedProvince === code) {
        setSelectedProvince(null);
      } else {
        setSelectedProvince(code);
        // Capture click position for the tooltip
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setClickPosition({ x, y });
      }
    }
  };

  // Función para cerrar el popup
  const closePopup = () => {
    setSelectedProvince(null);
  };

  // Función para intentar volver a cargar las provincias fallidas
  const retryFailedProvinces = async () => {
    if (failedProvinces.length === 0) return;
    
    try {
      setLoading(true);
      const newProvData = { ...provincesData };
      const stillFailed: string[] = [];
      let reloadedCount = 0;
      
      for (const code of failedProvinces) {
        try {
          const province = provinces.find(p => p.code === code);
          if (!province) continue;
          
          const url = `${baseGeoJSONUrl}${code}.json`;
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`Error al cargar ${province.name}: ${response.status}`);
          }
          
          const data = await response.json();
          newProvData[code] = data;
          reloadedCount++;
        } catch (error) {
          stillFailed.push(code);
        }
      }
      
      if (reloadedCount > 0) {
        setProvincesData(newProvData);
        setFailedProvinces(stillFailed);
        toast.success(`Se cargaron ${reloadedCount} provincias adicionales`);
      } else {
        toast.error("No se pudieron cargar las provincias faltantes");
      }
    } catch (error) {
      console.error("Error al recargar provincias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2">Mapa Interactivo de Argentina</h1>
      
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
        
        {!loading && Object.keys(paths).length > 0 && (
          <div className="relative w-full h-full">
            <TooltipProvider>
              <svg
                viewBox={viewBox}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: "scale(1, -1)" }} /* Aplicar reflejo vertical */
              >
                {Object.entries(paths).map(([code, pathData]) => {
                  const province = provinces.find(p => p.code === code);
                  return (
                    <Tooltip key={code}>
                      <TooltipTrigger asChild>
                        <path
                          d={pathData}
                          fill={hoveredProvince === code || selectedProvince === code ? "#0066cc" : "#0080ff"}
                          stroke="#ffffff"
                          strokeWidth="0.1"
                          className="transition-colors duration-200"
                          onClick={(e) => handleProvinceClick(code, e)}
                          onMouseEnter={() => setHoveredProvince(code)}
                          onMouseLeave={() => setHoveredProvince(null)}
                          style={{ cursor: 'pointer' }}
                        />
                      </TooltipTrigger>
                      {selectedProvince === code && (
                        <TooltipContent 
                          side="top" 
                          className="bg-white p-4 rounded-lg shadow-lg max-w-xs border z-50"
                          sideOffset={5}
                        >
                          <h3 className="font-bold text-lg">
                            {province?.name}
                          </h3>
                          <p className="text-sm mt-1">
                            {province?.description}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </svg>
            </TooltipProvider>
          </div>
        )}
        
        {failedProvinces.length > 0 && !loading && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={retryFailedProvinces}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Recargar provincias faltantes ({failedProvinces.length})
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <p className="text-sm text-gray-600 text-center">
          Provincias cargadas: {loadedProvinces.length}/{provinces.length}
        </p>
        {failedProvinces.length > 0 && (
          <p className="text-sm text-red-500 text-center">
            Provincias faltantes: {provinces.filter(p => failedProvinces.includes(p.code)).map(p => p.name).join(", ")}
          </p>
        )}
      </div>
      
      <p className="text-sm text-gray-600 text-center">
        Haz clic en las provincias para ver información sobre cada una
      </p>
    </div>
  );
};

export default Map;
