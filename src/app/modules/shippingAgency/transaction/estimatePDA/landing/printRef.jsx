import moment from 'moment';
import Select from 'react-select';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { amountToWords } from '../../../../_helper/_ConvertnumberToWord';
import Loading from '../../../../_helper/_loading';
import { getEstimatePDAById } from '../helper';
import './viewInvoice.css';
import customStyles from '../../../../selectCustomStyle';
function PrintRef({ componentRef, estimatePdaid }) {
  const [loading, setLoading] = React.useState(false);
  const [singleData, setSingleData] = React.useState({});
  const [viewType, setViewType] = React.useState({
    value: 'actualAmount',
    label: 'Actual Amount',
  });

  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  useEffect(() => {
    if (estimatePdaid) {
      getEstimatePDAById(estimatePdaid, setLoading, (resData) => {
        setSingleData(resData);
      });
    }
  }, [estimatePdaid]);

  return (
    <>
      <div className="row printSectionNone">
        <div className="col-lg-3 offset-lg-9">
          <label>Report Type</label>
          <Select
            placeholder="Select Renewal Type"
            value={viewType}
            onChange={(value) => {
              setViewType(value);
            }}
            styles={customStyles}
            isSearchable={true}
            options={[
              {
                value: 'estimatedAmount',
                label: 'Estimated Amount',
              },
              {
                value: 'customerFinalAmount',
                label: 'Customer Final Amount',
              },
              {
                value: 'actualAmount',
                label: 'Actual Amount',
              },
            ]}
          />
        </div>
      </div>
      {loading && <Loading />}
      <div ref={componentRef}>
        <div className="EstimatePDAView">
          <div className="EstimatePDAViewTopBar">
            <h1>{selectedBusinessUnit?.label}</h1>
            <h6>Final Port Disbursement Account</h6>
          </div>

          <div className="EstimatePDAheaderInfo">
            <div className="left">
              <p>
                <b>Working Port:</b> {singleData?.workingPortName}
              </p>
              {/* <p>
                <b>Activity in Vessel:</b> {singleData?.activity}
              </p> */}
              <p>
                <b>Customer:</b> {singleData?.customerName}
              </p>
            </div>
            <div className="right">
              <p>
                <b>Date:</b>{' '}
                {singleData?.lastActionDateTime
                  ? moment(singleData?.lastActionDateTime).format('YYYY-MM-DD')
                  : 'N/A'}
              </p>
              <p>
                <b>Vessel:</b> {singleData?.vesselName}
              </p>
              <p>
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <p>
                    <b>Arrived On:</b>{' '}
                    {singleData?.arrivedDateTime &&
                      moment(singleData?.arrivedDateTime).format('YYYY-MM-DD')}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0 5px',
                    }}
                  >
                    |
                  </span>
                  <p>
                    <b>Sailed On:</b>{' '}
                    {singleData?.sailedDateTime &&
                      moment(singleData?.sailedDateTime).format('YYYY-MM-DD')}
                  </p>
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <p>
                    <b>Currency:</b> {singleData?.currency}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0 5px',
                    }}
                  >
                    |
                  </span>
                  <p>
                    <b>Exch. Rate:</b>{' '}
                    {singleData?.exchangeRate
                      ? singleData?.exchangeRate
                      : 'N/A'}
                  </p>
                </div>
              </p>
            </div>
          </div>
          <div className="table">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Expense Particulars</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.shippingAgencyEstimatePdarowDtos
                  ?.filter((i) => i?.[`${viewType?.value}`])
                  .map((item, index) => (
                    <tr key={index}>
                      <td className="text-center"> {index + 1}</td>
                      <td>{item?.particularName}</td>
                      <td className="text-right">
                        {item?.[`${viewType?.value}`]}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan={2} className="text-right">
                    <b>Total</b>
                  </td>
                  <td className="text-right">
                    <b>
                      {singleData?.shippingAgencyEstimatePdarowDtos?.reduce(
                        (acc, curr) =>
                          acc + (+curr?.[`${viewType?.value}`] || 0),
                        0
                      )}
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="footer">
            <div className="left">
              <p
                style={{
                  textTransform: 'capitalize',
                }}
              >
                <b>In Word</b> :{' '}
                {amountToWords(
                  singleData?.shippingAgencyEstimatePdarowDtos?.reduce(
                    (acc, curr) => acc + (+curr?.[`${viewType?.value}`] || 0),
                    0
                  ) || 0
                )}
              </p>
              <p>
                <b>Beneficiary Name</b> : {singleData?.beneficiaryName}
              </p>
              <p>
                <b>Address </b>: {singleData?.beneficiaryAddress}
              </p>
              <p>
                <b>Bank Name</b> : {singleData?.bankName}
              </p>
              <p>
                <b>Address</b> : {singleData?.bankAddress}
              </p>
              <p>
                <b>Account Number</b> : {singleData?.bankAccNo}
              </p>
              <p>
                <b>Account Name</b> : {singleData?.accountName}
              </p>
              <p>
                <b>Swift Code</b> : {singleData?.swiftCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintRef;
