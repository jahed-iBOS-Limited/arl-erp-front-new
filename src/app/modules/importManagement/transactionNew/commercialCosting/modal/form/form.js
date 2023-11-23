/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import {
  validationSchema,
  LCTypeDDLAction,
  originTypeDDLAction,
  encoItemDDLAction,
  materialTypeDDLAction,
  PortDDLAction,
  GetBankDDL,
  currencyTypeDDLAction,
} from "../helper";
import InputField from './../../../../../_helper/_inputField';
import NewSelect from './../../../../../_helper/_select';
import { _todayDate } from "../../../../../_helper/_todayDate";

export default function _Form({
  initData,
  saveHandler,
  viewType,
  profileData,
  selectedBusinessUnit,
  setDisabled,
}) {
  const [LCTypeDDL, setLCTypeDDL] = useState([]);
  const [originTypeDDL, setOriginTypeDDL] = useState([]);
  const [incoTermsDDL, setIncoTermsDDL] = useState([]);
  const [materialTypeDDL, setMaterialTypeDDL] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);

  useEffect(() => {
    LCTypeDDLAction(setDisabled, setLCTypeDDL);
    originTypeDDLAction(setDisabled, setOriginTypeDDL);
    encoItemDDLAction(setDisabled, setIncoTermsDDL);
    materialTypeDDLAction(setDisabled, setMaterialTypeDDL);
    // PODDLAction(setPODDL, profileData?.accountId, selectedBusinessUnit?.value);
    PortDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDisabled,
      setPortDDL
    );
    GetBankDDL(setBankDDL, profileData?.accountId, selectedBusinessUnit?.value);
    currencyTypeDDLAction(setCurrencyDDL);
  }, []);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values }, () => {
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
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 col-md-3">
                    <label>PO No/ LC No</label>
                    <InputField
                      value={values?.poNo}
                      name="poNo"
                      placeholder="PO No"
                      type="text"
                      disabled={true}
                    />
                    {/* <NewSelect
                      name='poNo'
                      options={[]}
                      value={values?.poNo}
                      isDisabled={true}
                      // label="Inco-Terms"
                      // selectedValue={values?.poNo}
                      // isSearchIcon={true}
                      // handleChange={(valueOption) => {
                      //   setFieldValue("poNo", valueOption);
                      //   setFieldValue("currency", {
                      //     value: valueOption?.currencyId,
                      //     label: valueOption?.currencyName,
                      //   });
                      //   setFieldValue("PIAmountFC", valueOption?.piAmountFC);
                      //   setFieldValue("poId", valueOption?.poId);
                      //   if (valueOption?.currencyName === "Taka") {
                      //     setFieldValue("exchangeRate", 1);
                      //     setFieldValue("PIAmountBDT", valueOption?.piAmountFC);
                      //   }
                      // }}
                      // loadOptions={loadPartsList}
                      // isDisabled={viewType === "view" || viewType === "edit"}
                    /> */}
                  </div>
                  <div className="col-lg-3">
                    <label>LC No</label>
                    <InputField
                      value={values?.lcNo}
                      name="lcNo"
                      placeholder="LC No"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Date</label>
                    <InputField
                      value={values?.lcDate}
                      name="lcDate"
                      placeholder="LC Date"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      name="lastShipmentDate"
                      placeholder="Last Shipment Date"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Expired Date</label>
                    <InputField
                      value={values?.lcExpiredDate}
                      name="lcExpiredDate"
                      placeholder="LC Expired Date"
                      type="date"
                      disabled={true}
                      min={_todayDate()}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="encoTerms"
                      options={incoTermsDDL}
                      value={values?.encoTerms}
                      label="Inco-Terms"
                      onChange={(valueOption) => {
                        setFieldValue("encoTerms", valueOption);
                      }}
                      placeholder="Select Inco-Terms"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="materialType"
                      options={materialTypeDDL}
                      value={values?.materialType}
                      label="Material Type"
                      onChange={(valueOption) => {
                        setFieldValue("materialType", valueOption);
                      }}
                      placeholder="Select Material Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        viewType
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="lcType"
                      options={LCTypeDDL}
                      value={values?.lcType}
                      label="LC Type"
                      onChange={(valueOption) => {
                        setFieldValue("lcType", valueOption);
                      }}
                      placeholder="Select LC Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.bankName}
                      options={bankDDL || []}
                      name="bankName"
                      label="Bank Name"
                      placeholder="Bank name"
                      onChange={(valueOption) => {
                        setFieldValue("bankName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="origin"
                      options={originTypeDDL}
                      value={values?.origin}
                      label="Country Origin"
                      onChange={(valueOption) => {
                        setFieldValue("origin", valueOption);
                      }}
                      placeholder="Select Country Origin"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Loading Port</label>
                    <InputField
                      value={values?.loadingPort}
                      name="loadingPort"
                      placeholder="Loading Port"
                      type="text"
                      // disabled
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="finalDestination"
                      options={portDDL}
                      value={values?.finalDestination}
                      label="Final Destination"
                      onChange={(valueOption) => {
                        setFieldValue("finalDestination", valueOption);
                      }}
                      placeholder="Select Final Destination"
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        viewType 
                      }
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Tolarance(%)</label>
                    <InputField
                      value={values?.tolarance}
                      name="tolarance"
                      placeholder="Tolarance"
                      type="number"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="currency"
                      options={currencyDDL || []}
                      value={values?.currency}
                      label="Currency"
                      onChange={(valueOption) => {
                        setFieldValue("currency", valueOption);
                        setFieldValue(
                          "exchangeRate",
                          valueOption?.label === "Taka" ? 1 : ""
                        );
                        setFieldValue("PIAmountFC", "");
                        setFieldValue("PIAmountBDT", "");
                      }}
                      placeholder="Select Currency"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType}
                    />
                    {/* <label>Currency</label>
                    <InputField
                      value={values?.currency?.currencyName}
                      name="currency"
                      placeholder="Currency"
                      type="text"
                      disabled={true}
                    /> */}
                  </div>
                  <div className="col-lg-3">
                    <label>PI Amount (FC)</label>
                    <InputField
                      value={values?.PIAmountFC}
                      // value={numberWithCommas(values?.PIAmountFC)}
                      name="PIAmountFC"
                      placeholder="PI Amount (FC)"
                      type="text"
                      onChange={(valueOption) => {
                        setFieldValue("PIAmountFC", valueOption.target.value);
                        setFieldValue(
                          "PIAmountBDT",
                          values?.PIAmountFC
                            ? (+valueOption.target.value ||
                                +initData?.PIAmountFC) * +values?.exchangeRate
                            : ""
                        );
                      }}
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Exchange Rate</label>
                    <InputField
                      value={values?.exchangeRate}
                      name="exchangeRate"
                      placeholder="Exchange Rate"
                      type="number"
                      onChange={(e) => {
                        setFieldValue(
                          "exchangeRate",
                          e?.target.value ? Number(e.target.value) : ""
                        );
                        setFieldValue(
                          "PIAmountBDT",
                          e?.target.value
                            ? values?.PIAmountFC *
                                (Number(e?.target?.value) ||
                                  initData?.exchangeRate)
                            : ""
                        );
                        // setFieldValue(
                        //   "PIAmountBDTNumber",
                        //   values?.PIAmountFCNumber * Number(e?.target?.value)
                        // );
                      }}
                      disabled={
                        viewType
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PI Amount (BDT)</label>
                    <InputField
                      value={values?.PIAmountBDT}
                      // value={numberWithCommas(values?.PIAmountBDT)}
                      name="PIAmountBDT"
                      placeholder="PI Amount (BDT)"
                      type="text"
                      disabled={viewType }
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Tenor (Days)</label>
                    <InputField
                      value={values?.lcTenor}
                      name="lcTenor"
                      placeholder="LC Tenor"
                      type="number"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PG Amount (FC)</label>
                    <InputField
                      value={values?.pgAmount}
                      name="pgAmount"
                      placeholder="PG Amount"
                      type="number"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PG Due Date</label>
                    <InputField
                      value={values?.pgDueDate}
                      name="pgDueDate"
                      placeholder="PG Due Date"
                      type="date"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Description</label>
                    <InputField
                      value={values?.description}
                      name="description"
                      placeholder="Description"
                      type="text"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Total Bank Charge(including VAT)</label>
                    <InputField
                      value={values?.totalBankCharge}
                      name="totalBankCharge"
                      placeholder="Total Bank Charge"
                      type="number"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>VAT on Bank Charge</label>
                    <InputField
                      value={values?.vatOnCharge}
                      name="vatOnCharge"
                      placeholder="VAT on Bank Charge"
                      type="number"
                      disabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Due Date</label>
                    <InputField
                      value={values?.dueDate}
                      name="dueDate"
                      placeholder="Due Date"
                      type="date"
                      disabled={viewType}
                    />
                  </div>
                  <div
                    style={{ marginTop: "10px" }}
                    className="d-flex justify-content-center align-items-center col-auto"
                  >
                    <label className="d-flex justify-content-start align-items-center">
                      <Field
                        onClick={() => {
                          setFieldValue("indemnityBond", "");
                        }}
                        style={{ marginRight: "5px" }}
                        type="checkbox"
                        name="indemnityBond"
                        checked={values?.indemnityBond}
                        disabled={viewType}
                      />
                      Indemnity Bond
                    </label>
                  </div>
                  <div
                    style={{ marginTop: "10px" }}
                    className="d-flex justify-content-center align-items-center col-auto"
                  >
                    <label className="d-flex justify-content-start align-items-center">
                      <Field
                        onClick={() => {
                          setFieldValue("bondLicense", "");
                        }}
                        style={{ marginRight: "5px" }}
                        type="checkbox"
                        name="bondLicense"
                        checked={values?.bondLicense}
                        disabled={viewType}
                      />
                      Bond License
                    </label>
                  </div>

                  <div className="col-lg-3 mt-2">
                    <label>Duration</label>
                    <InputField
                      value={values?.duration}
                      name="duration"
                      placeholder="Duration"
                      type="date"
                      disabled={viewType}
                    />
                  </div>
                </div>
                {/* last div */}
              </div>

              
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
