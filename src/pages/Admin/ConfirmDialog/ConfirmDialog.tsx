
type ConfirmDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
};

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName,
}: ConfirmDeleteDialogProps) {

  if (!open) return null;

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa <span className="font-medium">"{itemName}"</span> không?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}
