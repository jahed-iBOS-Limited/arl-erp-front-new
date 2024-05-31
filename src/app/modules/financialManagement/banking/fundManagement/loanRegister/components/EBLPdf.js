import React from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { formatDate } from "./utils";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
const marginBottom = "9px";
const EBLPdf = ({ singleItem, selectedBusinessUnit }) => {
  const {
    bankShortName,
    numPrinciple,
    dteStartDate,
    strBankName,
    bankBranchAddress,
    facilityName,
    strBankAccountNumber,
    loanTypeName,
    intTenureDays,
  } = singleItem || {};
  const { buShortName, label } = selectedBusinessUnit;

  const lacks = numPrinciple > 0 ? `${numPrinciple / 100000}L` : "0L";
  return (
    <div style={{margin: "40px 71px 0px" }}>
      <p style={{marginBottom}} className="font-weight-bolder">
        Ref   :{buShortName}/{bankShortName}/STL/{lacks}/
        {_dateFormatter(dteStartDate)}
      </p>
      <p style={{marginBottom}} className="font-weight-bolder">
        Date :{formatDate(dteStartDate)}
      </p>
      <p style={{marginBottom}}>Ahmed Shaheen</p>
      <p style={{marginBottom}}>AMD & Head of Corporate Banking</p>
      <p style={{marginBottom}}>{strBankName}</p>
      <p style={{marginBottom}}>{bankBranchAddress}</p>

      <p style={{marginBottom}} className="font-weight-bolder">
        Subject : Request for disbursement of {facilityName} of BDT{" "}
        {_formatMoney(numPrinciple)} for {label} A/C No: {strBankAccountNumber}.
      </p>

      <p style={{marginBottom}}>Dear Sir,</p>
      <p style={{marginBottom}}>As-salamu alaykum,</p>
      <p style={{marginBottom}}>
        In reference to the mentioned subject, Please kindly note that, due to
        exchange rate volatility we are procuring raw materials needed from the
        local market. As a result, we require a {loanTypeName} of{" "}
        <span className="font-weight-bolder">
          BDT{" "} {_formatMoney(numPrinciple)}{" "} for{" "} {intTenureDays} days{" "}
        </span>
        to make payment to our local supplier today.
      </p>
      <p style={{marginBottom}}>
        Considering the issue, we would request to disburse BDT {_formatMoney(numPrinciple)}{" "}
        to our A/C No. <span className="font-weight-bolder">{strBankAccountNumber} {" "}</span>
        maintained with your bank.
      </p>
      <p style={{marginBottom}}>
        Please process this request and <span className="font-weight-bolder">send the disbursed loan statement {" "}</span>
        Voucher to us at your earliest convenience.
      </p>
      <p style={{marginBottom}}>Thank you for your continuous cooperation and assistance.</p>
      <p style={{marginBottom}}>Regards,</p>

      <p style={{marginBottom}}>
        For, <span className="font-weight-bolder">{label}</span>
      </p>

      <div className="d-flex" style={{marginTop:"90px"}}>
        <p style={{marginRight:"50px"}}>Authorized Signatory</p>
        <p>Authorized Signatory</p>
      </div>

      <p style={{fontStyle:"italic"}}>
       <span className="font-weight-bolder">*Encloser : </span>Party Bill payment Advice.
      </p>
    </div>
  );
};

export default EBLPdf;
