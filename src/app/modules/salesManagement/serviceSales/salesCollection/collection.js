import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";

const initData = {};

export default function CollectionModal() {
  const [objProps, setObjprops] = useState({});
  const [paymentType, setPaymentType] = useState(1);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          <IForm title="Collection" getProps={setObjprops}>
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
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.item}
                    label="Item"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
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
                </div> */}
                {/* <div className="col-lg-3">
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
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div> */}
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
