
import Map from '@/components/Map';
import * as topojson from 'topojson-client';

// Hacer topojson disponible globalmente
declare global {
  interface Window {
    topojson: typeof topojson;
  }
}

window.topojson = topojson;

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Map />
    </div>
  );
};

export default Index;
