import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    
    const logoutHandler = () => {
        dispatch(logout());
        navigateTo('/');
    }

    return ( 
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
                path === URLS.EXCELLENT_STUDENTS ? 'Sinh viên 5 tốt' : ''}
            </h1>

            <DropdownMenu>
                <DropdownMenuTrigger className="ml-5">
                    <Avatar>
                        <AvatarImage src={UserDefaultAvatar} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
     );
}
 
export default Navbar;