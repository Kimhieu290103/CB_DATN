// const ExcellentStudentsList = () => {
//     return ( 
//         <>
//         <p>hello</p>
//         </>
//      );
// }
 
// export default ExcellentStudentsList;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import URLS from "@/routes/urls";

const ExcellentStudentsList = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(URLS.STUDENT_CRITERIA);
    }, [navigate]);

    return null; // hoặc có thể return loading nếu muốn hiển thị gì đó
};

export default ExcellentStudentsList;
