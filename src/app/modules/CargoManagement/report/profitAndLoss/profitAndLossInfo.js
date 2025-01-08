import React from 'react';
import './profitAndLossInfo.css';
import { convertNumberToWords } from '../../../_helper/_convertMoneyToWord';

const billingList = {
  incomeList: [
    {
      headOfChargeId: 1,
      headOfCharges: 'Freight',
      collectionActualAmount: 10.0,
      collectionDummyAmount: 10.0,
      actualExpense: null,
      collectionPartyId: 103308,
      collectionParty: 'Md Abdul Kader Shohan',
      paymentPartyId: 89389,
      paymentParty: 'Haramine Incorporation Limited',
      exchangeRate: 1.0,
      totalAmountBDT: 10,
    },
  ],
  costList: [
    {
      headOfChargeId: 1,
      headOfCharges: 'Freight',
      collectionPartyId: 103308,
      collectionParty: 'Md Abdul Kader Shohan',
      paymentActualAmount: 20,
      paymentDummyAmount: 200,
      paymentPartyId: 89389,
      paymentParty: 'Haramine Incorporation Limited',
      exchangeRate: 1.0,
      totalAmountBDT: 10,
    },
  ],
};

function ProfitAndLossInfo({ values }) {
  return (
    <div className="porfitAndLossWrapper">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <h6>JOB Profit & Loss</h6>
            <p>
              <b>Akij Logistics Limited</b>{' '}
            </p>
            <p>Bir Uttam Mir Shawkat Sarak, Dhaka 1208</p>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="d-flex justify-content-between">
            <div>
              <p>
                {' '}
                <b>Approved Agent </b>
              </p>
              <p>N/A</p>
            </div>
            <div>
              <p>
                <b>Job No</b>
              </p>
              <p>
                <b>Date</b>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="shipperInfoWrapper mt-3">
            <div className="shipperInfo">
              <p>
                <b>Shipper Name</b>
              </p>
              <p>
                <b>Consignee</b>
              </p>
              <p>
                <b>Total Qty</b>
              </p>
              <p>
                <b>Chargeable Weight</b>
              </p>
              <p>
                <b>CMB</b>
              </p>
              <p>
                <b>Destination</b>
              </p>
              <p>
                <b>POD</b>
              </p>
              <p>
                <b>MAWB</b>
              </p>
              <p>
                <b>HAWB NO.</b>
              </p>
            </div>
          </div>
        </div>

        {/* table one */}
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Party</th>
                  <th>Total Amount (BDT)</th>
                  <th>Loss/Gain</th>
                  <th>Grand Total</th>
                  <th>Exchenge Rate</th>
                  <th>Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'left',
                    }}
                  >
                    <b>Income</b>
                  </td>
                </tr>
                {billingList?.incomeList?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.headOfCharges}</td>
                    <td>{item?.collectionParty}</td>
                    <td>{item?.totalAmountBDT}</td>
                    <td></td>
                    <td></td>
                    <td>{item?.exchangeRate}</td>
                    <td>{item?.totalAmountBDT}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'left',
                    }}
                  >
                    <b>Cost</b>
                  </td>
                </tr>
                {billingList?.costList?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.headOfCharges}</td>
                    <td>{item?.paymentParty}</td>
                    <td>{item?.totalAmountBDT}</td>
                    <td></td>
                    <td></td>
                    <td>{item?.exchangeRate}</td>
                    <td>{item?.totalAmountBDT}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="2">
                    <b>Net Profit </b>
                  </td>
                  <td>30</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>30</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div
            style={{
              textTransform: 'capitalize',
            }}
          >
            <p>
              <b>Amount In Word BDT: </b>
              {convertNumberToWords(30)}
            </p>
            <p>
              <b>Amount In WordUSD: </b>
              {convertNumberToWords(30)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLossInfo;
