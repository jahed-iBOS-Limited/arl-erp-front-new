import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getBankBranchDDLAction } from "../helper";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = {
  depositAmount: Yup.number()
    .min(1, "Minimum 2 symbols")
    .max(10000000000, "Maximum 100000000000 symbols")
    .required("Deposit Amount is required"),
  depositDate: Yup.date().required("Deposit Date is required"),
};
const createValidation = Yup.object().shape({
  ...validationSchema,
  challanNo: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(10000000000, "Maximum 100 symbols")
    .required("Challan No is required"),

  instrumentNo: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(10000000000, "Maximum 100 symbols")
    .required("Instrument No is required"),

  bankName: Yup.object().shape({
    label: Yup.string().required("Bank Name is required"),
    value: Yup.string().required("Bank Name is required"),
  }),
  bankBranch: Yup.object().shape({
    label: Yup.string().required("Bank Branch is required"),
    value: Yup.string().required("Bank Branch is required"),
  }),
  challanDate: Yup.date().required("Challan Date is required"),
  instrumentDate: Yup.date().required("Instrument Date is required"),
  depositeType: Yup.object().shape({
    label: Yup.string().required("Deposite Type is required"),
    value: Yup.string().required("Deposite Type is required"),
  }),
});
const editValidation = Yup.object().shape({
  ...validationSchema,
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  depositeType,
  bankName,
  bankBranch,
  setBankBranch,
  profileData,
  depositorName,
  isEdit,
  selectedBusinessUnit,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={isEdit ? editValidation : createValidation}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const isCheck  = [171, 244].includes(selectedBusinessUnit?.value)
          if(!isCheck){
            if(!values?.designation){
              return toast.warning("Designation is not required")
            }
            if(!values?.depositorName){
              return toast.warning("Depositor Name is not required")
            }
          }
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                {!isEdit && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="depositeType"
                      options={depositeType || []}
                      value={values?.depositeType}
                      label="Deposite Type"
                      onChange={(valueOption) => {
                        setFieldValue("depositeType", valueOption);
                      }}
                      placeholder="Deposite Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <label>Deposit Amount</label>
                  <InputField
                    value={values?.depositAmount}
                    name="depositAmount"
                    placeholder="Deposit Amount"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Deposit Date</label>
                  <InputField
                    value={values?.depositDate}
                    name="depositDate"
                    placeholder="Deposit Date"
                    type="date"
                  />
                </div>
                {/* {!isEdit && ( */}
                <div className="col-lg-3">
                  <label>Challan No</label>
                  <InputField
                    value={values?.challanNo}
                    name="challanNo"
                    placeholder="Challan No"
                    type="text"
                    disabled={isEdit}
                  />
                </div>
                {/* )} */}

                {/* {!isEdit && ( */}
                <div className="col-lg-3">
                  <label>Challan Date</label>
                  <InputField
                    value={values?.challanDate}
                    name="challanDate"
                    placeholder="Challan Date"
                    type="date"
                    disabled={isEdit}
                  />
                </div>
                {/* )} */}
                {/* {!isEdit && ( */}
                <div className="col-lg-3">
                  <label>Instrument No</label>
                  <InputField
                    value={values?.instrumentNo}
                    name="instrumentNo"
                    placeholder="Instrument No"
                    type="text"
                    disabled={isEdit}
                  />
                </div>
                {/* )} */}

                {/* {!isEdit && ( */}
                <div className="col-lg-3">
                  <label>Instrument Date</label>
                  <InputField
                    value={values?.instrumentDate}
                    name="instrumentDate"
                    placeholder="Instrument Date"
                    type="date"
                    disabled={isEdit}
                  />
                </div>
                {/* )} */}
                {/* {!isEdit && ( */}
                <div className="col-lg-3">
                  <NewSelect
                    name="bankName"
                    options={bankName || []}
                    value={values?.bankName}
                    label="Bank Name"
                    onChange={(valueOption) => {
                      setFieldValue("bankName", valueOption);
                      setFieldValue("bankBranch", "");
                      getBankBranchDDLAction(
                        valueOption?.value,
                        profileData?.countryId,
                        setBankBranch
                      );
                    }}
                    placeholder="Bank Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                {/* )} */}
                {/* {!isEdit && ( */}
                <div className="col-lg-3">
                  <NewSelect
                    name="bankBranch"
                    options={bankBranch || []}
                    value={values?.bankBranch}
                    label="Bank Branch"
                    onChange={(valueOption) => {
                      setFieldValue("bankBranch", valueOption);
                    }}
                    placeholder="Bank Branch"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="depositorName"
                    options={depositorName || []}
                    value={values?.depositorName}
                    label="Depositor Name"
                    onChange={(valueOption) => {
                      setFieldValue("depositorName", valueOption);
                    }}
                    placeholder="Depositor Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Designation</label>
                  <InputField
                    value={values?.designation}
                    name="designation"
                    placeholder="Designation"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Description</label>
                  <InputField
                    value={values?.description}
                    name="description"
                    placeholder="Description"
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
