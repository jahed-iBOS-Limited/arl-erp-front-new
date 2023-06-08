/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import CreatePageTable from "./CreatePageTable";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
});

// Validation schema for Edit
const editValidationSchema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  PoNumber,
  rowDto,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state } = useLocation();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? editValidationSchema : validationSchema}
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Select PO Number"
                    options={PoNumber}
                    value={values?.poNumber}
                    name="poNumber"
                    onChange={(valueOption) => {
                      setFieldValue("poNumber", valueOption);
                      setFieldValue("poAmount", valueOption?.poAmount);
                      setFieldValue("adjustedAmount", valueOption?.adjustAmount);
                      setFieldValue("supplier", {
                        value: valueOption?.supplierId,
                        label: valueOption?.supplierName,
                      });
                    }}
                    isDisabled={isEdit}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values?.poAmount}
                    name="poAmount"
                    component={Input}
                    placeholder="PO Amount"
                    label="PO Amount"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values?.adjustedAmount}
                    name="adjustedAmount"
                    component={Input}
                    placeholder="Adjusted Amount"
                    label="Adjusted Amount"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Supplier Name"
                    options={[]}
                    value={values?.supplier}
                    name="supplier"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-1">
                  <button type="button" className="btn btn-primary mt-9" onClick={e => showrowDtoforPO(values.poNumber.value)} >Show</button>
                </div> */}
                <div className="col-lg-6">
                  <Field
                    value={values?.comment}
                    name="comment"
                    component={Input}
                    placeholder="Comment"
                    disabled={true}
                    label="Comment"
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Cost Center"
                    options={[]}
                    value={values?.costCenter}
                    name="costCenter"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    dependencyFunc={(payload, allvalues, setter) => {
                      setter("projectName", "");
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Project Name"
                    options={[]}
                    value={values?.projectName}
                    dependencyFunc={(payload, allvalues, setter) => {
                      setter("costCenter", "");
                    }}
                    name="projectName"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Service Received By"
                    options={[]}
                    value={values?.serviceReceive}
                    name="serviceReceive"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className={"col-lg-6 mt-5"}>
                  {values?.strDocumentId && (
                    <button
                      className="btn btn-primary mt-2"
                      type="button"
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(values?.strDocumentId)
                        );
                      }}
                    >
                      View
                    </button>
                  )}
                </div>
              </div>

              {id && (
                <div className="text-right mt-2">
                  <h6>Total Receive Amount {state?.receiveAmount}</h6>
                </div>
              )}

              <div className="my-1">
                <CreatePageTable rowDto={rowDto} />
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
