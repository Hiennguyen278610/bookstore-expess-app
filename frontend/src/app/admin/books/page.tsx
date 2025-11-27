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
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#B18F7C] px-5 py-3 rounded-t-md">
        <h2 className="text-white text-lg font-semibold">Tất cả sách</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D1B892] text-[#6B4E2E] font-semibold px-4 py-2 rounded-xl hover:bg-[#E6D6B8] transition"
        >
          <Plus className="w-4 h-4" /> Thêm sách
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 bg-[#F9F6EC] rounded-b-md shadow-inner">
        <div className="flex gap-4 mb-4">
          <div className="relative w-1/2">
            <input
              placeholder="Nhập tên sách cần tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#D1B892] bg-white px-3 py-2 pl-10 rounded-md w-full text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
            />
            <Search className="w-5 h-5 text-[#B18F7C] absolute left-3 top-2.5" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-[#D1B892] bg-white px-3 py-2 rounded-md w-1/2 text-[#6B4E2E] focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
          >
            <option value="all">Tất cả thể loại</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-md shadow-sm border border-[#E6D6B8] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#D1B892]">
              <tr>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Tên sách</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Thể loại</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">Tác giả</th>
                <th className="px-4 py-3 text-left text-[#6B4E2E] font-semibold">NXB</th>
                <th className="px-4 py-3 text-right text-[#6B4E2E] font-semibold">Số lượng</th>
                <th className="px-4 py-3 text-right text-[#6B4E2E] font-semibold">Giá</th>
                <th className="px-4 py-3 text-center text-[#6B4E2E] font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6B4E2E] italic">
                    Không tìm thấy sách nào 📚
                  </td>
                </tr>
              ) : (
                filteredBooks.map(book => (
                  <tr key={book.id} className="border-t border-[#E6D6B8] hover:bg-[#F9F6EC] transition">
                    <td className="px-4 py-3">
                      <img
                        src={book.imageUrl}
                        alt={book.name}
                        className="w-12 h-16 object-cover rounded border border-[#D1B892]"
                      />
                    </td>
                    <td className="px-4 py-3 text-[#6B4E2E] font-medium">{book.name}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{getCategoryName(book.category_id)}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{getAuthorNames((book as any).author_ids || [])}</td>
                    <td className="px-4 py-3 text-[#6B4E2E]">{getPublisherName(book.publisher_id)}</td>
                    <td className="px-4 py-3 text-right text-[#6B4E2E]">
                      <span className={`px-2 py-1 rounded ${
                        book.quantity > 10 ? "bg-green-100 text-green-700" :
                        book.quantity > 5 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {book.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#6B4E2E] font-semibold">{formatPrice(book.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(book as any)}
                          className="p-2 bg-[#D1B892] text-[#6B4E2E] rounded-lg hover:bg-[#C0A57A] transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-[#6B4E2E] mb-4">
              {editingBook ? "Sửa thông tin sách" : "Thêm sách mới"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[#6B4E2E] mb-1 font-medium">Tên sách *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                  placeholder="Nhập tên sách"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Thể loại *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                >
                  <option value="">Chọn thể loại</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Nhà xuất bản *</label>
                <select
                  value={formData.publisher_id}
                  onChange={(e) => setFormData({ ...formData, publisher_id: e.target.value })}
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                >
                  <option value="">Chọn NXB</option>
                  {publishers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Authors */}
              <div className="col-span-2">
                <label className="block text-[#6B4E2E] mb-1 font-medium">Tác giả *</label>
                <div className="border border-[#D1B892] rounded-md p-3 bg-gray-50 max-h-32 overflow-y-auto">
                  {authors.map(a => (
                    <label key={a.id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.author_ids.includes(a.id)}
                        onChange={() => toggleAuthor(a.id)}
                        className="w-4 h-4 text-[#B18F7C]"
                      />
                      <span className="text-[#6B4E2E]">{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity & Price */}
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Số lượng *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                />
              </div>
              <div>
                <label className="block text-[#6B4E2E] mb-1 font-medium">Giá (VNĐ) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                />
              </div>

              {/* Image */}
              <div className="col-span-2">
                <label className="block text-[#6B4E2E] mb-1 font-medium">URL hình ảnh</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-[#D1B892] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0A57A]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#B18F7C] text-white px-4 py-2 rounded-lg hover:bg-[#8B6F5C] transition font-semibold"
              >
                {editingBook ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
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
