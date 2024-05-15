import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getFuelStationDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  fromAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("From Address is required"),
  toAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("To Address is required"),
  endMileage: Yup.number().required("Controlling Unit Name is required"),
  usageType: Yup.object().shape({
    label: Yup.string().required("Usage Type is required"),
    value: Yup.string().required("Usage Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  isEdit,
  saveHandler,
  resetBtnRef,
  disableHandler,
  fuelTypeList,
  fuelStationDDL,
  setFuelStationDDL,
  supplierDDL,
  fuelCost
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
            {console.log("values", values)}
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              {/* Form */}
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Travel Date</label>
                    <InputField
                      value={values?.travelDate}
                      name="travelDate"
                      placeholder="Travel Date"
                      disabled
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Address</label>
                    <InputField
                      value={values?.fromAddress}
                      name="fromAddress"
                      placeholder="From Address"
                      disabled
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Time</label>
                    <InputField
                      value={values?.fromTime}
                      name="fromTime"
                      placeholder="From Time"
                      disabled
                      type="time"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Address</label>
                    <InputField
                      value={values?.toAddress}
                      name="toAddress"
                      placeholder="To Address"
                      disabled
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Time</label>
                    <InputField
                      value={values?.toTime}
                      name="toTime"
                      placeholder="To Time"
                      disabled
                      type="time"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Start Mileage</label>
                    <InputField
                      value={values?.startMileage}
                      name="startMileage"
                      placeholder="Start Mileage"
                      disabled={isEdit}
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>End Mileage</label>
                    <InputField
                      value={values?.endMileage}
                      name="endMileage"
                      placeholder="End Mileage"
                      onChange={(e) => {
                        setFieldValue("endMileage", e.target.value);
                        setFieldValue(
                          "consumedMileage",
                          e.target.value - values.startMileage
                        );
                      }}
                      disabled
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Consumed Mileage</label>
                    <InputField
                      value={values?.consumedMileage}
                      name="consumedMileage"
                      placeholder="Consumed Mileage"
                      disabled
                      type="text"
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="usageType"
                      options={[
                        { value: "Official", label: "Official" },
                        { value: "Personal", label: "Personal" },
                      ]}
                      value={values?.usageType}
                      label="Usage Type"
                      onChange={(valueOption) => {
                        setFieldValue("usageType", valueOption);
                      }}
                      placeholder="Usage Type"
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div
                    className="col-lg-3 text-center"
                    style={{ marginTop: "18px" }}
                  >
                    <label className="mr-2">Fuel Purchased?</label>
                    <Field
                      type="checkbox"
                      name="fuelPurchased"
                      checked={values?.fuelPurchased}
                      disabled={isEdit}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <label>Comments</label>
                    <InputField
                      value={values?.comments}
                      name="comments"
                      placeholder="Comments"
                      disabled
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Row Part */}
              {values?.fuelPurchased === true ? (
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="fuelType"
                        options={fuelTypeList}
                        value={values?.fuelType}
                        label="Fuel Type"
                        onChange={(valueOption) => {
                          setFieldValue("fuelType", valueOption);
                        }}
                        placeholder="Fuel Type"
                        isDisabled={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Quantity</label>
                      <InputField
                        value={values?.quantity}
                        name="quantity"
                        placeholder="Quantity"
                        disabled
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Total Amount</label>
                      <InputField
                        value={values?.totalAmount}
                        name="totalAmount"
                        placeholder="Total Amount"
                        disabled
                        type="number"
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="paymentMethod"
                        options={[
                          { value: "Cash", label: "Cash" },
                          { value: "Credit", label: "Credit" },
                        ]}
                        value={values?.paymentMethod}
                        label="Payment Method"
                        onChange={(valueOption) => {
                          setFieldValue("fuelStation", "");
                          setFieldValue("supplier", "");
                          setFieldValue("paymentMethod", valueOption);
                        }}
                        isDisabled={true}
                        placeholder="Payment Method"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="supplier"
                        options={supplierDDL || []}
                        value={values?.supplier}
                        isDisabled={true}
                        label="Supplier"
                        onChange={(valueOption) => {
                          getFuelStationDDL(
                            valueOption?.value,
                            setFuelStationDDL
                          );
                          setFieldValue("fuelStation", "");
                          setFieldValue("supplier", valueOption);
                        }}
                        placeholder="Supplier"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="fuelStation"
                        options={fuelStationDDL}
                        value={values?.fuelStation}
                        isDisabled={true}
                        label="Fuel Station"
                        onChange={(valueOption) => {
                          setFieldValue("fuelStation", valueOption);
                        }}
                        placeholder="Fuel Station"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Reference No.</label>
                      <InputField
                        value={values?.referenceNo}
                        name="referenceNo"
                        placeholder="Reference No."
                        disabled
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

<div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th>Payment Type</th>
                          <th>Supplier Name</th>
                          <th>Fuel Station Name</th>
                          <th>Fuel Type</th>
                          <th>Fuel Qty</th>
                          <th>Reference No</th>
                          <th>Date</th>
                          <th>Cash Amount</th>
                          <th>Credit Amount</th>
                          <th>Total</th>

                        </tr>
                      </thead>
                      <tbody>
                        {fuelCost?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.paymentMethod}</td>
                            <td>{item?.businessPartnerName}</td>
                            <td>{item?.fuelStationName}</td>
                            <td>{item?.fuelTypeName}</td>
                            <td>{item?.quantity}</td>
                            <td>{item?.referenceNo || ""}</td>
                            <td>{item?.referenceDate}</td>
                            <td>{item?.cashAmount}</td>
                            <td>{item?.creditAmount}</td>
                            <td>{item?.totalAmount}</td>
                            {/* <td className="text-center">
                              {item?.attachmentFileId && (
                                <IView
                                  clickHandler={() => {
                                    // dispatch(
                                    //   getDownlloadFileView_Action(
                                    //     item?.attachmentFileId
                                    //   )
                                    // );
                                  }}
                                />
                              )}
                            </td> */}

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
          </>
        )}
      </Formik>
    </>
  );
}
