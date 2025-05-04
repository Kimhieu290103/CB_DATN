/* eslint-disable react/display-name */
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import PropTypes from 'prop-types';
import { isBefore } from "date-fns";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import CriteriaCheckboxItem from "@/components/items/checkbox/criteria-checkbox";

import URLS from "@/routes/urls";

import { useGetFalcutyCriteriaInSemesterQuery, useGetFalcutyCriteriaQuery, useGetSchoolCriteriaInSemesterQuery, useGetSchoolCriteriaQuery } from "@/api/rtkQuery/featureApi/criteriaApiSlice";
import { useGetAcademicYearsQuery, useGetEventByIdQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";
import { skipToken } from '@reduxjs/toolkit/query/react';

// eslint-disable-next-line no-unused-vars
const NewOrEditEvent = forwardRef(({ onHandleEventInParent }, ref) => {
    const { toast } = useToast();
    const location = useLocation();
    const role = useSelector((state) => state.auth.login.role);

    let eventID = useSelector((state) => state.events.eventID);
    const isEdit = useSelector((state) => state.events.isEdit);
    if (isEdit === false) {
        eventID = "";
    }
    const { data: event, refetch } = useGetEventByIdQuery(eventID || skipToken, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (location.pathname === URLS.EVENT_REGISTRATION) {
            refetch();
        }
    }, [location, refetch]);

    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [startRegTime, setStartRegTime] = useState();
    const [endRegTime, setEndRegTime] = useState();
    const [eventTitle, setEventTitle] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventContent, setEventContent] = useState("");
    const [eventCategory, setEventCategory] = useState(
        role === "LCD" ? "1" : ""
    );
    const [eventServePoint, setEventServePoint] = useState("");
    const [isLimitParticipants, setIsLimitParticipants] = useState(false);
    const [participantLimit, setParticipantLimit] = useState("");
    const [planDocumentLink, setPlanDocumentLink] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [falcultyCriteria, setFalcultyCriteria] = useState([]);
    const [universityCriteria, setUniversityCriteria] = useState([]);

    // const { data: falcutyCriteria } = useGetFalcutyCriteriaQuery();
    // const { data: schoolCriteria } = useGetSchoolCriteriaQuery();
    const { data: academicYears } = useGetAcademicYearsQuery();
    const { data: falcutyCriteria } = useGetFalcutyCriteriaInSemesterQuery(academicYear, {
        skip: !academicYear, // Không gọi API nếu chưa chọn năm học
    });
    
    const { data: schoolCriteria } = useGetSchoolCriteriaInSemesterQuery(academicYear, {
        skip: !academicYear,
    });
    // const { data: falcutyCriteria } = useGetFalcutyCriteriaInSemesterQuery(academicYear || skipToken);
    // const { data: schoolCriteria } = useGetSchoolCriteriaInSemesterQuery(academicYear || skipToken);

    // useEffect(() => {
    //     if (falcutyCriteria) {
    //         setFalcultyCriteria(falcutyCriteria.map(item => item.id));
    //     }
    //     if (schoolCriteria) {
    //         setUniversityCriteria(schoolCriteria.map(item => item.id));
    //     }
    // }, [falcutyCriteria, schoolCriteria]);

    useEffect(() => {
        if ( event) {
            setEventTitle(event.name || "");
            setEventLocation(event.location || "");
            setEventContent(event.description || "");
            setEventCategory(role === "LCD" ? "1" : "");
            setEventServePoint(event.score || "");
            setStartTime(event.date || "");
            setEndTime(event.endDate || "");
            setStartRegTime(event.registrationStartDate || "");
            setEndRegTime(event.registrationEndDate || "");
            setPlanDocumentLink(event.additionalInfo || "");
            setIsLimitParticipants(event.maxRegistrations !== -1);
            setParticipantLimit(event.maxRegistrations || "");
            setAcademicYear(event.semester.id || "");
    
            if (event?.eventCriteria?.eventCriteriaLcd) {
                const ids = event?.eventCriteria.eventCriteriaLcd.map((item) => item.id);
                setFalcultyCriteria(ids);
            }
    
            if (event?.eventCriteria?.eventCriteria) {
                const ids = event?.eventCriteria.eventCriteria.map((item) => item.id);
                setUniversityCriteria(ids);
            }
        }
    }, [falcutyCriteria, schoolCriteria, academicYears, event, role]);


    

    const handleFalcultyCriteria = (id, isChecked) => {
        setFalcultyCriteria((prev) => {
            if (isChecked) {
                return [...prev, id];
            } else {
                return prev.filter((item) => item !== id);
            }
        });
    };

    const handleUniversityCriteria = (id, isChecked) => {
        setUniversityCriteria((prev) => {
            if (isChecked) {
                return [...prev, id];
            } else {
                return prev.filter((item) => item !== id);
            }
        });
    };

    useImperativeHandle(ref, () => ({
        collectAndValidateData: () => {
            if (isBefore(new Date(endTime), new Date(startTime))) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Có gì đó sai sai.",
                    description: "Ngày kết thúc không thể trước ngày bắt đầu",
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                });
                return null;
            }

            if (!eventTitle) {
                toast({
                    variant: "destructive",
                    title: "Thiếu thông tin",
                    description: "Vui lòng nhập tên sự kiện",
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                });
                return null;
            }

            return {
                name: eventTitle,
                location: eventLocation,
                description: eventContent,
                eventType: eventCategory,
                score: eventServePoint,
                date: startTime,
                endDate: endTime,
                registrationStartDate: startRegTime,
                registrationEndDate: endRegTime,
                additionalInfo: planDocumentLink,
                maxRegistrations: isLimitParticipants ? participantLimit : -1,
                five_good_lcd_id: falcultyCriteria,
                five_good_id: universityCriteria,
                semester: academicYear,
            };
        }
    }));

    return ( 
        <>
        <div className="flex items-center gap-1 mt-8 mb-4">
            <span className="material-symbols-outlined text-main">info</span>
            <h3 className="font-bold font-inter text-lg text-main">Thông tin chung</h3>
        </div>

        <article className="space-y-4 md:w-2/3">
            <label className="form-control w-full max-w-3xl">
                <div className="label">
                    <span className="label-text">Tên sự kiện</span>
                </div>
                <input 
                    type="text" 
                    placeholder="Sự kiện..." 
                    className="input input-bordered w-full max-w-3xl rounded-md bg-white" 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                />
            </label>

            <label className="form-control w-full max-w-3xl">
                <div className="label">
                    <span className="label-text">Địa điểm diễn ra</span>
                </div>
                <input 
                    type="text" 
                    placeholder="Địa điểm..." 
                    className="input input-bordered w-full max-w-3xl rounded-md bg-white" 
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text ">Năm học</span>
                </div>
                <select  
                    className="select select-bordered rounded-md bg-white" 
                    value={academicYear} 
                    onChange={(e) => setAcademicYear(e.target.value)}
                >
                    <option value="">Chọn năm học...</option>
                    {academicYears?.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </label>
    
            <section className="flex flex-wrap md:flex-nowrap w-full max-w-3xl items-center gap-3">
                <label className="form-control w-full max-w-sm">
                    <div className="label">
                        <span className="label-text">Thời gian bắt đầu</span>
                    </div>
                    <input 
                        type="datetime-local" 
                        className="input input-bordered w-full max-w-sm rounded-md bg-white" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </label>
                <label className="form-control w-full max-w-sm">
                    <div className="label">
                        <span className="label-text">Thời gian kết thúc</span>
                    </div>
                    <input 
                        type="datetime-local" 
                        className="input input-bordered w-full max-w-sm rounded-md bg-white" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </label>
            </section>
    
            <section className="flex flex-wrap md:flex-nowrap w-full max-w-3xl items-center gap-3">
                <label className="form-control w-full max-w-sm">
                    <div className="label">
                        <span className="label-text">Thời gian bắt đầu đăng ký</span>
                    </div>
                    <input 
                        type="datetime-local" 
                        className="input input-bordered w-full max-w-sm rounded-md bg-white" 
                        value={startRegTime}
                        onChange={(e) => setStartRegTime(e.target.value)}
                    />
                </label>
                <label className="form-control w-full max-w-sm">
                    <div className="label">
                        <span className="label-text">Thời gian kết thúc đăng ký</span>
                    </div>
                    <input 
                        type="datetime-local" 
                        className="input input-bordered w-full max-w-sm rounded-md bg-white" 
                        value={endRegTime}
                        onChange={(e) => setEndRegTime(e.target.value)}
                    />                
                </label>
            </section>

            <label className="form-control w-full max-w-3xl">
                <div className="label">
                    <span className="label-text">Link bản kế hoạch</span>
                </div>
                <input 
                    type="text" 
                    placeholder="Link bản kế hoạch..." 
                    className="input input-bordered w-full max-w-3xl rounded-md bg-white" 
                    value={planDocumentLink}
                    onChange={(e) => setPlanDocumentLink(e.target.value)}
                />
            </label>
        </article>


        <Separator className="my-10" />

        <div className="flex items-center gap-1 mt-8 mb-4">
            <span className="material-symbols-outlined text-main">category</span>
            <h3 className="font-bold font-inter text-lg text-main">Danh mục & số lượng tham gia sự kiện</h3>
        </div>
        <article className="space-y-4 md:w-2/3">
            <label className="form-control w-full max-w-3xl  ">
                <div className="label">
                    <span className="label-text ">Danh mục sự kiện</span>
                </div>
                {
                    role === "LCD" ? (
                        <div className="input input-bordered rounded-md flex items-center bg-gray-100">
                            <span className="label-text">Hoạt động liên chi Đoàn</span>
                        </div>
                    ) : (
                        <select  
                            className="select select-bordered rounded-md bg-white" 
                            value={eventCategory} 
                            onChange={(e) => setEventCategory(e.target.value)}
                        >
                            <option value="">Chọn danh mục...</option>
                            <option value="2">Hoạt động truyền thống</option>
                            <option value="3">Hoạt động học thuật</option>
                        </select>
                    )
                    
                }
                
            </label>

            <label className="form-control w-4/12">
                <div className="label">
                    <span className="label-text">Điểm phục vụ cộng đồng</span>
                </div>
                <input 
                    type="text" 
                    className="input input-bordered rounded-md bg-white" 
                    value={eventServePoint}
                    onChange={(e) => setEventServePoint(e.target.value)}
                />
            </label>

            <section className="flex flex-wrap justify-between items-center max-w-lg">
                <div className="form-control w-fit my-4">
                    <label className="label cursor-pointer !bg-white">
                        <input 
                            type="checkbox" 
                            className="toggle toggle-info bg-gray-200 " 
                            checked={isLimitParticipants} 
                            onChange={(e) => setIsLimitParticipants(e.target.checked)} 
                        />
                        <span className="label-text ml-2">Giới hạn số lượng tham gia</span>
                    </label>
                </div>
    
                {isLimitParticipants && (
                    <label className="form-control max-w-xs bg-white">
                        <input 
                            type="text" 
                            placeholder="Số lượng"
                            className="input input-bordered max-w-xs rounded-md bg-white" 
                            value={participantLimit}
                            onChange={(e) => setParticipantLimit(e.target.value)}
                        />
                    </label>
                )}
            </section>
        </article>

        <Separator className="my-10" />

        <div className="flex items-center gap-1 mt-8 mb-4">
            <span className="material-symbols-outlined text-main">workspace_premium</span>
            <h3 className="font-bold font-inter text-lg text-main">Sinh viên 5 tốt</h3>
        </div>
        <article className="space-y-4 md:w-2/3">
            <div className="mb-10">
                <h4 className="font-semibold text-gray-600 mb-3">Sinh viên 5 tốt cấp khoa</h4>
                {falcutyCriteria?.map((item, index) => (
                    <CriteriaCheckboxItem 
                        key={item.id}
                        group="faculty" 
                        index={index}
                        className="space-x-2 mb-4"
                        label={item.name} 
                        description={item.description} 
                        value={item.id} 
                        isChecked={falcultyCriteria.includes(item.id)}
                        onCheckboxChange={handleFalcultyCriteria}
                    />
                ))}
            </div>

            <div>
                <h4 className="font-semibold text-gray-600 mb-3">Sinh viên 5 tốt cấp trường</h4>
                {schoolCriteria?.map((item, index) => (
                    <CriteriaCheckboxItem 
                        key={item.id} 
                        group="university"
                        className="space-x-2 mb-4"
                        index={index} 
                        label={item.name} 
                        description={item.description} 
                        value={item.id} 
                        isChecked={universityCriteria.includes(item.id)}
                        onCheckboxChange={handleUniversityCriteria}
                    />
                ))}
            </div>
        </article>

        
        <Separator className="my-10" />

        <div className="flex items-center gap-1 mt-8 mb-4">
            <span className="material-symbols-outlined text-main">newsmode</span>
            <h3 className="font-bold font-inter text-lg text-main bg-white">Nội dung</h3>
        </div>

        <textarea 
            className="textarea rounded-md focus:border-none focus:outline-none w-full md:min-h-96 bg-white" 
            placeholder="Soạn thảo nội dung ...."
            value={eventContent}
            onChange={(e) => setEventContent(e.target.value)}
        ></textarea>
        </>
     );
});

NewOrEditEvent.propTypes = {
    onHandleEventInParent: PropTypes.func.isRequired,
    handleFalcultyCriteria: PropTypes.func,
    handleUniversityCriteria: PropTypes.func,
};

export default NewOrEditEvent;