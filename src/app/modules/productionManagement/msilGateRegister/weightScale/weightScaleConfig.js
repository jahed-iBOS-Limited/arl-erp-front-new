import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';
import { setWeightScaleConfigValuesAction } from '../../../_helper/reduxForLocalStorage/Actions';
const validationSchema = Yup.object().shape({
  scaleType: Yup.string().required('Scale Type is required'),
  byteType: Yup.string().required('Byte Type is required'),
});

function WeightScaleConfig() {
  const dispatch = useDispatch();
  const { weightScaleConfigValues } = useSelector(
    (state) => state.localStorage,
  );
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          scaleType: weightScaleConfigValues?.scaleType || '',
          byteType: weightScaleConfigValues?.byteType || '',
          baudRate: weightScaleConfigValues?.baudRate || '',
        }}
        onSubmit={(values) => {
          dispatch(
            setWeightScaleConfigValuesAction({
              scaleType: values?.scaleType,
              byteType: values?.byteType,
              baudRate: values?.baudRate,
            }),
          );
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          resetForm,
          errors,
          touched,
          submitForm,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Weight Scale Config'}>
                <CardHeaderToolbar>
                  <div className="d-flex">
                    <button
                      onClick={() => {
                        resetForm();
                        dispatch(
                          setWeightScaleConfigValuesAction({
                            scaleType: '',
                            byteType: '',
                            baudRate: '',
                          }),
                        );
                      }}
                      className="btn btn-primary ml-2"
                      type="button"
                    >
                      Default setting
                    </button>
                    <div>
                      <button
                        className="btn btn-primary ml-2"
                        type="submit"
                        onClick={() => {
                          submitForm();
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <NewSelect
                        name="scaleType"
                        options={[
                          { value: 'old', label: 'Old' },
                          { value: 'new', label: 'New' },
                        ]}
                        value={values?.scaleType}
                        label="Scale Type"
                        onChange={(valueOption) => {
                          setFieldValue('scaleType', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="byteType"
                        options={[
                          { value: '8 byte', label: '8 byte' },
                          { value: '5 byte', label: '5 byte' },
                        ]}
                        value={values?.byteType}
                        label="Byte Type"
                        onChange={(valueOption) => {
                          setFieldValue('byteType', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.baudRate}
                        label="Baud Rate"
                        name=""
                        type="number"
                        onChange={(e) => {
                          setFieldValue('baudRate', e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default WeightScaleConfig;
