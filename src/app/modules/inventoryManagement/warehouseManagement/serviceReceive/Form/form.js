import React, { useState } from "react";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import CreatePageTable from "./CreatePageTable";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import { getRowDtoData } from "../helper/Actions";
import NewSelect from "../../../../_helper/_select";
import { getForeignPurchaseDDL } from "../../invTransaction/helper";

// Validation schema
const validationSchema = Yup.object().shape({
  poNumber: Yup.object().shape({
    label: Yup.string().required("Po Number is required"),
    value: Yup.string().required("Po Number is required"),
  }),
  challanNO: Yup.string().required("Challan No is required"),
  challanDate: Yup.date().required("Challan date is required"),
});

// Validation schema for Edit
const editValidationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  PoNumber,
  showrowDtoforPO,
  rowDto,
  rowDtoHandler,
  setAttachment,
  attachmentHandleChange,
  attachError,
  setRowDto,
  costCenter,
  serviceReceived,
  projectName,
  setFileObjects,
  fileObjects,
  vatAmount,
  totalAmount,
  totalVat,
  netTotalValue,
  remover,
  plantId,
  selectedBusinessUnit,
  profileData,
}) {
  const [open, setOpen] = React.useState(false);
  const [foreignPurchaseDDL, setForeginPurchase] = useState([]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? editValidationSchema : validationSchema}
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <ISelect
                    label="Select PO Number"
                    options={PoNumber}
                    value={values?.poNumber}
                    name="poNumber"
                    onChange={(valueOption) => {
                      setFieldValue("poNumber", valueOption);
                      setFieldValue("foreignPurchase", "");
                      if (
                        valueOption?.purchaseOrganizationName ===
                        "Foreign Procurement"
                      ) {
                        setRowDto([]);
                        getForeignPurchaseDDL(
                          valueOption?.value,
                          plantId,
                          setForeginPurchase
                        );
                      } else {
                        getRowDtoData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          0,
                          setRowDto
                        );
                      }
                      setFieldValue("poAmount", valueOption?.poAmount);
                      setFieldValue(
                        "adjustedAmount",
                        valueOption?.adjustAmount
                      );
                      setFieldValue("supplier", {
                        value: valueOption?.supplierId,
                        label: valueOption?.supplierName,
                      });
                      setFieldValue("freight", valueOption?.freight);
                      setFieldValue(
                        "grossDiscount",
                        valueOption?.grossDiscount
                      );
                      setFieldValue("commission", valueOption?.commission);
                      setFieldValue("productCost", valueOption?.productCost);
                      setFieldValue(
                        "othersCharge",
                        valueOption?.othersCharge || 0
                      );
                      setFieldValue("vatAmmount", valueOption?.vatAmount || 0);
                      setRowDto([]);
                    }}
                    isDisabled={isEdit}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.poNumber?.purchaseOrganizationName ===
                  "Foreign Procurement" && (
                  <div className="col-lg-2">
                    <NewSelect
                      label="Invoice"
                      placeholder="Invoice"
                      options={foreignPurchaseDDL || []}
                      value={values?.foreignPurchase}
                      name="foreignPurchase"
                      onChange={(valueOption) => {
                        setFieldValue("foreignPurchase", valueOption);
                        getRowDtoData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.poNumber?.value,
                          valueOption?.value,
                          setRowDto
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-2">
                  <Field
                    value={values?.poAmount}
                    name="poAmount"
                    component={Input}
                    placeholder="PO Amount"
                    label="PO Amount"
                    disabled={true}
                  />
                </div>
                {/* <div className="col-lg-2">
                  <Field
                    value={values?.adjustedAmount}
                    name="adjustedAmount"
                    component={Input}
                    placeholder="Adjusted Amount"
                    label="Adjusted Amount"
                    disabled={true}
                  />
                </div> */}
                <div className="col-lg-2">
                  <ISelect
                    label="Supplier Name"
                    options={[]}
                    value={values?.supplier}
                    name="supplier"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* {isEdit ? (
                  ""
                ) : (
                  <div className="col-lg-1">
                    <button
                      type="button"
                      className="btn btn-primary mt-7"
                      disabled={values.poNumber === ""}
                      onClick={(e) => showrowDtoforPO(values.poNumber.value)}
                    >
                      Show
                    </button>
                  </div>
                )} */}
                {/* <div className="col-lg-2">
                  <ISelect
                    label="Cost Center"
                    options={costCenter}
                    value={values?.costCenter}
                    name="costCenter"
                    setFieldValue={setFieldValue}
                    isDisabled={isEdit}
                    errors={errors}
                    touched={touched}
                    dependencyFunc={(payload, allvalues, setter) => {
                      setter("projectName", "");
                    }}
                  />
                </div> */}
                <div className="col-lg-2">
                  <ISelect
                    label="Project Name"
                    options={projectName}
                    value={values?.projectName}
                    dependencyFunc={(payload, allvalues, setter) => {
                      //setter("costCenter", "");
                    }}
                    name="projectName"
                    setFieldValue={setFieldValue}
                    isDisabled={isEdit}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Service Received By"
                    options={serviceReceived}
                    value={values?.serviceReceive}
                    name="serviceReceive"
                    setFieldValue={setFieldValue}
                    isDisabled={isEdit}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Challan</label>
                  <InputField
                    value={values?.challanNO}
                    placeholder="Challan"
                    name="challanNO"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Challan Date</label>
                  <InputField
                    value={values?.challanDate}
                    placeholder="Challan Date"
                    type="date"
                    name="challanDate"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Vat Challan</label>
                  <InputField
                    value={values?.vatChallan}
                    placeholder="Vat Challan"
                    name="vatChallan"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Vat Amount</label>
                  <InputField
                    value={values?.vatAmmount}
                    placeholder="Vat Amount"
                    type="number"
                    name="vatAmmount"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Gate Entry No</label>
                  <InputField
                    value={values?.getEntry}
                    placeholder="Gate Entry No"
                    name="getEntry"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Freight</label>
                  <InputField
                    value={values?.freight}
                    placeholder="Freight"
                    name="freight"
                    disabled={true}
                    type="number"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Gross Discount</label>
                  <InputField
                    value={values?.grossDiscount}
                    placeholder="Gross Discount"
                    type="number"
                    disabled={true}
                    name="grossDiscount"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Commission</label>
                  <InputField
                    value={values?.commission}
                    placeholder="Commission"
                    name="Commission"
                    disabled={true}
                    type="number"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Vat Amount</label>
                  <InputField
                    value={vatAmount}
                    placeholder="Vat Amount"
                    name="vatAmount"
                    disabled={true}
                    type="number"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Product Cost</label>
                  <InputField
                    value={values?.productCost}
                    placeholder="Product Cost"
                    name="productCost"
                    disabled={true}
                    type="number"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values?.comment}
                    name="comment"
                    component={Input}
                    placeholder="Comment"
                    label="Comment"
                  />
                </div>
                <div className="col-lg-2">
                  <Field
                    value={values?.othersCharge}
                    name="othersCharge"
                    component={Input}
                    placeholder="Others Charge"
                    label="Others Charge"
                    type="number"
                    disabled
                  />
                </div>

                <div className={"col-lg-2 mt-5"}>
                  {!isEdit && (
                    <button
                      className="btn btn-primary mr-2 mt-2"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                  )}

                  {/* {values?.strDocumentId && (
                    <button
                      className="btn btn-primary mt-2"
                      type="button"
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(values?.strDocumentId)
                        );
                      }}
                    >
                      View
                    </button>
                  )} */}
                </div>
                {/* <div class="col-lg-3 mt-5">
                  <h6>Total Vat: {vatAmount}</h6>
                </div>  */}
                <div class="col-lg-6 mt-8 d-flex align-items-end justify-content-end">
                  <span className="mr-2 mt-auto font-weight-bold">
                    Vat : {totalVat.toFixed(4)}
                  </span>
                  <span className="mr-2 mt-auto font-weight-bold">
                    Amount : {(totalAmount - totalVat).toFixed(4)}
                  </span>
                  <span className="mr-2 mt-auto font-weight-bold">
                    Net Amount : {(netTotalValue - totalVat).toFixed(4)}
                  </span>
                </div>
              </div>

              {/* {id && (
                <div className="text-right mt-2">
                  <h6>Total Receive Amount {state?.receiveAmount}</h6>
                </div>
              )} */}

              <div className="my-1">
                <CreatePageTable
                  rowDto={rowDto}
                  rowDtoHandler={rowDtoHandler}
                  isEdit={isEdit}
                  remover={remover}
                />
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
                onClick={() => {
                  setRowDto([]);
                }}
              ></button>

              <DropzoneDialogBase
                filesLimit={5}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={10000000000}
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
