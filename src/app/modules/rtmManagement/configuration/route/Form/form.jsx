import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import {
  getOutletInfoDDL,
  getTerritoryDDL,
  getLandingDataForRouteCreate,
} from "../helper";
import InputField from "./../../../../_helper/_inputField";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { _todayDate } from "./../../../../_helper/_todayDate";

// Validation schema
const validationSchema = Yup.object().shape({
  routeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(1000000, "Maximum 1000000 symbols")
    .required("Route Name is required"),
  territoryName: Yup.object().shape({
    label: Yup.string().required("Territory Name is required"),
    value: Yup.string().required("Territory Name is required"),
  }),
  territoryType: Yup.object().shape({
    label: Yup.string().required("Territory Type is required"),
    value: Yup.string().required("Territory Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isDisabled,
  setDisabled,
  // disableHandler,
  isEdit,
  territoryTypeDDL,
  territoryNameDDL,
  setTerritoryNameDDL,
}) {
  const [startOutlateNameDDL, setStartOutlateNameDDL] = useState([]);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getOutletInfoDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setStartOutlateNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getLandingDataForRouteCreate(
        profileData?.userId,
        _todayDate(),
        setDisabled,
        pageNo,
        pageSize,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingDataForRouteCreate(
      profileData?.userId,
      _todayDate(),
      setDisabled,
      pageNo,
      pageSize,
      setGridData
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (!isEdit) {
              resetForm(initData);
            }
            getLandingDataForRouteCreate(
              profileData?.userId,
              _todayDate(),
              setDisabled,
              pageNo,
              pageSize,
              setGridData
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
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      value={values?.routeName}
                      label="Route Name"
                      placeholder="Route Name"
                      name="routeName"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territoryType"
                      options={territoryTypeDDL || []}
                      value={values?.territoryType}
                      label="Territory Type"
                      onChange={(valueOption) => {
                        getTerritoryDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setTerritoryNameDDL
                        );
                        setFieldValue("territoryName", "");
                        setFieldValue("territoryType", valueOption);
                      }}
                      placeholder="Territory Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territoryName"
                      options={territoryNameDDL || []}
                      value={values?.territoryName}
                      label="Territory Name"
                      onChange={(valueOption) => {
                        setFieldValue("territoryName", valueOption);
                      }}
                      placeholder="Territory Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="startOutlateName"
                      options={startOutlateNameDDL}
                      value={values?.startOutlateName}
                      label="Start Outlet Name"
                      onChange={(valueOption) => {
                        setFieldValue("startOutlateName", valueOption);
                      }}
                      placeholder="Start Outlet Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="endOutlateName"
                      options={startOutlateNameDDL}
                      value={values?.endOutlateName}
                      label="End Outlet Name"
                      onChange={(valueOption) => {
                        setFieldValue("endOutlateName", valueOption);
                      }}
                      placeholder="End Outlet Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              {gridData?.data?.length > 0 && (
                <div className="row cash_journal">
                  <h5 className="mt-4">
                    {profileData?.userName} your created data for today
                  </h5>
                  <div className="col-lg-12 pr-0 pl-0">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Route Name</th>
                          <th>Territory Name</th>
                          <th>Start Outlet Name</th>
                          <th>End Outlet Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td> {item?.sl}</td>
                            <td>
                              <div className="pl-2">{item?.routeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.territoryName}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.startOutletName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.endOutletName}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    />
                  )}
                </div>
              )}

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
          </>
        )}
      </Formik>
    </>
  );
}
