import React, { useEffect, useState } from "react";
import { Drawer, List, Input, Button, Skeleton, Empty } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { UserAvatar } from "../userAvatar/UserAvatar";
import { getComments, addComments } from "../../store/actions/Task.action";
import { renderDate, renderTime } from "../../utils/Methods";
import "./Comments.css";

const Comments = ({ isOpenCommentModal, setIsOpenCommentModal, selected, setSelected }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");

  const { user, userId, comments, loading, addCommentLoading } = useSelector(({ auth, task }) => ({
    user: auth?.user,
    userId: auth?.user?._id,
    comments: task?.comments || [],
    loading: task?.getCommentsLoading,
    addCommentLoading: task?.addCommentsLoading,
  }));

  useEffect(() => {
    if (isOpenCommentModal && selected) {
      dispatch(getComments({ taskId: selected }));
    }
  }, [selected, dispatch]);

  const handleClose = () => {
    setIsOpenCommentModal(false);
    setSelected?.(null);
  };

  const addCommentCallBack = () => {
    setNewComment("");
    dispatch(getComments({ taskId: selected }));
  };

  const handleAddComment = () => {
    const val = newComment.trim();
    if (!val) return;

    const payload = {
      taskId: selected,
      commenterId: userId,
      commentText: val,
    };
    dispatch(addComments(payload, addCommentCallBack));
  };

  const userName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Drawer
      title="Comments"
      placement="right"
      open={isOpenCommentModal}
      onClose={handleClose}
      width={420}
      bodyStyle={{ padding: 0, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div className="comments-list-wrapper">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
          ))
        ) : (
          <List
            dataSource={comments}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No comments yet"
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
                      name={item?.commenterId?.username || item?.name || "Unknown"}
                    />
                    <div className="comment-bubble">
                      <div className="taskComments-profile">
                        <h6 className="taskComments-userName">
                          {item?.commenterId?.username}
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
                      <p className="taskComments-message">{item.commentText}</p>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>

      <div className="comments-text">
        <UserAvatar name={userName} className="comments-avatar" />
        <Input.TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          className="comments-textarea"
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={handleAddComment}
          loading={addCommentLoading}
          disabled={addCommentLoading || !newComment.trim()}
        />
      </div>
    </Drawer>
  );
};

export default Comments;