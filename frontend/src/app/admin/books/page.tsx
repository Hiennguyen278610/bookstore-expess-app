"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { books as fakeBooks, authors as fakeAuthors, categories as fakeCategories, publishers as fakePublishers } from "../fakedata";
import type { Book } from "@/types/book.type";
import type { Author } from "@/types/author.type";
import type { Category } from "@/types/category.type";
import type { Publisher } from "@/types/publisher.type";


export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(fakeBooks);
  const [authors] = useState<Author[]>(fakeAuthors);
  const [categories] = useState<Category[]>(fakeCategories);
  const [publishers] = useState<Publisher[]>(fakePublishers);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, "id"> & { author_ids: string[] }>({
    name: "",
    category_id: "",
    author_ids: [],
    publisher_id: "",
    imageUrl: "",
    quantity: 0,
    price: 0
  });

  // Lọc danh sách sách
  const filteredBooks = books.filter(book => {
    const matchSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || book.category_id === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Helpers
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "N/A";
  const getPublisherName = (id: string) => publishers.find(p => p.id === id)?.name || "N/A";
  const getAuthorNames = (ids: string[]) =>
    ids.map(id => authors.find(a => a.id === id)?.name).filter(Boolean).join(", ");
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // CRUD
  const handleSubmit = () => {
    if (!formData.name || !formData.category_id || !formData.publisher_id || formData.author_ids.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingBook) {
      setBooks(prev =>
        prev.map(b => (b.id === editingBook.id ? { ...editingBook, ...formData } : b))
      );
    } else {
      const newBook: Book & { author_ids: string[] } = {
        ...formData,
        id: `b${Date.now()}`,
        imageUrl: formData.imageUrl || `https://placehold.co/200x300?text=${encodeURIComponent(formData.name)}`
      };
      setBooks(prev => [...prev, newBook]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const openModal = (book: (Book & { author_ids?: string[] }) | null = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        name: book.name,
        category_id: book.category_id,
        author_ids: (book as any).author_ids || [],
        publisher_id: book.publisher_id,
        imageUrl: book.imageUrl,
        quantity: book.quantity,
        price: book.price
      });
    } else {
      setEditingBook(null);
      setFormData({
        name: "",
        category_id: categories[0]?.id || "",
        author_ids: [],
        publisher_id: publishers[0]?.id || "",
        imageUrl: "",
        quantity: 0,
        price: 0
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      name: "",
      category_id: "",
      author_ids: [],
      publisher_id: "",
      imageUrl: "",
      quantity: 0,
      price: 0
    });
    setShowModal(false);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                placeholder="Nhập tên sách cần tìm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 bg-white px-4 py-2.5 pl-10 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả thể loại</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

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
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Không tìm thấy sách nào 📚
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map(book => (
                    <tr key={book.id} className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-3">
                        <img
                          src={book.imageUrl}
                          alt={book.name}
                          className="w-12 h-16 object-cover rounded border border-gray-200"
                        />
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium">{book.name}</td>
                      <td className="px-4 py-4 text-gray-600">{getCategoryName(book.category_id)}</td>
                      <td className="px-4 py-4 text-gray-600">{getAuthorNames((book as any).author_ids || [])}</td>
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
                            onClick={() => openModal(book as any)}
                            className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
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
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                <label className="block text-gray-700 mb-2 font-medium text-sm">URL hình ảnh</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
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
    </div>
  );
}