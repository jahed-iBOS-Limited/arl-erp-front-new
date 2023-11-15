import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "./../../../../_helper/_loading";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { BillApproved_api, GetSupplierInvoiceById_api } from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import InputField from "./../../../../_helper/_inputField";
import { getMultipleFileView_Action } from "./../../../../_helper/_redux/Actions";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import IViewModal from "../../../../_helper/_viewModal";
import { PurchaseOrderViewTableRow } from "./../../../../procurement/purchase-management/purchaseOrder/report/tableRow";

import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { InventoryTransactionReportViewTableRow } from "../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow";

import LastPriceDetails from "./LastPriceDetails";
import { lastPriceFunc } from "../../../../procurement/purchase-management/purchaseOrder/helper";
import { APIUrl } from "../../../../../App";
import { AdjustmentJournalViewTableRow } from "../../../financials/adjustmentJournal/report/tableRow";
import SupplierModal from "./supplierModal";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";

const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
  profitCenter: "",
};

const validationSchema = Yup.object().shape({
  approveAmount: Yup.number()
    .min(0, "Minimum 0 number")
    .required("Approve amount required")
    .test("approveAmount", "Max net payment amount", function(value) {
      return this.parent.approveAmountMax >= value;
    }),
});
function _Form({ gridItem, laingValues, girdDataFunc, setModalShow }) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [disabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  useEffect(() => {
    if (gridItem?.billRegisterId) {
      GetSupplierInvoiceById_api(
        gridItem?.billRegisterId,
        selectedBusinessUnit?.value,
        setSingleData,
        setDisabled
      );
    }
  }, [gridItem, selectedBusinessUnit]);

  const objHeaderDTO = singleData?.objHeaderDTO;
  const printRef = useRef();
  const [pomodalShow, setModalPOShow] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [journalId, setJournalId] = useState("");
  const [isShowSupplierLedgerModal, setIsSupplierLedgerModal] = useState(false);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const saveHandler = (values) => {
    let netPaymentAmount = +parseInt(
      singleData?.objHeaderDTO?.netPaymentAmount || 0
    );
    let approvalAmount = parseInt(+values?.approveAmount || 0);
    if (
      gridItem?.billType === 1 &&
      netPaymentAmount !== approvalAmount &&
      !values?.profitCenter?.value
    ) {
      return toast.warn("Profit Center is required");
    }

    const modifyGridData = {
      billId: gridItem?.billRegisterId,
      unitId: selectedBusinessUnit?.value,
      billTypeId: gridItem?.billType,
      approvedAmount: +values?.approveAmount,
      remarks: values?.remarks || "",
      profitCenterId: values?.profitCenter?.value || 0,
    };
    const payload = {
      bill: [modifyGridData],
      row: [],
    };
    BillApproved_api(
      profileData?.userId,
      payload,
      setDisabled,
      girdDataFunc,
      values,
      setModalShow
    );
  };

  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [
    profitCenterList,
    getProfitCenterList,
    ,
    setProfitCenterList,
  ] = useAxiosGet();

  useEffect(() => {
    getProfitCenterList(
      `fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const result = data?.map((item) => ({
          ...item,
          value: item.profitCenterId,
          label: item.profitCenterName,
        }));
        setProfitCenterList(result);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...laingValues,
            ...initData,
            approveAmount: singleData?.objHeaderDTO?.netPaymentAmount,
            approveAmountMax: singleData?.objHeaderDTO?.netPaymentAmount,
          }}
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
            <div className="">
              {disabled && <Loading />}
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Supplier invoice View"}>
                  <CardHeaderToolbar>
                    {laingValues?.status?.value &&
                      laingValues?.status?.value !== 2 && (
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary ml-2"
                          type="submit"
                          isDisabled={disabled}
                        >
                          Save
                        </button>
                      )}
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <Form
                    className="form form-label-right approveBillRegisterView"
                    componentRef={printRef}
                    ref={printRef}
                  >
                   
                    {laingValues?.status?.value &&
                      laingValues?.status?.value !== 2 && (
                        <div className="row global-form printSectionNone">
                          {gridItem?.billType === 1 &&
                          parseInt(
                            singleData?.objHeaderDTO?.netPaymentAmount || 0
                          ) !== parseInt(+values?.approveAmount || 0) ? (
                            <div className="col-lg-3">
                              <NewSelect
                                name="profitCenter"
                                options={profitCenterList || []}
                                value={values?.profitCenter}
                                label="Profit Center"
                                onChange={(valueOption) => {
                                  setFieldValue("profitCenter", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          ) : (
                            <div className="col-lg-3"></div>
                          )}
                          <div className="col-lg-3">
                            <label>Remarks</label>
                            <InputField
                              value={values?.remarks}
                              name="remarks"
                              placeholder="Remarks"
                              type="text"
                            />
                          </div>
                          <div className="col-lg-3 ">
                            <label>Approve Amount</label>
                            <InputField
                              value={values?.approveAmount}
                              name="approveAmount"
                              placeholder="Approve Amount"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("approveAmount", +e.target.value);
                                setFieldValue("profitCenter", "");
                              }}
                              max={singleData?.objHeaderDTO?.netPaymentAmount}
                              required
                            />
                          </div>
                        </div>
                      )}

                    <div className="row">
                      <div className="col-lg-12 ">
                        <div
                          style={{
                            position: "absolute",
                            left: "15px",
                            top: "0",
                          }}
                        >
                          <img
                            style={{ width: "55px" }}
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                            alt=""
                          />
                        </div>
                        <div
                          className="text-center"
                          style={{ position: "relative" }}
                        >
                          <h2>{selectedBusinessUnit?.label}</h2>
                          <h5>{selectedBusinessUnit?.address} </h5>
                          <h3>Supplier invoice</h3>
                          <button
                            style={{
                              padding: "4px 4px",
                              position: "absolute",
                              top: "2px",
                              right: "70px",
                            }}
                            onClick={() => {
                              dispatch(
                                getMultipleFileView_Action(
                                  objHeaderDTO?.billImages
                                )
                              );
                            }}
                            className="btn btn-primary ml-2 printSectionNone"
                            type="button"
                          >
                            Preview <i class="far fa-images"></i>
                          </button>
                          <ReactToPrint
                            pageStyle={
                              "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                            }
                            trigger={() => (
                              <button
                                type="button"
                                className="btn btn-primary printSectionNone"
                                style={{
                                  padding: "2px 5px",
                                  position: "absolute",
                                  top: "0",
                                  right: "0",
                                }}
                              >
                                <img
                                  style={{
                                    width: "25px",
                                    paddingRight: "5px",
                                  }}
                                  src={printIcon}
                                  alt="print-icon"
                                />
                                Print
                              </button>
                            )}
                            content={() => printRef.current}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3 mb-5">
                      <div className="col-lg-12 ">
                        <div className="info d-flex flex-wrap">
                          {singleData?.objHeaderDTO?.approvedAmount ? (
                            <p className="pr-4 m-0">
                              <b>Payment Amount: </b>
                              {singleData?.objHeaderDTO?.approvedAmount}
                            </p>
                          ) : (
                            ""
                          )}

                          <p className="pr-4 m-0">
                            <b>SBU: </b> {objHeaderDTO?.sbuname}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Purchase Org: </b>
                            {objHeaderDTO?.purchaseOrganizationName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Plant: </b> {objHeaderDTO?.plantName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Warehouse: </b> {objHeaderDTO?.warehouseName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Supplier Name: </b> {objHeaderDTO?.supplierName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Account no: </b>
                            {objHeaderDTO?.supplierBankAccNo}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Account Name: </b>
                            {objHeaderDTO?.supplierBankAccName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Branch Name: </b>
                            {objHeaderDTO?.supplierBankBranchName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Bank Name: </b>
                            {objHeaderDTO?.supplierBankName}
                          </p>
                          <p className="pr-4 m-0">
                            <b>Purchase Order: </b>{" "}
                            <span
                              style={{ cursor: "pointer" }}
                              className="text-primary"
                              onClick={() => {
                                setModalPOShow(true);
                              }}
                            >
                              {" "}
                              {objHeaderDTO?.purchaseOrderNo}
                            </span>
                            {/* <Link style={{}} to={`/mngProcurement/purchase-management/purchaseorder/report/${objHeaderDTO?.purchaseOrderId}/1`}>{objHeaderDTO?.purchaseOrderNo}</Link>  */}
                          </p>
                          <p className="pr-4">
                            <b>Bill No.: </b> {objHeaderDTO?.invoiceNumber}
                          </p>
                          <p className="pr-4">
                            <b>Invoice Date: </b>
                            {_dateFormatter(objHeaderDTO?.invoiceDate)}
                          </p>
                          <p className="pr-4">
                            <b>Comments: </b> {objHeaderDTO?.remarks}
                          </p>
                          <p className="pr-4">
                            <b>Supplier Ledger : </b>
                            <span
                              style={{ cursor: "pointer" }}
                              className="text-primary"
                              onClick={() => {
                                setIsSupplierLedgerModal(true);
                              }}
                            >
                              Details
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="d-flex justify-content-between">
                          <p>
                            <b>Bill Date:</b>{" "}
                            {_dateFormatter(
                              singleData?.objHeaderDTO?.billPaymentDate
                            )}
                          </p>
                          <p style={{ marginRight: "5px" }}>
                            <b>Bill Code:</b>{" "}
                            {singleData?.objHeaderDTO?.billCode}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-12 ">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "300px" }}>GRN No.</th>
                                <th style={{ width: "300px" }}>Inv JV</th>
                                <th style={{ width: "300px" }}>Item Name</th>
                                <th style={{ width: "300px" }}>Uom</th>
                                <th style={{ width: "300px" }}>Last Price</th>
                                <th style={{ width: "300px" }}>Price</th>
                                <th style={{ width: "300px" }}>Quantity</th>
                                <th style={{ width: "150px" }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {singleData?.objRowListDTO?.map((item, index) => (
                                <tr key={index}>
                                  <td> {index + 1}</td>
                                  <td>
                                    <div
                                      onClick={() => {
                                        setCurrentItem(item);
                                        setIsShowModalTwo(true);
                                      }}
                                      className="text-primary pointer"
                                    >
                                      {item?.referenceName}
                                    </div>
                                  </td>
                                  <td>
                                    {" "}
                                    {item?.isAccounts ? (
                                      <span
                                        onClick={(e) => {
                                          setJournalId(item?.journalId);
                                          setIsShowModal(true);
                                        }}
                                        className="text-primary pointer"
                                      >
                                        {item?.journalCode}
                                      </span>
                                    ) : (
                                      <span
                                        onClick={(e) => {
                                          setJournalId(item?.journalId);
                                          setIsShowModal(true);
                                        }}
                                        className="text-danger pointer"
                                      >
                                        {item?.journalCode}
                                      </span>
                                    )}
                                  </td>
                                  <td> {item?.itemName}</td>
                                  <td> {item?.uomName}</td>
                                  <td className="text-primary pointer">
                                    <div
                                      onClick={(e) => {
                                        setCurrentItem(item);
                                        handlePopoverOpen(e);
                                      }}
                                      className="text-primary pointer"
                                    >
                                      {lastPriceFunc(item?.lastPoInfo)}
                                    </div>
                                  </td>
                                  <td>
                                    {" "}
                                    {numberWithCommas(
                                      (
                                        item?.transectionValue /
                                        item?.transectionQty
                                      ).toFixed(2)
                                    )}
                                  </td>
                                  <td> {item?.transectionQty}</td>
                                  <td>
                                    {numberWithCommas(
                                      (item?.transectionValue || 0).toFixed(2)
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-lg-12 d-flex justify-content-end">
                        <div
                          className="approverSupplerInvoice"
                          style={{ width: "309px" }}
                        >
                          <div className="">
                            <div className="payment-border d-flex justify-content-between">
                              <span>Total GRN Amount</span>
                              <span>
                                {numberWithCommas(
                                  (
                                    singleData?.objHeaderDTO
                                      ?.totalReferenceAmount || 0
                                  ).toFixed(2)
                                )}
                                TK
                              </span>
                            </div>
                            <div className="payment-border d-flex justify-content-between">
                              <span>Gross Invoice Amount</span>
                              <span>
                                {numberWithCommas(
                                  (
                                    singleData?.objHeaderDTO
                                      ?.grossInvoiceAmount || 0
                                  ).toFixed(2)
                                )}
                                TK
                              </span>
                            </div>
                            <div className="payment-border d-flex justify-content-between">
                              <span>Deduction Amount</span>
                              <span>
                                {numberWithCommas(
                                  (
                                    singleData?.objHeaderDTO?.deductionAmount ||
                                    0
                                  ).toFixed(2)
                                )}
                                TK
                              </span>
                            </div>
                            <div className="payment-border d-flex justify-content-between">
                              <span>Advance Adjustment Amount</span>
                              <span>
                                {numberWithCommas(
                                  (
                                    singleData?.objHeaderDTO
                                      ?.advanceAdjustmentAmount || 0
                                  ).toFixed(2)
                                )}
                                TK
                                {/* <span>
                            <IView />
                          </span> */}
                              </span>
                            </div>
                            <div className="payment-border d-flex justify-content-between">
                              <span>Net Payment Amount</span>
                              <span>
                                {numberWithCommas(
                                  (
                                    singleData?.objHeaderDTO
                                      ?.netPaymentAmount || 0
                                  ).toFixed(2)
                                )}
                                TK
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <LastPriceDetails
                      anchorEl={anchorEl}
                      setAnchorEl={setAnchorEl}
                      currentItem={currentItem}
                    />
                  </Form>
                </CardBody>
              </Card>
              <>
                <IViewModal
                  show={pomodalShow}
                  onHide={() => {
                    setModalPOShow(false);
                  }}
                >
                  <PurchaseOrderViewTableRow
                    poId={objHeaderDTO?.purchaseOrderId}
                    orId={objHeaderDTO?.purchaseOrderTypeId || 1}
                    isHiddenBackBtn={true}
                  />
                </IViewModal>
                <IViewModal
                  show={isShowModalTwo}
                  onHide={() => setIsShowModalTwo(false)}
                  title="View GRN Statement"
                >
                  <InventoryTransactionReportViewTableRow
                    Invid={currentItem?.referenceId}
                    grId={currentItem?.inventoryTransectionGroupId}
                    isHiddenBackBtn={true}
                  />
                </IViewModal>
              </>
            </div>
          )}
        </Formik>
      </>
      <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
        <AdjustmentJournalViewTableRow id={journalId} />
      </IViewModal>
      <IViewModal
        show={isShowSupplierLedgerModal}
        onHide={() => setIsSupplierLedgerModal(false)}
      >
        <SupplierModal
          gridItem={gridItem}
          partnerTypeId={1}
          partnerTypeName={"Supplier"}
        />
      </IViewModal>
    </div>
  );
}

export default _Form;
