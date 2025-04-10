import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const SideBarItem = ({ navigateTo, children }) => {
    return ( 
        <div className="pb-5">
            <Link
                className={(window.location.href.indexOf(navigateTo) !== -1) 
                    ? "text-blue-500 hover:text-blue-600" 
                    : "text-gray-500 hover:text-gray-600"}
                to={navigateTo}>

            <div className="text-sm font-bold">
                {children}
            </div>
            </Link>
        </div>
     );
}
SideBarItem.propTypes = {
    navigateTo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default SideBarItem;