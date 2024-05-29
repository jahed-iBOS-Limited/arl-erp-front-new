import React, { useState } from "react";
import { Formik, Form } from "formik";
import { validationSchema, empAttachment_action } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { useDispatch } from "react-redux";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";
import { DropzoneDialogBase } from "material-ui-dropzone";
import NewSelect from "../../../../_helper/_select";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setFileObjects,
  fileObjects,
  setUploadImage,
  viewType,
  location,
  LCTypeDDL,
  itemList,
  incoTermsDDL,
  rowDtoHandler,
  PIAmount,
  setDisabled,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  console.log("viewType: ", viewType);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values, lcNo: location?.state?.lcnumber }, () => {
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
            <div className="d-flex justify-content-center align-items-center">
              <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                PO : {location?.state?.ponumber}
              </div>
              <div style={{ fontWeight: "900", marginLeft: "30px" }}>
                LC : {location?.state?.lcnumber}
              </div>
            </div>
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.lcType}
                      options={LCTypeDDL || []}
                      label="LC Type"
                      placeholder="LC Type"
                      name="lcType"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("lcType", e);
                      }}
                      isDisabled={
                        true
                        // location?.state?.lcNo ||
                        // viewType === "view"
                        // ||
                        // viewType === "edit"
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Expired Date</label>
                    <InputField
                      value={values?.LCExpiredDate}
                      placeholder="LC Expired Date"
                      name="LCExpiredDate"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      placeholder="Last Shipment Date"
                      name="lastShipmentDate"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Due Date</label>
                    <InputField
                      value={values?.dueDate}
                      placeholder="Due Date"
                      name="dueDate"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.incoTerms}
                      placeholder="Inco-Terms"
                      label="Inco-Terms"
                      name="incoTerms"
                      options={incoTermsDDL || []}
                      min={0}
                      isDisabled={true}
                      onChange={(e) => {
                        setFieldValue("incoTerms", e);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Tolerance (%)</label>
                    <InputField
                      value={values?.tolarencePercentage}
                      placeholder="Tolerance (%)"
                      name="tolarencePercentage"
                      min={0}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>LC Tenor days</label>
                    <InputField
                      value={values?.LCTenorDays}
                      placeholder="LC Tenor days"
                      name="LCTenorDays"
                      min={0}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Total Amendment Charge(including VAT)</label>
                    <InputField
                      value={values?.totalAmendmentCharge}
                      placeholder="Total Amendment Charge(including VAT)"
                      name="totalAmendmentCharge"
                      type="number"
                      // min={0}
                      disabled={viewType === "view"}
                      onBlur={(e) => {
                        if (
                          Number(e?.target?.value) <
                          Number(values?.VATOnAmendmentCharge)
                        ) {
                          toast.warning(
                            "Total Amount can't be less than VAT Amount",
                            { toastId: "totalAmount" }
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>VAT on Amendment Charge</label>
                    <InputField
                      value={values?.VATOnAmendmentCharge}
                      placeholder="VAT on Amendment Charge"
                      name="VATOnAmendmentCharge"
                      type="number"
                      disabled={viewType === "view"}
                      onBlur={(e) => {
                        if (
                          Number(e?.target?.value) >
                          Number(values?.totalAmendmentCharge)
                        ) {
                          toast.warning(
                            "VAT can't be greater than Total Amount",
                            { toastId: "vatAmount" }
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PI Amount (FC)</label>
                    <InputField
                      value={numberWithCommas(PIAmount.toFixed(2))}
                      placeholder="Total PI Amount"
                      name="PIAmountFC"
                      // type="number"
                      disabled={true}
                      onChange={(e) => {
                        setFieldValue(
                          "PIAmountBDT",
                          e.target.value * values?.exchangeRate
                        );
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Exchange Rate</label>
                    <InputField
                      value={values?.exchangeRate}
                      placeholder="Exchange Rate"
                      name="exchangeRate"
                      type="number"
                      // min={1}
                      disabled={viewType === "view"}
                      onChange={(e) => {
                        setFieldValue("exchangeRate", e.target.value);
                        setFieldValue(
                          "PIAmountBDT",
                          +e?.target?.value * PIAmount
                        );
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.currency}
                      placeholder="Currency"
                      label="Currency"
                      name="currency"
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>PI Amount (BDT)</label>
                    <InputField
                      value={numberWithCommas(
                        parseFloat(values?.PIAmountBDT).toFixed(2)
                      )}
                      placeholder="PI Amount (BDT)"
                      name="PIAmountBDT"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  {viewType !== "view" && (
                    <div className="col-lg-1">
                      <div style={{ marginTop: "14px" }}>
                        <ButtonStyleOne
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={() => setOpen(true)}
                          label="Attachment"
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className="col-lg-1"
                    style={{ marginTop: "14px", marginLeft: "40px" }}
                  >
                    {values?.attachment && (
                      <button
                        className="btn btn-primary d-flex"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.attachment)
                          );
                        }}
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View
                      </button>
                    )}
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
                // onSubmit={() => resetForm(initData)}
              ></button>

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
                  empAttachment_action(fileObjects).then((data) => {
                    setUploadImage(data);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
              <div className="loan-scrollable-table">
                <div>
                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing global-form">
                      <thead>
                        <tr>
                          <th style={{ display: "none" }}></th>
                          <th style={{ minWidth: "25px" }}>SL</th>
                          <th style={{ minWidth: "120px" }}>Item Name</th>
                          <th style={{ minWidth: "80px" }}>
                            PO Order Quantity
                          </th>
                          <th style={{ minWidth: "80px" }}>Shipped Quantity</th>
                          {viewType !== "view" && (
                            <th style={{ minWidth: "120px" }}>
                              Order Quantity
                            </th>
                          )}
                          <th style={{ minWidth: "120px" }}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemList?.length > 0 &&
                          itemList?.map((item, index) => {
                            console.log("item: ", item);
                            return (
                              <tr key={index}>
                                <td style={{ display: "none" }}></td>
                                <td
                                  style={{ width: "25px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td className="text-center">
                                  {item?.itemName}
                                </td>
                                <td className="text-right">
                                  {item?.poOrderQuantity}
                                </td>
                                <td className="text-right">
                                  {item?.shippedQty}
                                </td>
                                {viewType !== "view" && (
                                  <td className="text-right">
                                    <InputField
                                      value={item?.orderQty}
                                      // className="text-right"
                                      name="orderQty"
                                      placeholder="Quantity"
                                      type="number"
                                      disabled={viewType === "view"}
                                      // min={0}
                                      onChange={(e) => {
                                        rowDtoHandler(
                                          "orderQty",
                                          e.target.value,
                                          index,
                                          setFieldValue,
                                          values
                                        );
                                      }}
                                      onBlur={(e) => {
                                        if (
                                          e?.target?.value < item?.shippedQty
                                        ) {
                                          toast.warning(
                                            "Order quantity can't be less than shipped quantity",
                                            { toastId: "orderQuantityCheck" }
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                )}
                                <td className="text-right">
                                  <InputField
                                    className="text-right"
                                    name="price"
                                    value={numberWithCommas(
                                      (item?.price).toFixed(2)
                                    )}
                                    disabled={true}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        <tr>
                          {/* <td ></td> */}
                          <td style={{ display: "none" }}></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          {viewType !== "view" && <td></td>}
                          <td className="d-flex justify-content-between align-items-center">
                            <span className="font-weight-bold">Sub Total</span>
                            <span>{numberWithCommas(PIAmount.toFixed(2))}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
