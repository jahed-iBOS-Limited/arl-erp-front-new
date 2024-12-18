import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import IForm from '../../../../_helper/_form';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { _todayDate } from '../../../../chartering/_chartinghelper/_todayDate';
import { fuelCreateFormValidation } from '../helper';
const initData = {
  fuel: '',
  rate: '',
  isActive: true,
  dteLastActionDate: _todayDate(),
};

export default function FuelRateConfigCreateAndEdit() {
  const [objProps, setObjprops] = useState({});
  const { id } = useParams();
  const { state } = useLocation();
  const [, createCofig, configLoader] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  console.log('singleData', singleData);
  const saveHandler = (values, cb) => {
    const payload = {
      intFuelRateId: state?.intFuelRateId || 0,
      intFuelId: values?.fuel?.value,
      strFuelName: values?.fuel?.label,
      numRate: values?.rate,
      isActive: values?.isActive,
      dteLastActionDate: values?.dteLastActionDate,
    };
    createCofig(
      `/mes/VehicleLog/CreateFuelRateConfig`,
      payload,
      () => {},
      true,
    );
  };
  useEffect(() => {
    if (state) {
      const data = {
        fuel: { label: state?.strFuelName, value: state?.intFuelId },
        rate: state?.numRate,
        isActive: state?.isActive,
      };
      setSingleData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? singleData : initData}
      validationSchema={fuelCreateFormValidation}
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
          {configLoader && <Loading />}
          <IForm title="Fuel Config" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="fuel"
                    options={[
                      { value: 1, label: 'Octane' },
                      { value: 2, label: 'Diesel' },
                      { value: 3, label: 'CNG' },
                      { value: 4, label: 'LPG' },
                    ]}
                    value={values?.fuel}
                    label="Fuel Name"
                    onChange={(valueOption) => {
                      setFieldValue('fuel', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.rate}
                    label="Fuel Rate"
                    name="rate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue('rate', +e.target.value);
                    }}
                    min={0}
                  />
                </div>
                <div
                  style={{ alignItems: 'center', gap: '2px' }}
                  className="col-lg-2 mt-4 d-flex"
                >
                  <input
                    style={{ marginTop: '5px' }}
                    id="isActive"
                    type="checkbox"
                    name="isActive"
                    checked={values?.isActive}
                    onChange={(e) =>
                      setFieldValue('isActive', e?.target?.checked)
                    }
                  />
                  <label htmlFor="isActive">IsActive</label>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
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
