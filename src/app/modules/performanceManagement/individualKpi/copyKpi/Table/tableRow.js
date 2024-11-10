import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import PaginationSearch from "./../../../../_helper/_search";
import {
  getKpiLandingPagination,
  getDepartmentWithAccountIdDDL,
  getYearDDL,
  getDesignationDDLAction,
} from "./../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import Loading from "./../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";

const initData = {
  department: "",
  designation: "",
  yesr: "",
};
// Validation schema
const validationSchema = Yup.object().shape({});

export function TableRow({ saveHandler }) {
  // const dispatch = useDispatch();
  const history = useHistory();
  const [loader, setLoader] = useState(false);

  //paginationState
  const [gridData, setGridData] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // ddl
  const [yearDDL, setYearDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // const gridData = useSelector((state) => {
  //   return state.performanceMgt?.gridData;
  // }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getKpiLandingPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        null,
        null,
        null,
        setLoader,
        setGridData,
        pageNo,
        pageSize
      );
      getYearDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setYearDDL
      );
      getDepartmentWithAccountIdDDL(profileData?.accountId, setDepartmentDDL);
      getDesignationDDLAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDesignationDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue, values) => {
    getKpiLandingPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.department?.value,
      values?.designation?.value,
      values?.year?.value,
      setLoader,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  return (
    <>
      {loader && <Loading />}
      <div className="kpi-landing">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
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
            setValues,
            isValid,
          }) => (
            <>
              {/* Table Start */}
              {console.log("values", values)}
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="department"
                      options={departmentDDL || []}
                      value={values?.department}
                      label="Select Department"
                      onChange={(valueOption) => {
                        getKpiLandingPagination(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          values?.designation?.value,
                          values?.year?.label,
                          setLoader,
                          setGridData,
                          pageNo,
                          pageSize
                        );
                        setFieldValue("department", valueOption);
                      }}
                      placeholder="Select Department"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="designation"
                      options={designationDDL || []}
                      value={values?.designation}
                      label="Select Designation"
                      onChange={(valueOption) => {
                        getKpiLandingPagination(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.department?.value,
                          valueOption?.value,
                          values?.year?.label,
                          setLoader,
                          setGridData,
                          pageNo,
                          pageSize
                        );
                        setFieldValue("designation", valueOption);
                      }}
                      placeholder="Select Designation"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      label="Select Year"
                      onChange={(valueOption) => {
                        getKpiLandingPagination(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.department?.value,
                          values?.designation?.value,
                          valueOption?.label,
                          setLoader,
                          setGridData,
                          pageNo,
                          pageSize
                        );
                        setFieldValue("year", valueOption);
                      }}
                      placeholder="Select Year"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getKpiLandingPagination(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.department?.value,
                          values?.designation?.value,
                          values?.year?.label,
                          setLoader,
                          setGridData,
                          pageNo,
                          pageSize
                        );
                      }}
                      // disabled={
                      //   !values?.department ||
                      //   !values?.designation ||
                      //   !values?.year
                      // }
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row cash_journal">
                  <div className="col-lg-12">
                    <>
                      <PaginationSearch
                        placeholder="Employee Search"
                        paginationSearchHandler={paginationSearchHandler}
                      />
                      <table className="table mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>Sl</th>
                            <th>Employee</th>
                            <th>Depertment</th>
                            <th>Designation</th>
                            <th>Number of KPI</th>
                            <th>Year</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.map((td, index) => (
                            <tr key={index}>
                              <td>
                                <div className="text-center">{td?.sl}</div>
                              </td>
                              <td>
                                <div className="pl-2">{td?.employeeName}</div>
                              </td>
                              <td>
                                <div className="pl-2">{td?.depertmentName}</div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {td?.designationName}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.countofKpi}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.yearName}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-around">
                                  <span
                                    className="extend"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/performance-management/individual-kpi/individual-kpi-target/view/${td?.pmsId}`,
                                      });
                                    }}
                                  >
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"View/Edit"}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i
                                          className={`view_fa fa fa-eye view_fa`}
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                  </span>
                                  <span
                                    className="extend"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/performance-management/individual-kpi/individual-kpi-target/perform-chart/${td?.pmsId}`,
                                      });
                                    }}
                                  >
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"Dashboard Setup"}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i className={`fas fa-chart-bar`}></i>
                                      </span>
                                    </OverlayTrigger>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Code */}
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
                    </>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}
