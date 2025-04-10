import { useState } from "react";
import PropTypes from "prop-types";

const UploadImageItem = (props) => {
    // const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    const onSelectFile = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith("image/")) {
            // Cập nhật ảnh mới, thay thế ảnh cũ
            const newImageURL = URL.createObjectURL(file);

            // Thu hồi URL của ảnh cũ nếu có
            if (imageURL) {
                URL.revokeObjectURL(imageURL);
            }

            // setSelectedImage(file);
            setImageURL(newImageURL);
            props.getImages(file); // Truyền ảnh lên parent
        }

        // Xóa giá trị input để có thể chọn lại ảnh giống nhau
        event.target.value = "";
    };

    const handleDeleteImage = () => {
        if (imageURL) {
            URL.revokeObjectURL(imageURL);
        }

        // setSelectedImage(null);
        setImageURL(null);
        props.getImages(null); // Xóa ảnh trong parent
    };

    return ( 
        <section>
            <div className="flex items-center">
                <label className="bg-gray-200 dark:bg-gray-800 px-3 py-2 mr-2 font-medium cursor-pointer rounded-lg">
                    + Tải ảnh lên
                    <input
                        type="file"
                        name="image"
                        onChange={onSelectFile}
                        accept="image/png, image/jpeg, image/webp"
                        hidden
                    />
                </label>
            </div>

            {imageURL && (
                <div className="relative my-4 w-full md:w-1/2 h-3/5">
                    <img src={imageURL} className="rounded-md w-full h-full object-cover" alt="upload" />
                    <span 
                        className="material-symbols-outlined cursor-pointer absolute top-0 right-0 p-2 text-red-500"
                        onClick={handleDeleteImage}
                    >
                        cancel
                    </span>
                </div>
            )}
        </section>
    );
}

UploadImageItem.propTypes = {
    getImages: PropTypes.func.isRequired
};

export default UploadImageItem;
