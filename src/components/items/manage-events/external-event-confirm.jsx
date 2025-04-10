import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from "@/components/ui/toast";
import UserDefaultAvatar from "@/assets/user-default-avt.jpg";

import { format } from "date-fns";
import PropTypes from 'prop-types';
import { useApprovedExternalEventMutation, useRejectedExternalEventMutation } from "@/api/rtkQuery/featureApi/eventApiSlice";

const ExternalEventConfirmItem = ({ event }) => {
    const { toast } = useToast();

    const [approveExternalEvent] = useApprovedExternalEventMutation();
    const handleApprove = (id) => {
        approveExternalEvent(id)
            .unwrap()
            .then(() => {
                toast({
                    title: "Thành công",
                    description: "Đã xác nhận hoạt động",
                });
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Có gì đó sai sai.",
                    description: error.data,
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                });
            });
    };

    const [rejectExternalEvent] = useRejectedExternalEventMutation();
    const handleReject = (id) => {
        rejectExternalEvent(id)
            .unwrap()
            .then(() => {
                toast({
                    title: "Thành công",
                    description: "Đã xác nhận hoạt động",
                });
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
        <Dialog>
            <DialogTrigger asChild>
                <span className="material-symbols-outlined cursor-pointer text-3xl">more_horiz</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chi tiết hoạt động</DialogTitle>
                </DialogHeader>

                <article>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={UserDefaultAvatar} />
                            <AvatarFallback>SV</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{event?.studentName}</h3>
                            <p className="text-sm text-slate-600">102210007</p>
                        </div>
                    </div>

                    <section className="space-y-4 mt-5">
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Lớp sinh hoạt:</p>
                            <p className="text-sm text-slate-600">{event?.clazz}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Sự kiện tham gia:</p>
                            <p className="text-sm text-slate-600">{event?.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Học kỳ:</p>
                            <p className="text-sm text-slate-600">{event?.semester}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Điểm hoạt động:</p>
                            <p className="badge text-sm bg-blue-300 text-main font-medium">{event?.points}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Thời gian nộp minh chứng:</p>
                            <p className="text-sm text-slate-600">{format(new Date(event.created_at), "HH:mm dd/MM/yyyy")}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Link minh chứng:</p>
                            <a href={event?.proofUrl} target="_blank" className="text-sm text-blue-600 underline">Mở link minh chứng</a>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Trạng thái:</p>
                            {event?.status === 'PENDING' ? (
                                <div className="badge bg-yellow-100 text-yellow-600 font-semibold py-3">Chờ xác nhận</div>
                            ) : event?.status === 'APPROVED' ? (
                                <div className="badge bg-green-200 text-green-800 font-semibold py-3">Đã xác nhận</div>
                            ) : (
                                <div className="badge bg-red-200 text-red-800 font-semibold py-3">Từ chối</div>
                            )}
                        </div>
                    </section >

                    <div className="flex justify-end mt-5">
                        <Button 
                            className="bg-red-600 hover:bg-red-700 text-white mr-4"
                            onClick={() => handleReject(event?.id)}
                        >
                            Xác nhận không tham gia
                        </Button>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleApprove(event?.id)}
                        >
                            Xác nhận tham gia
                        </Button>
                    </div>
                </article>
            </DialogContent>
        </Dialog>
     );
}
ExternalEventConfirmItem.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.number,
        studentName: PropTypes.string,
        clazz: PropTypes.string,
        name: PropTypes.string,
        semester: PropTypes.string,
        points: PropTypes.number,
        created_at: PropTypes.string,
        proofUrl: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
};

export default ExternalEventConfirmItem;