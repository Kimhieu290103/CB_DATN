import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetCompletedStudentCriteriaQuery } from "@/api/rtkQuery/featureApi/criteriaApiSlice"; // Import đúng hook
import { useGetAcademicYearsQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";
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

const ExcellentStudentsList = () => {
    const [open, setOpen] = useState(false); // Dialog state
    const [selectedStudent, setSelectedStudent] = useState(null); // Selected student state
    const [selectedYear, setSelectedYear] = useState(""); // Selected academic year state

    // Fetch student data when selectedYear changes
    const { data: excellentStudents, isLoading, error } = useGetCompletedStudentCriteriaQuery(selectedYear);

    const AcademicYearSelector = ({ selectedYear, setSelectedYear }) => {
        const { data: academicYears, isLoading, error } = useGetAcademicYearsQuery();
    
        return ( 
            <div className="mb-6">
                <label className="font-bold mr-2">Chọn năm học:</label>
                <select 
                    className="border rounded-md p-1 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)} // When the year changes, update state
                >
                    <option value="">Chọn kỳ</option>
                    {isLoading ? (
                        <option disabled>Đang tải...</option>
                    ) : error ? (
                        <option disabled>Lỗi tải dữ liệu</option>
                    ) : (
                        academicYears?.map((year) => (
                            <option key={year.id} value={year.id}>
                                {year.name}
                            </option>
                        ))
                    )}
                </select>
            </div>
        );
    };
    
    return (
        <>
            <h1 className="text-2xl font-semibold mb-6">
                Danh sách sinh viên đạt tiêu chí 5 tốt
            </h1>

            <div className="flex flex-wrap justify-between items-center mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <AcademicYearSelector 
                        selectedYear={selectedYear} 
                        setSelectedYear={setSelectedYear} 
                    />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden sm:table-cell">MSSV</TableHead>
                        <TableHead className="w-[25rem]">Họ và tên</TableHead>
                        <TableHead className="hidden sm:table-cell">Lớp</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden sm:table-cell">Số điện thoại</TableHead>
                        <TableHead className="text-center">Ngày sinh</TableHead>
                        <TableHead className="text-center">Chi tiết</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan="7" className="text-center">Đang tải dữ liệu...</TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan="7" className="text-center text-red-500">Chọn kì để tải dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        excellentStudents?.map((student, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium text-center hidden sm:table-cell">{student.studentId}</TableCell>
                                <TableCell>{student.fullname}</TableCell>
                                <TableCell className="hidden sm:table-cell">{student.clazz.name}</TableCell>
                                <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                                <TableCell className="hidden sm:table-cell">{student.phoneNumber}</TableCell>
                                <TableCell className="text-center font-medium">{student.dateOfBirth}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8"
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setOpen(true);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 6.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM12 20.25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Popup thông tin chi tiết */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thông tin sinh viên 5 tốt</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4">
                            <p><strong>MSSV:</strong> {selectedStudent.studentId}</p>
                            <p><strong>Họ và tên:</strong> {selectedStudent.studentName}</p>
                            <p><strong>Lớp:</strong> {selectedStudent.className}</p>
                            <p><strong>Email:</strong> {selectedStudent.email}</p>
                            <p><strong>Số điện thoại:</strong> {selectedStudent.phoneNumber}</p>
                            <p><strong>Tổng điểm PVCĐ:</strong> {selectedStudent.totalPoints}</p>
                        </div>
                    )}
                    <Button onClick={() => setOpen(false)} className="mt-4 w-full">Đóng</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ExcellentStudentsList;
