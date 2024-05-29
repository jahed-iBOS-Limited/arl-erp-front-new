/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form as FormikForm, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import { APIUrl } from "../../../../../App";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {
  getBillRegisterByPo,
  getInventoryReceiveReportDetails,
} from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import IView from "../../../../_helper/_helperIcons/_view";
import { InventoryTransactionReportViewTableRow } from "../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow";
import "./parchaseReport.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ViewInternalTransportBill from "../../../../financialManagement/invoiceManagementSystem/billregister/internalTransportBill/view/viewBillRegister";
import OthersBillView from "../../../../financialManagement/invoiceManagementSystem/billregister/othersBillNew/view/othersBillView";
import FairPriceShopInvoiceView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/fairPriceShopInvoiceView";
import ViewLabourBill from "../../../../financialManagement/invoiceManagementSystem/billregister/labourBill/view/viewBillRegister";
import ViewFuelBill from "../../../../financialManagement/invoiceManagementSystem/billregister/fuelBill/view/viewBillRegister";
import ViewTransportBill from "../../../../financialManagement/invoiceManagementSystem/billregister/transportBill/view/viewBillRegister";
import ViewSalesCommission from "../../../../financialManagement/invoiceManagementSystem/billregister/salesCommission/view/viewSalesCommission";
import ExpenseView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/expenseView";
import AdvForInternalView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/advForInternal";
import SupplierAdvanceView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplierAdvanceView";
import SupplerInvoiceView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplerInvoiceView";

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function ReceivePoReportView({ poId, isHiddenBackBtn, values }) {
  const [receivePurchaseOrder, setReceivePurchaseOrder] = useState("");
  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [billSummeryList, setBillSummeryList] = useState([]);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // getInventoryReceiveReportDetails
    getInventoryReceiveReportDetails(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      poId,
      setReceivePurchaseOrder
    );
    getBillRegisterByPo(poId, setBillSummeryList);
  }, [poId]);
  console.log("billSummeryList", billSummeryList);

  const printRef = useRef();
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => <button className="btn btn-primary">Print</button>}
              content={() => printRef.current}
            />
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              <FormikForm>
                <div id="pdf-section">
                  <div className="mx-5">
                    <div ref={printRef}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <img
                            style={{
                              width: "100px",
                              height: "80px",
                            }}
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                            alt="logo"
                          />
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <h3 className="my-2">
                            {selectedBusinessUnit?.organizationUnitReffName}
                          </h3>
                          <h6>{selectedBusinessUnit?.businessUnitAddress}</h6>
                          {/* <h4>Receive Purchase Order</h4> */}
                        </div>
                        <div></div>
                      </div>
                      <div className="my-2">
                        <h6 style={{ fontSize: "1.1rem" }}>Item Details</h6>
                        <div className="table-responsive">
                          <table
                            className="global-table table"
                            id="table-to-xlsx"
                          >
                            <thead className="tableHead">
                              <tr>
                                <th>SL</th>
                                <th>Challan Date</th>
                                <th>Transaction Code</th>
                                <th>Challan No</th>
                                <th>Gate Entry No</th>
                                <th>Total Amount</th>
                                <th>Total Quantity</th>
                                <th>Transaction Date</th>
                              </tr>
                            </thead>
                            <tbody className="tableHead">
                              {receivePurchaseOrder?.itemDetails?.map(
                                (data, i) => (
                                  <tr key={i}>
                                    <td className="text-center">{i + 1}</td>
                                    <td>{_dateFormatter(data?.challanDate)}</td>
                                    <td>
                                      {
                                        <span
                                          style={{
                                            textDecoration: "underline",
                                          }}
                                        >
                                          <Link
                                            onClick={() => {
                                              setIsShowModalTwo(true);
                                              setCurrentItem(data);
                                            }}
                                            to="#"
                                          >
                                            {data?.inventoryTransactionCode}
                                          </Link>
                                        </span>
                                      }
                                    </td>
                                    <td>{data?.challanNo}</td>
                                    <td>{data?.gateEntryNo}</td>
                                    <td className="text-right">
                                      {data?.totalAmount}
                                    </td>
                                    <td>{data?.totalQuantity || 0}</td>
                                    <td>
                                      {_dateFormatter(data?.transactionDate)}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "1.1rem" }}>Item Summary</h6>
                        <div className="table-responsive">
                          <table
                            className="global-table table"
                            id="table-to-xlsx"
                          >
                            <thead className="tableHead">
                              <tr>
                                <th>SL</th>
                                <th className="text-left">ITEM</th>
                                <th>Code</th>
                                <th>UoM</th>
                                <th>RCV Qty</th>
                                <th>Order Qty</th>
                              </tr>
                            </thead>
                            <tbody className="tableHead">
                              {receivePurchaseOrder?.itemSummary?.map(
                                (data, i) => (
                                  <tr>
                                    <td className="text-center">{i + 1}</td>
                                    <td>{data?.itemName}</td>
                                    <td>{data?.itemCode}</td>
                                    <td>{data?.uomName}</td>
                                    <td>{data?.receiveQuanttity || 0}</td>
                                    <td>{data?.orderQuanttity || 0}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="my-3">
                        <h6 style={{ fontSize: "1.1rem" }}>Bill Summary</h6>
                        <div className="table-responsive">
                          <table
                            className="global-table table"
                            id="table-to-xlsx"
                          >
                            <thead className="tableHead">
                              <tr>
                                <th>SL</th>
                                <th className="text-left">BIll Code</th>
                                <th>Bill Date</th>
                                <th>Type Name</th>
                                <th>Partner Name</th>
                                <th>Adj. Amount</th>
                                <th>Req. Amount</th>
                                <th>Approval Amount</th>
                                <th>Approve Date</th>
                                <th>Is Payment</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody className="tableHead">
                              {billSummeryList?.map((tableData, index) => (
                                <tr key={index}>
                                  <td> {tableData?.sl} </td>
                                  <td> {tableData?.billRegisterCode} </td>
                                  <td>
                                    {" "}
                                    {_dateFormatter(
                                      tableData?.billRegisterDate
                                    )}{" "}
                                  </td>
                                  <td> {tableData?.billTypeName} </td>
                                  {[4]?.includes(values?.billType?.value) && (
                                    <td>{tableData?.expenseGroup}</td>
                                  )}
                                  <td> {tableData?.partnerName} </td>
                                  <td
                                    className="text-right"
                                    style={
                                      tableData?.adjustmentAmount > 0
                                        ? { color: "red" }
                                        : {}
                                    }
                                  >
                                    {_fixedPoint(
                                      tableData?.adjustmentAmount || 0
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {tableData?.monTotalAmount}{" "}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {tableData?.monApproveAmount}{" "}
                                  </td>

                                  <td>
                                    {_dateFormatter(tableData?.approvalDate)}
                                  </td>

                                  <td className="text-center">
                                    {" "}
                                    {tableData?.requsetPosted
                                      ? "True"
                                      : "False"}{" "}
                                  </td>
                                  <td> {tableData?.billStatus} </td>
                                  <td> {tableData?.remarks} </td>
                                  <td>
                                    {tableData?.billType !== 5 && (
                                      <div className="d-flex justify-content-around align-items-center">
                                        <span className="view">
                                          <IView
                                            title={"Edit & View"}
                                            clickHandler={() => {
                                              setModalShow(true);
                                              setCurrentItem(tableData);
                                            }}
                                          />
                                        </span>
                                        {/* {values?.status?.value === 1 && (
                                      
                                      <span
                                        className="view"
                                        onClick={() => {
                                          setIsReject(true);
                                          setGridItem(tableData);
                                        }}
                                      >
                                        <IDelete title={"Bill Cancel"} />
                                      </span>
                                    )} */}
                                      </div>
                                    )}
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
              </FormikForm>
            </>
          )}
        </Formik>
        <IViewModal
          show={isShowModalTwo}
          onHide={() => setIsShowModalTwo(false)}
        >
          <InventoryTransactionReportViewTableRow
            Invid={currentItem?.inventoryTransactionId}
            grId={currentItem?.inventoryTransectionGroupId}
            currentRowData={currentItem}
          />
        </IViewModal>
        <IViewModal show={modalShow} onHide={() => setModalShow(false)}>
          {currentItem?.billType === 1 && (
            <SupplerInvoiceView
              gridItem={currentItem}
              laingValues={{
                ...values,
                status: {
                  value: 2,
                  label: "",
                },
              }}
              // girdDataFunc={girdDataFunc}
              setModalShow={setModalShow}
            />
          )}
          {currentItem?.billType === 2 && (
            <SupplierAdvanceView
              gridItem={currentItem}
              laingValues={{
                ...values,
                status: {
                  value: 2,
                  label: "",
                },
              }}
              bilRegister={true}
              // girdDataFunc={girdDataFunc}
              setModalShow={setModalShow}
            />
          )}
          {currentItem?.billType === 3 && (
            <AdvForInternalView
              gridItem={currentItem}
              laingValues={{
                ...values,
                status: {
                  value: 2,
                  label: "",
                },
              }}
              //girdDataFunc={girdDataFunc}
              setModalShow={setModalShow}
            />
          )}
          {currentItem?.billType === 4 && (
            <ExpenseView
              gridItem={currentItem}
              laingValues={{
                ...values,
                status: {
                  value: 2,
                  label: "",
                },
              }}
              //  girdDataFunc={girdDataFunc}
              setModalShow={setModalShow}
            />
          )}
          {currentItem?.billType === 7 && (
            <ViewSalesCommission billRegisterId={currentItem?.billRegisterId} />
          )}
          {currentItem?.billType === 6 && (
            <ViewTransportBill landingValues={values} gridItem={currentItem} />
          )}
          {currentItem?.billType === 8 && (
            <ViewFuelBill landingValues={values} gridItem={currentItem} />
          )}
          {(currentItem?.billType === 9 || currentItem?.billType === 10) && (
            <ViewLabourBill landingValues={values} gridItem={currentItem} />
          )}
          {currentItem?.billType === 11 && (
            <FairPriceShopInvoiceView
              gridItem={currentItem}
              laingValues={values}
              // girdDataFunc={girdDataFunc}
              setModalShow={setModalShow}
            />
          )}
          {currentItem?.billType === 12 && (
            <OthersBillView landingValues={values} gridItem={currentItem} />
          )}
          {currentItem?.billType === 13 && (
            <ViewInternalTransportBill
              landingValues={values}
              gridItem={currentItem}
            />
          )}
        </IViewModal>
      </ICustomCard>
    </>
  );
}
