import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const EventDetailNavbarItem = ({ navigateTo, children }) => {
    return ( 
        <div className="mb-2 mr-5">
            <Link
                className={(window.location.href.indexOf(navigateTo) !== -1) 
                    ? "text-blue-500 hover:text-blue-600 font-semibold pb-2 border-b-2 border-blue-500" 
                    : "text-gray-500 hover:text-gray-600 font-semibold"}
                to={navigateTo}>

                {children}
            </Link>
        </div>
     );
}
EventDetailNavbarItem.propTypes = {
    navigateTo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default EventDetailNavbarItem;