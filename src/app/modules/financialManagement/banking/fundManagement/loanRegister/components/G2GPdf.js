import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { formatDate } from "./utils";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
const fontSize = "13px";
const marginBottom = "9px";
const G2GPdf = ({ singleItem, selectedBusinessUnit }) => {
  const {
    strBankShortName,
    numPrinciple,
    dteStartDate,
    strBankName,
    bankBranchAddress,
    facilityName,
    strBankAccountNumber,
    loanTypeName,
    intTenureDays,
    strLoanAccountName,
    bankBranchName,
  } = singleItem || {};
  const { buShortName, label } = selectedBusinessUnit;

  return (
    <div style={{ fontSize: fontSize, margin: "50px 50px 0px" }} sty>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Ref :{buShortName}/{strBankShortName}/STL/G2G/
        {_dateFormatter(dteStartDate)}
      </p>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Date :{formatDate(dteStartDate)}
      </p>
      <p style={{ marginBottom }}>The Head of Branch</p>
      <p style={{ marginBottom }}>{bankBranchName}</p>
      <p style={{ marginBottom }}>{strBankName}</p>

      <p style={{ marginBottom }}>{bankBranchAddress}</p>

      <p style={{ marginBottom }} className="font-weight-bolder">
        Subject : Request for disbursement of {facilityName} - BDT
        {_formatMoney(numPrinciple)} for {label} A/C No: {strBankAccountNumber}.
      </p>

      <p style={{ marginBottom }}>Dear Sir,</p>
      <p style={{ marginBottom }}>As-salamu alaykum,</p>
      <p style={{ marginBottom }}>
        In reference to the mentioned subject, we are happy to inform you that,
        at present, we have been availing composite facilities from your Branch.
        Now, we request you to arrange a {facilityName} of
        <span className="font-weight-bolder">
          TK {_formatMoney(numPrinciple)} for {intTenureDays} days
        </span>
        on a revolving basis to meet up working capital requirement (local
        payment) of {label}. It is mentioned that the said loan amount to be
        transferred to our A/C No.
        <span className="font-weight-bolder">{strBankAccountNumber}</span> to
        execute the enclosed party payments through BEFTN/ RTGS & fund transfer.
      </p>
      <p style={{ marginBottom }}>
        Please process this request and
        <span className="font-weight-bolder">
          send the disbursed loan statement
        </span>
        Voucher to us at your earliest convenience.
      </p>
      <p style={{ marginBottom }}>
        Thank you for your continuous cooperation and assistance.
      </p>
      <p style={{ marginBottom }}>Yours Faithfully,</p>

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

export default G2GPdf;
