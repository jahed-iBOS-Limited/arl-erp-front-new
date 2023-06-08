import React from "react";
import { Formik, Form, Field } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { getAdditionDeductionDDL } from "./../helper";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import {
  checkValidityOfFromMonthNYear,
  getDataByEmployeeAction,
  monthDDL,
} from "./utils";
import Axios from "axios";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  fromMonth: Yup.object()
    .shape({
      value: Yup.string().required("From month is required"),
      label: Yup.string().required("From month is required"),
    })
    .typeError("From month is required"),
  fromYear: Yup.object()
    .shape({
      value: Yup.string().required("From year is required"),
      label: Yup.string().required("From year is required"),
    })
    .typeError("From year is required"),
  toMonth: Yup.object().when("isContinue", {
    is: false,
    then: Yup.object()
      .shape({
        value: Yup.string().required("To month is required"),
        label: Yup.string().required("To month is required"),
      })
      .typeError("To month is required"),
    otherwise: Yup.object(),
  }),
  toYear: Yup.object().when("isContinue", {
    is: false,
    then: Yup.object()
      .shape({
        value: Yup.string().required("To year is required"),
        label: Yup.string().required("To year is required"),
      })
      .typeError("To year is required"),
    otherwise: Yup.object(),
  }),

  // toYear: Yup.object()
  //   .shape({
  //     value: Yup.string().required("To year is required"),
  //     label: Yup.string().required("To year is required"),
  //   })
  //   .typeError("To year is required"),
  typeName: Yup.object()
    .shape({
      value: Yup.string().required("Type name is required"),
      label: Yup.string().required("Type name is required"),
    })
    .typeError("Type name is required"),
  type: Yup.object()
    .shape({
      value: Yup.string().required("Type is required"),
      label: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),

  amount: Yup.number()
    .min(0, "Minimum 1 range")
    .required("Amount is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  accountId,
  yearDDL,
  additionDeductionDDl,
  setAdditionDeductionDDl,
  employeeName,
  setEmployeeName,
  rowData,
  setRowData,
  selectedBusinessUnit,
  setDisabled,
}) {
  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
    ).then((res) => {
      return res?.data;
    });
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
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Form className="form form-label-right">
            <div className="form-group global-form row">
              {/* All Form */}
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-2 mb-3">
                    <label>Employee Name</label>
                    <SearchAsyncSelect
                      isSearchIcon={true}
                      selectedValue={employeeName}
                      handleChange={(valueOption) => {
                        setEmployeeName(valueOption);
                        getDataByEmployeeAction(
                          accountId,
                          valueOption?.value,
                          setDisabled,
                          setRowData,
                          0,
                          10000
                        );
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <NewSelect
                      name="fromMonth"
                      options={monthDDL}
                      value={values?.fromMonth}
                      onChange={(valueOption) => {
                        setFieldValue("fromMonth", valueOption);
                        checkValidityOfFromMonthNYear(
                          valueOption?.value,
                          values?.fromYear?.value,
                          setFieldValue,
                          "fromYear",
                          "fromMonth"
                        );
                      }}
                      label="From Month"
                      placeholder="From Month"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <NewSelect
                      name="fromYear"
                      options={yearDDL}
                      value={values?.fromYear}
                      onChange={(valueOption) => {
                        setFieldValue("fromYear", valueOption);
                        checkValidityOfFromMonthNYear(
                          values?.fromMonth?.value,
                          valueOption?.value,
                          setFieldValue,
                          "fromYear",
                          "fromMonth"
                        );
                      }}
                      label="From Year"
                      placeholder="From Year"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <div style={{ marginTop: "20px" }} className="mr-2">
                      <Field
                        name="isContinue"
                        component={() => (
                          <input
                            style={{
                              position: "absolute",
                              top: "20px",
                            }}
                            id="isContinue"
                            type="checkbox"
                            value={values?.isContinue}
                            checked={values?.isContinue}
                            name="isContinue"
                            onChange={(e) => {
                              setFieldValue("toMonth", "");
                              setFieldValue("toYear", "");
                              setFieldValue("isContinue", e.target.checked);
                            }}
                          />
                        )}
                      />
                      <label className="ml-5">Auto Renewal</label>
                    </div>
                  </div>
                  <div className="col-lg-2 mb-3">
                    <NewSelect
                      name="toMonth"
                      options={monthDDL}
                      value={values?.toMonth}
                      onChange={(valueOption) => {
                        setFieldValue("toMonth", valueOption);
                        checkValidityOfFromMonthNYear(
                          valueOption?.value,
                          values?.toYear?.value,
                          setFieldValue,
                          "toYear",
                          "toMonth"
                        );
                      }}
                      label="To Month"
                      placeholder="To Month"
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.isContinue === true}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <NewSelect
                      name="toYear"
                      options={yearDDL}
                      value={values?.toYear}
                      onChange={(valueOption) => {
                        setFieldValue("toYear", valueOption);
                        checkValidityOfFromMonthNYear(
                          values?.toMonth?.value,
                          valueOption?.value,
                          setFieldValue,
                          "toYear",
                          "toMonth"
                        );
                      }}
                      label="To Year"
                      placeholder="To Year"
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.isContinue === true}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Addition" },
                        { value: 2, label: "Deduction" },
                      ]}
                      value={values?.type}
                      label="Type Name"
                      onChange={(valueOption) => {
                        setFieldValue("typeName", "");
                        getAdditionDeductionDDL(
                          accountId,
                          valueOption?.value === 1 ? true : false,
                          setAdditionDeductionDDl
                        );
                        setFieldValue("type", valueOption);
                      }}
                      placeholder="Type Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <NewSelect
                      name="typeName"
                      options={additionDeductionDDl}
                      value={values?.typeName}
                      label="Allowance/Deduction Name"
                      onChange={(valueOption) => {
                        setFieldValue("typeName", valueOption);
                      }}
                      placeholder="Allowance/Deduction Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>Amount</label>
                    <InputField
                      value={values?.amount}
                      name="amount"
                      placeholder="Amount"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Total Amount Show */}
              {/* <div className="col-lg-12">
                <div className="text-right">
                  <p style={{ marginBottom: "0rem" }}>
                    <strong> Total Addition Amount: </strong>
                    {totalAddition}
                  </p>
                  <p style={{ marginBottom: "0rem" }}>
                    <strong> Total Deduction Amount: </strong>
                    {totalDeduction}
                  </p>
                </div>
              </div> */}
            </div>

            <div className="row px-4">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Employee Name</th>
                    <th>Allowance/Deduction Type</th>
                    <th>Type</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.length > 0 &&
                    rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <div>{item?.employeeName}</div>
                          </td>
                          <td>
                            <div>{item?.deductionType?.strType}</div>
                          </td>
                          <td>
                            <div>
                              {item?.deductionType?.isAddition
                                ? "Addition"
                                : "Deduction"}
                            </div>
                          </td>
                          <td className="text-center">
                            <div>{item?.month}</div>
                          </td>
                          <td>
                            <div className="text-center">{item?.year}</div>
                          </td>

                          <td>
                            <div className="text-right">{item?.numAmount}</div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
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
  );
}

export default _Form;
