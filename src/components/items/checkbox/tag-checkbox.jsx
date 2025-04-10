import PropTypes from "prop-types";
import { useState } from "react";

const CheckboxButton = ({ label = "Check me", index, value, type, name, onCheckboxChange }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;
        setIsChecked(checked);
        onCheckboxChange(value, checked);
    };
    return (
      <div className="flex">
        <input
          type={type || "checkbox"}
          id={`option-${index}`}
          name={name}
          className="peer hidden"
          checked={isChecked}
          onChange={handleCheckboxChange} 
          value={value}
        />
        <label
          htmlFor={`option-${index}`}
          className="select-none cursor-pointer rounded-md border border-gray-200 
          py-1 px-2 text-xs font-medium transition-colors duration-200 ease-in-out
          peer-checked:bg-blue-300 peer-checked:text-gray-900 peer-checked:border-blue-200"
        >
          {label}
        </label>
      </div>
    );
};

CheckboxButton.propTypes = {
    index: PropTypes.number,
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    onCheckboxChange: PropTypes.func,
};
  
export default CheckboxButton;
  