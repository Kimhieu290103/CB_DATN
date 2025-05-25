import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import UserInfoDialog from "@/components/ui/profile";
import ChangePasswordDialog from  "@/components/ui/change-pass";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import UserDefaultAvatar from "@/assets/user-default-avt.jpg";


import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "@/redux/reducer/auth.reducer";
import URLS from "@/routes/urls";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const user = useSelector(state => state.auth.login.user);
    const path = window.location.pathname;
    const [openPopover, setOpenPopover] = useState(false);
    const logoutHandler = () => {
        dispatch(logout());
        navigateTo('/');
    }
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [previousFocus, setPreviousFocus] = useState(null);

    const handleOpenUserInfo = () => {
        setPreviousFocus(document.activeElement); // Save the current focused element
        setShowUserInfo(true);
    };
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const handleOpenChangePassword = () => {
        setOpenChangePassword(true);
        setOpenPopover(false);
    };
    const handleCloseChangePassword = () => {
        setOpenChangePassword(false);
    };

    return ( 
        <>
        <nav className="flex flex-wrap justify-between items-center px-5 md:px-12 bg-main h-16">
            <h1 className="uppercase font-semibold text-sm text-white">
                {path === URLS.MANAGE_EVENTS || 
                path === URLS.EVENT_DETAILS || 
                path === URLS.EVENT_REGISTRATION ||
                path === URLS.JOINED_EVENTS ? 'Quản lý sự kiện' : 
                path === URLS.ALL_EVENTS ||
                path === URLS.ALL_EVENTS_DETAILS ||
                path === URLS.ALL_EVENTS_REGISTRATION ? 'Tất cả sự kiện' :
                path === URLS.EXTERNAL_ACTIVITIES ? 'Hoạt động khác' :
                path === URLS.COMMUNITY_SCORE ? 'Quản lý điểm PVCĐ' :
                path === URLS.EXCELLENT_STUDENTS ? 'Sinh viên 5 tốt' : 
                path === URLS.EXCELLENT_STUDENTS_NAV ? 'Sinh viên 5 tốt' :
                path === URLS.STUDENT_CRITERIA ? 'Tiêu chí hoạt động và sinh viên 5 tốt' :
                path === URLS.EXCELLENT_LCD ? 'Liên chi đoàn tốt':
                path === URLS.ACCOUNT_MANAGEMENT ? 'Quản lí tài khoản':
                path === URLS.ACCOUNT_LCD ? 'Danh sách tài khoản liên chi đoàn':
                path === URLS.ACCOUNT_SV ? 'Danh sách tài khoản sinh viên':
                path === URLS.ACCOUNT_ADMIN ? 'Danh sách tài khoản hội đồng':
                path === URLS.CLASS_MANAGEMENT ? 'Danh sách lớp học'
                 :''}
            </h1>

            <Popover open={openPopover} onOpenChange={setOpenPopover} modal={false} align="start" sideOffset={-20}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="p-0 ml-5">
                            <Avatar>
                                <AvatarImage src={UserDefaultAvatar} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 rounded-md shadow-md bg-popover text-popover-foreground leading-snug">
                        <div className="flex flex-col space-y-2">
                            <div className="px-4 py-1.5 font-semibold">{user?.fullname}</div>
                            <div className="h-px bg-border" />
                            <Button variant="ghost" className="justify-start hover:bg-secondary hover:text-secondary-foreground" onClick={handleOpenUserInfo}>
                                Thông tin cá nhân
                            </Button>
                            <Button variant="ghost" className="justify-start hover:bg-secondary hover:text-secondary-foreground"onClick={handleOpenChangePassword}>
                                Đổi mật khẩu
                            </Button>
                            <div className="h-px bg-border" />
                                <Button variant="ghost" className="justify-start hover:bg-secondary hover:text-secondary-foreground text-red-600 hover:text-red-700" onClick={logoutHandler}>
                                    Đăng xuất
                                </Button>
                        </div>
                    </PopoverContent>
                </Popover>
        </nav>
         {/* Hiển thị Modal */}
         <UserInfoDialog open={showUserInfo} onOpenChange={setShowUserInfo} previousFocus={previousFocus} />
         <ChangePasswordDialog // Render component đổi mật khẩu
                open={openChangePassword}
                onOpenChange={handleCloseChangePassword}
            />
        </>
     );
}
 
export default Navbar;