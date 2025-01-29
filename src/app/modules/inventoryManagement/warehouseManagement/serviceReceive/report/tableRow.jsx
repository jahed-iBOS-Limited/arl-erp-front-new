/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/loader/_loader";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useHistory, useLocation } from "react-router-dom";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import { getReportServiceReceive } from "../helper/Actions";
import IView from "../../../../_helper/_helperIcons/_view";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

export function TableRow({ Rcid }) {
  const [loading, setLoading] = useState(false);
  const [serviceReport, setServiceReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const dispatch = useDispatch();
  // console.log(serviceReport)

  // const profileData = useSelector((state) => {
  //   return state.authData.profileData;
  // }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // console.log(selectedBusinessUnit.value)

  const { state } = useLocation();
  useEffect(() => {
    getReportServiceReceive(Rcid, setServiceReport);
  }, []);

  const printRef = useRef();
  const history = useHistory();

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => (
                <button className="btn btn-primary">
                  {/* <img
                            style={{ width: "25px", paddingRight: "5px" }}
                            src={printIcon}
                            alt="print-icon"
                          /> */}
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;}  }"
              trigger={() => (
                <button className="btn btn-primary ml-2">PDF</button>
              )}
              content={() => printRef.current}
            />
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Excel"
            />
            <button
              type="button"
              onClick={() => history.goBack()}
              className="btn btn-secondary back-btn ml-2"
            >
              <i className="fa fa-arrow-left mr-1"></i>
              Back
            </button>
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="">
                  <div ref={printRef} className="print_wrapper">
                    <div className="m-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {selectedBusinessUnit.value === 8 && (
                              <img
                                style={{ width: "150px", height: "100px" }}
                                class=""
                                src={imageObj[selectedBusinessUnit?.value]}
                                alt="img"
                              />
                            )}
                            {/* imageObj[selectedBusinessUnit?.value] */}
                          </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>{selectedBusinessUnit?.label}</h3>
                          <h6>
                            {serviceReport?.objHeader?.businessUnitAddress}
                          </h6>
                          <h4>Service Receive</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-3">
                        Service Receive Code:
                        <span className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.serviceCode}
                        </span>{" "}
                        Receive Amount:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {state?.receiveAmount}
                        </sapn>
                        Request Date:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {_dateFormatter(
                            serviceReport?.objHeader?.transactionDate
                          )}
                        </sapn>
                        PO Refference:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.referenceCode}
                        </sapn>
                        PO Amount:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.poAmount}
                        </sapn>
                        Adjustment Journal Code:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.adjustmentJournalCode
                            ? serviceReport?.objHeader?.adjustmentJournalCode
                            : "NA"}
                        </sapn>
                        {/* Adjust Amount:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {serviceReport?.objHeader
                              ?.poAdjust}
                        </sapn> */}
                      </div>
                      <div className="my-1">
                        Supplier Name:
                        <span className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.businessPartnerName}
                        </span>{" "}
                        Cost Center Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.costCenterName}
                        </sapn>
                        Project Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.projectName}
                        </sapn>
                        {/* Adjust Amount:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {serviceReport?.objHeader
                              ?.poAdjust}
                        </sapn> */}
                        Challan:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.challan
                            ? serviceReport?.objHeader?.challan
                            : "NA"}
                        </sapn>
                        Challan Date:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.challanDateTime
                            ? _dateFormatter(
                                serviceReport?.objHeader?.challanDateTime
                              )
                            : "NA"}
                        </sapn>
                        Vat Challan:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.vatChallan
                            ? serviceReport?.objHeader?.vatChallan
                            : "NA"}
                        </sapn>
                        Vat Amount:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.vatAmount
                            ? serviceReport?.objHeader?.vatAmount
                            : 0}
                        </sapn>
                        Others Charge:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.othersCharge || 0}
                        </sapn>
                        Gate Entry NO:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {serviceReport?.objHeader?.gateEntryNo
                            ? serviceReport?.objHeader?.gateEntryNo
                            : "NA"}
                        </sapn>
                        {serviceReport?.objHeader?.documentId && (
                          <>
                            Attachment
                            <sapn className="font-weight-bold mr-2 ml-1">
                              <IView
                                title="Attachment"
                                clickHandler={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      serviceReport?.objHeader?.documentId
                                    )
                                  );
                                }}
                              />
                            </sapn>
                          </>
                        )}
                      </div>
                      <div className="table-responsive">
                        <table
                          className="table table-striped table-bordered global-table"
                          id="table-to-xlsx"
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Item Name</th>
                              <th>Uom</th>
                              <th>PO Quantity</th>
                              {/* <th>Receive Quantity</th> */}
                              <th>Quantity</th>
                              {/* <th>Current Stock</th> */}
                              <th>Amount</th>
                              {/* <th>Item Description</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {serviceReport?.objRow?.map((data, i) => (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td>{data?.itemName}</td>
                                <td>{data?.uoMname}</td>
                                <td>{data?.poQuantity}</td>
                                {/* <td>{data?.receiveQuantity}</td> */}
                                <td className="text-right">
                                  {data?.numTransactionQuantity.toFixed(4)}
                                </td>
                                {/* <td className="text-right">{data?.currentStock}</td> */}
                                <td className="text-right">
                                  {data?.monTransactionValue}
                                </td>
                                {/* <td>{data?.itemDescription}</td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3">
                        <div className="d-flex">
                          <p>Request By:</p>
                          <p className="font-weight-bold ml-2">
                            {
                              serviceReport?.objHeader
                                ?.actionByNameDesignationDept
                            }
                            {/* [
                            {_dateFormatter(
                              serviceReport?.objHeader
                                ?.transactionDate
                            )}{" "}
                            {serviceReport?.objHeader?.transactionDate
                              .split("T")[1]
                              .slice(0, 5)}{" "}
                            {+serviceReport?.objHeader?.transactionDate
                              .split("T")[1]
                              .slice(0, 2) <= 12
                              ? "AM"
                              : "PM"}
                            ] */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* <IViewModal
                      title='Send Email'
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm
                        initData={initDataforEmail}
                        // currentIndex={currentIndex}
                        // currentRowData={currentRowData}
                        // setRowDto={setRowDto}
                        // rowDto={rowDto}
                        // values={values}
                        // setIsShowModal={setIsShowModal}
                      />
                    </IViewModal> */}
                  </div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
