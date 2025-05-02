// src/components/dialogs/EditClassDialog.jsx (Hoặc đường dẫn phù hợp)
import { useState, useEffect } from "react";
import { useGetDepartmentQuery, useGetCoursesQuery } from "@/api/rtkQuery/featureApi/otherApiSlice";
import { Button } from "@/components/ui/button";

const EditClassDialog = ({ isOpen, onClose, onSubmit, initialData }) => {
  // initialData giờ là class được chọn để sửa
  const [classInfo, setClassInfo] = useState({ name: "", departmentId: "", courseId: "" });
  const { data: departments, isLoading: loadingDepartments } = useGetDepartmentQuery();
  const { data: courses, isLoading: loadingCourses } = useGetCoursesQuery();

  // Cập nhật state nội bộ khi initialData thay đổi (khi người dùng chọn sửa một lớp khác)
  useEffect(() => {
    if (initialData) {
      setClassInfo({
        name: initialData.name || "",
        // Sử dụng optional chaining (?) để tránh lỗi nếu department hoặc course không tồn tại
        departmentId: initialData.department?.id || "",
        courseId: initialData.course?.id || "", // Giả sử bạn muốn dùng course.id
      });
    } else {
      // Reset form nếu không có initialData (ví dụ: khi dialog đóng và mở lại không có dữ liệu)
      setClassInfo({ name: "", departmentId: "", courseId: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassInfo({ ...classInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(classInfo); // Gọi hàm onSubmit (chính là handleUpdateClass từ component cha)
    onClose(); // Đóng dialog sau khi submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa lớp học</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên lớp học</label>
            <input type="text" name="name" value={classInfo.name} onChange={handleChange} className="input input-bordered w-full" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Khoa</label>
            {loadingDepartments ? <p>Loading...</p> : (
              <select name="departmentId" value={classInfo.departmentId} onChange={handleChange} className="input input-bordered w-full" required>
                <option value="">Chọn khoa</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Khóa học</label>
            {loadingCourses ? <p>Loading...</p> : (
              <select name="courseId" value={classInfo.courseId} onChange={handleChange} className="input input-bordered w-full" required>
                <option value="">Chọn khóa học</option>
                {courses?.map((c) => (
                   // Giả sử bạn muốn dùng course.id
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" className="bg-main text-white">Cập nhật</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassDialog;