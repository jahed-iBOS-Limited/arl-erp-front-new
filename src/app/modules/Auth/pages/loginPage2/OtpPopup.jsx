import React, { useState, useEffect } from "react";
import Loading from "../../../_helper/_loading";
import { otpSendAndVerify } from "../../_redux/Auth_Actions";
import ReactCodeInput from "react-verification-code-input";

const OtpPopup = ({ setIsOtp, loginAction, userId,token }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (document.querySelector("div[tabindex='-1']")) {
        document
          .querySelector("div[tabindex='-1']")
          .removeAttribute("tabindex");
      }
    }, 5000);
  }, []);

  return (
    <div className="token-expired otp-popup">
      {loading && <Loading />}
      <div className="expired-content">
        <form className="expired-form">
          <p className="text-left">Enter OTP</p>
          <ReactCodeInput className="otp-box" value={otp} onChange={(value) => setOtp(value)} />
          <div className="text-right mt-3">
            <button
              className="btn btn-primary mr-1"
              type="button"
              onClick={(e) => {
                if (otp?.length < 6) return alert("Please enter valid otp");
                otpSendAndVerify(token, setLoading,userId, 2, otp, loginAction);
              }}
            >
              Submit
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => {
                setIsOtp(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpPopup;
