import React from "react";
import "../../templates/style.scss";

const AuthorizationOne = ({ singleRowItem }) => {
  const {
    strBusinessUnitName,
    strBusinessUnitShortName,
    strRefDate,
    strDate,

    strBankName,

    strBranchName,
    strBranchAddress,
    strAccountType,
    strAccountNo,
    strMassengerName,
    strMessengerDesignation,
    strDocumentName,
    strBankShortName,
  } = singleRowItem;
  return (
    <>
      <div className="bank-letter-template-common-wrapper">
        <p style={{}}>
          <b>
            {" "}
            REF : {strBusinessUnitShortName}/{strBankShortName}
            /Doc/
            {strDate?.replaceAll("-", ".")}
          </b>
        </p>
        <p style={{ marginTop: "15px" }}>
          <b>Date : {strRefDate}</b>
        </p>
        <p style={{ marginTop: 35 }}>To</p>
        <p style={{ marginTop: "15px" }}>The Head of the Branch</p>
        <p style={{ marginTop: "15px" }}>{strBankName}</p>
        <p style={{ marginTop: "15px" }}>
          {`${strBranchName} `}
          {strBranchName?.toLowerCase().includes("branch") ? "" : "Branch"}
        </p>
        <p style={{ marginTop: "15px" }}>{strBranchAddress}</p>
        <p style={{ margin: "35px 0" }}>
          <b>
            Subject: Authorization to receive {strDocumentName} of{" "}
            {strBusinessUnitName} {strAccountType} A/c No-
            {strAccountNo}.
          </b>
        </p>
        <p style={{ marginTop: 35 }}>Dear Sir/ Madam,</p>
        <p>As-salamu alaykum</p>
        <p style={{ marginTop: "10px" }}>
          We do hereby authorize <strong> {strMassengerName} </strong>,{" "}
          {strMessengerDesignation}
          of our company to receive {` ${strDocumentName} `}
          of <span> </span>
          {` ${strBusinessUnitName} `}, A/C No-
          {strAccountNo}. His specimen signature is attested below.
        </p>
        <p style={{ marginTop: 35 }}>
          <b>The Specimen Signature of</b>
        </p>
        <p style={{ marginTop: 35 }}>.....................................</p>
        <p style={{ marginTop: "15px" }}>{strMassengerName}</p>
        <p style={{ marginTop: "15px" }}>{strMessengerDesignation}</p>
        <br />
        <p style={{ marginTop: 5 }}>Yours faithfully,</p>
        <p style={{ marginTop: 5 }}>
          For, <b>{strBusinessUnitName}</b>
        </p>
        <div style={{ marginTop: 65, display: "flex" }}>
          <div>Authorized Signature</div>
          <div style={{ marginLeft: 20 }}>Authorized Signature</div>
        </div>
      </div>
    </>
  );
};

export default AuthorizationOne;
