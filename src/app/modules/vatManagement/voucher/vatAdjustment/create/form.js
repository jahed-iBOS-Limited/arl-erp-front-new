/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import {
  getTaxTransactionTypeListDDL,
  getTaxComponentDDL,
  getTaxAdjustmentType_api,
} from "../helper";
import NewSelect from "../../../../_helper/_select";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  taxBranchAddress: Yup.string().required("Branch Address required"),

  taxTransactionType: Yup.object().shape({
    label: Yup.string().required("Transaction Type required"),
    value: Yup.string().required("Transaction Type required"),
  }),
  adjustmentType: Yup.object().shape({
    label: Yup.string().required("Adjustment Type required"),
    value: Yup.string().required("Adjustment Type required"),
  }),

  componentName: Yup.object().shape({
    label: Yup.string().required("Component type required"),
    value: Yup.string().required("Component type required"),
  }),
  amount: Yup.string().required("amount is required"),

  adjustmentDate: Yup.date().required("Adjustment Date required"),
  adjustmentReason: Yup.string().required("Adjustment Reason required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isEdit,
  location,
}) {
  const [componentName, setTaxComponent] = useState([]);
  const [taxTransactionType, setTaxTransactionType] = useState([]);
  const [taxAdjustmentTypeDDL, setTaxAdjustmentTypeDDL] = useState([]);

  const adjustmentType = [
    { value: 1, label: "Increament" },
    { value: 2, label: "Decreament" },
  ];

  const [valid, setValid] = useState(true);
  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      getTaxTransactionTypeListDDL(setTaxTransactionType);
      getTaxComponentDDL(setTaxComponent);
      getTaxAdjustmentType_api(setTaxAdjustmentTypeDDL);
    }
  }, [profileData, selectedBusinessUnit]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                taxBranchAddress:
                  location?.state?.selectedTaxBranchDDL?.address,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
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
            <Form className="form from-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3 pl pr-1 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.taxBranchAddress || ""}
                    label="Branch Address"
                    name="taxBranchAddress"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="adjustmentType"
                    options={taxAdjustmentTypeDDL || []}
                    value={values?.adjustmentType}
                    label="Adjustment Type"
                    onChange={(valueOption) => {
                      setFieldValue("adjustmentType", valueOption);
                    }}
                    placeholder="Adjustment Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="adjustmentPurpose"
                    options={adjustmentType}
                    value={values?.adjustmentPurpose}
                    label="Adjustment Purpose"
                    onChange={(valueOption) => {
                      setFieldValue("adjustmentPurpose", valueOption);
                    }}
                    placeholder="Adjustment Purpose"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxTransactionType"
                    options={taxTransactionType || []}
                    value={values?.taxTransactionType}
                    label="Transaction Type"
                    onChange={(valueOption) => {
                      setFieldValue("taxTransactionType", valueOption);
                    }}
                    placeholder="Transaction Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="componentName"
                    options={componentName || []}
                    value={values?.componentName}
                    label="Tax Component"
                    onChange={(valueOption) => {
                      setFieldValue("componentName", valueOption);
                    }}
                    placeholder="Tax Component"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3 pl pr-1 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>
                <div className="col-lg-3 pl-3 pr-0 mb-0">
                  <IInput
                    value={values?.adjustmentDate}
                    label="Adjustment Date"
                    name="adjustmentDate"
                    type="date"
                  />
                             
                </div>
                <div className="col-lg-3 pl pr-1 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.adjustmentReason}
                    label="Adjustment Reason"
                    name="adjustmentReason"
                  />
                </div>
              </div>

              {/* Row Dto Table End */}

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
