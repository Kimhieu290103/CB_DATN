import { useRemoveFalcutyCriteriaMutation, useRemoveSchoolCriteriaMutation } from "@/api/rtkQuery/featureApi/criteriaApiSlice";
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
  

const StudentCriteriasCard = ({ criteria, type }) => {
    const [removeSchoolCriteria, { isLoading: isRemovingSchool }] = useRemoveSchoolCriteriaMutation();
    const [removeFalcutyCriteria, { isLoading: isRemovingFalcuty }] = useRemoveFalcutyCriteriaMutation();
    const [errorMessage, setErrorMessage] = useState(""); 
    const handleRemoveCriteria = async () => {
        setErrorMessage("");
        try { if (type === "school") {
            await removeSchoolCriteria(criteria.id).unwrap();
        } else if (type === "falcuty") {
            await removeFalcutyCriteria(criteria.id).unwrap();
        }
    }catch (error) {
        console.error("Lỗi từ API:", error); // Debug lỗi trong console

        if (error?.status === 403) {
            setErrorMessage("Bạn không có quyền thực hiện thao tác này.");
            alert("Bạn không có quyền thực hiện thao tác này.");
        } else {
            setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
            alert("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    }
    };

    return ( 
        <Card className="w-[23rem] flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="leading-1">{criteria.name}</CardTitle>
                <CardDescription>Được áp dụng từ năm học {criteria.semester.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-start space-x-1 text-sm font-medium text-gray-500">
                    <span className="material-symbols-outlined">description</span>
                    <p>{criteria.description}</p>
                </div>

                <div className="flex items-center space-x-1 text-sm font-medium text-gray-500">
                    <span className="material-symbols-outlined">history</span>
                    <p>{format(new Date(criteria.createdAt), "dd/MM/yyyy")}</p>
                </div>
                {errorMessage && (
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                )}
            </CardContent>
            <CardFooter className="self-end justify-self-end gap-2">
                <Button
                    className="bg-green-600 hover:bg-green-500 text-white"
                    onClick={() => alert("Mở modal thêm tiêu chí")}
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