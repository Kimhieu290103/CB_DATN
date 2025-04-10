import PropTypes from 'prop-types';
import authImage from "@/assets/Bg-DUT.jpg"
import { Toaster } from "@/components/ui/toaster"

const LoginLayout = ({ children }) => {
    return ( 
        <div className="flex justify-center md:items-center min-h-screen px-3 md:px-0">
            <div className="md:h-[43.75rem] md:w-[75rem] w-full flex justify-around md:items-center">
                <img className="hidden md:block md:w-[35rem] h-full object-cover bg-center rounded-3xl" src={authImage} alt="auth_image" />
                <div className="md:w-[28rem] w-full">
                    {children}
                </div>
                <Toaster />
            </div>
        </div>
     );
}

LoginLayout.propTypes = {
    children: PropTypes.node.isRequired,
  };
export default LoginLayout;