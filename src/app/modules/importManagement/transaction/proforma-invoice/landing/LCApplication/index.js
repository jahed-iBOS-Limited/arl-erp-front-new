import React from "react";
import "./style.css";
import signature_one from "./signature_1.png";
import signature_two from "./signature_2.png";

const LCApplication = ({ obj }) => {
  const { values, lcInfo, buName } = obj;
  const { date, item, pi_no, quantity, reference_id, total_amount } = lcInfo;
  return (
    <>
      <div id="lc_application">
        <section>
          <div>
            <p id="ref">{reference_id}</p>
            <p id="date">DATE: {date}</p>
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
              Sub: Prayer for issuance of LC under unit of “{buName}” Total
              valuing: USD. {total_amount} Qty: {quantity} MT Purpose for
              importing “{item}” by private Organization for Factory Purpose.
            </p>
          </b>
        </section>
        <section id="message">
          <br />
          <p>
            Dear sir,
            <br /> <br />
            Reference to above mentioned subject, we want to open an L/C under
            unit of “{buName}’’ Proforma Invoice No.{pi_no}, “{item}” Valuing:
            USD. {total_amount} for the purpose of factory use. Under such terms
            we undertake to arrange full USD at the time of making LC payment.
            Furthermore, we also undertake to solve any issues related to these
            LCs at our own arrangement. <br /> <br /> Therefore, we are
            requesting you to issue a LC, and necessary charges will be debit
            from our account.
          </p>
          <br />
          <b>
            <p>
              NOTE: WE WILL ARRANGE DOLLARS DURING MATURITY TIME. SO, WE ARE
              REQUESTING YOU TO TRANSMIT THE LC.
            </p>
          </b>
        </section>

        <br />
        <br />
        <section>
          <p>Yours Faithfully,</p>
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
      </div>
    </>
  );
};

export default LCApplication;
