import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { IInput } from '../../../../_helper/_input';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  checkPostName: Yup.string().required('Check Post Name required'),
});

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  selectedBusinessUnit,
  profileData,
}) {
  const [valid, setValid] = useState(true);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
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
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <IInput
                    value={values?.checkPostName || ''}
                    label="Check Post Name"
                    name="checkPostName"
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
