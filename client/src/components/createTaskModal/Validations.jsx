import * as Yup from "yup";

export const validationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .required("Title is required")
        .min(3, "Minimum 3 characters required")
        .max(25, "Maximum 25 characters allowed"),
    description: Yup.string()
        .required("Description is required")
        .test("wordCount", "Maximum 500 words allowed", (value) => {
            if (!value) return true;
            const text = value.replace(/<[^>]+>/g, "");
            return text.trim().split(/\s+/).length <= 500;
        }),
    assignee: Yup.string().required("Assign To is required"),
    deadline: Yup.date()
        .nullable()
        .when("type", {
            is: (val) => val !== "MEMO",
            then: (schema) => schema.required("Deadline is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    priority: Yup.string()
        .when("type", {
            is: (val) => val !== "MEMO",
            then: (schema) => schema.required("Priority is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    type: Yup.string().required("Type is required"),
    assignToDepartment: Yup.string().required("Select Department is required"),
});