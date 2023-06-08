import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { IInput } from "../../../../_helper/_input";

import { useEffect } from "react";

// Validation schema for Advance for Internal Expense
const validationSchema = Yup.object().shape({
  receivedAmount: Yup.number()
    .min(1, "Minimum 1 symbols")
    .required("Requested Amount is required"),

  receivedDate: Yup.string().required("Due date is required"),
  comments: Yup.string(),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  remover,
  setter,
  profileData,
  selectedBusinessUnit,
  jorunalType,
  isEdit,
  state,
  singleData,
}) {
  useEffect(() => {}, [profileData, selectedBusinessUnit, state]);
  const [valid, setValid] = useState(true);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,

          advanceCode: singleData?.advanceCode,
          advAmount: singleData?.requestedAmount,
          paymentType: singleData?.paymentType?.label,
        }}
        // initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setValid(true);
          });

          console.log("object");
        }}
      >
        {({ handleSubmit, resetForm, values, isValid }) => (
          <>
            {disableHandler(!isValid || !valid)}
            {/* {setInitValue(values,setFieldValue)} */}

            <p className="mt-3 employee_info">
              <b> Advanced Code</b> : {values.advanceCode},{" "}
              <b> Requested Amount</b> : {values.advAmount},{" "}
              <b> Payment Type</b>: {values.paymentType},{" "}
            </p>

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-6">
                  <div className="row bank-journal bank-journal-custom bj-left p-4">
                    <div className="col-lg-4 pl pr-1 mb-2 disable-border disabled-feedback border-gray">
                      <IInput
                        value={values.receivedDate}
                        label="Received Date"
                        name="receivedDate"
                        type="date"
                      />
                    </div>

                    <div className="col-lg-4 pl pr-1 mb-2 disable-border disabled-feedback border-gray">
                      <IInput
                        value={values.receivedAmount}
                        label="Received Amount"
                        name="receivedAmount"
                        min="0"
                        max={values.advAmount}
                        type="number"
                      />
                    </div>

                    <div className="col-lg-4 pl pr-1 mb-2 h-narration border-gray">
                      <IInput
                        value={values.comments}
                        label="Comments"
                        name="comments"
                      />
                    </div>
                    <div className="text-right pl-3 pt-2 pb-1">
                      <button type="button" className="btn btn-primary">
                        Attachment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row Dto Table End */}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
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
