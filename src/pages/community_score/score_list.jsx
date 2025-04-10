import { useState } from "react";

import ScoreListFilterItem from "@/components/items/community-score/score-list-filter";
// import StudentJoinedListItem from "@/components/items/community-score/student-joined-list";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetCommunityScoreQuery } from "@/api/rtkQuery/featureApi/scoreApiSlice";


const CommunityScoreList = () => {
    const [filters, setFilters] = useState({
        departmentID: '',
        courseID: '',
        classID: '',
        semesterID: '',
    });

    const handleFilterResults = (filters) => {
        setFilters(filters);
    };

    const { data: scoreList } = useGetCommunityScoreQuery(filters, {refetchOnMountOrArgChange: true});

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [open, setOpen] = useState(false);
    return ( 
        <>
        <div className="flex flex-wrap justify-between items-center mb-8">
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

        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden sm:table-cell">MSSV</TableHead>
                    <TableHead className="w-[25rem]">Họ và tên</TableHead>
                    <TableHead className="hidden sm:table-cell">Lớp</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Số điện thoại</TableHead>
                    <TableHead className="text-center">Tổng điểm PVCĐ năm học</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {scoreList?.map((score, index) => (
                      
                    <TableRow key={index}>
                        <TableCell className="font-medium text-center hidden sm:table-cell">{score.studentId}</TableCell>
                        <TableCell>{score.studentName}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {score.className}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {score.email}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {score.phoneNumber}
                        </TableCell>
                        <TableCell className="text-center font-medium">{score.totalPoints}</TableCell>
                        {/* <TableCell className="text-right">
                            <StudentJoinedListItem />
                        </TableCell> */}
     <TableCell className="text-right">
    <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 flex items-center justify-center"
        onClick={() => { setSelectedStudent(score); setOpen(true); }}
    >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
            aria-hidden="true"
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
                      
                          
                ))}
                
            </TableBody>
            
        </Table>
       
            {/* Pop-up Chi Tiết */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thông tin sinh viên</DialogTitle>
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
}
 
export default CommunityScoreList;