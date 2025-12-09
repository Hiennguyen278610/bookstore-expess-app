import toast from 'react-hot-toast';

export const confirmDelete = (
    itemName: string,
    onConfirm: () => Promise<void>,
    entityType: string = 'mục'
) => {
    toast((t) => (
        <div>
            <p className="font-semibold">Xác nhận xóa {entityType}</p>
            <p className="text-sm text-gray-600 mt-1">
                Bạn có chắc muốn xóa "{itemName}"?
            </p>
            <p className="text-xs text-red-500 mt-1">⚠️ Hành động này không thể hoàn tác!</p>
            <div className="flex gap-2 mt-3">
                <button
                    onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            await onConfirm();
                            toast.success(`Đã xóa ${entityType} thành công!`);
                        } catch (error) {
                            console.error('Error deleting:', error);
                            toast.error(`Lỗi khi xóa ${entityType}!`);
                        }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                    Xóa
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                    Hủy
                </button>
            </div>
        </div>
    ), { duration: Infinity });
};
