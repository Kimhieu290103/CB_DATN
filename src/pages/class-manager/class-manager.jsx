import { useState } from "react";
import ScoreListFilterItem from "@/components/items/community-score/score-list-filter";
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
import { useGetAllClassesQuery } from "@/api/rtkQuery/featureApi/otherApiSlice";
import { useGetAllStudentsQuery, useRegisterStudentMutation } from "@/api/rtkQuery/featureApi/accountApiSlice";
import PaginationItem from "@/components/items/pagination/pagination";

export default function AccountListStudent() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({
        departmentID: '',
        courseID: '',
        classID: '',
        semesterID: '',
    });
    const handleFilterResults = (filters) => {
        setFilters(filters);
    };
    const [createStudent, { isLoading: isCreating }] = useRegisterStudentMutation();
    const [openAdd, setOpenAdd] = useState(false);
    const { data: studentData, isLoading, isError } = useGetAllStudentsQuery(
        { page, limit: rowsPerPage },
        { refetchOnMountOrArgChange: true }
    );
    const { data: classes, isLoading: isClassLoading } = useGetAllClassesQuery();
    const handleChangePageInParent = (newPage) => {
        setPage(newPage);
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

    const handleExcelSubmit = () => {
        console.log("Upload Excel", excelFile);
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
                                
                                <TableHead className="hidden sm:table-cell text-center">Lớp</TableHead>
                                <TableHead className="hidden sm:table-cell text-center">Khóa học</TableHead>
                                <TableHead className="hidden sm:table-cell text-center">Khoa</TableHead>
                                {/* <TableHead className="text-center">Tổng điểm</TableHead> */}
                                {/* <TableHead className="text-right">Thao tác</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes?.map((clazz, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center hidden sm:table-cell">{index + 1}</TableCell>
                                    <TableCell className="font-medium text-center">{clazz.name}</TableCell>
                                    <TableCell className="text-center">{clazz.course.name}</TableCell>
                                    <TableCell className="text-center">{clazz.department.name}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 flex items-center justify-center"
                                            onClick={() => {
                                                setSelectedStudent(clazz);
                                                setOpen(true);
                                            }}
                                        >
                                            <span className="material-symbols-outlined">visibility</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                    <div className="w-full my-4 px-4 flex justify-end items-center">
                        <PaginationItem
                            totalPages={studentData?.totalPage}
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
        </div>
    );
}