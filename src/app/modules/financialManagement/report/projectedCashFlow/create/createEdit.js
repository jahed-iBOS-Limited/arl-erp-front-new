import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import {
  fetchPOLCNumber,
  importPaymentType,
  initData
} from "./helper";

export default function ProjectedCashFlowCreateEdit() {
  // redux
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [objProps, setObjprops] = useState({});
  const [cashList, setCashList] = useState([]);
  const [viewType, setViewType] = useState(1);

  // api action
  const [
    polcNumberData,
    getPOLCNumberData,
    getPOLCNumberDataLoading,
  ] = useAxiosGet();

  const [shipmentDDL, getShipment] = useAxiosGet();
  const [previousList, getPreviousList, lodar] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const [, inactiveSave] = useAxiosPost();

  useEffect(() => {
    getPreviousList(
      `/fino/FundManagement/FundProjectedExpenseLanding?partName=FundProjectedExpenseForLastThirtyDays`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {};

  const handleViewTypeChange = (e, setFieldValue) => {
    const value = e.target?.value;
    setFieldValue("viewType", value);
  };

  // View Type Radio Field
  const ViewTypeRadioField = (values, setFieldValue) => (
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
          onChange={(e) => handleViewTypeChange(e, setFieldValue)}
        />
        Payment
      </label>
      <label>
        <Field
          type="radio"
          name="viewType"
          value="income"
          onChange={(e) => handleViewTypeChange(e, setFieldValue)}
        />
        Income
      </label>
      <label>
        <Field
          type="radio"
          name="viewType"
          value="import"
          onChange={(e) => handleViewTypeChange(e, setFieldValue)}
        />
        Import
      </label>
    </div>
  );

  return (
    <IForm title="Create Projected Cash Flow" getProps={setObjprops}>
      {lodar && <Loading />}
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
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}

                <pre>{JSON.stringify(values, null, 1)}</pre>
                <div className="">
                  <div className="row form-group  global-form">
                    {/* View Type */}
                    {ViewTypeRadioField(values, setFieldValue)}

                    {/* Import View Type Form Field */}
                    {values?.viewType === "import" ? (
                      <ImportCommonFormField
                        obj={{ values, setFieldValue, errors, touched }}
                        fetchData={{
                          getPOLCNumberData,
                          profileData,
                          selectedBusinessUnit,
                        }}
                      >
                        <>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.amount}
                              label="Amount"
                              name="amount"
                              type="number"
                              onChange={(e) => {
                                if (+e.target.value < 0) return;
                                setFieldValue("amount", e.target.value);
                              }}
                            />
                          </div>
                        </>
                      </ImportCommonFormField>
                    ) : null}
                  </div>

                  {/* Current Data Table */}
                  <div>{CurrentDataTable()}</div>

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
      </>
    </IForm>
  );
}

// ! Import Common Form Field
const ImportCommonFormField = ({ obj, children, fetchData }) => {
  const { values, setFieldValue, errors, touched } = obj;
  const { getPOLCNumberData, profileData, selectedBusinessUnit } = fetchData;

  return (
    <>
      <div className="col-lg-3">
        <label>PO/LC No</label>
        <SearchAsyncSelect
          selectedValue={values?.poLc}
          handleChange={(valueOption) => {
            setFieldValue("poLc", valueOption);
            // getShipment(
            //   `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${profileData?.accountId}&buId=${selectedBusinessUnit?.value}&searchTerm=${valueOption?.label}`
            // );

            setFieldValue("shipment", "");
          }}
          loadOptions={(value) => {
            fetchPOLCNumber({
              getPOLCNumberData,
              profileData,
              selectedBusinessUnit,
              value,
            });
          }}
          disabled={true}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="sbu"
          label="SBU"
          options={[]}
          value={values?.sbu}
          onChange={(valueOption) => {
            setFieldValue("sbu", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="bankName"
          label="Bank Name"
          options={[]}
          value={values?.bankName}
          onChange={(valueOption) => {
            setFieldValue("bankName", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="bankAccount"
          label="Bank Account"
          options={[]}
          value={values?.bankAccount}
          onChange={(valueOption) => {
            setFieldValue("bankAccount", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
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

      {children &&
        (() => {
          switch (values?.paymentType?.value) {
            case "Duty":
              return ImportDutyFormField();
            case "At sight payment":
              return ImportAtSightPaymentFormField();
            case "Margin":
              return ImportMarginFormField();
            default:
              return null;
          }
        })()}

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

// ! Import Margin Form Field
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
          options={[]}
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

// ! Import Duty Form Field
const ImportDutyFormField = (obj) => {
  const { values, setFieldValue, errors, touched } = obj;

  return <></>;
};

// ! Import At Sight Payment Form Field
const ImportAtSightPaymentFormField = (obj) => {
  const { values, setFieldValue, errors, touched } = obj;

  return (
    <>
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
        <NewSelect
          name="marginType"
          label="Margin Type"
          options={[]}
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
          value={values?.docValue}
          label="DOC Value"
          name="docValue"
          type="text"
          onChange={(e) => {
            setFieldValue("docValue", e.target.value);
          }}
        />
      </div>
    </>
  );
};

// ! Current Data Table
const CurrentDataTable = () => (
  <div className="table-responsive">
    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
      <thead>
        <tr>
          <th style={{ width: "30px" }}>SL</th>
          <th>Expense/Payment Name</th>
          <th>Amount</th>
          <th>Date</th>
          <th style={{ width: "50px" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {[]?.length > 0 &&
          [].map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.paymentName}</td>
              <td className="text-center">{item?.amount}</td>
              <td className="text-center">{_dateFormatter(item?.date)}</td>
              <td className="text-center">
                <span onClick={() => {}}>
                  <IDelete />
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
