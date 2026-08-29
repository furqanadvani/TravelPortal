import * as Yup from "yup";

export const buildExitInterviewSchema = (questions) => {
    const shape = {};

    questions.forEach((q) => {
        let validator = Yup.string()
            .nullable()
            .matches(/^[A-Za-z\s]*$/, "Only letters and spaces are allowed");

        if (q.validationKey) {
            const rules = q.validationKey.split("|");
            rules.forEach((rule) => {
                if (rule === "required") {
                    validator = validator.required("This field is required");
                } else if (rule.startsWith("min:")) {
                    const minLen = parseInt(rule.split(":")[1], 10);
                    validator = validator.test(
                        "min-letters",
                        `Minimum ${minLen} letters required`,
                        value => {
                            if (!value) return false;
                            const lettersOnly = value.replace(/\s/g, "");
                            return lettersOnly.length >= minLen;
                        }
                    );
                } else if (rule.startsWith("max:")) {
                    const maxLen = parseInt(rule.split(":")[1], 10);
                    validator = validator.max(maxLen, `Maximum ${maxLen} characters allowed`);
                }
            });
        }

        shape[q.name] = validator;
    });

    return Yup.object().shape(shape);
};
