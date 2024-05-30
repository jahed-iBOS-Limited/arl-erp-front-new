import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { formatDate } from "./utils";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
const fontSize = "13px";
const marginBottom = "9px";
const OthersPdf = ({ singleItem, selectedBusinessUnit }) => {
  const {
    bankShortName,
    numPrinciple,
    dteStartDate,
    strBankName,
    bankBranchAddress,
    facilityName,
    strBankAccountNumber,
    loanTypeName,
    sanctionReference,
    bankBranchName,
    disbursementPurposeName,
    fundLimitAmount
  } = singleItem || {};
  const { buShortName, label } = selectedBusinessUnit;
  const lacks = numPrinciple > 0 ? `${numPrinciple / 100000}L` : "0L";

  return (
    <div style={{ fontSize: fontSize, margin: "50px 50px 0px" }} sty>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Ref :{buShortName}/{bankShortName}/STL/{lacks}/
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
        Subject : Request for disbursement of {loanTypeName} - BDT
        {_formatMoney(numPrinciple)} for {label} A/C No: {strBankAccountNumber}.
      </p>

      <p style={{ marginBottom }}>Dear Sir,</p>
      <p style={{ marginBottom }}>As-salamu alaykum,</p>
      <p style={{ marginBottom }}>
      


        With reference to your sanction letter no. {sanctionReference}, we would request you to please disburse BDT {_formatMoney(numPrinciple)} in our A/C {label} against {facilityName} of BDT {_formatMoney(fundLimitAmount)} & {disbursementPurposeName}.

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

export default OthersPdf;
