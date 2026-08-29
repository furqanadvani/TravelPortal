import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { UploadOutlined, FilePdfOutlined } from "@ant-design/icons";
import "./CUpload.css";

const CUpload = ({ label, value = [], onChange, maxFiles = 1, disabled = false, error, }) => {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const formatted = value.map((file, idx) => ({
            uid: file.uid || idx,
            name: file.name,
            status: "done",
            type: file.type,
            url: file.url,
            thumbUrl: file.thumbUrl || file.url,
            originFileObj: file.originFileObj || file,
        }));

        setFileList(formatted);
    }, [value]);

    const beforeUpload = (file) => {
        if (fileList.length >= maxFiles) {
            message.error(`You can upload maximum ${maxFiles} files only`);
            return Upload.LIST_IGNORE;
        }

        const isPdf = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");

        if (!isPdf && !isImage) {
            message.error("Only images and PDF files are allowed!");
            return Upload.LIST_IGNORE;
        }

        if (file.size / 1024 / 1024 > 2) {
            message.error(`${file.name} exceeds 2MB!`);
            return Upload.LIST_IGNORE;
        }

        if (isImage) { file.thumbUrl = URL.createObjectURL(file); }
        return false;
    };

    const handleChange = ({ fileList: newFileList }) => {
        const formattedFiles = newFileList.map((file) => ({
            uid: file.uid,
            name: file.name,
            status: "done",
            type: file.type,
            url: file.url,
            thumbUrl: file.thumbUrl,
            originFileObj: file.originFileObj || file,
        }));

        setFileList(formattedFiles);
        onChange && onChange(formattedFiles);
    };

    return (
        <div className="cUpload-container">
            {label && <label className="form-label">{label}</label>}

            <Upload.Dragger
                multiple
                listType="picture"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                disabled={disabled}
                maxCount={maxFiles}
                className="upload-dragger"
                iconRender={(file) => {
                    const isPdf =
                        file.type === "application/pdf" ||
                        file.name?.toLowerCase().endsWith(".pdf");

                    if (isPdf) {
                        return (
                            <FilePdfOutlined
                                style={{
                                    fontSize: 40,
                                    color: "#ff4d4f",
                                }}
                            />
                        );
                    }

                    return null;
                }}
            >
                <p className="upload-icon"><UploadOutlined /></p>
                <p className="CUpload-text">Images / PDF • Max 2MB • Max files: {maxFiles}</p>
            </Upload.Dragger>

            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default CUpload;