import React from "react";
import "../../templates/style.scss";
import { amountToWords } from "../../../../../../_helper/_ConvertnumberToWord";

const FdrThree = ({ singleRowItem }) => {
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
    strAccountName,
    strAccountNo,
    numAmount,
    strMarginType,
    numProfitRate,
    intNumOfMonth,
  } = singleRowItem;

  return (
    <>
      <div class="bank-letter-template-common-wrapper">
        <p>
          Ref : {strBusinessUnitName}/FDR/{strRefDate}
        </p>
        <p>Date : {strDate}</p>
        <br />
        <p>The Manager</p>
        <p>
          <strong>{strBankName}</strong>
        </p>
        <p>
          <strong>{strBranchName} </strong>
        </p>
        <p>{strBranchAddress}</p>
        <br />
        <p>
          <strong>
            Subject: Issuance of FDR of BDT: {numAmount} as {strMarginType}
            Margin.
          </strong>
        </p>
        <br />
        <p>
          <strong>Dear Sir,</strong>
        </p>
        <p>
          We have the pleasure to inform you that the Management of the Company
          has decided to purchase {intNumOfMonth} Months FDR @ {numProfitRate}%
          profit p.a. for{" "}
          <strong>
            BDT. {numAmount} {amountToWords(numAmount)} in the Name of{" "}
            {strAccountName}
          </strong>{" "}
          with auto renewal facility.
        </p>
        <p>
          By debiting our
          <strong>
            {" "}
            {strAccountType} A/C No. {strAccountName}
          </strong>{" "}
          with your branch in the name of <strong> {strAccountName}</strong> for
          the FDR and the same may kindly be arrange{" "}
          <strong>Lien with {strMarginType}</strong> of {strAccountName}.
        </p>
        <br />
        <p>Thanking you,</p>
        <br />
        <p>
          <strong>FOR {strAccountName} </strong>
        </p>
        <br />
        <br />
        <br />
        <p>Authorized Signature</p>
      </div>
    </>
  );
};

export default FdrThree;
