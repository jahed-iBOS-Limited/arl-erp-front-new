import React from "react";
import "../../templates/style.scss";

const AccountCloseFour = ({ singleRowItem }) => {
  const {
    intBankLetterTemplatePrintId,
    intBusinessUnitId,
    strBusinessUnitName,
    strBusinessUnitShortName,
    strRefDate,
    strDate,
    strBrdate,
    intBankId,
    strBankName,
    strBankShortName,
    strBranchId,
    strBranchName,
    strBranchAddress,
    strAccountType,
    intBankLetterTemplateId,
    strBankLetterTemplateName,
    intTemplateTypeId,
    strTemplateTypeName,
    isActivce,
    dteCreateDate,
    intCreateBy,
    dteUpdateDate,
    dteUpdateBy,
    strAccountNo,
    strAccountName,
  } = singleRowItem;
  return (
    <>
      <div className="bank-letter-template-common-wrapper">
        <div>
          <br />
          <div>
            <p>
              <strong>
                Ref : {strBusinessUnitName}/{strBankShortName}
                /AC-CLO/{strRefDate}
              </strong>
            </p>
            <p>
              <strong>Date : {strDate}</strong>
            </p>
          </div>
          <br />

          <div>
            <p>The Manager</p>
            <p>
              <strong>{strBankName}</strong>
            </p>
            <p>
              <strong>{strBranchName}</strong>
            </p>
            <p>
              <strong>{strBranchAddress}</strong>
            </p>
          </div>
          <br />

          <div>
            <p>
              <strong>
                Subject: Closing of {strAccountType} Account No. {strAccountNo}{" "}
                of {strAccountName} with {strBankName}, {strBranchName}.
              </strong>
            </p>
          </div>
          <br />
          <br />

          <div>
            <p>
              <strong>Dear Sir,</strong>
            </p>

            <p>
              We have the honor to inform you that, we have a
              <strong>
                {" "}
                {strAccountType} Account No- {strAccountNo}
              </strong>{" "}
              with your branch which will no longer be required to maintain by
              us and we need to close it henceforth. In this regard a resolution
              has been passed to that effect in the meeting of The Board of
              Directors of the Company held on the <strong> {strBrdate}</strong>{" "}
              in the Corporate office of the company at Akij House, 198, Bir
              Uttam Mir Shawkat Sarak, Gulshan Link Road, Tejgaon, Dhaka 1208.
            </p>
            <br />
            <p>
              In view of above we are requesting you to close the above Bank
              Account and if any existing balance please give us a
              <strong> pay order</strong> in favor of
              <strong> {strAccountName}</strong> after deducting necessary
              charges and hand over the same with a statement & certificate of
              closing the account.
            </p>
            <br />
            <p>
              We are enclosing herewith the necessary documents for your early
              action.
            </p>
            <br />
            <br />
            <p>Yours faithfully,</p>
            <p>
              <strong>For, {strAccountName} </strong>
            </p>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div>
            <p>
              <strong>(SHEIKH JASIM UDDIN)</strong>
            </p>
            <p>
              <strong>Managing Director</strong>
            </p>
          </div>
        </div>
        <div
          style={{
            pageBreakAfter: "always",
          }}
        ></div>
        <div className="second-part">
          <p>
            EXTRACT OF THE MINUTES OF THE MEETING OF THE BOARD OF DIRECTORS OF
            <strong> {strAccountName}</strong> HELD ON THE
            <strong> {strBrdate}</strong> AT 11:30AM IN THE CORPORATE OFFICE OF
            THE COMPANY AT AKIJ HOUSE, 198, BIR UTTAM MIR SHAWKAT SARAK, GULSHAN
            LINK ROAD, TEJGAON, DHAKA 1208.
          </p>
          <p>
            The meeting was presided over by Ms. Faria Hossain, Chairman of the
            Company. The following Directors and Company Secretary were present.
          </p>
          <p style={{ marginTop: "20px" }}>
            <span>
              <strong>Mr. Sheikh Jasim Uddin</strong>
            </span>{" "}
            <span style={{ marginLeft: "100px" }}>Managing Director</span>{" "}
            <span style={{ marginLeft: "90px" }}>Sd/</span>
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
            <strong> {strBankName},</strong> <strong>{strBranchName}</strong>{" "}
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
          <br />

          <div>
            <p>
              <strong>(Sheikh Jasim Uddin)</strong>
            </p>
            <p>Managing Director</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountCloseFour;
