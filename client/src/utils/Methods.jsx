import { Image, message, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash'
import { BACKENDPATH, TOKEN } from './Constants';
import { FaCircleHalfStroke, FaRegCircle } from 'react-icons/fa6';
import { ClockCircleOutlined, CloseCircleOutlined, EyeInvisibleOutlined, FilePdfOutlined } from '@ant-design/icons';
import { FaRegDotCircle } from 'react-icons/fa';
import { HiFlag } from 'react-icons/hi';
import { TbFlag3Filled } from 'react-icons/tb';

export const readableText = (text) => {
  if (text === "HOD") {
    return "Head Of Department"
  } else {
    return text?.length ? _.capitalize(text)?.split("_").join(" ") : "";
  }
};

export const htmlToPlainText = (html = "") => {
  if (!html) return "-";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "-";
};

export const ConditionalRendering = ({ condition, children, elseChildren }) => {
  if (condition) {
    return children;
  } else if (elseChildren) {
    return elseChildren;
  }
  return null;
};

export const renderPreviewImages = (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) return "-";

  const openFile = (url) => {
    window.open(url, "_blank"); // PDF next screen
  };

  return (
    <div
      className="preview-images"
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      {files.map((file, index) => {
        const url = `${BACKENDPATH}/api/${file.path}`;
        const isImage = file?.mimetype?.startsWith("image");
        const isPdf = file?.mimetype === "application/pdf";

        if (isImage) {
          return (
            <Image
              key={index}
              src={url}
              alt={file.originalName || "image"}
              width={50}
              style={{
                borderRadius: 6,
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            />
          );
        }

        if (isPdf) {
          return (
            <div
              key={index}
              onClick={() => openFile(url)}
              style={{
                width: 50,
                height: 50,
                border: "1px solid #ddd",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#fafafa",
              }}
              title={file.originalName}
            >
              <FilePdfOutlined style={{ fontSize: 24, color: "#e74c3c" }} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export const handleSuccess = (val) => {
  message.success(val || 'Success');
};

export const handleError = (val) => {
  message.error(val || 'Something went wrong');
};

export const getInitials = (name) => {
  if (!name || !name.trim()) return "?";

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const first = words[0][0];
  const last = words[words.length - 1][0];
  return `${first}${last}`.toUpperCase();
};


const GRADIENT_PAIRS = [
  ['#0059F7', '#3B82F6'],   // primary blue (brand)
  ['#334155', '#64748B'],   // slate
  ['#0F766E', '#14B8A6'],   // muted teal
  ['#4338CA', '#6366F1'],   // indigo
  ['#0369A1', '#0EA5E9'],   // sky blue
  ['#57534E', '#78716C'],   // warm grey
  ['#1E40AF', '#3B82F6'],   // deep blue
  ['#065F46', '#10B981'],   // muted green
];

const hashName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getFullName = (user) => {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ");
};


export const getGradientFromName = (name) => {
  if (!name || !name.trim()) {
    const [from, to] = GRADIENT_PAIRS[0];
    return `linear-gradient(135deg, ${from}, ${to})`;
  }
  const index = hashName(name.trim().toLowerCase()) % GRADIENT_PAIRS.length;
  const [from, to] = GRADIENT_PAIRS[index];
  return `linear-gradient(135deg, ${from}, ${to})`;
};

export const clearLocalstorage = () => {
  localStorage.clear();
  localStorage.removeItem('authorization');
  localStorage.removeItem(TOKEN);
};

export const getColorFromName = (name) => {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'];
  if (!name || name.length < 2) return colors[0];
  let charCode = name.charCodeAt(0) + name.charCodeAt(1);
  return colors[charCode % colors.length];
};

export const getFirstTwoChars = (name) => {
  return name?.slice(0, 2).toUpperCase();
};

export const renderTime = (time = undefined) => {
  if (!time) {
    return "-";
  }
  return dayjs(time).format("hh:mm A")
}

export const renderDate = (date = null, status) => {
  if (date === null || date === undefined || date === "") {
    return "-";
  }

  return dayjs(date).isValid()
    ? dayjs(date).format("DD-MMM-YYYY")
    : "-";
};

export const TOPICS = {
  USER_ONBOARDING: "USER_ONBOARDING",
  USER_OFF_BOARDING: "USER_OFF_BOARDING"
};

export const TASK_TYPE_COLORS = {
  MEMO: {
    color: '#0059F7',
    background: '#F4F8FF'
  },
  TASK: {
    color: '#B05D00',
    background: '#FFF9F2'
  },
  BUG: {
    color: '#F90505',
    background: '#FEF2F2'
  }
};

export const TASK_STATUS_ICONS = {
  TODO: <FaRegCircle style={{ color: '#fa8c16' }} />,
  PENDING: <ClockCircleOutlined style={{ color: '#b9b4afff' }} />,
  IN_PROGRESS: <FaCircleHalfStroke spin style={{ color: '#1890ff' }} />,
  REVIEW: <EyeInvisibleOutlined style={{ color: '#722ed1' }} />,
  CLOSED: <CloseCircleOutlined style={{ color: '#000' }} />,
  COMPLETED: <FaRegDotCircle style={{ color: '#52c41a' }} />,
};

export const TASK_STATUS_COLORS = {
  pending: 'volcano',
  in_progress: 'geekblue',
  assigned: 'blue',
  review: 'purple',
  closed: 'green',
};

export const renderTag = (val) => {
  if (!val) return null;

  return (
    <Tag
      className='approval-tag'
      style={{
        color: '#69758B',
        backgroundColor: '#F4F8FF',
      }}
    >
      <span>{readableText(val)}</span>
    </Tag>
  );
};

export const TASK_PRIORITY_COLORS = (val) => {

  switch (val) {
    case "LOW":
      return <div>
        <Tag
          className='approval-tag'
          style={{
            color: '#69758B',
            backgroundColor: '#F4F8FF',
          }}
        >
          <span>{readableText(val)}</span>
          <HiFlag style={{ marginLeft: 4 }} />
        </Tag>
      </div>;
    case "MEDIUM":
      return <div><Tag
        className='approval-tag'
        style={{
          color: '#B05D00',
          backgroundColor: '#FFF9F2',
        }}
      >
        <span>{readableText(val)}</span>
        <HiFlag style={{ marginLeft: 4 }} />
      </Tag>
      </div>;
    case "HIGH":
      return <div>
        <Tag
          className='approval-tag'
          style={{
            color: '#F90505',
            backgroundColor: '#FEF2F2',
          }}
        >
          <span>{readableText(val)}</span>
          <HiFlag style={{ marginLeft: 4 }} />
        </Tag>
      </div>;
    default:
      return null;
  }
}



export const TASK_TYPE = [
  { key: 'ALL', label: 'All' },
  { key: 'USER_ONBOARDING', label: "Off Boarding", icon: <TbFlag3Filled style={{ color: "#F90505" }} /> },
  { key: 'USER_OFF_BOARDING', label: 'On Boarding', icon: <TbFlag3Filled style={{ color: "#0059F7" }} /> },
  { key: 'BUG', label: 'Bug', icon: <TbFlag3Filled style={{ color: "#0059F7" }} /> },
  { key: 'TASK', label: 'Task', icon: <TbFlag3Filled style={{ color: "#0059F7" }} /> },
  { key: 'MEMO', label: 'Memo', icon: <TbFlag3Filled style={{ color: "#b9b4afff" }} /> },
]

export const PRIORITY = [
  { key: 'ALL', label: 'All' },
  { key: 'HIGH', label: "High", icon: <TbFlag3Filled style={{ color: "#F90505" }} /> },
  { key: 'MEDIUM', label: 'Medium', icon: <TbFlag3Filled style={{ color: "#0059F7" }} /> },
  { key: 'LOW', label: 'Low', icon: <TbFlag3Filled style={{ color: "#b9b4afff" }} /> },
]

export const STATUS_ARR_OBJ = [
  { key: 'ALL', label: 'All' },
  { key: 'TODO', label: "Todo", icon: <FaRegCircle style={{ color: '#fa8c16' }} /> },
  { key: 'PENDING', label: 'Pending', icon: <ClockCircleOutlined style={{ color: '#b9b4afff' }} /> },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: <FaCircleHalfStroke spin style={{ color: '#1890ff' }} /> },
  { key: 'REVIEW', label: 'Review', icon: <EyeInvisibleOutlined style={{ color: '#722ed1' }} /> },
  { key: 'CLOSED', label: 'Closed', icon: <CloseCircleOutlined style={{ color: '#000' }} /> },
  { key: 'COMPLETED', label: 'Completed', icon: <FaRegDotCircle style={{ color: '#52c41a' }} /> },
]

export const formatCountsArray = (stats, type = 'stats') => {
  if (!stats) return [];

  if (type === 'stats') {
    return [
      { status: 'TOTAL', count: stats.total || 0 },
      { status: 'TODO', count: stats.TODO || 0 },
      { status: 'PENDING', count: stats.PENDING || 0 },
      { status: 'IN_PROGRESS', count: stats.IN_PROGRESS || 0 },
      { status: 'REVIEW', count: stats.REVIEW || 0 },
      { status: 'CLOSED', count: stats.CLOSED || 0 },
    ];
  } else if (type === 'leaveStats') {
    return [
      { status: "Total Leaves", count: stats?.totalLeaves || 0 },
      { status: "Annual Leaves", count: stats?.annual || 0 },
      { status: "Casual Leaves", count: stats?.casual || 0 },
      { status: "Sick Leaves", count: stats?.sick || 0 },
      { status: "Taken Leaves", count: stats?.taken?.length || 0 },
    ];
  }
};


export const stripHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, "");
};

/** 
  * @param { string } search
  * @returns { object }
*/
export const queryStringToObject = (search) => {
  if (!search) return {};
  return [...new URLSearchParams(search)].reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

/**
 * @param {object} location
 * @returns {object}
 */
export const getTaskQueryFilters = (location) => {
  const obj = queryStringToObject(location.search);
  const filters = {};

  Object.keys(obj).forEach((key) => {
    if (["from", "to", "dueDate"].includes(key)) {
      filters[key] = dayjs(obj[key]);
    } else {
      filters[key] = obj[key];
    }
  });

  return filters;
};