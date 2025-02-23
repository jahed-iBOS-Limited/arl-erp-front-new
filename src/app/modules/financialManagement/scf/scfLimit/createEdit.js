import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  item: "",
  remarks: "",
  amount: "",
  date: "",
};

export default function SCFLimitCreateEditPage() {
  // hooks
  const { state: landingState } = useLocation();
  const { id } = useParams();

  // state
  const [objProps, setObjprops] = useState({});

  // api action
  const [
    bankNameDDL,
    getBankNameDDL,
    getBankNameDDLLoading,
    setBankNameDDL,
  ] = useAxiosGet();

  // submit handler
  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  // is loading
  const isLoading = getBankNameDDLLoading;

  // clg
  console.log({ landingState, id });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={{}}
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
          {isLoading && <Loading />}
          <IForm
            title={`Create SCF Limit`}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.supplier}
                    label="Supplier Name"
                    name="supplier"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("supplier", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bankName"
                    options={bankNameDDL || []}
                    value={values?.bankName}
                    label="Bank Name"
                    onChange={(valueOption) => {
                      setFieldValue("bankName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.accountNo}
                    label="Account No"
                    name="accountNo"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("accountNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.limit}
                    label="Limit"
                    name="limit"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("limit", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.updatedDate}
                    label="Updated Date"
                    name="updatedDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("updatedDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.tenorDays}
                    label="Tenor Days"
                    name="tenorDays"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("tenorDays", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionRef}
                    label="Transaction Ref"
                    name="transactionRef"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("transactionRef", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.limitExpiryDate}
                    label="Limit Expiry Date"
                    name="limitExpiryDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("limitExpiryDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.interestRate}
                    label="Interest Rate"
                    name="interestRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("interestRate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                  />
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
