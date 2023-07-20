import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getItemRequestGridData } from "../helper";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import ReceivableDueReportTable from "./receivableDueReportTable";
const initialValues = {
  reportType: { value: 0, label: "Receivable Due Report" },
  dueDate: _todayDate(),
  transactionDate: _todayDate(),
};
export function TableRow(props) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);
  // from date state
  // const [transactionDate, setTransactionDate] = useState(_todayDate());
  // // to date state
  // const [dueDate, setDueDate] = useState(_todayDate());
  const [loading, setLoading] = useState(false);
  //Get Api Data
  useEffect(() => {
    getItemRequestGridData(
      profileData.accountId,
      selectedBusinessUnit.value,
      initialValues?.transactionDate,
      initialValues?.dueDate,
      setGridData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className='form form-label-right'>
            <ICustomCard title='Recivable Due Report'>
              <div className='row my-3 global-form'>
                <div className='col-lg-2'>
                  <NewSelect
                    name='reportType'
                    options={[
                      { value: 0, label: "Receivable Due Report" },
                      { value: 1, label: "Day Base Collection" },
                      { value: 2, label: "Month Basis" },
                    ]}
                    value={values?.reportType}
                    label='Report Type'
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                    }}
                    placeholder='Report Type'
                    errors={errors}
                    touched={touched}
                    isClearable={false}
                  />
                </div>
                {/* if Receivable Due Report */}
                {[0].includes(values?.reportType?.value) && (
                  <>
                    <div className='col-lg-2'>
                      <div className='form-group'>
                        <label>Transaction Date</label>
                        <InputField
                          className='trans-date cj-landing-date'
                          onChange={(e) => {
                            setFieldValue("transactionDate", e.target.value);
                          }}
                          type='date'
                          value={values?.transactionDate || ""}
                          name='transactionDate'
                        />
                      </div>
                    </div>
                    <div className='col-lg-2'>
                      <div className='form-group'>
                        <label>Due Date</label>
                        <InputField
                          className='trans-date cj-landing-date'
                          onChange={(e) => {
                            setFieldValue("dueDate", e.target.value);
                          }}
                          type='date'
                          value={values?.dueDate || ""}
                          name='dueDate'
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className='col-lg-2 mt-5'>
                  <button
                    className='btn btn-primary'
                    type='button'
                    disabled={
                      !values?.reportType?.value ||
                      [0].includes(values?.reportType?.value)
                        ? !values?.dueDate || !values?.transactionDate
                        : false
                    }
                    onClick={() => {
                      // Receivable Due Report
                      if (values?.reportType?.value === 0) {
                        getItemRequestGridData(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          values?.transactionDate,
                          values?.dueDate,
                          setGridData,
                          setLoading
                        );
                      }
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              {loading && <Loading />}
              {[0].includes(values?.reportType?.value) && (
                <>
                  <ReceivableDueReportTable gridData={gridData} />
                </>
              )}
            </ICustomCard>
          </Form>
        )}
      </Formik>
    </>
  );
}
