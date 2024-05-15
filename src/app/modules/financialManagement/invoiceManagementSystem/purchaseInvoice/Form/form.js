import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getGRNDDL } from "../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import IView from "./../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";
import { QuantityCheck } from "../../../../_helper/_QuantityCheck";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import axios from "axios";
import AdvanceCreateModel from "./addvanceModel";
import { GetAdvanceForSupplierById } from "./../helper";

// Validation schema

// eslint-disable-next-line no-useless-escape
//const digitsOnly = (value) => /^\d*[\.{1}\d*]\d*$/.test(value) || value.length === 0;

const validationSchema = Yup.object().shape({
  invoiceNumber: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Bill No. is required"),
  SBU: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),

  purchaseOrder: Yup.object().shape({
    label: Yup.string().required("Purchase Order is required"),
    value: Yup.string().required("Purchase Order is required"),
  }),

  grossInvoiceAmount: Yup.number()
    .positive()
    .min(0, "Invoice Amount must be Positive Numbers")
    .required("Invoice Amount Required"),
  // .test('inputEntry', 'The field should have digits only', digitsOnly),
  deductionAmount: Yup.number()
    .positive()
    .min(0, "Deduction Invoice Amount must be Positive Numbers")
    .required("Deduction Invoice Amount Required"),
  invoiceDate: Yup.date().required("Invoice Date Required"),
  paymentDueDate: Yup.date().required("Payment Due Date Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setSBUDDL,
  // purchaseOrderDDLCall,
  setpurchaseOrderDDL,
  remover,
  addGRNtoTheGrid,
  grnGridData,
  totalGrn,
  grossInvoiceAmount,
  setginvoiceAmount,
  deductionAmount,
  setdeducationAmount,
  netPayment,
  id,
  getGRNDDLAction,
  grnDDLData,
  location,
  getSupplierDDLData,
  profileData,
  selectedBusinessUnit,
  setgrnDDLData,
  setFileObjects,
  fileObjects,
  setgrnGridData,
  purchaseOrderDDL,
  purchaseOrg,
  plantValue,
  warehouseValue,
  sbuValue,
}) {
  const [open, setOpen] = React.useState(false);
  const [isAdvanceCreateModel, setIsAdvanceCreateModel] = React.useState(false);
  const [advanceForSupplierById, setAdvanceForSupplierById] = React.useState(
    ""
  );
  const dispatch = useDispatch();
  console.log(advanceForSupplierById);
  useEffect(() => {
    if (id && initData) {
      getGRNDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData?.sbuid,
        initData?.plantId,
        initData?.warehouseId,
        initData?.purchaseOrderId,
        initData?.purchaseOrderNo,
        setgrnDDLData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          id
            ? initData
            : {
                ...initData,
                SBU: location?.selectSBU,
                purchaseOrg: location?.selectpurchaseOrg,
                plant: location?.selectplant,
                warehouse: location?.selectwarehouse,
                deductionAmount: 0,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setgrnDDLData([]);
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
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6">
                      <NewSelect
                        label="Select SBU"
                        options={setSBUDDL}
                        value={values?.SBU}
                        name="SBU"
                        isDisabled={id ? true : false}
                        errors={errors}
                        touched={touched}
                        onChange={(value) => {
                          setFieldValue("SBU", value);
                          setFieldValue("purchaseOrder", "");
                          // getPurchaseDDL(
                          //   profileData?.accountId,
                          //   selectedBusinessUnit?.value,
                          //   value.value,
                          //   purchaseOrg,
                          //   plantValue,
                          //   warehouseValue,
                          //   setpurchaseOrderDDL
                          // );
                          getSupplierDDLData(value);
                        }}
                      />
                    </div>

                    <div className="col-lg-6">
                      <label>Select PO Number</label>
                      <SearchAsyncSelect
                        selectedValue={values?.purchaseOrder}
                        handleChange={(valueOption) => {
                          setFieldValue("selectGRN", "");
                          setFieldValue("purchaseOrder", valueOption);
                          getGRNDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.SBU?.value,
                            values?.plant?.value,
                            values?.warehouse?.value,
                            valueOption?.value,
                            valueOption?.label,
                            setgrnDDLData
                          );
                          GetAdvanceForSupplierById(
                            valueOption?.value,
                            setAdvanceForSupplierById
                          );
                          setgrnGridData([]);
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrder/GetPurchaseOrderPIDDL2?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&SBUId=${values?.SBU?.value}&PurchaseOrganizationId=${purchaseOrg}&PlantId=${plantValue}&WarehouseId=${warehouseValue}&searchTerm=${v}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                                value: item.intPurchaseOrderId,
                                label: item.intPurchaseOrderNumber,
                              }));
                              return updateList;
                            });
                        }}
                        isDisabled={id ? true : false}
                      />
                      <FormikError
                        errors={errors}
                        name="purchaseOrder"
                        touched={touched}
                      />
                    </div>

                    {/* <div className="col-lg-6">
                      <ISelect
                        label="Select PO Number"
                        options={purchaseOrderDDL}
                        value={values?.purchaseOrder}
                        name="purchaseOrder"
                        onChange={(value) => {
                          setFieldValue("selectGRN", "");
                          setFieldValue("purchaseOrder", value);
                          getGRNDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.SBU?.value,
                            values?.plant?.value,
                            values?.warehouse?.value,
                            value?.value,
                            value?.label,
                            setgrnDDLData
                          );
                          setgrnGridData([])
                        }}
                        isDisabled={id ? true : false}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}

                    <div className="col-lg-6 pb-3">
                      <InputField
                        value={_dateFormatter(values?.invoiceDate)}
                        label="Invoice Date"
                        disabled={id ? true : false}
                        type="date"
                        name="invoiceDate"
                        placeholder="Invoice Date"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      <InputField
                        value={values?.invoiceNumber}
                        label="Bill No"
                        disabled={id ? true : false}
                        name="invoiceNumber"
                        placeholder="Bill No"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      {/* <label>Invoice Amount</label> */}
                      <InputField
                        style={{ border: "none" }}
                        value={grossInvoiceAmount}
                        label="Invoice Amount"
                        placeholder="Invoice Amount"
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            setginvoiceAmount(e.target.value);
                            setFieldValue("grossInvoiceAmount", e.target.value);
                          }
                        }}
                        name="grossInvoiceAmount"
                        type="number"
                        min="0"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      {/* <label>Deduction Amount</label> */}
                      <InputField
                        style={{ border: "none" }}
                        label="Deduction Amount"
                        placeholder="Deduction Amount"
                        value={deductionAmount}
                        onChange={(e) => {
                          const valid = QuantityCheck(e.target.value);
                          if (valid === false) return;
                          setdeducationAmount(e.target.value);
                          setFieldValue("deductionAmount", e.target.value);
                        }}
                        name="deductionAmount"
                        type="number"
                        min="0"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      <InputField
                        value={_dateFormatter(values?.paymentDueDate)}
                        label="Payment Due Date"
                        disabled={id ? true : false}
                        type="date"
                        name="paymentDueDate"
                        placeholder="Payment Due Date"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      <InputField
                        value={values?.remarks}
                        label="Comments"
                        name="remarks"
                        placeholder="Comments"
                      />
                    </div>

                    <div className={"col-lg-6 mt-3 d-flex align-items-center"}>
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {values?.attachmentId && (
                        <IView
                          classes="purchaseInvoiceAttachIcon"
                          clickHandler={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.attachmentId)
                            );
                          }}
                        />
                      )}
                    </div>
                    <div className="col-lg-12 mb-3"></div>
                    <div className="col-lg-6 pb-3 ">
                      <div className="customLable"> Total PO Amount</div>
                      <div>{values?.purchaseOrder?.totalPOAmount}</div>
                    </div>

                    <div className="col-lg-6 pb-3 ">
                      <div className="customLable"> Total GRN Amount</div>
                      <div>{totalGrn}</div>
                    </div>

                    <div className="col-lg-6 pb-3 ">
                      <div className="customLable">
                        Advance Adjustment Amount
                      </div>
                      <span>
                        {values?.purchaseOrder?.advanceAdjustmentAmount
                          ? "TK: " +
                            values?.purchaseOrder?.advanceAdjustmentAmount
                          : "TK: " + 0}
                        {/* <span className="pr-1">
                          <IView clickHandler={() => {}} />
                        </span> */}
                      </span>
                    </div>

                    <div className="col-lg-6 pb-3 ">
                      <div className="customLable">Deduction Amount</div>
                      <div>TK: {deductionAmount} </div>
                    </div>

                    <div className="col-lg-6 pb-3 ">
                      <div className="customLable">Net Payment Amount</div>
                      <div>TK: {netPayment} </div>
                    </div>
                    <div className="col-lg-6 pb-3 ">
                      <div className="customLable">Advance Amount</div>
                      <div>TK: {advanceForSupplierById?.fajk} </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 ">
                  <div className="row global-form tableBorder m-0">
                    <div className="col-lg-6">
                      <div className="space-between small">
                        <div className="customLable">Purchase Org :</div>
                        <div>
                          {" "}
                          {values?.purchaseOrder?.purchaseOrganizationName}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="space-between small">
                        <div className="customLable">Plant :</div>
                        <div> {values?.purchaseOrder?.plant}</div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="space-between small">
                        <div className="customLable">Warehouse :</div>
                        <div> {values?.purchaseOrder?.warehouseName}</div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="space-between small">
                        <div>
                          {" "}
                          <span className="customLable">Supplier : </span>{" "}
                          {values?.purchaseOrder?.supplierName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row global-form m-0">
                    <div className="col-lg-4">
                      <ISelect
                        label="Select GRN"
                        options={grnDDLData}
                        value={values?.selectGRN}
                        name="selectGRN"
                        setFieldValue={setFieldValue}
                        isDisabled={values?.checked === true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 no-gutters">
                      <div className="d-flex mt-6 ml-3">
                        <div className=" ml-2 mr-2">
                          <Field
                            type="checkbox"
                            name="checked"
                            checked={values?.checked}
                          />
                        </div>

                        <label>All GRN</label>
                      </div>
                    </div>
                    <div className="col-lg-6 mt-4">
                      <button
                        className="btn btn-primary mr-2"
                        onClick={(e) => {
                          addGRNtoTheGrid(values);
                          setFieldValue("selectGRN", "");
                        }}
                        type="button"
                        disabled={
                          values?.selectGRN || values?.checked ? false : true
                        }
                      >
                        Add
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          setIsAdvanceCreateModel(true);
                        }}
                        type="button"
                        disabled={!values?.purchaseOrder}
                      >
                        Create Advanced
                      </button>
                    </div>
                  </div>

                  {/* Start row part */}
                  <div className="row mt-2 ">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                          <thead className="bg-secondary">
                            <tr>
                              <th>SL</th>
                              <th style={{ width: "55%" }}>GRN No.</th>
                              <th>GRN Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {grnGridData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  {index + 1}
                                </td>
                                <td className="align-middle">
                                  <div className="pl-2">
                                    {item?.referenceName}
                                  </div>
                                </td>

                                <td className="align-middle table-input">
                                  <div className="pl-2">
                                    {item.referenceAmount}
                                  </div>
                                </td>
                                <td className="text-center align-middle table-input">
                                  <span onClick={() => remover(index)}>
                                    <IDelete />
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                  console.log("onSave", fileObjects);
                  setOpen(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
              <AdvanceCreateModel
                show={isAdvanceCreateModel}
                onHide={() => setIsAdvanceCreateModel(false)}
                purchaseInvoiceValues={values}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
