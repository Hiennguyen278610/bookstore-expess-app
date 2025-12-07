"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AddressCard } from "@/components/address/address-card";
import { CreateAddressModal } from "@/components/address/create-address-modal";
import { Address } from '@/types/address.type';
import { getAllAddress, deleteAddress } from '@/services/addressservices';
import { toast } from 'sonner';

export default function AddressTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { addresses, isLoading, mutate } = getAllAddress();

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        await deleteAddress(id);
        await mutate();
        toast.success("Xóa địa chỉ thành công");
      } catch (error) {
        toast.error("Xóa địa chỉ thất bại");
      }
    }
  };

  const handleSuccess = async () => {
    setIsModalOpen(false);
    await mutate();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Card className="border-none shadow-none bg-transparent lg:bg-white lg:border lg:shadow-sm lg:rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-0 mb-4 lg:mb-0 lg:p-6 lg:border-b border-gray-100">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Sổ địa chỉ</CardTitle>
            <CardDescription className="mt-1">Quản lý danh sách địa chỉ nhận hàng của bạn</CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="shadow-md hover:shadow-lg transition-shadow">
            <Plus className="mr-2 h-4 w-4" /> Thêm địa chỉ mới
          </Button>
        </div>

        <CardContent className="p-0 lg:p-6">
          <div className="grid gap-4">
            {isLoading ? <p>Đang tải...</p> : addresses?.map((addr: Address) => (
              <AddressCard
                key={addr._id}
                data={addr}
                onEdit={() => handleEdit(addr)}
                onDelete={() => handleDelete(addr._id!)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <CreateAddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingAddress}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}