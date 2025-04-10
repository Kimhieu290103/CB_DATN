import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CheckboxButton from "@/components/items/checkbox/tag-checkbox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGetClassesMutation, useGetCoursesQuery, useGetDepartmentQuery } from "@/api/rtkQuery/featureApi/otherApiSlice";
import { useGetAcademicYearsQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";


const ScoreListFilterItem = ({onFilterResults}) => {
    const [filters, setFilters] = useState({
        departmentID: '',
        courseID: '',
        classID: '',
        semesterID: '',
    });

    const { data: departments } = useGetDepartmentQuery();
    const { data: academicYears } = useGetAcademicYearsQuery();
    const { data: courses } = useGetCoursesQuery();

    const [getClasses, { data: classes }] = useGetClassesMutation();
    useEffect(() => {
        if (filters.departmentID || filters.courseID) {
            getClasses({
                departmentId: filters.departmentID,
                courseId: filters.courseID,
            });
        }
    }, [filters.departmentID, filters.courseID, getClasses]); 


    const handleCheckboxChange = (value, checked) => {
        if (checked) {
            setFilters({...filters, classID: value});
        } else {
            setFilters({...filters, classID: ''});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterResults(filters);
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
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Khoa</span>
                        </div>
                        <select  
                            className="select select-bordered rounded-md" 
                            value={filters.departmentID}
                            onChange={(e) => setFilters({...filters, departmentID: e.target.value})}
                        >
                            <option value="">Chọn khoa...</option>
                            {departments?.map((department) => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Khoá học</span>
                        </div>
                        <select  
                            className="select select-bordered rounded-md" 
                            value={filters.courseID}
                            onChange={(e) => setFilters({...filters, courseID: e.target.value})}
                        >
                            <option value="">Chọn khoá...</option>
                            {courses?.map((course) => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Năm học</span>
                        </div>
                        <select  
                            className="select select-bordered rounded-md" 
                            value={filters.semesterID}
                            onChange={(e) => setFilters({...filters, semesterID: e.target.value})}
                        >
                            <option value="">Chọn năm học...</option>
                            {academicYears?.map((academicYear) => (
                                <option key={academicYear.id} value={academicYear.id}>{academicYear.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Lớp</span>
                        </div>
                        <div className="flex flex-wrap space-x-1 space-y-1 mb-4">
                            {classes?.map((Class, index) => (
                                <CheckboxButton
                                    key={index}
                                    type="radio"
                                    name="classes"
                                    index={index}
                                    label={Class?.name}
                                    value={Class?.id}
                                    onCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                        </div>
                    </label>
    
                    
    
                    <div className="flex justify-between space-x-2">
                        <Button
                            type="reset"
                            className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-600"
                            onClick={() =>
                                setFilters({ departmentID: '', courseID: '', classID: '', semesterID: '' })
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
}
ScoreListFilterItem.propTypes = {
    onFilterResults: PropTypes.func.isRequired,
};

export default ScoreListFilterItem;