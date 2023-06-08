import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getFuelStationDDL } from "../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
// import IView from "../../../../_helper/_helperIcons/_view";
import IDelete from "../../../../_helper/_helperIcons/_delete";

// Validation schema
const validationSchema = Yup.object().shape({
  travelDate: Yup.string().required("Travel Date is required"),
  fromAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("From Address is required"),
  toAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100000, "Maximum 100000 symbols")
    .required("To Address is required"),
  endMileage: Yup.number()
    .min(0, "Minimum 0 symbols")
    .max(1000000000000000, "Maximum 1000000000000000 symbols")
    .required("End Mailage is required"),
  usageType: Yup.object().shape({
    label: Yup.string().required("Usage Type is required"),
    value: Yup.string().required("Usage Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  fuelTypeList,
  fuelStationDDL,
  setFuelStationDDL,
  supplierDDL,
  setFileObjects,
  fileObjects,
  isEdit,
  fuelCost,
  addToFuelCost,
  remveFromFuelCost,
  setFuelCost
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setFuelCost([])
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
                      disabled={isEdit}
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Address</label>
                    <InputField
                      value={values?.fromAddress}
                      name="fromAddress"
                      placeholder="From Address"
                      disabled={isEdit}
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Time</label>
                    <InputField
                      value={values?.fromTime}
                      disabled={isEdit}
                      name="fromTime"
                      placeholder="From Time"
                      type="time"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Address</label>
                    <InputField
                      value={values?.toAddress}
                      disabled={isEdit}
                      name="toAddress"
                      placeholder="To Address"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Time</label>
                    <InputField
                      value={values?.toTime}
                      disabled={isEdit}
                      name="toTime"
                      placeholder="To Time"
                      type="time"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Start Mileage</label>
                    <InputField
                      value={values?.startMileage}
                      name="startMileage"
                      placeholder="Start Mileage"
                      type="number"
                      min="0"
                      disabled={isEdit}
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
                      disabled={isEdit}
                      type="number"
                      min="0"
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
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
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
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <label>Payment Type</label>
                    <div
                      role="group"
                      aria-labelledby="my-radio-group"
                      className="d-flex"
                      style={
                        values?.purchaseType === "credit"
                          ? {
                              background: "#ffff99",
                            }
                          : values?.purchaseType === "cash"
                          ? {
                              background: "#ccff66",
                            }
                          : {
                              background: "#f2f2f2",
                            }
                      }
                    >
                      <label className="d-flex">
                        <Field
                          type="radio"
                          name="purchaseType"
                          value="cash"
                          id="Cash"
                          onChange={(e) => {
                            setFieldValue("creditAmount", "");
                            setFieldValue("cashAmount", "");
                            setFieldValue("purchaseType", e.target.value);
                          }}
                        />
                        <span className="pl-1">Cash</span>
                      </label>
                      <label className="d-flex ml-3">
                        <Field
                          type="radio"
                          name="purchaseType"
                          value="credit"
                          id="Credit"
                          onChange={(e) => {
                            setFieldValue("creditAmount", "");
                            setFieldValue("cashAmount", "");
                            setFieldValue("purchaseType", e.target.value);
                          }}
                        />
                        <span className="pl-1">Credit</span>
                      </label>
                      <label className="d-flex ml-3">
                        <Field
                          type="radio"
                          name="purchaseType"
                          value="both"
                          id="Both"
                          onChange={(e) => {
                            setFieldValue("creditAmount", "");
                            setFieldValue("cashAmount", "");
                            setFieldValue("purchaseType", e.target.value);
                          }}
                        />
                        <span className="pl-1">Both</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>Comments</label>
                    <InputField
                      value={values?.comments}
                      name="comments"
                      placeholder="Comments"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3 mt-5">
                    <button
                      className="btn btn-primary mr-2"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                  </div>
                </div>
              </div>

              {/* Row Part */}
              {/* {values?.fuelPurchased === true ? ( */}
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
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Rate</label>
                    <InputField
                      value={values?.rate}
                      name="rate"
                      placeholder="Rate"
                      type="number"
                      min="0"
                    />
                  </div>

                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="paymentMethod"
                      options={[
                        // { value: "Cash", label: "Cash" },
                        { value: "Credit", label: "Credit" },
                      ]}
                      value={values?.paymentMethod}
                      label="Payment Method"
                      onChange={(valueOption) => {
                        setFieldValue("fuelStation", "");
                        setFieldValue("supplier", "");
                        setFieldValue("paymentMethod", valueOption);
                      }}
                      isDisabled={values?.fuelPurchased === false}
                      placeholder="Payment Method"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {values?.purchaseType !== "cash" && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="supplier"
                          options={supplierDDL || []}
                          value={values?.supplier}
                          isDisabled={values?.paymentMethod?.label === "Cash"}
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
                          isDisabled={
                            values?.paymentMethod?.label === "Cash" ||
                            !values?.supplier
                          }
                          label="Fuel Station"
                          onChange={(valueOption) => {
                            setFieldValue("fuelStation", valueOption);
                          }}
                          placeholder="Fuel Station"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-lg-3">
                    <InputField
                      label="Reference No"
                      value={values?.referenceNo}
                      name="referenceNo"
                      placeholder="Reference No."
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="Reference Date"
                      value={values?.referenceDate}
                      name="referenceDate"
                      placeholder="Reference Date"
                      type="date"
                    />
                  </div>
                  {["cash", "both"].includes(values?.purchaseType) && (
                    <div className="col-lg-3">
                      <InputField
                        label="Cash Amount"
                        value={values?.cashAmount}
                        name="cashAmount"
                        placeholder="Cash Amount"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("cashAmount", e?.target?.value);
                          if (values?.purchaseType === "both") {
                            setFieldValue(
                              "totalAmount",
                              Number(e?.target?.value) +
                                Number(values?.creditAmount)
                            );
                          } else {
                            setFieldValue("totalAmount", e?.target?.value);
                          }
                        }}
                      />
                    </div>
                  )}
                  {["credit", "both"].includes(values?.purchaseType) && (
                    <div className="col-lg-3">
                      <InputField
                        label="Credit Amount"
                        value={values?.creditAmount}
                        name="creditAmount"
                        placeholder="Credit Amount"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("creditAmount", e?.target?.value);
                          if (values?.purchaseType === "both") {
                            setFieldValue(
                              "totalAmount",
                              Number(e?.target?.value) +
                                Number(values?.cashAmount)
                            );
                          } else {
                            setFieldValue("totalAmount", e?.target?.value);
                          }
                        }}
                      />
                    </div>
                  )}
                  <div className="col-lg-3">
                    <InputField
                      label="Total Amount"
                      value={values?.totalAmount}
                      name="totalAmount"
                      placeholder="Total Amount"
                      type="number"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 align-self-end">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => {
                        addToFuelCost(values, () => {
                          setFieldValue("fuelType", "");
                          setFieldValue("quantity", "");
                          setFieldValue("rate", "");
                          setFieldValue("supplier", "");
                          setFieldValue("fuelStation", "");
                          setFieldValue("referenceNo", "");
                          setFieldValue("referenceDate", "");
                          setFieldValue("cashAmount", "");
                          setFieldValue("creditAmount", "");
                          setFieldValue("totalAmount", "");
                        });
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
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
                          <th>Action</th>
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
                            <td className="text-center align-middle">
                              <IDelete remover={remveFromFuelCost} id={index} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* ) : (
                ""
              )} */}

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

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
