import React from "react";
import "../../templates/style.scss";

const BankCertificateOne = ({ singleRowItem }) => {
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
      <div className="bank-letter-template-common-wrapper bankCertificate-wrapper">
        <p style={{}}>
          <b>
            {" "}
            REF : ARL-Treasury/YCCert/{strBusinessUnitShortName}/
            {strBankShortName}/
            <span>Short Beginning Year (23)-Short Ending Year (24)</span>
          </b>
        </p>
        <p style={{ marginTop: "15px" }}>
          <b>Date : {strRefDate}</b>
        </p>
        <p style={{ marginTop: "35px" }}>The Head of the Branch</p>
        <p style={{ marginTop: "15px" }}>{strBankName}</p>
        <p style={{ marginTop: "15px" }}>
          {`${strBranchName} `}
          {strBranchName?.toLowerCase().includes("branch") ? "" : "Branch"}
        </p>
        <p style={{ marginTop: "15px" }}>{strBranchAddress}</p>
        <p style={{ margin: "35px 0" }}>
          <b>
            Subject: Request for different Bank Certificates - Balance
            Confirmation, UPAS Interest Expense & Liability position as of 30
            June <span>Ending Year</span> , and Interest & Tax deduction
            certificate for the fiscal year <span>Beginning Year (2023)</span>-{" "}
            <span> Ending Year (2024)</span> against <span>Account name</span>{" "}
            A/C No: {strAccountNo}
          </b>
        </p>
        <p style={{ marginTop: 35 }}>Dear Sir,</p>
        <p>As-salamu alaykum</p>
        <p style={{ marginTop: "10px" }}>
          With reference to the captioned subject, we would like to inform you
          that we have taken different financial facilities from your Bank
          during the fiscal year{" "}
          <span> Beginning Year (2023)-Ending Year (2024) </span>. Now, as per
          ITO-1984, we need to submit our company return, thus we are requesting
          the following relevant certificates for the fulfillment of our company
          return for the period of July <span> Beginning Year (2023)</span> to
          June Ending Year (2024).
        </p>
        <p>
          1. <strong>Balance Confirmation</strong> Certificate as of June 30,{" "}
          <span>Ending Year (2024)</span>;
        </p>
        <p>
          {" "}
          2. UPAS, Deferred LC & Loan Outstanding Position Certificate. as of
          June 30, <span>Ending Year (2024)</span>; and the{" "}
          <strong> Interest Charged </strong>
          against loans during the fiscal year{" "}
          <span> Beginning Year (2023)-Ending Year (2024).</span>
        </p>
        <p>
          3. Certificate for <strong> Total Interest received </strong>from
          accounts & <strong>Tax charged </strong> against it during the fiscal
          year <span>Beginning Year (2023)-Ending Year (2024);</span>
        </p>
        <p>
          {" "}
          4. Certificate for <strong> FDRs</strong> maintained by your bank
          during the fiscal year{" "}
          <span>Beginning Year (2023)-Ending Year (2024) </span>as per the
          attached format; 5. Export Proceeds Realization Certificate{" "}
          <strong>(PRC)</strong> for the fiscal year
          <span>Beginning Year (2023)-Ending Year (2024)</span> against relevant
          accounts.
        </p>
        <p>
          Please provide us with above said certificates as early as possible
          which will facilitate the timely submission of
          <strong> {` ${strBusinessUnitName?.toUpperCase()} `}</strong>’s Return
          file.
        </p>
        <p>We look forward to your kind cooperation.</p>

        <br />
        <p style={{ marginTop: 5 }}>Yours faithfully,</p>
        <p style={{ marginTop: 5 }}>
          For, <b>{strBusinessUnitName.toUpperCase()}</b>
        </p>
        <div style={{ marginTop: 45, display: "flex" }}>
          <div>Authorized Signature</div>
          <div style={{ marginLeft: 20 }}>Authorized Signature</div>
        </div>
      </div>
    </>
  );
};

export default BankCertificateOne;
