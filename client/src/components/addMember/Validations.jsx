import * as Yup from "yup";

export const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, "First Name must be at least 3 characters")
    .max(24, "First Name cannot exceed 24 characters")
    .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(3, "Last Name must be at least 3 characters")
    .max(24, "Last Name cannot exceed 24 characters")
    .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/,
      "Invalid email format"
    ),

  departments: Yup.array()
    .min(1, "Department selection is required")
    .required("Department selection is required"),

  isKamelPayMicrosoftUser: Yup.boolean()
    .required("KP microsoft user selection is required")
});
