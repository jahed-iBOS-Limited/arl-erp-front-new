import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { useState } from "react";
import { GetBankBranchAdd_Api, GetBankDDL_api } from "./../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  bankDDL: Yup.object().shape({
    label: Yup.string().required("Bank Name is required"),
    value: Yup.string().required("Bank Name is required"),
  }),
  branchName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Branch Name is required"),
  branchCode: Yup.string()
    .matches(/^[0-9]+$/, "Must be only number")
    .min(3, "Minimum 3 symbols")
    .max(3, "Maximum 3 symbols")
    .required("Branch Code is required"),
  routingNo: Yup.string()
    // .min(9, "Minimum 9 symbols")
    // .max(9, "Maximum 9 symbols")
    .required("Routing NO is required")
    .matches(/^(\S{9}|\S{11})$/, "Must be 9/11 number"),
  //
  // .test(
  //   "oneOfRequired",
  //   "Routing No not matched(NB: bankCode * * branchCode *)",
  //   function(item) {
  //     if (this.parent?.bankDDL.code) {
  //       // routingNo chacks
  //       if (item?.length >= 9) {
  //         //bankDDLcode
  //         const code = this.parent?.bankDDL.code.slice(0, 3);
  //         //Branch Code
  //         const branchCode = this.parent.branchCode;
  //         //bankCode frist 3 and  Branch Code5-8
  //         const routingNoFrist = item.slice(0, 3);
  //         const routingNolast = item.slice(5, 8);
  //         // condition
  //         return code === routingNoFrist && branchCode === routingNolast;
  //       }
  //     } else {
  //       return true;
  //     }
  //   }
  // ),
  branchAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("District is required"),
});

export default function _Form({ initData, btnRef, saveHandler, resetBtnRef }) {
  const [BankDDL, setBankDDL] = useState([]);
  const [addressDDl, setAddressDDl] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetBankDDL_api(setBankDDL);
      GetBankBranchAdd_Api(setAddressDDl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
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
        }) => (
          <>
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="bankDDL"
                    options={BankDDL || []}
                    value={values?.bankDDL}
                    label="Bank Name"
                    onChange={(valueOption) => {
                      setFieldValue("bankDDL", valueOption);
                    }}
                    placeholder="Bank Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="branchAddress"
                    options={addressDDl || []}
                    value={values?.branchAddress}
                    label="Address"
                    onChange={(valueOption) => {
                      setFieldValue("branchAddress", valueOption);
                    }}
                    placeholder="Address"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Branch Name</label>
                  <InputField
                    value={values?.branchName}
                    name="branchName"
                    placeholder="Branch Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Branch Code</label>
                  <InputField
                    value={values?.branchCode}
                    name="branchCode"
                    placeholder="Branch Code"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Routing No</label>
                  <InputField
                    value={values?.routingNo}
                    name="routingNo"
                    placeholder="Routing No"
                    type="text"
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  display: "none",
                }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{
                  display: "none",
                }}
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
