"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { MFMap } from "react-map4d-map";
import { Loader2, Search } from "lucide-react";
// Shadcn UI Components
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Hook lấy GPS
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { MapPin } from '@/components/svg/map-pin';

interface Position {
  lat: number;
  lng: number;
}

interface AutoSuggestItem {
  id?: string;
  name: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface Map4DAutoSuggestProps {
  apiKey: string;
  defaultCenter?: Position;
  zoom?: number;
  className?: string;
  onSelect?: (data: { address: string; location: Position }) => void;
}

const Map4DAutoSuggest: React.FC<Map4DAutoSuggestProps> = ({
                                                             apiKey,
                                                             defaultCenter = { lat: 10.7769, lng: 106.6951 },
                                                             zoom = 16,
                                                             className,
                                                             onSelect,
                                                           }) => {
  const { location: userLocation, loading: geoLoading } = useGeoLocation();

  const [query, setQuery] = useState("");
  const [suggests, setSuggests] = useState<AutoSuggestItem[]>([]);

  // State tìm kiếm & geocoding
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Refs
  const debounceSearchRef = useRef<NodeJS.Timeout | null>(null);
  const debounceCameraRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipNextGeocodeRef = useRef(false);
  const mapInstanceRef = useRef<any>(null);

  const fetchAddressFromCenter = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await axios.get("https://api.map4d.vn/sdk/v2/geocode", {
        params: {
          key: apiKey,
          location: `${lat},${lng}`,
        },
      });
      const results = res.data.result;

      if (results && results.length > 0) {
        const firstMatch = results[0];
        const address = firstMatch.address;

        setQuery(address);

        if (onSelect) {
          onSelect({
            address: address,
            location: { lat, lng },
          });
        }
      } else {
        setQuery(`Tọa độ: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        if (onSelect) {
          onSelect({
            address: `Tọa độ: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            location: { lat, lng },
          });
        }
      }
    } catch (error) {
      console.error("Geocode Error:", error);
      setQuery("Lỗi kết nối bản đồ");
    } finally {
      setIsGeocoding(false);
    }
  }, [apiKey, onSelect]);

  const handleCameraChanging = (args: any) => {
    const target = args.camera.target;

    if (debounceCameraRef.current) {
      clearTimeout(debounceCameraRef.current);
    }

    debounceCameraRef.current = setTimeout(() => {
      if (skipNextGeocodeRef.current) {
        skipNextGeocodeRef.current = false;
        return;
      }
      fetchAddressFromCenter(target.lat, target.lng);
    }, 600);
  };

  useEffect(() => {
    if (!isFocused || !query.trim()) {
      setSuggests([]);
      return;
    }

    if (debounceSearchRef.current) clearTimeout(debounceSearchRef.current);

    debounceSearchRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await axios.get("https://api.map4d.vn/sdk/autosuggest", {
          params: { key: apiKey, text: query },
        });
        setSuggests(res.data.result || []);
      } catch (err) {
        setSuggests([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceSearchRef.current) clearTimeout(debounceSearchRef.current);
    };
  }, [query, apiKey, isFocused]);

  const handleSelectSuggest = (item: AutoSuggestItem) => {
    skipNextGeocodeRef.current = true;
    if (debounceCameraRef.current) clearTimeout(debounceCameraRef.current);

    setQuery(item.name);
    setSuggests([]);
    setIsFocused(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.moveCamera({
        target: item.location,
        zoom: 17
      });
    }

    if (onSelect) {
      onSelect({
        address: item.address || item.name,
        location: item.location,
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initialCenter = userLocation || defaultCenter;

  return (
    <div className={cn("w-full h-full flex flex-col gap-4", className)}>
      <div className="relative z-[50]" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={isGeocoding ? "Đang xác định vị trí..." : "Tìm kiếm địa điểm..."}
            className="pl-9 pr-9 bg-white shadow-sm"
            disabled={geoLoading}
          />
          {(isSearching || isGeocoding || geoLoading) && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {isFocused && suggests.length > 0 && (
          <div className="absolute z-[60] mt-1 w-full rounded-md border bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
            <ul className="max-h-[260px] overflow-auto py-1">
              {suggests.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggest(item)}
                  className="flex cursor-pointer flex-col px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.address && (
                    <span className="text-xs text-muted-foreground truncate">
                      {item.address}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1 relative border rounded-md overflow-hidden min-h-[300px] bg-gray-100 group">

        {geoLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
            <span className="text-sm font-medium">Đang lấy vị trí của bạn...</span>
          </div>
        ) : (
          <MFMap
            options={{
              center: initialCenter,
              zoom,
              controls: true,
              geolocate: true
            }}
            version="2.4"
            accessKey={apiKey}
            onMapReady={(map) => {
              mapInstanceRef.current = map;
            }}
            onCameraChanging={handleCameraChanging}
          />
        )}

        {!geoLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[40] pointer-events-none pb-[38px]">
            <MapPin
              size={40}
              className={cn(
                "drop-shadow-xl text-red-600",
                isGeocoding ? "animate-bounce" : ""
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Map4DAutoSuggest;