import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import AdjustmentJournalModal from "./adjustmentJournalModal";
import BankJournalModal from "./bankJournalModal";

const VoucherModal = ({
  values,
  subGeneralLedgerRow,
  businessUnit,
  profileData,
}) => {
  const printRef = useRef();
  const [totalAmount, setTotalAmount] = useState(0);
  const [voucherInfo, getVoucherInfo, loadingOnGetVoucherInfo] = useAxiosGet();

  useEffect(() => {
    if (subGeneralLedgerRow?.intsubglid) {
      getVoucherInfo(
        `/fino/IncomeStatement/GetIncomeStatementProjected?partName=VoucherList&dteFromDate=${values?.fromDate
        }&dteFromDateL=${values?.fromDate}&dteToDate=${values?.toDate
        }&dteToDateL=${values?.toDate}&BusinessUnitGroup=${values?.enterpriseDivision?.value
        }&BusinessUnitId=${values?.businessUnit?.value}&GLId=${subGeneralLedgerRow?.glId
        }&SUBGLId=${subGeneralLedgerRow?.intsubglid}&ConvertionRate=${values?.conversionRate
        }&SubGroup=${values?.subDivision?.value || "All"}`,
        (data) => {
          setTotalAmount(
            data?.reduce((value, row) => (value += row?.numAmount), 0) || 0
          );
        }
      );
    }
  }, [subGeneralLedgerRow?.intsubglid]);

  const [voucherRow, setVoucherRow] = useState(null);
  const [showDebitCreditModal, setShowDebitCreditModal] = useState(false);

  return (
    <>
      <ICustomCard
        title="Voucher List"
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
        {loadingOnGetVoucherInfo && <Loading />}

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
                    Particulars :{" "}
                    <b>{subGeneralLedgerRow?.strFSComponentName}</b>
                  </span>
                  <span>
                    Ledger : <b>{subGeneralLedgerRow?.strGeneralLedgerName}</b>
                  </span>
                  <span>
                    Ledger Code :{" "}
                    <b>{subGeneralLedgerRow?.strGeneralLedgerCode}</b>
                  </span>
                  <span>
                    Sub Ledger : <b>{subGeneralLedgerRow?.strsubglname}</b>
                  </span>
                  <span>
                    Sub Ledger Code : <b>{subGeneralLedgerRow?.strsubglcode}</b>
                  </span>
                </div>
              </div>
              <div className="loan-scrollable-table">
                <div
                  className="scroll-table _table"
                  style={{ maxHeight: "540px" }}
                >
                  <table
                    className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-2"
                    id="table-to-xlsx"
                  >
                    <thead>
                      <tr>
                        <th style={{ minWidth: "60px" }}>SL</th>
                        <th>Voucher Code</th>
                        <th style={{ textAlign: "center" }}>
                          Transaction Date
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
                      {voucherInfo?.length > 0 ? (
                        <>
                          {voucherInfo?.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>

                              <td className="text-center">
                                {item?.strAccountingJournalCode || "N/A"}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {item?.dteTransactionDate
                                  ? _dateFormatter(item?.dteTransactionDate)
                                  : "N/A"}
                              </td>
                              <td
                                onClick={() => {
                                  setVoucherRow(item);
                                  setShowDebitCreditModal(true);
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
        show={showDebitCreditModal}
        onHide={() => {
          setShowDebitCreditModal(false);
          setVoucherRow(null);
        }}
      >
        {(voucherRow?.intaccountingjournaltypeid === 7 ||
          voucherRow?.intaccountingjournaltypeid === 8 ||
          voucherRow?.intaccountingjournaltypeid === 9) && (
            <AdjustmentJournalModal
              id={voucherRow?.intAccountingJournalId}
              typeId={voucherRow?.intaccountingjournaltypeid}
            />
          )}

        {(voucherRow?.intaccountingjournaltypeid === 4 ||
          voucherRow?.intaccountingjournaltypeid === 5 ||
          voucherRow?.intaccountingjournaltypeid === 6) && (
            <BankJournalModal
              id={voucherRow?.intAccountingJournalId}
              headerData={{
                ...voucherRow,
                businessUnit,
                accountingJournalTypeId: voucherRow?.intaccountingjournaltypeid,
                fromWhere: "incomeStatement",
              }}
            />
            // <BankJournalViewTableRow
            // id={voucherRow?.intAccountingJournalId}
            // headerData={{
            //   ...voucherRow,
            //   businessUnit,
            //   accountingJournalTypeId: voucherRow?.intaccountingjournaltypeid,
            //   fromWhere: "incomeStatement",
            // }}
            // />
          )}

        {/* {(
          voucherRow?.intaccountingjournaltypeid === 1 ||
          voucherRow?.intaccountingjournaltypeid === 2 ||
          voucherRow?.intaccountingjournaltypeid === 3
        ) && (
            <InvTransViewTableRow
              id={voucherRow?.intAccountingJournalId}
              headerData={{ accountingJournalTypeId: voucherRow?.intaccountingjournaltypeid }}
            />

          )} */}
      </IViewModal>
    </>
  );
};

export default VoucherModal;
