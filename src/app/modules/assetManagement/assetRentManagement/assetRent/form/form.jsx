import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getAssetDDL,
  getBusinessPartnerDDL,
  getCurrencyDDL,
  getSBUListDDL,
  SaveInventoryLoanValidationSchema,
} from "../helper";

export default function _Form({
  params,
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  type,
  selectedBusinessUnit,
}) {
  const history = useHistory();
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [sbuDDL, setSBUDDL] = useState([]);
  const [assetDDL, setAssetDDL] = useState([]);
  const [rentTypeDDL] = useState([
    { value: 1, label: "Daily" },
    { value: 2, label: "Monthly" },
    { value: 3, label: "Fixed" },
  ]);

  useEffect(() => {
    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerDDL
    );
    getSBUListDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSBUDDL
    );
    getCurrencyDDL(setCurrencyDDL);
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={SaveInventoryLoanValidationSchema}
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
          setValues,
        }) => (
          <>
            <Card>
              <CardHeader
                title={
                  params?.type === "edit"
                    ? "Asset Rent Edit"
                    : params?.type === "view"
                    ? "Asset Rent View"
                    : "Asset Rent Create"
                }
              >
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={false ? "d-none" : "btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>

                  <button
                    type="reset"
                    onClick={() => {
                      resetForm(initData);
                    }}
                    className={
                      params?.type === "view" ? "d-none" : "btn btn-light ml-2"
                    }
                  >
                    <i className="fa fa-redo"></i>
                    Reset
                  </button>
                  {`  `}
                  <button
                    type="submit"
                    className={
                      params?.type === "view"
                        ? "d-none"
                        : "btn btn-primary ml-2"
                    }
                    onClick={handleSubmit}
                    disabled={params?.type === "view"}
                  >
                    {"Save"}
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                {console.log("Values", values)}
                {console.log("Errors", errors)}

                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="rentType"
                          options={rentTypeDDL}
                          value={values?.rentType}
                          label="Rent Type"
                          onChange={(valueOption) => {
                            setFieldValue("rentType", valueOption);
                          }}
                          placeholder="Rent Type"
                          errors={errors}
                          isDisabled={type === "view" || type === "edit"}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>From Date</label>
                        <InputField
                          value={values?.rentFromDate}
                          name="rentFromDate"
                          placeholder="From Date"
                          type="date"
                          disabled={type === "view"}
                        />
                      </div>

                      {values?.rentType?.value === 3 ? (
                        <div className="col-lg-3">
                          <label>To Date</label>
                          <InputField
                            value={values?.rentToDate}
                            name="rentToDate"
                            placeholder="From Date"
                            type="date"
                            disabled={type === "view"}
                          />
                        </div>
                      ) : null}

                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("", "");
                            setFieldValue("sbu", valueOption);
                            getAssetDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setAssetDDL
                            );
                          }}
                          placeholder="SBU"
                          errors={errors}
                          touched={touched}
                          isDisabled={type === "view" || type === "edit"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="asset"
                          options={assetDDL}
                          value={values?.asset}
                          label="Asset"
                          onChange={(valueOption) => {
                            setFieldValue("asset", valueOption);
                          }}
                          placeholder="Asset"
                          errors={errors}
                          touched={touched}
                          isDisabled={type === "view" || type === "edit"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="partner"
                          options={partnerDDL}
                          value={values?.partner}
                          label="Customer"
                          onChange={(valueOption) => {
                            setFieldValue("partner", valueOption);
                          }}
                          placeholder="Customer"
                          errors={errors}
                          isDisabled={type === "view" || type === "edit"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Rent</label>
                        <InputField
                          value={values?.rentRate}
                          name="rentRate"
                          onChange={(e) => {
                            setFieldValue("rentRate", e.target.value);
                          }}
                          placeholder="Rent"
                          type="number"
                          disabled={type === "view"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="currency"
                          options={currencyDDL}
                          value={values?.currency}
                          label="Currency"
                          onChange={(valueOption) => {
                            setFieldValue("currency", valueOption);
                          }}
                          placeholder="Currency"
                          isDisabled={type === "view"}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Base Currency Conversation</label>
                        <InputField
                          value={values?.currConversationRate}
                          name="currConversationRate"
                          onChange={(e) => {
                            setFieldValue(
                              "currConversationRate",
                              e.target.value
                            );
                          }}
                          placeholder="Base Currency Conversation"
                          type="number"
                          disabled={type === "view"}
                        />
                      </div>
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
