import React, { useState, useRef, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { getTaxAccountingJournal } from "./helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { useSelector } from "react-redux";
// import IViewModal from "../../../../_helper/_viewModal";
// import SupplerInvoiceView from "../../../invoiceManagementSystem/approvebillregister/supplerInvoiceView";
// import SupplierAdvanceView from "../../../invoiceManagementSystem/approvebillregister/supplierAdvanceView";
// import AdvForInternalView from "../../../invoiceManagementSystem/approvebillregister/advForInternal";
// import ExpenseView from "../../../invoiceManagementSystem/approvebillregister/expenseView";
// import ViewFuelBill from "../../../invoiceManagementSystem/billregister/fuelBill/view/viewBillRegister";
// import ViewSalesCommission from "../../../invoiceManagementSystem/billregister/salesCommission/view/viewSalesCommission";
// import ViewTransportBill from "../../../invoiceManagementSystem/billregister/transportBill/view/viewBillRegister";
// import ViewLabourBill from "../../../invoiceManagementSystem/billregister/labourBill/view/viewBillRegister";
// import OthersBillView from "../../../invoiceManagementSystem/billregister/othersBillNew/view/othersBillView";
// import ViewInternalTransportBill from "../../../invoiceManagementSystem/billregister/internalTransportBill/view/viewBillRegister";
import { APIUrl } from "../../../../../App";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import Attachments from "./Attachments";
// import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

export function BankJournalReportView({ journalCode, headerData, clickRowData }) {
  const [loading, setLoading] = useState(false);
  const [bankJournalReport, setbankJournalReport] = useState([]);
  const [, setModalShow] = useState(false);
  const [headerObj, setHeaderObj] = useState("");
  const [isModal, setIsModal] = useState(false)

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  });

  useEffect(() => {
    getTaxAccountingJournal(journalCode, setbankJournalReport, setLoading);
  }, [journalCode]);

  useEffect(() => {
    if (bankJournalReport?.length > 0) {
      const findHeaderObj = bankJournalReport?.find(
        (item) => item?.subGLTypeId === 6
      );
      console.log(findHeaderObj);
      const modifyHeaderObj = {
        ...findHeaderObj,
        businessUnitName: findHeaderObj?.businessUnitName,
        businessUnitAddress: findHeaderObj?.businessUnitAddress,
        bankName: findHeaderObj?.subGLName,
        bankAccountNo: findHeaderObj?.subGlCode,
        billRegisterId: findHeaderObj?.billRegisterId,
        billTypeId: findHeaderObj?.billTypeId,
        narration: findHeaderObj?.narration,
        bankJournalCode: findHeaderObj?.journalCode,
        journalDate: findHeaderObj?.transactionDate,
        instrumentName: findHeaderObj?.instrumentTypeName,
      };
      setHeaderObj(modifyHeaderObj);
    }
  }, [bankJournalReport]);

  const printRef = useRef();
  let creditAmount = 0,
    debitAmount = 0;
  return (
    <>
      <ICustomCard
        title=""
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
        <Formik
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="mt-2">
                  <div ref={printRef}>
                    <div className="m-3 adjustment-journalReport">
                      <div>
                        <div style={{ position: "absolute" }}>
                          <img
                            style={{ width: "70px" }}
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                            alt=""
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>{selectedBusinessUnit?.label}</h3>
                          <span>
                            <b>{selectedBusinessUnit?.address}</b>
                          </span>
                          <span className="my-2">
                            <h5>Bank Journal</h5>
                          </span>

                          <span>
                            <h5>
                              Bank Name And A/C NO. {headerObj?.bankName}{" "}
                              {headerObj?.bankAccountNo}
                            </h5>
                          </span>

                          {/* <span>Bank Name And A/C NO.</span> */}
                        </div>
                      </div>
                      <div className="my-3 d-flex justify-content-between">
                        <div>
                          <div>
                            Cheque No.
                            <sapn
                              className="ml-1"
                              style={{ fontWeight: "bold" }}
                            >
                              {headerObj?.chequeNo}
                              {" , "}
                            </sapn>
                            Instrument :
                            <sapn className="font-weight-bold ml-1">
                              {headerObj?.instrumentName}
                            </sapn>
                          </div>
                          <div>
                            Cheque Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(headerObj?.instrumentDate)}
                            </sapn>
                          </div>
                          <div>
                          Reference :  <IView 
                                            title="View Attachment" 
                                            clickHandler={() => {
                                              setIsModal(true)
                                            }} />
                          </div>
                        </div>
                        <div>
                          <div>
                            Voucher No.
                            <sapn
                              className="font-weight-bold ml-1"
                              style={
                                headerObj?.billRegisterId &&
                                headerObj?.billTypeId
                                  ? {
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      color: "#3699FF",
                                    }
                                  : {}
                              }
                              onClick={() => {
                                if (
                                  headerObj?.billRegisterId &&
                                  headerObj?.billTypeId
                                ) {
                                  setModalShow(true);
                                }
                              }}
                            >
                              {headerObj?.bankJournalCode}
                            </sapn>
                          </div>
                          <div>
                            Voucher Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(headerObj?.journalDate)}
                            </sapn>
                          </div>
                        </div>
                      </div>
                      <table className="journalTable" id="table-to-xlsx">
                        <thead>
                          <tr>
                            <th>SL</th>
                            {/* <th>Account Code No</th> */}
                            <th>Head Of Accounts</th>
                            <th>Transaction</th>
                            <th>Debit</th>
                            <th>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankJournalReport?.map((data, i) => {
                            if (data.debit > 0) {
                              debitAmount += Math.abs(data?.debit);
                            }
                            if (data.credit < 0) {
                              creditAmount += Math.abs(data?.credit);
                            }
                            return (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                {/* <td className='text-right'>{data?.itemCode}</td> */}
                                <td>{data?.generalLedgerName}</td>
                                <td>{data?.subGLName}</td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data.debit > 0
                                      ? _formatMoney(Math.abs(data?.debit))
                                      : ""}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data.credit < 0
                                      ? _formatMoney(Math.abs(data?.credit))
                                      : ""}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
                              {_formatMoney(Math.abs(debitAmount))}
                            </td>
                            <td
                              className="text-right pr-2"
                              style={{ fontWeight: "bold" }}
                            >
                              {_formatMoney(Math.abs(creditAmount))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="mt-5">
                        <div className="d-flex">
                          {/* <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Sum Of Taka :{" "}
                          </p>
                          <p style={{ fontWeight: "bold" }}>
                            {headerObj?.amount}
                          </p> */}
                        </div>
                        <div className="d-flex">
                          <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Narration :{" "}
                          </p>
                          <p>{headerObj?.narration}</p>
                        </div>
                      </div>
                      <div className="row d-flex justify-content-around align-items-center my-15">
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Prepared By</span>
                        </div>
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Reviewed By</span>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Authorized Signatory</span>
                        </div>
                        {/* <div className=' d-flex flex-column'>
                          <span className="reportBorder"></span>
                          <span>Authorized Signatory Akij Group</span>
                        </div> */}
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Payee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </FormikForm>
              {/* <IViewModal show={modalShow} onHide={() => setModalShow(false)}>
                {gridItem?.billTypeId === 1 && (
                  <SupplerInvoiceView
                    gridItem={gridItem}
                    laingValues={values}
                    girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 2 && (
                  <SupplierAdvanceView
                    gridItem={gridItem}
                    laingValues={values}
                    girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 3 && (
                  <AdvForInternalView
                    gridItem={gridItem}
                    laingValues={values}
                    girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 4 && (
                  <ExpenseView
                    gridItem={gridItem}
                    laingValues={values}
                    girdDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 6 && (
                  <ViewTransportBill
                    landingValues={values}
                    gridItem={gridItem}
                    setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 7 && (
                  <ViewSalesCommission
                    billRegisterId={gridItem?.billRegisterId}
                    landingValues={values}
                    gridItem={gridItem}
                    setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 8 && (
                  <ViewFuelBill
                    landingValues={values}
                    gridItem={gridItem}
                    setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}

                {(gridItem?.billTypeId === 9 || gridItem?.billType === 10) && (
                  <ViewLabourBill
                    landingValues={values}
                    gridItem={gridItem}
                    setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
                {gridItem?.billTypeId === 12 && (
                  <OthersBillView
                    landingValues={values}
                    gridItem={gridItem}
                    setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                    isView={false}
                    girdDataFunc={girdDataFunc}
                  />
                )}
                {gridItem?.billTypeId === 13 && (
                  <ViewInternalTransportBill
                    landingValues={values}
                    gridItem={gridItem}
                    setDataFunc={girdDataFunc}
                    setModalShow={setModalShow}
                  />
                )}
              </IViewModal> */}
            </>
          )}
        </Formik>
      </ICustomCard>
      <IViewModal 
        show={isModal}
        onHide={() => setIsModal(false)}
      >
        <Attachments clickRowData={clickRowData} />
      </IViewModal>
    </>
  );
}
