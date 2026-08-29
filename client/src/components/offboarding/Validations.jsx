import * as Yup from "yup";

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/avif", "image/webp", "application/pdf",];

const fileTypeTest = (files) => {
    if (!files || files.length === 0) return true;

    return files.every((f) => {
        const file = f.originFileObj || f;
        return allowedFileTypes.includes(file.type);
    });
};

export const resignationSchema = Yup.object({
    resignationReason: Yup.string()
        .required("Resignation Reason is required")
        .min(3, "Resignation Reason must be at least 3 characters")
        .max(50, "Resignation Reason cannot exceed 50 characters")
        .test(
            "not-only-numbers",
            "Resignation Reason cannot be only numbers or spaces",
            value => {
                if (!value) return false;
                const trimmed = value.trim();
                return /[^\d]/.test(trimmed);
            }
        ),
    resignationStartDate: Yup.date()
        .required("Please select from when your resignation start"),
    resignationDetails: Yup.string()
        .required('Resignation details is required')
        .min(30, "Resignation Reason must be at least 30 characters"),
    resignationFile: Yup.array().test(
        "fileFormat",
        "Only images and pdf allowed",
        fileTypeTest
    ),
});