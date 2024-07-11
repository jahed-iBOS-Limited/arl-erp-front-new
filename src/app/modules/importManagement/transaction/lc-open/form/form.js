/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  currencyTypeDDLAction,
  empAttachment_action,
  encoItemDDLAction,
  GetBankDDL,
  getCalculationFormLandingForm,
  LCTypeDDLAction,
  marginTypeDDLArr,
  materialTypeDDLAction,
  originTypeDDLAction,
  PortDDLAction,
  validationSchema,
} from "../helper";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import CalculationForm from "./calculationForm";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setFileObjects,
  fileObjects,
  setUploadImage,
  viewType,
  location,
  profileData,
  selectedBusinessUnit,
  setDisabled,
  forDisable,
  bankAccountDDL,
  getAccountDDL,
  setAccountDDL,
}) {
  const dispatch = useDispatch();
  const [LCTypeDDL, setLCTypeDDL] = useState([]);
  const [originTypeDDL, setOriginTypeDDL] = useState([]);
  const [incoTermsDDL, setIncoTermsDDL] = useState([]);
  const [materialTypeDDL, setMaterialTypeDDL] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [, setLoading] = useState(false);
  const [portDDL, setPortDDL] = useState([]);
  const [open, setOpen] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [marginTypeDDL, setMarginTypeDDL] = useState(marginTypeDDLArr)
  const [isShowModal, setIsShowModal] = useState(false);
  const [calculationFormData, setCalculationFormData] = useState("");

  useEffect(() => {
    LCTypeDDLAction(setDisabled, setLCTypeDDL);
    originTypeDDLAction(setDisabled, setOriginTypeDDL);
    encoItemDDLAction(setDisabled, setIncoTermsDDL);
    materialTypeDDLAction(setDisabled, setMaterialTypeDDL);
    PortDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDisabled,
      setPortDDL
    );
    GetBankDDL(setBankDDL, profileData?.accountId, selectedBusinessUnit?.value);
    currencyTypeDDLAction(setCurrencyDDL);
  }, []);

  useEffect(() => {
    if (location?.state?.bankId) {
      getAccountDDL(
        `/imp/ImportCommonDDL/GetBankAccountIdNameDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&BankId=${location?.state?.bankId}`
      );
    }
  }, [location?.state?.bankId]);

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
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 col-md-3">
                    <label>{`PO No${viewType ? "" : "/ LC No"}`}</label>
                    <InputField
                      value={values?.poNo}
                      name="poNo"
                      placeholder="PO No"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC No</label>
                    <InputField
                      value={values?.lcNo}
                      name="lcNo"
                      placeholder="LC No"
                      type="text"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Date</label>
                    <InputField
                      value={values?.lcDate}
                      name="lcDate"
                      placeholder="LC Date"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      name="lastShipmentDate"
                      placeholder="Last Shipment Date"
                      type="date"
                      disabled={viewType === "view" || forDisable?.lastShipDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Expired Date</label>
                    <InputField
                      value={values?.lcExpiredDate}
                      name="lcExpiredDate"
                      placeholder="LC Expired Date"
                      type="date"
                      disabled={viewType === "view" || forDisable?.expireDate}
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
                      isDisabled={viewType === "view" || forDisable?.incotermId}
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
                        viewType === "view" || forDisable?.metarialTypeId
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
                      isDisabled={viewType === "view" || forDisable?.lctypeId}
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
                        if (valueOption) {
                          setFieldValue("bankName", valueOption);
                          getAccountDDL(
                            `/imp/ImportCommonDDL/GetBankAccountIdNameDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&BankId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("bankName", "");
                          setFieldValue("bankAccount", "");
                          setAccountDDL([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                      // isDisabled={viewType === "view" || forDisable?.bankId}
                      isDisabled={viewType === "view" || viewType === "edit"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.bankAccount}
                      options={bankAccountDDL || []}
                      name="bankAccount"
                      label="Bank Account"
                      placeholder="Bank Account"
                      onChange={(valueOption) => {
                        setFieldValue("bankAccount", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
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
                      isDisabled={
                        viewType === "view" || forDisable?.countryOfOriginId
                      }
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
                      disabled={viewType === "view"}
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
                        viewType === "view" || forDisable?.destinationPortId
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
                      onChange={(e) => {
                        if (e?.target?.value < 0) {
                          return toast.warn("Tolarance Must Be Positive");
                        } else {
                          setFieldValue("tolarance", e?.target?.value);
                        }
                      }}
                      disabled={viewType === "view" || forDisable?.tolerance}
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
                      isDisabled={true}
                    // isDisabled={viewType === "view" || forDisable?.currencyId}
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
                    <label>{`PI Amount (${values?.currency?.label})`}</label>
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
                      disabled={
                        viewType === "view" ||
                        viewType === "edit" ||
                        forDisable?.piAmountFC
                      }
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
                        viewType === "view" ||
                        viewType === "edit" ||
                        values?.currency?.label === "Taka"
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
                      type="number"
                      onChange={(e) => {
                        setFieldValue("PIAmountBDT", e.target.value);
                        // setFieldValue("lcMarginPercent", "");
                        setFieldValue("lcMarginValue", "");
                      }}
                      disabled={
                        viewType === "view" ||
                        viewType === "edit" ||
                        forDisable?.piAmountFC
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Tenor (Days)</label>
                    <InputField
                      value={values?.lcTenor}
                      name="lcTenor"
                      placeholder="LC Tenor"
                      type="number"
                      disabled={viewType === "view" || viewType === "edit"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>{`PG Amount (${values?.currency?.label})`}</label>
                    <InputField
                      value={values?.pgAmount}
                      name="pgAmount"
                      placeholder="PG Amount"
                      type="number"
                      disabled={viewType === "view" || viewType === "edit"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PG Due Date</label>
                    <InputField
                      value={values?.pgDueDate}
                      name="pgDueDate"
                      placeholder="PG Due Date"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Total Bank Charge(including VAT)</label>
                    <InputField
                      value={values?.totalBankCharge}
                      name="totalBankCharge"
                      placeholder="Total Bank Charge"
                      type="number"
                      disabled={viewType === "view" || viewType === "edit"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>VAT on Bank Charge</label>
                    <InputField
                      value={values?.vatOnCharge}
                      name="vatOnCharge"
                      placeholder="VAT on Bank Charge"
                      type="number"
                      disabled={viewType === "view" || viewType === "edit"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Due Date</label>
                    <InputField
                      value={values?.dueDate}
                      name="dueDate"
                      placeholder="Due Date"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div>
                  {/* <div
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
                        disabled={viewType === "view"}
                      />
                      Indemnity Bond
                    </label>
                  </div> */}
                  {/* <div
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
                        disabled={viewType === "view"}
                      />
                      Bond License
                    </label>
                  </div> */}

                  {/* <div className="col-lg-3 mt-2">
                    <label>Duration</label>
                    <InputField
                      value={values?.duration}
                      name="duration"
                      placeholder="Duration"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div> */}
                  {/* <div className="col-lg-3">
                    <label>LC Margin (%)</label>
                    <InputField
                      value={values?.lcMarginPercent}
                      name="lcMarginPercent"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        if (!values?.PIAmountBDT)
                          return toast.warn(
                            "Please input PI Amount (BDT) first"
                          );
                        if (e.target.value) {
                          setFieldValue("lcMarginPercent", e.target.value);
                          setFieldValue(
                            "lcMarginValue",
                            (+values?.PIAmountBDT || 0) *
                              ((+e.target.value || 0) / 100)
                          );
                        } else {
                          setFieldValue("lcMarginPercent", "");
                          setFieldValue("lcMarginValue", "");
                        }
                      }}
                      disabled={viewType === "view"}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="marginType"
                      options={marginTypeDDL}
                      value={values?.marginType}
                      label="Margin Type"
                      onChange={(valueOption) => {
                        setFieldValue("marginType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Margine Value</label>
                    <InputField
                      value={values?.lcMarginValue}
                      name="lcMarginValue"
                      type="number"
                    // disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Margine Due Date</label>
                    <InputField
                      value={values?.lcMarginDueDate}
                      name="lcMarginDueDate"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Interest Rate</label>
                    <InputField
                      value={values?.numInterestRate}
                      name="numInterestRate"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Description</label>
                    <InputField
                      value={values?.description}
                      name="description"
                      placeholder="Description"
                      type="text"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div
                    className="col-auto"
                    style={{ marginTop: "26px" }}
                  // marginLeft: "20px"
                  >
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        setIsShowModal(true);
                        getCalculationFormLandingForm(
                          selectedBusinessUnit?.value,
                          values,
                          setCalculationFormData,
                          setLoading
                        );
                      }}
                      disabled={
                        !values?.poId ||
                        !values?.lcTenor ||
                        !values?.exchangeRate
                      }
                    >
                      Calculation
                    </button>
                  </div>
                  {viewType !== "view" && (
                    <div className="col-lg-auto d-flex align-items-end">
                      <div style={{ marginTop: "14px", marginRight: "5px" }}>
                        <ButtonStyleOne
                          className="btn btn-primary"
                          type="button"
                          onClick={() => setOpen(true)}
                          label="Attachment"
                        />
                      </div>
                    </div>
                  )}
                  {values?.attachment ? (
                    <div
                      className="col-lg-2"
                      style={{ marginTop: "26px" }}
                    // marginLeft: "20px"
                    >
                      <button
                        className="btn btn-primary d-flex"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.attachment)
                          );
                        }}
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View
                      </button>
                    </div>
                  ) : (
                    viewType === "view" && <div className="col-lg-3"></div>
                  )}
                </div>
                {/* last div */}
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

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  empAttachment_action(fileObjects).then((data) => {
                    setUploadImage(data);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

              {/* modal  */}

              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
                modelSize="md"
                isModalFooterActive={false}
              >
                <CalculationForm
                  setIsShowModal={setIsShowModal}
                  initData={calculationFormData}
                  setLoading={setLoading}
                />
              </IViewModal>

              {/* modal  */}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
