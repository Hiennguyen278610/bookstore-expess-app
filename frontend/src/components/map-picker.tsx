"use client";

import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, memo } from "react";

// Component điều khiển bay (FlyTo)
function MapController({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap();
  const prevCenter = useRef(center);

  useEffect(() => {
    if (center.lat !== prevCenter.current.lat || center.lng !== prevCenter.current.lng) {
      map.setView([center.lat, center.lng], 16, { animate: true, duration: 1.5 });
      prevCenter.current = center;
    }
  }, [center, map]);

  return null;
}

function MapEvents({ onMoveEnd }: { onMoveEnd: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const c = map.getCenter();
      onMoveEnd(c.lat, c.lng);
    },
  });
  return null;
}

const MapPicker = memo(function MapPicker({
                                            center,
                                            onLocationSelect
                                          }: {
  center: { lat: number, lng: number },
  onLocationSelect: (lat: number, lng: number) => void
}) {
  const tileKey = process.env.NEXT_PUBLIC_GOONG_MAP_TILES_KEY || "";

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* SỬ DỤNG GOONG TILES */}
        <TileLayer
          attribution='&copy; Goong Maps'
          url={`https://tiles.goong.io/assets/goong_map_web/{z}/{x}/{y}.png?api_key=${tileKey}`}
        />

        <MapController center={center} />
        <MapEvents onMoveEnd={onLocationSelect} />
      </MapContainer>
    </div>
  );
}, (prev, next) => prev.center.lat === next.center.lat && prev.center.lng === next.center.lng);

export default MapPicker;