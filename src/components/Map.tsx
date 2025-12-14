
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X } from "lucide-react";

interface Province {
  name: string;
  description: string;
  code: string;
}

interface Project {
  name: string;
  instagram?: string;
  x?: string;
  facebook?: string;
  web?: string;
  contacto?: string;
}

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const provinceProjects: Record<string, Project[]> = {
  'Buenos Aires': [
    {
      name: 'Nativas bonaerenses',
      instagram: 'www.instagram.com/nativas.bonaerenses',
      contacto: 'nativasbonaerensess@gmail.com',
    },
    {
      name: 'Flora del Sistema de Tandilia',
      instagram: 'www.instagram.com/flora.tandilia',
    },
    {
      name: 'Flora de Punta Alta',
      instagram: 'www.instagram.com/flora.de.punta.alta',
    },
    {
      name: 'Flora Nativa Bahía Blanca',
      instagram: 'www.instagram.com/floranativabb',
      facebook: 'www.facebook.com/floranativabb',
      web: 'https://floranativabb.com.ar',
      contacto: 'floranativabb@gmail.com',
    },
  ],
  Catamarca: [
    {
      name: 'Flora Catamarqueña',
      instagram: 'www.instagram.com/floracatamarquena',
    },
    {
      name: 'Nativas de las Sierras (Catamarca y Córdoba)',
      instagram: 'www.instagram.com/nativas.de.las.sierras',
    },
  ],
  Chubut: [
    {
      name: 'Nativas de Chubut',
      instagram: 'www.instagram.com/nativas.chubut',
    },
  ],
  Córdoba: [
    {
      name: 'Nativas de Córdoba',
      instagram: 'www.instagram.com/nativascordoba',
    },
    {
      name: 'Nativas de las Sierras (Catamarca y Córdoba)',
      instagram: 'www.instagram.com/nativas.de.las.sierras',
    },
  ],
  Corrientes: [
    {
      name: 'Nativas de Corrientes',
      instagram: 'www.instagram.com/nativasdecorrientes_arg',
    },
  ],
  Mendoza: [
    {
      name: 'Flora Mendocina',
      instagram: 'www.instagram.com/flora.mendocina',
      facebook: 'www.facebook.com/flora.mendocina',
    },
  ],
  Misiones: [
    {
      name: 'Flora Misionera',
      instagram: 'www.instagram.com/floramisionera',
    },
  ],
  Salta: [
    {
      name: 'Nativas de Salta',
      instagram: 'www.instagram.com/nativasdesalta',
    },
    {
      name: 'Nativas salteñas',
      instagram: 'www.instagram.com/saltanativas',
    },
  ],
  'San Luis': [
    {
      name: 'Nativas de San Luis',
      instagram: 'www.instagram.com/nativasdesanluis',
    },
  ],
  'Santiago del Estero': [
    {
      name: 'Nativas de Santiago del Estero',
      instagram: 'www.instagram.com/nativas_santiagodelestero',
    },
  ],
  'Tierra del Fuego': [
    {
      name: 'Flora de Tierra del Fuego',
      instagram: 'www.instagram.com/flora.de.tierradelfuego',
      facebook: 'www.facebook.com/floratdf',
    },
  ],
  Tucumán: [
    {
      name: 'Nativas tucumanas',
      instagram: 'www.instagram.com/nativastucumanas',
    },
    {
      name: 'Fundación Forestar',
      instagram: 'www.instagram.com/fundacionforestar',
    },
  ],
};

const argentinaProjects: Project[] = [
  {
    name: 'Helechos y Licófitas de Argentina',
    instagram: 'www.instagram.com/helechosylicofitasdeargentina',
    x: 'https://x.com/helechylicofarg',
    contacto: 'helechosylicofitasdeargentina@gmail.com',
  },
  {
    name: 'Sociedad Argentina de Botánica',
    instagram: 'www.instagram.com/socargbot',
    x: 'https://x.com/sabotanica',
    facebook: 'www.facebook.com/sabotanica',
    web: 'https://botanicaargentina.org.ar',
  },
];

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

const BASE_FILL_COLOR = '#68d070';
const ACTIVE_FILL_COLOR = '#55b85f';

const Map = () => {
  const [provincesData, setProvincesData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const [viewBox, setViewBox] = useState<string>("0 0 800 800");
  const [paths, setPaths] = useState<{ [key: string]: string }>({});
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [loadedProvinces, setLoadedProvinces] = useState<string[]>([]);
  const [failedProvinces, setFailedProvinces] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mapBounds, setMapBounds] = useState<{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  } | null>(null);
  const [santaCruzCenter, setSantaCruzCenter] = useState<{ x: number; y: number } | null>(null);
  const [countryHovered, setCountryHovered] = useState(false);

  const provinceNameByCode = useMemo(() => {
    return provinces.reduce<Record<string, string>>((acc, province) => {
      acc[province.code] = province.name;
      return acc;
    }, {});
  }, []);

  const selectedProvinceName = useMemo(() => {
    if (!selectedProvince) return null;
    return provinces.find((p) => p.code === selectedProvince)?.name ?? null;
  }, [selectedProvince]);

  const selectedProjects = useMemo(() => {
    if (countryOpen) return argentinaProjects;
    if (!selectedProvinceName) return null;
    return provinceProjects[selectedProvinceName] ?? [];
  }, [countryOpen, selectedProvinceName]);

  const selectedTitle = countryOpen ? 'Argentina' : selectedProvinceName;
  
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

      // Guardar bounds para Santa Cruz para posicionar el punto de Argentina
      let santaMinX = Infinity;
      let santaMinY = Infinity;
      let santaMaxX = -Infinity;
      let santaMaxY = -Infinity;
      
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

                  if (code === 'SANTACRUZ') {
                    santaMinX = Math.min(santaMinX, coord[0]);
                    santaMinY = Math.min(santaMinY, coord[1]);
                    santaMaxX = Math.max(santaMaxX, coord[0]);
                    santaMaxY = Math.max(santaMaxY, coord[1]);
                  }
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

                    if (code === 'SANTACRUZ') {
                      santaMinX = Math.min(santaMinX, coord[0]);
                      santaMinY = Math.min(santaMinY, coord[1]);
                      santaMaxX = Math.max(santaMaxX, coord[0]);
                      santaMaxY = Math.max(santaMaxY, coord[1]);
                    }
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

      setMapBounds({ minX, minY, maxX, maxY, width, height });

      if (santaMinX !== Infinity && santaMinY !== Infinity && santaMaxX !== -Infinity && santaMaxY !== -Infinity) {
        setSantaCruzCenter({
          x: (santaMinX + santaMaxX) / 2,
          y: (santaMinY + santaMaxY) / 2,
        });
      }
      
      setPaths(svgPaths);
    } catch (error) {
      console.error("Error al procesar los datos GeoJSON:", error);
      toast.error("Error al procesar los datos del mapa");
    }
  };

  // Función para manejar el clic en una provincia
  const handleProvinceClick = (code: string) => {
    console.log("Provincia clickeada:", code);
    setCountryOpen(false);
    setSelectedProvince(selectedProvince === code ? null : code);
  };

  const closePanel = () => {
    setSelectedProvince(null);
    setCountryOpen(false);
  };

  const renderProject = (project: Project) => {
    const items: Array<{ label: string; value: string; href?: string }> = [];

    if (project.instagram) {
      const href = normalizeUrl(project.instagram);
      items.push({ label: 'Instagram', value: project.instagram, href });
    }
    if (project.x) {
      const href = normalizeUrl(project.x);
      items.push({ label: 'X', value: project.x, href });
    }
    if (project.facebook) {
      const href = normalizeUrl(project.facebook);
      items.push({ label: 'Facebook', value: project.facebook, href });
    }
    if (project.web) {
      const href = normalizeUrl(project.web);
      items.push({ label: 'Web', value: project.web, href });
    }
    if (project.contacto) {
      items.push({ label: 'Contacto', value: project.contacto, href: `mailto:${project.contacto}` });
    }

    return (
      <div key={project.name} className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-900">{project.name}</h4>
        <div className="text-sm space-y-1 text-slate-600">
          {items.map((it) => (
            <div key={`${project.name}-${it.label}`}>
              <span className="font-medium text-slate-700">{it.label}: </span>
              {it.href ? (
                <a
                  href={it.href}
                  className="inline-flex items-center gap-1 break-words text-emerald-700 underline-offset-4 hover:text-emerald-800 hover:underline"
                  target={it.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={it.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                >
                  {it.value}
                  {!it.href.startsWith('mailto:') && <ExternalLink className="h-3.5 w-3.5" />}
                </a>
              ) : (
                <span className="break-words">{it.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
    <div className="w-full space-y-6">
      <header className="space-y-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Mapa interactivo de proyectos de divulgación
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            Desde Flora Nativa Bahía Blanca creemos en la divulgación como una herramienta clave para educar y concientizar sobre la gran diversidad floral y paisajística que existe en nuestro país. Por eso, este mapa interactivo reúne proyectos de divulgación sobre plantas nativas que se desarrollan en distintos puntos de la Argentina.
          </p>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          Al hacer clic sobre cada provincia, podrás conocer iniciativas que promueven la educación ambiental y la preservación de nuestra biodiversidad. ¡Te invitamos a explorarlos, apoyarlos y compartirlos!
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          Si conocés o formás parte de un proyecto que te gustaría incluir en este mapa,{' '}
          <a
            href="https://floranativabb.com.ar/contacto/"
            className="text-emerald-700 underline-offset-4 hover:text-emerald-800 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            contactanos
          </a>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-200/70 bg-emerald-50 text-emerald-900"
              >
                Explorá por provincias
              </Badge>
              <span className="text-xs text-slate-500">
                Presiona el círculo para info general
              </span>
            </div>
          </div>

          <div className="relative h-[62vh] min-h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50">
            <p className="mb-3 text-sm font-medium text-slate-700">Cargando mapa...</p>
            <Progress value={loadingProgress} className="w-64 h-2" />
            <p className="mt-2 text-xs text-slate-500">{loadingProgress}%</p>
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
          <div className="relative h-full w-full">
            <svg
              viewBox={viewBox}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ transform: "scale(1, -1)" }}
            >
              {mapBounds && (
                <circle
                  cx={Math.max(
                    mapBounds.maxX + mapBounds.width * 0.015,
                    Math.min(
                      mapBounds.maxX + mapBounds.width * 0.045,
                      (santaCruzCenter?.x ?? mapBounds.maxX) + mapBounds.width * 0.12
                    )
                  )}
                  cy={Math.max(
                    mapBounds.minY + mapBounds.height * 0.01,
                    Math.min(
                      mapBounds.maxY - mapBounds.height * 0.01,
                      (santaCruzCenter?.y ?? mapBounds.minY) - mapBounds.height * 0.08
                    )
                  )}
                  r={2}
                  fill={(countryOpen || countryHovered) ? ACTIVE_FILL_COLOR : BASE_FILL_COLOR}
                  stroke="#ffffff"
                  strokeWidth={0.25}
                  onMouseEnter={() => setCountryHovered(true)}
                  onMouseLeave={() => setCountryHovered(false)}
                  onClick={() => {
                    setCountryOpen((prev) => {
                      const next = !prev;
                      if (next) setSelectedProvince(null);
                      return next;
                    });
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCountryOpen((prev) => {
                        const next = !prev;
                        if (next) setSelectedProvince(null);
                        return next;
                      });
                    }
                  }}
                  aria-label="Ver información general de Argentina"
                  aria-pressed={countryOpen}
                  className="outline-none focus:outline-none focus-visible:stroke-slate-900 focus-visible:[stroke-width:0.6]"
                  style={{ cursor: 'pointer' }}
                />
              )}

              {Object.entries(paths).map(([code, pathData]) => (
                <path
                  key={code}
                  d={pathData}
                  fill={hoveredProvince === code || selectedProvince === code ? ACTIVE_FILL_COLOR : BASE_FILL_COLOR}
                  stroke="#ffffff"
                  strokeWidth={hoveredProvince === code || selectedProvince === code ? "0.25" : "0.15"}
                  onClick={() => handleProvinceClick(code)}
                  onMouseEnter={() => setHoveredProvince(code)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProvinceClick(code);
                    }
                  }}
                  aria-label={`Seleccionar provincia ${provinceNameByCode[code] ?? code}`}
                  aria-pressed={selectedProvince === code}
                  className="outline-none transition-colors duration-200 focus:outline-none focus-visible:stroke-slate-900 focus-visible:[stroke-width:0.6]"
                  style={{ cursor: "pointer" }}
                />
              ))}
            </svg>
          </div>
        )}
        
        {failedProvinces.length > 0 && !loading && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={retryFailedProvinces}
              variant="outline"
              size="sm"
              className="bg-white"
            >
              Recargar provincias ({failedProvinces.length})
            </Button>
          </div>
        )}
          </div>
        </div>

        <div className="lg:sticky lg:top-8">
          <Card className="overflow-hidden rounded-2xl border-slate-200/70 shadow-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    {selectedTitle ?? 'Detalle'}
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    {selectedTitle ? 'Información y enlaces' : 'Seleccioná una provincia'}
                  </p>
                </div>
                {(selectedProvince || countryOpen) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closePanel}
                    className="h-8 w-8 text-slate-500 hover:text-slate-900"
                    aria-label="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[360px] lg:h-[520px]">
                <div className="space-y-4 p-6">
                  {!selectedTitle && (
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-slate-600">
                        Hacé clic sobre una provincia para ver proyectos de divulgación, o seleccioná el círculo para información general.
                      </p>
                    </div>
                  )}

                  {selectedTitle && (
                    <div className="space-y-4">
                      {selectedProjects && selectedProjects.length > 0 ? (
                        selectedProjects.map(renderProject)
                      ) : (
                        <p className="text-sm text-slate-600">
                          No hemos encontrado un proyecto de divulgación para esta provincia.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;
