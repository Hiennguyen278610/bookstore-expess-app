"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/map-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <Loader2 className="animate-spin text-primary" />
    </div>
  ),
});

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { address: string; lat: number; lng: number }) => void;
}

export const MapPickerModal = ({ isOpen, onClose, onConfirm }: MapPickerModalProps) => {
  const [tempSelected, setTempSelected] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const MAP4D_KEY = process.env.NEXT_PUBLIC_MAP4D_KEY || "";

  const handleConfirm = () => {
    if (tempSelected) {
      onConfirm(tempSelected);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // FIX BO GÓC: sm:rounded-xl và overflow-hidden
        className="w-screen h-[90vh] max-w-none sm:max-w-3xl sm:h-[80vh] p-0 flex flex-col gap-0 sm:rounded-xl overflow-hidden"
        aria-describedby="map-desc"
      >
        <DialogHeader className="p-4 bg-white border-b z-10">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MapPin className="text-primary" size={20} />
            Ghim vị trí trên bản đồ
          </DialogTitle>
          <DialogDescription id="map-desc" className="sr-only">
            Chọn vị trí chính xác
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 relative bg-gray-100 overflow-hidden">
          <MapPicker
            apiKey={MAP4D_KEY}
            className="h-full w-full"
            onSelect={(data) => setTempSelected({
              address: data.address,
              lat: data.location.lat,
              lng: data.location.lng
            })}
          />
        </div>

        <div className="p-4 bg-white border-t z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-bold uppercase">Vị trí đã chọn:</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {tempSelected ? tempSelected.address : "Vui lòng kéo bản đồ..."}
              </p>
            </div>
            <Button onClick={handleConfirm} disabled={!tempSelected} className="w-full md:w-auto">
              Xác nhận vị trí
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};