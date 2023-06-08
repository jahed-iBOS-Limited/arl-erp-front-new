import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router";
import PaginationSearch from "./../../../../_helper/_search";
import {
  GetDepartmentWithAccountIdDDL_api,
  GetDesignationDDLAction,
  GetLineManagerWithACCandBusDDL_api,
  getYearDDL_api,
} from "../helper";
import { setEmpValuesAndcompetency_Action } from "../../../../_helper/reduxForLocalStorage/Actions";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { getEmployeeValuesCompetencyGrid_api } from "./../helper";

const initData = {
  department: "",
  designation: "",
  suppervisor: "",
  year: "",
  type: 0,
};
export function TableRow({ btnRef, saveHandler, resetBtnRef }) {
  const [loading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [lineManager, setLineManager] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();

  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get selected business unit from store
  const empValuesAndcompetency = useSelector((state) => {
    return state.localStorage.empValuesAndcompetency;
  }, shallowEqual);


  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetDepartmentWithAccountIdDDL_api(profileData?.accountId, setDepartment);
      GetDesignationDDLAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDesignation
      );
      GetLineManagerWithACCandBusDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLineManager
      );
      getYearDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setYearDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const girdDataFunc = (
    search,
    departmentId,
    designationId,
    supervisorId,
    yearId,
    pageNo,
    pageSize
  ) => {
    getEmployeeValuesCompetencyGrid_api(
      search,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      departmentId,
      designationId,
      supervisorId,
      yearId,
      pageNo,
      pageSize,
      setGridData
    );
  };
  const paginationSearchHandler = (searchValue, values) => {
    girdDataFunc(
      searchValue || null,
      values?.department?.value || "",
      values?.designation?.value || "",
      values?.suppervisor?.value || "",
      values?.year?.value || "",
      pageNo,
      pageSize
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(
      null,
      values?.department?.value || "",
      values?.designation?.value || "",
      values?.suppervisor?.value || "",
      values?.year?.value || "",
      pageNo,
      pageSize
    );
  };

  useEffect(() => {
    if (empValuesAndcompetency?.department?.value) {
      girdDataFunc(
        null,
        empValuesAndcompetency?.department?.value || "",
        empValuesAndcompetency?.designation?.value || "",
        empValuesAndcompetency?.suppervisor?.value || "",
        empValuesAndcompetency?.year?.value || "",
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empValuesAndcompetency]);

  useEffect(() => {
    if (empValuesAndcompetency?.type === 0) {
      getEmployeeValuesCompetencyGrid_api(
        "",
        profileData?.accountId,
        selectedBusinessUnit?.value,
        "",
        "",
        "",
        "",
        pageNo,
        pageSize,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empValuesAndcompetency]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={empValuesAndcompetency || initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(empValuesAndcompetency);
          // });
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
            <ICard
              printTitle="Print"
              title="Employee Code & Employee Name"
              isPrint={true}
            >
              <Form className="form form-label-right">
                <div className="">
                  {/* <div className="row global-form">
                    <div className="col-lg-3 mt-7 d-flex">
                      <label className="mr-3">
                        <Field type="radio" name="type" value="Private" />
                        <span className="ml-2">Private</span>
                      </label>
                      <label>
                        <Field type="radio" name="type" value="Public" />
                        <span className="ml-2">Public</span>
                      </label>
                    </div>
                  </div> */}
                  <div className="row global-form">
                    <div className="col-md-3">
                      <NewSelect
                        name="department"
                        options={department || []}
                        value={values?.department || ""}
                        label="Department"
                        onChange={(valueOption) => {
                          setFieldValue("department", valueOption);
                          dispatch(
                            setEmpValuesAndcompetency_Action({
                              ...values,
                              department: valueOption,
                              type: valueOption?.value ? 1 : 0,
                            })
                          );

                          girdDataFunc(
                            null,
                            valueOption?.value || "",
                            values?.designation?.value || "",
                            values?.suppervisor?.value || "",
                            values?.year?.value || "",
                            pageNo,
                            pageSize
                          );
                        }}
                        placeholder="Select Department"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="designation"
                        options={designation || []}
                        value={values?.designation || ""}
                        label="Designation"
                        onChange={(valueOption) => {
                          setFieldValue("designation", valueOption);
                          dispatch(
                            setEmpValuesAndcompetency_Action({
                              ...values,
                              designation: valueOption,
                              type: valueOption?.value ? 1 : 0,
                            })
                          );

                          girdDataFunc(
                            null,
                            values?.department?.value || "",
                            valueOption?.value || "",
                            values?.suppervisor?.value || "",
                            values?.year?.value || "",
                            pageNo,
                            pageSize
                          );
                        }}
                        placeholder="Select Designation"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="suppervisor"
                        options={lineManager || []}
                        value={values?.suppervisor || ""}
                        label="Suppervisor"
                        onChange={(valueOption) => {
                          setFieldValue("suppervisor", valueOption);
                          dispatch(
                            setEmpValuesAndcompetency_Action({
                              ...values,
                              suppervisor: valueOption,
                              type: valueOption?.value ? 1 : 0,
                            })
                          );

                          girdDataFunc(
                            null,
                            values?.department?.value || "",
                            values?.designation?.value || "",
                            valueOption?.value?.value || "",
                            values?.year?.value || "",
                            pageNo,
                            pageSize
                          );
                        }}
                        placeholder="Select Suppervisor"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="year"
                        options={yearDDL || []}
                        value={values?.year || ""}
                        label="Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                          dispatch(
                            setEmpValuesAndcompetency_Action({
                              ...values,
                              year: valueOption,
                              type: valueOption?.value ? 1 : 0,
                            })
                          );

                          girdDataFunc(
                            null,
                            values?.department?.value || "",
                            values?.designation?.value || "",
                            values?.suppervisor?.value || "",
                            valueOption?.value || "",
                            pageNo,
                            pageSize
                          );
                        }}
                        placeholder="Select Year"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="mt-1">
                    <PaginationSearch
                      placeholder="Employee Name Search"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />

                    {/* Table Start */}
                    {loading && <Loading />}
                    <div className="row ">
                      <div className="col-lg-12">
                        {gridData?.data?.length >= 0 && (
                          <table className="table table-striped table-bordered global-table ">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th style={{ width: "90px" }}>Employee Code</th>
                                <th style={{ width: "90px" }}>Employee Name</th>
                                <th style={{ width: "90px" }}>Department</th>
                                <th style={{ width: "90px" }}>Designation</th>
                                <th style={{ width: "90px" }}>Suppervisor</th>
                                <th style={{ width: "90px" }}>Year</th>
                                <th style={{ width: "90px" }}>
                                  Total Mark By Employee
                                </th>
                                <th style={{ width: "90px" }}>
                                  Total Mark By Suppervisor
                                </th>
                                <th style={{ width: "90px" }}>GAP</th>
                                <th style={{ width: "90px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {gridData?.data?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">
                                    {item?.employeeCode || "-"}
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.employeeName || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.departmentName || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.designationName || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.supervisorName || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.year || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.totalMarkByEmployee || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {item?.totalMarkBySupervisor || "-"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {item?.totalMarkBySupervisor -
                                        item?.totalMarkByEmployee}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <IView
                                        clickHandler={() => {
                                          history.push({
                                            pathname: `/performance-management/report/empValuesAndcompetency/view`,
                                            state: {
                                              ...item,
                                            },
                                          });
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
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
                        values={values}
                      />
                    )}
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
                  onSubmit={() => resetForm(empValuesAndcompetency)}
                ></button>
              </Form>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
