"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address.type";
import { Edit2, Trash2 } from "lucide-react";

interface AddressCardProps {
  data: Address;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressCard = ({ data, onEdit, onDelete }: AddressCardProps) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4 hover:border-primary/50 transition-colors group">
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-gray-900 text-base">
            {data.name}
          </span>
          {data.isDefault && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
              Mặc định
            </Badge>
          )}
          <Badge variant="outline" className="text-gray-500 font-normal">
            {data.addressType}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm font-mono">{data.phone}</p>
        <p className="text-gray-700 text-sm font-medium leading-relaxed">
          {data.detail}, {data.district}, {data.province}
        </p>
      </div>

      <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          onClick={onEdit}
        >
          <Edit2 size={16} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};