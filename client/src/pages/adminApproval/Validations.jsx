import * as Yup from "yup";

export const rejectApprovalSchema = Yup.object({
    reason: Yup.string()
        .required("Description is required")
        .test("wordCount", "Maximum 150 words allowed", (value) => {
            if (!value) return true;
            const text = value.replace(/<[^>]+>/g, "");
            return text.trim().split(/\s+/).length <= 150;
        }),
});
export const acceptApprovalSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Work email is required'),
});