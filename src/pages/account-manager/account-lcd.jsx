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

import { useGetAllLcdQuery, useRegisterStudentMutation } from "@/api/rtkQuery/featureApi/accountApiSlice";
import PaginationItem from "@/components/items/pagination/pagination";

export default function AccountListLcd() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const { data: studentData, isLoading, isError } = useGetAllLcdQuery(
    { page, limit: rowsPerPage },
    { refetchOnMountOrArgChange: true }
  );
  const [filters, setFilters] = useState({
    departmentID: '',
    courseID: '',
    classID: '',
    semesterID: '',
  });
  const [formData, setFormData] = useState({
    fullname: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    email: '',
    student_id: '',
    username: '',
    password: '',
    retype_password: '',
    role_id: 'LCD',
  });


  const [registerStudent] = useRegisterStudentMutation();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async () => {
    try {
      const result = await registerStudent(formData).unwrap();
      console.log("Đăng ký thành công:", result);
      setOpenAdd(false); // đóng dialog nếu thành công
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
    }
  };


  const handleFilterResults = (filters) => {
    setFilters(filters);
  };
  const handleChangePageInParent = (e) => {
    setPage(e.selected);
  };

  const handleChangeRowsPerPageInParent = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <div className="mx-auto py-4 px-0">
      <h1 className="text-2xl font-semibold mb-4">Danh sách liên chi đoàn</h1>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : isError ? (
        <p>Đã xảy ra lỗi khi tải dữ liệu.</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-start mb-8">
            <div className="flex items-center gap-4 mb-2">
              <label className="input input-bordered flex items-center gap-2 h-10">
                <input type="text" className="grow" placeholder="Tìm kiếm sinh viên ...." />
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
                <TableHead className="text-center hidden sm:table-cell">STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Số điện thoại</TableHead>
                <TableHead className="text-center">Tùy chọn</TableHead>
                {/* <TableHead className="text-right">Thao tác</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData?.content?.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-center hidden sm:table-cell">{index + 1}</TableCell>
                  <TableCell>{student.fullname}</TableCell>
                  <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{student.phoneNumber}</TableCell>

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
            <DialogTitle>Chi tiết liên chi đoàn</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <p><strong>Họ tên:</strong> {selectedStudent?.fullname}</p>
            <p><strong>Email:</strong> {selectedStudent?.email}</p>
            <p><strong>SĐT:</strong> {selectedStudent?.phoneNumber}</p>
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
              <input
                name="fullname"
                onChange={handleChange}
                value={formData.fullname}
                placeholder="Họ và tên"
                className="input input-bordered"
              />
              <input
                name="phone_number"
                onChange={handleChange}
                value={formData.phone_number}
                placeholder="Số điện thoại"
                className="input input-bordered"
              />
              <input
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Email"
                className="input input-bordered"
              />
              <input
                name="address"
                onChange={handleChange}
                value={formData.address}
                placeholder="Địa chỉ"
                className="input input-bordered"
              />
              <input
                type="date"
                name="date_of_birth"
                onChange={handleChange}
                value={formData.date_of_birth}
                className="input input-bordered"
              />
              <input
                name="username"
                onChange={handleChange}
                value={formData.username}
                placeholder="Tên đăng nhập"
                className="input input-bordered"
              />
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Mật khẩu"
                className="input input-bordered"
              />
              <input
                type="password"
                name="retype_password"
                onChange={handleChange}
                value={formData.retype_password}
                placeholder="Nhập lại mật khẩu"
                className="input input-bordered"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleSubmit}>Lưu</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}