"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { MFMap } from "react-map4d-map";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce, useGeolocation } from "react-haiku";
import { MapPin } from "./svg/map-pin";
import { getAddressFromLatLog } from "@/services/addressservices";
import { AddressComponent } from "./address/map-picker-modal";
interface Position {
  lat: number | null;
  lng: number | null;
}

const Map = memo(
  ({
    latitude,
    longitude,
    handleCameraChanging,
  }: {
    latitude: number | null;
    longitude: number | null;
    handleCameraChanging: ((args: any) => void) | undefined;
  }) => {
    return (
      <MFMap
        options={{
          center: { lat: latitude, lng: longitude },
          zoom: 16,
          controls: true,
          geolocate: true,
        }}
        version="2.4"
        accessKey={"905b71a5cd84156325aa6259e3f31ec9"}
        onCameraChanging={handleCameraChanging}
      />
    );
  }
);

function Map4DAutoSuggest({
  setAddressName,
}: {
  setAddressName: React.Dispatch<React.SetStateAction<AddressComponent[]>>;
}) {
  const { latitude, longitude, error, loading } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
  });
  const [position, setPosition] = useState<Position>({ lat: null, lng: null });
  const debouncedPosition = useDebounce(position, 1000);

  const handleCameraChanging = useCallback((event: any) => {
    const target = event.camera.target;
    console.log("chạy hàm này");
    setPosition({ lat: target.lat, lng: target.lng });
  }, []);

  useEffect(() => {
    if (!latitude && !longitude) return;
    const fetchAddress = async () => {
      try {
        const position = await getAddressFromLatLog(
          debouncedPosition.lat,
          debouncedPosition.lng
        );
        setAddressName(position.addressComponents);
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  }, [debouncedPosition]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
        <span className="text-sm font-medium">Đang lấy vị trí của bạn...</span>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="relative z-[50]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 pr-9 bg-white shadow-sm" disabled={loading} />
          {/* {(isSearching || isGeocoding || loading) && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )} */}
        </div>
      </div>

      <div className="flex-1 relative border rounded-md overflow-hidden min-h-[300px] bg-gray-100 group">
        <Map
          latitude={latitude}
          longitude={longitude}
          handleCameraChanging={handleCameraChanging}
        />
        {!loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[40] pointer-events-none pb-[38px]">
            <MapPin
              size={40}
              className={cn(
                "drop-shadow-xl text-red-600",
                loading ? "animate-bounce" : ""
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Map4DAutoSuggest;
