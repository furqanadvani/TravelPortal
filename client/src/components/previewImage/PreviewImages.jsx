// PreviewImages.jsx
import React, { useState } from "react";
import { Image, Modal } from "antd";
import { BACKENDPATH } from "../../utils/Constants";

export const PreviewImages = ({ files = [] }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    if (!files || !Array.isArray(files) || files.length === 0) return "-";

    const handlePreview = (file) => {
        const url = file?.url || file?.path || `http://localhost:8080/uploads/personal-docs/${file.filename}`;
        setPreviewImage(url);
        setPreviewVisible(true);
    };

    return (
        <>
            <div className="preview-images" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {files.map((file, index) => {
                    const url = `${BACKENDPATH}/uploads/personal-docs/${file.filename}`;
                    if (!url) return null;

                    return (
                        <Image
                            key={index}
                            src={url}
                            alt={file.originalName || "document"}
                            width={50}
                            style={{
                                borderRadius: 6,
                                border: "1px solid #ddd",
                                cursor: "pointer",
                            }}
                            onClick={() => handlePreview(file)}
                        />
                    );
                })}
            </div>

            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </>
    );
};

export default PreviewImages