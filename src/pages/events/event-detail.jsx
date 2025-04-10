import { useEffect, useState, useRef } from "react";

// import { Button } from "@/components/ui/button";
import { eventStatus, formatDateTime } from "@/lib/utils";

import { useGetEventByIdQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import URLS from "@/routes/urls";

const EventDetail = () => {
    const location = useLocation();
    const eventID = useSelector((state) => state.events.eventID);
    const { data: event, refetch } = useGetEventByIdQuery(eventID, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (location.pathname === URLS.EVENT_DETAILS) {
            refetch();
        }
    }, [location, refetch]);

    const [eventContent, setEventContent] = useState("");
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = "auto";
            textarea.style.minHeight = `${textarea.scrollHeight}px`;
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (event?.description) {
            setEventContent(event.description);
            adjustHeight(); 
        }
    }, [event]);

    useEffect(() => {
        adjustHeight();
    }, [eventContent]);

    return ( 
        <>
        <div className="flex flex-wrap items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-700 mr-2">{event?.name}</h1>

            {eventStatus(event?.date, event?.endDate) === 'Sắp diễn ra' ? (
                <div className="badge bg-gray-400 text-white font-semibold py-3">Sắp diễn ra</div>
            ) : eventStatus(event?.date, event?.endDate) === 'Đã diễn ra' ? (
                <div className="badge bg-green-200 text-green-800 font-semibold py-3">Đã diễn ra</div>
            ) : (
                <div className="badge bg-blue-300 text-main font-semibold py-3">Đang diễn ra</div>
            )}
        </div>

        <div className="flex flex-wrap gap-6">
            <img 
                src={event?.eventImage[0].imageUrl}
                alt="event-img" 
                className="w-full md:w-3/5 h-full object-cover rounded-lg"
            />

            <div>
                <section className="mb-6 space-y-2">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-main">category</span>
                        <h3 className="font-bold font-inter text-lg text-main">Danh mục sự kiện</h3>
                    </div>
                    <div className="flex items-center gap-1 ml-7 mt-1">
                        <p className="font-bold font-inter text-sm text-slate-600">Loại hình:</p>
                        <p className="text-sm text-slate-600">{event?.eventType}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-7">
                        <p className="font-bold font-inter text-sm text-slate-600">Điểm phục vụ cộng đồng:</p>
                        <p className="text-sm text-slate-600">{event?.score}</p>
                    </div>
                </section>

                <section className="space-y-2">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-main">info</span>
                        <p className="font-bold font-inter text-lg text-main">Thông tin</p>
                    </div>
                    <div className="flex items-center gap-1 ml-7">
                        <p className="font-bold font-inter text-sm text-slate-600">Năm học:</p>
                        <p className="text-sm text-slate-600">{event?.semester.name}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-7 mt-1">
                        <p className="font-bold font-inter text-sm text-slate-600">Thời gian:</p>
                        <p className="text-sm text-slate-600">
                            {formatDateTime(event?.date)} - {formatDateTime(event?.endDate)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 ml-7">
                        <p className="font-bold font-inter text-sm text-slate-600">Thời gian đăng ký:</p>
                        <p className="text-sm text-slate-600">
                            {formatDateTime(event?.registrationStartDate)} - {formatDateTime(event?.registrationEndDate)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 ml-7">
                        <p className="font-bold font-inter text-sm text-slate-600">Địa điểm:</p>
                        <p className="text-sm text-slate-600">{event?.location}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-7">
                        <p className="font-bold font-inter text-sm text-slate-600">Số lượng tham gia tối đa:</p>
                        <p className="text-sm text-slate-600">
                            {event?.maxRegistrations === -1 ? "Không giới hạn" : event?.maxRegistrations}
                        </p>
                    </div>

                    <div className="flex items-center gap-1 ml-7">
                        <p className="font-bold font-inter text-sm text-slate-600">Bản kế hoạch:</p>
                        <a href={event?.additionalInfo} target="_blank" className="text-sm text-blue-600 underline">Link chi tiết</a>
                    </div>
                </section>

                {/* <Button className="mt-6">Đóng đơn đăng ký sớm</Button> */}
            </div>
        </div>

        <section className="mt-5">
            <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-main">workspace_premium</span>
                <h3 className="font-bold font-inter text-lg text-main">Sinh viên 5 tốt</h3>
            </div>

            {event?.eventCriteria?.eventCriteriaLcd && event?.eventCriteria?.eventCriteriaLcd.length > 0 && (
                <div className="ml-7">
                    <h3 className="font-semibold text-gray-500">Cấp khoa</h3>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                        {event?.eventCriteria?.eventCriteriaLcd.map((criteria, index) => (
                            <div key={index} className="badge bg-blue-300 text-main font-semibold py-3">{criteria.name}</div>
                        ))}
                    </div>
                </div>
            )}

            {event?.eventCriteria?.eventCriteria && event?.eventCriteria?.eventCriteria.length > 0 && (
                <div className="ml-7 mt-5">
                    <h3 className="font-semibold text-gray-500">Cấp trường</h3>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                        {event?.eventCriteria?.eventCriteria.map((criteria, index) => (
                            <div key={index} className="badge bg-green-200 text-green-800 font-semibold py-3">{criteria.name}</div>
                        ))}
                    </div>
                </div>
            )}

        </section>

        <section className="mt-5 space-y-2">
            <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-main">newsmode</span>
                <h3 className="font-bold font-inter text-lg text-main">Nội dung</h3>
            </div>

            <textarea
                ref={textareaRef}
                className=" bg-white focus:border-none focus:outline-none w-full resize-none overflow-hidden"
                value={eventContent}
                onChange={(e) => setEventContent(e.target.value)}
                onInput={adjustHeight}
                style={{ minHeight: 'inherit' }} 
                disabled
            ></textarea>
        </section>
        </>
     );
}
 
export default EventDetail;