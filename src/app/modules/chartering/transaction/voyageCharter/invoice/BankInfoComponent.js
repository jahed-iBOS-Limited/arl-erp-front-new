import React from "react";

export function BankInfoComponent({ data }) {
  return (
    <div className="row my-4">
      <div className="text-center col-lg-12">
        <h6>Bank Details</h6>
      </div>
      <div className="col-lg-12 headerWrapper">
        <div className="headerKey">BENEFICIARY NAME :</div>
        <div className="headerValue">
          {data?.ownerName || data?.compnayName}
        </div>
      </div>
      <div className="col-lg-12 headerWrapper">
        <div className="headerKey">ACCOUNT NO :</div>
        <div className="headerValue">
          {data?.ownerBankAccount || data?.bankAccountNo}
        </div>
      </div>
      <div className="col-lg-12 headerWrapper">
        <div className="headerKey">BANK NAME :</div>
        <div className="headerValue">{data?.bankName}</div>
      </div>

      <div className="col-lg-12 headerWrapper">
        <div className="headerKey">BANK ADDRESS :</div>
        <div className="headerValue">{data?.bankAddress}</div>
      </div>
      <div className="col-lg-12 headerWrapper">
        <div className="headerKey">SWIFT CODE :</div>
        <div className="headerValue">{data?.swiftCode || ""}</div>
      </div>
    </div>
  );
}
