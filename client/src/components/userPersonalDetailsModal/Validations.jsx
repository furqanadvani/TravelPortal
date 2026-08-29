import dayjs from "dayjs";
import * as Yup from "yup";

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/avif", "image/webp", "application/pdf",];

const fileTypeTest = (files) => {
  if (!files || files.length === 0) return true;

  return files.every((f) => {
    const file = f.originFileObj || f;
    return allowedFileTypes.includes(file.type);
  });
};

export const basicFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(32, "First name can be max 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "First name can only contain letters and spaces"
    ),

  workLocation: Yup.string()
    .trim()
    .required("Work location is required")
    .min(3, "Work Location must be at least 3 characters long"),


  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(32, "Last name can be max 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Last name can only contain letters and spaces"
    ),

  fatherName: Yup.string()
    .trim()
    .required("Father name is required")
    .min(3, "Father name must be at least 3 characters")
    .max(32, "Father name can be max 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Father name can only contain letters and spaces"
    ),


  nationality: Yup.string()
    .required("Please select nationality"),

  gender: Yup.string()
    .required("Please select gender"),

  maritalStatus: Yup.string()
    .required("Please select marital status"),

  dateOfBirth: Yup.date()
    .required("Please select date of birth")
    .max(dayjs().subtract(18, "year").toDate(), "You must be at least 18 years old"),

  passportExpiry: Yup.date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .when("workLocation", {
      is: (val) => val === "DUBAI",
      then: (schema) =>
        schema.required("Passport Expiry is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  emiratesIdExpiry: Yup.date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .when("workLocation", {
      is: (val) => val === "DUBAI",
      then: (schema) =>
        schema.required("Emirates ID Expiry is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  governmentId: Yup.string()
    .trim()
    .required("ID Number is required")
    .min(13, "ID must be at least 13 characters")   // Pakistan CNIC min
    .max(18, "ID must be at most 18 characters")    // UAE Emirates ID max
    .matches(
      /^(?:\d{5}-\d{7}-\d{1}|784-\d{4}-\d{7}-\d{1})$/,
      "Enter a valid CNIC or Emirates ID"
    ),
})

export const contactSchema = Yup.object().shape({

  currentAddress: Yup.string()
    .trim()
    .required("Current Address is required")
    .min(5, "Current Address must be at least 5 characters long"),

  permanentAddress: Yup.string()
    .trim()
    .required("Permanent Address is required")
    .min(5, "Permanent Address must be at least 5 characters long"),

  personalEmail: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Personal email is required")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/,
      "Invalid email format"
    ),

  personalMobile: Yup.string()
    .min(9, "Minimum 9 numbers required")
    .max(15, "Maximum 15 numbers allowed")
    .required("Personal mobile number is required")
    .matches(/^[0-9]{9,15}$/, "Enter a valid mobile number"),

  emergencyContactNo: Yup.string()
    .min(9, "Minimum 9 numbers required")
    .max(15, "Maximum 15 numbers allowed")
    .required("Emergency contact number is required")
    .matches(/^[0-9]{9,15}$/, "Enter a valid contact number"),

  emergencyContactName: Yup.string()
    .trim()
    .required("Emergency contact name is required")
    .min(3, "Name must be at least 3 characters")
    .max(32, "Emergency contact name can be max 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Emergency contact name can only contain letters and spaces"
    ),

  relationship: Yup.string()
    .trim()
    .required("Emergency contact relation is required")
    .min(3, "Name must be at least 3 characters")
    .max(32, "Emergency relation can be max 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Emergency relation can only contain letters and spaces"
    ),

  alternateContactNo: Yup.string()
    .nullable()
    .matches(/^[0-9]{9,15}$/, "Enter a valid contact number")
    .min(9, "Minimum 9 numbers required")
    .max(15, "Maximum 15 numbers allowed")
    .notRequired(),
})

export const employmentDetailsSchema = Yup.object().shape({

  designation: Yup.string()
    .trim()
    .required("Designation is required")
    .matches(
      /^[A-Za-z0-9]+(?:[ .&\/-]?[A-Za-z0-9]+)*$/,
      "Designation can only contain letters, numbers, spaces, and . & / -"
    )
    .min(2, "Designation must be at least 2 characters")
    .max(32, "Designation cannot exceed 32 characters"),

  joiningDate: Yup.date()
    .nullable()
    .required("Joining date is required")
    .min(new Date(2020, 0, 1), "Date cannot be before year 2020")
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 3)),
      "Date cannot be more than 3 months from today"
    ),

  employmentType: Yup.string()
    .trim()
    .required("Employment type is required"),

  probation: Yup.string()
    .trim()
    .required("Probation is required"),
})

export const medicalInfoSchema = Yup.object().shape({

  medicalCondition: Yup.string().notRequired(),



  allergies: Yup.string().notRequired(),



  specifyCondition: Yup.string().when("medicalCondition", {
    is: (val) => val === "YES",
    then: (schema) => schema.required("Please specify your medical condition"),
    otherwise: (schema) => schema.notRequired(),
  }),

  specifyAllergies: Yup.string().when("allergies", {
    is: (val) => val === "YES",
    then: (schema) => schema.required("Please specify your allergies"),
    otherwise: (schema) => schema.notRequired(),
  }),


  // specifyCondition: Yup.string()
  //   .trim()
  //   .nullable()
  //   .notRequired(),

  // specifyAllergies: Yup.string()
  //   .trim()
  //   .nullable()
  //   .notRequired(),
})

export const bankInfoSchema = Yup.object().shape({

  bankName: Yup.string()
    .trim()
    .nullable()
    .notRequired()
    .min(3, "Bank name must be at least 3 characters")
    .max(32, "Bank name must be at least 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "First name can only contain letters and spaces"
    ),

  bankBranch: Yup.string()
    .trim()
    .nullable()
    .notRequired()
    .min(3, "Branch name must be at least 3 characters")
    .max(32, "Branch name must be at least 32 characters")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Branch name can only contain letters, numbers and spaces"
    ),

  accountNumber: Yup.string()
    .trim()
    .nullable()
    .notRequired()
    .matches(
      /^[0-9]+$/,
      "Account number can only contain numbers"
    )
    .min(6, "Account number must be at least 6 digits")
    .max(34, "Account number can be max 34 digits"),

  iban: Yup.string()
    .trim()
    .nullable()
    .notRequired()
    .matches(
      /^[A-Za-z0-9]+$/,
      "IBAN can only contain letters and numbers"
    )
    .min(16, "IBAN must be at least 16 characters")
    .max(34, "IBAN can be max 34 characters"),

  accountHolder: Yup.string()
    .trim()
    .nullable()
    .notRequired()
    .min(3, "First name must be at least 3 characters")
    .max(32, "First name can be max 32 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "First name can only contain letters and spaces"
    ),
})

export const documentsSchema = Yup.object().shape({

  cnic: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  policeCharacter: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  emiratesId: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  visaCopy: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  passportCopy: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  passportSizePhoto: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  educationalCertificates: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  experienceLetter: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),

  payslip: Yup.array().test(
    "fileFormat",
    "Only images and pdf allowed",
    fileTypeTest
  ),



  //   cnic: Yup.array()
  //     .when("workLocation", {
  //       is: (val) => val === "KARACHI",
  //       then: (schema) =>
  //         schema
  //           .min(1, "CNIC is required")
  //           .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),
  //       otherwise: (schema) => schema.notRequired(),
  //     }),

  //   policeCharacter: Yup.array()
  //     .when("workLocation", {
  //       is: (val) => val === "KARACHI",
  //       then: (schema) =>
  //         schema
  //           .min(1, "Police character certificate required")
  //           .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),
  //       otherwise: (schema) => schema.notRequired(),
  //     }),

  //   emiratesId: Yup.array()
  //     .when("workLocation", {
  //       is: (val) => val === "DUBAI",
  //       then: (schema) =>
  //         schema
  //           .min(1, "Emirates ID required")
  //           .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),
  //       otherwise: (schema) => schema.notRequired(),
  //     }),

  //   visaCopy: Yup.array()
  //     .when("workLocation", {
  //       is: (val) => val === "DUBAI",
  //       then: (schema) =>
  //         schema
  //           .min(1, "Visa copy required")
  //           .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),
  //       otherwise: (schema) => schema.notRequired(),
  //     }),

  //   passportCopy: Yup.array()
  //     .when("workLocation", {
  //       is: (val) => val === "DUBAI",
  //       then: (schema) =>
  //         schema
  //           .min(1, "Passport copy required")
  //           .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),
  //       otherwise: (schema) => schema.notRequired(),
  //     }),

  //   passportSizePhoto: Yup.array()
  //     .min(1, "Passport Size Photo is required")
  //     .max(1, "Maximum 1 file allowed")
  //     .required("Passport Photo is required")
  //     .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),

  //   educationalCertificates: Yup.array()
  //     .min(1, "Educational Certificates are required")
  //     .max(5, "Maximum 5 files allowed")
  //     .required("Educational Certificates are required")
  //     .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),

  //   experienceLetter: Yup.array()
  //     .min(1, "Experience Letter is required")
  //     .max(1, "Maximum 1 file allowed")
  //     .required("Experience Letter is required")
  //     .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),

  //   payslip: Yup.array()
  //     .min(1, "Payslip is required")
  //     .max(1, "Maximum 1 file allowed")
  //     .required("Payslip is required")
  //     .test("fileFormat", "Only JPG, JPEG or PNG allowed", imageTypeTest),
});

export const assetsSchema = Yup.object().shape({

  laptop: Yup.string().required("Laptop selection is required"),

  brandName: Yup.string().when("laptop", {
    is: (val) => val === "YES",
    then: (schema) =>
      schema.required("Brand/Model is required when laptop is received"),
    otherwise: (schema) => schema.notRequired(),
  }),

  headphone: Yup.string().required("Headphone selection is required"),

  headphoneBrand: Yup.string().when("headphone", {
    is: (val) => val === "YES",
    then: (schema) =>
      schema.required("Headphone Brand/Model is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  welcomePack: Yup.string().required("Welcome pack selection is required"),

  other: Yup.string().notRequired(),
});

export const accessSchema = Yup.object().shape({

  role: Yup.string()
    .required("Role is Required"),

  microsoft365: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Microsoft 365 selection is required"),

  teams: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Teams selection is required"),

  powerBI: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Power BI selection is required"),

  msOfficeApps: Yup.string()
    .oneOf(["YES", "NO"])
    .required("MS Office (365 Apps) selection is required"),

  portals: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Admin / Employer portal selection is required"),

  webOops: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Web Oops portal selection is required"),

  intelliconContegris: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Intellicon / Contegris selection is required"),

  // ===== Technical Access =====
  databaseAccess: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Database Access selection is required"),

  gitRepository: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Git Repository selection is required"),

  jira: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Jira selection is required"),

  postman: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Postman selection is required"),

  awsIamRoles: Yup.string()
    .oneOf(["YES", "NO"])
    .required("AWS (IAM Roles) selection is required"),

  serverAccess: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Server Access selection is required"),

  datadog: Yup.string()
    .oneOf(["YES", "NO"])
    .required("Datagod selection is required"),
});
