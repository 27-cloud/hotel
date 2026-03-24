import { TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBooking } from "../_lib/data-service";

function DeleteReservation({ bookingId }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBooking(bookingId);
      router.refresh(); // 刷新页面，重新获取数据
    } catch (error) {
      console.error("删除失败:", error);
      alert("Failed to delete reservation");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={() => handleDelete()}
      disabled={isLoading}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
      <span className="mt-1">Delete</span>
    </button>
  );
}

export default DeleteReservation;
