"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Map4DAutoSuggest from "@/components/map-picker";

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AddressComponent[]) => void;
}

export interface AddressComponent {
  types: string[];
  name: string;
}

export const MapPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
}: MapPickerModalProps) => {
  const [addresstName, setAddressName] = useState<AddressComponent[]>([]);

  const handleConfirm = () => {
    if (addresstName) {
      onConfirm(addresstName);
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
          <Map4DAutoSuggest setAddressName={setAddressName} />
        </div>

        <div className="p-4 bg-white border-t z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-bold uppercase">
                Vị trí đã chọn:
              </p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {addresstName
                  ? addresstName.map((a) => a.name).join(", ")
                  : "Vui lòng kéo bản đồ..."}
              </p>
            </div>
            <Button
              onClick={handleConfirm}
              disabled={!addresstName}
              className="w-full md:w-auto"
            >
              Xác nhận vị trí
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
