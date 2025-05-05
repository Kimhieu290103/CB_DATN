import { useState } from "react";
import ScoreListFilterItem from "@/components/items/community-score/score-list-filter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditProfileForm from '@/pages/account-manager/edit-account';
import { useGetAllClassesQuery } from "@/api/rtkQuery/featureApi/otherApiSlice";
import {
  useGetAllStudentsQuery,
  useRegisterStudentMutation,
  useBulkRegisterStudentsMutation,
  useSearchStudentsQuery,
  useDeactivateUserMutation
} from "@/api/rtkQuery/featureApi/accountApiSlice";
import PaginationItem from "@/components/items/pagination/pagination";

export default function AccountListStudent() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filters, setFilters] = useState({
    departmentID: '',
    courseID: '',
    classID: '',
    semesterID: '',
  });
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setOpenEditModal(true);
  };
  const handleFilterResults = (filters) => {
    setFilters(filters);
  };
  const [bulkRegisterStudents] = useBulkRegisterStudentsMutation();
  const [createStudent, { isLoading: isCreating }] = useRegisterStudentMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [openAdd, setOpenAdd] = useState(false);
  const { data: studentData, isLoading, isError,refetch } = useGetAllStudentsQuery(
    { page, limit: rowsPerPage },
    { refetchOnMountOrArgChange: true }
  );
  const { data: classes, isLoading: isClassLoading } = useGetAllClassesQuery();
  const handleChangePageInParent = (e) => {
    setPage(e.selected);
  };

  const handleChangeRowsPerPageInParent = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  const [formData, setFormData] = useState({
    fullname: '',
    phone_number: '',
    student_id: '',
    address: '',
    date_of_birth: '',
    email: '',
    username: '',
    password: '',
    retype_password: '',
    class_id: '',
    role_id: 'SV',
  });
  const [excelFile, setExcelFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.retype_password) {
      alert("Mật khẩu và nhập lại mật khẩu không khớp.");
      return;
    }

    try {
      await createStudent(formData).unwrap();
      alert("Tạo tài khoản thành công!");
      setFormData({
        fullname: '',
        phone_number: '',
        student_id: '',
        address: '',
        date_of_birth: '',
        email: '',
        username: '',
        password: '',
        retype_password: '',
        class_id: '',
        role_id: 'SV',
      });
      setOpenAdd(false);
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      alert("Đã xảy ra lỗi khi tạo tài khoản.");
    }
  };


  const handleExcelSubmit = async () => {
    if (!excelFile) {
      alert("Vui lòng chọn file Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await bulkRegisterStudents(formData).unwrap();
      alert("Đăng ký sinh viên hàng loạt thành công!");
      setExcelFile(null);
      setOpenAdd(false);
    } catch (error) {
      console.error("Lỗi khi upload file Excel:", error);
      alert("Đã xảy ra lỗi khi upload file Excel.");
    }
  };
  // Trong component
  const [searchTerm, setSearchTerm] = useState('');
  const { data: searchResults, isLoading: isSearchLoading, isError: isSearchError } = useSearchStudentsQuery(
    { search: searchTerm, page, size: rowsPerPage },
    { skip: !searchTerm } // Chỉ gọi API khi có từ khóa tìm kiếm
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleDeactivate = async (id) => {
    if (confirm("Bạn có chắc muốn vô hiệu hóa tài khoản này?")) {
      try {
        await deactivateUser(id).unwrap();
        alert("Đã vô hiệu hóa tài khoản.");
        refetch();
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể vô hiệu hóa.");
      }
    }
  };
  return (
    <div className="mx-auto py-4 px-0">
      <h1 className="text-2xl font-semibold mb-4">Danh sách sinh viên</h1>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : isError ? (
        <p>Đã xảy ra lỗi khi tải dữ liệu.</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-start mb-8">
            <div className="flex items-center gap-4 mb-2">
              <label className="input input-bordered flex items-center gap-2 h-10">
                <input type="text" className="grow" placeholder="Tìm kiếm sinh viên ...." value={searchTerm}
                  onChange={handleSearchChange} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06
                                      1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>

              <ScoreListFilterItem onFilterResults={handleFilterResults} />
            </div>
            <Button class="btn bg-main hover:bg-main-hover text-white" onClick={() => setOpenAdd(true)}>+ Thêm tài khoản</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center hidden sm:table-cell">MSSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead className="hidden sm:table-cell">Lớp</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Số điện thoại</TableHead>
                <TableHead className="text-center">Địa chỉ</TableHead>
                <TableHead className="text-center">Tình trạng</TableHead>
                <TableHead className="text-center">Tùy chọn</TableHead>
                {/* <TableHead className="text-right">Thao tác</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(searchTerm ? searchResults?.content : studentData?.content)?.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-center hidden sm:table-cell">{student.studentId}</TableCell>
                  <TableCell>{student.fullname}</TableCell>
                  <TableCell className="hidden sm:table-cell">{student.clazz}</TableCell>
                  <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{student.phoneNumber}</TableCell>
                  <TableCell className="text-center font-medium">
                    {student.address.length > 20 ? student.address.slice(0, 20) + '...' : student.address}
                  </TableCell>
                  <TableCell className={`text-center font-medium ${student.active ? 'text-green-500' : 'text-red-500'}`}>
                    {student.active ? 'Hoạt động' : 'Khóa'}
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
                            onClick={() => {
                              setSelectedStudent(student);
                              setOpen(true);
                            }}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handleOpenEditModal(student)}
                          >
                            chỉnh sửa
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start text-red-500"
                            onClick={() => handleDeactivate(student.id)}
                          >
                            Khóa tài khoản
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
              totalPages={studentData?.totalPages}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePageInParent}
              handleChangeRowsPerPage={handleChangeRowsPerPageInParent}
            />
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết sinh viên</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <p><strong>Họ tên:</strong> {selectedStudent?.fullname}</p>
            <p><strong>MSSV:</strong> {selectedStudent?.studentId}</p>
            <p><strong>Email:</strong> {selectedStudent?.email}</p>
            <p><strong>SĐT:</strong> {selectedStudent?.phoneNumber}</p>
            <p><strong>Lớp:</strong> {selectedStudent?.clazz}</p>
            <p><strong>Khoa:</strong> {selectedStudent?.department}</p>
            <p><strong>Địa chỉ:</strong> {selectedStudent?.address}</p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm tài khoản sinh viên</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="fullname" onChange={handleChange} value={formData.fullname} placeholder="Họ và tên" className="input input-bordered" />
              <input name="student_id" onChange={handleChange} value={formData.student_id} placeholder="MSSV" className="input input-bordered" />
              <input name="phone_number" onChange={handleChange} value={formData.phone_number} placeholder="Số điện thoại" className="input input-bordered" />
              <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" className="input input-bordered" />
              <input name="address" onChange={handleChange} value={formData.address} placeholder="Địa chỉ" className="input input-bordered" />
              <input type="date" name="date_of_birth" onChange={handleChange} value={formData.date_of_birth} className="input input-bordered" />
              <input name="username" onChange={handleChange} value={formData.username} placeholder="Tên đăng nhập" className="input input-bordered" />
              <input type="password" name="password" onChange={handleChange} value={formData.password} placeholder="Mật khẩu" className="input input-bordered" />
              <input type="password" name="retype_password" onChange={handleChange} value={formData.retype_password} placeholder="Nhập lại mật khẩu" className="input input-bordered" />
              <select
                name="class_id"
                onChange={handleChange}
                value={formData.class_id}
                className="input input-bordered"
              >
                <option value="">-- Chọn lớp --</option>
                {classes?.map((clazz) => (
                  <option key={clazz.id} value={clazz.name}>
                    {clazz.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button class="btn bg-main hover:bg-main-hover text-white" onClick={handleSubmit}>Lưu</Button>
            </div>

            <hr className="my-2" />
            <p className="text-sm font-medium">Hoặc nhập bằng file Excel:</p>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs text-blue-500" />
            <div className="flex justify-end">
              <Button class="btn bg-main hover:bg-main-hover text-white" onClick={handleExcelSubmit}>Tải lên Excel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal chi tiết */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết sinh viên</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <p><strong>Họ tên:</strong> {selectedStudent?.fullname}</p>
            <p><strong>MSSV:</strong> {selectedStudent?.studentId}</p>
            <p><strong>Email:</strong> {selectedStudent?.email}</p>
            <p><strong>SĐT:</strong> {selectedStudent?.phoneNumber}</p>
            <p><strong>Lớp:</strong> {selectedStudent?.clazz}</p>
            <p><strong>Khoa:</strong> {selectedStudent?.department}</p>
            <p><strong>Địa chỉ:</strong> {selectedStudent?.address}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal chỉnh sửa */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin sinh viên</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <EditProfileForm
              initialProfile={editingStudent}
              userId={editingStudent.id} // Hoặc trường định danh duy nhất khác
              onClose={() => setOpenEditModal(false)} // Thêm prop để đóng modal từ form
              onEditSuccess={refetch} 
              // Thêm các props khác nếu EditProfileForm cần
            />
          )}
        </DialogContent>
      </Dialog>

     
    </div>
  );
}

