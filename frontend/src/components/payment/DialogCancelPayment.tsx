"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DialogCancelPayment = ({ open, onOpenChange, onConfirm }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dừng thanh toán?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Vui chọn chọn lựa chọn của bạn
        </DialogDescription>

        <p className="text-sm text-gray-600">
          Bạn có chắc chắn muốn dừng thanh toán?
          Bạn có thể thanh toán lại sau trong phần Đơn hàng.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Dừng thanh toán
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
