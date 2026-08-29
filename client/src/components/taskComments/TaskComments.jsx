import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Segmented, List, Button, Mentions, Empty } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { SendOutlined, MessageOutlined, HistoryOutlined } from "@ant-design/icons";
import "./TaskComments.css";
import { UserAvatar } from "../userAvatar/UserAvatar";
import { getComments, addComments } from "../../store/actions/Task.action";
import { renderDate, renderTime } from "../../utils/Methods";
import TaskHistory from "../taskHistory/TaskHistory";
import { fetchNonHRUsers } from "../../store/actions/Users.action";

const { Option } = Mentions;

// Escapes regex special characters in a username before building the mention pattern
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Splits comment text and wraps recognised usernames in a highlighted chip.
// Pulled out of renderItem so the regex isn't rebuilt on every keystroke/re-render.
const highlightMentions = (text, usernames) => {
  if (!usernames.length || !text) return text;

  const mentionRegex = new RegExp(`@?(${usernames.map(escapeRegex).join("|")})`, "g");

  return text
    .split(mentionRegex)
    .filter(Boolean)
    .map((part, index) =>
      usernames.includes(part) ? (
        <span key={index} className="mention-tag">
          @{part}
        </span>
      ) : (
        <span key={index}>{part} </span>
      )
    );
};

const segmentOptions = [
  { label: <span><MessageOutlined /> Comments</span>, value: "Comments" },
  { label: <span><HistoryOutlined /> History</span>, value: "History" },
];

const TaskComments = () => {
  const dispatch = useDispatch();

  const { userId, taskDetails, comments, loading, getUsers, getCommentsLoading } = useSelector(
    ({ task, auth, users }) => ({
      userId: auth?.user?._id,
      taskDetails: task?.getTaskDetails,
      comments: task?.comments || [],
      loading: task?.addCommentsLoading,
      getCommentsLoading: task?.getCommentsLoading,
      getUsers: users?.getNonHrUsers || [],
    })
  );

  const taskId = taskDetails?.id;

  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("Comments");

  useEffect(() => {
    if (taskId) dispatch(getComments({ taskId }));
  }, [taskId, dispatch]);

  useEffect(() => {
    dispatch(fetchNonHRUsers());
  }, [dispatch]);

  const addCommentCallBack = useCallback(() => {
    setNewComment("");
    dispatch(getComments({ taskId: taskDetails?.id }));
  }, [dispatch, taskDetails?.id]);

  const handleAddComment = useCallback(() => {
    const val = newComment.trim();
    if (!val) return;

    const payload = {
      taskId: taskDetails?.id,
      commenterId: userId,
      commentText: val,
    };
    dispatch(addComments(payload, addCommentCallBack));
  }, [newComment, dispatch, taskDetails?.id, userId, addCommentCallBack]);

  // Scroll to latest comment
  useEffect(() => {
    const container = document.querySelector(".messagedata .ant-list");
    if (container) container.scrollTop = container.scrollHeight;
  }, [comments]);

  // Usernames only need to be recomputed when the user list actually changes
  const usernames = useMemo(() => getUsers?.map((u) => u.firstName) || [], [getUsers]);

  return (
    <div className="taskComment-parent">
      <div className="taskComment-container">
        <div className="taskComment-segment">
          <Segmented options={segmentOptions} value={activeTab} onChange={setActiveTab} block />
        </div>

        {activeTab === "Comments" && (
          <div className="messagedata-main">
            <div className="messagedata">
              <List
                loading={getCommentsLoading}
                dataSource={comments}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No comments yet. Start the conversation!"
                    />
                  ),
                }}
                renderItem={(item) => {
                  const isOwnComment = item?.commenterId?._id === userId;
                  return (
                    <List.Item
                      key={item._id || item.id}
                      className={`comment-row${isOwnComment ? " own-comment" : ""}`}
                    >
                      <div className="comment-bubble-wrapper">
                        <UserAvatar
                          className="taskComment-avatar"
                          name={item?.commenterId?.firstName}
                        />
                        <div className="comment-bubble">
                          <div className="taskComments-profile">
                            <h6 className="taskComments-userName">
                              {`${item?.commenterId?.firstName || ""} ${item?.commenterId?.lastName || ""}`}
                            </h6>
                            <div className="taskComments-nameTime">
                              <span className="taskComments-createdAt">
                                {renderDate(item.createdAt)}
                              </span>
                              <span className="taskComments-separator">·</span>
                              <span className="taskComments-createdAt">
                                {renderTime(item.createdAt)}
                              </span>
                            </div>
                          </div>
                          <p className="taskComments-message">
                            {highlightMentions(item.commentText, usernames)}
                          </p>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>

            <div className="taskComment-description">
              <Mentions
                className="comment-input"
                placeholder="Type a comment... use @ to mention someone"
                value={newComment}
                onChange={setNewComment}
                maxLength={250}
                autoSize={{ minRows: 3, maxRows: 6 }}
              >
                {getUsers?.map((user) => (
                  <Option key={user._id} value={user.username}>
                    {user.username}
                  </Option>
                ))}
              </Mentions>

              <div className="taskComment-footer">
                <span className="char-counter">{newComment.length}/250</span>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleAddComment}
                  loading={loading}
                  disabled={loading || !newComment.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "History" && (
          <div className="history-tab">
            <TaskHistory actions={taskDetails?.actions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskComments;