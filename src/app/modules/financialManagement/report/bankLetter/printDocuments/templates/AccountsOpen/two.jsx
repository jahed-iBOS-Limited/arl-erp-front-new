import React from 'react';
import './style.scss';
import { formatDate } from '../../../../../../_helper/_dateFormate';

const AccountOpenTwo = ({ singleRowItem }) => {
  const {
    strBusinessUnitName,
    strRefDate,
    strDate,
    strBankName,
    strBankShortName,
    strBranchName,
    strBranchAddress,
    strAccountType,
    strBrdate,
    strAccountName,
  } = singleRowItem;
  return (
    <>
      <div className="account-open-two-wrapper" contentEditable={true}>
        <div>
          <div>
            <p>
              <strong>
                Ref : {strBusinessUnitName}/{strBankShortName}
                /AO/{strDate}
              </strong>
            </p>
            <p style={{ marginTop: '-5px' }}>
              <strong>Date : {strRefDate}</strong>
            </p>
          </div>
          <br />
          <div>
            <p>
              <strong>The Head of the Branch</strong>
            </p>
            <p style={{ marginTop: '-5px' }}>
              <strong>{strBankName?.toUpperCase()}</strong>
            </p>
            <p style={{ marginTop: '-5px' }}>
              <strong>
                {strBranchName}
                {strBranchName?.toLowerCase().includes('branch')
                  ? ''
                  : ' BRANCH'}
              </strong>
            </p>
            <p style={{ marginTop: '-5px' }}>{strBranchAddress || ''}</p>
          </div>
          <br />
          <div>
            <p style={{ gap: '10px' }} className="d-flex">
              <div>
                <strong>Subject: </strong>{' '}
              </div>
              <div>
                <strong>
                  {strAccountType} Account Open in the Name of{' '}
                  {strBusinessUnitName?.toUpperCase()} and the person authorized
                  to deal with {strBankName?.toUpperCase()} {strBranchName}{' '}
                  {strBranchName?.toLowerCase().includes('branch')
                    ? ''
                    : 'BRANCH'}
                  .
                </strong>
              </div>
            </p>
          </div>
          <br />
          <div>
            <p>
              <strong>Dear Sir,</strong>
            </p>
            <br />
            <p style={{ marginTop: '-3px' }}>
              We have the pleasure to inform you that the Board of Directors of
              the Company has decided to open <strong> {strAccountType}</strong>{' '}
              in the name of{' '}
              <strong>{strBusinessUnitName?.toUpperCase()}</strong> with your
              branch as per the Board resolution of the Company which was held
              on the
              <strong> {formatDate(strBrdate)} </strong> in the Registered
              Office of The Company at Akij House, 198, Bir Uttam Mir Shawkat
              Sarak, Gulshan Link Road, Tejgaon, Dhaka 1208.
            </p>
            <br />
            <p style={{ marginTop: '-8px' }}>
              As per Board Resolution
              <strong>
                {' '}
                Resolved that Mr. Sheikh Jasim Uddin, Managing Director{' '}
              </strong>
              of the Company be and is hereby authorized to
              <strong> sign and endorse singly</strong> all cheques in regard to
              <strong> {strAccountType} Account</strong> for any amount and also
              sanction advice, security documents, trade (import/export) related
              documents, other necessary documents and papers for enjoying loan.
              Besides this, for the smooth running of the business of the
              Company
              <strong> authorized Six (06) Officials</strong> namely:
              <strong>
                1. Md. Sheikh Sadi- Chief Treasury Officer; 2. Md. Masud Rana-
                Chief Supply Chain Officer; 3. Iftekhar Uddin Chowdhury- Senior
                Manager (Treasury); 4. Raihan Kabir- Deputy CFO; 5. Rakibul Alam
                Khan- Manager (Finance) and 6. Md. Anamul Haque- Manager
                (Finance)
              </strong>{' '}
              from now onward
              <strong> any two of the six can jointly sign and endorse:</strong>
            </p>
            <br />
            <div style={{ marginLeft: 80 }}>
              <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 30 }}>
                  <strong>-</strong>
                </p>
                <p style={{ marginTop: '-8px' }}>
                  <strong>
                    All Cheques, fund transfers, fixed deposit opening, and
                    settlement, and all other cash-related transactions and
                    instructions.
                  </strong>
                </p>
              </div>
              <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 30 }}>
                  <strong>-</strong>
                </p>
                <p style={{ marginTop: '-8px' }}>
                  <strong>
                    All trade documents not only import/export, guarantee,
                    invoice financing but also all other forms of loan
                    disbursements, amendments, and settlements
                  </strong>
                </p>
              </div>
              <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 30 }}>
                  <strong>-</strong>
                </p>
                <p style={{ marginTop: '-8px' }}>
                  <strong>
                    Facility letter, hypothecation, lien, and all other credit
                    and security documents for and on behalf of the Company.
                  </strong>
                </p>
              </div>
            </div>

            <p>
              This authority shall continue in force until and unless the same
              is revoked by the Board of Directors of the Company by a notice in
              writing to be delivered to the Bank. The specimen signature of the
              authorized persons is attested in <strong>Annexure-1.</strong>
            </p>
            <p>
              We enclose herewith the necessary documents for your necessary
              action.
            </p>
            <br />
            <div>
              <p>Yours faithfully,</p>
              <p>
                <strong>For, {strBusinessUnitName?.toUpperCase()}</strong>
              </p>
              <br />
              <br />
              <br />
              <br />
              <p>
                <strong>(Sheikh Jasim Uddin)</strong>
              </p>
              <p style={{ marginTop: '-6.5px' }}>
                <strong>Managing Director</strong>
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            pageBreakAfter: 'always',
          }}
        ></div>
        <div
          className="second-part"
          style={{ marginTop: '10px', fontSize: '14px !important' }}
        >
          <p>
            EXTRACT OF THE MINUTE OF THE MEETING OF THE BOARD OF DIRECTORS OF
            <strong>{strBusinessUnitName?.toUpperCase()}</strong> ON THE{' '}
            <strong> {formatDate(strBrdate)}</strong> AT 11.30 A.M. IN THE
            REGISTERED OFFICE OF THE COMPANY AT AKIJ HOUSE, 198, BIR UTTAM MIR
            SHAWKAT SARAK, GULSHAN LINK ROAD, TEJGAON, DHAKA 1208.
          </p>
          <br />
          <p>
            The meeting was presided over by Mr. Sheikh Nasir Uddin, Chairman of
            the Company. The following Directors and Company Secretary were
            present.
          </p>
          <br />
          <p>
            <span>
              <strong>Mr. Sheikh Nasir Uddin</strong>
            </span>{' '}
            <span style={{ marginLeft: '103px' }}>Chairman</span>{' '}
            <span style={{ marginLeft: '146px' }}>Sd/</span>
          </p>
          <p>
            <span>
              <strong>Mr. Sheikh Jasim Uddin</strong>
            </span>{' '}
            <span style={{ marginLeft: '100px' }}>Managing Director</span>{' '}
            <span style={{ marginLeft: '86px' }}>Sd/</span>
          </p>
          <p>
            <span>
              <strong>Ms. Faria Hossain</strong>
            </span>
            {}
            <span style={{ marginLeft: '143px' }}>Director</span>{' '}
            <span style={{ marginLeft: '158px' }}>Sd/</span>
          </p>
          <br />
          <p>
            The Following resolutions were passed unanimously for the interest
            of the business of the company.
          </p>
          <br />
          <p>
            a)
            <strong>
              {' '}
              Resolved that Mr. Sheikh Jasim Uddin, Managing Director
            </strong>
            of the Company be and is hereby authorized to open Account Type in
            the name of <strong> {strAccountName}</strong> with{' '}
            <strong>{strBankName?.toUpperCase()},</strong>{' '}
            <strong>
              {strBranchName}{' '}
              {strBranchName?.toLowerCase().includes('branch') ? '' : 'BRANCH'}
            </strong>{' '}
            and to operate the account <strong>sign and endorse singly</strong>{' '}
            all cheques in regard to <strong> {strAccountType} </strong> for any
            amount and also sanction advice, security documents, trade
            (import/export) related documents, other necessary documents and
            papers for enjoying a loan.
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Besides this,</strong> resolved that the Company
            <strong> authorized Six (06) Officials</strong> to operate the bank
            account for the smooth running of the business. Authorized
            signatories for Bank Accounts are as follows: Six (06) authorized
            officials namely:
            <strong>
              1. Md. Sheikh Sadi- Chief Treasury Officer; 2. Md. Masud Rana-
              Chief Supply Chain Officer; 3. Iftekhar Uddin Chowdhury- Senior
              Manager (Treasury); 4. Raihan Kabir- Deputy CFO; 5. Rakibul Alam
              Khan- Manager (Finance) and 6. Md. Anamul Haque- Manager (Finance)
              from now onward any two of the six can jointly sign and endorse:
            </strong>
          </p>
          <div style={{ marginLeft: 80 }}>
            <div style={{ display: 'flex' }}>
              <p style={{ marginRight: 30 }}>
                <strong>-</strong>
              </p>
              <p>
                <strong>
                  All Cheques, fund transfers, fixed deposit opening, and
                  settlement, and all other cash-related transactions and
                  instructions.
                </strong>
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <p style={{ marginRight: 30 }}>
                <strong>-</strong>
              </p>
              <p>
                <strong>
                  All trade documents not only import/export, guarantee, invoice
                  financing but also all other forms of loan disbursements,
                  amendments, and settlements
                </strong>
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <p style={{ marginRight: 30 }}>
                <strong>-</strong>
              </p>
              <p>
                <strong>
                  Facility letter, hypothecation, lien, and all other credit and
                  security documents for and on behalf of the Company.
                </strong>
              </p>
            </div>
          </div>
          <p style={{ marginTop: '10px' }}>
            The specimen signature of all the authorized persons will be
            attested in <strong> Annexure-1 </strong>. This authority shall
            continue in force until and unless the same is revoked by the Board
            of Directors of the Company by a notice in writing to be delivered
            to the Bank.
          </p>
          <br />
          <p>
            b) Resolved that the company will open FDR/ FDRs from time to time
            with <strong> {strBankName?.toUpperCase()}</strong>,
            <strong>
              {strBranchName}{' '}
              {strBranchName?.toLowerCase().includes('branch') ? '' : 'BRANCH'}
            </strong>{' '}
            for the business interest of the company and this resolution will be
            applicable for that.
          </p>
          <br />

          <p>
            c) Resolved that the company will provide FDR or Guarantee against
            any credit facilities of the company itself or any other sister
            concerns as security on a requirement basis.
          </p>
          <br />

          <p>
            d) Resolved that the company will avail of ONLINE Banking Corporate
            Facility or any other service agreement that will be required in the
            future.
          </p>
          <br />

          <p>
            e) Resolved that any Director of the Company and/ or the Chairman of
            the meeting and/ or the Company Secretary be and are authorized to
            issue any extract of the minutes as and when necessary.
          </p>
          <br />
          <p>The meeting ended with a vote of thanks to the chair.</p>
          <br />
          <div>
            <p style={{ marginLeft: '40px' }}>Sd/-</p>
            <p>
              <strong>(Sheikh Jasim Uddin) </strong>
            </p>
            <p style={{ marginTop: '-5px' }}>Managing Director</p>
          </div>
        </div>
        <div
          style={{
            pageBreakAfter: 'always',
          }}
        ></div>
        <div>
          <div style={{ textAlign: 'center' }}>
            <div>
              <strong>
                <u>ANNEXURE -1</u>
              </strong>
            </div>
            <div>
              <u>LIST OF AUTHORIZED OFFICERS </u>
            </div>
          </div>
          <div>
            <table className="no_border_table">
              <tbody>
                <tr>
                  <td>Title of Account</td>
                  <td>
                    <strong>: {strBusinessUnitName?.toUpperCase()}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Specimen Signature Card of A/C No</td>
                  <td>
                    <strong>:</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    {strBankName?.toUpperCase()} {strBranchName}{' '}
                    {strBranchName?.toLowerCase().includes('branch')
                      ? ''
                      : 'BRANCH'}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style={{ textAlign: 'center' }}>
              <strong>Group – A</strong>
            </div>
            <table className="border_table">
              <tbody>
                <tr>
                  <th>Full Name of the Signatory</th>
                  <th>Specimen Signature</th>
                  <th>Photograph</th>
                </tr>
                <tr>
                  <td rowSpan={3}>Sheikh Jasim Uddin</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                  <td rowSpan={4} />
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td>Authorized Signature</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong> Special Instruction: </strong>Mr. Sk. Jasim Uddin{' '}
                    <strong> sign and endorse singly</strong> all cheques and
                    all other documents.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <br />
            <div style={{ textAlign: 'center', marginTop: '-12px' }}>
              <strong>OR</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Group - B</strong>
            </div>
            <br />

            <table className="border_table" style={{ marginTop: '-12px' }}>
              <tbody>
                <tr>
                  <th>Full Name of the Signatory</th>
                  <th>Specimen Signature</th>
                  <th>Photograph</th>
                </tr>
                <tr>
                  <td rowSpan={3}>Md. Sheikh Sadi</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                  <td rowSpan={19} />
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0px', fontSize: '13px' }}>
                    Authorized Signature
                  </td>
                </tr>
                <tr>
                  <td rowSpan={3}>Md. Masud Rana</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0px', fontSize: '13px' }}>
                    Authorized Signature
                  </td>
                </tr>
                <tr>
                  <td rowSpan={3}>Iftekhar Uddin Chowdhury</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0px', fontSize: '13px' }}>
                    Authorized Signature
                  </td>
                </tr>
                <tr>
                  <td rowSpan={3}>Raihan Kabir</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0px', fontSize: '13px' }}>
                    Authorized Signature
                  </td>
                </tr>
                <tr>
                  <td rowSpan={3}>Rakibul Alam Khan</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0px', fontSize: '13px' }}>
                    Authorized Signature
                  </td>
                </tr>
                <tr>
                  <td rowSpan={3}>Md. Anamul Haque</td>
                  <td style={{ fontSize: '13px' }}>
                    {strBusinessUnitName?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0' }}>.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0px', fontSize: '13px' }}>
                    Authorized Signature
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ fontSize: '12px' }}>
                    <b> Special Instruction:</b> 1. Md. Sheikh Sadi, 2. Md.
                    Masud Rana, 3. Iftekhar Uddin Chowdhury, 4. Raihan Kabir, 5.
                    Rakibul Alam Khan, 6. Md. Anamul Haque -
                    <b> any two signatories </b>
                    out of <b> 'Group B' </b>can <b>sign and endorse</b> jointly
                    all cheques and all other documents.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <strong>Attested by</strong>
            <div style={{ marginTop: '7px', paddingTop: '20px' }}>
              <strong style={{ fontSize: '15px' }}>(Sheikh Jasim Uddin)</strong>
            </div>
            <div
              style={{
                marginTop: '3px',
                fontSize: '16px',
              }}
            >
              Managing Director
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountOpenTwo;
