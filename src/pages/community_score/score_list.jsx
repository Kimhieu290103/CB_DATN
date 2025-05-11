import { useState, useEffect } from "react";
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
import { useGetCommunityScoreQuery, useGetAttendedRegistrationsQuery } from "@/api/rtkQuery/featureApi/scoreApiSlice";
import { useGetExternalEventsByStatusQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";
import { format } from 'date-fns';

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

    const { data: scoreList } = useGetCommunityScoreQuery(filters, { refetchOnMountOrArgChange: true });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [open, setOpen] = useState(false);

    const { data: registrations, isLoading: isLoadingRegistrations } = useGetAttendedRegistrationsQuery(
        selectedStudent ? { semesterId: filters.semesterID, userId: selectedStudent.id } : {},
        { skip: !selectedStudent }
    );
    // Lấy dữ liệu sự kiện ngoài khi đã chọn sinh viên
    const { data: externalEvents, isLoading: isLoadingExternalEvents } = useGetExternalEventsByStatusQuery(
        selectedStudent ? { userId: selectedStudent.id, semesterId: filters.semesterID } : {},
        { skip: !selectedStudent }
    );

    useEffect(() => {
        console.log("Registrations data:", registrations);
    }, [registrations]);

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

            <Dialog open={selectedStudent !== null} onOpenChange={() => setSelectedStudent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">Thông tin sự kiện</DialogTitle>
                    </DialogHeader>
                      <h3 className="text-lg font-semibold">Danh sách sự kiện trong trường</h3>
                    {isLoadingRegistrations ? (
                        <p>Đang tải thông tin sự kiện...</p>
                    ) : (
                        registrations && registrations.length > 0 ? (
                            <div className="max-h-[200px] overflow-y-auto">
                            <Table className="table-fixed w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[12rem] truncate">Tên sự kiện</TableHead>
                                        <TableHead>Ngày diễn đầu</TableHead>
                                        {/* <TableHead>Ngày kết thúc</TableHead> */}
                                        <TableHead>Số điểm</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrations.map((registration) => (
                                        <TableRow key={registration.id}>
                                            <TableCell >{registration.name}</TableCell>
                                            <TableCell  className="whitespace-nowrap">{format(new Date(registration.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                            {/* <TableCell>{format(new Date(registration.endDate), 'dd/MM/yyyy HH:mm')}</TableCell> */}
                                            <TableCell>{registration.score}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        ) : (
                            <p>Không có sự kiện nào tham gia.</p>
                        )
                    )}
                     <h3 className="text-lg font-semibold">Danh sách sự kiện ngoài trường</h3>
                    {isLoadingExternalEvents ? (
                        <p>Đang tải thông tin sự kiện ngoài...</p>
                    ) : (
                        externalEvents && externalEvents.length > 0 ? (
                              <div className="max-h-[200px] overflow-y-auto">
                            <Table className="table-fixed w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[12rem] truncate">Tên sự kiện</TableHead>
                                         <TableHead>Ngày diễn ra</TableHead> {/* Sửa lại thành "Ngày diễn ra" thay vì "Ngày bắt đầu" */}
                                        <TableHead>Số điểm</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {externalEvents.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell className="truncate overflow-hidden whitespace-nowrap">{event.name}</TableCell>
                                            <TableCell  className="whitespace-nowrap">{format(new Date(event.date), 'dd/MM/yyyy HH:mm')}</TableCell>{/* Sử dụng event.date thay vì startDate */}
                                            <TableCell>{event.points}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        ) : (
                            <p>Không có sự kiện ngoài nào tham gia.</p>
                        )
                    )}
                    <Button onClick={() => setSelectedStudent(null)} className="btn bg-[rgb(10_103_175)] hover:bg-[rgb(8_82_139)] text-white">Đóng</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CommunityScoreList;