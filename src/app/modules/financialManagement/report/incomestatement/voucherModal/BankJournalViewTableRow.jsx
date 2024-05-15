/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form as FormikForm, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { useDispatch } from "react-redux";
import { getBankJournalView } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import Loading from "../../../../_helper/_loading";
import { APIUrl } from "../../../../../App";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IViewModal from "../../../../_helper/_viewModal";
import SupplerInvoiceView from "../../../invoiceManagementSystem/approvebillregister/supplerInvoiceView";
import SupplierAdvanceView from "../../../invoiceManagementSystem/approvebillregister/supplierAdvanceView";
import AdvForInternalView from "../../../invoiceManagementSystem/approvebillregister/advForInternal";
import ExpenseView from "../../../invoiceManagementSystem/approvebillregister/expenseView";
import ViewTransportBill from "../../../invoiceManagementSystem/billregister/transportBill/view/viewBillRegister";
import ViewSalesCommission from "../../../invoiceManagementSystem/billregister/salesCommission/view/viewSalesCommission";
import ViewFuelBill from "../../../invoiceManagementSystem/billregister/fuelBill/view/viewBillRegister";
import ViewLabourBill from "../../../invoiceManagementSystem/billregister/labourBill/view/viewBillRegister";
import OthersBillView from "../../../invoiceManagementSystem/billregister/othersBillNew/view/othersBillView";
import ViewInternalTransportBill from "../../../invoiceManagementSystem/billregister/internalTransportBill/view/viewBillRegister";

export function BankJournalViewTableRow({ id, headerData }) {
  const [loading, setLoading] = useState(false);
  const [bankJournalReport, setbankJournalReport] = useState([]);
  const [gridItem, setGridItem] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  const { selectedBusinessUnit, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [theBusinessUnit, setTheBusinessUnit] = useState("");
  useEffect(() => {
    if (id && headerData) {
      getBankJournalView(
        id,
        headerData?.accountingJournalTypeId,
        headerData?.businessUnit
          ? headerData?.businessUnit?.value
          : selectedBusinessUnit?.value,
        (bankJournalReportData) => {
          setbankJournalReport(bankJournalReportData);
          const specificBusinessUnit = businessUnitList?.find(
            (item) =>
              item?.value === bankJournalReportData?.objHeader?.businessUnitId
          );
          setTheBusinessUnit(specificBusinessUnit);
        },
        setLoading,
        headerData
      );
    }
  }, [id, headerData, selectedBusinessUnit]);

  useEffect(() => {
    setGridItem(bankJournalReport?.objHeader);
  }, [bankJournalReport]);

  const girdDataFunc = () => {};

  const printRef = useRef();

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            {bankJournalReport?.objHeader?.attachment ? (
              <div>
                <button
                  onClick={() => {
                    dispatch(
                      getDownlloadFileView_Action(
                        bankJournalReport?.objHeader?.attachment
                      )
                    );
                  }}
                  className="btn btn-primary mr-4"
                >
                  Attachment View
                </button>
              </div>
            ) : null}
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
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${theBusinessUnit?.imageId ||
                              selectedBusinessUnit?.imageId}`}
                            alt=""
                          />
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <span
                            style={{
                              fontSize: "22px",
                              fontWeight: "bold",
                            }}
                          >
                            {bankJournalReport?.objHeader?.businessUnitName}
                          </span>
                          <span>
                            {bankJournalReport?.objHeader?.businessUnitAddress}
                          </span>
                          <span className="my-2">Bank Journal</span>
                          <span>
                            Bank Name And A/C NO.{" "}
                            {bankJournalReport?.objHeader?.bankName}{" "}
                            {bankJournalReport?.objHeader?.bankAccountNo}
                          </span>
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
                              {bankJournalReport?.objHeader?.chequeNo}
                              {" , "}
                            </sapn>
                            Instrument :
                            <sapn className="font-weight-bold ml-1">
                              {bankJournalReport?.objHeader?.instrumentName}
                            </sapn>
                          </div>
                          <div>
                            Cheque Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(
                                bankJournalReport?.objHeader?.chequeDate
                              )}
                            </sapn>
                          </div>
                        </div>
                        <div>
                          <div>
                            Voucher No.
                            <sapn
                              className="font-weight-bold ml-1"
                              style={
                                gridItem?.billRegisterId && gridItem?.billTypeId
                                  ? {
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      color: "#3699FF",
                                    }
                                  : {}
                              }
                              onClick={() => {
                                if (
                                  gridItem?.billRegisterId &&
                                  gridItem?.billTypeId
                                ) {
                                  setModalShow(true);
                                }
                              }}
                            >
                              {bankJournalReport?.objHeader?.bankJournalCode}
                            </sapn>
                          </div>
                          <div>
                            Voucher Date :
                            <sapn className="font-weight-bold ml-1">
                              {_dateFormatter(
                                bankJournalReport?.objHeader?.journalDate
                              )}
                            </sapn>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
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
                            {bankJournalReport?.objRow?.map((data, i) => (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                {/* <td className='text-right'>{data?.itemCode}</td> */}
                                <td>{data?.generalLedgerName}</td>
                                <td>{data?.subGLName}</td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data.debit
                                      ? _formatMoney(Math.abs(data?.debit))
                                      : ""}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {data.credit
                                      ? _formatMoney(Math.abs(data?.credit))
                                      : ""}
                                  </div>
                                </td>
                              </tr>
                            ))}
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
                                {_formatMoney(
                                  Math.abs(
                                    bankJournalReport?.objHeader?.numAmount
                                  )
                                )}
                              </td>
                              <td
                                className="text-right pr-2"
                                style={{ fontWeight: "bold" }}
                              >
                                {_formatMoney(
                                  Math.abs(
                                    bankJournalReport?.objHeader?.numAmount
                                  )
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-5">
                        <div className="d-flex">
                          <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Sum Of Taka :{" "}
                          </p>
                          <p style={{ fontWeight: "bold" }}>
                            {bankJournalReport?.objHeader?.amount}
                          </p>
                        </div>
                        <div className="d-flex">
                          <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Pay To :{" "}
                          </p>
                          <p>{bankJournalReport?.objHeader?.paidTo}</p>
                        </div>
                        <div className="d-flex">
                          <p className="mr-2" style={{ fontWeight: "bold" }}>
                            Description :{" "}
                          </p>
                          <p>{bankJournalReport?.objHeader?.narration}</p>
                        </div>
                      </div>
                      <div className="row d-flex justify-content-around align-items-end my-15">
                        <div className=" d-flex flex-column">
                          <span className="mb-1">
                            {bankJournalReport?.objHeader?.actionBy}
                          </span>
                          <span className="reportBorder"></span>
                          <span>Prepared By</span>
                        </div>
                        <div className=" d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>Reviewed By</span>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="reportBorder"></span>
                          <span>
                            Authorized Signatory Akij Resources Limited
                          </span>
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
              <IViewModal show={modalShow} onHide={() => setModalShow(false)}>
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
                {/* {gridItem?.billTypeId === 16 && (
                  <ViewG2GCustomizeBill
                  landingValues={values}
                  gridItem={gridItem}
                  setDataFunc={girdDataFunc}
                  setModalShow={setModalShow}
                  />
                )} */}
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
