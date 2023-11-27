import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import TdsVdsJvDataTable from "./components/dataTable";

// Validation schema
const validationSchema = Yup.object().shape({
  sbuUnit: Yup.object().shape({
    label: Yup.string().required("Sbu is required"),
    value: Yup.string().required("Sbu is required"),
  }),
  billType: Yup.object().shape({
    label: Yup.string().required("Bill Type is required"),
    value: Yup.string().required("Bill Type is required"),
  }),
  cashGl: Yup.string().when("type", {
    is: (status) => status === "Cash",
    then: Yup.string()
      .required("Cash is required")
      .typeError("Cash is required"),
  }),
  accountNo: Yup.string().when("type", {
    is: (status) => status === "Online",
    then: Yup.string()
      .required("Account No is required")
      .typeError("Account No required"),
  }),
  payDate: Yup.date().required("Pay Date is required"),
});

const initData = {
  fromDate: _todayDate(),
  accountNo: "",
  status: "",
  billType: "",
  toDate: _todayDate(),
};

export default function _Form({ saveHandler, bankDDL}) {
  //to manage prepare all voucher button
  const [, setIsAble] = useState(""); 

  const [accountNoDDL, getAccountNoDDL, isAcconutNoDDLLoading] =  useAxiosGet();
  const [billTypeDDL, getBillTypeDDL, isBillTypeDDLLoading, setBillTypeDDL] = useAxiosGet();

  console.log({billTypeDDL})

    // get user profile data from store
    const {profileData, selectedBusinessUnit} = useSelector((state) => state.authData, shallowEqual);


  //Load ddsl
  useEffect(()=>{
    let accId = profileData?.accountId;
    let buId = selectedBusinessUnit?.value
    // fetch account No DDL 
    getAccountNoDDL( `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`, data => console.log({ddL:data}));

    //fetch bill type DDL
    getBillTypeDDL(`/fino/FinanceCommonDDL/GetBillTypeDDL`, data => {
      const firstTwo = data.slice(0, 2);
      console.log({firstTwo})
      setBillTypeDDL(firstTwo);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // console.log("Test handler")
          saveHandler(values, () => {
            // resetForm(initData);
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
          { (isAcconutNoDDLLoading || isBillTypeDDLLoading) && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="accountNo"
                      options={accountNoDDL ?? []}
                      value={values?.accountNo}
                      placeholder="Account No"
                      label="Account No(Online)"
                      onChange={(valueOption) => {
                        setFieldValue("accountNo", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 1, label: "Pending" },
                        { value: 2, label: "Complete" },
                      ]}
                        value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="billType"
                      options={billTypeDDL || []}
                        value={values?.billType}
                      label="Bill Type"
                      onChange={(valueOption) => {
                        setFieldValue("billType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                        value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                        value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "22px" }} className="col-lg-1">
                    <button
                      className="btn btn-primary"
                      disabled={!values?.billType}
                      type="button"
                    >
                      Show
                    </button>
                  </div>
                  <div
                    style={{ marginTop: "22px", marginLeft: "6px" }}
                    className="col-lg-2"
                  >
                    <button
                      style={{ display: "none" }}
                      className="btn btn-primary"
                      disabled={
                        !values?.sbuUnit
                        //||
                        // !values?.adviceBank ||
                        // !values?.accountNo
                      }
                      type="submit"
                      onSubmit={() => {
                        saveHandler(values, () => {
                          resetForm(initData); 
                        });
                      }}
                    >
                      Prepare Voucher
                    </button>
                  </div>
                </div>
              </div>

              {/* Data table */}


              <button
                type="submit"
                style={{ display: "none" }}
                // ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                // ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
                // onClick={() => setRowDto([])}
              ></button>
            </Form>
            <TdsVdsJvDataTable setFieldValue={setFieldValue} values={values} errors={errors} touched={touched}/>
          </>
        )}
      </Formik>
    </>
  );
}
