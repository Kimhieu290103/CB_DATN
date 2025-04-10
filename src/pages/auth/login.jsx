import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import logo from "@/assets/logo-DUT.jpg"

import { Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/api/rtkQuery/featureApi/authApiSlice';
import { setCredentials } from '@/redux/reducer/auth.reducer';
import { useToast } from '@/components/ui/use-toast';
import URLS from '@/routes/urls';


const LoginPage = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const [login, {isLoading}] = useLoginMutation();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Băt buộc nhập'),
            password: Yup.string().required('Bắt buộc nhập')
        }),
        onSubmit: async (values) => {
            await login(values)
            .unwrap()
            .then((res) => {
                dispatch(setCredentials(res));
                navigateTo(URLS.MANAGE_EVENTS);     
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Có gì đó sai sai.",
                    description: error.data,
                    action: <ToastAction altText="Try again">Thử lại</ToastAction>,
                })
            });  
        }
            
    });

    return ( 
        <div>
            <header className='flex my-4 md:hidden'>
                <img src={logo} className='size-9 mr-2' alt="DUT-logo" />
                <div>
                    <p className='text-[0.5rem] font-medium font-inter'>ĐẠI HỌC ĐÀ NẴNG</p>
                    <p className='font-bold text-[0.6rem]'>TRƯỜNG ĐẠI HỌC BÁCH KHOA</p>
    
                    <hr className='w-11/12 text-left ml-0' />

                    <p className='text-[0.4rem]'>UNIVERSITY OF SCIENCE AND TECHNOLOGY - UD</p>
                </div>
            </header>

            <div className='mt-24 mb-10 md:m-0'>
                <h1 className="font-inter text-center md:text-left text-4xl font-bold pt-5 pb-2">Đăng nhập</h1>
                
                <p className='text-gray-400 hidden md:block'>
                    Dành cho các đơn vị đăng tải hoạt động và bộ phận xét duyệt hoạt động phục vụ cộng đồng của sinh viên
                </p>
            </div>

            <form className='md:mt-10' onSubmit={formik.handleSubmit}>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Tên đăng nhập</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tên đăng nhập..." 
                        className="input input-bordered w-full" 
                        id='username'
                        name='username'
                        onChange={formik.handleChange}
                        value={formik.values.username}
                    />
                </label>
                {formik.errors.username && <div className='text-red-500 text-sm'>{formik.errors.username}</div>}

                <label className="form-control w-full mt-3">
                    <div className="label">
                        <span className="label-text">Mật khẩu</span>
                    </div>
                    <input 
                        type="password" 
                        placeholder="Mật khẩu..." 
                        className="input input-bordered w-full" 
                        id='password'
                        name='password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                </label>
                {formik.errors.password && <div className='text-red-500 text-sm'>{formik.errors.password}</div>}

                <div className='my-5 float-end'>
                    <Link to='/forget-password-email' className='text-blue-500 text-sm hover:underline'>Quên mật khẩu?</Link>
                </div>

                {isLoading 
                ? <Button className='w-full hover:bg-main-hover' disabled>
                    Đăng nhập  
                    <span className="loading loading-dots loading-md ml-2"></span>
                </Button>
                : <Button type='submit' className='w-full bg-main hover:bg-main'>Đăng nhập</Button>}
            </form>

        </div>
     );
}
 
export default LoginPage;