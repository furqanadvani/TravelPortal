import React, { useEffect, useState } from 'react';
import { CountCards, OrganizationView, TasksTableView, Notification } from '../../components';
import './Dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { ConditionalRendering } from '../../utils/Methods';
import { Button } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import CreateTaskModal from '../../components/createTaskModal/CreateTaskModal';
import { generateStructuredPDF } from './Helper';
import { fetchNonHRUsers, getUserStats } from '../../store/actions/Users.action';
import ErrorBoundary from './ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { useACL } from '../../utils/acl/UseACL';
import { ACL_ACCESS_LIST, ACL_MODULES } from '../../utils/acl/Index';
import { message } from 'antd';

const DashBoard = () => {

  const { userName, userRole, departments, userStates, employees, userStatsLoading, userStats } = useSelector(({ auth, departments, users }) => ({
    userName: `${auth?.user?.firstName} ${auth?.user?.lastName}` || 'Unknown User',
    userRole: auth?.user?.role || 'Unknown Role',
    departments: departments?.getDepartmentsData,
    userStates: users?.userStats,
    employees: users?.getNonHrUsers,
    userStats: users?.userStats || {},
    userStatsLoading: users.userStatsLoading
  }));

  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { can } = useACL();

  const canCreateTask = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.CREATE);
  const canViewTask = can(ACL_MODULES.TASK, ACL_ACCESS_LIST.VIEW);
  const canViewDepartment = can(ACL_MODULES.DEPARTMENT, ACL_ACCESS_LIST.VIEW);

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      await generateStructuredPDF({
        userName,
        userRole,
        departments: departments || [],
        employees: employees || [],
        userStates
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getUserStats());
    if (userRole !== 'EMPLOYEE') {
      dispatch(fetchNonHRUsers())
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <ErrorBoundary>
      <div className='dashboard-container'>
        <div className="dashboard-bg"></div>
        <div className="dashboard-wrapper">
          <div className="dashboard-header">
            <div className="header-title-name">
              <h3>Dashboard</h3>
            </div>
            <div className="dashboard-header-right">
              <Button
                type="default"
                shape="round"
                icon={<DownloadOutlined />}
                size="large"
                onClick={handleExportPDF}
                loading={loading}
                disabled={loading}
              >
                <span className="btn-text">Export Report</span>
              </Button>

              <ConditionalRendering
                condition={canCreateTask}
                children={
                  <Button
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsOpenCreateTaskModal(true)}
                  >
                    <span className="btn-text">New Task</span>
                  </Button>} />
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-counts margin-top_20">
              <CountCards stats={userStats} type={'stats'} loading={userStatsLoading} onCardClick={(item) => {
                navigate("/task-history", {
                  state: { status: item.status === 'TOTAL' ? 'all' : item.status }
                });
              }} />
            </div>

            <ConditionalRendering
              condition={canViewTask}
              children={
                <div className="dashboard-teams-section">
                  <TasksTableView />
                </div>}
            />

            <ConditionalRendering
              condition={canViewDepartment}
              children={
                <div className="dashboard-teams-section">
                  <OrganizationView departments={departments} />
                </div>
              }
            />
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpenAddModal={isOpenCreateTaskModal}
        setIsOpenAddModal={setIsOpenCreateTaskModal}
      />
    </ErrorBoundary>
  );
};

export default DashBoard;