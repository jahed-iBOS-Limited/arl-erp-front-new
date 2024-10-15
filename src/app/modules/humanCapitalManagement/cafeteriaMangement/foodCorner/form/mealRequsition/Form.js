import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../../_helper/_select";
import {
  fetchEmpBasicInfo,
  fetchPartOneMealDetails,
  fetchPartTwoMealDetails,
  getMealConsumePlaceDDL,
} from "../../helper/action";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../../../_helper/_todayDate";

// Validation schema
const validationSchema = Yup.object().shape({
  ToDate: Yup.string().required("Date is required"),
  CountMeal: Yup.string().required("Number of meal is required"),
  TypeId: Yup.object().shape({
    value: Yup.string().required("Type is required"),
    label: Yup.string().required("Type is required"),
  }).typeError("Type is required"),
  consumePlace: Yup.object().shape({
    value: Yup.string().required("Meal consume place is required"),
    label: Yup.string().required("Meal consume place is required"),
  }).typeError("Meal consume place is required"),
});

// Is Public Validation Schema
const validationSchemaForPublic = Yup.object().shape({
  ToDate: Yup.string().required("Date is required"),
  CountMeal: Yup.string().required("Number of meal is required"),
  TypeId: Yup.object().shape({
    value: Yup.string().required("Type is required"),
    label: Yup.string().required("Type is required"),
  }).typeError("Type is required"),
  consumePlace: Yup.object().shape({
    value: Yup.string().required("Meal consume place is required"),
    label: Yup.string().required("Meal consume place is required"),
  }).typeError("Meal consume place is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  setRowData,
  setConsumeData,
  foodCornerPermission,
  setEmpId
}) {
  const [basicInfo, setbasicInfo] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [mealConsumePlaceDDL, setmealConsumePlaceDDL] = useState([])

  useEffect(() => {
    fetchEmpBasicInfo(profileData.employeeId, setbasicInfo);
    getMealConsumePlaceDDL(setmealConsumePlaceDDL);
  }, [profileData]);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          empName: {
            value: profileData?.employeeId,
            label: profileData?.employeeFullName,
          },
          TypeId: {
            value: "2",
            label: "Irregular",
          },
        }}
        validationSchema={
          isPublic ? validationSchemaForPublic : validationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, () => {
            let selectType = values?.selectType;
            let emp = values?.empName;
            resetForm(initData);
            setFieldValue("selectType", selectType);
            setFieldValue("empName", emp);
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
              {/* Type Selection */}
              <div className="row mb-2">
                <div className="col-lg-12">
                  <span className="mr-2">Select Type: </span>
                  <label className="mr-2">
                    <Field
                      className="mx-1"
                      type="radio"
                      name="selectType"
                      value="private"
                      onChange={(valueOption) => {
                        fetchEmpBasicInfo(profileData?.employeeId, setbasicInfo);
                        setRowData([])
                        setConsumeData([])
                        fetchPartOneMealDetails(profileData?.employeeId, setRowData);
                        fetchPartTwoMealDetails(profileData?.employeeId, setConsumeData);
                        setFieldValue("empName", {
                          value: profileData?.employeeId,
                          label: profileData?.employeeFullName,
                        });
                        setFieldValue("selectType", "private");
                        setFieldValue("MealFor", "1");
                        setIsPublic("private");
                      }}
                    />
                    Private
                  </label>
                  {foodCornerPermission[0]?.isCreate === true ? (
                    <label>
                      <Field
                        className="mx-1"
                        type="radio"
                        name="selectType"
                        value="public"
                        onChange={(valueOption) => {
                          setRowData([])
                          setConsumeData([])
                          setbasicInfo(null)
                          setFieldValue("empName", "");
                          setFieldValue("selectType", "public");
                          setIsPublic("public");
                        }}
                      />
                      Public
                    </label>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* Type Selection End */}
              <hr />
              <div className="row">
                <div className="col-lg-6">
                  {values?.selectType === "private" ? (
                    <>
                      <NewSelect
                        name="empName"
                        options={[]}
                        value={values?.empName}
                        label="Employee Name"
                        isDisabled={true}
                        placeholder="Employee Name"
                        errors={errors}
                        touched={touched}
                      />
                    </>
                  ) : (
                    <>
                      <label>Employee Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.empName}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("empName", valueOption);
                          setEmpId(valueOption?.value)
                          // setFieldValue("enrollId", valueOption?.value);
                          setbasicInfo(null)
                          fetchEmpBasicInfo(valueOption?.value, setbasicInfo);
                          // first set data empty when change employee, then load new data from db
                          setRowData([])
                          fetchPartOneMealDetails(
                            valueOption?.value,
                            setRowData
                          );
                          fetchPartTwoMealDetails(
                            valueOption?.value,
                            setConsumeData
                          );
                        }}
                        loadOptions={loadEmp}
                      />
                    </>
                  )}
                </div>
                <div className="col-lg-6">
                  <Field
                    value={values?.ToDate}
                    name="ToDate"
                    component={Input}
                    placeholder="Date"
                    label="Date"
                    min={_todayDate()}
                    type="date"
                  />
                </div>
                {basicInfo !== null && basicInfo !== undefined && (
                  <div className="col-lg-12 d-flex align-items-center">
                    <div className="mr-1 my-2">
                      <strong>Designation: </strong>
                      <span>{basicInfo?.designationName}</span>
                    </div>
                    <div className="mr-1 my-2">
                      <strong>Dept: </strong>
                      <span>{basicInfo?.departmentName}</span>
                    </div>
                    <div className="mr-1 my-2">
                      <strong>Unit: </strong>
                      <span>{basicInfo?.businessUnitName}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <Field
                    value={values?.CountMeal}
                    name="CountMeal"
                    component={Input}
                    placeholder="Number Of Meal"
                    label="Number Of Meal"
                    type="text"
                  />
                </div>
                <div className="col-lg-6">
                  <NewSelect
                    name="TypeId"
                    options={[
                      { value: "1", label: "Regular" },
                      { value: "2", label: "Irregular" },
                    ]}
                    value={values?.TypeId}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("TypeId", valueOption);
                    }}
                    placeholder="Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <NewSelect
                    name="consumePlace"
                    options={mealConsumePlaceDDL || []}
                    value={values?.consumePlace}
                    label="Meal Consume Place"
                    onChange={(valueOption) => {
                      setFieldValue("consumePlace", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6 d-flex align-items-end pb-2">
                  <span className="mr-2">Meal Status: </span>
                  <label className="mr-2">
                    <Field
                      className="mx-1"
                      type="radio"
                      name="MealFor"
                      value="1"
                    />
                    Own
                  </label>
                  {values?.selectType === "public" && (
                    <label>
                      <Field
                        className="mx-1"
                        type="radio"
                        name="MealFor"
                        value="2"
                      />
                      Guest
                    </label>
                  )}
                </div>
                <div className="col-lg-6">
                  <Field
                    value={values?.Narration}
                    name="Narration"
                    component={Input}
                    placeholder="Remarks"
                    label="Remarks"
                    type="text"
                  />
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
          </>
        )}
      </Formik>
    </>
  );
}
