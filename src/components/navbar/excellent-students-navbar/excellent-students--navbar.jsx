import EventDetailNavbarItem from "../event-details-navbar/event-details-navbar-item";
import URLS from "@/routes/urls";

const ExcellentStudentNavbar = () => {
    return ( 
        <ul className='flex flex-wrap mb-5'>
            {/* <EventDetailNavbarItem navigateTo={URLS.EVENT_DETAILS}>
                Tổng quan
            </EventDetailNavbarItem> */}

            <EventDetailNavbarItem navigateTo={URLS.STUDENT_CRITERIA}>
                Tiêu chí sinh viên 5 tốt
            </EventDetailNavbarItem>
            
            <EventDetailNavbarItem >
               Danh sách sinh viên 5 tốt
            </EventDetailNavbarItem>
        </ul>
     );
}
 
export default ExcellentStudentNavbar;