/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import VoucherModalForIncomeStatement from "../voucherModal";

const SubGeneralLedgerModalForIncomeStatement = ({
  values,
  generalLedgerRow,
  businessUnit,
  profileData,
}) => {
  const printRef = useRef();
  const [totalAmount, setTotalAmount] = useState(0);
  const [
    subGeneralLedgerInfo,
    getSubGeneralLedgerInfo,
    loadingOnGetSubGeneralLedgerInfo,
  ] = useAxiosGet();

  useEffect(() => {
    if (generalLedgerRow?.intGeneralLedgerId) {
      getSubGeneralLedgerInfo(
        `/fino/IncomeStatement/GetIncomeStatement?partName=SubGeneralLedger&dteFromDate=${values?.fromDate}&dteFromDateL=${values?.fromDate}&dteToDate=${values?.todate}&dteToDateL=${values?.todate}&BusinessUnitGroup=${values?.enterpriseDivision?.value}&BusinessUnitId=${values?.businessUnit?.value}&GLId=${generalLedgerRow?.intGeneralLedgerId}&ConvertionRate=${values?.conversionRate}&SubGroup=${values?.subDivision?.value || 0}&intProfitCenId=${values.profitCenter?.value ||
          0}`,
        (data) => {
          setTotalAmount(
            data?.reduce((value, row) => (value += row?.numAmount), 0) || 0
          );
        }
      );
    }
  }, [generalLedgerRow?.intGeneralLedgerId]);

  const [subGeneralLedgerRow, setSubGeneralLedgerRow] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  return (
    <>
      <ICustomCard
        title="Sub Ledger"
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => <button className="btn btn-primary">Print</button>}
              content={() => printRef.current}
            />
          </>
        )}
      >
        {loadingOnGetSubGeneralLedgerInfo && <Loading />}

        <div className="mt-2">
          <div ref={printRef}>
            <div className="m-3 adjustment-journalReport">
              <div>
                <div className="d-flex flex-column justify-content-center align-items-center my-2">
                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {values?.businessUnit?.value > 0
                      ? businessUnit?.label
                      : profileData?.accountName}
                  </span>
                  {values?.businessUnit?.value > 0 ? (
                    <span>{businessUnit?.businessUnitAddress}</span>
                  ) : (
                    <></>
                  )}
                  {values?.profitCenter?.value > 0 ? (
                    <span>
                      Profit Center : <b>{values?.profitCenter?.label}</b>
                    </span>
                  ) : (
                    <></>
                  )}
                  <span>
                    Particulars : <b>{generalLedgerRow?.strFSComponentName}</b>
                  </span>
                  <span>
                    Ledger : <b>{generalLedgerRow?.strGeneralLedgerName}</b>
                  </span>
                  <span>
                    Ledger Code :{" "}
                    <b>{generalLedgerRow?.strGeneralLedgerCode}</b>
                  </span>
                </div>
              </div>

              <div className="loan-scrollable-table">
                <div
                  className="scroll-table _table"
                  style={{ maxHeight: "540px", overflowX: "hidden" }}
                >
                  <table
                    className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-2"
                    id="table-to-xlsx"
                  >
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Sub-GL Code</th>
                        <th>
                          <div style={{ textAlign: "left", marginLeft: "5px" }}>
                            {" "}
                            Sub-GL Name
                          </div>
                        </th>
                        <th>
                          <div
                            style={{ textAlign: "right", marginRight: "5px" }}
                          >
                            {" "}
                            Amount
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subGeneralLedgerInfo?.length > 0 ? (
                        <>
                          {subGeneralLedgerInfo?.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>

                              <td className="text-center">
                                {item?.strsubglcode || "N/A"}
                              </td>
                              <td
                                style={{ textAlign: "left", marginLeft: "5px" }}
                              >
                                {item?.strsubglname || "N/A"}
                              </td>
                              <td
                                onClick={() => {
                                  setSubGeneralLedgerRow(item);
                                  setShowVoucherModal(true);
                                }}
                                style={{
                                  textDecoration: "underline",
                                  color: "blue",
                                  cursor: "pointer",
                                  textAlign: "right",
                                  marginRight: "5px",
                                }}
                              >
                                {item?.numAmount}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <></>
                      )}

                      <tr>
                        <td
                          colspan="3"
                          className="text-center ml-1"
                          style={{ fontWeight: "bold" }}
                        >
                          Total
                        </td>

                        <td
                          className="text-right pr-2"
                          style={{ fontWeight: "bold" }}
                        >
                          {totalAmount || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </ICustomCard>
      <IViewModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          setSubGeneralLedgerRow(null);
        }}
      >
        <VoucherModalForIncomeStatement
          values={values}
          subGeneralLedgerRow={{
            ...subGeneralLedgerRow,
            glId: generalLedgerRow?.intGeneralLedgerId,
            strFSComponentName: generalLedgerRow?.strFSComponentName,
            strGeneralLedgerName: generalLedgerRow?.strGeneralLedgerName,
            strGeneralLedgerCode: generalLedgerRow?.strGeneralLedgerCode,
          }}
          businessUnit={businessUnit}
          profileData={profileData}
        />
      </IViewModal>
    </>
  );
};

export default SubGeneralLedgerModalForIncomeStatement;
// {/* <div className="d-flex flex-column align-items-left justify-content-between">
//                 <span>
//                   GL Code : <b>{generalLedgerRow?.strGeneralLedgerCode}</b>
//                 </span>
//                 <span>
//                   GL Name : <b>{generalLedgerRow?.strGeneralLedgerName}</b>
//                 </span>
//               </div> */}

// <div className="mt-5">
// <div className="d-flex">
//   <p className="mr-2" style={{ fontWeight: "bold" }}>
//     Sum Of Taka :{" "}
//   </p>
//   <p style={{ fontWeight: "bold" }}>{totalAmount || 0}</p>
// </div>
// </div>
// <div className="row d-flex justify-content-around align-items-end my-15">
// <div className=" d-flex flex-column">
//   <span className="mb-1">
//     {/* {bankJournalReport?.objHeader?.actionBy} */}
//   </span>
//   <span className="reportBorder"></span>
//   <span>Prepared By</span>
// </div>
// <div className=" d-flex flex-column">
//   <span className="reportBorder"></span>
//   <span>Reviewed By</span>
// </div>
// <div className="d-flex flex-column">
//   <span className="reportBorder"></span>
//   <span>Authorized Signatory Akij Resource Limited</span>
// </div>

// <div className=" d-flex flex-column">
//   <span className="reportBorder"></span>
//   <span>Payee</span>
// </div>
// </div>
