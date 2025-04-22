import { useRemoveFalcutyCriteriaMutation, useRemoveSchoolCriteriaMutation, useUpdateSchoolCriteriaMutation, useUpdateFalcutyCriteriaMutation } from "@/api/rtkQuery/featureApi/criteriaApiSlice";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns";
import PropTypes from 'prop-types';


const StudentCriteriasCard = ({ criteria, type}) => {
    const [removeSchoolCriteria, { isLoading: isRemovingSchool }] = useRemoveSchoolCriteriaMutation();
    const [removeFalcutyCriteria, { isLoading: isRemovingFalcuty }] = useRemoveFalcutyCriteriaMutation();
    const [errorMessage, setErrorMessage] = useState("");
    const handleRemoveCriteria = async () => {
        setErrorMessage("");
        try {
            if (type === "school") {
                await removeSchoolCriteria(criteria.id).unwrap();
            } else if (type === "falcuty") {
                await removeFalcutyCriteria(criteria.id).unwrap();
            }
        } catch (error) {
            console.error("Lỗi từ API:", error); // Debug lỗi trong console

            if (error?.status === 403) {
                setErrorMessage("Bạn không có quyền thực hiện thao tác này.");
               
            } else {
                setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
              
            }
        }
    };
    const [updateSchoolCriteria, { isLoading: isUpdatingSchool }] = useUpdateSchoolCriteriaMutation();
    const [updateFalcutyCriteria, { isLoading: isUpdatingFalcuty }] = useUpdateFalcutyCriteriaMutation();
    
    // 🔧 Added: state cho sửa tiêu chí
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(criteria.name);
    const [editedDescription, setEditedDescription] = useState(criteria.description);
    const handleSaveEdit = async () => {
        try {
            if (type === "school") {
                await updateSchoolCriteria({
                    id: criteria.id,
                    data: {
                        name: editedName,
                        description: editedDescription,
                    }
                }).unwrap();
            } else if (type === "falcuty") {
                await updateFalcutyCriteria({
                    id: criteria.id,
                    data: {
                        name: editedName,
                        description: editedDescription,
                    }
                }).unwrap();
            }
    
            setIsEditing(false); // Sau khi cập nhật thành công thì đóng form
            alert("Cập nhật thành công!");
    
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Đã xảy ra lỗi khi cập nhật.");
        }
    };
    
    return (
        <Card className="w-[23rem] flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="leading-1">{criteria.name}</CardTitle>
                <CardDescription>Được áp dụng từ năm học {criteria.semester.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {isEditing ? (
                    // 🔧 Added: Form sửa tiêu chí
                    <div className="space-y-2">
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium">Tên tiêu chí</label>
                            <input
                                type="text"
                                className="border rounded px-2 py-1"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium">Mô tả</label>
                            <textarea
                                className="border rounded px-2 py-1"
                                rows={3}
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start space-x-1 text-sm font-medium text-gray-500">
                            <span className="material-symbols-outlined">description</span>
                            <p>{criteria.description}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-500">
                            <span className="material-symbols-outlined">history</span>
                            <p>{format(new Date(criteria.createdAt), "dd/MM/yyyy")}</p>
                        </div>
                    </>
                )}

                {errorMessage && (
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                )}
            </CardContent>
            <CardFooter className="self-end justify-self-end gap-2">
                {isEditing ? (
                    // 🔧 Added: Button khi đang sửa
                    <>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={handleSaveEdit}
                        >
                            Lưu
                        </Button>
                        <Button
                            className="bg-gray-400 hover:bg-gray-300 text-white"
                            onClick={() => setIsEditing(false)}
                        >
                            Hủy
                        </Button>
                    </>
                ) : (
                    // 🔧 Modified: Button sửa ban đầu
                    <>
                        <Button
                            className="bg-green-600 hover:bg-green-500 text-white"
                            onClick={() => setIsEditing(true)}
                        >
                            Sửa tiêu chí
                        </Button>
                        <Button
                            className="w-full bg-red-600 hover:bg-red-500 text-white"
                            onClick={handleRemoveCriteria}
                            disabled={isRemovingSchool || isRemovingFalcuty}
                        >
                            {isRemovingSchool || isRemovingFalcuty ? "Đang xóa..." : "Xóa tiêu chí"}
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};

StudentCriteriasCard.propTypes = {
    criteria: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        semester: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        description: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.oneOf(["school", "falcuty"]).isRequired,
};

export default StudentCriteriasCard;