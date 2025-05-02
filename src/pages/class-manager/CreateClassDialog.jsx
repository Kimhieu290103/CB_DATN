import { useState } from "react";
import { useGetDepartmentQuery, useGetCoursesQuery } from "@/api/rtkQuery/featureApi/otherApiSlice";
import { Button } from "@/components/ui/button";

const CreateClassDialog = ({ isOpen, onClose, onCreate }) => {
  const [classInfo, setClassInfo] = useState({
    name: "",
    departmentId: "",
    courseId: "",
  });
  const { data: departments, isLoading: loadingDepartments, isError: errorDepartments } = useGetDepartmentQuery();
  const { data: courses, isLoading: loadingCourses, isError: errorCourses } = useGetCoursesQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassInfo({ ...classInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(classInfo); // Gọi hàm onCreate được truyền từ props
    onClose(); // Đóng dialog sau khi submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Thêm lớp học mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên lớp học</label>
            <input
              type="text"
              name="name"
              value={classInfo.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          {/* Department select dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Khoa</label>
            {loadingDepartments ? (
              <p>Đang tải dữ liệu khoa...</p>
            ) : errorDepartments ? (
              <p>Đã xảy ra lỗi khi tải danh sách khoa.</p>
            ) : (
              <select
                name="departmentId"
                value={classInfo.departmentId}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              >
                <option value="">Chọn khoa</option>
                {departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Khóa học</label>
            {loadingCourses ? (
              <p>Đang tải dữ liệu khóa học...</p>
            ) : errorCourses ? (
              <p>Đã xảy ra lỗi khi tải danh sách khóa học.</p>
            ) : (
              <select
                name="courseId"
                value={classInfo.courseId}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              >
                <option value="">Chọn khóa học</option>
                {/* Chú ý: API gốc trả về course.name cho value, nhưng thường ID sẽ tốt hơn.
                    Nếu API getCourses trả về course.id thì dùng course.id ở đây.
                    Nếu API createClass thực sự cần course.name thì giữ nguyên.
                    Ví dụ này giả sử API trả về course.id và bạn cần dùng id */}
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}> {/* Nên dùng ID nếu có */}
                    {course.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="solid" className="bg-main text-white">
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassDialog;