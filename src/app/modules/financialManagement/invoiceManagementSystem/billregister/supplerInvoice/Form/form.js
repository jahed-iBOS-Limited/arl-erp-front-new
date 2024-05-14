import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getGRNDDL } from "../../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import axios from "axios";
import { GetSupplierAmountInfo } from "../../helper";
//import { QuantityCheck } from "./../../../../../_helper/_QuantityCheck";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import { ISelect } from "./../../../../../_helper/_inputDropDown";
import InputField from "./../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "./../../../../../_helper/_redux/Actions";
import NewSelect from "./../../../../../_helper/_select";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import IView from "./../../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../../_helper/_viewModal";
import AttachmentComponent from "./AttachmentComponent";
import { InventoryTransactionReportViewTableRow } from "../../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow";
import { PurchaseOrderViewTableRow } from "../../../../../procurement/purchase-management/purchaseOrder/report/tableRow";
import { toast } from "react-toastify";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";

const validationSchema = Yup.object().shape({
  invoiceNumber: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Bill No. is required"),
  purchaseOrder: Yup.object().shape({
    label: Yup.string().required("Purchase Order is required"),
    value: Yup.string().required("Purchase Order is required"),
  }),
  purchaseOrg: Yup.object().shape({
    label: Yup.string().required("Purchase Org is required"),
    value: Yup.string().required("Purchase Org is required"),
  }),

  grossInvoiceAmount: Yup.number()
    .positive()
    .min(0, "Invoice Amount must be Positive Numbers")
    .required("Invoice Amount Required"),

  invoiceDate: Yup.date().required("Invoice Date Required"),
  paymentDueDate: Yup.date().required("Payment Due Date Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  headerData,
  remover,
  addGRNtoTheGrid,
  grnGridData,
  totalGrn,
  grnDDLData,
  getSupplierDDLData,
  profileData,
  selectedBusinessUnit,
  setgrnDDLData,
  setFileObjects,
  fileObjects,
  setgrnGridData,
  warehouse,
  purchaseOrg,
  tdsVdsAmount,
}) {
  const [open, setOpen] = React.useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [isShowModalThree, setIsShowModalThree] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  const [supplierAmountInfo, setSupplierAmountInfo] = React.useState("");
  const dispatch = useDispatch();

  const getDiff = () => {
    const total = grnGridData?.reduce((acc, item) => {
      return acc + Number(item?.referenceAmount);
    }, 0);
    const diff =
      (Number(supplierAmountInfo?.poAdvanceAmount?.toFixed(2)) || 0) -
      (Number(supplierAmountInfo?.totalAdjustedBalance?.toFixed(2)) || 0);
    return diff > total ? total : diff;
  };
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
            <Form className='form form-label-right'>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='row bank-journal bank-journal-custom bj-left'>
                    <div className='col-lg-6 pb-3'>
                      <NewSelect
                        name='purchaseOrg'
                        options={purchaseOrg || []}
                        value={values?.purchaseOrg}
                        label='Select Purchase Organization'
                        onChange={(valueOption) => {
                          setFieldValue("purchaseOrg", valueOption);
                        }}
                        placeholder='Select Purchase Organization'
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className='col-lg-6 pb-3'>
                      <NewSelect
                        name='warehouse'
                        options={warehouse || []}
                        value={values?.warehouse}
                        label='Select Warehouse'
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder='Select Warehouse'
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>

                    <div className='col-lg-6 pb-3'>
                      <InputField
                        value={_dateFormatter(values?.invoiceDate)}
                        label='Bill Date'
                        type='date'
                        name='invoiceDate'
                        placeholder='Bill Date'
                      />
                    </div>

                    <div className='col-lg-6 pb-3'>
                      <InputField
                        value={values?.invoiceNumber}
                        label='Bill No'
                        name='invoiceNumber'
                        placeholder='Bill No'
                      />
                    </div>

                    <div className='col-lg-6 pb-3'>
                      <label><b>Bill Amount</b></label>
                      <InputField
                        style={{ border: "none" }}
                        value={values?.grossInvoiceAmount}
                        placeholder='Bill Amount'
                        onChange={(e) => {
                          const number = String(Number(e?.target?.value));
                          if (+e?.target?.value > totalGrn) {
                            return;
                          }
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === "" ||
                            re.test(e.target.value)
                          ) {
                            setFieldValue("grossInvoiceAmount", number);
                            if (
                              Number(supplierAmountInfo?.poPendingAdjustment) >=
                              number
                            ) {
                              setFieldValue("new_Adv_Adjustment", number);
                            } else {
                              setFieldValue(
                                "new_Adv_Adjustment",
                                Number(supplierAmountInfo?.poPendingAdjustment)
                              );
                            }
                          }
                        }}
                        name='grossInvoiceAmount'
                        type='number'
                        step='any'
                        min='0'
                      />
                    </div>

                    <div className='col-lg-6 pb-1'>
                      <InputField
                        value={_dateFormatter(values?.paymentDueDate)}
                        label='Payment Due Date'
                        type='date'
                        name='paymentDueDate'
                        placeholder='Payment Due Date'
                      />
                    </div>

                    <div className='col-lg-12 pb-1'>
                      <InputField
                        value={values?.remarks}
                        label='Comments'
                        name='remarks'
                        placeholder='Comments'
                        type='text'
                      />
                    </div>
                    {/* <div className="col-lg-6">
                      <div className="d-flex mt-6 align-items-center ">
                        <div className="mr-2">
                          <input
                            type="checkbox"
                            name="advanceAdjustment"
                            checked={values?.advanceAdjustment}
                            onChange={(e) => {
                              setFieldValue(
                                "advanceAdjustment",
                                e.target.checked
                              );
                              setFieldValue("new_Adv_Adjustment", "");
                            }}
                            id="advanceAdjustment"
                          />
                        </div>
                        <label for="advanceAdjustment">
                          Advance Adjustment
                        </label>
                      </div>
                    </div> */}
                    {/* {values?.advanceAdjustment && ( */}
                    <>
                      {/* <div className="col-lg-6 pb-1">
                          <label> Pending Adv. Adjustment</label>
                          <InputField
                            value={values?.totalAdjustedBalance}
                            name="totalAdjustedBalance"
                            placeholder="Previous Adv. Adjustment"
                            type="number"
                            disabled
                          />
                        </div> */}
                      <div className='col-lg-6 pb-1'>
                        <InputField
                          value={values?.new_Adv_Adjustment}
                          label='New Adv. Adjustment'
                          name='new_Adv_Adjustment'
                          placeholder='New Adv. Adjustment'
                          type='number'
                          min='0'
                          disabled
                          style={{ border: "none" }}
                          onChange={(e) => {
                            if (
                              getDiff() - Number(e?.target?.value || 0) >=
                              0
                            ) {
                              setFieldValue(
                                "new_Adv_Adjustment",
                                e?.target?.value
                              );
                            }
                          }}
                        />
                      </div>
                      <div
                        className='col-lg-6 d-flex justify-content-between'
                        style={{
                          gap: "10px",
                        }}
                      >
                        <div>
                          <p className='my-0'>Remain</p>
                          <p
                            className='mb-0 mt-1'
                            style={
                              getDiff() -
                                Number(values?.new_Adv_Adjustment || 0) >
                              0
                                ? { color: "red" }
                                : { color: "green" }
                            }
                          >
                            <b>
                              {" "}
                              {getDiff() -
                                Number(values?.new_Adv_Adjustment || 0)}
                            </b>
                          </p>
                        </div>
                      </div>
                      <div className='col-lg-6 pb-1'>
                        <InputField
                          value={_fixedPoint(tdsVdsAmount?.numTDS || 0)}
                          label='TDS Amount'
                          name='numTDS'
                          type='text'
                          disabled
                        />
                      </div>{" "}
                      <div className='col-lg-6 pb-1'>
                        <InputField
                          value={_fixedPoint(tdsVdsAmount?.numVDS || 0)}
                          label='VDS Amount'
                          name='numVDS'
                          type='text'
                          disabled
                        />
                      </div>
                      <div className='col-lg-6 pb-1 d-flex '>
                        <div className='d-flex justify-content-start align-items-center'>
                          <input
                            type='checkbox'
                            id='checkbox_id'
                            checked={values?.isTDS}
                            name='isTDS'
                            onChange={(event) => {
                              setFieldValue("isTDS", event.target.checked);
                            }}
                          />
                          <label for='checkbox_id' className='mr-2 ml-3'>
                            Is TDS/VDS
                          </label>
                        </div>
                      </div>
                      <div className='col-lg-6 pb-1 d-flex '>
                        <div
                          className={
                            "d-flex align-items-center justify-content-start pb-1 "
                          }
                        >
                          <button
                            className='btn btn-primary'
                            type='button'
                            onClick={() => setOpen(true)}
                          >
                            Attachment
                          </button>
                          {values?.attachmentId && (
                            <IView
                              classes='purchaseInvoiceAttachIcon'
                              clickHandler={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    values?.attachmentId
                                  )
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </>
                    {/* )} */}
                    {/* <div className="col-lg-6 pb-1">
                      <label> Curent Adjustment Balance</label>
                      <InputField
                        value={values?.curentAdjustmentBalance}
                        name="curentAdjustmentBalance"
                        placeholder="Curent Adjustment Balance"
                        type="number"
                        disabled
                      />
                    </div> */}
                  </div>
                </div>
                <div className='col-lg-8 '>
                  <div className='row global-form tableBorder m-0 py-1'>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div className='customLable'>Plant :</div>
                        <div> {values?.purchaseOrder?.plant}</div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>Supplier : </span>
                          {values?.purchaseOrder?.supplierName}
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>Total PO Amount </span>
                          {values?.purchaseOrder?.totalPOAmount}
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>Total GRN Amount:</span>
                          {(values?.totalGRNAmount || 0) +
                            (values?.purchaseOrder?.totalVatAmount || 0)}
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>
                            Total Ledger Balance:{" "}
                          </span>
                          {supplierAmountInfo?.ledgerBalance}
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>
                            Total Advance Against PO:
                          </span>
                          {supplierAmountInfo?.poAdvanceAmount}
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>
                            Total Bill Amount:
                          </span>
                          {values?.purchaseOrder?.totalBillAmount || 0}
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>
                            Pending Adjustment Amount:
                          </span>
                          <span
                            style={
                              supplierAmountInfo?.poPendingAdjustment > 0
                                ? { color: "red" }
                                : {}
                            }
                          >
                            {/* {+supplierAmountInfo?.poPendingAdjustment -
                              +supplierAmountInfo?.totalAdjustedBalance || "0"} */}
                            {supplierAmountInfo?.poPendingAdjustment}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-4'>
                      <div className='space-between small'>
                        <div>
                          <span className='customLable'>
                            Total Adjusted Against PO:
                          </span>
                          {supplierAmountInfo?.poAdjustedAmount || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row global-form m-0'>
                    <div className='col-lg-4 pb-3'>
                      <label>
                        Select PO Number{" "}
                        <span
                          onClick={() => {
                            if (!values?.purchaseOrder)
                              return toast.warn("Please select PO Number");
                            setIsShowModalThree(true);
                          }}
                          className='text-primary pointer'
                        >
                          (View)
                        </span>{" "}
                      </label>
                      <SearchAsyncSelect
                        selectedValue={values?.purchaseOrder}
                        handleChange={(valueOption) => {
                          setFieldValue("selectGRN", "");
                          setFieldValue("purchaseOrder", valueOption);
                          setgrnGridData([]);
                          setFieldValue("warehouse", {
                            value: valueOption?.warehouseId,
                            label: valueOption?.warehouseName,
                          });

                          setFieldValue("purchaseOrg", {
                            value: valueOption?.purchaseOrganizationId,
                            label: valueOption?.purchaseOrganizationName,
                          });
                          setFieldValue("grossInvoiceAmount", "");
                          setFieldValue("new_Adv_Adjustment", "");
                          setFieldValue(
                            "totalGRNAmount",
                            valueOption?.totalGRNAmount
                          );

                          getGRNDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            headerData?.sbu?.value,
                            valueOption?.plantId,
                            valueOption?.warehouseId,
                            valueOption?.value,
                            valueOption?.label,
                            setgrnDDLData
                          );
                          GetSupplierAmountInfo(
                            valueOption?.value,
                            setSupplierAmountInfo,
                            setFieldValue
                          );

                          if (!valueOption) {
                            setSupplierAmountInfo({});
                            setFieldValue("poAdvanceAmount", "");
                          }
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrder/GetPurchaseOrderPIDDL2?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&SBUId=${headerData?.sbu?.value}&PlantId=${headerData?.plant?.value}&searchTerm=${v}`
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
                      />
                      <FormikError
                        errors={errors}
                        name='purchaseOrder'
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-4'>
                      <ISelect
                        label='Select GRN'
                        options={grnDDLData}
                        value={values?.selectGRN}
                        name='selectGRN'
                        setFieldValue={setFieldValue}
                        isDisabled={values?.checked === true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-2 no-gutters'>
                      <div className='d-flex mt-6 ml-3'>
                        <div className=' ml-2 mr-2'>
                          <Field
                            type='checkbox'
                            name='checked'
                            checked={values?.checked}
                          />
                        </div>

                        <label>All GRN</label>
                      </div>
                    </div>
                    <div className='col-lg-2 mt-4'>
                      <button
                        className='btn btn-primary mr-2'
                        onClick={(e) => {
                          addGRNtoTheGrid(
                            values,
                            setFieldValue,
                            supplierAmountInfo
                          );
                          setFieldValue("selectGRN", "");
                        }}
                        type='button'
                        disabled={
                          values?.selectGRN || values?.checked ? false : true
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Start row part */}
                  <div className='row mt-1 '>
                    <div className='col-lg-12'>
                    <div className="table-responsive">
                      <table className='table table-striped table-bordered global-table mt-0'>
                        <thead className='bg-secondary'>
                          <tr>
                            <th>SL</th>
                            <th style={{ width: "55%" }}>GRN No.</th>
                            <th>Challan No.</th>
                            <th>GRN Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grnGridData?.map((item, index) => (
                            <tr key={index}>
                              <td className='text-center align-middle'>
                                {index + 1}
                              </td>
                              <td
                                onClick={(e) => {
                                  setCurrentItem(item);
                                  setIsShowModalTwo(true);
                                }}
                                className='align-middle'
                              >
                                <div
                                  style={{ textDecoration: "underline" }}
                                  className='pl-2 text-primary pointer'
                                >
                                  {item?.referenceName}
                                </div>
                              </td>
                              <td
                                onClick={(e) => {
                                  setCurrentItem(item);
                                  setIsShowModal(true);
                                }}
                                className='align-middle'
                              >
                                <div
                                  style={{ textDecoration: "underline" }}
                                  className='pl-2 text-primary pointer'
                                >
                                  {item?.challanNo}
                                </div>
                              </td>

                              <td className='align-middle table-input'>
                                <div className='pl-2'>
                                  {item.referenceAmount}
                                </div>
                              </td>
                              <td className='text-center align-middle table-input'>
                                <span
                                  onClick={() => {
                                    remover(
                                      index,
                                      setFieldValue,
                                      supplierAmountInfo
                                    );
                                    setFieldValue(
                                      "grossInvoiceAmount",
                                      totalGrn -
                                        grnGridData[index].referenceAmount || 0
                                    );
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colspan='2'>
                              <b>Total Amount</b>
                            </td>
                            <td></td>
                            <td>
                              <b className='pl-2'>{totalGrn}</b>
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
                title='Attachment for GRN'
              >
                <AttachmentComponent currentItem={currentItem} />
              </IViewModal>

              <IViewModal
                show={isShowModalTwo}
                onHide={() => setIsShowModalTwo(false)}
                title='View GRN Statement'
              >
                <InventoryTransactionReportViewTableRow
                  Invid={currentItem?.referenceId}
                  grId={currentItem?.inventoryTransectionGroupId}
                  isHiddenBackBtn={true}
                />
              </IViewModal>

              <IViewModal
                show={isShowModalThree}
                onHide={() => setIsShowModalThree(false)}
                title='View Purchase Order'
              >
                <PurchaseOrderViewTableRow
                  poId={values?.purchaseOrder?.value}
                  orId={values?.purchaseOrder?.purchaseOrderTypeId}
                  isHiddenBackBtn={true}
                />
              </IViewModal>

              <button
                type='submit'
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type='reset'
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              <DropzoneDialogBase
                filesLimit={5}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={100000000000000}
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
