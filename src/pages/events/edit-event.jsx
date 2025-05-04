import { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from "@/components/ui/toast";

import UploadImageItem from "@/components/items/file-media/upload-image";
import NewOrEditEvent from "@/components/cards/manage-events/new-or-edit-event";
import URLS from "@/routes/urls";

import { useSelector } from "react-redux";
import { useEditEventMutation, useGetEventByIdQuery,useUploadEventImageMutation } from "@/api/rtkQuery/featureApi/eventApiSlice";

const EditEvent = () => {
    const { toast } = useToast();
    const navigateTo = useNavigate();
    const newOrEditEventRef = useRef(null);
    const [eventPanel, setEventPanel] = useState(null); // mặc định là null
    const [uploadEventImage] = useUploadEventImageMutation();

    const eventID = useSelector((state) => state.events.eventID);
    const { data: event } = useGetEventByIdQuery(eventID);

    const handleGetImage = (image) => {
        setEventPanel(image);
    }

    const [editEvent, { isLoading }] = useEditEventMutation();
    const handleSubmit = async () => {
        if (newOrEditEventRef.current) {
            const eventData = newOrEditEventRef.current.collectAndValidateData();
            if (eventData) {
                console.log("Dữ liệu gửi lên server:", eventData);
            }

            if (!eventData) return; 
    
            const formData = new FormData();
            // Nếu ảnh mới được chọn, upload ảnh
            if (eventPanel) {
                const imageFormData = new FormData();
                imageFormData.append("files", eventPanel); // Thêm ảnh vào formData
                await uploadEventImage({ eventId: eventID, imageData: imageFormData }).unwrap();
            }


            formData.append("files", eventPanel);
            Object.keys(eventData).forEach(key => {
                if (eventData[key] !== null) {
                    formData.append(key, eventData[key]);
                }
            });

            await editEvent({ eventId: eventID, formData: formData })
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
                        description: error.mess,
                        action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                    });
                });
        }
    };
    return ( 
        <>
        <h1 className="text-3xl font-bold text-gray-700">Cập nhật sự kiện</h1>

        <NewOrEditEvent 
            ref={newOrEditEventRef} 
            onHandleEventInParent={() => {}} 
            event={event}
        />

        <Separator className="my-10" />

        <div className="flex items-center gap-1 mt-8 mb-4">
            <span className="material-symbols-outlined text-main">wallpaper</span>
            <h3 className="font-bold font-inter text-lg text-main">Ảnh bìa</h3>
        </div>

        {event && (
    <UploadImageItem 
        getImages={handleGetImage} 
        defaultImageUrl={event?.eventImage?.[0]?.imageUrl}
    />
)}


        {isLoading 
            ? <Button className='mt-8bg-main-hover float-end' disabled>
                Đang cập nhật
                <span className="loading loading-dots loading-md ml-2"></span>
            </Button>
            : <Button className="mt-8 bg-main hover:bg-main-hover float-end" onClick={handleSubmit}>Cập nhật sự kiện</Button>
        }
        </>
    );
}
 
export default EditEvent;