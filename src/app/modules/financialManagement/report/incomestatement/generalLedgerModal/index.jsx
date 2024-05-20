/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import ReactToPrint from "react-to-print";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IViewModal from "../../../../_helper/_viewModal";
import SubGeneralLedgerModalForIncomeStatement from "../subGeneralLedgerModal";

const GeneralLedgerModalForIncomeStatement = ({
  values,
  businessUnitList,
  incomeStatementRow,
  profileData,
}) => {
  const printRef = useRef();
  const selectedBusinessUnit = useMemo(
    () =>
      businessUnitList?.find(
        (item) => item?.value === values?.businessUnit?.value
      ),
    [values?.businessUnit?.value]
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [
    generalLedgerInfo,
    getGeneralLedgerInfo,
    loadingOnGetGeneralLedgerInfo,
  ] = useAxiosGet();

  useEffect(() => {
    if (incomeStatementRow?.intFSId) {
      getGeneralLedgerInfo(
        `/fino/IncomeStatement/GetIncomeStatement?partName=GeneralLedger&dteFromDate=${values?.fromDate}&dteFromDateL=${values?.fromDate}&dteToDate=${values?.todate}&dteToDateL=${values?.todate}&BusinessUnitGroup=${values?.enterpriseDivision?.value}&BusinessUnitId=${values?.businessUnit?.value}&fsComponentId=${incomeStatementRow?.intFSId}&ConvertionRate=${values?.conversionRate}&SubGroup=${values?.subDivision?.value || 0}`,
        (data) => {
          setTotalAmount(
            data?.reduce((value, row) => (value += row?.numAmount), 0) || 0
          );
        }
      );
    }
  }, [incomeStatementRow?.intFSId]);

  const [generalLedgerRow, setGeneralLedgerRow] = useState(null);
  const [showSubGeneralLedgerModal, setShowSubGeneralLedgerModal] = useState(
    false
  );

  return (
    <>
      <ICustomCard
        title="Ledger"
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
        {loadingOnGetGeneralLedgerInfo && <Loading />}

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
                    {values?.businessUnit?.value === 0
                      ? profileData?.accountName
                      : selectedBusinessUnit?.label}
                  </span>
                  {values?.businessUnit?.value > 0 ? (
                    <span>{selectedBusinessUnit?.businessUnitAddress}</span>
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
                    Particulars :{" "}
                    <b>{incomeStatementRow?.strFSComponentName}</b>
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
                        <th style={{ minWidth: "60px" }}>SL</th>
                        <th>GL Code</th>
                        <th>
                          <div style={{ textAlign: "left", marginLeft: "5px" }}>
                            GL Name
                          </div>
                        </th>
                        <th>
                          <div
                            style={{ textAlign: "right", marginRight: "5px" }}
                          >
                            Amount
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {generalLedgerInfo?.length > 0 ? (
                        <>
                          {generalLedgerInfo?.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>

                              <td className="text-center">
                                {item?.strGeneralLedgerCode || "N/A"}
                              </td>
                              <td
                                style={{ textAlign: "left", marginLeft: "5px" }}
                              >
                                {item?.strGeneralLedgerName || "N/A"}
                              </td>
                              <td
                                onClick={() => {
                                  setGeneralLedgerRow(item);
                                  setShowSubGeneralLedgerModal(true);
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
                          style={{
                            fontWeight: "bold",
                            textAlign: "right",
                            marginRight: "5px",
                          }}
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
        show={showSubGeneralLedgerModal}
        onHide={() => {
          setShowSubGeneralLedgerModal(false);
          setGeneralLedgerRow(null);
        }}
      >
        <SubGeneralLedgerModalForIncomeStatement
          values={values}
          generalLedgerRow={{
            ...generalLedgerRow,
            strFSComponentName: incomeStatementRow?.strFSComponentName,
          }}
          businessUnit={selectedBusinessUnit}
          profileData={profileData}
        />
      </IViewModal>
    </>
  );
};

export default GeneralLedgerModalForIncomeStatement;

// {/* <div className="d-flex flex-column align-items-left justify-content-between">
//   <span>
//     Budget : <b>{incomeStatementRow?.monLastPeriodAmount || 0}</b>
//   </span>
//   <span>
//     Actual : <b>{incomeStatementRow?.monCurrentPeriodAmount || 0}</b>
//   </span>
//   <span>
//     {" "}
//     Variance :<b>{(incomeStatementRow?.monCurrentPeriodAmount || 0) * -1}</b>
//   </span>
// </div>; */}

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
// {/* <div className=' d-flex flex-column'>
//           <span className="reportBorder"></span>
//           <span>Authorized Signatory Akij Group</span>
//         </div> */}
// <div className=" d-flex flex-column">
//   <span className="reportBorder"></span>
//   <span>Payee</span>
// </div>
// </div>
