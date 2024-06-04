import React from "react";
import "../../templates/style.scss";

const SignatoryChangeOne = ({ singleRowItem }) => {
  const {
    strBusinessUnitName,
    strRefDate,
    strDate,
    strBankName,
    strBankShortName,
    strBranchName,
    strBranchAddress,
    strAccountType,
  } = singleRowItem;
  return (
    <>
      <div className="bank-letter-template-common-wrapper">
        <p style={{ fontSize: 16 }}>
          <b>Date: {strDate} </b>
        </p>
        {/* <p style="margin-top: -15px; font-size: 16px"><b>Date : {{Date}}</b></p> */}
        <p style={{ marginTop: 35 }}>The Manager</p>
        {/* <p style="margin-top: -15px; ">The Head of the Branch</p> */}
        <p style={{ marginTop: "-15px" }}>
          <b> {strBankName} </b>
        </p>
        <p style={{ marginTop: "-15px" }}>
          <b> {strBranchName} </b>
        </p>
        <p style={{ marginTop: "-15px" }}> Bank Address </p>
        <p style={{ margin: "35px 0" }}>
          Subject:
          <b>
            Regarding the inclusion of two new signatories in replacement of one
            existing Signatories, A/C: Account Number , Account Name with Bank
            Name , Branch Name{" "}
          </b>
        </p>
        <p style={{ marginTop: 35 }}>Dear Sir,</p>
        {/* <p>As-salamu alaykum</p> */}
        <p style={{ marginTop: "-10px", textAlign: "left" }}>
          We acknowledge your support in the business of <b> Account Name .</b>{" "}
          We have been maintaining an <b> {strAccountType} </b> account in your
          branch bearing account no- <b> Account Number .</b> Currently, we have
          05 signatories but our management wants to replace one existing
          signatories with two new signatories for the smooth operation of the
          company. Details of the signatory changes are given below:
        </p>
        <table style={{ border: "1px solid black" }}>
          <thead>
            <tr>
              <td style={{ width: 100, textAlign: "center" }}>S.L.</td>
              <td style={{}}>Name</td>
              <td style={{}}>Designation</td>
              <td style={{}}>Remarks</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.</td>
              <td style={{ fontWeight: 700 }}>B.M. Shahinur Islam</td>
              <td>Chief Financial Officer</td>
              <td style={{ fontWeight: 700 }}>To be Excluded</td>
            </tr>
            <tr>
              <td>2.</td>
              <td style={{ fontWeight: 700 }}>Md. Sheikh Sadi</td>
              <td>Chief Treasury Officer</td>
              <td rowSpan={2} style={{ fontWeight: 700 }}>
                To be Excluded
              </td>
            </tr>
            <tr>
              <td>3.</td>
              <td style={{ fontWeight: 700 }}>Md. Anamul Haque</td>
              <td>Deputy Manager (Finance)</td>
              {/* <td colspan="2">To be Excluded</td> */}
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 10 }}>
          For your kind cooperation, we enclosed a copy of the board resolution
          along with the updated list of authorized officers
          <b>(ANNEXURE -1)</b> and the specimen signature cards of two new
          authorized signatories.
        </p>
        <p style={{ marginTop: 10 }}>
          Therefore, we are requesting you to take the necessary step to make
          the above-mentioned change to the signatory for our account maintained
          with your bank. Your kind cooperation in this regard will be highly
          appreciated.
        </p>
        <p style={{ marginTop: 35 }}>
          <b>Thanking you </b>
        </p>
        <p style={{ marginTop: 5 }}>
          <b>For, Account Name </b>
        </p>
        <p style={{ marginTop: 55 }}>
          <b>(SHEIKH JASIM UDDIN)</b>
        </p>
        <p style={{ marginTop: "-15px" }}>
          <b>Managing Director</b>
        </p>
        <div className="myPageBreak" />
        <p style={{}}>
          EXTRACT OF THE MINUTES OF THE MEETING OF THE BOARD OF DIRECTORS OF
          <b> Account Name </b>
          ON THE <b> BR Date </b> AT 11.00 AM IN THE REGISTERED OFFICE OF THE
          COMPANY AT AKIJ HOUSE, 198 BIR UTTAM MIR SHAWKAT SARAK, GULSHAN LINK
          ROAD, TEJGAON, DHAKA 1208.
        </p>
        <p style={{}}>
          The meeting was presided over by Ms. Faria Hossain, Chairman of the
          Company. The Managing Director and Mr. Ruhul Islam, Company Secretary
          were present.
        </p>
        <p>
          1. Mr. Sheikh Jasim Uddin{" "}
          <span style={{ marginLeft: 50 }}> Sd/- </span>
        </p>
        <p>
          2. Ms. Faria Hossain <span style={{ marginLeft: 90 }}> Sd/- </span>
        </p>
        <p>
          The Following resolutions were passed unanimously for the interest of
          the business of the company.
        </p>
        <p>a) The notice convening the meeting duly read and confirmed.</p>
        <p style={{ marginTop: 30 }}>
          b) The minutes of the last meeting were read, discussed, and
          confirmed.
        </p>
        <p style={{ marginTop: 30 }}>
          c) After threadbare discussion
          <b> Mr. Sheikh Jasim Uddin, Managing Director</b>
          of the Company be and is hereby authorized to operate the account
          <b>sign and endorse singly</b> all cheques in regard to
          <b> this Account </b>for any amount and also sanction advice, security
          documents, trade (import/export) related documents, other necessary
          documents and papers for enjoying a loan.
        </p>
        <p style={{}}>
          Besides this,the Board of Directors, for better interest and smooth
          running of the business of the company new authorization for the
          <b> Bank Name , Account No. </b>
          has been provided to
          <b>
            1. Md. Sheikh Sadi- Chief Treasury Officer &amp; 2. Md. Anamul
            Haque- Deputy Manager (Finance){" "}
          </b>
          as a replacement for one existing signatories namely:
          <b>B.M. Shahinur Islam- Chief Financial Officer</b>. From now onward,
          the new signatories along with the remaining four existing signatories
          namely:
          <b>
            1. Md. Sheikh Sadi- Chief Treasury Officer, 2. Md. Masud Rana- Chief
            Supply Chain Officer, 3. Iftekhar Uddin Chowdhury- Senior Manager
            (Treasury), 4. Raihan Kabir- Deputy CFO, 5. Rakibul Alam Khan-
            Manager (Finance) and 6. Md. Anamul Haque- Deputy Manager (Finance)
          </b>
          from now onward can jointly by any <b>two of the six </b>sign and
          endorse:
        </p>
        <p>
          <span style={{ marginRight: 20 }}> - </span>
          <b>
            All Cheques, fund transfers, fixed deposit openings and settlements
            and all other cash related transactions and instructions.
          </b>
        </p>
        <p>
          <span style={{ marginRight: 20 }}> - </span>
          <b>
            All trade documents not only import/export, guarantee, and invoice
            financing but also all other forms of loan disbursements, amendments
            and settlements
          </b>
        </p>
        <p>
          <span style={{ marginRight: 20 }}> - </span>
          <b>
            Facility letter, hypothecation, lien and all other credit and
            security documents
          </b>
        </p>
        <p>
          for all Banking transactions of the
          <b> Bank Name , Account No. </b>
          on behalf of the Company.
        </p>
        <p>
          This authority shall continue in force until and unless the same is
          revoked by the Board of Directors of the Company by a notice in
          writing to be delivered to the Bank.
        </p>
        <p>
          d) Further Resolved that The Managing Director of the Company and/ or
          the Chairman of the meeting and/ or the Company Secretary be and are
          authorized to issue any extract of the minutes as and when necessary.
        </p>
        <p>The meeting ended with a vote of thanks to the chair.</p>
        <p style={{ marginTop: 55, marginLeft: 65 }}>
          <b>Sd/-</b>
        </p>
        <p style={{ marginTop: "-15px" }}>
          <b>(SHEIKH JASIM UDDIN)</b>
        </p>
        <p style={{ marginTop: "-15px" }}>
          <b>Managing Director</b>
        </p>
        <div className="myPageBreak" />
        <p style={{ textAlign: "center" }}>
          <b>
            <u> ANNEXURE -1</u>
          </b>
        </p>
        <p style={{ textAlign: "center", marginTop: "-15px" }}>
          <b>
            <u> LIST OF AUTHORIZED OFFICERS</u>
          </b>
        </p>
        <div style={{ margin: "20px 100px" }}>
          <table style={{ border: "1px solid black" }}>
            <thead>
              <tr>
                <td style={{}}>
                  Name of the Authorized Officers with designation
                </td>
                <td style={{}}>
                  Specimen signature of the authorized Officers
                </td>
                <td style={{}}>Signature attested by the Managing Director</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  1. <b>Md. Sheikh Sadi,</b> Chief Treasury Officer
                </td>
                <td />
                <td rowSpan={6} />
              </tr>
              <tr>
                <td>
                  2. <b> Md. Masud Rana,</b> Chief Supply Chain Officer
                </td>
                <td />
              </tr>
              <tr>
                <td>
                  3. <b>Iftekhar Uddin Chowdhury,</b> Senior Manager (Treasury)
                </td>
                <td />
              </tr>
              <tr>
                <td>
                  4. <b>Raihan Kabir,</b> Deputy CFO
                </td>
                <td />
              </tr>
              <tr>
                <td>
                  5. <b>Rakibul Alam Khan, </b> Manager (Finance)
                </td>
                <td />
              </tr>
              <tr>
                <td>
                  6. <b> Md. Anamul Haque, </b> Deputy Manager (Finance)
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SignatoryChangeOne;
