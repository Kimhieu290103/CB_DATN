import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import URLS from "@/routes/urls";

const AccountManagement= () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(URLS.ACCOUNT_SV);
    }, [navigate]);

    return null; // hoặc có thể return loading nếu muốn hiển thị gì đó
};

export default AccountManagement;
