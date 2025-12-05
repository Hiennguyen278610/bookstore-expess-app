"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapPin, Plus, Map as MapIcon, Navigation, ChevronRight, MoreHorizontal, Loader2, Search } from "lucide-react";

// Load Map Dynamic
const MapPicker = dynamic(() => import("@/components/map-picker"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100"><Loader2 className="animate-spin" /></div>,
});

const demoAddresses = [
  { id: 1, name: "Nguyễn Văn A", phone: "0901234567", address: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh", type: "Nhà riêng", isDefault: true },
];

export function AddressTab() {
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Form State
  const [addressInput, setAddressInput] = useState("");
  const [provinceInput, setProvinceInput] = useState("");

  // Map State
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.6951 });
  const [selectedAddressName, setSelectedAddressName] = useState("Kéo bản đồ để chọn vị trí...");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const GOONG_API_KEY = process.env.NEXT_PUBLIC_GOONG_API_KEY || "";

  // 1. TÌM KIẾM ĐỊA ĐIỂM (GOONG AUTOCOMPLETE)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);

    try {
      // --- NẾU CHƯA CÓ KEY (TEST GIAO DIỆN) ---
      // Bật đoạn này lên để test giao diện khi chưa có key
      /*
      await new Promise(r => setTimeout(r, 500));
      setSearchResults([
          { description: "270/97 Phan Đình Phùng, Phường 1, Phú Nhuận", place_id: "mock_1" },
          { description: "Landmark 81, Bình Thạnh, HCM", place_id: "mock_2" }
      ]);
      setIsSearching(false);
      return;
      */
      // ----------------------------------------

      // --- API THẬT ---
      const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.predictions) {
        setSearchResults(data.predictions);
      } else {
        toast.error("Không tìm thấy địa điểm");
      }
    } catch (error) {
      toast.error("Lỗi kết nối Goong Maps");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. CHỌN KẾT QUẢ TÌM KIẾM (GOONG DETAIL)
  const handleSelectResult = async (item: any) => {
    // Mock logic (Nếu test không key)
    if (item.place_id === "mock_1") {
      const mockLat = 10.7924;
      const mockLng = 106.6812;
      setMapCenter({ lat: mockLat, lng: mockLng });
      setSelectedAddressName(item.description);
      setSearchResults([]);
      return;
    }

    try {
      // Gọi API Detail để lấy tọa độ chính xác từ place_id
      const detailUrl = `https://rsapi.goong.io/Place/Detail?place_id=${item.place_id}&api_key=${GOONG_API_KEY}`;
      const res = await fetch(detailUrl);
      const data = await res.json();

      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;

        setMapCenter({ lat, lng }); // Map bay tới
        setSelectedAddressName(item.description); // Tên hiển thị
        setSearchResults([]); // Tắt list tìm kiếm
      }
    } catch (e) {
      toast.error("Không lấy được tọa độ");
    }
  };

  // 3. KÉO MAP -> LẤY ĐỊA CHỈ (GOONG GEOCODE)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMapMoveEnd = (lat: number, lng: number) => {
    setSelectedAddressName("Đang xác định...");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const url = `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          // Lấy kết quả đầu tiên (chính xác nhất)
          setSelectedAddressName(data.results[0].formatted_address);
        } else {
          setSelectedAddressName("Vị trí chưa xác định tên đường");
        }
      } catch (error) {
        setSelectedAddressName("Lỗi lấy tên đường");
      }
    }, 800); // Delay 0.8s
  };

  const handleConfirmLocation = () => {
    setAddressInput(selectedAddressName);
    // Logic tách chuỗi địa chỉ để điền vào ô Tỉnh/Thành (Tương đối)
    const parts = selectedAddressName.split(",");
    if (parts.length >= 2) {
      setProvinceInput(`${parts[parts.length-2]}, ${parts[parts.length-1]}`.trim());
    }
    setIsMapOpen(false);
    toast.success("Đã chọn vị trí");
  };

  return (
    <>
      {/* UI DANH SÁCH ĐỊA CHỈ (GIỮ NGUYÊN) */}
      <Card className="border-none shadow-none bg-transparent lg:bg-white lg:border lg:shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 lg:mb-0 lg:p-6 lg:border-b border-gray-100">
          <div>
            <CardTitle className="text-xl">Sổ địa chỉ</CardTitle>
            <CardDescription>Quản lý danh sách địa chỉ nhận hàng</CardDescription>
          </div>
          <Button onClick={() => setIsOpenAddressModal(true)} className="w-full md:w-auto flex items-center gap-2">
            <Plus size={18} /> Thêm địa chỉ mới
          </Button>
        </div>
        <CardContent className="px-0 lg:px-0">
          <div className="grid gap-4 lg:gap-0 lg:divide-y divide-gray-100">
            {demoAddresses.map((addr) => (
              <div key={addr.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm lg:border-none lg:shadow-none lg:rounded-none lg:p-6 flex flex-col md:flex-row justify-between items-start gap-4 hover:bg-gray-50 transition-colors group">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 text-base">{addr.name}</span>
                    {addr.isDefault && <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">Mặc định</Badge>}
                    <Badge variant="outline" className="text-gray-500 font-normal">{addr.type}</Badge>
                  </div>
                  <p className="text-gray-500 text-sm">{addr.phone}</p>
                  <p className="text-gray-700 text-sm font-medium">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UI MODAL NHẬP ĐỊA CHỈ (GIỮ NGUYÊN) */}
      <Dialog open={isOpenAddressModal} onOpenChange={setIsOpenAddressModal}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none md:h-auto md:w-full md:max-w-xl md:rounded-lg p-0 gap-0 flex flex-col">
          <DialogHeader className="p-4 md:p-6 border-b bg-white">
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 md:bg-white">
            <div className="grid gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Họ và tên</Label>
                  <Input placeholder="Tên người nhận" />
                </div>
                <div className="grid gap-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Số điện thoại" type="tel" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Địa chỉ</Label>
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Tỉnh/Thành, Quận/Huyện..."
                    className="flex-1"
                    value={provinceInput}
                    onChange={(e) => setProvinceInput(e.target.value)}
                  />
                  <Button type="button" variant="outline" className="gap-2 w-full md:w-auto text-primary border-primary/20 bg-primary/5 hover:bg-primary/10" onClick={() => setIsMapOpen(true)}>
                    <MapIcon size={16} /> Chọn trên bản đồ
                  </Button>
                </div>
                <Textarea
                  placeholder="Số nhà, tên đường cụ thể..."
                  className="min-h-[80px]"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="default-addr" className="accent-primary h-4 w-4" />
                <Label htmlFor="default-addr" className="font-normal cursor-pointer">Đặt làm địa chỉ mặc định</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-white flex-row gap-3 justify-end">
            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setIsOpenAddressModal(false)}>Hủy</Button>
            <Button className="flex-1 md:flex-none">Lưu địa chỉ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UI MODAL MAP PICKER */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none md:max-w-3xl md:h-[80vh] md:rounded-lg p-0 flex flex-col overflow-hidden">
          <div className="relative flex-1 bg-gray-100 w-full z-0">

            {/* THANH TÌM KIẾM */}
            <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col gap-1">
              <div className="bg-white rounded-lg shadow-lg flex-1 h-12 flex items-center px-4 gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 -ml-2 md:hidden" onClick={() => setIsMapOpen(false)}>
                  <ChevronRight className="rotate-180" />
                </Button>
                <input
                  className="flex-1 outline-none text-sm bg-transparent"
                  placeholder="Tìm kiếm địa chỉ (Goong Maps)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button size="icon" variant="ghost" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} className="text-gray-500" />}
                </Button>
              </div>

              {/* KẾT QUẢ TÌM KIẾM */}
              {searchResults.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleSelectResult(item)}
                    >
                      <p className="font-medium truncate text-gray-900">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BẢN ĐỒ */}
            <div className="w-full h-full relative">
              <MapPicker center={mapCenter} onLocationSelect={onMapMoveEnd} />

              {/* PIN CỐ ĐỊNH */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pb-10 pointer-events-none">
                <MapPin size={40} className="text-red-600 fill-red-600 animate-bounce drop-shadow-md" />
                <div className="w-3 h-1.5 bg-black/20 rounded-full absolute bottom-10 left-1/2 -translate-x-1/2 blur-[1px]"></div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-white p-4 border-t shadow-lg z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vị trí đã chọn</p>
                <p className="text-sm font-bold text-gray-900 truncate mt-1">
                  {selectedAddressName}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Dữ liệu bản đồ bởi Goong.io</p>
              </div>
              <Button className="w-full md:w-auto min-w-[150px]" onClick={handleConfirmLocation}>
                Xác nhận vị trí
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}