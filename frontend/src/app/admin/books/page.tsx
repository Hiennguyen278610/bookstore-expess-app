"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Upload, Eye, X } from "lucide-react";
import Pagination from "../components/Pagination";
import SearchableSelect from "@/components/SearchableSelect";
import type { Book, BooksResponse } from "@/types/book.type";
import type { Author } from "@/types/author.type";
import type { Category } from "@/types/category.type";
import type { Publisher } from "@/types/publisher.type";
import axios from "axios";
import { baseUrl } from "@/constants/index";
import { createBook, updateBook, deleteBook } from "@/api/bookApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import api from '@/lib/axios';

// Hàm tạo slug từ tên sách
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .trim();
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  });
  const [currentPageClient, setCurrentPageClient] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [publisherFilter, setPublisherFilter] = useState<string>("all");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    authorIds: [] as string[],
    publisherId: "",
    imageUrl: [] as string[],
    quantity: 0,
    price: 0
  });

  // Fetch data from API
  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchCategories();
    fetchPublishers();
  }, [pagination.currentPage, pagination.limit]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get<BooksResponse>(`${baseUrl}/books`, {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
        }
      });
      setBooks(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await api.get(`${baseUrl}/authors`);
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get(`${baseUrl}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/publishers`);
      setPublishers(response.data);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  // Lọc danh sách sách (client-side filtering)
  const filteredBooks = books.filter(book => {
    const matchSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || book.categoryId._id === categoryFilter;
    const matchAuthor = authorFilter === "all" || book.authors?.some(a => a._id === authorFilter);
    const matchPublisher = publisherFilter === "all" || book.publisherId._id === publisherFilter;
    const matchPriceFrom = !priceFrom || book.price >= parseInt(priceFrom);
    const matchPriceTo = !priceTo || book.price <= parseInt(priceTo);
    return matchSearch && matchCategory && matchAuthor && matchPublisher && matchPriceFrom && matchPriceTo;
  });

  // Client-side pagination
  const totalPagesClient = Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage));
  const paginatedBooks = filteredBooks.slice(
    (currentPageClient - 1) * itemsPerPage,
    currentPageClient * itemsPerPage
  );

  // Helpers
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'N/A';
  };

  const getAuthorNames = (authorIds: string[]) => {
    const authorNames = authorIds.map(id => {
      const author = authors.find(a => a._id === id);
      return author?.name || '';
    }).filter(name => name);
    return authorNames.length > 0 ? authorNames.join(', ') : 'N/A';
  };

  const getPublisherName = (publisherId: string) => {
    const publisher = publishers.find(p => p._id === publisherId);
    return publisher?.name || 'N/A';
  };

  // CRUD
  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission

    if (!formData.name || !formData.categoryId || !formData.publisherId || formData.authorIds.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng điền đầy đủ thông tin!',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('publisherId', formData.publisherId);
      // Backend expects authors as JSON string with authorId property
      const authorsData = formData.authorIds.map(id => ({ authorId: id }));
      submitData.append('authors', JSON.stringify(authorsData));
      submitData.append('quantity', formData.quantity.toString());
      submitData.append('price', formData.price.toString());

      // Only add images if user selected new files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => submitData.append('images', file));
      } else if (editingBook) {
        // Keep existing images when updating without new images
        formData.imageUrl.forEach(url => submitData.append('existingImages[]', url));
      }

      if (editingBook) {
        const response = await updateBook(editingBook._id, submitData);
        console.log('Update response:', response);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật sách thành công!',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        if (selectedFiles.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng chọn ít nhất 1 ảnh cho sách mới!',
          });
          return;
        }
        await createBook(submitData);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm sách thành công!',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      fetchBooks();
      resetForm();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error saving book:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.response?.data?.message || 'Không thể lưu sách',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa sách',
      html: `Bạn có chắc muốn xóa "<strong>${name}</strong>"?<br/><small class="text-red-500">⚠️ Hành động này không thể hoàn tác!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteBook(id);
        toast.success('Xóa sách thành công!', {
          position: 'bottom-right',
          duration: 3000,
          style: {
            fontSize: '15px',
            padding: '16px',
          },
        });
        fetchBooks();
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Error deleting book:", err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err.response?.data?.message || 'Không thể xóa sách',
        });
      }
    }
  };

  const openModal = (book: Book | null = null) => {
    if (book) {
      setEditingBook(book);
      console.log('Opening edit modal with book:', book);
      console.log('Book authors:', book.authors);
      const authorIds = Array.isArray(book.authors) && book.authors
        ? book.authors.map((a: Author) => a._id).filter(Boolean)
        : [];
      console.log('Extracted authorIds:', authorIds);
      setFormData({
        name: book.name,
        categoryId: book.categoryId?._id || '',
        authorIds: authorIds,
        publisherId: book.publisherId?._id || '',
        imageUrl: book.imageUrl,
        quantity: book.quantity,
        price: book.price
      });
      setImagePreviews(book.imageUrl);
      setSelectedFiles([]);
    } else {
      setEditingBook(null);
      setFormData({
        name: "",
        categoryId: categories[0]?._id || "",
        authorIds: [],
        publisherId: publishers[0]?._id || "",
        imageUrl: [],
        quantity: 0,
        price: 0
      });
      setImagePreviews([]);
      setSelectedFiles([]);
    }
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);

      // Tạo preview cho các file mới
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreviews(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    // Di chuyển ảnh được chọn lên đầu tiên làm ảnh nền
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      const [selected] = newPreviews.splice(index, 1);
      newPreviews.unshift(selected);
      return newPreviews;
    });
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles.length > index) {
        const [selected] = newFiles.splice(index, 1);
        newFiles.unshift(selected);
      }
      return newFiles;
    });
  };

  const toggleAuthor = (authorId: string) => {
    setFormData(prev => ({
      ...prev,
      authorIds: prev.authorIds.includes(authorId)
        ? prev.authorIds.filter(id => id !== authorId)
        : [...prev.authorIds, authorId]
    }));
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      name: "",
      categoryId: "",
      authorIds: [],
      publisherId: "",
      imageUrl: [],
      quantity: 0,
      price: 0
    });
    setImagePreviews([]);
    setSelectedFiles([]);
    setShowModal(false);
  };

  const openDetailModal = (book: Book) => {
    setDetailBook(book);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-l-4 border-teal-600 px-6 py-5 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 text-2xl font-bold">Quản lý sách</h2>
            <p className="text-gray-600 text-sm mt-1">Quản lý thông tin sách trong cửa hàng</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> Thêm sách
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <input
                placeholder="Nhập tên sách cần tìm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 bg-white px-4 py-2.5 pl-10 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter */}
            <SearchableSelect
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value || "all")}
              options={[
                { _id: "all", name: "Tất cả thể loại" },
                ...categories
              ]}
              placeholder="Chọn thể loại"
            />

            {/* Author Filter */}
            <SearchableSelect
              value={authorFilter}
              onChange={(value) => setAuthorFilter(value || "all")}
              options={[
                { _id: "all", name: "Tất cả tác giả" },
                ...authors
              ]}
              placeholder="Chọn tác giả"
            />

            {/* Publisher Filter */}
            <SearchableSelect
              value={publisherFilter}
              onChange={(value) => setPublisherFilter(value || "all")}
              options={[
                { _id: "all", name: "Tất cả NXB" },
                ...publishers
              ]}
              placeholder="Chọn NXB"
            />

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Giá từ"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="border border-gray-300 bg-white px-3 py-2.5 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="border border-gray-300 bg-white px-3 py-2.5 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {(categoryFilter !== "all" || authorFilter !== "all" || publisherFilter !== "all" || priceFrom || priceTo || searchTerm) && (
            <div className="mb-4">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setAuthorFilter("all");
                  setPublisherFilter("all");
                  setPriceFrom("");
                  setPriceTo("");
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ✕ Xóa bộ lọc
              </button>
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Hình ảnh</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Tên sách</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Thể loại</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Tác giả</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">NXB</th>
                  <th className="px-4 py-3 text-right text-gray-700 font-semibold text-sm">Số lượng</th>
                  <th className="px-4 py-3 text-right text-gray-700 font-semibold text-sm">Giá</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Không tìm thấy sách nào 📖
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map(book => (
                    <tr key={book._id} className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-3">
                        {book.mainImage || book.imageUrl?.[0] ? (
                          <Image
                            src={book.mainImage || book.imageUrl[0]}
                            alt={book.name}
                            width={48}
                            height={64}
                            className="w-12 h-16 object-cover rounded border border-gray-200"
                            unoptimized
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium">{book.name}</td>
                      <td className="px-4 py-4 text-gray-600">{book.categoryId?.name || 'N/A'}</td>
                      <td className="px-4 py-4 text-gray-600">{book.authors?.filter(a => a && a.name).map(a => a.name).join(", ") || 'N/A'}</td>
                      <td className="px-4 py-4 text-gray-600">{book.publisherId?.name || 'N/A'}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${book.quantity > 10
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : book.quantity > 5
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                          {book.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-800 font-semibold">{formatPrice(book.price)}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openDetailModal(book)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal(book)}
                            className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id, book.name)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPageClient}
            totalPages={totalPagesClient}
            totalItems={filteredBooks.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPageClient}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPageClient(1);
            }}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all animate-slideUp border border-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-emerald-600">
              {editingBook ? "Sửa thông tin sách" : "Thêm sách mới"}
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1.5 font-medium text-sm">Tên sách *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    placeholder="Nhập tên sách"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category */}
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium text-sm">Thể loại *</label>
                    <SearchableSelect
                      value={formData.categoryId}
                      onChange={(value) => setFormData({ ...formData, categoryId: value })}
                      options={categories}
                      placeholder="Chọn thể loại"
                    />
                  </div>

                  {/* Publisher */}
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium text-sm">Nhà xuất bản *</label>
                    <SearchableSelect
                      value={formData.publisherId}
                      onChange={(value) => setFormData({ ...formData, publisherId: value })}
                      options={publishers}
                      placeholder="Chọn NXB"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Quantity */}
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium text-sm">Số lượng *</label>
                    <input
                      type="number"
                      min="0"
                      value={0}
                      readOnly
                      disabled
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed text-sm text-gray-500"
                    />
                  </div>
                  {/* Price */}
                  <div>
                    <label className="block text-gray-700 mb-1.5 font-medium text-sm">Giá (VNĐ) *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-gray-700 mb-1.5 font-medium text-sm">Tác giả *</label>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-50 max-h-28 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1">
                      {authors.map(a => (
                        <label key={a._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded text-sm">
                          <input
                            type="checkbox"
                            checked={formData.authorIds.includes(a._id)}
                            onChange={() => toggleAuthor(a._id)}
                            className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                          />
                          <span className="text-gray-700 text-xs">{a.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Images */}
              <div className="col-span-1">
                <label className="block text-gray-700 mb-1.5 font-medium text-sm">Hình ảnh</label>
                <div className="space-y-2">
                  {/* Image Previews Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-1">
                    {imagePreviews.filter(preview => preview).map((preview, index) => (
                      <div key={index} className={`relative group aspect-[3/4] ${index === 0 ? 'ring-2 ring-emerald-500' : ''}`}>
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={106}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                          unoptimized
                        />
                        {index === 0 && (
                          <span className="absolute top-0.5 left-0.5 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Nền
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(index)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-xs"
                              title="Đặt làm ảnh nền"
                            >
                              ★
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Xóa ảnh"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add More Images Button */}
                    <label className="w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-gray-500 text-[10px] text-center">Thêm</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-tight">
                    Ảnh đầu tiên là ảnh nền
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t mt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : (editingBook ? "Cập nhật" : "Thêm mới")}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && detailBook && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-blue-600">
              <h3 className="text-xl font-bold text-gray-800">Chi tiết sách</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Ảnh nền (ảnh chính) */}
              <div className="col-span-2 md:col-span-1">
                {(detailBook.imageUrl?.[0] || detailBook.mainImage) ? (
                  <Image
                    src={detailBook.imageUrl?.[0] || detailBook.mainImage}
                    alt={detailBook.name}
                    width={300}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg border border-gray-200 shadow-md"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              {/* Thông tin sách */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <h4 className="text-2xl font-bold text-gray-800">{detailBook.name}</h4>

                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Thể loại:</span> <span className="font-medium text-gray-800">{detailBook.categoryId && typeof detailBook.categoryId === 'object' ? detailBook.categoryId.name : detailBook.categoryId ? getCategoryName(detailBook.categoryId as string) : 'N/A'}</span></p>
                  <p><span className="text-gray-500">Tác giả:</span> <span className="font-medium text-gray-800">{Array.isArray(detailBook.authors) && detailBook.authors.length > 0 ? detailBook.authors.map(a => a?.name).filter(Boolean).join(', ') || 'N/A' : 'N/A'}</span></p>
                  <p><span className="text-gray-500">NXB:</span> <span className="font-medium text-gray-800">{detailBook.publisherId && typeof detailBook.publisherId === 'object' ? detailBook.publisherId.name : detailBook.publisherId ? getPublisherName(detailBook.publisherId as string) : 'N/A'}</span></p>
                  <p><span className="text-gray-500">Số lượng:</span> <span className="font-medium text-gray-800">{detailBook.quantity ?? 0}</span></p>
                  <p><span className="text-gray-500">Giá:</span> <span className="font-bold text-emerald-600 text-lg">{formatPrice(detailBook.price)}</span></p>
                </div>
              </div>

              {/* Tất cả ảnh */}
              {detailBook.imageUrl && detailBook.imageUrl.length > 1 && (
                <div className="col-span-2">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Tất cả hình ảnh ({detailBook.imageUrl.length})</h5>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {detailBook.imageUrl.filter((url: string) => url).map((url: string, index: number) => (
                      <div key={index} className={`relative ${index === 0 ? 'ring-2 ring-emerald-500' : ''}`}>
                        <Image
                          src={url}
                          alt={`${detailBook.name} - Ảnh ${index + 1}`}
                          width={100}
                          height={133}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          unoptimized
                        />
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
                            Ảnh nền
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  openModal(detailBook);
                }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Sửa thông tin
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}