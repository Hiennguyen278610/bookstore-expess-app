"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Upload, Eye, X } from "lucide-react";
import { books as fakeBooks, authors as fakeAuthors, categories as fakeCategories, publishers as fakePublishers } from "../fakedata";
import Pagination from "../components/Pagination";
import type { Book } from "@/types/book.type";
import type { Author } from "@/types/author.type";
import type { Category } from "@/types/category.type";
import type { Publisher } from "@/types/publisher.type";

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

// Interface mở rộng cho Book với nhiều ảnh
interface BookWithImages extends Book {
  imageUrls: string[]; // Mảng các ảnh, ảnh đầu là ảnh nền
  author_ids: string[];
}

export default function BooksPage() {
  // Convert fakeBooks to have imageUrls array
  const initialBooks: BookWithImages[] = fakeBooks.map(book => ({
    ...book,
    imageUrls: [book.imageUrl], // Chuyển imageUrl thành mảng
    author_ids: (book as any).author_ids || []
  }));

  const [books, setBooks] = useState<BookWithImages[]>(initialBooks);
  const [authors] = useState<Author[]>(fakeAuthors);
  const [categories] = useState<Category[]>(fakeCategories);
  const [publishers] = useState<Publisher[]>(fakePublishers);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [publisherFilter, setPublisherFilter] = useState<string>("all");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailBook, setDetailBook] = useState<BookWithImages | null>(null);
  const [editingBook, setEditingBook] = useState<BookWithImages | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Omit<BookWithImages, "id" | "imageUrl">>({
    name: "",
    category_id: "",
    author_ids: [],
    publisher_id: "",
    imageUrls: [],
    quantity: 0,
    price: 0
  });

  // Lọc danh sách sách
  const filteredBooks = books.filter(book => {
    const matchSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || book.category_id === categoryFilter;
    const matchAuthor = authorFilter === "all" || book.author_ids?.includes(authorFilter);
    const matchPublisher = publisherFilter === "all" || book.publisher_id === publisherFilter;
    const matchPriceFrom = !priceFrom || book.price >= parseInt(priceFrom);
    const matchPriceTo = !priceTo || book.price <= parseInt(priceTo);
    return matchSearch && matchCategory && matchAuthor && matchPublisher && matchPriceFrom && matchPriceTo;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Helpers
  const getCategoryName = (id: string) => categories.find(c => c._id === id)?.name || "N/A";
  const getPublisherName = (id: string) => publishers.find(p => p.id === id)?.name || "N/A";
  const getAuthorNames = (ids: string[]) =>
    ids.map(id => authors.find(a => a.id === id)?.name).filter(Boolean).join(", ");
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // CRUD
  const handleSubmit = async () => {
    if (!formData.name || !formData.category_id || !formData.publisher_id || formData.author_ids.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Tạo slug từ tên sách
    const slug = generateSlug(formData.name);
    
    let finalImageUrls: string[] = [];
    
    // Upload ảnh mới nếu có
    if (selectedFiles.length > 0) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('bookSlug', slug);
        
        selectedFiles.forEach(file => {
          uploadFormData.append('files', file);
        });
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });
        
        if (response.ok) {
          const result = await response.json();
          finalImageUrls = result.paths;
          console.log('Upload thành công:', result.paths);
        } else {
          const error = await response.json();
          alert('Lỗi upload ảnh: ' + error.error);
          return;
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Lỗi khi upload ảnh!');
        return;
      }
    } else {
      // Giữ lại các ảnh cũ (không phải base64)
      finalImageUrls = imagePreviews.filter(url => !url.startsWith('data:'));
    }
    
    // Nếu vẫn không có ảnh, tạo placeholder
    if (finalImageUrls.length === 0) {
      finalImageUrls.push(`/images/books/${slug}.jpg`);
    }

    if (editingBook) {
      setBooks(prev =>
        prev.map(b => (b.id === editingBook.id ? { 
          ...editingBook, 
          ...formData,
          imageUrls: finalImageUrls,
          imageUrl: finalImageUrls[0] // Ảnh nền là ảnh đầu tiên
        } : b))
      );
    } else {
      const newBook: BookWithImages = {
        ...formData,
        id: `b${Date.now()}`,
        imageUrls: finalImageUrls,
        imageUrl: finalImageUrls[0]
      };
      setBooks(prev => [...prev, newBook]);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      const bookToDelete = books.find(b => b.id === id);
      if (bookToDelete) {
        // Xóa các file ảnh trên server
        for (const imageUrl of bookToDelete.imageUrls) {
          try {
            const response = await fetch(`/api/upload?path=${encodeURIComponent(imageUrl)}`, {
              method: 'DELETE'
            });
            if (response.ok) {
              console.log(`Đã xóa ảnh: ${imageUrl}`);
            }
          } catch (error) {
            console.error(`Lỗi xóa ảnh ${imageUrl}:`, error);
          }
        }
      }
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const openModal = (book: BookWithImages | null = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        name: book.name,
        category_id: book.category_id,
        author_ids: book.author_ids || [],
        publisher_id: book.publisher_id,
        imageUrls: book.imageUrls || [book.imageUrl],
        quantity: book.quantity,
        price: book.price
      });
      setImagePreviews(book.imageUrls || [book.imageUrl]);
      setSelectedFiles([]);
    } else {
      setEditingBook(null);
      setFormData({
        name: "",
        category_id: categories[0]?._id || "",
        author_ids: [],
        publisher_id: publishers[0]?.id || "",
        imageUrls: [],
        quantity: 0,
        price: 0
      });
      setImagePreviews([]);
      setSelectedFiles([]);
    }
    setShowModal(true);
  };

  const openDetailModal = (book: BookWithImages) => {
    setDetailBook(book);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      name: "",
      category_id: "",
      author_ids: [],
      publisher_id: "",
      imageUrls: [],
      quantity: 0,
      price: 0
    });
    setImagePreviews([]);
    setSelectedFiles([]);
    setShowModal(false);
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
      author_ids: prev.author_ids.includes(authorId)
        ? prev.author_ids.filter(id => id !== authorId)
        : [...prev.author_ids, authorId]
    }));
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả thể loại</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            {/* Author Filter */}
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả tác giả</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {/* Publisher Filter */}
            <select
              value={publisherFilter}
              onChange={(e) => setPublisherFilter(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả NXB</option>
              {publishers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

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
                {paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Không tìm thấy sách nào 📚
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map(book => (
                    <tr key={book.id} className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-3">
                        <Image
                          src={book.imageUrls?.[0] || book.imageUrl}
                          alt={book.name}
                          width={48}
                          height={64}
                          className="w-12 h-16 object-cover rounded border border-gray-200"
                          unoptimized
                        />
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium">{book.name}</td>
                      <td className="px-4 py-4 text-gray-600">{getCategoryName(book.category_id)}</td>
                      <td className="px-4 py-4 text-gray-600">{getAuthorNames(book.author_ids || [])}</td>
                      <td className="px-4 py-4 text-gray-600">{getPublisherName(book.publisher_id)}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          book.quantity > 10 
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
                            onClick={() => handleDelete(book.id)}
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
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBooks.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b-2 border-emerald-600">
              {editingBook ? "Sửa thông tin sách" : "Thêm sách mới"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2 font-medium text-sm">Tên sách *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Nhập tên sách"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Thể loại *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Chọn thể loại</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Nhà xuất bản *</label>
                <select
                  value={formData.publisher_id}
                  onChange={(e) => setFormData({ ...formData, publisher_id: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Chọn NXB</option>
                  {publishers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Authors */}
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2 font-medium text-sm">Tác giả *</label>
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-32 overflow-y-auto">
                  {authors.map(a => (
                    <label key={a.id} className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.author_ids.includes(a.id)}
                        onChange={() => toggleAuthor(a.id)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-gray-700 text-sm">{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity & Price */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Số lượng *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm">Giá (VNĐ) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Image */}
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2 font-medium text-sm">Hình ảnh (ảnh đầu tiên là ảnh nền)</label>
                
                {/* Image Previews Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className={`relative group ${index === 0 ? 'ring-2 ring-emerald-500' : ''}`}>
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={96}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        unoptimized
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">
                          Ảnh nền
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsCover(index)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs"
                            title="Đặt làm ảnh nền"
                          >
                            ★
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          title="Xóa ảnh"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add More Images Button */}
                  <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-gray-500 text-xs text-center">Thêm ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-xs text-gray-500">
                  * Ảnh sẽ được lưu tại <code className="bg-gray-100 px-1 rounded">/images/books/{generateSlug(formData.name || 'ten_sach')}.ext</code>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {editingBook ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && detailBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <Image
                  src={detailBook.imageUrls?.[0] || detailBook.imageUrl}
                  alt={detailBook.name}
                  width={300}
                  height={400}
                  className="w-full h-80 object-cover rounded-lg border border-gray-200 shadow-md"
                  unoptimized
                />
              </div>
              
              {/* Thông tin sách */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <h4 className="text-2xl font-bold text-gray-800">{detailBook.name}</h4>
                
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Thể loại:</span> <span className="font-medium text-gray-800">{getCategoryName(detailBook.category_id)}</span></p>
                  <p><span className="text-gray-500">Tác giả:</span> <span className="font-medium text-gray-800">{getAuthorNames(detailBook.author_ids || [])}</span></p>
                  <p><span className="text-gray-500">NXB:</span> <span className="font-medium text-gray-800">{getPublisherName(detailBook.publisher_id)}</span></p>
                  <p><span className="text-gray-500">Số lượng:</span> <span className="font-medium text-gray-800">{detailBook.quantity}</span></p>
                  <p><span className="text-gray-500">Giá:</span> <span className="font-bold text-emerald-600 text-lg">{formatPrice(detailBook.price)}</span></p>
                </div>
              </div>
              
              {/* Tất cả ảnh */}
              {detailBook.imageUrls && detailBook.imageUrls.length > 1 && (
                <div className="col-span-2">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Tất cả hình ảnh ({detailBook.imageUrls.length})</h5>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {detailBook.imageUrls.map((url, index) => (
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