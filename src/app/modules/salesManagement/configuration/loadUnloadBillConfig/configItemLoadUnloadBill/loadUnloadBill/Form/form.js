// import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../../../_helper/_inputField";
import NewSelect from "../../../../../../_helper/_select";
import { getShipPointDDL, getItemNameDDL_api } from "../helper";
import { getVehicleCapacityDDL } from "./../../../../partnerThanaRate/helper";

const DataValiadtionSchema = Yup.object().shape({
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Shipping Point is required"),
    value: Yup.string().required("Shipping Point is required"),
  }),
  itemName: Yup.object().shape({
    label: Yup.string().required("Item Name is required"),
    value: Yup.string().required("Item Name is required"),
  }),
  quantity: Yup.number().required("Quantity is required"),
  loadAmount: Yup.number().required("Load Amount is required"),
  unloadAmount: Yup.number().required("Unload Amount is required"),
  vehicleCapacity: Yup.object().shape({
    label: Yup.string().required("Vehicle Capacity is required"),
    value: Yup.string().required("Vehicle Capacity is required"),
  }),
});

export default function _Form({
  backBtnRef,
  btnRef,
  saveBtnRef,
  resetBtnRef,
  saveDataClick,
  disableHandler,
  saveData,
  accountId,
  selectedBusinessUnit,
  initData,
  actionBy,
  id,
}) {
  const [shipPoint, setShipPoint] = useState("");
  const [itemName, setItemName] = useState("");
  const [vehicleCapacityDDL, setVehicleCapacityDDL] = useState([]);
  useEffect(() => {
    if (accountId && selectedBusinessUnit) {
      getShipPointDDL(accountId, selectedBusinessUnit, setShipPoint);
      getItemNameDDL_api(accountId, selectedBusinessUnit, setItemName);
      getVehicleCapacityDDL(setVehicleCapacityDDL);
    }
  }, [accountId, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveData(values, () => {
            resetForm(initData);
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
            <div className="global-form">
              <Form className="form form-label-right">
                <div className="form-group row ">
                  <div className="col-lg-2 ">
                    <NewSelect
                      name="shipPoint"
                      options={shipPoint || []}
                      value={values?.shipPoint || ""}
                      label="Shipping Point"
                      isDisabled={id}
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder="Shipping Point"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="vehicleCapacity"
                      options={vehicleCapacityDDL || []}
                      value={values?.vehicleCapacity || ""}
                      label="Vehicle Capacity"
                      onChange={(valueOption) => {
                        setFieldValue("vehicleCapacity", valueOption);
                      }}
                      placeholder="Vehicle Capacity"
                      errors={errors}
                      touched={touched}
                      // isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="itemName"
                      options={itemName || []}
                      value={values?.itemName || ""}
                      isDisabled={id}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("itemName", valueOption);
                      }}
                      placeholder="Item Name"s
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>Quantity</label>
                    <InputField
                      value={values?.quantity}
                      name="quantity"
                      placeholder="Quantity"
                      type="number"
                      disabled
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Load Amount</label>
                    <InputField
                      value={values?.loadAmount}
                      name="loadAmount"
                      placeholder="Load Amount"
                      type="number"
                      disabled
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Unload Amount</label>
                    <InputField
                      value={values?.unloadAmount}
                      name="unloadAmount"
                      placeholder="Unload Amount"
                      type="number"
                    />
                  </div>
                </div>

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
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
