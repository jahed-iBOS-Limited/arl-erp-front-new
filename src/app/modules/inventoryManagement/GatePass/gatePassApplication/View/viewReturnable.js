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
import { getGridData, getRerurnedData } from "../helper";
import axios from "axios";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../../_helper/_inputField";
import { toast } from "react-toastify";

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

export default function ReturnableModal({
  setIsReturnableModal,
  gridDataId,
  profileData,
  warehouse,
  setGridData,
  loader,
  pageNo,
  pageSize,
  fromDate,
  toDate,
  plant,
}) {
  // console.log("gridDataId",gridDataId)
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([]);
  const [initDataForEdit, setInitDataForEdit] = useState({});

  useEffect(() => {
    if (gridDataId) {
      getRerurnedData(gridDataId, setRowDto, setInitDataForEdit, setLoading);
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
  const [, saveData] = useAxiosPost();

  // const rowDtoDynamicHandler = (name, index, value, item) => {
  // if (value > item?.numRemainingQuantity) {
  //   value =  0;
  //   return toast.warn("Return quantity can not be greater than total quantity")
  // } else if (value < 0) {
  //   value = 0;
  //   return toast.warn("Return quantity can not be greater than total quantity")
  // } else {
  //   let newArr = [...rowDto];
  //   newArr[index][name] = value;
  //   newArr[index].numRemainingQuantity = newArr[index].numRemainingQuantity - newArr[index].numReturnQuantity;
  //   setRowDto(newArr);
  // }
  // };
  return (
    <>
      <ICustomCard
        style={{ position: "relative" }}
        title=""
        renderProps={() => (
          <>
            <button
              type="button"
              onClick={() => {
                saveData(
                  "/wms/GatePass/UpdateGatePassReturnableItem",
                  // rowDto
                  rowDto.map((item) => ({
                    ...item,
                    numReturnQuantity: item?.calculationgNumReturnQuantity,
                  })),
                  () => {
                    setIsReturnableModal(false);
                    getGridData(
                      profileData,
                      selectedBusinessUnit?.value,
                      warehouse,
                      setGridData,
                      loader,
                      pageNo,
                      pageSize,
                      fromDate,
                      toDate,
                      plant
                    );
                  },
                  true
                );
                setSubject(`Gate Pass Code: ${initDataForEdit?.gatePassCode}`);
                setMessage(`Dear
                        A Gate pass application has been sent from  Gate pass code: ${initDataForEdit?.gatePassCode}. 
                        Requested Date: ${initDataForEdit?.date}
                        Please take the necessary action`);
              }}
              className="btn btn-primary back-btn ml-2"
            >
              Save
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
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            errors,
            touched,
            isValid,
          }) => (
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
                        <div></div>
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
                                Total Quantity
                              </th>
                              <th
                                style={{
                                  width: "100px",
                                  fontWeight: "900 !important",
                                }}
                              >
                                Remaining Quantity
                              </th>
                              <th
                                style={{
                                  width: "100px",
                                  fontWeight: "900 !important",
                                }}
                              >
                                Return Quantity
                              </th>
                              {/* <th
                              style={{
                                width: "100px",
                                fontWeight: "900 !important",
                              }}
                            >
                              Returned Items
                            </th> */}
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
                                  {item?.quantity?.toFixed(2) || 0}
                                </td>
                                <td
                                  style={{ width: "100px", fontWeight: "900" }}
                                  className="text-right"
                                >
                                  {item?.numRemainingQuantity?.toFixed(2)}
                                </td>
                                <td
                                  style={{ width: "100px", fontWeight: "900" }}
                                  className="text-right"
                                >
                                  <InputField
                                    value={item?.calculationgNumReturnQuantity}
                                    placeholder="Return Qty."
                                    onChange={(e) => {
                                      if (
                                        +e.target.value >
                                        item?.numRemainingQuantity
                                      ) {
                                        return toast.warn(
                                          "Return quantity can not be greater than remaining quantity"
                                        );
                                      } else if (+e.target.value < 0) {
                                        return toast.warn(
                                          "Quantity can not be negative"
                                        );
                                      } else {
                                        let newArr = [...rowDto];
                                        newArr[
                                          index
                                        ].calculationgNumReturnQuantity = +e
                                          .target.value;
                                        // newArr[index].numRemainingQuantity = newArr[index].numRemainingQuantity - newArr[index].numReturnQuantity;
                                        setRowDto(newArr);
                                      }
                                    }}
                                    type="number"
                                    name="numReturnQuantity"
                                  />
                                </td>

                                {/* <td style={{ width: "100px", fontWeight: "900" }} className="text-center" >
                                <input
                                  type="checkbox"
                                  checked={item?.isReturned}
                                  onChange={(e) => {
                                    let newArr = [...rowDto];
                                    newArr[index].isReturned = e.target.checked;
                                    setRowDto(newArr);
                                  }}
                                />
                              </td> */}
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
                              <td
                                className="text-right"
                                style={{ fontWeight: "900" }}
                              >
                                {rowDto
                                  ?.reduce(
                                    (acc, cur) =>
                                      acc + cur.numRemainingQuantity,
                                    0
                                  )
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
                              {initDataForEdit?.vehicle}
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
                          </div>
                        ) : (
                          <div className="d-flex">
                            <p style={{ fontWeight: "900" }}>Approved By:</p>
                            <p className="font-weight-bold ml-2"></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
