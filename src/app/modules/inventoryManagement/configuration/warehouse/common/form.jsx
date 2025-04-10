import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '../../../../../../_metronic/_partials/controls';
import createDebounceHandler from '../../../../_helper/debounceForSave';
import Loading from '../../../../_helper/_loading';

// Validation schema
const ProductEditSchema = Yup.object().shape({
  warehouseName: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(100, 'Maximum 100 symbols')
    .required('Warehouse is required'),
  warehouseCode: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Code is required'),
  warehouseAddress: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(300, 'Maximum 300 symbols')
    .required('Address is required'),
});

export default function FormCmp({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  disableHandler,
  warehouseCode,
  warehouseName,
  accountId,
}) {
  const debounceHandler = createDebounceHandler(5000);
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true);
          debounceHandler({
            setLoading: setLoading,
            CB: () => {
              saveWarehouse(values, () => {
                resetForm(product);
              });
            },
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values?.warehouseName || ''}
                    name="warehouseName"
                    component={Input}
                    placeholder="Warehouse"
                    label="Warehouse"
                    // errors={errors}
                    disabled={warehouseName}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values?.warehouseCode || ''}
                    name="warehouseCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={warehouseCode}
                  />
                </div>

                <div className="col-lg-4">
                  <Field
                    value={values?.warehouseAddress || ''}
                    name="warehouseAddress"
                    component={Input}
                    placeholder="Address"
                    label="Address"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
                // disabled={true}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
