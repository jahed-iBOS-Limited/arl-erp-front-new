/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";

// import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../../_helper/_todayDate";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  validationSchema,
}) {
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
            {/* {console.log(values)} */}
            <Form className='form form-label-right'>
              <div className='global-form'>
                <div className='row'>
                  <div className='col-lg-3'>
                    <label>PG Due Date</label>
                    <InputField
                      value={values?.pgDueDate}
                      name='pgDueDate'
                      placeholder='PG Due Date'
                      type='date'
                      disabled
                      // disabled={viewType === "view"}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>PG Amount (FC)</label>
                    <InputField
                      value={values?.pgAmount}
                      // value={numberWithCommas(values?.pgAmount)}
                      name='pgAmount'
                      placeholder='PG Amount'
                      type='number'
                      onChange={(e) => {
                        setFieldValue("pgAmount", e.target.value);
                        setFieldValue("pgAmountBDT",values?.exchangeRate * e.target.value);
                      }}
                      // disabled
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>Payment Date</label>
                    <InputField
                      value={values?.paymentDate}
                      name='paymentDate'
                      placeholder='Payment Date'
                      type='date'
                      min={_todayDate()}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>Exchange Rate</label>
                    <InputField
                      value={values?.exchangeRate}
                      name='exchangeRate'
                      placeholder='Exchange Rate'
                      type='number'
                      onChange={(e) => {
                        setFieldValue(
                          "exchangeRate",
                          e?.target.value ? Number(e.target.value) : ""
                        );
                        setFieldValue("pgAmountBDT",values?.pgAmount * e.target.value);
                        // setFieldValue(
                        //   "pgAmountBDT",
                        //   numberWithCommas(
                        //     Number(e?.target?.value)
                        //       ? values?.pgAmount * Number(e.target.value)
                        //       : initData?.pgAmount
                        //   )
                        // );
                      }}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>PG Amount (BDT)</label>
                    <InputField
                      value={values?.pgAmountBDT}
                      name='pgAmountBDT'
                      placeholder='PG Amount (BDT)'
                      type='test'
                      min={_todayDate()}
                      disabled
                    />
                  </div>
                </div>
                {/* last div */}
              </div>

              <button
                type='submit'
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type='reset'
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
