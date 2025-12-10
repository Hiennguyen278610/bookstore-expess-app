import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { statusMap } from "@/constants";

interface OrderFiltersProps {
  status: string;
  startDate: string;
  endDate: string;
  customerName: string;
  receiverName: string;
  customerPhone: string;
  onStatusChange: (status: string) => void;
  onDateChange: (startDate: string, endDate: string) => void;
  onCustomerNameChange: (name: string) => void;
  onReceiverNameChange: (name: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
  onClearFilters: () => void;
}

export function FilterTabs({
  status,
  startDate,
  endDate,
  customerName,
  receiverName,
  customerPhone,
  onStatusChange,
  onDateChange,
  onCustomerNameChange,
  onReceiverNameChange,
  onCustomerPhoneChange,
  onClearFilters,
}: OrderFiltersProps) {
  const [dateError, setDateError] = useState<string>("");

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        setDateError("Ngày bắt đầu phải trước ngày kết thúc");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    onDateChange(startDate, newEndDate);
  };

  const handleClearFilters = () => {
    setDateError("");
    onClearFilters();
  };

  const hasActiveFilters = status || startDate || endDate || customerName || receiverName || customerPhone;
  const hasDateError = !!dateError;

  return (
    <div className="space-y-4 bg-white shadow-2xl rounded-xl p-4 my-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">
            Bộ lọc đơn hàng
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2 bg-red-300"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        {/* Tìm kiếm theo tên khách hàng */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Tên khách hàng
          </label>
          <Input
            type="text"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Nhập tên khách hàng..."
            className="w-[200px]"
          />
        </div>

        {/* Tìm kiếm theo tên người nhận */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Tên người nhận
          </label>
          <Input
            type="text"
            value={receiverName}
            onChange={(e) => onReceiverNameChange(e.target.value)}
            placeholder="Nhập tên người nhận..."
            className="w-[200px]"
          />
        </div>

        {/* Tìm kiếm theo số điện thoại */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <Input
            type="text"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            placeholder="Nhập số điện thoại..."
            className="w-[200px]"
          />
        </div>

        {/* Lọc trạng thái */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <Select value={status || "all"} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {[...statusMap].map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo thời gian */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Thời gian đặt hàng
          </label>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex items-center gap-2">
              <Calendar
                className={`w-4 h-4 ${
                  hasDateError ? "text-red-500" : "text-gray-500"
                }`}
              />
              <Input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className={`w-[150px] ${hasDateError ? "border-red-500" : ""}`}
                placeholder="Từ ngày"
              />
            </div>
            <span
              className={`${hasDateError ? "text-red-500" : "text-gray-400"}`}
            >
              -
            </span>
            <div className="flex items-center gap-2">
              <Calendar
                className={`w-4 h-4 ${
                  hasDateError ? "text-red-500" : "text-gray-500"
                }`}
              />
              <Input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className={`w-[150px] ${hasDateError ? "border-red-500" : ""}`}
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Hiển thị lỗi validation */}
          {hasDateError && (
            <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{dateError}</span>
            </div>
          )}
        </div>

        {/* Hiển thị bộ lọc đang active */}
        {hasActiveFilters && !hasDateError && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Đang lọc:</span>
            {customerName && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                KH: {customerName}
              </span>
            )}
            {receiverName && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                Người nhận: {receiverName}
              </span>
            )}
            {customerPhone && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                SĐT: {customerPhone}
              </span>
            )}
            {status && status !== "all" && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Trạng thái: {statusMap.get(status)}
              </span>
            )}
            {startDate && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Từ: {new Date(startDate).toLocaleDateString("vi-VN")}
              </span>
            )}
            {endDate && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Đến: {new Date(endDate).toLocaleDateString("vi-VN")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
