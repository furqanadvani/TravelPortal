import * as Yup from "yup"

export const counterOfferSchema = Yup.object().shape({
    revisedSalary: Yup.number()
        .typeError('Revised Salary must be a number')
        .required('Revised Salary is required')
        .positive('Salary must be a positive number'),
    newDesignation: Yup.string()
        .required('New Designation is required'),
    additionalBenefits: Yup.string(),
})