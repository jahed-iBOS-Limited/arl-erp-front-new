import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import MoistureDataView from "./view";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function MoistureReportLanding() {
  const [viewDate, setViewDate] = useState();
  const [viewShift, setViewShift] = useState();
  const [viewRemarks, setViewRemarks] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [
    moistureData,
    getMoustureData,
    moistureDataLoader,
    setMoustureData,
  ] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const getLandingData = (values, pageNo, pageSize) => {
    getMoustureData(
      `/hcm/QCTest/MoistureTransactionQcTestLanding?BusinessUnitId=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {});
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
          {moistureDataLoader && <Loading />}
          <IForm
            title="Raw Materials & Moisture Test"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mr-2"
                    onClick={() => {
                      history.push(
                        "/production-management/ACCLFactory/moistureTest/report"
                      );
                    }}
                  >
                    Report View
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/ACCLFactory/moistureTest/create"
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
              <div>
                <div className="form-group row global-form">
                  <div className="col-lg-2">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      type="date"
                      name="fromDate"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        setMoustureData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      type="date"
                      name="toDate"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setMoustureData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      type="button"
                      disabled={!values?.fromDate || !values?.toDate}
                      style={{ marginTop: "17px" }}
                      className="btn btn-primary"
                      onClick={() => {
                        getMoustureData(
                          `/hcm/QCTest/MoistureTransactionQcTestLanding?BusinessUnitId=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {moistureData?.data?.data?.length > 0 &&
                            moistureData?.data?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.date)}
                                </td>
                                <td className="text-center">
                                  {item?.shiftName}
                                </td>
                                <td>{item?.comments}</td>
                                <td
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                  }}
                                  className="text-center"
                                >
                                  <IView
                                    clickHandler={(e) => {
                                      setViewShift(item?.shiftName);
                                      setViewDate(item?.date);
                                      setViewRemarks(item?.comments);
                                      setIsShowModal(true);
                                    }}
                                  />
                                  <IEdit
                                    onClick={(e) => {
                                      history.push({
                                        pathname: `/production-management/ACCLFactory/moistureTest/edit/${item?.qcTransactionHeaderId}`,
                                        state: { ...item },
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {moistureData?.data?.data?.length > 0 ? (
                      <PaginationTable
                        count={moistureData?.data?.data?.length}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                        values={values}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <IViewModal
                title=""
                show={isShowModal}
                onHide={() => {
                  setIsShowModal(false);
                }}
              >
                <MoistureDataView
                  viewShift={viewShift}
                  viewDate={viewDate}
                  viewRemarks={viewRemarks}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
