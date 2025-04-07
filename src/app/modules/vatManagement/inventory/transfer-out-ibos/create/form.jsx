import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import NewSelect from '../../../../_helper/_select';

const validationSchema = Yup.object().shape({
  deliveryNo: Yup.object().shape({
    label: Yup.string().required('Delivery No. requirFed'),
    value: Yup.string().required('Delivery No. required'),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required('Distribution Channel is required'),
    value: Yup.string().required('Distribution Channel is required'),
  }),
});

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  landingData,
  isEdit,
  inventoryTransferDDL,
  distributionChannelDDL,
}) {
  //
  const [valid, setValid] = useState(true);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                taxBranchAddress: landingData?.selectedTaxBranchDDL,
              }
        }
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
        }) => (
          <>
            <Form className="form from-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={distributionChannelDDL || []}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue('distributionChannel', valueOption);
                    }}
                    placeholder="Distribution Channel"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="deliveryNo"
                    options={inventoryTransferDDL || []}
                    value={values?.deliveryNo || ''}
                    label="Transfer No"
                    onChange={(valueOption) => {
                      setFieldValue('deliveryNo', valueOption);
                    }}
                    placeholder="Transfer No"
                    errors={errors}
                    touched={touched}
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
