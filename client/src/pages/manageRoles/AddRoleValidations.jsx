import * as Yup from "yup";

export const RoleSchema = Yup.object().shape({
  name: Yup.string().trim().required("Role Name is required"),
  description: Yup.string().trim().required("Role Description is required"),
  permissions: Yup.array()
    .test(
      "at-least-one",
      "Select at least one permission",
      value => value && value.some(p => p.access && p.access.length > 0)
    )
});