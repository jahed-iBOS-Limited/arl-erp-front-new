import React from "react";

const TypingAnimation = ({ currentChatUser }) => {
  return (
    <div className="dots">
      {/* <div className="online typeIndicator"></div>
      <div className="online typeIndicator"></div>
      <div className="online typeIndicator"></div> */}
      <div> {currentChatUser?.name} typing...</div>
    </div>
  );
};

export default TypingAnimation;
