/* eslint-disable jsx-a11y/no-distracting-elements */
import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import { validationSchemaTwo } from "../helper";
import { headers } from "../landing/bankInfoTable";
import ICustomTable from "../../../../_helper/_customTable";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

export default function FormTwo({ obj }) {
  const {
    id,
    rows,
    accId,
    title,
    banks,
    remover,
    history,
    loading,
    branches,
    initData,
    employees,
    addHandler,
    getBranches,
    setBranches,
    saveHandler,
    setBankInfo,
    shipPointDDL,
  } = obj;

  const employeeList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(`/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${accId}&search=${v}`)
      .then((res) => res?.data);
  };
  return (
    <Formik
      initialValues={initData}
      enableReinitialize={true}
      validationSchema={validationSchemaTwo}
      onSubmit={(values, { setFieldValue }) => {
        addHandler(values, () => {
          setBankInfo("", setFieldValue);
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        resetForm,
        handleSubmit,
        setFieldValue,
      }) => (
        <ICustomCard
          title={title}
          saveHandler={() => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
          resetHandler={
            !id
              ? () => {
                  resetForm(initData);
                }
              : ""
          }
          backHandler={() => {
            history.goBack();
          }}
        >
          {loading && <Loading />}

          <form>
            <div className="form-group  global-form row">
              <div className="col-lg-12 mb-3">
                <div className=" mt-3 d-flex align-items-center">
                  <input
                    style={{ transform: "scale(1.5)" }}
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    value={values?.isPublic}
                    checked={values?.isPublic}
                    onChange={(e) => {
                      setFieldValue("isPublic", e.target.checked);
                      setFieldValue("employee", "");
                    }}
                  />
                  <label htmlFor="isPublic" className="pl-2">
                    Public
                  </label>
                </div>
              </div>
              {values?.isPublic ? (
                <div className="col-md-3">
                  <label>Employee Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    handleChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("employee", valueOption);
                        setBankInfo(valueOption, setFieldValue);
                      } else {
                        setFieldValue("employee", "");
                        setBankInfo("", setFieldValue);
                      }
                    }}
                    loadOptions={employeeList}
                  />
                </div>
              ) : (
                <div className="col-lg-3">
                  <NewSelect
                    name="employee"
                    options={employees || []}
                    value={values?.employee}
                    label="Employee Name"
                    placeholder="Employee Name"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("employee", valueOption);
                        setBankInfo(valueOption, setFieldValue);
                      } else {
                        setFieldValue("employee", "");
                        setBankInfo("", setFieldValue);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id}
                  />
                </div>
              )}
              <div className="col-lg-3">
                <NewSelect
                  name="shippingPoint"
                  options={shipPointDDL || []}
                  value={values?.shippingPoint}
                  label="Shipping Point"
                  placeholder="Shipping Point"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("shippingPoint", valueOption);
                    } else {
                      setFieldValue("shippingPoint", "");
                    }
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={id}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="bank"
                  options={banks || []}
                  value={values?.bank}
                  label="Bank Name"
                  placeholder="Bank Name"
                  onChange={(valueOption) => {
                    setFieldValue("branch", "");
                    setBranches([]);
                    if (valueOption) {
                      setFieldValue("bank", valueOption);
                      // country id = 18 for Bangladesh
                      getBranches(
                        `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${
                          valueOption?.value
                        }&CountryId=${18}`
                      );
                    } else {
                      setFieldValue("bank", "");
                    }
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={true}
                  // isDisabled={id}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="branch"
                  options={branches || []}
                  value={values?.branch}
                  label="Branch Name"
                  placeholder="Branch Name"
                  onChange={(valueOption) => {
                    if (valueOption) {
                      setFieldValue("branch", valueOption);
                    } else {
                      setFieldValue("branch", "");
                    }
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={true}
                  // isDisabled={id}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  name="bankAccountName"
                  value={values?.bankAccountName}
                  label="Bank Account Name"
                  placeholder="Bank Account Name"
                  disabled={true}
                  // disabled={id}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  name="bankAccountNumber"
                  value={values?.bankAccountNumber}
                  label="Bank Account Number"
                  placeholder="Bank Account Number"
                  disabled={true}
                  // disabled={id}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  name="routingNumber"
                  value={values?.routingNumber}
                  label="Routing Number"
                  placeholder="Routing Number"
                  disabled={true}
                  // disabled={id}
                />
              </div>
              <IButton
                onClick={() => {
                  handleSubmit();
                }}
                disabled={
                  !values?.routingNumber ||
                  !values?.bankAccountName ||
                  !values?.bankAccountNumber ||
                  !values?.bank ||
                  !values?.branch
                }
              >
                + Add
              </IButton>
            </div>
          </form>
          {rows?.length > 0 && (
            <ICustomTable ths={headers}>
              {rows?.map((row, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center">{i + 1}</td>
                    <td>{row?.employee}</td>
                    <td>{row?.shippingPointName}</td>
                    <td>{row?.bankName}</td>
                    <td>{row?.branchName}</td>
                    <td>{row?.accountName}</td>
                    <td>{row?.bankAccountNumber}</td>
                    <td>{row?.routingNumber}</td>
                    <td className="text-center">
                      <IDelete id={i} remover={remover} />
                    </td>
                  </tr>
                );
              })}
            </ICustomTable>
          )}
        </ICustomCard>
      )}
    </Formik>
  );
}
