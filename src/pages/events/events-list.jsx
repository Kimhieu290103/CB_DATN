import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from "@/components/ui/toast";
    
import URLS from "@/routes/urls";
import EventFilter from "@/components/items/manage-events/events-filter";

import { useState } from "react";
import { useGetAllMyEventsQuery, useRemoveEventMutation } from "@/api/rtkQuery/featureApi/eventApiSlice";

import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch } from 'react-redux';
import { getEventID, getEventName } from "@/redux/reducer/events.reducer";
import { eventStatus } from "@/lib/utils";
import PaginationItem from "@/components/items/pagination/pagination";

const EventsList = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePageInParent = (e) => {
        setPage(e.selected + 1);
    };

    const handleChangeRowsPerPageInParent = (rows) => {
        setRowsPerPage(rows);
    };

    const { data: eventsData } = useGetAllMyEventsQuery({page, rowsPerPage}, {refetchOnMountOrArgChange: true});

    const handleEventDetail = (id, eventName) => {
        dispatch(getEventID({ id, isEdit: false }));
        dispatch(getEventName(eventName));
        navigateTo(URLS.EVENT_DETAILS);
    };

    const handleEventRegistration = (id, eventName) => {
        dispatch(getEventID({ id, isEdit: false }));
        dispatch(getEventName(eventName));
        navigateTo(URLS.EVENT_REGISTRATION);
    };

    const handleConfirmJoined = (id, eventName) => {
        dispatch(getEventID({ id, isEdit: false }));
        dispatch(getEventName(eventName));
        navigateTo(URLS.JOINED_EVENTS);
    };

    const handleEventEdit = (id) => {
        dispatch(getEventID({ id, isEdit: true }));
        navigateTo(URLS.EDIT_EVENT);
    };

    const handleNewEvent = () => {
        navigateTo(URLS.NEW_EVENT);
        dispatch(getEventID({ id: null, isEdit: false }));
    };
    
    const [ removeEvent ] = useRemoveEventMutation();
    const handleRemoveEvent = (id) => {
        removeEvent(id)
            .unwrap()
            .then((res) => {
                toast({
                    title: "Thành công",
                    description: res.mess,
                });
                navigateTo(URLS.MANAGE_EVENTS);
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Có gì đó sai sai.",
                    description: error.data,
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                });
            });
    }

    return ( 
        <>
        <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="flex items-center gap-4 mb-2">
                <label className="input input-bordered flex items-center gap-2 h-10">
                    <input type="text" className="grow" placeholder="Tìm kiếm sự kiện ...." />
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

                <EventFilter />
            </div>

            <button onClick={handleNewEvent} className="btn bg-main hover:bg-main-hover text-white">
                <span className="material-symbols-outlined">add</span>
                Tạo sự kiện
            </button>
        </div>
        {eventsData?.events && eventsData?.events.length !== 0 ? (
        <section>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-3 hidden sm:table-cell">STT</TableHead>
                        <TableHead className="w-[20rem]">Tên sự kiện</TableHead>
                        <TableHead className="hidden sm:table-cell">Thời gian diễn ra</TableHead>
                        <TableHead className="hidden sm:table-cell">Thời gian đăng ký</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {eventsData?.events?.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium text-center hidden sm:table-cell">{index + 1}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {format(new Date(event.date), "HH:mm dd/MM/yyyy")} - {format(new Date(event.endDate), "HH:mm dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {format(new Date(event.registrationStartDate), "HH:mm dd/MM/yyyy")} - {format(new Date(event.registrationEndDate), "HH:mm dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="text-center">
                                {eventStatus(event.date, event.endDate) === 'Sắp diễn ra' ? (
                                    <div className="badge bg-gray-400 text-white font-semibold py-3">Sắp diễn ra</div>
                                ) : eventStatus(event.date, event.endDate) === 'Đã diễn ra' ? (
                                    <div className="badge bg-green-200 text-green-800 font-semibold py-3">Đã diễn ra</div>
                                ) : (
                                    <div className="badge bg-blue-300 text-main font-semibold py-3">Đang diễn ra</div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <span className="material-symbols-outlined cursor-pointer">more_vert</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEventDetail(event?.id, event?.name)}>Chi tiết</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEventEdit(event?.id)}>Chỉnh sửa sự kiện</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEventRegistration(event?.id, event?.name)}>Danh sách đăng ký</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleConfirmJoined(event?.id, event?.name)}>Xác nhận tham gia</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleRemoveEvent(event?.id)} className="text-red-700">Hủy sự kiện</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                
            </Table>
            <div className="w-full my-4 px-4 flex justify-end items-center">
                <PaginationItem 
                    totalPages={eventsData?.totalPage} 
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePageInParent} 
                    handleChangeRowsPerPage={handleChangeRowsPerPageInParent}
                />
            </div>
        </section>
        ) : (
            <div className="flex flex-col justify-center items-center h-40 my-20">
                <span className="material-symbols-outlined text-9xl text-gray-400">news</span>
                <p className="font-semibold text-xl text-gray-400">Bạn chưa tạo sự kiện nào</p>
            </div>
        )}
        
        </>
     );
}
 
export default EventsList;