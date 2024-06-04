import React from "react";
import "../../templates/style.scss";

const FdrONE = () => {
  return (
    <>
      <div class="bank-letter-template-common-wrapper">
        <p>
          EXTRACT OF THE MINUTES OF THE MEETING OF THE BOARD OF DIRECTORS OF
          <strong>{"Account Name"}</strong> HELD ON THE
          <strong>{"Date"}</strong> AT 11:30AM IN THE CORPORATE OFFICE OF THE
          COMPANY AT AKIJ HOUSE, 198, BIR UTTAM MIR SHAWKAT SARAK, GULSHAN LINK
          ROAD, TEJGAON, DHAKA 1208.
        </p>
        <br />
        <p>
          The meeting was presided over by Ms. Faria Hossain, Chairman of the
          Company. The Managing Director and Mr. Ruhul Islam, Company Secretary
          were present.
        </p>
        <br />
        <div style={{ display: "flex" }}>
          <div>
            <p>1.</p>
            <p>2.</p>
            <p>3.</p>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <p>
              <strong>Mr. Sheikh Nasir Uddin</strong>
            </p>
            <p>
              <strong>Mr. Sheikh Jasim Uddin</strong>
            </p>
            <p>
              <strong>Ms. Faria Hossain</strong>
            </p>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <p>Sd/</p>
            <p>Sd/</p>
            <p>Sd/</p>
          </div>
        </div>
        <br />
        <p>
          The Following resolutions were passed unanimously for the interest of
          the business of the company.
        </p>
        <br />
        <p>
          Resolve that the company will open an FDR for
          <strong>{"BDT Amount"}</strong>
          <strong>{"Amount in words"}</strong> with{" "}
          <strong>{"Bank Name"}</strong>
        </p>
        <br />
        <p>
          Resolve that either Mr. Sheikh Jasim Uddin, Managing Director of the
          company singly or jointly by any two authorized Six (06) officials
          namely:
          <strong>
            1. Md. Sheikh Sadi- Chief Treasury Officer; 2. Md. Masud Rana- Chief
            Supply Chain Officer; 3. Iftekhar Uddin Chowdhury- Senior Manager
            (Treasury); 4. Raihan Kabir- Deputy CFO; 5. Rakibul Alam Khan-
            Manager (Finance) and 6. Md. Anamul Haque- Deputy Manager (Finance)
          </strong>
          from now onward <strong>will sign and endorse:</strong>
        </p>
        <div style={{ marginLeft: "80px" }}>
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "30px" }}>
              <strong>-</strong>
            </p>
            <p>
              <strong>
                All Cheques, fund transfer, fixed deposit opening and settlement
                and all other cash related transactions and instructions.
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "30px" }}>
              <strong>-</strong>
            </p>
            <p>
              <strong>
                All trade documents not only import/export, guarantee, invoice
                financing but also all other forms of loan disbursements,
                amendments and settlements
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "30px" }}>
              <strong>-</strong>
            </p>
            <p>
              <strong>
                Facility letter, hypothecation, lien and all other credit and
                security documents
              </strong>
            </p>
          </div>
        </div>
        <p>
          As there being no other agenda to be discussed, the meeting ended with
          a vote of thanks to chair.
        </p>
        <br />
        <br />
        <p>Sd/-</p>
        <p>
          <strong>(Sheikh Jasim Uddin) </strong>
        </p>
        <p>Managing Director</p>
      </div>
    </>
  );
};

export default FdrONE;
