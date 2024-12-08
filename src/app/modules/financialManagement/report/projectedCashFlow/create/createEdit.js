import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
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
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [objProps, setObjprops] = useState({});

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

  const [, savePCFData, savePCFDataLoading] = useAxiosPost();

  useEffect(() => {
    // partner type
    getPartnerDataDDL(`/fino/AccountingConfig/GetAccTransectionTypeDDL`);
    // lc type
    getLCTypeDDL(`/imp/ImportCommonDDL/GetLCTypeDDL`);
    // sbu
    getSBUDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
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
    getPartnerDataDDLLoading;

  // handle view type radio change
  const handleViewTypeChange = (e, setFieldValue, resetForm) => {
    const value = e.target?.value;
    resetForm(initData);
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
    </div>
  );

  // ! SBUBankNameBankAccount Form Field
  const SBUBankNameBankAccountFormField = (obj) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
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
        <div className="col-lg-3">
          <label>PO/LC No</label>
          <SearchAsyncSelect
            selectedValue={values?.poLC}
            handleChange={(valueOption) => {
              setFieldValue("poLC", valueOption);
              fetchPOLCAndSetFormField({
                getPOLCNumberData,
                lcPoId: valueOption?.lcId,
                setValues,
                initData,
              });
            }}
            loadOptions={(v) =>
              fetchPOLCNumber({
                profileData,
                selectedBusinessUnit,
                v,
              })
            }
          />
        </div>

        {SBUBankNameBankAccountFormField({
          values,
          setFieldValue,
          errors,
          touched,
        })}

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
        {children && children}
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

  // ! Import Margin Form Field **
  const ImportMarginFormField = (obj) => {
    const { values, setFieldValue, errors, touched } = obj;

    return (
      <>
        <div className="col-lg-3">
          <InputField
            value={values?.beneficiary}
            label="Beneficiary"
            name="beneficiary"
            type="text"
            onChange={(e) => {
              setFieldValue("beneficiary", e.target.value);
            }}
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
            label="DOC Value"
            name="docValue"
            type="text"
            onChange={(e) => {
              setFieldValue("docValue", e.target.value);
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
              setFieldValue("exchangeRate", e.target.value);
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
        {SBUBankNameBankAccountFormField({
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

  // ! Current Data Table
  // const CurrentDataTable = () => (
  //   <div className="table-responsive">
  //     <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
  //       <thead>
  //         <tr>
  //           <th style={{ width: "30px" }}>SL</th>
  //           <th>Expense/Payment Name</th>
  //           <th>Amount</th>
  //           <th>Date</th>
  //           <th style={{ width: "50px" }}>Action</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {[]?.length > 0 &&
  //           [].map((item, index) => (
  //             <tr key={index}>
  //               <td>{index + 1}</td>
  //               <td>{item?.paymentName}</td>
  //               <td className="text-center">{item?.amount}</td>
  //               <td className="text-center">{_dateFormatter(item?.date)}</td>
  //               <td className="text-center">
  //                 <span onClick={() => {}}>
  //                   <IDelete />
  //                 </span>
  //               </td>
  //             </tr>
  //           ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );

  return (
    <IForm title="Create Projected Cash Flow" getProps={setObjprops}>
      {isLoading && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
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
            setValues,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="">
                  <div className="row form-group  global-form">
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
                  </div>

                  {/* Current Data Table */}
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
        <ProjectedCashFlowLanding />
      </>
    </IForm>
  );
}
