export const TASK_TYPES = [
    { key: "TASK", label: "Task" },
    { key: 'BUG', label: "Bug" },
    { key: "MEMO", label: "Memo" },
]

export const TASK_PRIORTIES = [
    { key: "HIGH", label: "High" },
    { key: "MEDIUM", label: "Medium" },
    { key: "LOW", label: "Low" },
]

export const disablePreviousDates = (current) => {
    if (!current) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current.toDate() < today;
};

export const modules = {
    toolbar: [
        [{ list: "ordered" }],
        ["bold", "italic", "underline"],
        ["link", "image"],
    ],
};

export const formats = [
    "list",
    "ordered",
    "bold",
    "italic",
    "underline",
    "link",
    "image",
];

export const DEPARTMENT_TYPES = {
    OWN_DEPARTMENT: 'OWN_DEPARTMENT',
    OTHER_DEPARTMENT: 'OTHER_DEPARTMENT'
}