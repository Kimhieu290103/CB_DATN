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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
    
import URLS from "@/routes/urls";
import EventFilter from "@/components/items/manage-events/events-filter";

import { useState,useEffect } from "react";
import { useGetAllEventsQuery,useGetEventsByNameQuery  } from "@/api/rtkQuery/featureApi/eventApiSlice";

import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch } from 'react-redux';
import { getEventID, getEventName } from "@/redux/reducer/events.reducer";
import { eventStatus } from "@/lib/utils";
import PaginationItem from "@/components/items/pagination/pagination";
const AllEvents = () => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim());
        }, 300); // debounce 300ms
        return () => clearTimeout(handler);
    }, [searchTerm]);
    
    const handleChangePageInParent = (e) => {
        setPage(e.selected );
    };

    const handleChangeRowsPerPageInParent = (rows) => {
        setRowsPerPage(rows);
    };

    // const { data: eventsData } = useGetAllEventsQuery({page, rowsPerPage}, {refetchOnMountOrArgChange: true});
    const { data: allEventsData } = useGetAllEventsQuery({ page, rowsPerPage }, { refetchOnMountOrArgChange: true });
    const { data: searchResultsData } = useGetEventsByNameQuery(debouncedSearchTerm, { skip: !debouncedSearchTerm, refetchOnMountOrArgChange: true });
   // Xác định dữ liệu sự kiện sẽ hiển thị
   const eventsData = debouncedSearchTerm ? searchResultsData : allEventsData;
   const events = eventsData?.events || eventsData; // Handle both structures
   const totalPage = allEventsData?.totalPage;
    const handleEventDetail = (id, eventName) => {
        dispatch(getEventID({ id, isEdit: false }));
        dispatch(getEventName(eventName));
        navigateTo(URLS.ALL_EVENTS_DETAILS);
    };

    const handleEventRegistration = (id, eventName) => {
        dispatch(getEventID({ id, isEdit: false }));
        dispatch(getEventName(eventName));
        navigateTo(URLS.ALL_EVENTS_REGISTRATION);
    };   
  
    return ( 
        <>
        <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="flex items-center gap-4 mb-2">
                <label className="input input-bordered flex items-center gap-2 h-10">
                   
                        <input
                            type="text"
                            className="grow"
                            placeholder="Tìm kiếm sự kiện ...."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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

        </div>
        {events && events.length !== 0 ? (
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
                    {events?.map((event, index) => (
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
                                        <DropdownMenuItem onClick={() => handleEventRegistration(event?.id, event?.name)}>Danh sách đăng ký</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                
            </Table>
            {!debouncedSearchTerm && totalPage && (
                        <div className="w-full my-4 px-4 flex justify-end items-center">
                            <PaginationItem
                                totalPages={totalPage}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePageInParent}
                                handleChangeRowsPerPage={handleChangeRowsPerPageInParent}
                            />
                        </div>
                    )}
        </section>
        ) : (
            <div className="flex flex-col justify-center items-center h-40 my-20">
                <span className="material-symbols-outlined text-9xl text-gray-400">news</span>
                <p className="font-semibold text-xl text-gray-400">Không có sự kiện nào</p>
            </div>
        )}
        
        </>
     );
}
 
export default AllEvents;