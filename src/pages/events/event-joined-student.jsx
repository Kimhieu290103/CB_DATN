import { useState } from "react";

import JoinedConfirmItem from "@/components/items/manage-events/joined-confirm";
import JoinedConfirmForEachStudentItem from "@/components/items/manage-events/joined-confirm-for-each-student";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useSelector } from "react-redux";
import { useGetEventRegistrationQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";


const EventJoinedStudent = () => {
    const eventID = useSelector((state) => state.events.eventID);
    const { data: registrationList } = useGetEventRegistrationQuery(eventID);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedStudents((prevSelectedStudents) => {
            if (checked) {
                return [...prevSelectedStudents, value];
            } else {
                return prevSelectedStudents.filter((studentId) => studentId !== value);
            }
        });
    };

    return ( 
        <>
        <div className="flex flex-wrap justify-between items-center mb-8">
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

            <div className="flex items-center gap-4 mb-2">
                <JoinedConfirmItem studentIds={selectedStudents} />
            </div>
        </div>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1 hidden sm:table-cell"></TableHead>
                    <TableHead className="w-3 hidden sm:table-cell">MSSV</TableHead>
                    <TableHead className="w-[20rem]">Họ và tên</TableHead>
                    <TableHead className="hidden sm:table-cell">Lớp sinh hoạt</TableHead>
                    <TableHead className="w-[20rem] hidden sm:table-cell">Khoa</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {registrationList?.users.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell className="hidden sm:table-cell">
                            <input 
                                type="checkbox" 
                                className="checkbox" 
                                value={student.id} 
                                onChange={handleCheckboxChange}
                            />
                        </TableCell>
                        <TableCell className="font-medium text-center hidden sm:table-cell">{student.studentId}</TableCell>
                        <TableCell>{student.fullname}</TableCell>
                        <TableCell className="hidden sm:table-cell">{student.clazz}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {student.department}
                        </TableCell>
                        <TableCell className="text-center">
                            {student.attendances === false ? (
                                <div className="badge bg-yellow-100 text-yellow-600 font-semibold py-3">Chờ xác nhận</div>
                            ) : (
                                <div className="badge bg-green-100 text-green-600 font-semibold py-3">Đã tham gia</div>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <JoinedConfirmForEachStudentItem student={student} />
                        </TableCell>
                    </TableRow>
                ))}
                
            </TableBody>
        </Table>
        </>
     );
}
 
export default EventJoinedStudent;