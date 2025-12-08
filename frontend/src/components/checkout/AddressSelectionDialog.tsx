'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { CreateAddressModal } from '@/components/address/create-address-modal';
import { getAllAddress } from '@/services/addressservices';

// Mock Data
export const MOCK_ADDRESSES = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', address: '123 Đường Lê Lợi, Q1', isDefault: true },
  { id: 2, name: 'Văn phòng', phone: '0987654321', address: 'Bitexco, Q1', isDefault: false }
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (addr: typeof MOCK_ADDRESSES[0]) => void;
  onAddNew?: () => void;
}

export const AddressSelectionDialog = ({ open, onOpenChange, onSelect, onAddNew }: Props) => {

  const handleOpenCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenChange(false);
    if (onAddNew) {
      onAddNew();
    }
  };

  const { addresses } = getAllAddress()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Địa chỉ của tôi</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2 pr-4">
          <div className="space-y-3">
            {MOCK_ADDRESSES?.map((addr) => (
              <div
                key={addr.id}
                onClick={() => onSelect(addr)}
                className="p-4 border rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    {addr.name}
                    <span className="text-gray-300 font-light">|</span>
                    {addr.phone}
                    {addr.isDefault && (
                      <Badge variant="secondary" className="text-[10px] ml-1">
                        Mặc định
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                </div>
                <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-red-500 group-hover:bg-red-500 mt-1" />
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 border-dashed border-2"
          onClick={handleOpenCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </DialogContent>
    </Dialog>
  );
};