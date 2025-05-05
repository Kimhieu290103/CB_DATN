import React, { useState, useEffect } from 'react';
import { useUpdateProfileMutation } from '@/api/rtkQuery/featureApi/accountApiSlice';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

/**
 * @typedef {object} Profile
 * @property {number} [id] - Hoặc trường định danh khác
 * @property {string} [fullname]
 * @property {string} [phoneNumber]
 * @property {string} [address]
 * @property {string} [email]
 * @property {string} [clazz]
 * @property {string} [studentId]
 * @property {string} [dateOfBirth]
 */

/**
 * @param {{
 * initialProfile: Profile,
 * userId: number,
 * onClose: () => void
 * }} props
 */
const EditProfileForm = ({ initialProfile, userId, onClose, onEditSuccess }) => {
  const [fullname, setFullname] = useState(initialProfile?.fullname || '');
  const [phoneNumber, setPhoneNumber] = useState(initialProfile?.phoneNumber || '');
  const [address, setAddress] = useState(initialProfile?.address || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [clazz, setClazz] = useState(initialProfile?.clazz || '');
  const [studentId, setStudentId] = useState(initialProfile?.studentId || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile?.dateOfBirth || '');

  const [updateProfile, { isLoading, isSuccess, isError, error }] = useUpdateProfileMutation();

  useEffect(() => {
    setFullname(initialProfile?.fullname || '');
    setPhoneNumber(initialProfile?.phoneNumber || '');
    setAddress(initialProfile?.address || '');
    setEmail(initialProfile?.email || '');
    setClazz(initialProfile?.clazz || '');
    setStudentId(initialProfile?.studentId || '');
    setDateOfBirth(initialProfile?.dateOfBirth || '');
  }, [initialProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        id: userId,
        fullname: fullname,
        phoneNumber: phoneNumber,
        address: address,
        email: email,
        className: clazz, // Giữ là clazz theo state hiện tại
        studentId: studentId,
        dateOfBirth: dateOfBirth,
      }).unwrap();
      console.log('Cập nhật profile thành công!');
      onEditSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi khi cập nhật profile:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa thông tin sinh viên</DialogTitle>
        <DialogDescription>Cập nhật thông tin chi tiết của sinh viên.</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="fullname" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Họ và tên</label>
          <input type="text" id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Số điện thoại</label>
          <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label htmlFor="clazz" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lớp</label>
          <input type="text" id="clazz" value={clazz} onChange={(e) => setClazz(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="col-span-2 space-y-2">
          <label htmlFor="address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Địa chỉ</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label htmlFor="studentId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">MSSV</label>
          <input type="text" id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ngày sinh</label>
          <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-muted-foreground file:h-10 file:px-3 file:py-2 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        {/* Thêm các input khác nếu cần */}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-main hover:bg-main-hover text-white">
          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
      {isError && <div className="text-red-500">Lỗi: {error?.data?.message || 'Đã có lỗi xảy ra.'}</div>}
      {isSuccess && <div className="text-green-500">Cập nhật thành công!</div>}
    </form>
  );
};

export default EditProfileForm;