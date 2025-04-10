import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

import UserDefaultAvatar from "@/assets/user-default-avt.jpg";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useApprovedStudentMutation } from "@/api/rtkQuery/featureApi/eventApiSlice";

const JoinedConfirmForEachStudentItem = ({ student }) => {
    const { toast } = useToast();
    const eventID = useSelector((state) => state.events.eventID);

    const [approvedStudent] = useApprovedStudentMutation();
    const handleConfirm = (id) => {
        approvedStudent({studentID: id, eventID: eventID})
            .unwrap()
            .then(() => {
                console.log('Xác nhận tham gia cho sinh viên:', id);
            })
            .catch((error) => {
                console.log('Error:', error);
                toast({
                    variant: "destructive",
                    duration: 2000,
                    title: "Uh oh! Có gì đó sai sai.",
                    description: error.data.mess,
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
                    <DialogTitle>Chi tiết tham gia</DialogTitle>
                </DialogHeader>

                <article>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={UserDefaultAvatar} />
                            <AvatarFallback>SV</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{student.fullname}</h3>
                            <p className="text-sm text-slate-600">{student.studentId}</p>
                        </div>
                    </div>

                    <section className="space-y-4 mt-5">
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Lớp sinh hoạt:</p>
                            <p className="text-sm text-slate-600">{student.clazz}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Khoa:</p>
                            <p className="text-sm text-slate-600">{student.department}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Email:</p>
                            <p className="text-sm text-slate-600">{student.email}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold font-inter text-sm text-slate-600">Trạng thái:</p>
                            {student.attendances === false ? (
                                <div className="badge bg-yellow-100 text-yellow-600 font-semibold py-3">Chờ xác nhận</div>
                            ) : (
                                <div className="badge bg-green-100 text-green-600 font-semibold py-3">Đã tham gia</div>
                            )}
                        </div>

                    </section >

                    {student.attendances === false && (
                        <div className="flex justify-end mt-5">
                            {/* <Button className="bg-red-600 hover:bg-red-700 text-white mr-4">Xác nhận không tham gia</Button> */}
                            <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleConfirm(student.id)}
                            >
                                Xác nhận tham gia
                            </Button>
                        </div>
                    )}

                </article>
            </DialogContent>
        </Dialog>
     );
}
JoinedConfirmForEachStudentItem.propTypes = {
    student: PropTypes.shape({
        id: PropTypes.string.isRequired,
        studentId: PropTypes.string.isRequired,
        fullname: PropTypes.string.isRequired,
        clazz: PropTypes.string.isRequired,
        department: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        attendances: PropTypes.bool.isRequired,
    }).isRequired,
};

export default JoinedConfirmForEachStudentItem;