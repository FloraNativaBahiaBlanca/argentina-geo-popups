
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  
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
        
        // Calcular progreso
        const totalProvinces = provinces.length;
        let completedCount = 0;
        
        // Cargar cada provincia por separado
        for (const province of provinces) {
          try {
            const url = `${baseGeoJSONUrl}${province.code}.json`;
            console.log(`Intentando cargar: ${province.name} desde ${url}`);
            
            const response = await fetch(url, { cache: 'no-store' });
            
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
          } finally {
            // Actualizar progreso
            completedCount++;
            const progress = Math.round((completedCount / totalProvinces) * 100);
            setLoadingProgress(progress);
          }
        }
        
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
        
        processGeoJSONData(provData);
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
  const processGeoJSONData = (data: Record<string, any>) => {
    try {
      if (Object.keys(data).length === 0) return;
      
      // Crear un objeto para almacenar los paths de cada provincia
      const svgPaths: { [key: string]: string } = {};
      
      // Encontrar los límites del mapa completo
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      
      Object.entries(data).forEach(([code, geoData]) => {
        if (!geoData || !geoData.features) return;
        
        geoData.features.forEach((feature: any) => {
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
    } catch (error) {
      console.error("Error al procesar los datos GeoJSON:", error);
      toast.error("Error al procesar los datos del mapa");
    }
  };

  // Función para manejar el clic en una provincia
  const handleProvinceClick = (code: string) => {
    console.log("Provincia clickeada:", code);
    setSelectedProvince(selectedProvince === code ? null : code);
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
          const response = await fetch(url, { cache: 'no-store' });
          
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
        processGeoJSONData(newProvData);
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
      
      <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-lg relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
            <p className="text-gray-600 mb-2">Cargando datos del mapa...</p>
            <Progress value={loadingProgress} className="w-64 h-2" />
            <p className="text-sm text-gray-500 mt-2">{loadingProgress}%</p>
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
        
        {Object.keys(paths).length > 0 && (
          <div className="relative w-full h-full">
            <TooltipProvider>
              <svg
                viewBox={viewBox}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                style={{ transform: "scale(1, -1)" }} 
              >
                {Object.entries(paths).map(([code, pathData]) => {
                  const province = provinces.find(p => p.code === code);
                  return (
                    <Popover key={code} open={selectedProvince === code} onOpenChange={(open) => {
                      if (!open) setSelectedProvince(null);
                    }}>
                      <PopoverTrigger asChild>
                        <path
                          d={pathData}
                          fill={hoveredProvince === code || selectedProvince === code ? "#0066cc" : "#0080ff"}
                          stroke="#ffffff"
                          strokeWidth="0.1"
                          className="transition-colors duration-200"
                          onClick={() => handleProvinceClick(code)}
                          onMouseEnter={() => setHoveredProvince(code)}
                          onMouseLeave={() => setHoveredProvince(null)}
                          style={{ cursor: 'pointer' }}
                        />
                      </PopoverTrigger>
                      <PopoverContent 
                        className="bg-white p-3 rounded-lg shadow-lg max-w-xs border z-50"
                        side="top"
                        sideOffset={5}
                      >
                        <h3 className="font-bold text-lg">
                          {province?.name}
                        </h3>
                        <p className="text-sm mt-1">
                          {province?.description}
                        </p>
                      </PopoverContent>
                    </Popover>
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
