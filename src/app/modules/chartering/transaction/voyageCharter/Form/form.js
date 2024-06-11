import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useLocation, useParams } from "react-router-dom";
import TextArea from "../../../../_helper/TextArea";
import { getChartererByVoyageId, getVoyageDDLNew } from "../../../helper";
import { getCargoDDLbyChartererIdForInvoice } from "../../../voyage/shipper/helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { getSalesOrgList } from "../../timeCharter/helper";
import {
  createJournalForVoyageCharter,
  getAccDDL,
  getIntermidiateInvoiceData,
  getInvoiceData,
  getVoyageChartererTransactionById,
  validationSchema,
  voyageCharterBRApi,
} from "../helper";
import FinalInvoice from "../invoice/finalInvoice/finalInvoice";
import FinalInvoiceCharterer from "../invoice/finalInvoice/finalInvoiceCharterer";
import InitialInvoice from "../invoice/initialInvoice/initialInvoice";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  setLoading,
  beneficiaryDDL,
  sbuList,
}) {
  const history = useHistory();
  const { id } = useParams();
  const { state: preData } = useLocation();
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [chartererDDL, setChartererDDL] = useState([]);
  const [cargoDDL, setCargoDDL] = useState([]);
  const [salesOrgList, setSalesOrgList] = useState([]);
  const [accNoDDL, setAccNoDDL] = useState([]);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [invoiceHireData, setInvoiceHireData] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (preData?.voyageNo) {
      getChartererByVoyageId(
        preData?.voyageNo?.value,
        setChartererDDL,
        setLoading
      );
    }
    if (id) {
      getVoyageChartererTransactionById(
        id,
        setLoading,
        setRowData,
        setInvoiceHireData
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getAccDDL(profileData?.accountId, selectedBusinessUnit?.value, setAccNoDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values, rowData, invoiceHireData }, () => {
            resetForm(initData);
            setRowData([]);
            setInvoiceHireData([]);
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
          setErrors,
          setTouched,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (preData?.vesselName?.label) {
                        history.push("/");
                      } else {
                        history.goBack();
                      }
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info px-3 py-2 reset-btn ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && !invoiceHireData?.freightInvoiceId ? (
                    <button
                      type="submit"
                      className={"btn btn-primary px-3 py-2 ml-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", "");
                        setFieldValue("statement", "");
                        setFieldValue("charterer", "");
                        setFieldValue("hireTypeName", "");
                        setFieldValue("beneficiary", {
                          value: valueOption?.ownerId,
                          label: valueOption?.ownerName,
                        });
                        setFieldValue("vesselName", valueOption);
                        getVoyageDDLNew({
                          accId: profileData?.accountId,
                          buId: selectedBusinessUnit?.value,
                          id: valueOption?.value,
                          setter: setVoyageNoDDL,
                          setLoading: setLoading,
                          hireType: 0,
                          isComplete: 2,
                          voyageTypeId: 2,
                        });
                      }}
                      isDisabled={viewType || preData?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("hireTypeName", "");
                        setFieldValue("charterer", "");
                        setFieldValue("statement", "");
                        setFieldValue("hireTypeName", {
                          value: valueOption?.hireTypeId,
                          label: valueOption?.hireTypeName,
                        });
                        setFieldValue("voyageNo", valueOption);
                        getChartererByVoyageId(
                          valueOption?.value,
                          setChartererDDL,
                          setLoading
                        );
                      }}
                      isDisabled={
                        viewType || !values?.vesselName || preData?.voyageNo
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.charterer || ""}
                      isSearchable={true}
                      options={chartererDDL || []}
                      styles={customStyles}
                      name="charterer"
                      placeholder="Charterer"
                      label="Charterer"
                      onChange={(valueOption) => {
                        setRowData([]);
                        setInvoiceHireData([]);
                        setFieldValue("statement", "");
                        setFieldValue("cargo", "");

                        if (values?.voyageNo?.value && valueOption?.value) {
                          getCargoDDLbyChartererIdForInvoice(
                            values?.voyageNo?.value,
                            valueOption?.value,
                            setCargoDDL
                          );
                        }

                        setFieldValue("charterer", valueOption);
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.cargo || ""}
                      isSearchable={true}
                      options={cargoDDL || []}
                      styles={customStyles}
                      name="cargo"
                      placeholder="Cargo"
                      label="Cargo"
                      onChange={(valueOption) => {
                        setRowData([]);
                        setInvoiceHireData([]);
                        setFieldValue("cargo", valueOption);
                        setFieldValue("statement", "");
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {values?.hireTypeName?.value ? (
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.hireTypeName || ""}
                        isSearchable={true}
                        options={[]}
                        styles={customStyles}
                        name="hireTypeName"
                        placeholder="Ship Type"
                        label="Ship Type"
                        onChange={(valueOption) => {
                          setFieldValue("hireTypeName", valueOption);
                        }}
                        isDisabled={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.statement || ""}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "Initial Invoice" },
                        // { value: 3, label: "Intermidiate Invoice" },
                        { value: 2, label: "Final Invoice" },
                      ]}
                      styles={customStyles}
                      name="statement"
                      placeholder="Invoice"
                      label="Invoice"
                      onChange={async (valueOption) => {
                        const {
                          cargo,
                          charterer,
                          vesselName,
                          voyageNo,
                        } = values;

                        setFieldValue("statement", valueOption);
                        setRowData([]);

                        if (valueOption?.value === 3) {
                          getIntermidiateInvoiceData(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            vesselName?.value,
                            voyageNo?.value,
                            valueOption?.value,
                            charterer?.value,
                            setLoading,
                            setRowData,
                            setInvoiceHireData
                          );
                        } else {
                          if (
                            voyageNo?.value &&
                            charterer?.value &&
                            vesselName?.value &&
                            cargo?.value
                          ) {
                            getInvoiceData(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              vesselName?.value,
                              voyageNo?.value,
                              valueOption?.value,
                              charterer?.value,
                              setLoading,
                              setRowData,
                              setInvoiceHireData,
                              cargo?.value
                            );
                          }
                        }
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Date</label>
                    <FormikInput
                      value={values?.invoiceDate}
                      name="invoiceDate"
                      placeholder="Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  {invoiceHireData?.objHeaderDTO?.freightInvoiceId === 0 ||
                  invoiceHireData?.freightInvoiceId === 0 ? (
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.beneficiary || ""}
                        isSearchable={true}
                        options={beneficiaryDDL}
                        styles={customStyles}
                        name="beneficiary"
                        placeholder="Beneficiary Name"
                        label="Beneficiary Name"
                        onChange={(valueOption) => {
                          setFieldValue("beneficiary", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  <div className="col-12"></div>
                </div>
              </div>
              {values?.statement &&
              // invoiceHireData?.objHeaderDTO?.freightInvoiceId
              invoiceHireData?.freightInvoiceId &&
              !viewType ? (
                <>
                  <div className="marine-form-card-content">
                    <h5>Journal</h5>
                    <div className="row">
                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.sbu || ""}
                          isSearchable={true}
                          options={sbuList || []}
                          styles={customStyles}
                          name="sbu"
                          placeholder="SBU"
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                            setFieldValue("salesOrg", "");
                            if (valueOption) {
                              getSalesOrgList(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                setSalesOrgList,
                                setLoading
                              );
                            }
                          }}
                          // isDisabled={viewType || preData?.vesselName}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.salesOrg || ""}
                          isSearchable={true}
                          options={salesOrgList || []}
                          styles={customStyles}
                          name="salesOrg"
                          placeholder="Sales Organization"
                          label="Sales Organization"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrg", valueOption);
                          }}
                          isDisabled={!values?.sbu}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Journal Date</label>
                        <FormikInput
                          value={values?.journalDate}
                          name="journalDate"
                          placeholder="Journal Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label>Narration</label>
                        <TextArea
                          value={values?.narration}
                          name="narration"
                          placeholder="Narration"
                          rows="3"
                          onChange={(e) =>
                            setFieldValue("narration", e.target.value)
                          }
                          max={1000}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col text-right">
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2 mt-5"
                          onClick={() => {
                            if (
                              !values?.sbu ||
                              !values?.salesOrg ||
                              !values?.narration ||
                              !values?.journalDate
                            ) {
                              setTouched({
                                sbu: true,
                                salesOrg: true,
                                narration: true,
                                journalDate: true,
                              });
                              window.setTimeout(() => {
                                setErrors({
                                  sbu: !values?.sbu && "SBU is required",
                                  salesOrg:
                                    !values?.salesOrg &&
                                    "Sales Organization is required",
                                  narration:
                                    !values?.narration &&
                                    "Narration is required",
                                  journalDate:
                                    !values?.journalDate &&
                                    "Journal Date is required",
                                });
                              }, 50);
                            } else {
                              createJournalForVoyageCharter(
                                profileData,
                                selectedBusinessUnit,
                                values,
                                invoiceHireData?.freightInvoiceId,
                                invoiceHireData?.totalNetPayble,
                                setLoading,
                                () => {
                                  setFieldValue("sbu", "");
                                  setFieldValue("salesOrg", "");
                                  setFieldValue("narration", "");
                                }
                              );
                            }
                          }}
                        >
                          Create Journal
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="marine-form-card-content">
                    <h5>Receive</h5>
                    <div className="row">
                      <>
                        <div className="col-lg-3">
                          <label>Receive Amount</label>
                          <FormikInput
                            value={values?.receiveAmount || ""}
                            name="receiveAmount"
                            placeholder="Receive Amount"
                            type="number"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <FormikSelect
                            value={values?.bankAccNo || ""}
                            isSearchable={true}
                            options={accNoDDL || []}
                            styles={customStyles}
                            name="bankAccNo"
                            placeholder="Bank Account No"
                            label="Bank Account No"
                            onChange={(valueOption) => {
                              setFieldValue("bankAccNo", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={viewType}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Receive Date</label>
                          <FormikInput
                            value={values?.receivedDate || ""}
                            name="receivedDate"
                            placeholder="Receive Date"
                            type="date"
                            errors={errors}
                            touched={touched}
                            disabled={viewType === "view"}
                          />
                        </div>
                        <div className="col-lg-3 mt-5">
                          <button
                            onClick={() => {
                              const payload = {
                                transactionId: +invoiceHireData?.freightInvoiceId || 0,
                                unitId: selectedBusinessUnit?.value,
                                accountId: profileData?.accountId,
                                charterId: values?.charterer?.value,
                                receiveAmount: +values?.receiveAmount || 0,
                                bankAccountId: +values?.bankAccNo?.value || 0,
                                receiveDate: values?.receivedDate || new Date(),
                              };
                              voyageCharterBRApi(payload, setLoading, () => {
                                setFieldValue("receiveAmount", "");
                                setFieldValue("bankAccNo", "");
                                setFieldValue("receivedDate", '');
                              });
                            }}
                            type={"button"}
                            className="btn btn-primary px-3 py-2"
                            disabled={
                              !values?.receiveAmount ||
                              !values?.receivedDate ||
                              !values?.bankAccNo
                            }
                          >
                            Receive
                          </button>
                        </div>
                      </>
                    </div>
                  </div>
                </>
              ) : null}
              {/* Hire Type 1 For Onwner */}
              {values?.hireTypeName?.value === 1 ? (
                <>
                  {values?.statement?.value === 1 ? (
                    <>
                      <InitialInvoice
                        formikprops={{
                          handleSubmit,
                          resetForm,
                          values,
                          errors,
                          touched,
                          setFieldValue,
                          isValid,
                        }}
                        invoiceHireData={invoiceHireData}
                        rowData={rowData}
                        setRowData={setRowData}
                      />
                    </>
                  ) : null}

                  {values?.statement?.value === 2 ||
                  values?.statement?.value === 3 ? (
                    <FinalInvoice
                      formikprops={{
                        handleSubmit,
                        resetForm,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                      }}
                      invoiceHireData={invoiceHireData}
                      rowData={rowData}
                      setRowData={setRowData}
                    />
                  ) : null}
                </>
              ) : null}

              {/* Hireype 2 For Charterer */}
              {values?.hireTypeName?.value === 2 ? (
                <>
                  {/* Initial Invoice Charterer */}
                  {values?.statement?.value === 1 ? (
                    <>
                      <InitialInvoice
                        formikprops={{
                          handleSubmit,
                          resetForm,
                          values,
                          errors,
                          touched,
                          setFieldValue,
                          isValid,
                        }}
                        invoiceHireData={invoiceHireData}
                        rowData={rowData}
                        setRowData={setRowData}
                      />
                    </>
                  ) : null}

                  {values?.statement?.value === 2 ||
                  values?.statement?.value === 3 ? (
                    <FinalInvoiceCharterer
                      formikprops={{
                        handleSubmit,
                        resetForm,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                      }}
                      invoiceHireData={invoiceHireData}
                      rowData={rowData}
                      setRowData={setRowData}
                    />
                  ) : null}
                </>
              ) : null}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
