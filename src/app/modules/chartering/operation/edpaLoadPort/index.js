import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useReactToPrint } from "react-to-print";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import PaginationTable from "../../../_helper/_tablePagination";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import IButton from "../../../_helper/iButton";

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
export default function EDPALoadPort() {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  const [, onSave, loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [singleData, setSingleData] = useState(null);

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `domain/VesselNomination/GetEpdaAndPortInfoLanding?BusinessUnitId=${buId}&FromDate=${
        values?.fromDate
      }&ToDate=${values?.toDate}&pageNumber=${pageNo ||
        1}&pageSize=${pageSize || 600}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };
  useEffect(() => {
    getLandingData();
  }, [buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getLandingData(values, pageNo, pageSize);
      }}
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
            title="EDPA Load Port"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IButton
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Business Unit</th>
                        <th>Email</th>
                        <th>Attachment For Port</th>
                        <th>Attachment For Port Disbursment</th>
                        <th>Vessel Nomination Code</th>
                        <th>Grand Total </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.strBusinessUnitName}
                          </td>
                          <td className="text-center">
                            {item?.strEmailAddress}
                          </td>
                          <td className="text-center">
                            {" "}
                            {item?.strAttachmentForPort ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.strAttachmentForPort
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            ) : null}
                          </td>
                          <td className="text-center">
                            {" "}
                            {item?.strAttachmentForPortDisbursment ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.strAttachmentForPortDisbursment
                                      )
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            ) : null}
                          </td>
                          <td className="text-center">
                            {item?.strVesselNominationCode}
                          </td>
                          <td className="text-center">
                            {item?.numGrandTotalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
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
