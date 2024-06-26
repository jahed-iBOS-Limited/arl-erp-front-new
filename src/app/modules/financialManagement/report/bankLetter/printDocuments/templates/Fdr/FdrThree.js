import React from "react";
import "../../templates/style.scss";
import { amountToWords } from "../../../../../../_helper/_ConvertnumberToWord";
import { _formatMoney } from "../../../../../../_helper/_formatMoney";

const FdrThree = ({ singleRowItem }) => {
  const {
    strBusinessUnitShortName,
    strRefDate,
    strDate,
    strBankShortName,
    strBankName,

    strBranchName,
    strBranchAddress,
    strAccountNo,

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
          Ref : {strBusinessUnitShortName?.toUpperCase()}/
          {strBankShortName?.toUpperCase()}
          /FDR/
          {strDate.replaceAll("-", ".")}
        </p>
        <p style={{ marginTop: "-8px" }}>Date : {strRefDate}</p>
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
            Subject: Issuance of FDR for BDT, {_formatMoney(numAmount)} as{" "}
            {strMarginType} Margin.
          </strong>
        </p>

        <br />
        <p>
          <strong>Dear Sir,</strong>
        </p>
        <p style={{ marginTop: "-8px" }}>
          We have the pleasure to inform you that the Management of the Company
          has decided to purchase a {intNumOfMonth} Months FDR @ {numProfitRate}
          % profit p.a. for{" "}
          <strong>
            BDT. {numAmount} ({amountToWords(numAmount)?.toUpperCase()}) in the
            Name of {strAccountName?.toUpperCase()}
          </strong>{" "}
          with auto renewal facility.
        </p>
        <p style={{ marginTop: "-8px" }}>
          To proceed, we are authorizing you to debit our A/C{" "}
          <b> {strAccountName} </b> a/c no.
          <b> {strAccountNo} </b> with{" "}
          <b>
            {" "}
            {strBankName}, {strBranchName}{" "}
          </b>{" "}
          {strBranchName?.toLowerCase().includes("branch") ? "" : "Branch"}.
          Additionally, we would request you to lien the same with{" "}
          {strMarginType} of {strAccountName}.
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
