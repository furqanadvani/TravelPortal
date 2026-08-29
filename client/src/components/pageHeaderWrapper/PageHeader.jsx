import { FaArrowLeftLong } from 'react-icons/fa6'
import { ConditionalRendering } from '../../utils/Methods'
import './PageHeader.css'
import { useNavigate } from 'react-router-dom'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { deleteDepartment } from "../../store/actions/Departments.action"
import { useDispatch } from 'react-redux'
import AddMember from '../addMember/AddMember'
import AddDepartmentMember from '../addDepartmentMember/AddDepartmentMember'
import { useACL } from '../../utils/acl/UseACL'
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index'
import { useState } from 'react'

const PageHeader = ({
    renderBack = false,
    departmentId,
    title,
    subtitle,
    renderTeamButton = false,
    teamId = "",
    isOpenAddModal,
    setIsOpenAddModal = false,
    renderAddMemberButton = false,
    isAddMember,
    setIsAddMember = false,
    onMemberAdded,
    renderRoleButton = false,
    renderButtonDynamicly
}) => {

    const { can } = useACL()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [deleting, setDeleting] = useState(false)

    const canAddRole = can(ACL_MODULES.MANAGE_ROLES, ACL_ACCESS_LIST.CREATE)
    const canAddMember = can(ACL_MODULES.MEMBERS, ACL_ACCESS_LIST.ADD)

    const handleDeleteTeam = () => {
        if (!teamId) {
            message.error("Department ID is missing!");
            return;
        }
        setDeleting(true);
        dispatch(deleteDepartment({ id: teamId }, () => {
            setDeleting(false);
            navigate(-1);
        }));
    };

    // Consolidated action buttons — same visual pattern, different label/handler/condition
    const actionButtons = [
        {
            key: 'team-member',
            show: canAddMember && renderTeamButton,
            label: 'Add Member',
            onClick: () => setIsOpenAddModal(true),
        },
        {
            key: 'member',
            show: canAddMember && renderAddMemberButton,
            label: 'Add Member',
            onClick: () => setIsAddMember(true),
        },
        {
            key: 'role',
            show: canAddRole && renderRoleButton,
            label: 'Add Role',
            onClick: () => navigate('/addEdit-role'),
        },
    ];

    return (
        <div className="header-wrapper-main">
            <div className="header-wrapper-container">
                <div className="header-wrapper-left">
                    <ConditionalRendering
                        condition={renderBack}
                        children={
                            <div className="header-wrapper-icon">
                                <button
                                    className="back-button"
                                    onClick={() => navigate(-1)}
                                    aria-label="Go back"
                                >
                                    <FaArrowLeftLong />
                                </button>
                            </div>
                        }
                    />
                    <div className="wrapper-heading">
                        <h4>{title}</h4>
                        <ConditionalRendering
                            condition={subtitle}
                            children={<h6>{subtitle}</h6>}
                        />
                    </div>
                </div>

                <div className="header-wrapper-right">
                    {actionButtons.map(btn => (
                        <ConditionalRendering
                            key={btn.key}
                            condition={btn.show}
                            children={
                                <Button
                                    shape="round"
                                    size="large"
                                    type="primary"
                                    onClick={btn.onClick}
                                    icon={<PlusOutlined />}
                                >
                                    <span className="btn-text">{btn.label}</span>
                                </Button>
                            }
                        />
                    ))}

                    <ConditionalRendering
                        condition={renderButtonDynamicly}
                        children={typeof renderButtonDynamicly === "function" && renderButtonDynamicly()}
                    />
                </div>
            </div>

            <AddDepartmentMember
                isOpenAddModal={isOpenAddModal}
                setIsOpenAddModal={setIsOpenAddModal}
                departmentId={departmentId}
                title={title}
                onSuccess={onMemberAdded}
            />
            <AddMember
                isAddMember={isAddMember}
                setIsAddMember={setIsAddMember}
                onSuccess={onMemberAdded}
            />
        </div>
    )
}

export default PageHeader