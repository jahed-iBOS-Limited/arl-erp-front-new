import React from "react";
import "../../templates/style.scss";
import { formatDate } from "../../../helper";

const AccountCloseTwo = ({ singleRowItem }) => {
  const {
    strBusinessUnitName,
    strRefDate,
    strDate,
    strBrdate,
    strBankName,
    strBankShortName,
    strBranchName,
    strBranchAddress,
    strAccountType,
    strAccountNo,
    strAccountName,
  } = singleRowItem;
  return (
    <>
      <div className="bank-letter-template-common-wrapper close-wrapper">
        <div>
          <div>
            <p>
              <strong>
                Ref : {strBusinessUnitName?.toUpperCase()}/{strBankShortName}
                /AC-CLO/{strRefDate}
              </strong>
            </p>
            <p style={{ marginTop: "-8px" }}>
              <strong>Date : {strDate}</strong>
            </p>
          </div>
          <br />

          <div>
            <p>The Head of the Branch</p>
            <p style={{ marginTop: "-7px" }}>
              <strong>{strBankName?.toUpperCase()}</strong>
            </p>
            <p style={{ marginTop: "-7px" }}>
              <strong>
                {strBranchName}
                {strBranchName?.toLowerCase().includes("branch")
                  ? ""
                  : " BRANCH"}
              </strong>
            </p>
            <p style={{ marginTop: "-7px" }}>
              <strong>{strBranchAddress}</strong>
            </p>
          </div>
          <br />

          <div>
            <p>
              <strong>
                Subject: Closing of {strAccountType} Account No. {strAccountNo}{" "}
                of {strAccountName?.toUpperCase()} with{" "}
                {strBankName?.toUpperCase()}, {strBranchName}{" "}
                {strBranchName?.toLowerCase().includes("branch")
                  ? ""
                  : "BRANCH"}
                .
              </strong>
            </p>
          </div>
          <br />
          <br />
          <div>
            <p>
              <strong>Dear Sir,</strong>
            </p>
            <p style={{ marginTop: "-2px" }}>
              We have the honor to inform you that, we have a
              <strong>
                {" "}
                {strAccountType} Account No- {strAccountNo}{" "}
              </strong>
              with your branch which will no longer be required to maintain by
              us and we need to close it henceforth. In this regard a resolution
              has been passed to that effect in the meeting of The Board of
              Directors of the Company held on the{" "}
              <strong> {formatDate(strBrdate)}</strong> in the Corporate office
              of the company at Akij House, 198, Bir Uttam Mir Shawkat Sarak,
              Gulshan Link Road, Tejgaon, Dhaka 1208.
            </p>
            <p style={{ marginTop: "-3px" }}>
              In view of above we are requesting you to close the above Bank
              Account and if any existing balance please give us a
              <strong> pay order</strong> in favor of
              <strong> {strAccountName?.toUpperCase()}</strong> after deducting
              necessary charges and hand over the same with a statement &
              certificate of closing the account.
            </p>

            <p>
              We are enclosing herewith the necessary documents for your early
              action.
            </p>
            <br />
            <br />
            <p>Yours faithfully,</p>
            <p>
              <strong>For, {strAccountName?.toUpperCase()} </strong>
            </p>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div>
            <p>
              <strong>(Sheikh Jasim Uddin)</strong>
            </p>
            <p style={{ marginTop: "-7px" }}>
              <strong>Managing Director</strong>
            </p>
          </div>
        </div>
        <div
          style={{
            pageBreakAfter: "always",
          }}
        ></div>
        <div className="second-part" style={{ fontSize: "15px" }}>
          <p>
            EXTRACT OF THE MINUTES OF THE MEETING OF THE BOARD OF DIRECTORS OF
            <strong> {strAccountName?.toUpperCase()}</strong> HELD ON THE
            <strong> {formatDate(strBrdate)}</strong> AT 11:30AM IN THE
            CORPORATE OFFICE OF THE COMPANY AT AKIJ HOUSE, 198, BIR UTTAM MIR
            SHAWKAT SARAK, GULSHAN LINK ROAD, TEJGAON, DHAKA 1208.
          </p>
          <p>
            The meeting was presided over by Ms. Faria Hossain, Chairman of the
            Company. The following Directors and Company Secretary were present.
          </p>
          <p style={{ marginTop: "20px" }}>
            <span>
              <strong>Mr. Sheikh Jasim Uddin</strong>
            </span>{" "}
            <span style={{ marginLeft: "88px" }}>Managing Director</span>{" "}
            <span style={{ marginLeft: "78px" }}>Sd/</span>
          </p>
          <p>
            <span>
              <strong>Ms. Faria Hossain</strong>
            </span>
            {}
            <span style={{ marginLeft: "145px" }}>Chairman</span>{" "}
            <span style={{ marginLeft: "150px" }}>Sd/</span>
          </p>
          <br />

          <p>
            The Following resolutions were passed unanimously for the interest
            of the business of the company.
          </p>
          <p>a) The notice convening the meeting duly read and confirmed.</p>
          <p>
            b) The minutes of the last meeting were read, discussed and
            confirmed.
          </p>
          <p>
            c) After threadbare discussions the Directors present agreed and
            decided to close the
            <strong>
              {" "}
              {strAccountType} Account No- {strAccountNo}
            </strong>{" "}
            with
            <strong> {strBankName?.toUpperCase()},</strong>{" "}
            <strong>
              {strBranchName}{" "}
              {strBranchName?.toLowerCase().includes("branch") ? "" : "BRANCH"}
            </strong>{" "}
            which will be no longer required to maintain by the company. In view
            of above the board of the Company be and is hereby approved to take
            necessary steps in regard to close the above Bank Account
            immediately.
          </p>
          <p>
            d) Further resolved that the Managing Director of the Company and
            the Chairman of the meeting be and are authorized to issue any
            extract of the minutes as and when necessary.
          </p>
          <br />
          <p>The meeting ended with vote of thanks to the chair.</p>
          <br />

          <br />
          <br />

          <div>
            <p>
              <strong>(Sheikh Jasim Uddin)</strong>
            </p>
            <p style={{ marginTop: "-7px" }}>Managing Director</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountCloseTwo;
