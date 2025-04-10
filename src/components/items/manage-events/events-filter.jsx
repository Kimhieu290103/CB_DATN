import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CheckboxButton from "@/components/items/checkbox/tag-checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const eventStatus = [
    { label: 'Sắp diễn ra', value: 'upcoming' },
    { label: 'Đang diễn ra', value: 'ongoing' },
    { label: 'Đã diễn ra', value: 'completed' },
];

const EventFilter = () => {
    const [checkedEventsStatus, setCheckedEventsStatus] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [startRegister, setStartRegister] = useState('');
    const [endRegister, setEndRegister] = useState('');

    const handleCheckboxChange = (status, isChecked) => {
        setCheckedEventsStatus(prevValues => {
            if (isChecked) {
                return [...prevValues, status];
            } else {
                return prevValues.filter(value => value !== status);
            }
        });
    };

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        const data = {
            checkedEventsStatus,
            startTime,
            endTime,
            startRegister,
            endRegister,
        };
        console.log(data);
    }

    return ( 
        <Popover>
            <PopoverTrigger>
                <Button variant="outline">
                    <span className="material-symbols-outlined pr-0.5">filter_list</span>
                    Bộ lọc
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <form className="space-y-4" onSubmit={handleSubmitFilter}>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Trạng thái</span>
                        </div>
                        <div className="flex space-x-1">
                            {eventStatus.map((status, index) => (
                                <CheckboxButton
                                    key={index}
                                    index={index}
                                    label={status?.label}
                                    value={status?.value}
                                    onCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                        </div>
                    </label>
    
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Thời gian diễn ra</span>
                        </div>
                        <table>
                            <tr>
                                <td className="text-xs font-semibold">Từ</td>
                                <td>
                                    <input 
                                        type="datetime-local" 
                                        className="input input-bordered text-sm w-11/12 h-8 ml-3 rounded"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)} 
                                    />
                                </td>
                            </tr>
    
                            <tr>
                                <td className="text-xs font-semibold">Đến</td>
                                <td>
                                    <input 
                                        type="datetime-local" 
                                        className="input input-bordered text-sm w-11/12 h-8 ml-3 rounded" 
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </table>
                    </label>
    
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Thời gian đăng ký</span>
                        </div>
                        <table>
                            <tr>
                                <td className="text-xs font-semibold">Từ</td>
                                <td>
                                    <input 
                                        type="datetime-local" 
                                        className="input input-bordered text-sm w-11/12 h-8 ml-3 rounded" 
                                        value={startRegister}
                                        onChange={(e) => setStartRegister(e.target.value)}
                                    />
                                </td>
                            </tr>
    
                            <tr>
                                <td className="text-xs font-semibold">Đến</td>
                                <td>
                                    <input 
                                        type="datetime-local" 
                                        className="input input-bordered text-sm w-11/12 h-8 ml-3 rounded" 
                                        value={endRegister}
                                        onChange={(e) => setEndRegister(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </table>
                    </label>
    
                    <div className="flex justify-between space-x-2">
                        <Button type="reset" className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-600">
                            Xóa bộ lọc
                        </Button>
                        <Button type="submit" className="w-1/2 bg-main hover:bg-main-hover">
                            Áp dụng bộ lọc
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
     );
}
 
export default EventFilter;