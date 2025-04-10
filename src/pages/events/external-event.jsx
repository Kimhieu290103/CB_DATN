import { useGetExternalEventsQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";
import ExternalEventConfirmItem from "@/components/items/manage-events/external-event-confirm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { format } from "date-fns";

const ExternalEvent = () => {
    const { data: externalEvents } = useGetExternalEventsQuery();
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

                {/* <ScoreListFilterItem /> */}
            </div>

        </div>

        {externalEvents && externalEvents.length !== 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden sm:table-cell">MSSV</TableHead>
                        <TableHead className="w-[15rem]">Họ và tên</TableHead>
                        <TableHead className="hidden sm:table-cell">Lớp</TableHead>
                        <TableHead className="w-72 hidden sm:table-cell">Sự kiện tham gia</TableHead>
                        <TableHead className="hidden sm:table-cell">Ngày đăng tải</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {externalEvents.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium text-center hidden sm:table-cell">102200007</TableCell>
                            <TableCell>{event?.studentName}</TableCell>
                            <TableCell className="hidden sm:table-cell">{event?.clazz}</TableCell>
                            <TableCell className="hidden sm:table-cell">{event?.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {format(new Date(event.created_at), "HH:mm dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="text-center">
                                {event?.status === 'PENDING' ? (
                                    <div className="badge bg-yellow-100 text-yellow-600 font-semibold py-3">Chờ xác nhận</div>
                                ) : event?.status === 'APPROVED' ? (
                                    <div className="badge bg-green-200 text-green-800 font-semibold py-3">Đã xác nhận</div>
                                ) : (
                                    <div className="badge bg-red-200 text-red-800 font-semibold py-3">Từ chối</div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <ExternalEventConfirmItem event={event} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                
            </Table>
        ) : (
            <div className="flex flex-col justify-center items-center h-40 my-20">
                <span className="material-symbols-outlined text-9xl text-gray-400">rule</span>
                <p className="font-semibold text-xl text-gray-400">Không có yêu cầu xác nhận sự kiện ngoài nào</p>
            </div>
        )}
        </>
     );
}
 
export default ExternalEvent;