import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../_helper/iButton";

const initData = {};
export default function EDPADischargePort() {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/GetFromEpdaAndDischargePortInfoLanding?BusinessUnitId=${0}&FromDate=${
        values?.fromDate
      }&ToDate=${values?.toDate}&pageNumber=${pageNo ||
        1}&pageSize=${pageSize || 600}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

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
          {loading && <Loading />}
          <IForm
            title="EDPA Discharge Port"
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
                <div>
                  <IButton
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Vessel Nomination Code</th>
                        <th>Grand Total </th>
                        <th>Attachment For Port</th>
                        <th>Attachment For Port Disbursment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>

                          <td className="text-center">
                            {item?.strVesselNominationCode}
                          </td>
                          <td className="text-center">
                            {item?.numGrandTotalAmount}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.length > 0 && (
                <PaginationTable
                  count={gridData?.length}
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
              <div></div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
