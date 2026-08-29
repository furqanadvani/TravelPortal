import React from 'react';
import { Descriptions, Divider } from "antd";
import { readableText, renderDate, renderPreviewImages } from '../../utils/Methods';

export const renderPrimaryDetails = (userdata) => {
    const p = userdata?.personalDetails || {};

    const items = [
        { key: '1', label: 'First Name', children: p?.firstName || '-' },
        { key: '2', label: 'Last Name', children: p?.lastName || '-' },
        { key: '3', label: 'Father Name', children: p?.fatherName || '-' },
        { key: '4', label: 'Email', children: userdata?.email || '-' },
        { key: '5', label: 'Gender', children: readableText(p?.gender || '-') },
        { key: '6', label: 'Phone', children: readableText(p?.personalMobile || '-') },
        { key: '7', label: 'Current Address', children: readableText(p?.currentAddress || '-') },
        { key: '8', label: 'Permanent Address', children: readableText(p?.permanentAddress || '-') },
        { key: '9', label: 'Marital Status', children: readableText(p?.maritalStatus || '-') },
        { key: '10', label: 'Nationality', children: readableText(p?.nationality || '-') },
        { key: '11', label: 'Personal Email', children: readableText(p?.personalEmail || '-') },
        { key: '12', label: 'Date of Birth', children: renderDate(p?.dateOfBirth) },
        { key: '14', label: 'CNIC / Emirates ID', children: readableText(p?.governmentId || '-') },
        ...(p?.emiratesIdExpiry?.length
            ? [{ key: '15', label: 'Emirates Id Expiry', children: renderDate(p?.emiratesIdExpiry) }]
            : []),
        ...(p?.passportExpiry?.length
            ? [{ key: '16', label: 'Passport Expiry', children: renderDate(p?.passportExpiry) },]
            : [])
    ];

    return (

        <div style={{ marginBottom: 24 }}>
            <Divider orientation="left">Primary Information</Divider>
            <Descriptions

                size="medium"
                bordered
                items={items}
                column={3}
                layout="vertical"
                className="custom-descriptions"
            />
        </div>
    );
};

export const renderContactDetails = (userdata) => {
    const p = userdata?.personalDetails || {};

    const items = [
        { key: '1', label: 'Emergency Contact No', children: readableText(p?.emergencyContactNo || '-') },
        { key: '2', label: 'Emergency Contact Name', children: readableText(p?.emergencyContactName || '-') },
        { key: '3', label: 'Emergency Contact Relation', children: readableText(p?.relationship || '-') },
        { key: '4', label: 'Alternative Contact No', children: readableText(p?.alternateContactNo || '-') },
    ];

    return (
        <div style={{ marginBottom: 24 }}>
            <Divider orientation="left">Contact Information</Divider>
            <Descriptions
                size="medium"
                bordered
                items={items}
                column={2}
                layout="vertical"
                className="custom-descriptions"
            />
        </div>
    );
};

export const renderOnboardingDetails = (userdata) => {
    const p = userdata?.personalDetails || {};
    const q = userdata?.employementDetails || {};
    const r = userdata?.department[0] || {};

    const employmentInfo = [
        { key: '1', label: 'Designation', children: readableText(q?.designation || '-') },
        { key: '2', label: 'Probation', children: readableText(q?.probation || '-') },
        { key: '3', label: 'Employment Type', children: readableText(q?.employmentType || '-') },
        { key: '4', label: 'Date Of Joining', children: renderDate(q?.joiningDate) },
        { key: '5', label: 'Work Location', children: readableText(p?.workLocation || '-') },
        { key: '6', label: 'Department', children: readableText(r?.title || '-') },
    ];

    const bankInfo = [
        { key: '7', label: 'Bank Name', children: readableText(p?.bankName || '-') },
        { key: '8', label: 'Account Holder Name', children: readableText(p?.accountHolder || '-') },
        { key: '9', label: 'Bank Branch', children: readableText(p?.bankBranch || '-') },
        { key: '10', label: 'Account Number', children: renderDate(p?.accountNumber) },
        { key: '11', label: 'IBAN', children: readableText(p?.iban || '-') },
    ];

    const medicalInfo = [
        { key: '12', label: 'Medical Condition', children: readableText(p?.medicalCondition || '-') },
        ...(p?.specifyCondition?.length
            ? [{ key: '13', label: 'Specify Condition', children: readableText(p?.specifyCondition || '-') }]
            : []),
        { key: '15', label: 'Allergies', children: readableText(p?.allergies || '-') },
        ...(p?.specifyAllergies?.length
            ? [{ key: '14', label: 'Specify Allergies', children: readableText(p?.specifyAllergies || '-') },]
            : []),
    ];

    const documents = [
        { key: '16', label: 'CNIC Files', children: renderPreviewImages(p?.cnic || "-") },
        { key: '17', label: 'Police Character Certificate', children: renderPreviewImages(p?.policeCharacter || "-") },
        ...(p?.emiratesId?.length
            ? [{ key: '18', label: 'Emirates ID', children: renderPreviewImages(p.emiratesId) }]
            : []),
        ...(p?.visaCopy?.length
            ? [{ key: '19', label: 'Visa Copy', children: renderPreviewImages(p.visaCopy) }]
            : []),
        ...(p?.passportCopy?.length
            ? [{ key: '20', label: 'Passport Copy', children: renderPreviewImages(p.passportCopy) }]
            : []),
        { key: '21', label: 'Passport Size Photo', children: renderPreviewImages(p?.passportSizePhoto || "-") },
        { key: '22', label: 'Educational Certificates', children: renderPreviewImages(p?.educationalCertificates || "-") },
        { key: '23', label: 'Experience Letter', children: renderPreviewImages(p?.experienceLetter || "-") },
        { key: '24', label: 'Payslip', children: renderPreviewImages(p?.payslip || "-") },
    ];

    return (
        <div style={{ marginBottom: 24 }}>
            <Divider orientation="left">Employment Information</Divider>
            <Descriptions
                size="medium"
                bordered
                items={employmentInfo}
                column={3}
                className="custom-descriptions"
                layout="vertical"
            />

            <Divider orientation="left">Medical Information</Divider>
            <Descriptions
                size="medium"
                bordered
                items={medicalInfo}
                column={2}
                className="custom-descriptions"
                layout="vertical"
            />

            <Divider orientation="left">Bank Information</Divider>
            <Descriptions
                size="medium"
                bordered
                items={bankInfo}
                column={2}
                className="custom-descriptions"
                layout="vertical"
            />

            <Divider orientation="left">Documents</Divider>
            <Descriptions
                size="medium"
                bordered
                items={documents}
                column={3}
                className="custom-descriptions"
                layout="vertical"
            />
        </div>
    );
};

export const renderRoleAndAccess = (userdata) => {
    const p = userdata?.userAccessRights || {};

    const employmentInfo = [
        { key: '1', label: 'Role', children: readableText(userdata?.role || '-') },
        { key: '2', label: 'Microsoft 365', children: readableText(p?.microsoft365 || '-') },
        { key: '3', label: 'Teams', children: readableText(p?.teams || '-') },
        { key: '4', label: 'Power BI', children: readableText(p?.powerBI || '-') },
        { key: '5', label: 'MS Office Apps', children: readableText(p?.msOfficeApps || '-') },
        { key: '6', label: 'Portals', children: readableText(p?.portals || '-') },
        { key: '7', label: 'Web Oops', children: readableText(p?.webOops || '-') },
        { key: '8', label: 'Intellicon Contegris', children: readableText(p?.intelliconContegris || '-') },
        { key: '9', label: 'Database Access', children: readableText(p?.databaseAccess || '-') },
        { key: '10', label: 'Git Repository', children: readableText(p?.gitRepository || '-') },
        { key: '11', label: 'Jira', children: readableText(p?.jira || '-') },
        { key: '12', label: 'Postman', children: readableText(p?.postman || '-') },
        { key: '13', label: 'AWS IAM Roles', children: readableText(p?.awsIamRoles || '-') },
        { key: '14', label: 'Server Access', children: readableText(p?.serverAccess || '-') },
        { key: '15', label: 'Datadog', children: readableText(p?.datadog || '-') },

        { key: '16', label: 'Laptop', children: readableText(p?.laptop || '-') },
        { key: '17', label: 'Laptop Brand', children: readableText(p?.brandName || '-') },
        { key: '18', label: 'Headphone', children: readableText(p?.headphone || '-') },
        { key: '19', label: 'Headphone Brand', children: readableText(p?.headphoneBrand || '-') },
        { key: '20', label: 'Welcome Pack', children: readableText(p?.welcomePack || '-') },
        { key: '21', label: 'Other', children: readableText(p?.other || '-') },
    ];


    return (
        <div style={{ marginBottom: 24 }}>
            <Divider orientation="left">Access Assets and Role</Divider>
            <Descriptions
                size="medium"
                bordered
                items={employmentInfo}
                column={3}
                className="custom-descriptions"
                layout="vertical"
            />
        </div>
    );
};
