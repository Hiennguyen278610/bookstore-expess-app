import { bookServices } from "@/services/bookServices";
import React from "react";
import {
  Truck,
  Shield,
  Leaf,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import ImageSlider from "../components/ImageSlider";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const book = await bookServices.getBookById(id);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Cột trái - Thông tin sách và hình ảnh */}
        <div className="space-y-8">
          {/* Thông tin sách ở TRÊN hình ảnh */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            {/* Tên sách */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book?.name || "Sách"}
            </h1>

            {/* NXB và Tác giả */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-gray-600">
              <span>
                Nhà xuất bản:{" "}
                <strong className="text-gray-800">
                  {book?.publisher?.name || "NXB Trẻ"}
                </strong>
              </span>
              <span className="hidden sm:inline text-green-400">•</span>
              <span>
                Tác giả:
                <strong className="text-gray-800 ml-1">
                  {book?.authors && book.authors.length > 0
                    ? book.authors.join(", ")
                    : "Robert Galbraith"}
                </strong>
              </span>
            </div>
          </div>

          {/* Hình ảnh sách - ở DƯỚI thông tin */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <ImageSlider images={book.imageUrl} />
          </div>

          {/* REBO đảm bảo */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Shield className="text-green-600" size={24} />
              REBO đảm bảo
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <span>Sách thật từ nhà xuất bản</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <span>Không rách giấy, long bìa, viết bậy</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <span>Số trang highlight (không quá 10% tổng số trang)</span>
              </li>
            </ul>
          </div>

          {/* Thông tin vận chuyển và bảo vệ môi trường */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="border-t border-green-100 pt-6">
              <div className="flex items-center gap-2 mb-4 text-green-600">
                <Truck size={20} />
                <span className="font-semibold">
                  Freeship toàn quốc chỉ từ 100k
                </span>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle
                    className="text-green-500 flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <span>Được kiểm tra thanh toán khi nhận hàng</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center gap-2">
                    <Leaf className="text-green-500" size={18} />
                    Với mỗi cuốn sách bán ra, REBO sẽ trích 1000 VND để ủng hộ
                    các tổ chức bảo vệ môi trường
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cột phải - Mua hàng và thông tin liên hệ */}
        <div className="space-y-6">
          {/* Nút mua hàng */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 sticky top-25">
            <div className="space-y-4">
              {/* Giá hiển thị lại */}
              <div className="pb-4 border-b border-green-100">
                <p className="text-sm text-gray-500 mb-1">Giá bán</p>
                <p className="text-3xl font-bold text-green-700">
                  {book?.price?.toLocaleString() || "103.000"}đ
                </p>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                MUA NGAY
              </button>

              <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-4 px-6 rounded-xl text-lg transition duration-300 flex items-center justify-center gap-2">
                <ShoppingCart size={22} />
                THÊM VÀO GIỎ
              </button>

              {/* Chia sẻ */}
              <div className="border-t border-green-100 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-gray-700 font-medium">Chia sẻ</span>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hotline */}
              <div className="border-t border-green-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gọi đặt mua</p>
                    <p className="text-xl font-bold text-gray-900">
                      0972 430 690
                    </p>
                    <p className="text-sm text-gray-500">(7:30 - 22:00)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
