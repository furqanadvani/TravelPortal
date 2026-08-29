import { Descriptions, Divider, message, Tag } from "antd";
import jsPDF from "jspdf";
import { htmlToPlainText, readableText, renderDate, renderPreviewImages } from "../../utils/Methods";

export const fileBlog = (file, download = false) => {
    if (!file) return;

    try {
        // Base64 to Uint8Array conversion
        const byteCharacters = atob(file.fileData);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Create Blob
        const blob = new Blob([byteArray], { type: file.fileType || "application/octet-stream" });
        const fileURL = URL.createObjectURL(blob);

        if (download) {
            // Download file
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = file.name || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Open file in new tab
            window.open(fileURL, "_blank", "noopener,noreferrer");
        }
    } catch (error) { }
};

// Handle Upload
export const handleUpload = (info, setUploadedFiles) => {
    const files = [...info.fileList].map((file) => file.originFileObj || file);
    setUploadedFiles(files);
    message.success(`${files.length} file(s) uploaded`);
};

// Handle Remove File
export const handleRemoveFile = (index, uploadedFiles, setUploadedFiles) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    setUploadedFiles(updated);
};

// Format Date
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// Generate PDF
export const generateTaskPDF = (taskDetails, userName, userRole) => {
    try {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        pdf.setFillColor(33, 150, 243);
        pdf.rect(0, 0, 210, 20, "F");
        pdf.setFontSize(16);
        pdf.setTextColor(255, 255, 255);
        pdf.text("TASK DETAILS REPORT", 105, 15, { align: "center" });

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, 30);
        pdf.text(`By: ${userName} (${userRole})`, 15, 35);

        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Task Title: ${taskDetails?.taskTitle || "N/A"}`, 15, 50);

        pdf.setFontSize(12);
        const descriptionLines = pdf.splitTextToSize(
            taskDetails?.description?.replace(/<[^>]*>/g, "") || "No description provided",
            180
        );
        pdf.text("Description:", 15, 65);
        pdf.text(descriptionLines, 20, 75);

        const detailsY = 75 + descriptionLines.length * 5 + 10;
        pdf.setFillColor(240, 240, 240);
        pdf.rect(15, detailsY, 180, 30, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(15, detailsY, 180, 30);

        pdf.setFont(undefined, "bold");
        pdf.text("Status", 20, detailsY + 10);
        pdf.text("Priority", 20, detailsY + 20);
        pdf.text("Assigned To", 100, detailsY + 10);
        pdf.text("Deadline", 100, detailsY + 20);

        pdf.setFont(undefined, "normal");
        pdf.text(taskDetails?.status || "N/A", 50, detailsY + 10);
        pdf.text(taskDetails?.priority || "N/A", 50, detailsY + 20);

        const assignedTo = taskDetails?.actions?.find((a) => a.assignedTo)?.assignedTo?.username || "Unassigned";
        pdf.text(assignedTo, 130, detailsY + 10);

        const deadline = taskDetails?.deadline
            ? new Date(taskDetails.deadline).toLocaleDateString()
            : "No deadline";
        pdf.text(deadline, 130, detailsY + 20);

        const historyY = detailsY + 40;
        pdf.setFont(undefined, "bold");
        pdf.setFontSize(14);
        pdf.text("Task History", 15, historyY);

        if (taskDetails?.actions?.length > 0) {
            const sortedActions = [...taskDetails.actions].sort((a, b) => new Date(a.date) - new Date(b.date));
            const creationAction = sortedActions.find((a) => a.action.includes("Task Created"));
            const assignmentActions = sortedActions.filter((a) => "assignedTo" in a);

            let yPos = historyY + 15;
            const leftMargin = 25;
            const dotRadius = 2;
            const lineWidth = 0.5;
            const dateLeftMargin = 150;

            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(lineWidth);
            pdf.line(leftMargin - dotRadius - 2, yPos - 5, leftMargin - dotRadius - 2, yPos + 100);

            if (creationAction) {
                pdf.setFillColor(82, 196, 26);
                pdf.circle(leftMargin - dotRadius - 2, yPos + 3, dotRadius, "F");
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                pdf.text("Task Created", leftMargin + 5, yPos + 5);

                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(formatDate(creationAction.date), dateLeftMargin, yPos + 5);
                pdf.text(`Created by ${creationAction.user?.username || "Unknown"}`, leftMargin + 5, yPos + 10);
                yPos += 15;
            }

            assignmentActions.forEach((action, index) => {
                const isUnassignment = action.assignedTo === null;
                pdf.setFillColor(isUnassignment ? 245 : 34);
                pdf.circle(leftMargin - dotRadius - 2, yPos + 3, dotRadius, "F");
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);

                let actionText = isUnassignment
                    ? "Unassigned"
                    : index === 0
                        ? `Assigned to ${action.assignedTo?.username || "Unknown"}`
                        : `Reassigned to ${action.assignedTo?.username || "Unknown"}`;
                pdf.text(actionText, leftMargin + 5, yPos + 5);

                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(formatDate(action.date), dateLeftMargin, yPos + 5);
                pdf.text(`By ${action.user?.username || "Unknown"}`, leftMargin + 5, yPos + 10);

                if (action.files?.length > 0) {
                    pdf.setFontSize(7);
                    pdf.setTextColor(80, 80, 80);
                    const filesText = `Files: ${action.files.map((f) => f.name || "File").join(", ")}`;
                    const filesLines = pdf.splitTextToSize(filesText, 150);
                    pdf.text(filesLines, leftMargin + 5, yPos + 15);
                    yPos += filesLines.length * 4;
                }
                yPos += 15;
            });
        } else {
            pdf.setFont(undefined, "normal");
            pdf.text("No history available", 20, historyY + 15);
        }

        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text("© 2023 Task Management System - Confidential", 105, 290, { align: "center" });

        pdf.save(`Task_Report_${taskDetails?.taskTitle || ""}_${new Date().toISOString().slice(0, 10)}.pdf`);
        message.success("Task report exported successfully!");
    } catch (error) {
        message.error("Failed to export task report");
    }
};

// Shared block used by every render* helper below: a titled divider followed by
// a bordered Descriptions table. Pulled out so each helper only has to declare
// its own data — same "custom-descriptions" className and layout as before,
// just without repeating the wrapper markup seven times.
const InfoBlock = ({ title, items }) => (
    <div style={{ marginBottom: 24 }}>
        {title && <Divider orientation="left">{title}</Divider>}
        <Descriptions
            size="medium"
            bordered
            items={items}
            column={2}
            className="custom-descriptions"
        />
    </div>
);

export const renderPrimaryDetails = (userdata) => {
    const p = userdata || {};

    const primaryInfo = [
        { key: '1', label: 'First Name', children: p?.firstName || '-' },
        { key: '2', label: 'Last Name', children: p?.lastName || '-' },
        { key: '3', label: 'Father Name', children: p?.fatherName || '-' },
        { key: '4', label: 'Personal Email', children: userdata?.personalEmail || '-' },
        { key: '5', label: 'Gender', children: readableText(p?.gender || '-') },
        { key: '6', label: 'Phone', children: readableText(p?.personalMobile || '-') },
        { key: '7', label: 'Marital Status', children: readableText(p?.maritalStatus || '-') },
        { key: '8', label: 'Nationality', children: readableText(p?.nationality || '-') },
        { key: '9', label: 'Date of Birth', children: renderDate(p?.dateOfBirth) },
        { key: '10', label: 'CNIC / Emirates ID', children: readableText(p?.governmentId || '-') },
        ...(p?.emiratesIdExpiry?.length
            ? [{ key: '11', label: 'Emirates Id Expiry', children: renderDate(p?.emiratesIdExpiry) }]
            : []),
        ...(p?.passportExpiry?.length
            ? [{ key: '12', label: 'Passport Expiry', children: renderDate(p?.passportExpiry) },]
            : []),
        { key: '13', label: 'Work Location', children: readableText(p?.workLocation || '-') },
    ];

    const medicalInfo = [
        { key: '4', label: 'Medical Condition', children: readableText(p?.medicalCondition || '-') },
        ...(p?.specifyCondition?.length
            ? [{ key: '5', label: 'Specify Condition', children: readableText(p?.specifyCondition || '-') }]
            : []),
        ...(p?.specifyAllergies?.length
            ? [{ key: '6', label: 'Specify Allergies', children: readableText(p?.specifyAllergies || '-') },]
            : []),
        { key: '7', label: 'Allergies', children: readableText(p?.allergies || '-') }
    ];

    const contactInfo = [
        { key: '1', label: 'Emergency Contact No', children: readableText(p?.emergencyContactNo || '-') },
        { key: '2', label: 'Emergency Contact Name', children: readableText(p?.emergencyContactName || '-') },
        { key: '3', label: 'Emergency Contact Relation', children: readableText(p?.relationship || '-') },
        { key: '4', label: 'Alternative Contact No', children: readableText(p?.alternateContactNo || '-') },
        { key: '7', label: 'Current Address', children: readableText(p?.currentAddress || '-') },
        { key: '8', label: 'Permanent Address', children: readableText(p?.permanentAddress || '-') },
    ];

    return (
        <>
            <InfoBlock title="Primary Info" items={primaryInfo} />
            <InfoBlock title="Medical Info" items={medicalInfo} />
            <InfoBlock title="Contact Info" items={contactInfo} />
        </>
    );
};

export const renderEmploymentDetails = (userdata) => {
    const p = userdata || {};

    const employmentInfo = [
        { key: '1', label: 'Designation', children: readableText(p?.designation || '-') },
        { key: '2', label: 'Date Of Joining', children: renderDate(p?.joiningDate) },
        { key: '3', label: 'Employment Type', children: readableText(p?.employmentType || '-') },
        { key: '4', label: 'Probation', children: readableText(p?.probation || '-') },
    ];

    return <InfoBlock title="Employment Info" items={employmentInfo} />;
};

export const renderDocs = (userdata) => {
    const p = userdata || {};

    const bankInfo = [
        { key: '7', label: 'Bank Name', children: readableText(p?.bankName || '-') },
        { key: '8', label: 'Account Holder Name', children: readableText(p?.accountHolder || '-') },
        { key: '9', label: 'Bank Branch', children: readableText(p?.bankBranch || '-') },
        { key: '10', label: 'Account Number', children: renderDate(p?.accountNumber) },
        { key: '11', label: 'IBAN', children: readableText(p?.iban || '-') },
    ];

    const documents = [
        ...(p?.workLocation === "KARACHI"
            ? [
                { key: '11', label: 'CNIC Files', children: renderPreviewImages(p?.cnic || "-") },
                { key: '12', label: 'Police Character Certificate', children: renderPreviewImages(p?.policeCharacter || "-") },
            ]
            : []),
        ...(p?.emiratesId?.length
            ? [{ key: '13', label: 'Emirates ID', children: renderPreviewImages(p.emiratesId) }]
            : []),
        ...(p?.visaCopy?.length
            ? [{ key: '14', label: 'Visa Copy', children: renderPreviewImages(p.visaCopy) }]
            : []),
        ...(p?.passportCopy?.length
            ? [{ key: '15', label: 'Passport Copy', children: renderPreviewImages(p.passportCopy) }]
            : []),
        { key: '16', label: 'Passport Size Photo', children: renderPreviewImages(p?.passportSizePhoto || "-") },
        { key: '17', label: 'Educational Certificates', children: renderPreviewImages(p?.educationalCertificates || "-") },
        { key: '18', label: 'Experience Letter', children: renderPreviewImages(p?.experienceLetter || "-") },
        { key: '19', label: 'Payslip', children: renderPreviewImages(p?.payslip || "-") },
    ];

    return (
        <>
            <InfoBlock title="Bank Info" items={bankInfo} />
            <InfoBlock title="Documents" items={documents} />
        </>
    );
};

export const renderRoleAndAccess = (userdata) => {
    const p = userdata || {};

    const userInfo = [
        { key: '1', label: 'Company Email', children: p?.user?.email || '-' },
        { key: '2', label: 'User Role', children: readableText(p?.user?.role || '-') },
        {
            key: '3', label: 'Kamelpay Microsoft User', children: <Tag color={p?.user?.isKamelpayMicrosoftUser ? "green" : "red"} className="approval-tag">
                {p?.user?.isKamelpayMicrosoftUser ? "Yes" : "No"}
            </Tag>
        },
    ];

    const employmentInfo = [
        { key: '4', label: 'Microsoft 365', children: readableText(p?.accessRights?.microsoft365 || '-') },
        { key: '5', label: 'Teams', children: readableText(p?.accessRights?.teams || '-') },
        { key: '6', label: 'Power BI', children: readableText(p?.accessRights?.powerBI || '-') },
        { key: '7', label: 'MS Office Apps', children: readableText(p?.accessRights?.msOfficeApps || '-') },
        { key: '8', label: 'Portals', children: readableText(p?.accessRights?.portals || '-') },
        { key: '9', label: 'Web Oops', children: readableText(p?.accessRights?.webOops || '-') },
        { key: '10', label: 'Intellicon Contegris', children: readableText(p?.accessRights?.intelliconContegris || '-') },
        { key: '11', label: 'Database Access', children: readableText(p?.accessRights?.databaseAccess || '-') },
        { key: '12', label: 'Git Repository', children: readableText(p?.accessRights?.gitRepository || '-') },
        { key: '13', label: 'Jira', children: readableText(p?.accessRights?.jira || '-') },
        { key: '14', label: 'Postman', children: readableText(p?.accessRights?.postman || '-') },
        { key: '15', label: 'AWS IAM Roles', children: readableText(p?.accessRights?.awsIamRoles || '-') },
        { key: '16', label: 'Server Access', children: readableText(p?.accessRights?.serverAccess || '-') },
        { key: '17', label: 'Datadog', children: readableText(p?.accessRights?.datadog || '-') },
        { key: '18', label: 'Laptop', children: readableText(p?.accessRights?.laptop || '-') },
        { key: '19', label: 'Laptop Brand', children: readableText(p?.accessRights?.brandName || '-') },
        { key: '20', label: 'Headphone', children: readableText(p?.accessRights?.headphone || '-') },
        { key: '21', label: 'Headphone Brand', children: readableText(p?.accessRights?.headphoneBrand || '-') },
        { key: '22', label: 'Welcome Pack', children: readableText(p?.accessRights?.welcomePack || '-') },
        { key: '23', label: 'Other', children: readableText(p?.accessRights?.other || '-') },
    ];

    return (
        <>
            <InfoBlock title="User Details" items={userInfo} />
            <InfoBlock title="Access Assets and Role" items={employmentInfo} />
        </>
    );
};

export const offBoardingData = (userdata) => {
    const p = userdata || {};

    const employmentInfo = [
        { key: '1', label: 'Resignation Reason', children: readableText(p?.resignationReason || '-') },
        { key: '2', label: 'Resignation Start Date', children: renderDate(p?.resignationStartDate || '-') },
        { key: '3', label: 'Resignation Details', children: htmlToPlainText(p?.resignationDetails || '-') },
        { key: '4', label: 'ResignationFile', children: renderPreviewImages(p?.ResignationFile || '-') },
    ];

    return <InfoBlock title="Offboarding Request Data" items={employmentInfo} />;
};

export const counterOfferData = (userdata) => {
    const p = userdata || {};
    const employmentInfo = [
        { key: '1', label: 'Revised Salary', children: readableText(p?.amount || '-') },
        { key: '2', label: 'New Designation', children: readableText(p?.newDesignation || '-') },
        { key: '3', label: 'Additional Benefits', children: readableText(p?.additionalBenefits || '-') },
    ];

    return <InfoBlock title="Counter Offer Data" items={employmentInfo} />;
};