import { useState, useEffect } from "react";
import ClassCListFilterItem from "./class-filter";
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PaginationItem from "@/components/items/pagination/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useGetClassesMutation,
  useCreateClassMutation,
  useGetDepartmentQuery,
  useGetCoursesQuery,
  useUpdateClassMutation,
  useGetAllClassesPagedQuery,
  useDeleteClassMutation
} from "@/api/rtkQuery/featureApi/otherApiSlice";

// Dialog Component
const CreateClassDialog = ({ isOpen, onClose, onCreate }) => {
  const [classInfo, setClassInfo] = useState({
    name: "",
    departmentId: "",
    courseId: "",
  });
  const { data: departments, isLoading, isError } = useGetDepartmentQuery();
  const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError } = useGetCoursesQuery();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassInfo({ ...classInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(classInfo);
    onClose();
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
            {isLoading ? (
              <p>Đang tải dữ liệu khoa...</p>
            ) : isError ? (
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
            {isCoursesLoading ? (
              <p>Đang tải dữ liệu khóa học...</p>
            ) : isCoursesError ? (
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
                {courses?.map((course) => (
                  <option key={course.id} value={course.name}>
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

export default function ListClass() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ departmentID: "", courseID: "" });
  const [filteredClasses, setFilteredClasses] = useState([]);
  const { data: allClasses, isLoading: isClassesLoading, isError: isClassesError } = useGetAllClassesPagedQuery( { page, limit: rowsPerPage },
    { refetchOnMountOrArgChange: true });
  const [getClasses, { isLoading: isFilterLoading }] = useGetClassesMutation();
  const [createClass, { isLoading: isCreatingClass }] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const { toast } = useToast();
  const handleChangePageInParent = (e) => {
    setPage(e.selected);
};

  const handleChangeRowsPerPageInParent = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  // Trong component ListClass:
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false); // State để mở/đóng dialog

  const handleFilterResults = async (newFilters) => {
    setFilters(newFilters);
    try {
      const response = await getClasses({
        departmentId: newFilters.departmentID || undefined,
        courseId: newFilters.courseID || undefined,
      }).unwrap();
      setFilteredClasses(response);
      console.log("Danh sách lớp sau khi lọc:", response);
    } catch (error) {
      console.error("Lỗi khi lọc lớp:", error);
    }
  };

  const handleCreateClass = async (classInfo) => {
    const dataToSend = {
      ...classInfo,
      status: true,
      course: classInfo.courseId,
    };

    try {
      console.log("Thông tin lớp học đã gửi:", JSON.stringify(dataToSend, null, 2));
      const response = await createClass(dataToSend).unwrap();
      console.log("Lớp học mới đã được tạo:", response);

      toast({
        title: "Thành công",
        description: `Lớp học đã được tạo thành công!`,
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
      toast({
        title: "Lỗi",
        description: "Tên lớp đã tồn tại. Vui lòng thử lại.",
        variant: "destructive",
        action: <ToastAction altText="Thử lại">Thử lại</ToastAction>,
      });
    }
  };



  const classesToDisplay =
    (filters.departmentID || filters.courseID) && filteredClasses.length > 0
      ? filteredClasses
      : allClasses?.content;

  const isLoadingData = isClassesLoading || isFilterLoading;
  const isErrorData = isClassesError;

  const handleEditClass = (clazz) => {
    setSelectedClass(clazz);
    setEditDialogOpen(true);
  };
  const handleUpdateClass = async (updatedClassInfo) => {
    const dataToSend = {
      id: selectedClass.id, 
      name: updatedClassInfo.name,
      departmentId: updatedClassInfo.departmentId,
      courseId: updatedClassInfo.courseId, 
      status: true, 
    };
  
    try {
      console.log("Dữ liệu cập nhật:", dataToSend);
      const response = await updateClass(dataToSend).unwrap();
      console.log("Lớp học đã được cập nhật:", response);
  
      toast({
        title: "Thành công",
        description: `Lớp học đã được cập nhật thành công!`,
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật lớp học:", error);
      toast({
        title: "Lỗi",
        description: "Tên lớp đã tồn tại. Vui lòng thử lại.",
        variant: "destructive",
        action: <ToastAction altText="Thử lại">Thử lại</ToastAction>,
      });
    }
  };
  
  const handleDeleteClass = async (clazzId) => {
    try {
      await deleteClass(clazzId).unwrap();
      toast({
        title: "Thành công",
        description: "Lớp học đã được xóa!",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa lớp học.",
        variant: "destructive",
      });
    }
  };
  
  const EditClassDialog = ({ isOpen, onClose, onSubmit, initialData }) => {
    const isEditing = !!initialData;
    const [classInfo, setClassInfo] = useState(initialData || { name: "", departmentId: "", courseId: "" });
    const { data: departments, isLoading: loadingDepartments } = useGetDepartmentQuery();
    const { data: courses, isLoading: loadingCourses } = useGetCoursesQuery();

    useEffect(() => {
      if (initialData) {
        setClassInfo({
          name: initialData.name || "",
          departmentId: initialData.department?.id || "",
          courseId: initialData.course?.id || "",
        });
      }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setClassInfo({ ...classInfo, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateClass(classInfo);
      onClose();
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
              <select name="departmentId" value={classInfo.departmentId} onChange={handleChange} className="input input-bordered w-full" required>
                <option value="">Chọn khoa</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Khóa học</label>
              <select name="courseId" value={classInfo.courseId} onChange={handleChange} className="input input-bordered w-full" required>
                <option value="">Chọn khóa học</option>
                {courses?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
  return (
    <div className="mx-auto py-4 px-0">
      <h1 className="text-2xl font-semibold mb-4">Danh sách lớp học</h1>

      {isLoadingData ? (
        <p>Đang tải dữ liệu...</p>
      ) : isErrorData ? (
        <p>Đã xảy ra lỗi khi tải dữ liệu.</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-start mb-8">
            <div className="flex items-center gap-4 mb-2">
              <label className="input input-bordered flex items-center gap-2 h-10">
                <input
                  type="text"
                  className="grow"
                  placeholder="Tìm kiếm lớp học ...."
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <ClassCListFilterItem onFilterResults={handleFilterResults} />
            </div>
            <Button
              className="btn bg-main hover:bg-main-hover text-white"
              onClick={() => setDialogOpen(true)} // Mở dialog khi click
            >
              + Thêm lớp học
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center hidden sm:table-cell">
                  STT
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  Lớp
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  Khóa học
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  Khoa
                </TableHead>
                <TableHead className="text-center">Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesToDisplay?.map((clazz, index) => (
                <TableRow key={clazz.id}>
                  <TableCell className="font-medium text-center hidden sm:table-cell">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {clazz.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {clazz.course?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {clazz.department?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <span className="material-symbols-outlined">more_vert</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2">
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleEditClass(clazz)}
                          >
                            Chỉnh sửa lớp
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start text-red-500"
                            onClick={() => handleDeleteClass(clazz.id)}
                          >
                            Xóa lớp
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="w-full my-4 px-4 flex justify-end items-center">
            <PaginationItem
              totalPages={allClasses?.totalPages}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePageInParent}
              handleChangeRowsPerPage={handleChangeRowsPerPageInParent}
            />
          </div>
          {/* Dialog để thêm lớp học */}
          <CreateClassDialog
            isOpen={isDialogOpen}
            onClose={() => setDialogOpen(false)}
            onCreate={handleCreateClass}
          />
          <EditClassDialog
            isOpen={isEditDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            onSubmit={handleUpdateClass}
            initialData={selectedClass}
          />


        </>
      )}
    </div>
  );
}
