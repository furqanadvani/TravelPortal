import { Descriptions, Divider, Tag } from "antd";
import { renderDate, readableText, ConditionalRendering } from "../../utils/Methods";


export const adminApprovalRequestedFor = (obj) => {

    const reason = [
        {
            key: '1',
            label: 'Reason',
            children: readableText(obj?.reason || '-')
        },

    ];

    const items = [
        {
            key: '1',
            label: 'Full Name',
            children: readableText(obj?.userId?.username || '-')
        },
        {
            key: '2',
            label: 'Email',
            children: readableText(obj?.userId?.email || '-')
        },
        {
            key: '3',
            label: 'Role',
            children: readableText(obj?.userId?.role || '-')
        },
        {
            key: '3',
            label: 'KamelPay Microsoft User',
            children: <Tag className='approval-tag' color={obj?.userId?.isKamelPayMicrosoftUser ? 'green' : 'red'}>{readableText(obj?.userId?.isKamelPayMicrosoftUser ? 'Yes' : 'No' || '-')}</Tag>
        },
        {
            key: '4',
            label: 'Status',
            children: (
                <Tag
                    color={obj?.status === 'PENDING' || obj?.status === 'REJECTED' ? "red" : "green"}
                    className='approval-tag'
                >
                    {readableText(obj?.status || '-')}
                </Tag>
            )
        },
        {
            key: '5',
            label: 'Department',
            children: readableText(obj?.userId?.department?.title || '-')
        },

    ];

    return (
        <>
            <Divider orientation="left">User Details</Divider>
            <Descriptions
                size="small"
                layout="vertical"
                bordered
                items={items}
                className="custom-descriptions"
            />
            <ConditionalRendering
                condition={obj?.reason?.length}
                children={
                    <>
                        <Divider orientation="left">Reason</Divider>
                        <Descriptions
                            size="small"
                            layout="vertical"
                            bordered
                            items={reason}
                            className="custom-descriptions"
                        />
                    </>
                } />

        </>
    );
};

export const adminApprovalRequestedBy = (obj) => {

    const items = [
        {
            key: '1',
            label: 'Created By',
            children: obj?.createdBy?.username || '-'
        },
        {
            key: '2',
            label: 'Created By Email',
            children: obj?.createdBy?.email || '-'
        },
        {
            key: '3',
            label: 'Requested At',
            children: renderDate(obj?.createdAt)
        },
    ];

    return (
        <>
            <Divider orientation="left">Created By</Divider>
            <Descriptions
                size="small"
                layout="vertical"
                bordered
                items={items}
                className="custom-descriptions"
            />
        </>
    );
};
