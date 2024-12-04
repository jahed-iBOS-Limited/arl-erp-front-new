/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { getReportItemReq } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

export function ItemReqViewTableRow({ IrId }) {
  const [loading, setLoading] = useState(false);
  const [itemReqReport, setiIemReqReport] = useState("");

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (IrId) {
      getReportItemReq(IrId, setiIemReqReport);
    }
  }, [IrId]);

  const printRef = useRef();

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
            <ReactToPrint
              pageStyle="@page { size: 8in 12in landscape !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
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
                          </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>{itemReqReport?.objHeader?.businessUnitName}</h3>
                          <h6>
                            {itemReqReport?.objHeader?.businessUnitAddress}
                          </h6>
                          <h4>Item Request</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-3">
                        Request Code:
                        <span className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.strItemRequestCode}
                        </span>{" "}
                        Request Date:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {_dateFormatter(
                            itemReqReport?.objHeader?.dteRequestDate
                          )}
                        </sapn>
                        Status:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.isApproved === "False"
                            ? "Pending"
                            : "Approved"}
                        </sapn>
                        {/* Purpose:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.purpose}
                        </sapn> */}
                      </div>
                      <div className="table-responsive">
                        <table
                          className="table table-striped table-bordered global-table"
                          id="table-to-xlsx"
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Item Code</th>
                              <th>Item Name</th>
                              <th>Uom</th>
                              <th>Quantity</th>
                              <th>Issue Quantity</th>
                              <th>Current Stock</th>
                              <th>Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemReqReport?.objRow?.map((data, i) => (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">
                                  {data?.itemCode}
                                </td>
                                <td>{data?.itemName}</td>
                                <td className="text-center">{data?.uoMname}</td>
                                <td className="text-right">
                                  {data?.requestQuantity != null
                                    ? Number.isInteger(data?.requestQuantity)
                                      ? data?.requestQuantity
                                      : data?.requestQuantity.toFixed(6)
                                    : "N/A"}
                                </td>

                                <td className="text-right">
                                  {data?.issueQty != null
                                    ? Number.isInteger(data?.issueQty)
                                      ? data?.issueQty
                                      : data?.issueQty.toFixed(6)
                                    : "N/A"}
                                </td>
                                <td className="text-right">
                                  {data?.stockQuantity}
                                </td>
                                <td>{data?.remarks}</td>
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
                              itemReqReport?.objHeader
                                ?.actionByNameDesignationDept
                            }{" "}
                          </p>
                        </div>
                        <div className="d-flex">
                          <p>Approved By:</p>
                          <p className="font-weight-bold ml-2">
                            {itemReqReport?.objHeader?.approveByName}{" "}
                          </p>
                        </div>
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
