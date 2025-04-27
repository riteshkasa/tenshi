'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ClientOnly from './ClientOnly';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the shape of marker data
interface MarkerData {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
}

export default function MapView({ center, zoom = 14, markers }: MapProps) {
  // Fix Leaflet default icon issues
  useEffect(() => {
    // This check ensures it runs only in the browser
    if (typeof window !== 'undefined') {
      // Dynamic import to ensure it only happens client-side
      (async () => {
        // Fix the marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        
        // Create a custom red icon for the current location
        const redIcon = new L.Icon({
          iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28]
        });
      })();
    }
  }, []);

  // Log markers for debugging
  console.log('Markers received in MapView:', markers);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '50vh', position: 'relative' }}>
      <ClientOnly>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{
            height: '100%',
            width: '100%', 
            minHeight: '50vh',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[34.070211, -118.45]} icon={new L.Icon({
            iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28]
          })}>
            <Popup>Patient's Location</Popup>
          </Marker>
          {/* Render markers if the markers prop is provided */}
          {markers && markers.length > 0 && markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
              <Popup>
                {marker.name}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </ClientOnly>
    </div>
  );
}