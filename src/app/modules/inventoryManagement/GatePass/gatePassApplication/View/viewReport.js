/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useHistory, useParams } from "react-router-dom";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "./viewForm";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import { getSingleData } from "../helper";

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

export default function TableRow({ gridDataId }) {
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [initDataForEdit, setInitDataForEdit] = useState({});

  useEffect(() => {
    if (gridDataId) {
      getSingleData(gridDataId, setRowDto, setInitDataForEdit, setLoading);
    }
  }, []);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // getReportListPurchaseReq(prId, setPurchaseReport);
  }, []);

  const printRef = useRef();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // console.log("initDataForEdit", initDataForEdit);
  return (
    <>
      <ICustomCard
        style={{ position: "relative" }}
        title=""
        renderProps={() => (
          <>
            {/* <ReactToPrint
              trigger={() => (
                <button className="btn btn-primary">
                  <img
                    style={{ width: "25px", paddingRight: "5px" }}
                    src={printIcon}
                    alt="print-icon"
                  />
                Print
                </button>
              )}
              content={() => printRef.current}
            /> */}
            <ReactToPrint
              //   pageStyle='@page { size: 8in 12in portrait !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              pageStyle={
                "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
              }
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
              //   pageStyle='@page { size: 8in 12in portrait !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              pageStyle={
                "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
              }
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
              onClick={() => {
                setIsShowModal(true);
                setSubject(`Gate Pass Code: ${initDataForEdit?.gatePassCode}`);
                setMessage(`Dear
                        A Gate pass application has been sent from  Gate pass code: ${initDataForEdit?.gatePassCode}. 
                        Requested Date: ${initDataForEdit?.date}
                        Please take the necessary action`);
              }}
              className="btn btn-primary back-btn ml-2"
            >
              Mail
            </button>
            {/* <button
              type="button"
              onClick={() => history.goBack()}
              className="btn btn-secondary back-btn ml-2"
            >
              <i className="fa fa-arrow-left mr-1"></i>
              Back
            </button> */}
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {() => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div>
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
                          <h2
                            style={{
                              textTransform: "upperCase",
                              fontWeight: "900",
                            }}
                          >
                            Gate Pass
                          </h2>
                          <h4
                            style={{
                              textTransform: "upperCase",
                              fontWeight: "900",
                            }}
                          >
                            {initDataForEdit?.businessUnitName}
                          </h4>
                          <h5
                            style={{
                              textTransform: "capitalize",
                              fontWeight: "900",
                            }}
                          >
                            {initDataForEdit?.warehouse?.label}
                          </h5>
                        </div>

                        <div

                        // className='d-flex justify-content-center align-items-center'
                        // style={{
                        //   width: "100px",
                        //   height: "30px",
                        //   // border: "2px solid red",
                        //   // textAlign: "center",
                        //   borderRadius: "10px",
                        //   backgroundColor:
                        //     initDataForEdit?.isApprove === true
                        //       ? "#00b050"
                        //       : initDataForEdit?.isRejected === true
                        //       ? "red"
                        //       : "yellow",
                        //   color:
                        //     initDataForEdit?.isApprove === true
                        //       ? "white"
                        //       : initDataForEdit?.isRejected === true
                        //       ? "white"
                        //       : "black",
                        // }}
                        ></div>
                      </div>
                      <div className="my-3"></div>

                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div>
                              <span
                                style={{ fontSize: "14px", fontWeight: "900" }}
                              >
                                Challon No:
                              </span>{" "}
                              <span
                                style={{ fontSize: "14px", fontWeight: "900" }}
                              >
                                {initDataForEdit?.strGatePassCode}
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ fontSize: "14px", fontWeight: "900" }}
                              >
                                From-Address:
                              </span>{" "}
                              <span
                                style={{ fontSize: "14px", fontWeight: "900" }}
                              >
                                {initDataForEdit?.fromAddress}
                              </span>
                            </div>
                            <div>
                              <span
                                style={{ fontSize: "14px", fontWeight: "900" }}
                              >
                                To-Address:
                              </span>{" "}
                              <span
                                style={{ fontSize: "14px", fontWeight: "900" }}
                              >
                                {initDataForEdit?.others
                                  ? initDataForEdit?.toAddress
                                  : initDataForEdit?.toAddress?.label}
                              </span>
                            </div>
                          </div>
                          <div className="">
                            <span
                              style={{ fontSize: "14px", fontWeight: "900" }}
                            >
                              Date:
                            </span>{" "}
                            <span
                              style={{ fontSize: "14px", fontWeight: "900" }}
                            >
                              {initDataForEdit?.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        style={{
                          position: "absolute",
                          transform: "rotate(-27deg)",
                          right: "28%",
                          top: "41%",
                          fontSize: "143px",
                          opacity: "0.1",
                        }}
                      >
                        {initDataForEdit?.status === "Approved"
                          ? "Approved"
                          : initDataForEdit?.status === "Rejected"
                          ? "Rejected"
                          : "Pending"}
                      </p>
                      <div className="table-responsive">
                        <table
                          className="table table-striped table-bordered global-table"
                          id="table-to-xlsx"
                        >
                          <thead>
                            <tr>
                              <th style={{ fontWeight: "900" }}>SL</th>
                              <th style={{ fontWeight: "900 !important" }}>
                                Item Name
                              </th>
                              <th
                                style={{
                                  width: "100px",
                                  fontWeight: "900 !important",
                                }}
                              >
                                UoM
                              </th>
                              <th style={{ fontWeight: "900 !important" }}>
                                Remarks
                              </th>
                              <th style={{ fontWeight: "900 !important" }}>
                                Type
                              </th>
                              <th
                                style={{
                                  width: "100px",
                                  fontWeight: "900 !important",
                                }}
                              >
                                Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  {item?.item?.label
                                    ? item?.item?.label
                                    : item?.item}
                                </td>
                                <td style={{ width: "100px" }}>
                                  {item?.uom?.label
                                    ? item?.uom?.label
                                    : item?.uom}
                                </td>
                                <td>{item?.strRemarks || ""}</td>
                                <td>{item?.returnStatus || ""}</td>
                                <td
                                  style={{ width: "100px", fontWeight: "900" }}
                                  className="text-right"
                                >
                                  {item?.quantity?.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tFoot style={{ border: "2px solid #85D7F9" }}>
                            <tr>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontSize: "13px",
                                  fontWeight: "900",
                                }}
                                colspan="5"
                              >
                                Total Quantity
                              </td>
                              <td
                                className="text-right"
                                style={{ fontWeight: "900" }}
                              >
                                {rowDto
                                  ?.reduce((acc, cur) => acc + cur.quantity, 0)
                                  ?.toFixed(2)}
                              </td>
                            </tr>
                          </tFoot>
                        </table>
                      </div>

                      <div style={{ display: "flex", marginTop: "20px" }}>
                        <div>
                          <div>
                            <span
                              style={{ fontSize: "14px", fontWeight: "900" }}
                            >
                              Driver/Receiver Name:
                            </span>{" "}
                            <span style={{ fontWeight: "900" }}>
                              {initDataForEdit?.receiversName}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{ fontSize: "14px", fontWeight: "900" }}
                            >
                              Contact:
                            </span>{" "}
                            <span style={{ fontWeight: "900" }}>
                              {initDataForEdit?.contactNo}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div style={{ marginLeft: "100px" }}>
                            <span
                              style={{ fontSize: "14px", fontWeight: "900" }}
                            >
                              Vehicle Number:
                            </span>{" "}
                            <span style={{ fontWeight: "900" }}>
                              {initDataForEdit?.vehicle?.label ||
                                initDataForEdit?.vehicle}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="d-flex">
                          <p style={{ margin: 0, fontWeight: "900" }}>
                            Issued By:
                          </p>
                          <p
                            style={{ margin: 0, fontWeight: "900" }}
                            className=" ml-2"
                          >
                            {initDataForEdit?.actionByName || ""}[
                            {_dateFormatter(initDataForEdit?.actionDate)}{" "}
                            {initDataForEdit?.actionDate
                              ?.split("T")[1]
                              ?.slice(0, 5)}{" "}
                            {+initDataForEdit?.actionDate
                              ?.split("T")[1]
                              ?.slice(0, 2) <= 12
                              ? "AM"
                              : "PM"}
                            ]
                          </p>
                        </div>
                        {initDataForEdit?.status === "Approved" ? (
                          <div className="d-flex">
                            <p style={{ fontWeight: "900" }}>Approved By:</p>
                            <p style={{ fontWeight: "900" }} className="ml-2">
                              {initDataForEdit?.strApprovedBy} [
                              {_dateFormatter(initDataForEdit?.dteApproved)}{" "}
                              {initDataForEdit?.dteApproved
                                ?.split("T")[1]
                                ?.slice(0, 5)}{" "}
                              {+initDataForEdit?.dteApproved
                                ?.split("T")[1]
                                ?.slice(0, 2) <= 12
                                ? "AM"
                                : "PM"}
                              ]
                            </p>
                          </div>
                        ) : initDataForEdit?.status === "Rejected" ? (
                          <div className="d-flex">
                            <p style={{ fontWeight: "900" }}>Rejected By:</p>
                            {/* <p className="ml-2" style={{ fontWeight: "900" }}>
                              {initDataForEdit?.approveByName || "MD.Alamin"} [
                              {_dateFormatter(
                                initDataForEdit?.dteApproved
                              )}{" "}
                              {initDataForEdit?.dteApproved
                                ?.split("T")[1]
                                ?.slice(0, 5)}{" "}
                              {+initDataForEdit?.dteApproved
                                ?.split("T")[1]
                                ?.slice(0, 2) <= 12
                                ? "AM"
                                : "PM"}
                              ]
                            </p> */}
                          </div>
                        ) : (
                          <div className="d-flex">
                            <p style={{ fontWeight: "900" }}>Approved By:</p>
                            <p className="font-weight-bold ml-2"></p>
                          </div>
                        )}
                      </div>

                      <p style={{ marginTop: "80px" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                            paddingTop: "3px",
                            borderTop: "2px solid black",
                          }}
                        >
                          Received by
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <IViewModal
                      title="Send Email"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm
                        subject={subject}
                        setSubject={setSubject}
                        message={message}
                        setMessage={setMessage}
                        // currentIndex={currentIndex}
                        // currentRowData={currentRowData}
                        // setRowDto={setRowDto}
                        // rowDto={rowDto}
                        // values={values}
                        // setIsShowModal={setIsShowModal}
                      />
                    </IViewModal>
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
