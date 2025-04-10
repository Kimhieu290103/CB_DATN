// import { useGetFalcutyCriteriaQuery, useGetSchoolCriteriaQuery } from "@/api/rtkQuery/featureApi/criteriaApiSlice";
// import StudentCriteriasCard from "@/components/cards/excellent-students/student-criterias";
// import { Separator } from "@/components/ui/separator";

// const StudentCriterias = () => {
//     const { data: falcutyCriteria } = useGetFalcutyCriteriaQuery();
//     const { data: schoolCriteria} = useGetSchoolCriteriaQuery();
  
//     return ( 
//         <>
            
//             <h1 className="font-bold text-gray-500 text-xl mb-8">Sinh viên 5 tốt cấp trường</h1>
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {schoolCriteria?.map((criteria) => (
//                     <StudentCriteriasCard 
//                         key={criteria.id} 
//                         criteria={criteria} 
//                         type="school"
//                     />
//                 ))}
                
//             </div>

//             <Separator className="my-8" />
            
//             <h1 className="font-bold text-gray-500 text-xl mb-8">Sinh viên 5 tốt cấp Liên chi Đoàn</h1>
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {falcutyCriteria?.map((criteria) => (
//                     <StudentCriteriasCard 
//                         key={criteria.id} 
//                         criteria={criteria} 
//                         type="falcuty"
//                     />
//                 ))}
                
//             </div>
//         </>
//      );
// }
 
// export default StudentCriterias;



import { useState } from "react";
import { useGetFalcutyCriteriaQuery, useGetSchoolCriteriaQuery,  useGetFalcutyCriteriaInSemesterQuery,
                useGetSchoolCriteriaInSemesterQuery } from "@/api/rtkQuery/featureApi/criteriaApiSlice";
import StudentCriteriasCard from "@/components/cards/excellent-students/student-criterias";
import { Separator } from "@/components/ui/separator";
import { useGetAcademicYearsQuery } from "@/api/rtkQuery/featureApi/eventApiSlice";
// Tách component ra ngoài
const AcademicYearSelector = ({ selectedYear, setSelectedYear }) => {
    const { data: academicYears, isLoading, error } = useGetAcademicYearsQuery();

    return ( 
        <div className="mb-6">
            <label className="font-bold mr-2">Chọn năm học:</label>
            <select 
                className="border rounded-md p-1 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
            >
                <option value="">Chọn kỳ</option>
                {isLoading ? (
                    <option disabled>Đang tải...</option>
                ) : error ? (
                    <option disabled>Lỗi tải dữ liệu</option>
                ) : (
                    academicYears?.map((year) => (
                        <option key={year.id} value={year.id}>
                            {year.name}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

const StudentCriterias = () => {
    // const { data: falcutyCriteria } = useGetFalcutyCriteriaQuery();
    // const { data: schoolCriteria } = useGetSchoolCriteriaQuery();


    const [selectedYear, setSelectedYear] = useState("");
     // Gọi API theo kỳ học được chọn
     const { data: falcutyCriteria, isLoading: isLoadingFalcuty } = useGetFalcutyCriteriaInSemesterQuery(selectedYear, { skip: !selectedYear });
     const { data: schoolCriteria, isLoading: isLoadingSchool } = useGetSchoolCriteriaInSemesterQuery(selectedYear, { skip: !selectedYear });

    return ( 
        <>
               {/* Bộ chọn năm học */}
               <AcademicYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

            {/* Tiêu chí cấp trường */}
            <h1 className="font-bold text-gray-500 text-xl mb-8">Sinh viên 5 tốt cấp trường</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {schoolCriteria?.map((criteria) => (
                    <StudentCriteriasCard 
                        key={criteria.id} 
                        criteria={criteria} 
                        type="school"
                    />
                ))}
            </div>
            {/* Nút thêm tiêu chí cho cấp trường */}
            <div className="flex justify-end mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                    + Thêm tiêu chí
                </button>
            </div>
            <Separator className="my-8" />

            {/* Tiêu chí cấp Liên chi Đoàn */}
            <h1 className="font-bold text-gray-500 text-xl mb-8">Sinh viên 5 tốt cấp Liên chi Đoàn</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {falcutyCriteria?.map((criteria) => (
                    <StudentCriteriasCard 
                        key={criteria.id} 
                        criteria={criteria} 
                        type="falcuty"
                    />
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                    + Thêm tiêu chí
                </button>
            </div>
        </>
    );
}

export default StudentCriterias;
