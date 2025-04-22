


import { useState } from "react";
import {
    useGetFalcutyCriteriaInSemesterQuery,
    useGetSchoolCriteriaInSemesterQuery,
    useAddSchoolCriteriaMutation,
    useAddFalcutyCriteriaMutation
} from "@/api/rtkQuery/featureApi/criteriaApiSlice";
import { Dialog, DialogContent,DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    const [dialogType, setDialogType] = useState(null); // 'school' hoặc 'falcuty'
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    // Gọi API theo kỳ học được chọn
    const { data: falcutyCriteria, isLoading: isLoadingFalcuty } = useGetFalcutyCriteriaInSemesterQuery(selectedYear, { skip: !selectedYear });
    const { data: schoolCriteria, isLoading: isLoadingSchool } = useGetSchoolCriteriaInSemesterQuery(selectedYear, { skip: !selectedYear });
    const [addSchoolCriteria] = useAddSchoolCriteriaMutation();
    const [addFalcutyCriteria] = useAddFalcutyCriteriaMutation();
    const handleAdd = async () => {
        if (!name.trim() || !description.trim()) return;
    
        const newCriteria = {
            name,
            description,
            semesterId: selectedYear,
        };
    
        try {
            await addSchoolCriteria(newCriteria).unwrap();
            // Reset form và đóng dialog
            setName("");
            setDescription("");
            setDialogType(null);
        } catch (error) {
            console.error("Thêm tiêu chí thất bại:", error);
        }
    };
    const handleAddFalcuty = async () => {
        if (!name.trim() || !description.trim()) return;
    
        const newCriteria = {
            name,
            description,
            semesterId: selectedYear,
        };
    
        try {
            await addFalcutyCriteria(newCriteria).unwrap();
            // Reset form và đóng dialog
            setName("");
            setDescription("");
            setDialogType(null);
        } catch (error) {
            console.error("Thêm tiêu chí thất bại:", error);
        }
    };
    return (
        <>
            {/* Bộ chọn năm học */}
            <AcademicYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

            {/* Tiêu chí cấp trường */}
            <h1 className="font-bold text-gray-500 text-xl mb-8">Tiêu chí sinh viên 5 tốt</h1>
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
            {selectedYear && (
                <div className="flex justify-end mt-4">
                    <Button onClick={() => setDialogType("school")} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                        + Thêm tiêu chí
                    </Button>
                    <Dialog open={dialogType === "school"} onOpenChange={() => setDialogType(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Thêm tiêu chí sinh viên</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <Input
                                    placeholder="Tên tiêu chí"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    placeholder="Mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAdd}>Lưu</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
            <Separator className="my-8" />

            {/* Tiêu chí cấp Liên chi Đoàn */}
            <h1 className="font-bold text-gray-500 text-xl mb-8">Tiêu chí hoạt động tốt liên chi đoàn</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {falcutyCriteria?.map((criteria) => (
                    <StudentCriteriasCard
                        key={criteria.id}
                        criteria={criteria}
                        type="falcuty"
                    />
                ))}
            </div>
            {selectedYear && (
                <div className="flex justify-end mt-4">
                    <Button onClick={() => setDialogType("falcuty")} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                        + Thêm tiêu chí
                    </Button>
                    <Dialog open={dialogType === "falcuty"} onOpenChange={() => setDialogType(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Thêm tiêu chí hoạt động tốt liên chi đoàn</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <Input
                                    placeholder="Tên tiêu chí"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    placeholder="Mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddFalcuty}>Lưu</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </>
    );
}

export default StudentCriterias;
