import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";

const initData = {
  item: "",
  remarks: "",
  amount: "",
  date: "",
};

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function CommercialInvoiceCreateEdit() {
  const [objProps, setObjprops] = useState({});
  
  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
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
            <IForm title="Commercial Invoice Create" getProps={setObjprops}>
             <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
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
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>
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