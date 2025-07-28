import React from "react";

function ChatMessage({ msg, own }) {
  const formatChatTime = (timestamp) => {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const timeDiff = Math.abs(now - messageTime);
    const minutesDiff = Math.floor(timeDiff / 60000);
    if (minutesDiff < 1) {
      return "Just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
    } else if (messageTime.toDateString() === now.toDateString()) {
      const options = { hour: "numeric", minute: "numeric" };
      return `Today at ${messageTime.toLocaleTimeString("en-US", options)}`;
    } else {
      const options = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return messageTime.toLocaleString("en-US", options);
    }
  };

  return (
    <>
      <div className={`msg-${own}`}>
        <div className="msg">{msg.text}</div>
        <div className="msg-time">
          {formatChatTime(new Date(msg.time).toLocaleString())}
        </div>
      </div>
    </>
  );
}

export default ChatMessage;
