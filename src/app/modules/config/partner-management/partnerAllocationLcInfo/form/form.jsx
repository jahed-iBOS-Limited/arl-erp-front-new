/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router";
import { getBranchNameDDL, validationSchema } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function _Form({ initData, saveHandler, isEdit, isView, DDL }) {
  const { supplierCountryDDL, bankDDL, branchDDL, setbranchDDL, lcDDL } = DDL;
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={`${(isEdit && "Edit") ||
                  (isView && "View") ||
                  "Create"} Product Allocation LC Information`}
              >
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    <button
                      type="reset"
                      onClick={() => resetForm(initData)}
                      className="btn btn-light ml-2"
                      disabled={isView}
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                      disabled={isView}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {console.log("Values", values)}
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="supplierCountry"
                          label="Supplier Country"
                          options={supplierCountryDDL}
                          value={values?.supplierCountry}
                          onChange={(valueOption) => {
                            setFieldValue("supplierCountry", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isView}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="lCno"
                          label="LC No"
                          options={lcDDL || []}
                          value={values?.lCno}
                          onChange={(valueOption) => {
                            setFieldValue("lCno", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isView}
                        />
                      </div>
                      {/* <div className="col-lg-3">
                        <label>LC No</label>
                        <InputField
                          value={values?.lCno}
                          placeholder="LC No"
                          name="lCno"
                          type="text"
                          touched={touched}
                          disabled={isView}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <label>LC Date</label>
                        <InputField
                          value={values?.lCdate}
                          placeholder="LC Date"
                          name="lCdate"
                          type="date"
                          touched={touched}
                          disabled={isView}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="bankName"
                          label="Bank Name"
                          options={bankDDL}
                          value={values?.bankName}
                          onChange={(valueOption) => {
                            setFieldValue("branchName", "");
                            setFieldValue("bankName", valueOption);
                            getBranchNameDDL(
                              valueOption?.value,
                              18, // Hardcode for BD
                              setbranchDDL
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isView}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="branchName"
                          label="Branch Name"
                          options={branchDDL}
                          value={values?.branchName}
                          onChange={(valueOption) => {
                            setFieldValue("branchName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isView}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Ship Name</label>
                        <InputField
                          value={values?.shipName}
                          placeholder="Ship Name"
                          name="shipName"
                          type="text"
                          touched={touched}
                          disabled={isView}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Color</label>
                        <InputField
                          value={values?.color}
                          placeholder="Color"
                          name="color"
                          type="text"
                          touched={touched}
                          disabled={isView}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Allotment Ref No.</label>
                        <InputField
                          value={values?.allotmentRefNo}
                          placeholder="Allotment Ref No."
                          name="allotmentRefNo"
                          type="text"
                          touched={touched}
                          disabled={isView}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Allotment Ref Date.</label>
                        <InputField
                          value={values?.allotmentRefDate}
                          placeholder="LC Allotment Date."
                          name="allotmentRefDate"
                          type="date"
                          touched={touched}
                          disabled={isView}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
