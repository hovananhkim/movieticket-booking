import { message, notification } from "antd";
import "./notification.css";
export const NotificationType = {
  SUCCESS: "success",
  WARNING: "warning",
  INFO: "info",
  ERROR: "error",
};

export const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

export const success = (text) => {
  message.success(text, 2);
};

export const warning = (text) => {
  message.warning(text, 2);
};

export const error = (text) => {
  message.error(text, 2);
};
