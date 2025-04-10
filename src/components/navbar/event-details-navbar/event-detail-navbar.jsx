import EventDetailNavbarItem from '@/components/navbar/event-details-navbar/event-details-navbar-item';
import URLS from '@/routes/urls';

const EventDetailNavbar = () => {
    return ( 
        <div>
            <ul className='flex flex-wrap mb-5'>
                <EventDetailNavbarItem navigateTo={URLS.EVENT_DETAILS}>
                    Tổng quan
                </EventDetailNavbarItem>

                <EventDetailNavbarItem navigateTo={URLS.EVENT_REGISTRATION}>
                    Đơn đăng ký
                </EventDetailNavbarItem>

                <EventDetailNavbarItem navigateTo={URLS.JOINED_EVENTS}>
                    Xác nhận đã tham gia
                </EventDetailNavbarItem>
            </ul>
        </div>
     );
}
 
export default EventDetailNavbar;