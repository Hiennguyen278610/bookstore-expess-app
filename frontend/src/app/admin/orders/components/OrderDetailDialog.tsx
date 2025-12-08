"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { orderServices } from "@/services/orderServices";
import { Order } from "@/types/order.type";
import React from "react";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) => {
  if (!order) return;

  const orderWithDetails = orderServices.getOrderById(order._id);
  console.log(orderWithDetails);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>Chi tiết đơn hàng #{order?._id}</span>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
