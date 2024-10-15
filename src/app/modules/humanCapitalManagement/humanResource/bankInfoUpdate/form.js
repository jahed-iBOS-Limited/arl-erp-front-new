import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import * as Yup from "yup";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import {
  getBankBranchDDL_api,
  getBankDDL_api,
  getBankInfoByEmpId,
} from "./helper";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import FormikError from "../../../_helper/_formikError";

const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      value: Yup.string().required("Employee is required"),
      label: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  bank: Yup.object()
    .shape({
      value: Yup.string().required("Bank is required"),
      label: Yup.string().required("Bank is required"),
    })
    .typeError("Bank is required"),
  bankBranch: Yup.object()
    .shape({
      value: Yup.string().required("Bank branch is required"),
      label: Yup.string().required("Bank branch is required"),
    })
    .typeError("Bank branch is required"),
  routingNumber: Yup.string().required("Routing is required"),
  accountNumber: Yup.string().required("Account number is required"),
  accountName: Yup.string().required("Account name is required"),
});

export default function _Form({
  initData,
  saveHandler,
  isDisabled,
  setDisabled,
}) {
  const [bankDDL, setBankDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);

  useEffect(() => {
    getBankDDL_api(setBankDDL);
  }, []);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
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
          setValues,
        }) => (
          <div>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader>
                <div style={{ marginLeft: "15px" }} className="card-title">
                  <h3 className="card-label">Update Employee Bank Info</h3>
                </div>

                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={isDisabled}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <label>Employee</label>
                      <SearchAsyncSelect
                        selectedValue={values?.employee}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setValues({
                            employee: "",
                            accountName: "",
                            accountNumber: "",
                            bank: "",
                            bankBranch: "",
                            routingNumber: "",
                            employeeBankInfoId: "",
                          });
                          setFieldValue("employee", valueOption);
                          getBankInfoByEmpId(
                            valueOption,
                            values,
                            setValues,
                            setDisabled
                          );
                        }}
                        loadOptions={loadUserList}
                      />
                      <FormikError
                        errors={errors}
                        name="employee"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Account/Beneficiary</label>
                      <InputField
                        value={values?.accountName}
                        name="accountName"
                        placeholder="Acc/Beneficiary Name"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Account Number</label>
                      <InputField
                        value={values?.accountNumber}
                        name="accountNumber"
                        placeholder="Account Number"
                        type="text"
                        min="0"
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="bank"
                        options={bankDDL || []}
                        value={values?.bank}
                        label="Bank"
                        onChange={(valueOption) => {
                          setFieldValue("bank", valueOption);
                          setFieldValue("bankBranch", "");
                          getBankBranchDDL_api(
                            valueOption?.value,
                            setBankBranchDDL
                          );
                        }}
                        placeholder="Bank Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="bankBranch"
                        options={bankBranchDDL || []}
                        value={values?.bankBranch}
                        label="Bank Branch"
                        onChange={(valueOption) => {
                          setFieldValue("bankBranch", valueOption);
                          setFieldValue(
                            "routingNumber",
                            valueOption?.routingNo
                          );
                        }}
                        placeholder="Bank Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Routing Number</label>
                      <InputField
                        value={values?.routingNumber}
                        name="routingNumber"
                        placeholder="Routing Number"
                        type="text"
                      />
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
