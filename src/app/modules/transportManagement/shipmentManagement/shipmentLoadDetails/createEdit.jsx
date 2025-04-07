import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import {
  createInitData,
  generateEditInitData,
  isEditingMode,
  notEmptyState,
  shiftDDL,
  validationSchema,
} from './helper';
import ShipPointShipMentDDL, { CommonDDLFieldComponent } from './shipPointMent';

export default function ShipmentLoadDetailsCreateEditPage() {
  //redux
  const { profileData } = useSelector((state) => state?.authData, shallowEqual);

  // hook
  const formikRef = useRef(null);
  const params = useParams();
  const location = useLocation();

  // state
  const [objProps, setObjprops] = useState({});

  const [, saveShipmentLoadDetails, saveShipmentLoadDetailsLoading] =
    useAxiosPost();

  // use effect for edit
  useEffect(() => {
    // if editing mode & formik is exist
    if (isEditingMode(params) && formikRef?.current) {
      // if location?.state is not empty (data are coming from landing)
      if (notEmptyState(location)) {
        // set values to formik state
        formikRef.current.setValues(generateEditInitData(location));
      }
    }
  }, []);

  // save handler
  const saveHandler = (values, params, cb) => {
    // destrcuture
    const { shipment, shift, quantity, loadingDate } = values;
    // generate save payload
    const payload = {
      autoId: isEditingMode(params) ? +params?.id : 0, // if editing mode than provide it's id otherwise 0
      shipmentId: shipment?.value || 0,
      shiftName: shift?.label || '',
      quantity: +quantity || 0,
      actionBy: profileData?.userId,
      loadingDate: loadingDate,
    };
    // console.log(payload);

    saveShipmentLoadDetails(
      `/oms/ShipmentTransfer/SaveShipmentLoading`,
      payload,
      cb,
      true
    );
  };

  // common info display
  function CommonInfoDisplay({ obj }) {
    // destrcuture
    const {
      values: { shipment },
    } = obj;

    return (
      <>
        <div class="col-lg-2 align-content-center">
          <strong>Net Weight :</strong> <br />
          <strong>{shipment?.totalNetWeight || 0}</strong>
        </div>
        <div class="col-lg-2 align-content-center">
          <strong>Load Quantity :</strong> <br />
          <strong>{shipment?.totalLoadQuantity || 0}</strong>
        </div>
        <div class="col-lg-2 align-content-center">
          <strong>Remaining Quantity :</strong>
          <br />
          <strong>{shipment?.totalRemainingQuantity || 0}</strong>
        </div>
      </>
    );
  }

  // loading
  const isLoading = saveShipmentLoadDetailsLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={createInitData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, params, () => {
          resetForm(createInitData);
        });
      }}
      innerRef={formikRef}
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
          {isLoading && <Loading />}
          <IForm title="Create Shipment Load Details" getProps={setObjprops}>
            <Form>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}

              <div className="form-group  global-form row">
                <ShipPointShipMentDDL
                  obj={{
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    isEditingMode: isEditingMode(params),
                  }}
                />

                <CommonInfoDisplay obj={{ values }} />

                <CommonDDLFieldComponent
                  obj={{
                    name: 'shift',
                    ddl: shiftDDL,
                    label: 'Shift',
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }}
                />

                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    label="Quantity"
                    name="quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue('quantity', e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3  ">
                  <InputField
                    value={values?.loadingDate}
                    label="Loading Date"
                    type="date"
                    name="loadingDate"
                    onChange={(e) => {
                      setFieldValue('loadingDate', e.target.value);
                    }}
                  />
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
                onSubmit={() => resetForm(createInitData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
