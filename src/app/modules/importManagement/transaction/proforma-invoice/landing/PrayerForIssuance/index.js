import React, { useState } from "react";
import "./style.css";
import signature_one from "./signature_1.png";
import signature_two from "./signature_2.png";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { ExportPDF } from "../../../../../chartering/_chartinghelper/exportPdf";
import Loading from "../../../../../_helper/_loading";

const PrayerForIssuance = ({ obj }) => {
  const { values, buName, singleData } = obj;
  const {
    // date,
    item,
    pi_no,
    quantity,
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

  const [loading, setLoading] = useState(false);
  console.log(singleData);
  console.log(item, pi_no, quantity, reference_id, total_amount);

  return (
    <>
      {loading && <Loading />}
      <div className="text-right">
        <button
          className="btn btn-primary px-3 py-2 mr-2"
          type="button"
          onClick={() => {
            ExportPDF(`LC Application`, setLoading);
          }}
        >
          Export
        </button>
      </div>
      <div id="pdf-section">
        <div id="prayerForIssuance" contenteditable="true">
          <section>
            <div>
              <p id="ref">{reference_id}</p>
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
                Sub: Prayer for issuance of LC under unit of “{buName}” Total
                valuing: USD. {total_amount} Qty: {quantity} MT Purpose for
                importing “{item}” by private Organization for Factory Purpose.
              </p>
            </b>
          </section>
          <section id="message">
            <br />
            <p >
              Dear sir,
              <br /> <br />
              Reference to above mentioned subject, we want to open an L/C under
              unit of “{buName}” Proforma Invoice No.{pi_no}, <b>“{item}”</b> Valuing:
              USD. {total_amount} for the purpose of factory use. Under such
              terms we undertake to arrange full USD at the time of making LC
              payment. Furthermore, we also undertake to solve any issues
              related to these LCs at our own arrangement. <br /> <br />{" "}
              Therefore, we are requesting you to issue a LC, and necessary
              charges will be debit from our account.
            </p>
            <br />
            {values?.type?.value === 1 && (
              <b>
                <p>
                  NOTE: WE WILL ARRANGE DOLLARS DURING MATURITY TIME. SO, WE ARE
                  REQUESTING YOU TO TRANSMIT THE LC.
                </p>
              </b>
            )}
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
      </div>
    </>
  );
};

export default PrayerForIssuance;
