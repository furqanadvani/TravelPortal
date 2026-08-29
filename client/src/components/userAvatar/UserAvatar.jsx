import { Avatar } from "antd";
import { getInitials, getGradientFromName } from "../../utils/Methods";

export const UserAvatar = ({ name, size = 40, className = "" }) => {
  return (
    <Avatar
      className={`user-avatar-custom ${className}`}
      style={{ background: getGradientFromName(name) }}
    >
      {getInitials(name)}
    </Avatar>
  );
};