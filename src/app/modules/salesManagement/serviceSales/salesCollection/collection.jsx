/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { getSBU } from "./helper";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  sbu: "",
  accountingJournalTypeId: { value: 4, label: "Bank Receipts " },
};

export default function CollectionModal({
  rowData,
  customerDetails,
  receivableAmount,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const history = useHistory();

  const [objProps, setObjprops] = useState({});
  const [paymentType, setPaymentType] = useState(1);
  const [sbuDDl, setSbuDDl] = useState([]);

  useEffect(() => {
    getSBU(profileData?.accountId, selectedBusinessUnit.value, setSbuDDl);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initData, sbu: sbuDDl[0] }}
      //   validationSchema={validationSchema}
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
          {false && <Loading />}
          <IForm
            title="Collection"
            getProps={setObjprops}
            isHiddenBack={true}
            isHiddenReset={true}
            isHiddenSave={true}
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/financials/bank/collection`,
                        state: {
                          selectedJournal: values.accountingJournalTypeId,
                          selectedSbu: values.sbu,
                          transactionDate: _todayDate(),
                          customerDetails: customerDetails,
                          receivableAmount: receivableAmount,
                        },
                      });
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row mt-5">
                <div className="col-lg-4">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 1}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(valueOption) => {
                        setPaymentType(1);
                      }}
                    />
                    Cash
                  </label>
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 2}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setPaymentType(2);
                      }}
                    />
                    Bank
                  </label>
                </div>
              </div>
              <div className="form-group  global-form row">
                {[2].includes(paymentType) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        options={sbuDDl}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="accountingJournalTypeId"
                        options={[
                          { value: 4, label: "Bank Receipts " },
                          //   { value: 5, label: "Bank Payments" },
                          //   { value: 6, label: "Bank Transfer" },
                        ]}
                        value={values?.accountingJournalTypeId}
                        label="Select Journal Type"
                        onChange={(valueOption) => {
                          setFieldValue("accountingJournalTypeId", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}
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
          </IForm>
        </>
      )}
    </Formik>
  );
}
