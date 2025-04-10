import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
  
import UserDefaultAvatar from "@/assets/user-default-avt.jpg";

const StudentJoinedListItem = () => {
    return ( 
        <Dialog>
            <DialogTrigger asChild>
                <span className="material-symbols-outlined cursor-pointer">view_list</span>
            </DialogTrigger>
            <DialogContent className="min-w-[60rem] h-5/6">
                <DialogHeader>
                    <DialogTitle>Các hoạt động đã tham gia</DialogTitle>
                </DialogHeader>

                <article >
                    <div className="flex items-center gap-2 mb-5">
                        <Avatar>
                            <AvatarImage src={UserDefaultAvatar} />
                            <AvatarFallback>SV</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">Nguyễn Vương Quốc Trường Thọ</h3>
                            <p className="text-sm text-slate-600">102210007</p>
                        </div>
                    </div>

                    <section className="w-full h-4/6 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30rem]">Sự kiện</TableHead>
                                    <TableHead>Thời gian diễn ra</TableHead>
                                    <TableHead>Thời gian check-in</TableHead>
                                    <TableHead className="text-right">Điểm PVCĐ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({length: 7}).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">Chào đón tân sinh viên khóa K2025</TableCell>
                                        <TableCell>7:00 17/09/2025 - 16:00 20/09/2025</TableCell>
                                        <TableCell>7:00 17/09/2025 - 16:00 20/09/2025</TableCell>
                                        <TableCell className="text-right font-semibold">15</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>            
                </article>
            </DialogContent>
        </Dialog>
     );
}
 
export default StudentJoinedListItem;