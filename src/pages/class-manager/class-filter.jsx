import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PropTypes from "prop-types";
import { useGetClassesMutation, useGetCoursesQuery, useGetDepartmentQuery } from "@/api/rtkQuery/featureApi/otherApiSlice";

const ScoreListFilterItem = ({ onFilterResults }) => {
    const [filters, setFilters] = useState({
        departmentID: '',
        courseID: '',
    });

    const { data: departments } = useGetDepartmentQuery();
    const { data: courses } = useGetCoursesQuery();
    
    const [getClasses, { data: classes }] = useGetClassesMutation();

    // Hàm gọi API khi nhấn vào "Áp dụng bộ lọc"
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filters.departmentID || filters.courseID) {
            getClasses({
                departmentId: filters.departmentID,
                courseId: filters.courseID,
            });
        }
        onFilterResults(filters); // Trả về bộ lọc cho các kết quả
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline">
                    <span className="material-symbols-outlined pr-0.5">filter_list</span>
                    Bộ lọc
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    {/* Lọc theo Khoa */}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Khoa</span>
                        </div>
                        <select
                            className="select select-bordered rounded-md"
                            value={filters.departmentID}
                            onChange={(e) => setFilters({ ...filters, departmentID: e.target.value })}
                        >
                            <option value="">Chọn khoa...</option>
                            {departments?.map((department) => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                    </label>

                    {/* Lọc theo Khoá học */}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Khoá học</span>
                        </div>
                        <select
                            className="select select-bordered rounded-md"
                            value={filters.courseID}
                            onChange={(e) => setFilters({ ...filters, courseID: e.target.value })}
                        >
                            <option value="">Chọn khoá...</option>
                            {courses?.map((course) => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </label>

                    {/* Lọc theo Lớp */}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Lớp</span>
                        </div>
                        <div className="flex flex-wrap space-x-1 space-y-1 mb-4">
                            {classes?.map((Class, index) => (
                                <div key={index}>
                                    <input
                                        type="radio"
                                        name="classID"
                                        value={Class.id}
                                        onChange={() => setFilters({ ...filters, classID: Class.id })}
                                    />
                                    <label>{Class.name}</label>
                                </div>
                            ))}
                        </div>
                    </label>

                    <div className="flex justify-between space-x-2">
                        <Button
                            type="reset"
                            className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-600"
                            onClick={() =>
                                setFilters({ departmentID: '', courseID: '', classID: '' })
                            }
                        >
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
};

ScoreListFilterItem.propTypes = {
    onFilterResults: PropTypes.func.isRequired,
};

export default ScoreListFilterItem;
