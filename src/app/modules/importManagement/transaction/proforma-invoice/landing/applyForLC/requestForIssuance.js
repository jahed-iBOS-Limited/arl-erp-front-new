import React from "react";
import { _todayDate } from "../../../../../_helper/_todayDate";
import signature_one from "./signature_1.png";
import signature_two from "./signature_2.png";
function RequestForIssuance({ obj }) {
  const { values, buName, singleData } = obj;
  const {
    reference_id,
    total_amount,
  } = {
    total_amount: singleData?.objHeader?.piAmount || 0,
    item: singleData?.objRow?.[0]?.itemName || "",
    quantity: singleData?.objRow?.[0]?.quantity || 0,
    pi_no: singleData?.objHeader?.pinumber || "",
    reference_id:
      singleData?.purchaseRequestrNo || singleData?.purchaseContractNo,
  };
  return (
    <>
      <section>
        <div>
          <p id="ref"><b>DTCL/IMPORT/22/10172</b></p>
          <p id="date"><b>DATE: {_todayDate()}</b></p>
        </div>
      </section>
      <br />

      <section>
        <b>
          <p>To,</p>
          <p>EVP & Manager</p>
          <p>{values?.bank?.label}</p>
          <p>{values?.branch?.bankBranchName} BRANCH</p>
          <p>{values?.branch?.bankBranchAddress}</p>
        </b>
      </section>

      <br />
      <section>
        <b>
          <p>
            Sub: Request for Issuance of a Shipping Guarantee against LC REF
            No.: {reference_id} DATE. {_todayDate()}, Document Value USD.
            {total_amount}CPT BENAPOLE
          </p>
        </b>
      </section>
      <section id="message">
        <br />
        <p>
          Dear sir,
          <br /> <br />
          With reference to the captioned subject, we have the pleasure to
          request you to kindly issue us a Shipping Guarantee and endorse the{" "}
          <b>Non-negotiable</b> Copies of the relevant Documents, which are
          enclosed herewith.
        </p>
        <br />
        <p>
          Therefore, we are requesting you to kindly endorse the{" "}
          <b>Non-negotiable</b> documents for getting clearance of the
          consignment on the time and hand over the same to us
        </p>
        <br />
        <p>Necessary charges may please be debited with our A/C:</p>
        <p>Please handover the documents to us.</p>
      </section>

      <br />
      <br />
      <p>
        <b>For {buName} </b>
      </p>

      <br />
      <br />
      <section id="signatures">
        <div id="signature_1">
          <img src={signature_one} alt="signature" />
          <hr />
          <p>Authorized Signature</p>
        </div>
        <div id="signature_2">
          <img src={signature_two} alt="signature" />
          <hr />
          <p>Authorized Signature</p>
        </div>
      </section>
    </>
  );
}

export default RequestForIssuance;
