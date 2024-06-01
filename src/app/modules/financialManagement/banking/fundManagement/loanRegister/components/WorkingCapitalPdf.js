import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { formatDate } from "./utils";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
const marginBottom = "9px";
const WorkingCapitalPdf = ({ singleItem, selectedBusinessUnit }) => {
  const {
    strBankShortName,
    numPrinciple,
    dteStartDate,
    strBankName,
    bankBranchAddress,
    facilityName,
    strBankAccountNumber,
    loanTypeName,
    bankBranchName,
  } = singleItem || {};
  const { buShortName, label } = selectedBusinessUnit;
  const lacks = numPrinciple > 0 ? `${numPrinciple / 100000}L` : "0L";

  return (
    <div style={{margin: "40px 71px 0px" }}>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Ref {" "}:{" "}{buShortName}/{strBankShortName}/STL/{lacks}/
        {_dateFormatter(dteStartDate)}
      </p>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Date{" "} :{" "}{formatDate(dteStartDate)}
      </p>
      <p style={{ marginBottom }}>The Head of Branch</p>
      <p style={{ marginBottom }}>{strBankName}</p>

      <p style={{ marginBottom }}>{bankBranchName} Branch</p>

      <p style={{ marginBottom }}>{bankBranchAddress}</p>

      <p style={{ marginBottom }} className="font-weight-bolder">
        Subject : Request for disbursement of {facilityName} - BDT
        {_formatMoney(numPrinciple)} for {label} A/C No: {strBankAccountNumber}.
      </p>

      <p style={{ marginBottom }}>Dear Sir,</p>
      <p style={{ marginBottom }}>As-salamu alaykum,</p>
      <p style={{ marginBottom }}>
      
      With reference to the subject, we would request you to please disburse a {facilityName} of BDT <span className="font-weight-bolder">{_formatMoney(numPrinciple)}{" "}</span> in our A/C <span className="font-weight-bolder">{strBankAccountNumber}</span> to facilitate our working capital needs.

      </p>
      
      <p style={{ marginBottom }}>
        Please process this request and
        <span className="font-weight-bolder">
         {" "} send the disbursed loan statement
        </span>{" "}
        Voucher to us at your earliest convenience.
      </p>
      <p style={{ marginBottom }}>
        Thank you for your continuous cooperation and assistance.
      </p>
      <p style={{ marginBottom }}>Thanking you,</p>

      <p style={{ marginBottom }}>
        For, <span className="font-weight-bolder">{label}</span>
      </p>

      <div className="d-flex" style={{ marginTop: "90px" }}>
        <p style={{ marginRight: "50px" }}>Authorized Signatory</p>
        <p>Authorized Signatory</p>
      </div>

      <p style={{ fontStyle: "italic" }}>
        <span className="font-weight-bolder">*Encloser : </span>Party Bill
        payment Advice.
      </p>
    </div>
  );
};

export default WorkingCapitalPdf;
