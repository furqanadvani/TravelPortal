import React, { useEffect, useState, useCallback } from 'react';
import { Comments } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTask } from '../../store/actions/Task.action';
import './TaskHistoryList.css';
import { EyeOutlined } from '@ant-design/icons';
import { getTaskQueryFilters, PRIORITY, readableText, renderDate, renderTag, STATUS_ARR_OBJ, TASK_PRIORITY_COLORS, TASK_STATUS_ICONS } from '../../utils/Methods';
import { UserAvatar } from '../../components/userAvatar/UserAvatar';
import { FaRegComments } from "react-icons/fa6";
import { checkAssignTo } from './Helper';
import { CTable } from '../../uiComponents';
import ContainerWrapper from '../../container/containerWrapper/ContainerWrapper';
import CSelect from '../../uiComponents/cSelect/CSelect';
import { Table } from 'antd';

const TaskHistoryList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tasks, tasksLoading, metaData } = useSelector(({ task }) => ({
    tasks: task?.getUserTasks,
    metaData: task?.getUserTasksMetaData,
    tasksLoading: task?.getUserTasksLoading,
  }));

  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const queryFilters = getTaskQueryFilters(location);
    if (queryFilters.page) setPage(Number(queryFilters.page));
    if (queryFilters.limit) setLimit(Number(queryFilters.limit));
  }, [location]);

  useEffect(() => {
    const payload = {
      page,
      limit,
      ...filters,
    };

    dispatch(getAllTask(payload));
  }, [page, limit, filters]);

  const handleFilterChange = (value, name) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    setPage(1);
    navigate(`?page=1&limit=${limit}`);
  };

  const handlePageChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
    navigate(`?page=${newPage}&limit=${newLimit}`);
  };

  const assignToRenderer = (val) => {
    if (val) {
      return val?.map(u => u?.username)
    } else {
      return '-'
    }
  }


  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (val, record) => (
        <div className="title-priority">
          {val}
          {TASK_PRIORITY_COLORS(record.priority)}
        </div>
      ),
    },
    {
      title: 'Task Type',
      dataIndex: 'type',
      render: (val) => val ? readableText(val) : "-",
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (date) => date ? renderDate(date) : "-",
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      render: (obj) => obj ? readableText(obj?.username) : "-",
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      render: (val, obj) => obj.type === 'MEMO' ? 'Assign To Department' : assignToRenderer(val),
    },
    {
      title: 'Department',
      dataIndex: 'assignedTo',
      render: (assignedTo) => assignedTo ? renderTag(assignedTo[0]?.department[0]?.title) : "-",
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (taskStatus) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {TASK_STATUS_ICONS[taskStatus]}
          {readableText(taskStatus)}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (date) => date ? renderDate(date) : "-",
    },
    {
      title: 'Actions',
      dataIndex: 'Actions',
      render: (_, obj) => (
        <div className='d-flex align-items-center gap-10 comments-icon'>
          <FaRegComments onClick={() => { setIsOpenCommentModal(true); setSelected(obj._id); }} />
          <span
            onClick={() => navigate(`/task-details/${obj._id}`)}
            style={{ cursor: "pointer", marginLeft: 10 }}
          >
            <EyeOutlined />
          </span>
        </div>
      ),
    },
  ];
  const pageHeaderProps = {
    title: 'Tasks',
  }
  return (
    <ContainerWrapper pageHeaderProps={pageHeaderProps}>
      <div className="department-detail-container">
        <div className="table-wrapper">
          <div className="page-header-filters">
            <div className="status-filter">
              <CSelect
                title='Priority'
                name="priority"
                data={PRIORITY}
                onChange={handleFilterChange}
              />
            </div>
            <div className="status-filter">
              <CSelect
                title='Status'
                name="status"
                data={STATUS_ARR_OBJ}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <CTable
            columns={columns}
            data={tasks || []}
            loading={tasksLoading}
            pagination={{
              total: metaData?.total || 0,
              pageSize: limit,
              current: page,
              onChange: handlePageChange,
            }}
            expandable={{
              expandedRowRender: (record) => {
                if (
                  (record.type === "USER_ONBOARDING" || record.type === "USER_OFF_BOARDING") && record.linkedTasks?.length
                ) {
                  const columns = [
                    {
                      title: 'Title',
                      dataIndex: 'title',
                      render: (val, record) => (
                        <div className="title-priority">
                          {val}
                          {TASK_PRIORITY_COLORS(record.priority)}
                        </div>
                      ),
                    },
                    {
                      title: 'Deadline',
                      dataIndex: 'deadline',
                      render: (date) => date ? renderDate(date) : "No Deadline",
                    },
                    {
                      title: 'Assigned By',
                      dataIndex: 'assignedBy',
                      render: (obj) => (
                        <div className='d-flex align-item-center gap-10'>
                          <UserAvatar name={obj?.username || "Assigned By System"} /> {readableText(obj?.username || "Assigned By System")}
                        </div>
                      ),
                    },
                    {
                      title: 'Assigned To',
                      dataIndex: 'assignedTo',
                      render: (val) => assignToRenderer(val),
                    },
                    {
                      title: 'Department',
                      dataIndex: 'assignedTo',
                      render: (assignedTo) => assignedTo[0]?.department[0]?.title,
                    },

                    {
                      title: 'Status',
                      dataIndex: 'status',
                      render: (taskStatus) => (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {TASK_STATUS_ICONS[taskStatus]}
                          {readableText(taskStatus)}
                        </span>
                      ),
                    },
                    {
                      title: 'Actions',
                      dataIndex: 'Actions',
                      render: (_, obj) => (
                        <div className='d-flex align-items-center gap-10 comments-icon'>
                          <FaRegComments onClick={() => { setIsOpenCommentModal(true); setSelected(obj._id); }} />
                          <span
                            onClick={() => navigate(`/task-details/${obj._id}`)}
                            style={{ cursor: "pointer", marginLeft: 10 }}
                          >
                            <EyeOutlined />
                          </span>
                        </div>
                      ),
                    },
                  ];
                  return <Table columns={columns} dataSource={record.linkedTasks} pagination={false} rowKey="_id" />;
                }
                return null;
              },
              rowExpandable: (record) => (record.type === "USER_ONBOARDING" || record.type === "USER_OFF_BOARDING") && record.linkedTasks?.length
            }}
          />
        </div>
      </div>

      <Comments
        isOpenCommentModal={isOpenCommentModal}
        setIsOpenCommentModal={setIsOpenCommentModal}
        selected={selected}
        setSelected={setSelected}
      />
    </ContainerWrapper>
  );
};

export default TaskHistoryList;