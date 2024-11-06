import React from "react";
import { _todayDate } from "../../../../../_helper/_todayDate";
import signature_one from "./signature_1.png";
import signature_two from "./signature_2.png";
function RequestForOriginalDocuments({ obj }) {
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
          <p id="ref">MSIL/IMPORT/22/10046</p>
          <p id="date">DATE: {_todayDate()}</p>
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
            Sub: Request for original documents endorsement under LC Ref no:{" "}
            {reference_id} Valuing: USD. {total_amount}
          </p>
        </b>
      </section>
      <section id="message">
        <br />
        <p>
          Dear sir,
          <br /> <br />
          With reference to the captioned subject, we have opened AT SIGHT. We
          would to inform you that the original shipping documents to the
          above-mentioned L/C is lying under your custody and the consignment
          will be arrived to its destination port very soon. In this connection
          please be informed that, if the documents containing any discrepancy,
          we are ready to accept the same.
        </p>
        <br />

        <p>
          Therefore, we are requesting you to kindly endorse the original
          documents for getting clearance of the consignment on time and hand
          over the same to us through your representative.
        </p>
      </section>

      <br />
      <br />
      <section>
        <p>
          <b>Thanking you</b>
        </p>
        <p>
          <b>Yours Faithfully,</b>
        </p>
        <br />
        <p>
          For’ <b>{buName} </b>
        </p>
      </section>
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

export default RequestForOriginalDocuments;
