import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  apiKey: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
  address?: string;
  companyName?: string;
}

export default function GoogleMap({ 
  apiKey, 
  center, 
  zoom = 15, 
  className = '', 
  address = '',
  companyName = 'DOMREALCE'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default center for DOMREALCE location
  const defaultCenter = { lat: 41.2055, lng: -8.3349 };
  const mapCenter = center ?? defaultCenter;

  useEffect(() => {
    // Check if Google Maps is already loaded
    if ((window as any).google && (window as any).google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
      initializeMap();
    };
    
    script.onerror = () => {
      setError('Erro ao carregar o Google Maps');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, center?.lat, center?.lng, zoom]);

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google) return;

    try {
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: zoom,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{ "color": "#0a0a0a" }]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#0a0a0a" }]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#263c3f" }]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#6b9a76" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#38414e" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#212a37" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9ca5b3" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#746855" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#1f2835" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#f3d19c" }]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#515c6d" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#17263c" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      });

      // Add custom marker
      const marker = new (window as any).google.maps.Marker({
        position: mapCenter,
        map: map,
        title: companyName,
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          fillColor: '#FFD700',
          fillOpacity: 1,
          strokeColor: '#FF6B35',
          strokeWeight: 3,
          scale: 12
        }
      });

      // Info window removed - no popup on map

    } catch (err) {
      setError('Erro ao inicializar o mapa');
      console.error('Google Maps error:', err);
    }
  };

  if (error) {
    return (
      <div className={`bg-gray-900 rounded-lg border-2 border-red-500/30 p-8 ${className}`}>
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">❌ {error}</p>
          <p className="text-sm">Por favor, tente recarregar a página</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-brand-yellow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
            <p>A carregar mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}