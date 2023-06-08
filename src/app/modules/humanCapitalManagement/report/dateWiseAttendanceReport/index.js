import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { _timeFormatter } from "./../../../_helper/_timeFormatter";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const initData = {
  fromDate: "",
  toDate: "",
  businessUnit: "",
  department: { value: 0, label: "All" },
  enroll: { value: 0, label: "All" },
  designation: { value: 0, label: "All" },
  section: { value: 0, label: "All" },
  workplaceGroup: { value: 0, label: "All" },
  empCategory: { value: 0, label: "All" },
  status: { value: "All", label: "All" },
};

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function DateWiseAttendanceReport() {
  const [objProps, setObjprops] = useState({});
  const [departmentDDL, getDepartmentDDL, , setDepartmentDDL] = useAxiosGet();
  const [
    designationDDL,
    getDesignationDDL,
    ,
    setDesignationDDL,
  ] = useAxiosGet();
  const [sectionDDL, getSectionDDL, , setSectionDDL] = useAxiosGet();
  const [workplaceGroupDDL, getWorkplaceGroupDDL] = useAxiosGet();
  const [rowDto, getRowDto, rowDataLoader] = useAxiosGet();

  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getWorkplaceGroupDDL(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${profileData?.accountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  return (
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {rowDataLoader && <Loading />}
          <IForm
            title="Date Wise Attendance Report"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
          >
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
                <NewSelect
                  name="businessUnit"
                  options={businessUnitList}
                  value={values?.businessUnit}
                  label="Business Unit"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("businessUnit", valueOption);
                      setFieldValue("department", { value: 0, label: "All" });
                      setFieldValue("designation", { value: 0, label: "All" });
                      getDepartmentDDL(
                        `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}`
                      );
                      getDesignationDDL(
                        `/hcm/HCMDDL/GetDesignationWithBusinessUnitDDL?BusinessUnitId=${valueOption?.value}&AccountId=${profileData?.accountId}`
                      );
                    } else {
                      setDepartmentDDL([]);
                      setDesignationDDL([]);
                      setFieldValue("businessUnit", "");
                      setFieldValue("department", { value: 0, label: "All" });
                      setFieldValue("designation", { value: 0, label: "All" });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="department"
                  options={[
                    { value: 0, label: "All" },
                    ...(departmentDDL || []),
                  ]}
                  value={values?.department}
                  label="Department"
                  onChange={(valueOption) => {
                    if (!values?.businessUnit?.value) {
                      return toast.warn("Please select  Business unit");
                    }
                    if (valueOption) {
                      setFieldValue("department", valueOption);
                      setFieldValue("section", { value: 0, label: "All" });
                      getSectionDDL(
                        `/hcm/HCMDDL/GetSectionByBusinessUnitDepartmentDDL?BusinessUnitId=${values?.businessUnit?.value}&DeptId=${valueOption?.value}`
                      );
                    } else {
                      setSectionDDL([]);
                      setFieldValue("department", { value: 0, label: "All" });
                      setFieldValue("section", { value: 0, label: "All" });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Enroll</label>
                <SearchAsyncSelect
                  selectedValue={values?.enroll}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("enroll", valueOption);
                    } else {
                      setFieldValue("enroll", { value: 0, label: "All" });
                    }
                  }}
                  loadOptions={(v) => {
                    if (v?.length < 3) return [];
                    return axios
                      .get(
                        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&Search=${v}`
                      )
                      .then((res) => {
                        return [{ value: 0, label: "All" }, ...res?.data];
                      })
                      .catch((err) => []);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="designation"
                  options={
                    [{ value: 0, label: "All" }, ...designationDDL] || []
                  }
                  value={values?.designation}
                  label="Designation"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("designation", valueOption);
                    } else {
                      setFieldValue("designation", { value: 0, label: "All" });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="section"
                  options={[{ value: 0, label: "All" }, ...sectionDDL] || []}
                  value={values?.section}
                  label="Section"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("section", valueOption);
                    } else {
                      setFieldValue("section", { value: 0, label: "All" });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="workplaceGroup"
                  options={
                    [{ value: 0, label: "All" }, ...workplaceGroupDDL] || []
                  }
                  value={values?.workplaceGroup}
                  label="Workplace Group"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("workplaceGroup", valueOption);
                    } else {
                      setFieldValue("workplaceGroup", {
                        value: 0,
                        label: "All",
                      });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="empCategory"
                  options={[
                    { value: 0, label: "All" },
                    { value: 1, label: "Management" },
                    { value: 2, label: "Non Management" },
                  ]}
                  value={values?.empCategory}
                  label="Employee Category"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("empCategory", valueOption);
                    } else {
                      setFieldValue("empCategory", { value: 0, label: "All" });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="status"
                  options={[
                    { value: 0, label: "All" },
                    { value: 1, label: "Present" },
                    { value: 2, label: "Absent" },
                    { value: 3, label: "Late" },
                    { value: 4, label: "Leave" },
                    { value: 5, label: "Movement" },
                  ]}
                  value={values?.status}
                  label="Status"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("status", valueOption);
                    } else {
                      setFieldValue("status", { value: "All", label: "All" });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="d-flex">
                <button
                  disabled={
                    !values?.fromDate || !values.toDate || !values.businessUnit
                  }
                  onClick={() => {
                    getRowDto(
                      `/hcm/HCMReport/DateWiseAttendanceReport?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${values?.businessUnit?.value}&EmployeeId=${values?.enroll?.value}&SectionId=${values?.section?.value}&isManagement=${values?.empCategory?.value}&DepartmentId=${values?.department?.value}&DesignationId=${values?.designation?.value}&WorkplaceId=${values?.workplaceGroup?.value}&AttendanceStatus=${values?.status?.label}`
                    );
                  }}
                  style={{ marginTop: "15px" }}
                  type="button"
                  class="btn btn-primary"
                >
                  Show
                </button>
                {rowDto?.length > 0 ? (<div className="ml-2 mt-5">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary"
                    table="table-to-xlsx"
                    filename="Date Wise Attendance Report"
                    sheet={"Sheet-1"}
                    buttonText="Export Excel"
                  />
                </div>): null}
              </div>
            </div>

            <div className="date-wise-report-wrapper mt-5">
              <div className="mt-3">
                <table id="table-to-xlsx" className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>Enroll</th>
                      <th>Employee Name</th>
                      <th>Department</th>
                      <th>Section</th>
                      <th>Designation</th>
                      <th>Attend Date</th>
                      <th>Calender Name</th>
                      <th>In Time</th>
                      <th>Late In</th>
                      <th>Out Time</th>
                      <th>Status</th>
                      <th>Contact Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length > 0 &&
                      rowDto.map((item, index) => (
                        <tr key={index}>
                          <td>{item["Enroll"]}</td>
                          <td>{item["Employee Name"]}</td>
                          <td>{item["Department"]}</td>
                          <td>{item["Section"]}</td>
                          <td>{item["Designation"]}</td>
                          <td className="text-center">
                            {_dateFormatter(item["Attend Date"])}
                          </td>
                          <td>{item["Calender Name"]}</td>
                          <td className="text-center">
                            {_timeFormatter(item["In Time"] || "")}
                          </td>
                          <td className="text-center">{item["Late In"]}</td>
                          <td className="text-center">
                            {_timeFormatter(item["Out Time"] || "")}
                          </td>
                          <td>{item["Status"]}</td>
                          <td>{item["Contact Number"]}</td>
                          {/* <td></td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="submit"
              style={{ display: "none" }}
              ref={objProps?.btnRef}
              onSubmit={() => handleSubmit()}
            ></button>

            <button
              type="reset"
              style={{ display: "none" }}
              ref={objProps?.resetBtnRef}
              onSubmit={() => resetForm(initData)}
            ></button>
          </IForm>
        </>
      )}
    </Formik>
  );
}
