import * as Yup from "yup";

export const getEditValidationSchema = (isMemo) =>
    Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        priority: isMemo
            ? Yup.string().nullable()
            : Yup.string().required("Priority is required"),
        deadline: isMemo
            ? Yup.mixed().nullable()
            : Yup.mixed().required("Deadline is required"),
    });