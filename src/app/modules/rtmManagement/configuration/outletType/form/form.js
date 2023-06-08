/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";

import { getLandingData } from "./../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { _todayDate } from "./../../../../_helper/_todayDate";

const validationSchema = Yup.object().shape({
  businessTypeName: Yup.string().required("Outlet type is required"),
  isOnlyTmsAllowed: Yup.bool().required("Tms Allowed is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setDisabled,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
  const [gridData, setGridData] = useState();

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // Get Landing Data
  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDisabled,
      setGridData,
      pageNo,
      pageSize,
      _todayDate(),
      profileData?.userId
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDisabled,
      setGridData,
      pageNo,
      pageSize,
      _todayDate(),
      profileData?.userId
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (!isEdit) {
            resetForm(initData);
          }
          getLandingData(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            setDisabled,
            setGridData,
            pageNo,
            pageSize,
            _todayDate(),
            profileData?.userId
          );
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Form className="global-form form form-label-right">
            <div className="form-group row">
              <div className="col-lg-3">
                <label>Outlet Type</label>
                <InputField
                  value={values?.businessTypeName}
                  name="businessTypeName"
                  placeholder="Outlet Type"
                  type="text"
                />
              </div>
              <div className="col-lg-3 d-flex" style={{ marginTop: "15px" }}>
                <input
                  style={{
                    width: "15px",
                    height: "15px",
                    position: "relative",
                    top: "3px",
                  }}
                  name="isOnlyTmsAllowed"
                  checked={values?.isOnlyTmsAllowed}
                  className="mr-2"
                  type="checkbox"
                  onChange={(e) =>
                    setFieldValue("isOnlyTmsAllowed", e.target.checked)
                  }
                />
                <label>Is Only Tms Allowed</label>
              </div>
            </div>

            <button
              type="submit"
              style={{ display: "none" }}
              ref={btnRef}
              onSubmit={() => handleSubmit()}
            ></button>

            <button
              type="reset"
              style={{ display: "none" }}
              ref={resetBtnRef}
              onSubmit={() => resetForm(initData)}
            ></button>
          </Form>

          {/* Landing Table */}
          {gridData?.data?.length > 0 && (
            <div className="col-lg-8 m-0 p-0">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Outlet Type Name</th>
                    <th style={{ width: "120px" }}>Tms Allowed</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td>
                          <span className="pl-2">{item?.businessTypeName}</span>
                        </td>
                        <td>
                          <div className="text-center">
                            <input
                              style={{
                                width: "15px",
                                height: "15px",
                              }}
                              name="isOnlyTmsAllowed"
                              checked={item?.isOnlyTmsAllowed}
                              // className="form-control"
                              type="checkbox"
                              disabled
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </div>
          )}
        </>
      )}
    </Formik>
  );
}

export default _Form;
