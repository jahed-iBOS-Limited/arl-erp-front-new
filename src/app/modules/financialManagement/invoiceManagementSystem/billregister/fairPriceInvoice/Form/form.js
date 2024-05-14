import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getPONumberDDL } from "../../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import IView from "../../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../../_helper/_viewModal";
import AttachmentComponent from "./AttachmentComponent";
import { FairPriceReportViewTableRow } from "../tableRow";
import { PurchaseOrderViewTableRow } from "../../../../../procurement/purchase-management/purchaseOrder/report/tableRow";

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
  remover,
  grnGridData,
  totalGrn,
  setFileObjects,
  fileObjects,
  setgrnGridData,
  warehouse,
  purchaseOrg,
}) {
  const [open, setOpen] = React.useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [isShowModalThree, setIsShowModalThree] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [PONumberDDL, setPoNumberDDL] = useState([]);
  const [totalGrnAmount, setTotalGrnAmount] = useState(0)

  // eslint-disable-next-line no-unused-vars
  const [supplierAmountInfo, setSupplierAmountInfo] = React.useState("");
  const dispatch = useDispatch();

  const getDiff = () => {
    const total = grnGridData?.reduce((acc, item) => {
      return acc + Number(item?.mrrAmount);
    }, 0);
    const diff =
      (Number(supplierAmountInfo?.poAdvanceAmount?.toFixed(2)) || 0) -
      (Number(supplierAmountInfo?.totalAdjustedBalance?.toFixed(2)) || 0);
    return diff > total ? total : diff;
  };

  useEffect(()=>{
    getPONumberDDL(setPoNumberDDL)
  }, [])

  useEffect(()=>{
    let total=0
    for(let item of grnGridData){
      total += item.mrrAmount
    }
    setTotalGrnAmount(total)
  }, [grnGridData])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6 pb-3">
                      <NewSelect
                        name="purchaseOrg"
                        options={purchaseOrg || []}
                        value={values?.purchaseOrg}
                        label="Select Purchase Organization"
                        onChange={(valueOption) => {
                          setFieldValue("purchaseOrg", valueOption);
                        }}
                        placeholder="Select Purchase Organization"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-6 pb-3">
                      <NewSelect
                        name="warehouse"
                        options={warehouse || []}
                        value={values?.warehouse}
                        label="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder="Select Warehouse"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      <InputField
                        value={_dateFormatter(values?.invoiceDate)}
                        label="Bill Date"
                        type="date"
                        name="invoiceDate"
                        placeholder="Bill Date"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      <InputField
                        value={values?.invoiceNumber}
                        label="Bill No"
                        name="invoiceNumber"
                        placeholder="Bill No"
                      />
                    </div>

                    <div className="col-lg-6 pb-3">
                      {/* <label>Invoice Amount</label> */}
                      <InputField
                        style={{ border: "none" }}
                        value={values?.grossInvoiceAmount}
                        label="Bill Amount"
                        placeholder="Bill Amount"
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
                          }
                        }}
                        name="grossInvoiceAmount"
                        type="number"
                        step="any"
                        min="0"
                      />
                    </div>

                    <div className="col-lg-6 pb-1">
                      <InputField
                        value={_dateFormatter(values?.paymentDueDate)}
                        label="Payment Due Date"
                        type="date"
                        name="paymentDueDate"
                        placeholder="Payment Due Date"
                      />
                    </div>

                    <div className="col-lg-6 pb-1">
                      <InputField
                        value={values?.remarks}
                        label="Comments"
                        name="remarks"
                        placeholder="Comments"
                        type="text"
                      />
                    </div>
                    <>
                      <div className="col-lg-4 pb-1">
                        <InputField
                          value={values?.new_Adv_Adjustment}
                          label="New Adv. Adjustment"
                          name="new_Adv_Adjustment"
                          placeholder="New Adv. Adjustment"
                          type="number"
                          min="0"
                          onChange={(e) => {
                            if (getDiff() - Number(e?.target?.value || 0) >= 0) {
                              setFieldValue(
                                "new_Adv_Adjustment",
                                e?.target?.value
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-2 d-flex flex-column justify-content-start">
                        <p className="my-0">Remaining</p>
                        <p
                          className="mb-0 mt-1"
                          style={
                            getDiff() -
                              Number(values?.new_Adv_Adjustment || 0) >
                            0
                              ? { color: "red" }
                              : { color: "green" }
                          }
                        >
                          {getDiff() - Number(values?.new_Adv_Adjustment || 0)}
                        </p>
                      </div>
                    </>
                    <div
                      className={
                        "col-lg-6 d-flex align-items-center justify-content-start pb-1 "
                      }
                    >
                      <button
                        className="btn btn-primary"
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
                  </div>
                </div>
                <div className="col-lg-8 ">
                  <div className="row global-form tableBorder m-0 py-1">
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div className="customLable">Plant :</div>
                        <div> {values?.purchaseOrder?.plant}</div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">Supplier : </span>
                          {values?.purchaseOrder?.supplierName}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">Total PO Amount </span>
                          {values?.purchaseOrder?.poAmount}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">Total GRN Amount:</span>
                          {totalGrnAmount +
                            (values?.purchaseOrder?.totalVatAmount || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">
                            Total Ledger Balance:{" "}
                          </span>
                          {supplierAmountInfo?.ledgerBalance}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">
                            Total Advance Against PO:
                          </span>
                          {supplierAmountInfo?.totalAdvanceAmount}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">
                            Total Bill Amount:
                          </span>
                          {values?.purchaseOrder?.totalBillAmount || 0}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">
                            Pending Adjustment Amount:
                          </span>
                          <span
                            style={
                              +supplierAmountInfo?.poAdvanceAmount -
                                +supplierAmountInfo?.totalAdjustedBalance >
                              0
                                ? { color: "red" }
                                : {}
                            }
                          >
                            {+supplierAmountInfo?.poAdvanceAmount -
                              +supplierAmountInfo?.totalAdjustedBalance || "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="space-between small">
                        <div>
                          <span className="customLable">
                            Total Adjusted Against PO:
                          </span>
                          {values?.purchaseOrder?.totalAdjustedBalance || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row global-form m-0">
                    <div className="col-lg-4 pb-3">
                      <NewSelect
                        options={PONumberDDL}
                        value={values?.PONumber}
                        name="PONumber"
                        placeholder="Select PO Number"
                        errors={errors}
                        touched={touched}
                        onChange={(valueOption) => {
                          console.log(valueOption)
                          setgrnGridData(valueOption?.mrrinfo)
                          setFieldValue("warehouse", valueOption);
                          setFieldValue("purchaseOrder", valueOption);
                          setFieldValue("warehouse", {
                            value: valueOption?.warehouseId,
                            label: valueOption?.warehouseName,
                          });

                          setFieldValue("purchaseOrg", purchaseOrg[0]);
                          setFieldValue(
                            "totalGRNAmount",
                            valueOption?.totalGRNAmount
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* Start row part */}
                  <div className="row mt-1 ">
                    <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table mt-0">
                        <thead className="bg-secondary">
                          <tr>
                            <th>SL</th>
                            <th style={{ width: "55%" }}>GRN No.</th>
                            <th>Challan No</th>
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
                              <td
                                onClick={() => {
                                  setCurrentItem(item);
                                  setIsShowModalTwo(true);
                                }}
                                className="align-middle"
                              >
                                <div
                                  style={{ textDecoration: "underline" }}
                                  className="pl-2 text-primary pointer"
                                >
                                  {item?.mrrCode}
                                </div>
                              </td>
                              <td className="align-middle table-input">
                                <div className="pl-2">
                                  {item?.challanNo}
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="pl-2">
                                  {item.mrrAmount}
                                </div>
                              </td>
                              <td className="text-center align-middle table-input">
                                <span
                                  onClick={() => {
                                    remover(index);
                                    setFieldValue(
                                      "grossInvoiceAmount",
                                      totalGrn -
                                        grnGridData[index].mrrAmount || 0
                                    );
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="2">
                              <b>Total Amount</b>
                            </td>
                            <td></td>
                            <td className="text-right">
                              <b className="pl-2">{totalGrn}</b>
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
                title="Attachment for GRN"
              >
                <AttachmentComponent currentItem={currentItem} />
              </IViewModal>

              <IViewModal
                show={isShowModalTwo}
                onHide={() => setIsShowModalTwo(false)}
                title="View GRN Statement"
              >
                <FairPriceReportViewTableRow
                  Invid={currentItem?.mrrId}
                  grId={currentItem?.inventoryTransectionGroupId}
                  isHiddenBackBtn={true}
                  itemInfo={currentItem?.objItemInfo}
                  purchaseOrder={values?.purchaseOrder}
                />
              </IViewModal>

              <IViewModal
                show={isShowModalThree}
                onHide={() => setIsShowModalThree(false)}
                title="View Purchase Order"
              >
                <PurchaseOrderViewTableRow
                  poId={values?.purchaseOrder?.value}
                  orId={values?.purchaseOrder?.purchaseOrderTypeId}
                  isHiddenBackBtn={true}
                />
              </IViewModal>

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
                filesLimit={5}
                acceptedFiles={["image/*"]}
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
