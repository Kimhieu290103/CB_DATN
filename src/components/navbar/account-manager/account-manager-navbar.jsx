import EventDetailNavbarItem from "../event-details-navbar/event-details-navbar-item";
import URLS from "@/routes/urls";

const AccountmanagerNavbar = () => {
    return ( 
        <ul className='flex flex-wrap mb-5'>
            {/* <EventDetailNavbarItem navigateTo={URLS.EVENT_DETAILS}>
                Tổng quan
            </EventDetailNavbarItem> */}

            <EventDetailNavbarItem navigateTo={URLS.ACCOUNT_SV}>
                Tài khoản sinh viên
            </EventDetailNavbarItem>
            
            <EventDetailNavbarItem  navigateTo={URLS.ACCOUNT_LCD}>
               Tài khoản liên chi đoàn
            </EventDetailNavbarItem>

            <EventDetailNavbarItem  navigateTo={URLS.ACCOUNT_ADMIN}>
               Tài khoản khác
            </EventDetailNavbarItem>
        </ul>
     );
}
 
export default AccountmanagerNavbar;