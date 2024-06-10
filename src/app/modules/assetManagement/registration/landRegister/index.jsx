import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useReactToPrint } from "react-to-print";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
// import "./style.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const initData = {
  businessUnit: "",
  territory: "",
  thana: "",
  deedNo: "",
  deedAmount: "",
  deedType: "",
  registrationDate: "",
  landQuantity: "",
  seller: "",
  csKhatian: "",
  csPlot: "",
  saKhatian: "",
  cityJaripKhatian: "",
  saPlot: "",
  rsPlot: "",
  rsKhatian: "",
  rsLandQuantity: "",
  mouza: "",
  cityJaripPlot: "",
  cityJaripPlotLand: "",
  subRegister: "",
  registrationCost: "",
  brokerAmount: "",
};
export default function LandRegister() {
  const {
    businessUnitList,
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();

  const [, onSave, loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [singleRowItem, setSingleRowItem] = useState(null);

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData();
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loader && <Loading />}
          <IForm
            title="Land Register"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      history.push(
                        `/mngAsset/registration/LandRegister/create`
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>SBU Code</th>
                        <th>SBU</th>
                        <th>Territory</th>
                        <th>DeedNo</th>
                        <th>Registration Date</th>
                        <th>Mouza Name</th>
                        <th>Land </th>
                        <th>Deed Value</th>
                        <th>Seller</th>
                        <th>CS Khatian</th>
                        <th>CS Plot</th>
                        <th>SA Khatian</th>
                        <th>SA Plot</th>
                        <th>RS Khatian</th>
                        <th>RS Plot</th>
                        <th>RS Plot Based Land </th>
                        <th>Bia Mutation Khatian</th>
                        <th>City Jarip Khatian</th>
                        <th>City Jarip Plot</th>
                        <th>City Jarip Plot Based Land</th>
                        <th>Actual Value</th>
                        <th>Mortgage Registered Deed</th>
                        <th>Mortgage Land </th>
                        <th>Mortgagor's Deed</th>
                        <th>Mortgagee Bank</th>
                        <th>Case_PartiesName</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item?.strBusinessUnitName}
                          </td>
                          <td className="text-center">{item?.strBankName}</td>
                          <td className="text-center">{item?.strBranchName}</td>
                          <td className="text-center">
                            {item?.strTemplateTypeName}
                          </td>
                          <td className="text-center">
                            {item?.strBankLetterTemplateName}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteUpdateDate)}
                          </td>
                          <td className="text-center">
                            <div className="">
                              <span
                                className="px-5"
                                onClick={() => {
                                  setSingleRowItem(item);
                                }}
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Print</Tooltip>
                                  }
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    class="fa fa-print cursor-pointer"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalRecords}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
              <div>
                <div className="bank-letter-print-wrapper">
                  <div style={{ margin: "-13px 50px 51px 50px" }}>
                    <table>
                      <thead>
                        <tr>
                          <td
                            style={{
                              border: "none",
                            }}
                          >
                            {/* place holder for the fixed-position header */}
                            <div
                              style={{
                                height: "110px",
                              }}
                            ></div>
                          </td>
                        </tr>
                      </thead>
                      {/* CONTENT GOES HERE */}
                      <tbody></tbody>
                      <tfoot>
                        <tr>
                          <td
                            style={{
                              border: "none",
                            }}
                          >
                            {/* place holder for the fixed-position footer */}
                            <div
                              style={{
                                height: "150px",
                              }}
                            ></div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
