import React from "react";
import "../../templates/style.scss";
import { amountToWords } from "../../../../../../_helper/_ConvertnumberToWord";

const FdrThree = ({ singleRowItem }) => {
  const {
    strBusinessUnitName,

    strRefDate,
    strDate,

    strBankName,

    strBranchName,
    strBranchAddress,
    strAccountType,

    strAccountName,
    numAmount,
    strMarginType,
    numProfitRate,
    intNumOfMonth,
  } = singleRowItem;

  return (
    <>
      <div class="bank-letter-template-common-wrapper authoFDR-wrapper">
        <p>
          Ref : {strBusinessUnitName?.toUpperCase()}/FDR/{strRefDate}
        </p>
        <p style={{ marginTop: "-8px" }}>Date : {strDate}</p>
        <br />
        <p>The Head of the Branch</p>
        <p>
          <strong>{strBankName?.toUpperCase()}</strong>
        </p>
        <p>
          <strong>
            {strBranchName}{" "}
            {strBranchName?.toLowerCase().includes("branch") ? "" : "Branch"}
          </strong>
        </p>
        <p>{strBranchAddress}</p>
        <br />
        <p>
          <strong>
            Subject: Issuance of FDR of BDT: {numAmount} as {strMarginType}{" "}
            Margin.
          </strong>
        </p>
        <br />
        <p>
          <strong>Dear Sir,</strong>
        </p>
        <p style={{ marginTop: "-8px" }}>
          We have the pleasure to inform you that the Management of the Company
          has decided to purchase {intNumOfMonth} Months FDR @ {numProfitRate}%
          profit p.a. for{" "}
          <strong>
            BDT. {numAmount} ({amountToWords(numAmount)?.toUpperCase()}) in the
            Name of {strAccountName?.toUpperCase()}
          </strong>{" "}
          with auto renewal facility.
        </p>
        <p style={{ marginTop: "-8px" }}>
          By debiting our
          <strong>
            {" "}
            {strAccountType} A/C No. {strAccountName?.toUpperCase()}
          </strong>{" "}
          with your branch in the name of{" "}
          <strong> {strAccountName?.toUpperCase()}</strong> for the FDR and the
          same may kindly be arrange <strong>Lien with {strMarginType}</strong>{" "}
          of {strAccountName?.toUpperCase()}.
        </p>
        <br />
        <p>Thanking you,</p>
        <br />
        <p>
          <strong>For {strAccountName?.toUpperCase()} </strong>
        </p>
        <br />
        <br />
        <br />
        <div className="d-flex">
          <p>Authorized Signature</p>
          <p style={{ marginLeft: "35px" }}>Authorized Signature</p>
        </div>
      </div>
    </>
  );
};

export default FdrThree;
