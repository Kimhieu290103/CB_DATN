import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetUserInfoQuery } from "@/api/rtkQuery/featureApi/accountApiSlice";


const UserInfoDialog = ({ open, onOpenChange, previousFocus }) => {
    const { data, isLoading, isError } = useGetUserInfoQuery(); // Dùng API của bạn để lấy thông tin

    // Khi đang tải hoặc có lỗi, không hiển thị Dialog
    if (isLoading) return <p className="p-4">Đang tải thông tin...</p>;
    if (isError) return <p className="p-4 text-red-500">Không thể tải thông tin cá nhân</p>;

    const handleClose = () => {
        onOpenChange(false); // Đóng dialog
        setTimeout(() => {
            previousFocus?.focus(); // Trả focus về phần tử trước đó
        }, 0);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl mb-4">Thông tin cá nhân</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-4">
                    <div className="font-medium">Họ tên:</div>
                    <div>{data?.fullname || '—'}</div>

                    <div className="font-medium">Email:</div>
                    <div>{data?.email || '—'}</div>

                    <div className="font-medium">Số điện thoại:</div>
                    <div>{data?.phoneNumber || '—'}</div>

                    <div className="font-medium">Địa chỉ:</div>
                    <div>{data?.address || '—'}</div>
                </div>
                <DialogFooter>
                    <Button onClick={handleClose}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserInfoDialog;