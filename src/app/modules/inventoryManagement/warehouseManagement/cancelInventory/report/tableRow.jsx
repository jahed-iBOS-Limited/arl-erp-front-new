/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/loader/_loader";
import { getReportCancelInvReq } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useHistory } from "react-router-dom";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

export function TableRow({ CrId }) {
  const [loading, setLoading] = useState(false);
  const [itemReqReport, setiIemReqReport] = useState("");

  // const profileData = useSelector((state) => {
  //   return state.authData.profileData;
  // }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // console.log(selectedBusinessUnit.value)

  useEffect(() => {
    getReportCancelInvReq(CrId, setiIemReqReport);
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
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
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
                          <h6>{itemReqReport?.head?.businessUnitAddress}</h6>
                          <h4>Cancel Inventory</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-3">
                        Transaction Code:
                        <span className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.head?.inventoryTransactionCode}
                        </span>{" "}
                        {/* Purchase Request Type:
                        <span className='font-weight-bold mr-2'>
                          {
                            itemReqReport?.head
                              ?.indentType
                          }
                        </span>{" "} */}
                        Transection GroupName:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.head?.inventoryTransectionGroupName}
                        </sapn>
                        Reference Type Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.head?.referenceTypeName}
                        </sapn>
                      </div>
                      <div className="table-responsive">
                        <table
                          className="table table-striped table-bordered global-table"
                          id="table-to-xlsx"
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Item ID</th>
                              <th>Item Name</th>
                              <th>Uom</th>
                              <th>Location</th>
                              <th>Quantity</th>
                              <th>Value</th>
                              {/* <th>Purpose</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {itemReqReport?.row?.map((data, i) => (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-right">{data?.itemId}</td>
                                <td>{data?.itemName}</td>
                                <td>{data?.uoMname}</td>
                                <td>{data?.inventoryLocationName}</td>
                                <td className="text-right">
                                  {data?.transactionQuantity.toFixed(4)}
                                </td>
                                {/* <td className="text-right">{data?.currentStock}</td> */}
                                <td className="text-right">
                                  {data?.transactionValue}
                                </td>
                                {/* <td>{data?.remarks}</td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3">
                        <div className="d-flex">
                          <p>Request By:</p>
                          <p className="font-weight-bold ml-2">
                            {itemReqReport?.row
                              ? itemReqReport?.row[0]?.actionByName
                              : ""}{" "}
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
