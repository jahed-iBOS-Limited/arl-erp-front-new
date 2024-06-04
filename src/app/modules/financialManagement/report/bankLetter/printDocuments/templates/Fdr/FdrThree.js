import React from "react";
import "../../templates/style.scss";

const FdrThree = () => {
  return (
    <>
      <div class="bank-letter-template-common-wrapper">
        <p>
          Ref : {"SBU"}/FDR/{"Date Ref"}
        </p>
        <p>Date : {"Date"}</p>
        <br />
        <p>The Manager</p>
        <p>
          <strong>{"Bank Name"}</strong>
        </p>
        <p>
          <strong>{"Branch Name"} </strong>
        </p>
        <p>{"Branch Address"}</p>
        <br />
        <p>
          <strong>
            Subject: Issuance of FDR of BDT: {"Amount"} as {"Margin Type"}
            Margin.
          </strong>
        </p>
        <br />
        <p>
          <strong>Dear Sir,</strong>
        </p>
        <p>
          We have the pleasure to inform you that the Management of the Company
          has decided to purchase {"No. of Months"} Months FDR @ {"Profit Rate"}
          % profit p.a. for
          <strong>
            BDT. {"Amount"} {"Amount in words"} in the Name of {"Account Name"}
          </strong>
          with auto renewal facility.
        </p>
        <p>
          By debiting our
          <strong>
            {"Account Type"} A/C No. {"Account Name"}
          </strong>{" "}
          with your branch in the name of <strong>{"Account Name"}</strong> for
          the FDR and the same may kindly be arrange
          <strong>Lien with {"Margin Type"}</strong> of {"Account Name"}.
        </p>
        <br />
        <p>Thanking you,</p>
        <br />
        <p>
          <strong>FOR {"Account Name"} </strong>
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
