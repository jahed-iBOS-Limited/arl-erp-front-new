/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik, Form as FormikForm } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import { APIUrl } from "../../../../../App";
// import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../purchaseOrder/customHooks/useAxiosGet";
import { getReportListPurchaseReq, mergeFields } from "../helper";
import Loading from "./../../../../_helper/loader/_loader";
import { repairFormStyle } from "./helper";
import modalCss from "./purchaseRequestReportModal.module.css";
import "./salaryAdvice.css";
import ViewForm from "./viewForm";
const { reportBody, bottomBankTable } = modalCss;

// let imageObj = {
//   8: iMarineIcon,
// };

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, dont change existing props name
export function PurchaseRequestReportModal({ currentRowData }) {
  const [loading, setLoading] = useState(false);
  const [purchaseReport, setPurchaseReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [, getRuningStockAndQuantityList] = useAxiosPost();
  const [
    vesselPurchaseRequestAdditionalData,
    getVesselPurchaseRequestAdditionalData,
  ] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getReportListPurchaseReq(
      currentRowData?.purchaseRequestId,
      selectedBusinessUnit?.value,
      setPurchaseReport,
      ({
        getPurchaseRequestPrintHeader,
        getPurchaseRequestPrintRow,
        objEmpListDTO,
      }) => {
        if (getPurchaseRequestPrintRow?.length) {
          const payload = getPurchaseRequestPrintRow.map((item) => ({
            BusinessUnitId: getPurchaseRequestPrintHeader?.businessUnitId,
            WareHouseId: getPurchaseRequestPrintHeader?.warehouseId,
            ItemId: item?.itemId,
          }));

          // Fetch running stock and quantity list
          getRuningStockAndQuantityList(
            `/wms/InventoryTransaction/GetRuningStockAndQuantityList`,
            payload,
            (res) => {
              // Merge fields based on itemId
              const modifiedPrintRow = mergeFields(
                getPurchaseRequestPrintRow,
                res,
                "itemId"
              );

              // Update the purchase report
              setPurchaseReport({
                getPurchaseRequestPrintHeader,
                getPurchaseRequestPrintRow: modifiedPrintRow,
                objEmpListDTO,
              });
            }
          );
        }
      }
    );
    getVesselPurchaseRequestAdditionalData(
      `/procurement/PurchaseRequest/GetVesselPurchaseRequestAdditionalData?purchaseRequestCode=${currentRowData?.purchaseRequestCode}`
    );
  }, [currentRowData, selectedBusinessUnit]);

  const printRef = useRef();
  // const history = useHistory();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const rows = [
    {
      itemNo: 1,
      description: "Spare Description Here",
      partNo: "Part Number Here",
      drawingNo: "Drawing Number Here",
      inStock: "Stock Here",
      unit: "Unit Here",
      requiredQuantity: "Required Quantity Here",
      received: "Received Quantity Here",
    },
    // Add more rows as needed
  ];

  console.log("purchaseReport", purchaseReport);

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in  !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => <button className="btn btn-primary">Print</button>}
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
              onClick={() => {
                setIsShowModal(true);
                setSubject(
                  `Purchase Request No: ${purchaseReport?.getPurchaseRequestPrintHeader?.indendedNO}`
                );
                setMessage(`Dear 
                        A Purchase request has been sent from  Purchase Request No: ${purchaseReport?.getPurchaseRequestPrintHeader?.indendedNO}
                        Please take the necessary action`);
              }}
              className="btn btn-primary back-btn ml-2"
            >
              Mail
            </button>
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
        >
          {() => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="">
                  <div ref={printRef} className="print_wrapper">
                    <div className="m-3">
                      <div className="">
                        <div
                          style={{
                            border: "1px solid",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            padding: "20px 0",
                          }}
                        >
                          <h1>
                            {
                              purchaseReport?.getPurchaseRequestPrintHeader
                                ?.businessUnitName
                            }
                          </h1>
                          <img
                            style={{ width: "80px" }}
                            alt="shipping"
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                          />
                        </div>
                      </div>
                      {vesselPurchaseRequestAdditionalData?.intCategoryId ===
                      624 ? (
                        <div className={reportBody}>
                          <h3 style={{ textAlign: "center" }}>
                            SPARE REQUISITION FORM
                          </h3>
                          <table>
                            <tbody>
                              <tr>
                                <td>Vessel</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strVesselName
                                  }
                                </td>
                                <td>Dept</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strDepartmentName
                                  }
                                </td>
                                <td>Requisition No.</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strPurchaseRequestCode
                                  }
                                </td>
                                <td>Requisition Period</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strRequisitionPeriod
                                  }
                                </td>
                                <td>Date</td>
                                <td>
                                  {_dateFormatter(
                                    purchaseReport
                                      ?.getPurchaseRequestPrintHeader
                                      ?.requiredDate
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2">Spare Received At</td>
                                <td colSpan="6"></td>
                                <td>Date</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>

                          <div
                            className={bottomBankTable}
                            style={{ textAlign: "center" }}
                          >
                            <table style={{ width: "100%" }}>
                              <tbody>
                                <tr style={{ height: "120px" }}>
                                  <td>
                                    <div style={{ textAlign: "left" }}>
                                      <h4>
                                        {
                                          vesselPurchaseRequestAdditionalData?.strDescription
                                        }
                                      </h4>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="table-wrapper">
                            <table>
                              <thead>
                                <tr>
                                  <th>Item No</th>
                                  <th>Description of Spares</th>
                                  <th>Part No</th>
                                  <th>Drawing no</th>
                                  <th>In Stock</th>
                                  <th>Unit</th>
                                  <th>Required Quantity</th>
                                  <th>Received</th>
                                  <th>Office Use</th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchaseReport?.getPurchaseRequestPrintRow?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td style={{ textAlign: "left" }}>
                                        {item.itemName}
                                      </td>
                                      <td>{item.partNo}</td>
                                      <td>{item.drawingNo}</td>
                                      <td>{item.inStock}</td>
                                      <td>{item.uoMname}</td>
                                      <td>{item.numRequestQuantity}</td>
                                      <td>{item.received}</td>
                                      <td></td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className={modalCss.secondRow}>
                            <div>
                              <b>NOTE:</b>
                              <br />
                              <p>
                                1. This form is to be sent for every indent
                                whenever spare required
                              </p>
                              <br />
                              <p>
                                {" "}
                                2. This form is to be made for Triplicate. The
                                original is to be sent to TS and other two
                                copies to be retained on board
                              </p>
                              <br />
                              <p>
                                {" "}
                                3. One Copy to be returned to T.S. after receipt
                                of goods with date and port of receipt clearly
                                mentioning the items/quantity not received in
                                the last column
                              </p>
                              <br />
                            </div>
                            <div style={{ marginTop: "20px" }}>
                              <img
                                style={{
                                  width: "180px",
                                  height: "100px",
                                  display: "block",
                                }}
                                alt="shipping"
                                src={`${APIUrl}/domain/Document/DownlloadFile?id=${vesselPurchaseRequestAdditionalData?.strSignature1}`}
                              />
                              <p>
                                2<sup>nd</sup> Engineer/<del>El.Engineer</del>{" "}
                                (Signature with Seal)
                              </p>
                              <img
                                style={{
                                  width: "180px",
                                  height: "100px",
                                  display: "block",
                                }}
                                alt="shipping"
                                src={`${APIUrl}/domain/Document/DownlloadFile?id=${vesselPurchaseRequestAdditionalData?.strSignature2}`}
                              />
                              <p>Chief Engineer (Signature with Seal)</p>
                            </div>
                          </div>
                        </div>
                      ) : vesselPurchaseRequestAdditionalData?.intCategoryId ===
                        651 ? (
                        <>
                          <div style={repairFormStyle.reportBody}>
                            <h3 style={repairFormStyle.h3}>
                              SHORE REPAIR FORM
                            </h3>

                            <div
                              className="req-table"
                              style={repairFormStyle.reqTable}
                            >
                              <table style={repairFormStyle.reqTable}>
                                <tbody>
                                  <tr>
                                    <td style={repairFormStyle.reqTableTd}>
                                      Vessel
                                    </td>
                                    <td
                                      style={{
                                        ...repairFormStyle.reqTableTd,
                                        ...repairFormStyle.reqTableMin,
                                      }}
                                    >
                                      {
                                    vesselPurchaseRequestAdditionalData?.strVesselName
                                  }
                                    </td>
                                    <td style={repairFormStyle.reqTableTd}>
                                      Dept
                                    </td>
                                    <td
                                      style={{
                                        ...repairFormStyle.reqTableTd,
                                        ...repairFormStyle.reqTableMin,
                                      }}
                                    >
                                    {
                                    vesselPurchaseRequestAdditionalData?.strDepartmentName
                                  }
                                    </td>
                                    <td style={repairFormStyle.reqTableTd}>
                                      Date
                                    </td>
                                    <td
                                      style={{
                                        ...repairFormStyle.reqTableTd,
                                        ...repairFormStyle.reqTableMin,
                                      }}
                                    >
                                       {_dateFormatter(
                                    purchaseReport
                                      ?.getPurchaseRequestPrintHeader
                                      ?.requiredDate
                                  )}
                                    </td>
                                    <td style={repairFormStyle.reqTableTd}>
                                      Port
                                    </td>
                                    <td
                                      style={{
                                        ...repairFormStyle.reqTableTd,
                                        ...repairFormStyle.reqTableMin,
                                      }}
                                    ></td>
                                    <td style={repairFormStyle.reqTableTd}>
                                      Vessel Ref
                                    </td>
                                    <td
                                      style={{
                                        ...repairFormStyle.reqTableTd,
                                        ...repairFormStyle.reqTableMin,
                                      }}
                                    >
                                      {
                                         vesselPurchaseRequestAdditionalData?.strPurchaseRequestCode
                                      }
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div
                              className="table-wrapper"
                              style={repairFormStyle.tableWrapper}
                            >
                              <table style={repairFormStyle.table}>
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        ...repairFormStyle.tableThTd,
                                        ...repairFormStyle.tableTh,
                                      }}
                                    >
                                      Item no.
                                    </th>
                                    <th
                                      style={{
                                        ...repairFormStyle.tableThTd,
                                        ...repairFormStyle.tableTh,
                                      }}
                                    >
                                      Description of repairs to be carried out
                                    </th>
                                    <th
                                      style={{
                                        ...repairFormStyle.tableThTd,
                                        ...repairFormStyle.tableTh,
                                      }}
                                    >
                                      Spare / material required
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {purchaseReport?.getPurchaseRequestPrintRow?.map((item, index) => (
                                    <tr key={index}>
                                      <td style={repairFormStyle.tableThTd}>
                                        {index+1}
                                      </td>
                                      <td style={repairFormStyle.tableThTd}>
                                        {item.itemName}
                                      </td>
                                      <td style={repairFormStyle.tableThTd}>
                                        {item.numRequestQuantity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div
                              className="second-row"
                              style={repairFormStyle.secondRow}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  float: "left",
                                  display: "inline-block",
                                }}
                              >
                                <b style={repairFormStyle.secondRowB}>
                                  NOTE: the original to be sent to T.S./D.P.A.,
                                  and copy to retain on board.
                                </b>
                              </div>
                            </div>
                            <div
                              className="third-row"
                              style={repairFormStyle.thirdRow}
                            >
                              <div
                                style={{
                                  width: "50%",
                                  float: "left",
                                  display: "inline-block",
                                  marginTop:"20px"
                                }}
                              >
                               <div>
                                    <img
                                      style={{
                                        width: "180px",
                                        height: "100px",
                                        display: "block",
                                      }}
                                      src={`${APIUrl}/domain/Document/DownlloadFile?id=${vesselPurchaseRequestAdditionalData?.strSignature2}`}
                                      alt="C/O, 2/E, El. Engr."
                                    />
                                    <p style={repairFormStyle.thirdRowP}>
                                      C/O, 2/E, El. Engr.(signature with seal)
                                    </p>
                                  </div>
                              </div>
                              <div
                                style={{
                                  width: "40%",
                                  float: "right",
                                  display: "inline-block",
                                  marginTop:"20px"
                                }}
                              >
                                 <div>
                                    <img
                                       style={{
                                        width: "180px",
                                        height: "100px",
                                        display: "block",
                                      }}
                                      src={`${APIUrl}/domain/Document/DownlloadFile?id=${vesselPurchaseRequestAdditionalData?.strSignature1}`}
                                      alt="Chief Engineer"
                                    />
                                    <p style={repairFormStyle.thirdRowP}>
                                      Chief Engineer (signature with seal)
                                    </p>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={reportBody}>
                          <h3 style={{ textAlign: "center" }}>
                            STORE REQUISITION FORM
                          </h3>
                          <table>
                            <tbody>
                              <tr>
                                <td>Vessel</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strVesselName
                                  }
                                </td>
                                <td>Dept</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strDepartmentName
                                  }
                                </td>
                                <td>Requisition No.</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strPurchaseRequestCode
                                  }
                                </td>
                                <td>Requisition Period</td>
                                <td>
                                  {
                                    vesselPurchaseRequestAdditionalData?.strRequisitionPeriod
                                  }
                                </td>
                                <td>Date</td>
                                <td>
                                  {_dateFormatter(
                                    purchaseReport
                                      ?.getPurchaseRequestPrintHeader
                                      ?.requiredDate
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2">Spare Received At</td>
                                <td colSpan="6"></td>
                                <td>Date</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>

                          <div
                            className={bottomBankTable}
                            style={{ textAlign: "center" }}
                          ></div>

                          <div className="table-wrapper">
                            <table>
                              <thead>
                                <tr>
                                  <th>Item No</th>
                                  <th>ISSA/IMPA code no.</th>
                                  <th>
                                    Description of stores with full
                                    specification
                                  </th>
                                  <th>Unit</th>
                                  <th>Required</th>
                                  <th>Last supplied</th>
                                  <th>In stock</th>
                                  <th>Received</th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchaseReport?.getPurchaseRequestPrintRow?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item.itemCode}</td>
                                      <td>{item.itemName}</td>
                                      <td>{item.uoMname}</td>
                                      <td>{item.numRequestQuantity}</td>
                                      <td>{""}</td>
                                      <td>{item.inStock}</td>
                                      <td>{""}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className={modalCss.secondRow}>
                            <div>
                              <b>NOTE:</b>
                              <br />
                              <span>
                                {" "}
                                1. This form is to be sent for every indent
                                whenever spare required
                              </span>
                              <br />
                              <span>
                                {" "}
                                2. This form is to be made for Triplicate. The
                                original is to be sent to TS and other two
                                copies to be retained on board
                              </span>
                              <br />
                              <span>
                                {" "}
                                3. One Copy to be returned to T.S. after receipt
                                of goods with date and port of receipt clearly
                                mentioning the items/quantity not received in
                                the last column
                              </span>
                              <br />
                            </div>
                            <div style={{ marginTop: "20px" }}>
                              <img
                                style={{
                                  width: "180px",
                                  height: "100px",
                                  display: "block",
                                }}
                                alt="shipping"
                                src={`${APIUrl}/domain/Document/DownlloadFile?id=${vesselPurchaseRequestAdditionalData?.strSignature2}`}
                              />
                              <p>
                                2<sup>nd</sup> Engineer/<del>El.Engineer</del>{" "}
                                (Signature with Seal)
                              </p>
                              <img
                                style={{
                                  width: "180px",
                                  height: "100px",
                                  display: "block",
                                }}
                                alt="shipping"
                                src={`${APIUrl}/domain/Document/DownlloadFile?id=${vesselPurchaseRequestAdditionalData?.strSignature1}`}
                              />
                              <p>Chief Engineer (Signature with Seal)</p>
                            </div>
                          </div>
                        </div>
                      )}
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
