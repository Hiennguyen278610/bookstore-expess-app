"use client";

import React, { useState } from "react";
import { FilterTabs } from "./components/FilterTabs";
import { OrderTable } from "./components/OrderTable";
import useSWR from "swr";
import { orderServices } from "@/services/orderServices";
import { OrderPagination } from "./components/OrderPagination";
import { Order } from "@/types/order.type";
import OrderDetailDialog from "./components/OrderDetailDialog";

const page = () => {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    customerName: "",
    receiverName: "",
    customerPhone: "",
    page: 1,
    limit: 10,
  });

  const [selectedOrderId, setselectedOrderId] = useState<string>("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: result, isLoading } = useSWR(["/get-orders", filters], () =>
    orderServices.getAllOrders(
      filters.page,
      filters.limit,
      filters.status,
      filters.startDate,
      filters.endDate,
      filters.customerName,
      filters.receiverName,
      filters.customerPhone
    )
  );

  const pagination = result?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? "" : status,
      page: 1,
    }));
  };

  const handleDateFilterChange = (startDate: string, endDate: string) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      customerName: "",
      receiverName: "",
      customerPhone: "",
      page: 1,
      limit: 10,
    });
  };

  const handleCustomerNameChange = (customerName: string) => {
    setFilters((prev) => ({
      ...prev,
      customerName,
      page: 1,
    }));
  };

  const handleReceiverNameChange = (receiverName: string) => {
    setFilters((prev) => ({
      ...prev,
      receiverName,
      page: 1,
    }));
  };

  const handleCustomerPhoneChange = (customerPhone: string) => {
    setFilters((prev) => ({
      ...prev,
      customerPhone,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page }));
  };

  const handleViewOrder = (order: Order) => {
    setselectedOrderId(order._id);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <h2 className="text-gray-800 text-2xl font-bold">Quản lý đơn hàng</h2>
        <p className="text-gray-600 text-sm mt-1">
          Quản lý thông tin đơn hàng trong cửa hàng
        </p>
      </div>

      <FilterTabs
        status={filters.status}
        startDate={filters.startDate}
        endDate={filters.endDate}
        customerName={filters.customerName}
        receiverName={filters.receiverName}
        customerPhone={filters.customerPhone}
        onStatusChange={handleStatusFilterChange}
        onDateChange={handleDateFilterChange}
        onCustomerNameChange={handleCustomerNameChange}
        onReceiverNameChange={handleReceiverNameChange}
        onCustomerPhoneChange={handleCustomerPhoneChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600">
            {" "}
          </div>
        </div>
      ) : (
        <>
          <OrderTable
            orders={result?.data ?? []}
            onViewOrder={handleViewOrder}
          />
          <OrderPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNext}
            hasPrevPage={pagination.hasPrev}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <OrderDetailDialog
        orderId={selectedOrderId}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
};

export default page;
