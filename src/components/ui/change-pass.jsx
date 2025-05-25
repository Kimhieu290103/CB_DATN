

import  { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Nếu bạn dùng Shadcn UI Toast
import { useChangePasswordMutation } from "@/api/rtkQuery/featureApi/accountApiSlice";
const ChangePasswordDialog = ({ open, onOpenChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { toast } = useToast(); // Nếu bạn dùng Shadcn UI Toast
  const [changePassword, { isLoading, isSuccess, isError, error }] = useChangePasswordMutation(); 
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Vui lòng xác nhận mật khẩu mới.";
      isValid = false;
    } else if (confirmNewPassword !== newPassword) {
      newErrors.confirmNewPassword = "Mật khẩu xác nhận không khớp với mật khẩu mới.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const result = await changePassword({ oldPassword: currentPassword, newPassword }).unwrap();
        // Nếu unwrap() thành công, API trả về dữ liệu thành công (trong trường hợp này là message)
        toast({
          title: "Thành công!",
          description: result?.mess || "Đổi mật khẩu thành công!", // Sử dụng mess từ API nếu có
          variant: "success",
          duration: 2000,
        });
        onOpenChange(false);
      } catch (error) {
        // Nếu unwrap() thất bại, nó sẽ throw error (thường là lỗi từ API)
        toast({
          variant: "destructive",
          title: "Lỗi!",
          description: error?.data?.message || "Đã có lỗi xảy ra khi đổi mật khẩu.", // Hiển thị lỗi từ API nếu có
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: "Vui lòng kiểm tra lại các trường.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <input
             className="input input-bordered w-full max-w-3xl rounded-md bg-white" 
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <input
             className="input input-bordered w-full max-w-3xl rounded-md bg-white" 
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
            <input
             className="input input-bordered w-full max-w-3xl rounded-md bg-white" 
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" className="btn" variant="secondary" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button"  className="btn bg-[rgb(10_103_175)] hover:bg-[rgb(8_82_139)] text-white" onClick={handleSubmit}>
            Đổi mật khẩu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;