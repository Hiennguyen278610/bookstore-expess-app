'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { getAllAddress } from '@/services/addressservices';
import { Address } from '@/types/address.type';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (addr: Address) => void;
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

  const { addresses, isLoading } = getAllAddress();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Địa chỉ của tôi</DialogTitle>
          <DialogDescription>
            Đây là những địa chỉ hiện có của bạn
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-2 pr-4">
          <div className="space-y-3">
            {!isLoading && addresses?.map((addr : Address) => (
              <div
                key={addr._id}
                onClick={() => onSelect(addr)}
                className="p-4 border rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    {addr.name}
                    <span className="text-gray-300 font-light">|</span>
                    {addr.phone}
                    {addr.isDefault && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                        Mặc định
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{addr.detail + ", " + addr.district + ", " + addr.province}</p>
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