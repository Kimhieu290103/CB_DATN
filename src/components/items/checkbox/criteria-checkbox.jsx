import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const CriteriaCheckboxItem = ({ label, description, group, index, value, isChecked, onCheckboxChange, className }) => {
    const [checked, setChecked] = useState(isChecked); // State quản lý trạng thái checkbox

    // Cập nhật khi dữ liệu từ API thay đổi
    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);

    // Xử lý khi checkbox thay đổi
    const handleCheckboxChange = (e) => {
        const newChecked = e.target.checked;
        setChecked(newChecked); // Cập nhật state nội bộ
        onCheckboxChange(value, newChecked); // Gửi trạng thái ra component cha
    };

    return (
        <div className={cn("flex items-center", className)}>
            <input
                type="checkbox"
                id={`checkbox${group}-${index}`}
                className="checkbox"
                value={value}
                checked={checked} // Nhận từ state đã đồng bộ với API
                onChange={handleCheckboxChange}
            />
            <label
                htmlFor={`checkbox${group}-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
                {description && <p className="text-xs text-slate-600">{description}</p>}
            </label>
        </div>
    );
};

CriteriaCheckboxItem.propTypes = {
    index: PropTypes.number,
    label: PropTypes.string,
    description: PropTypes.string,
    value: PropTypes.string.isRequired,
    group: PropTypes.string,
    isChecked: PropTypes.bool, // Nhận giá trị ban đầu từ API
    onCheckboxChange: PropTypes.func.isRequired, // Callback khi thay đổi
    className: PropTypes.string,
};

export default CriteriaCheckboxItem;
