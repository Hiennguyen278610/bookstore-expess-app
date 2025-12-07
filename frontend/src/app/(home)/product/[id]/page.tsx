import { bookServices } from "@/services/bookServices";
import React from "react";
import {
  Truck,
  Shield,
  Leaf,
  Share2,
  MessageCircle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import ImageSlider from "../components/ImageSlider";
import PurchaseCard from "../components/PurchaseCard";

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

        <PurchaseCard book={book} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
