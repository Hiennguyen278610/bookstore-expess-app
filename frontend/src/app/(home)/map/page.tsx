"use client";

import Map4DAutoSuggest from '@/components/map-picker';

export default function MapPage() {
  return (
      <Map4DAutoSuggest apiKey={process.env.NEXT_PUBLIC_MAP4D_KEY || ""} />
  );
}
