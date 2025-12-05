import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Heart,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="footer-div bg-gradient-to-b from-gray-50 to-green-50 text-gray-800 border-t border-green-200">
      {/* Footer content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
        {/* Column 1: Bookstore details */}
        <div className="flex justify-end items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h3 className="footer-title text-green-700 text-2xl font-bold">
                REBO STORE
              </h3>
            </div>
            <hr className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 w-32 mb-4 rounded-full" />
            <p className="text-gray-600 leading-relaxed">
              REBO Store được thành lập với sứ mệnh lan tỏa tri thức và niềm đam
              mê đọc sách đến mọi người. Chúng tôi mang đến cho bạn hàng nghìn
              tựa sách đa dạng và chất lượng với dịch vụ tốt nhất.
            </p>

            <div className="space-y-2 mt-4">
              <div className="flex items-start">
                <MapPin
                  size={18}
                  className="mr-2 text-green-600 mt-0.5 flex-shrink-0"
                />
                <p className="text-gray-700">
                  123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh
                </p>
              </div>

              <div className="flex items-center">
                <Phone
                  size={16}
                  className="mr-2 text-green-600 flex-shrink-0"
                />
                <p className="text-gray-700">0909 123 456</p>
              </div>

              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-green-600 flex-shrink-0" />
                <p className="text-gray-700">contact@rebo.vn</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook size={16} className="text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter size={16} className="text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram size={16} className="text-white" />
              </a>
            </div>

            <Image
              width={170}
              height={100}
              className="w-[170px] h-auto mt-4 rounded-lg shadow-sm"
              src="/images/dathongbao.png"
              alt="Đã thông báo Bộ Công Thương"
            />
          </div>
        </div>

        {/* Column 2: Policies */}
        <div>
          <h3 className="footer-title text-green-700 text-xl font-semibold mb-4">
            CHÍNH SÁCH
          </h3>
          <hr className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 w-24 mb-4 rounded-full" />
          <div className="space-y-2">
            {[
              "Tìm kiếm sách",
              "Giới thiệu cửa hàng",
              "Hướng dẫn đặt hàng",
              "Chính sách thanh toán",
              "Chính sách đổi - trả sách",
              "Chính sách bảo mật thông tin",
              "Chính sách vận chuyển",
              "Câu hỏi thường gặp",
            ].map((policy, index) => (
              <p
                key={index}
                className="text-gray-600 hover:text-green-600 cursor-pointer transition-colors duration-200 hover:translate-x-1 transform"
              >
                {policy}
              </p>
            ))}
          </div>
        </div>

        {/* Column 3: Fanpage */}
        <div>
          <h3 className="footer-title text-green-700 text-xl font-semibold mb-4">
            FANPAGE
          </h3>
          <hr className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 w-24 mb-4 rounded-full" />
          <a
            className="relative cursor-pointer group block"
            href="https://www.facebook.com/sword.hunting.doom"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <Image
                width={400}
                height={150}
                className="h-[150px] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                src="/images/fanpage_book.png"
                alt="Fanpage REBO Store"
              />
            </div>

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300 rounded-lg" />

            <div className="absolute text-white top-3 left-3">
              <div className="flex items-center space-x-3">
                <Image
                  width={50}
                  height={50}
                  src="/images/logo.webp"
                  className="w-[50px] h-[50px] rounded-full border-2 border-white shadow-lg"
                  alt="REBO Store Avatar"
                />
                <div>
                  <p className="text-white text-base font-semibold mb-0 group-hover:underline">
                    REBO Store
                  </p>
                  <p className="text-white/90 text-xs mt-0 flex items-center">
                    <Heart size={12} className="mr-1 fill-current" />
                    18.247 người theo dõi
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Theo dõi chúng tôi để cập nhật sách mới và ưu đãi hàng tuần!
            </p>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="footer-title text-green-700 text-xl font-semibold mb-4">
            NHẬN ƯU ĐÃI ĐẶC BIỆT
          </h3>
          <hr className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 w-24 mb-4 rounded-full" />
          <p className="text-gray-600 mb-4">
            Đăng ký nhận thông tin sách mới, khuyến mãi độc quyền và ưu đãi lên
            đến 30%!
          </p>
          <div className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 border border-green-300 rounded-lg outline-none bg-white text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Đăng ký ngay
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded-lg border border-green-200 text-center">
              <p className="text-xs text-gray-600">Giao hàng</p>
              <p className="text-green-600 font-bold text-sm">Toàn quốc</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-green-200 text-center">
              <p className="text-xs text-gray-600">Hỗ trợ</p>
              <p className="text-green-600 font-bold text-sm">24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-green-200 bg-gradient-to-r from-green-100 to-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-8 py-4">
          <p className="text-gray-700 text-sm mb-2 sm:mb-0">
            © 2025{" "}
            <span className="font-semibold text-green-700">REBO Store</span>.
            All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Powered by Next.js</span>
            <span>•</span>
            <span>
              Made with{" "}
              <Heart size={12} className="inline fill-red-500 text-red-500" />{" "}
              in Vietnam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
