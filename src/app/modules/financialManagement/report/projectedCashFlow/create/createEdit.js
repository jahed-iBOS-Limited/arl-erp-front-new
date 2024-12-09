import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import {
  fetchBankAccountDDL,
  fetchBankNameDDL,
  fetchPCFLandingData,
  fetchPOLCAndSetFormField,
  fetchPOLCNumber,
  fetchTransactionList,
  generateSavePayloadAndURL,
  generateSaveURL,
  importPaymentType,
  initData,
  marginTypeDDL,
} from "./helper";
import ProjectedCashFlowLanding from "./landing";

export default function ProjectedCashFlowCreateEdit() {
  // redux
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [objProps, setObjprops] = useState({});
  const formikRef = useRef(null);

  // api action
  const [, getPOLCNumberData, getPOLCNumberDataLoading] = useAxiosGet();

  const [
    partnerDataDDL,
    getPartnerDataDDL,
    getPartnerDataDDLLoading,
  ] = useAxiosGet();
  const [
    bankAccountDDL,
    getBankAccountDDL,
    getBankAccountDDLLoading,
  ] = useAxiosGet();
  const [bankNameDDL, getBankNameDDL, getBankNameDDLLoading] = useAxiosGet();
  const [lcTypeDDL, getLCTypeDDL, getLCTypeDDLLoading] = useAxiosGet();
  const [sbuDDL, getSBUDDL, getSBUDDLLoading] = useAxiosGet();
  // api action
  const [
    pcfLandingData,
    getPCFLandingData,
    getPCFLandingDataLaoding,
    setPCFLandingData,
  ] = useAxiosGet();

  const [, savePCFData, savePCFDataLoading] = useAxiosPost();

  useEffect(() => {
    // partner type
    getPartnerDataDDL(`/fino/AccountingConfig/GetAccTransectionTypeDDL`);
    // lc type
    getLCTypeDDL(`/imp/ImportCommonDDL/GetLCTypeDDL`);
    // sbu
    getSBUDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`,
      (res) => {
        // set default value with formik ref (filter to akij cement)
        const akijCement = res?.filter((item) => item?.value === 4)[0];
        formikRef.current.setFieldValue("sbu", akijCement || "");

        // load landing data
        if (res?.length > 0) {
          fetchPCFLandingData({
            values: {
              ...initData,
              sbu: akijCement,
            },
            getPCFLandingData,
          });
        }
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create edit save handler
  const saveHandler = (values, cb) => {
    const URL = `${generateSaveURL(values?.viewType)}&autoId=0`;
    const payload = generateSavePayloadAndURL({ values, profileData });
    savePCFData(URL, payload, cb, true);
  };

  // is loadingd
  const isLoading =
    getPOLCNumberDataLoading ||
    savePCFDataLoading ||
    getBankNameDDLLoading ||
    getSBUDDLLoading ||
    getLCTypeDDLLoading ||
    getBankAccountDDLLoading ||
    getPartnerDataDDLLoading ||
    getPCFLandingDataLaoding;

  // handle view type radio change
  const handleViewTypeChange = (e, setFieldValue, resetForm) => {
    const value = e.target?.value;
    resetForm(initData);
    setPCFLandingData([]);
    setFieldValue("viewType", value);
  };

  // ! View Type Radio Field
  const ViewTypeRadioField = (values, setFieldValue, resetForm) => (
    <div
      className="col-lg-12 d-flex"
      style={{ columnGap: "10px" }}
      role="group"
      aria-labelledby="my-radio-group"
    >
      <label>
        <Field
          type="radio"
          name="viewType"
          value="payment"
          onChange={(e) => handleViewTypeChange(e, setFieldValue, resetForm)}
        />
        Payment
      </label>
      <label>
        <Field
          type="radio"
          name="viewType"
          value="income"
          onChange={(e) => handleViewTypeChange(e, setFieldValue, resetForm)}
        />
        Income
      </label>
      <label>
        <Field
          type="radio"
          name="viewType"
          value="import"
          onChange={(e) => handleViewTypeChange(e, setFieldValue, resetForm)}
        />
        Import
      </label>
      <label>
        <Field
          type="radio"
          name="viewType"
          value="customer received"
          onChange={(e) => handleViewTypeChange(e, setFieldValue, resetForm)}
        />
        Customer Received
      </label>
    </div>
  );

  // ! SBU Form Field
  const SBUFormField = ({ obj }) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <div className="col-lg-3">
        <NewSelect
          name="sbu"
          label="SBU"
          options={sbuDDL || []}
          value={values?.sbu}
          onChange={(valueOption) => {
            setFieldValue("sbu", valueOption);
            setFieldValue("bankName", "");
            setFieldValue("bankAccount", "");
            fetchBankNameDDL({
              getBankNameDDL,
              profileData,
              buUnId: valueOption?.value,
            });
          }}
          errors={errors}
          touched={touched}
        />
      </div>
    );
  };

  // ! SBUBankNameBankAccount Form Field
  const BankNameBankAccountFormField = (obj) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
        <div className="col-lg-3">
          <NewSelect
            name="bankName"
            label="Bank Name"
            options={bankNameDDL || []}
            value={values?.bankName}
            onChange={(valueOption) => {
              setFieldValue("bankName", valueOption);
              setFieldValue("bankAccount", "");
              fetchBankAccountDDL({
                getBankAccountDDL,
                profileData,
                values,
                bankId: valueOption?.value,
              });
            }}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="bankAccount"
            label="Bank Account"
            options={bankAccountDDL || []}
            value={values?.bankAccount}
            onChange={(valueOption) => {
              setFieldValue("bankAccount", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      </>
    );
  };

  // ! AmountPaymentDateRemarksFormField
  const AmountPaymentDateRemarksFormField = ({ obj }) => {
    const { values, setFieldValue } = obj;

    return (
      <>
        <div className="col-lg-3">
          <InputField
            value={values?.amount}
            label="Amount"
            name="amount"
            type="number"
            onChange={(e) => {
              setFieldValue("amount", e.target.value);
            }}
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.paymentDate}
            label="Payment Date"
            name="paymentDate"
            type="date"
            onChange={(e) => {
              setFieldValue("paymentDate", e.target.value);
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
      </>
    );
  };

  // ! Import Common Form Field
  const ImportCommonFormField = ({ obj, children }) => {
    const {
      values,
      setFieldValue,
      errors,
      touched,
      setValues,
      getPOLCNumberData,
    } = obj;

    return (
      <>
        <SBUFormField obj={{ values, setFieldValue, errors, touched }} />

        <div className="col-lg-3">
          <NewSelect
            name="paymentType"
            label="Payment Type"
            options={importPaymentType}
            value={values?.paymentType}
            onChange={(valueOption) => {
              setFieldValue("paymentType", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-3">
          <label>PO/LC No</label>
          <SearchAsyncSelect
            selectedValue={values?.poLC}
            handleChange={(valueOption) => {
              setFieldValue("poLC", valueOption);
              setPCFLandingData([]);
              fetchPOLCAndSetFormField({
                getPOLCNumberData,
                lcPoId: valueOption?.lcId,
                setValues,
                values,
              });
            }}
            loadOptions={(v) =>
              fetchPOLCNumber({
                profileData,
                buUnId: values?.sbu?.value,
                v,
              })
            }
          />
        </div>

        {BankNameBankAccountFormField({
          values,
          setFieldValue,
          errors,
          touched,
        })}

        {children && children}

        <AmountPaymentDateRemarksFormField
          obj={{ values, setFieldValue, errors, touched }}
        />
      </>
    );
  };

  // ! Import Margin Form Field **
  const ImportMarginFormField = (obj) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
        <div className="col-lg-3">
          <NewSelect
            name="beneficiary"
            label="Beneficiary"
            options={[]}
            value={values?.beneficiary}
            onChange={(valueOption) => {
              setFieldValue("beneficiary", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.poValue}
            label="PO Value"
            name="poValue"
            type="text"
            onChange={(e) => {
              setFieldValue("poValue", e.target.value);
            }}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="marginType"
            label="Margin Type"
            options={marginTypeDDL}
            value={values?.marginType}
            onChange={(valueOption) => {
              setFieldValue("marginType", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      </>
    );
  };

  // ! Import At Sight Payment Form Field **
  const ImportAtSightPaymentFormField = (obj) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
        <div className="col-lg-3">
          <NewSelect
            name="lcType"
            label="LC Type"
            options={lcTypeDDL || []}
            value={values?.lcType}
            onChange={(valueOption) => {
              setFieldValue("lcType", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="marginType"
            label="Margin Type"
            options={marginTypeDDL}
            value={values?.marginType}
            onChange={(valueOption) => {
              setFieldValue("marginType", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.margin}
            label="(-) Margin %"
            name="margin"
            type="text"
            onChange={(e) => {
              setFieldValue("margin", e.target.value);
            }}
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.docValue}
            label="Doc Value(FC)"
            name="docValue"
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              setFieldValue("docValue", value);
              setFieldValue("amount", value * values?.exchangeRate);
            }}
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.exchangeRate}
            label="Exchange rate"
            name="exchangeRate"
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              setFieldValue("exchangeRate", value);
              setFieldValue("amount", value * values?.docValue);
            }}
          />
        </div>
      </>
    );
  };

  // ! Payment & Income Form Field
  const PaymentAndIncomeFormField = ({ obj }) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
        <SBUFormField obj={{ values, setFieldValue, errors, touched }} />

        {BankNameBankAccountFormField({
          values,
          setFieldValue,
          errors,
          touched,
        })}

        <div className="col-lg-3">
          <NewSelect
            name="partnerType"
            label="Partner Type"
            options={partnerDataDDL || []}
            value={values?.partnerType}
            onChange={(valueOption) => {
              setFieldValue("partnerType", valueOption);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Transaction</label>
          <SearchAsyncSelect
            selectedValue={values?.transaction}
            handleChange={(valueOption) => {
              setFieldValue("transaction", valueOption);
            }}
            loadOptions={(v) =>
              fetchTransactionList({
                profileData,
                v,
                values,
              })
            }
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.amount}
            label="Amount"
            name="amount"
            type="number"
            onChange={(e) => {
              setFieldValue("amount", e.target.value);
            }}
          />
        </div>
        <div className="col-lg-3">
          <InputField
            value={values?.dueDate}
            label="Due Date"
            name="dueDate"
            type="date"
            onChange={(e) => {
              setFieldValue("dueDate", e.target.value);
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
      </>
    );
  };

  // ! Customer Received Form Field
  const CustomerReceivedFormField = ({ obj }) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
        <SBUFormField obj={{ values, setFieldValue, errors, touched }} />
        <AmountPaymentDateRemarksFormField
          obj={{ values, setFieldValue, errors, touched }}
        />
      </>
    );
  };

  // ! Render Payment Type Form Field in Children
  const RenderPaymentTypeFormFields = (obj) => {
    const { values, setFieldValue, errors, touched } = obj;

    switch (values?.paymentType?.value) {
      case "Duty":
        return null; // all common are enough for this type
      case "At sight payment":
        return ImportAtSightPaymentFormField({
          values,
          setFieldValue,
          errors,
          touched,
        });
      case "Margin":
        return ImportMarginFormField({
          values,
          setFieldValue,
          errors,
          touched,
        });
      default:
        return null;
    }
  };

  return (
    <IForm title="Create Projected Cash Flow" getProps={setObjprops}>
      {isLoading && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setFieldValue("viewType", values?.viewType);
              fetchPCFLandingData({ values, getPCFLandingData });
            });
          }}
          innerRef={formikRef}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
            setValues,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="">
                  <div className="row form-group global-form">
                    {/* View Type */}
                    {ViewTypeRadioField(values, setFieldValue, resetForm)}

                    {/* Import View Type Form Field */}
                    {values?.viewType === "import" ? (
                      <ImportCommonFormField
                        obj={{
                          values,
                          setFieldValue,
                          errors,
                          touched,
                          setValues,
                          getPOLCNumberData,
                        }}
                      >
                        {RenderPaymentTypeFormFields({
                          values,
                          setFieldValue,
                          errors,
                          touched,
                        })}
                      </ImportCommonFormField>
                    ) : null}

                    {/* Income & Payment View Type Form Field */}
                    {(values?.viewType === "income" ||
                      values?.viewType === "payment") && (
                      <PaymentAndIncomeFormField
                        obj={{
                          values,
                          setFieldValue,
                          errors,
                          touched,
                        }}
                      />
                    )}

                    {/* Customer Received View Type Form Field */}
                    {values?.viewType === "customer received" && (
                      <CustomerReceivedFormField
                        obj={{
                          values,
                          setFieldValue,
                          errors,
                          touched,
                        }}
                      />
                    )}
                  </div>

                  {/* Current Data Table */}
                  <ProjectedCashFlowLanding
                    obj={{
                      setFieldValue,
                      values,
                      errors,
                      touched,
                      pcfLandingData,
                      getPCFLandingData,
                    }}
                  />
                  {/* <div>{CurrentDataTable()}</div> */}

                  {/* Landing Table */}
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
            </>
          )}
        </Formik>

        {/* Landing Table */}
        {/* <ProjectedCashFlowLanding /> */}
      </>
    </IForm>
  );
}
