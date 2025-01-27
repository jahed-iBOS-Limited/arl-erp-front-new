import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  createInitData,
  fetchCommonDDL,
  shiftDDL,
  validationSchema,
} from "./helper";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

export default function ShipmentLoadDetailsCreateEditPage() {
  //redux
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  // state
  const [objProps, setObjprops] = useState({});

  // api action
  const [shipPointDDL, getShipPointDDL, getShipPointDDLLoading] = useAxiosGet();

  const [
    shipmentLoadDDL,
    getShipmentLoadDDL,
    getShipmentLoadDDLLoading,
  ] = useAxiosGet();

  const [
    ,
    saveShipmentLoadDetails,
    saveShipmentLoadDetailsLoading,
  ] = useAxiosPost();

  // use effect initial load
  useEffect(() => {
    fetchCommonDDL({
      getApi: getShipPointDDL,
      apiName: "shipPoint",
      values: {},
      selectedBusinessUnit,
      profileData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save handler
  const saveHandler = (values, cb) => {
    // destrcuture
    const { shipment, shift, quantity } = values;

    // generate save payload
    const payload = {
      autoId: 0,
      shipmentId: shipment?.value || 0,
      shiftName: shift?.label || "",
      quantity: +quantity || 0,
      actionBy: profileData?.accountId,
    };
    // console.log(payload);

    saveShipmentLoadDetails(
      `/oms/ShipmentTransfer/SaveShipmentLoading`,
      payload,
      cb,
      true
    );
  };

  // common ddl component
  function CommonDDLFieldComponent({ obj }) {
    // obj
    const {
      name,
      ddl,
      label,
      values,
      errors,
      touched,
      setFieldValue,
      cb,
    } = obj;

    //  ddl
    return (
      <div className="col-lg-3">
        <NewSelect
          name={name}
          options={ddl || []}
          value={values[name]}
          label={label}
          onChange={(valueOption) => {
            setFieldValue(name, valueOption);
            cb && cb(valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
    );
  }

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
  const isLoading =
    getShipmentLoadDDLLoading ||
    getShipPointDDLLoading ||
    saveShipmentLoadDetailsLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={createInitData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(createInitData);
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
          {isLoading && <Loading />}
          <IForm title="Create Shipment Load Details" getProps={setObjprops}>
            <Form>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}

              <div className="form-group  global-form row">
                <CommonDDLFieldComponent
                  obj={{
                    name: "shippoint",
                    ddl: shipPointDDL,
                    label: "Shippoint",
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    cb: function cb(valueOption) {
                      fetchCommonDDL({
                        getApi: getShipmentLoadDDL,
                        apiName: "shipmentLoading",
                        values: {
                          ...values,
                          shippoint: valueOption,
                        },
                        selectedBusinessUnit,
                        profileData,
                      });
                    },
                  }}
                />

                <CommonDDLFieldComponent
                  obj={{
                    name: "shipment",
                    ddl: shipmentLoadDDL,
                    label: "Shipment",
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }}
                />

                <CommonInfoDisplay obj={{ values }} />

                <CommonDDLFieldComponent
                  obj={{
                    name: "shift",
                    ddl: shiftDDL,
                    label: "Shift",
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }}
                />

                {console.log(errors)}

                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    label="Quantity"
                    name="quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("quantity", e.target.value);
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
                onSubmit={() => resetForm(createInitData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
