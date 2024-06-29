import React from "react";
import "../../templates/style.scss";
import { amountToWords } from "../../../../../../_helper/_ConvertnumberToWord";
import FdrThree from "./FdrThree";

const FdrTwo = ({ singleRowItem }) => {
  const {
    strDate,

    strBankName,

    strAccountName,
    numAmount,
  } = singleRowItem;
  return (
    <>
      <FdrThree singleRowItem={singleRowItem} />
      <div
        style={{
          pageBreakAfter: "always",
        }}
      ></div>
      <div class="bank-letter-template-common-wrapper">
        <p>
          EXTRACT OF THE MINUTES OF THE MEETING OF THE BOARD OF DIRECTORS OF
          <strong> {strAccountName?.toUpperCase()}</strong> HELD ON THE
          <strong> {strDate}</strong> AT 11:30AM IN THE CORPORATE OFFICE OF THE
          COMPANY AT AKIJ HOUSE, 198, BIR UTTAM MIR SHAWKAT SARAK, GULSHAN LINK
          ROAD, TEJGAON, DHAKA 1208.
        </p>
        <br />
        <p>
          The meeting was presided over by Ms. Faria Hossain, Chairman of the
          Company.The following Directors and Company Secretary were present.
        </p>
        <br />
        <div>
          <p>
            <span>
              <strong>Mr. Sheikh Jasim Uddin</strong>
            </span>{" "}
            <span style={{ marginLeft: "100px" }}>Managing Director</span>{" "}
            <span style={{ marginLeft: "90px" }}>Sd/</span>
          </p>
          <p>
            <span>
              <strong>Ms. Faria Hossain</strong>
            </span>
            {}
            <span style={{ marginLeft: "142px" }}>Chairman</span>{" "}
            <span style={{ marginLeft: "140px" }}>Sd/</span>
          </p>
        </div>
        <br />
        <p>
          The Following resolutions were passed unanimously for the interest of
          the business of the company.
        </p>
        <br />
        <p>
          Resolve that the company will open an FDR for
          <strong>BDT {numAmount} </strong>
          <strong>
            {" "}
            ({amountToWords(numAmount)?.toUpperCase()})
          </strong> with <strong> {strBankName?.toUpperCase()}</strong>
        </p>
        <br />
        <p>
          Resolve that either Mr. Sheikh Jasim Uddin, Managing Director of the
          company singly or jointly by any two authorized Six (06) officials
          namely:
          <strong>
            {" "}
            1. Md. Sheikh Sadi- Chief Treasury Officer; 2. Md. Masud Rana- Chief
            Supply Chain Officer; 3. Iftekhar Uddin Chowdhury- Senior Manager
            (Treasury); 4. Raihan Kabir- Deputy CFO; 5. Rakibul Alam Khan-
            Manager (Finance) and 6. Md. Anamul Haque- Manager (Finance){" "}
          </strong>
          from now onward <strong>will sign and endorse:</strong>
        </p>
        <br />
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
        <b />
        <p>
          As there being no other agenda to be discussed, the meeting ended with
          a vote of thanks to chair.
        </p>
        <br />
        <br />
        <p style={{ marginLeft: "40px" }}>Sd/-</p>
        <p>
          <strong>(Sheikh Jasim Uddin) </strong>
        </p>
        <p style={{ marginTop: "-7px" }}>Managing Director</p>
      </div>
    </>
  );
};

export default FdrTwo;
