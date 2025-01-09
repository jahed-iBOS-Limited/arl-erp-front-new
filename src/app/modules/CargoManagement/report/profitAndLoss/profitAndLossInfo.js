import React from 'react';
import './profitAndLossInfo.css';
import { convertNumberToWords } from '../../../_helper/_convertMoneyToWord';
function ProfitAndLossInfo({ values, reportData }) {
  console.log(reportData, 'reportData');
  const deliveryAgentIdName = [];
  const deliveryAgentAddress = [];

  if (reportData?.rowData?.length > 0) {
    reportData.rowData.forEach((item) => {
      if (item.deliveryAgentName1) {
        // deliveryAgentIdName check if exist then push
        const exist = deliveryAgentIdName.includes(item.deliveryAgentName1);
        if (!exist) {
          deliveryAgentIdName.push(item.deliveryAgentName1);
        }
      }
      if (item.deliveryAgentName2) {
        // deliveryAgentIdName check if exist then push
        const exist = deliveryAgentIdName.includes(item.deliveryAgentName2);
        if (!exist) {
          deliveryAgentIdName.push(item.deliveryAgentName2);
        }
      }

      if (item.deliveryAgentAddress1) {
        // deliveryAgentAddress check if exist then push
        const exist = deliveryAgentAddress.includes(item.deliveryAgentAddress1);
        if (!exist) {
          deliveryAgentAddress.push(item.deliveryAgentAddress1);
        }
      }
      if (item.deliveryAgentAddress2) {
        // deliveryAgentAddress check if exist then push
        const exist = deliveryAgentAddress.includes(item.deliveryAgentAddress2);
        if (!exist) {
          deliveryAgentAddress.push(item.deliveryAgentAddress2);
        }
      }
    });
  }

  const collectionSum = (reportData?.collecttionBillingDatas || [])?.reduce(
    (acc, curr) => {
      return {
        collectionActualAmountInBDT:
          acc.collectionActualAmountInBDT +
          (+curr.collectionActualAmountInBDT || 0),
        amontUSD: acc.amontUSD + (+curr.amontUSD || 0),
      };
    },
    {
      collectionActualAmountInBDT: 0,
      amontUSD: 0,
    },
  );

  const paymentSum = (reportData?.paymentBillingDatas || [])?.reduce(
    (acc, curr) => {
      return {
        paymentActualAmountInBDT:
          acc.paymentActualAmountInBDT + (+curr.paymentActualAmountInBDT || 0),
        amontUSD: acc.amontUSD + (+curr.amontUSD || 0),
      };
    },
    {
      paymentActualAmountInBDT: 0,
      amontUSD: 0,
    },
  );

  return (
    <div className="porfitAndLossWrapper">
      <div className="row">
        <div className="col-lg-12">
          <div className="text-center">
            <h4>JOB Profit & Loss</h4>
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
              <p>
                {deliveryAgentIdName
                  ?.map((item, index) => {
                    return item;
                  })
                  .join(', ')}
              </p>
              <p>
                {deliveryAgentAddress
                  ?.map((item, index) => {
                    return item;
                  })
                  .join(', ')}
              </p>
            </div>
            <div></div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="shipperInfoWrapper mt-3">
            {reportData?.rowData?.map((item, index) => {
              return (
                <div className="shipperInfo">
                  <p>
                    <b>Shipper Name</b> : {item?.shipperName}
                  </p>
                  <p>
                    <b>Consignee</b> : {item?.consigneeName}
                  </p>
                  <p>
                    <b>Total Qty</b> : {item?.totalQty}
                  </p>
                  <p>
                    <b>Chargeable Weight</b> : {item?.chargeableWeight}
                  </p>
                  <p>
                    <b>CMB</b> : {item?.cmb}
                  </p>
                  <p>
                    <b>Destination</b> : {item?.destination}
                  </p>
                  <p>
                    <b>POD</b> : {item?.pod}
                  </p>
                  <p>
                    <b>MAWB</b> : {item?.mwab}
                  </p>
                  <p>
                    <b>HAWB NO.</b> : {item?.hwabno}
                  </p>
                </div>
              );
            })}
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
                {reportData?.collecttionBillingDatas?.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        textAlign: 'left',
                      }}
                    >
                      {item?.headOfCharges}
                    </td>
                    <td>{item?.collectionParty}</td>
                    <td>{item?.collectionActualAmountInBDT}</td>
                    <td>{item?.lossAndGain}</td>
                    <td>{item?.grandTotal}</td>
                    <td>{item?.converstionrate}</td>
                    <td>{item?.amontUSD}</td>
                  </tr>
                ))}
                <tr>
                  {/* total  */}
                  <td colSpan="2">
                    <b>Income Total</b>
                  </td>
                  <td>
                    <b>{collectionSum?.collectionActualAmountInBDT}</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>{collectionSum?.amontUSD}</b>
                  </td>
                </tr>

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
                {reportData?.paymentBillingDatas?.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        textAlign: 'left',
                      }}
                    >
                      {item?.headOfCharges}
                    </td>
                    <td>{item?.paymentParty}</td>
                    <td>{item?.paymentActualAmountInBDT}</td>
                    <td>{item?.lossAndGain}</td>
                    <td>{item?.grandTotal}</td>
                    <td>{item?.converstionrate}</td>
                    <td>{item?.amontUSD}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="2">
                    <b>Cost Total </b>
                  </td>
                  <td>
                    <b>{paymentSum?.paymentActualAmountInBDT}</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>{paymentSum?.amontUSD}</b>
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="2">
                    <b>Net Profit </b>
                  </td>
                  <td>
                    <b>
                      {collectionSum?.collectionActualAmountInBDT -
                        paymentSum?.paymentActualAmountInBDT}
                    </b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b>{collectionSum?.amontUSD - paymentSum?.amontUSD}</b>
                  </td>
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
              {convertNumberToWords(
                collectionSum?.collectionActualAmountInBDT -
                  paymentSum?.paymentActualAmountInBDT,
              )}
            </p>
            <p>
              <b>Amount In WordUSD: </b>
              {convertNumberToWords(
                collectionSum?.amontUSD - paymentSum?.amontUSD,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLossInfo;
