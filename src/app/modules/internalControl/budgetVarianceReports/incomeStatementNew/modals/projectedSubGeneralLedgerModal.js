import React, { useEffect, useRef, useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../../../_helper/_customCard";
import ReactToPrint from "react-to-print";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import VoucherModal from "./voucherModal";

const ProjectedSubGeneralLedgerModal = ({
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
        `/fino/IncomeStatement/GetIncomeStatementProjected?partName=SubGeneralLedger&dteFromDate=${
          values?.fromDate
        }&dteFromDateL=${values?.fromDate}&dteToDate=${
          values?.toDate
        }&dteToDateL=${values?.toDate}&BusinessUnitGroup=${
          values?.enterpriseDivision?.value
        }&BusinessUnitId=${values?.businessUnit?.value}&GLId=${
          generalLedgerRow?.intGeneralLedgerId
        }&ConvertionRate=${values?.conversionRate}&SubGroup=${values
          ?.subDivision?.value || "All"}`,
        (data) => {
          setTotalAmount(
            data?.reduce((value, row) => (value += row?.numAmount), 0) || 0
          );
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalLedgerRow?.intGeneralLedgerId, values]);

  const [subGeneralLedgerRow, setSubGeneralLedgerRow] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  return (
    <>
      <ICustomCard
        title="Sub General Ledger"
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
        <VoucherModal
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
        {/* <VoucherModalForIncomeStatement
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
        /> */}
      </IViewModal>
    </>
  );
};

export default ProjectedSubGeneralLedgerModal;

// StatisticalDetails
