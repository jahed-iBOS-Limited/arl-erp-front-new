import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from './../../../../_helper/_inputField';
import { _dateFormatter } from '../../../../_helper/_dateFormate';

// Validation schema
const validationSchema = Yup.object().shape({
  entryDay: Yup.number().required('Entry Day is Required').max(30),
  editedDay: Yup.number().required('Edit Day is Required').max(30),
});

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setRowDto,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({ handleSubmit, resetForm, values }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3 pl pr-1 mb-1">
                  <label>Last Sales Target Entry Day</label>
                  <InputField
                    value={values?.entryDay}
                    name="entryDay"
                    placeholder="Entry Day"
                    type="number"
                    min="0"
                  />
                </div>

                <div className="col-lg-3 pl pr-1 mb-1">
                  <label>Last Sales Target Edited Day</label>
                  <InputField
                    value={values?.editedDay}
                    name="editedDay"
                    placeholder="Edited Day"
                    type="number"
                    min="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
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
