"use client";

import React, { useState } from "react";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage } from "@/components/ui/form";
import { MapPin, Plus } from "lucide-react";
import { AddressSelectionDialog, MOCK_ADDRESSES } from "./AddressSelectionDialog";

interface Props {
  control: Control<any>; // Truyền control từ useForm vào
  isEditable: boolean;
  setValue: (name: any, value: any) => void; // Hàm setValue từ useForm
  watch: (name: any) => any; // Hàm watch để hiển thị realtime
}

export const AddressCard = ({ control, isEditable, setValue, watch }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);


  const handleSelectAddress = (addr: typeof MOCK_ADDRESSES[0]) => {
    setValue("shippingAddress", addr.address);
    setValue("customerName", addr.name);
    setValue("customerPhone", addr.phone);
    setOpenDialog(false);
  };

  return (
    <>
      <Card className="border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" /> Địa chỉ nhận hàng
          </CardTitle>

          {isEditable && (
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpenDialog(true)} className="text-blue-600 h-8 font-medium">
                Thay đổi
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <FormField
            control={control}
            name="shippingAddress"
            render={({ field }) => (
              <div className="pl-0">
                {field.value ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {watch("customerName")}
                      <span className="text-sm font-normal text-gray-500">{watch("customerPhone")}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{field.value}</p>
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed rounded-lg bg-gray-50 text-gray-400">
                    Chưa có địa chỉ nhận hàng
                  </div>
                )}
                <FormMessage className="mt-2" />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <AddressSelectionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSelect={handleSelectAddress}
      />
    </>
  );
};