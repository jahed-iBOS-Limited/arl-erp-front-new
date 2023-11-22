import React, { useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { getEstimatePDAById } from "../helper";
import Loading from "../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import "./viewInvoice.css";
import { amountToWords } from "../../../../_helper/_ConvertnumberToWord";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
function ViewInvoice({ viewClickRowItem }) {
  const [loading, setLoading] = React.useState(false);
  const [singleData, setSingleData] = React.useState({});
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  useEffect(() => {
    if (viewClickRowItem?.estimatePdaid) {
      getEstimatePDAById(
        viewClickRowItem?.estimatePdaid,
        setLoading,
        (resData) => {
          setSingleData(resData);
        }
      );
    }
  }, [viewClickRowItem]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Estimate PDA ",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title='Estimate PDA View'
        renderProps={() => {
          return (
            <>
              <button
                type='button'
                className='btn btn-primary px-3 py-2'
                onClick={handlePrint}
              >
                <i className='mr-1 fa fa-print pointer' aria-hidden='true'></i>
                Print
              </button>
            </>
          );
        }}
      >
        <div ref={componentRef}>
          <div className='EstimatePDAView'>
            <div className='EstimatePDAViewTopBar'>
              <h1>{selectedBusinessUnit?.label}</h1>
              <h6>Final Port Disbursement Account</h6>
            </div>

            <div className='EstimatePDAheaderInfo'>
              <div className='left'>
                <p>
                  <b>Working Port:</b> {singleData?.workingPortName}
                </p>
                <p>
                  <b>Activity in Vessel:</b> {singleData?.activity}
                </p>
                <p>
                  <b>Customer:</b> {singleData?.customerName}
                </p>
              </div>
              <div className='right'>
                <p>
                  <b>Date:</b> {}
                </p>
                <p>
                  <b>Vessel:</b> {singleData?.vesselName}
                </p>
                <p>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <p>
                      <b>Arrived On:</b>{" "}
                      {singleData?.arrivedDateTime &&
                        moment(singleData?.arrivedDateTime).format(
                          "YYYY-MM-DD"
                        )}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0 5px",
                      }}
                    >
                      |
                    </span>
                    <p>
                      <b>Sailed On:</b>{" "}
                      {singleData?.sailedDateTime &&
                        moment(singleData?.sailedDateTime).format("YYYY-MM-DD")}
                    </p>
                  </div>
                </p>
                <p>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <p>
                      <b>Currency:</b> {singleData?.currency}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0 5px",
                      }}
                    >
                      |
                    </span>
                    <p>
                      <b>Exch. Rate:</b>{" "}
                      {singleData?.exchangeRate
                        ? singleData?.exchangeRate
                        : "N/A"}
                    </p>
                  </div>
                </p>
              </div>
            </div>
            <div className='table'>
              <table className='table table-striped table-bordered global-table'>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Expense Particulars</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {singleData?.shippingAgencyEstimatePdarowDtos?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td className='text-center'> {index + 1}</td>
                        <td>{item?.particularName}</td>
                        <td className='text-right'>{item?.actualAmount}</td>
                      </tr>
                    )
                  )}
                  <tr>
                    <td colSpan={2} className='text-right'>
                      <b>Total</b>
                    </td>
                    <td className='text-right'>
                      <b>
                        {singleData?.shippingAgencyEstimatePdarowDtos?.reduce(
                          (acc, curr) => acc + (+curr?.actualAmount || 0),
                          0
                        )}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='footer'>
              <div className='left'>
                <p>
                  <b>In Word</b> :{" "}
                  {amountToWords(
                    singleData?.shippingAgencyEstimatePdarowDtos?.reduce(
                      (acc, curr) => acc + (+curr?.actualAmount || 0),
                      0
                    ) || 0
                  )}
                </p>
                <p>
                  <b>Beneficiary Name</b> : {selectedBusinessUnit?.label}
                </p>
                <p>
                  <b>Address </b>: {selectedBusinessUnit?.address}
                </p>
                <p>
                  <b>Bank Name</b> : Islami Bank Bangladesh Limited
                </p>
                <p>
                  <b>Address</b> : Islami Bank Bangladesh Limited
                </p>
                <p>
                  <b>Account Number</b> : 20502130100113301
                </p>
                <p>
                  <b>Account Name</b> : Akij Shipping Line Limited
                </p>
              </div>
            </div>
          </div>
        </div>
      </ICustomCard>
    </>
  );
}

export default ViewInvoice;
