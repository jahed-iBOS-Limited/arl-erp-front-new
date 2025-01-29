import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import IDelete from "./../../../_helper/_helperIcons/_delete";
import "../style.css";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import NewSelect from "./../../../_helper/_select";
import AddCustomerForm from "../addCustomer/AddCustomer";
import InvoiceList from "../invoiceList/InvoiceList";
import AddPayment from "./../addPayment/AddPayment";
import VoucherReprint from "../invoiceList/voucherReprint";
import HoldInvoice from "../invoiceList/holdInvoice";
import SalesReturn from "../invoiceList/salesReturn";
import { getSalesOrderByOrderId } from "../helper"


// Validation schema
const validationSchema = Yup.object().shape({
  // whName: Yup.string()
  //   .min(2, "Minimum 2 strings")
  //   .max(100, "Maximum 100 strings")
  //   .required("Holiday group name is required"),
});

export default function _Form({
  initData,
  resetBtnRef,
  saveHandler,
  salesOrderDDL,
  total,
  totalRate,
  rowDto,
  setRowDto,
  remover,
  setter,
  selectedBusinessUnit,
  bankNameDDL,
  profileData,
  id,
  updateQuantity,
  counterSummary,
  whName,
  holdingInvoice,
  setHoldingInvoice,
  counter,
  paidAmount,
  setPaidAmount,
  setId,
  setVoucherCode,
  voucherCode,
  salesReturnDto,
  updateSalesReturnQty,
  itemRateDDL,
  updateItemRate,
  setSingleData,
  setSalesReturnDto,
  isCheck,
  voucherReprintData,
  setVoucherReprintData,
  header,
  row,
  deleteHoldingDataHandler,
  isDisabled,
  cashReturnAmount,
  setCashReturnAmount
}) {
  const [loader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [gridData, setGridData] = React.useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [, setPaymentMode] = useState([]);
  const [holdInvoiceButtonClicked, setHoldInvoiceButtonClicked] =
    useState(true);
  const [voucherReprintButtonClicked, setVoucherReprintButtonClicked] =
    useState(false);
  const [salesReturnButtonClicked, setSalesReturnButtonClicked] =
    useState(false);

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/Pos/GetCustomerNameDDL?SearchTerm=${v}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&WarehouseId=${whName?.value}`
      )
      .then((res) => res?.data);
  };

  const loadItemList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/item/ItemSales/GetItemSalesforPOSDDL?SearchTerm=${v}&AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&WarehouseId=${whName?.value}`
      )
      .then((res) => res?.data);
  };

  const showPaymentModalForm = () => {
    setShowPaymentModal(true);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, false);
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            <Form
              className="form form-label-right"
              style={{ marginBottom: "-50px" }}
            >
              <div
                className="global-form"
                style={{
                  padding: "0px 10px 3px 10px",
                  margin: "5px 0px",
                  borderRadius: "5px",
                }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600" }}>
                        Customer
                      </label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        name="customer"
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          setVoucherCode("")
                        }}
                        placeholder="Name and Mobile Number"
                        loadOptions={loadCustomerList}
                      />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="row">
                      {/* <div className="col-lg-3 d-flex mt-6">
                        <input
                          style={{ width: "15px", height: "15px" }}
                          name="isSelect"
                          checked={isCheck}
                          className="form-control ml-5"
                          type="checkbox"
                          onChange={(e) => {
                            setIsCheck(!isCheck);
                            setFieldValue("customer", "");
                            setRowDto([])
                          }}
                        />
                        <label style={{ fontSize: "15px", paddingLeft: "5px", fontWeight: "600" }}>Online Sales</label>
                      </div> */}
                      <div className="col-lg-4 text-center">
                        <label style={{ fontSize: "12px", fontWeight: "600" }}>
                          Credit Limit
                        </label>
                        <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
                          {values?.customer?.creditLimit || 0}
                        </h2>
                      </div>
                      <div className="col-lg-4 text-center">
                        <label style={{ fontSize: "12px", fontWeight: "600" }}>
                          Remaining Amount
                        </label>
                        <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
                          {values?.customer?.remainingLimit || 0}
                        </h2>
                      </div>
                      <div className="col-lg-4 text-center">
                        <label style={{ fontSize: "12px", fontWeight: "600" }}>
                          Membership Point
                        </label>
                        <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
                          {values?.customer?.points || 0}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4" style={{borderLeft: '1px solid black', marginTop: "2px"}}>
                  <div className="row">
                      <div className="image-icon balance-data-show">
                        <h6
                          style={{
                            color: "white",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          Today's Sales
                        </h6>
                        <h6 style={{ color: "white", fontSize: "12px" }}>
                          {(
                            (counterSummary?.cashAmount || 0) +
                            (counterSummary.creditAmount || 0) +
                            (counterSummary.mfsAmount || 0) +
                            (counterSummary.cardAmount || 0)
                          ).toFixed(2)}
                        </h6>
                      </div>
                      <div className="image-icon balance-data-show">
                        <h6
                          style={{
                            color: "white",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          Cash Amount
                        </h6>
                        <h6 style={{ color: "white", fontSize: "12px" }}>
                          {(counterSummary?.cashAmount || 0).toFixed(2)}
                        </h6>
                      </div>
                      <div className="image-icon balance-data-show">
                        <h6
                          style={{
                            color: "white",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          Credit Amount
                        </h6>
                        <h6 style={{ color: "white", fontSize: "12px" }}>
                          {(counterSummary?.creditAmount || 0).toFixed(2)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="global-form"
                style={{
                  padding: "0px 10px 8px 10px",
                  margin: "5px 0px -3px 0px",
                  borderRadius: "5px",
                }}
              >
                <div className="row">
                  {isCheck?
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrder"
                        options={salesOrderDDL}
                        value={values?.salesOrder}
                        label="Sales Order"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrder", valueOption);
                          getSalesOrderByOrderId(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            whName?.value,
                            valueOption?.value, 
                            setSingleData, 
                            setRowDto
                          )
                        }}
                        placeholder="Sales Order"
                        errors={errors}
                        touched={touched}
                      />
                    </div>:
                    <div className="col-lg-3">
                      <label>Search Item/Scan Item</label>
                      <SearchAsyncSelect
                        selectedValue={values?.item}
                        name="item"
                        handleChange={(valueOption) => {
                          setFieldValue("item", "");
                          if (valueOption) {
                            setter({
                              rowId:0,
                              itemId: valueOption?.value,
                              mrp: valueOption?.mrp,
                              rate: valueOption?.rate,
                              availableStock: valueOption?.availableStock,
                              totalDiscountValue: values?.discount || 0,
                              itemCode: valueOption?.code,
                              itemName: valueOption?.label,
                              intUomId: valueOption?.uomId,
                              referenceId: valueOption?.referenceId,
                              uomName: valueOption?.uomName,
                              cogs: valueOption?.cogs || 0,
                              quantity: 0,
                              returnQuantity: 0,
                              itemRateDDL:itemRateDDL,
                              previousQuantity: 0,
                              locationId: valueOption?.locationId,
                              locationName: "string",
                              specification: "string",
                              isFreeItem: true,
                              isReturn: false,
                              total:
                                values?.quantity * values?.rate -
                                values?.discount,
                            });
                          }
                        }}
                        placeholder="Search Item/Scan Item"
                        loadOptions={loadItemList}
                      />
                    </div>
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <div style={{ height: "235px", overflow: 'auto', marginTop:"10px" }}>
                    {loader && <Loading />}
                    <table className="table table-striped table-bordered global-table" style={{margin:0}}>
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>UOM</th>
                          <th>Stock</th>
                          <th style={{ width: "120px" }}>Quantity</th>
                          <th style={{ width: "120px" }}>Rate</th>
                          <th>Sub Total</th>
                          <th style={{ width: "60px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody className="itemList">
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-left">{item?.itemName}</td>
                            <td>{item?.uomName}</td>
                            <td>{item?.availableStock}</td>
                            <td className="text-center">
                              <input
                                style={{ width: "100%", borderRadius: "5px" }}
                                key={item?.quantity}
                                type="number"
                                name="quantity"
                                value={item?.quantity?item?.quantity:item?.returnQuantity}
                                onChange={(e) => {
                                  if(e.target.value> -1){
                                    setFieldValue("quantity", e.target.value);
                                    updateQuantity(e.target.value, index);
                                    setFieldValue("rowDto", rowDto);
                                  }
                                }}
                                disabled={item?.returnQuantity}
                                autoFocus
                              />
                            </td>
                            <td className="text-center">
                              {(item?.isReturn || item?.isHold || item?.itemRateDDL?.length===1)?item?.rate:
                               <select 
                                  style={{ width: "100%", borderRadius: "5px" }}
                                  name="rate"
                                  defaultValue={item?.rate}
                                  onChange={(e) => {
                                    setFieldValue("rate", e.target.value)
                                    updateItemRate(item?.itemRateDDL[e.target.value], index)
                                  }}
                                > 
                                  <option hidden disabled selected="selected">Select Rate</option>
                                  {item?.itemRateDDL.map((data, i) => {
                                    return <option key={i} value={i}>{data.label}</option>;
                                  })}
                                </select>
                              }
                            </td>
                            <td className="text-right">
                              {item?.isReturn?(-item?.returnQuantity * item?.rate -
                                item?.totalDiscountValue || 0).toFixed(2):
                                (item?.quantity * item?.rate -
                                  item?.totalDiscountValue || 0).toFixed(2)
                              }
                            </td>
                            <td
                              className="text-right"
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                            >
                              <IDelete remover={remover} id={item?.itemName} />
                            </td>
                          </tr>
                        ))}
                        {rowDto.length > 0 && (
                          <tr key="total">
                            <td colSpan="5" style={{ fontWeight: "bold" }}>
                              Total
                            </td>
                            <td className="text-center" style={{ fontWeight: "bold" }}>{totalRate || 0}</td>
                            <td className="text-right" style={{ fontWeight: "bold" }}>{total.toFixed(2)}</td>
                            <td className="text-center"></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      float: "left",
                      display: "flex",
                      marginBottom: "10px",
                      width: "100%"
                    }}
                  >
                    <div className="payment-button">
                      <button
                        type="button"
                        className={
                          holdInvoiceButtonClicked
                            ? "btn btn-primary clicked-button"
                            : "btn btn-primary"
                        }
                        style={{
                          float: "left",
                          padding: "5px 10px 5px 10px",
                          margin: "0px",
                          borderRadius: "0px"
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setFieldValue("type", "cash");
                          setHoldInvoiceButtonClicked(true);
                          setVoucherReprintButtonClicked(false);
                          setSalesReturnButtonClicked(false);
                        }}
                      >
                        Hold Invoice
                      </button>
                      <button
                        type="button"
                        className={
                          voucherReprintButtonClicked
                            ? "btn btn-primary clicked-button"
                            : "btn btn-primary"
                        }
                        style={{
                          float: "left",
                          marginLeft: "5px",
                          padding: "5px 10px 5px 10px",
                          margin: "0px",
                          borderRadius: "0px",
                          borderLeft: "1px solid"
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setFieldValue("type", "card");
                          setHoldInvoiceButtonClicked(false);
                          setVoucherReprintButtonClicked(true);
                          setSalesReturnButtonClicked(false);
                        }}
                      >
                        Voucher Reprint
                      </button>
                      {/* <button
                        type="button"
                        className={
                          salesReturnButtonClicked
                            ? "btn btn-primary clicked-button"
                            : "btn btn-primary"
                        }
                        style={{
                          float: "left",
                          marginLeft: "5px",
                          padding: "5px 10px 5px 10px",
                          margin: "0px",
                          borderRadius: "0px",
                          borderLeft: "1px solid"
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setFieldValue("type", "both");
                          setHoldInvoiceButtonClicked(false);
                          setVoucherReprintButtonClicked(false);
                          setSalesReturnButtonClicked(true);
                        }}
                      >
                        Sales Exchange
                      </button> */}
                    </div>
                  </div>
                  {/* <div style={{display: 'block', width: '100%'}}>
                    <hr style={{margin: "38px 0px 0px 0px", borderTop: "2px solid #b5b5c3" }} />
                  </div> */}
                  <div>
                    {voucherReprintButtonClicked && (
                      <VoucherReprint 
                        counter={counter} 
                        loadCustomerList={loadCustomerList}
                        voucherReprintData={voucherReprintData}
                        setVoucherReprintData={setVoucherReprintData} 
                      />
                    )}
                    {holdInvoiceButtonClicked && (
                      <HoldInvoice
                        customerName={values?.customer?.label}
                        rowDto={rowDto}
                        holdingInvoice={holdingInvoice}
                        setHoldingInvoice={setHoldingInvoice}
                        id={id}
                        voucherCode={voucherCode}
                        setId={setId}
                        saveHandler={saveHandler}
                        values={values}
                        deleteHoldingDataHandler={deleteHoldingDataHandler}
                        total={parseFloat(
                          total +
                            (values?.shippingCharge || 0) +
                            total * (0 / 100) -
                            (values?.discountValueOnTotal || 0)
                        ).toFixed(2)}
                      />
                    )}
                    {salesReturnButtonClicked && (
                      <SalesReturn 
                        rowDto={salesReturnDto}
                        setVoucherCode={setVoucherCode}
                        values={values}
                        updateSalesReturnQty={updateSalesReturnQty}
                        setSingleData={setSingleData}
                        setSalesReturnDto={setSalesReturnDto}
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-3 total-bill-info-container">
                  <div className="total-bill-info">
                    <div className="bill-info">
                      <h6>Total Bill</h6>
                      <h5>
                        {parseFloat(
                          total +(values?.shippingCharge || 0)
                        ).toFixed(2)}
                      </h5>
                    </div>
                    {/* <div className="bill-info">
                      <h6>VAT</h6>
                      <h5>{vat?.percetage}%</h5>
                    </div> */}
                    <div className="bill-info">
                      <h6>Vat Amount</h6>
                      <h5>{parseFloat(total * (0 / 100)).toFixed(2)}</h5>
                    </div>
                    <div className="bill-info">
                      <h6>Others Charge</h6>
                      <h5>
                        <InputField
                          name="shippingCharge"
                          value={values?.shippingCharge || 0}
                          type="number"
                          errors={errors}
                          disabled={true}
                          touched={touched}
                        />
                      </h5>
                    </div>
                    <div className="bill-info">
                      <h6>Total Discount</h6>
                      <h5>
                        <InputField
                          name="discountValueOnTotal"
                          value={values?.discountValueOnTotal || 0}
                          type="number"
                          errors={errors}
                          disabled={true}
                          touched={touched}
                        />
                      </h5>
                    </div>
                    <div className="bill-info">
                      <h6>Net Total</h6>
                      <h5>
                        {parseFloat(
                          total +
                            (values?.shippingCharge || 0) +
                            total * (0 / 100) -
                            (values?.discountValueOnTotal || 0)
                        ).toFixed(2)}
                      </h5>
                    </div>
                    <div className="bill-info pay-button">
                      <h6 
                        onClick={() =>{
                          if(rowDto?.length===0){
                            return toast.warning("Please Select Item")
                          }
                          showPaymentModalForm()
                          setFieldValue("creditAmount", Math.round(
                            total +
                              (values?.shippingCharge || 0) +
                              total * (0 / 100) -
                              (values?.discountValueOnTotal || 0)
                          ))
                        }}
                      >
                        Pay {rowDto.length} Items TK. &nbsp;
                        {parseFloat(
                          total +
                            (values?.shippingCharge || 0) +
                            total * (0 / 100) -
                            (values?.discountValueOnTotal || 0)
                        ).toFixed(2)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() =>{
                  resetForm(initData)
                }}
              ></button>
            </Form>
            <AddPayment
              title="Add Payment"
              show={showPaymentModal}
              setPaymentMode={setPaymentMode}
              paidAmount={paidAmount}
              totalBill={Math.round(total + (values?.shippingCharge || 0))}
              netTotal={Math.round(total +
                  (values?.shippingCharge || 0) +
                  total * (0 / 100) -
                  (values?.discountValueOnTotal || 0))
              }
              totalDiscount={values?.discountValueOnTotal}
              setPaidAmount={setPaidAmount}
              setValues={setValues}
              values={values}
              customer={values?.customer}
              setFieldValue={setFieldValue}
              saveHandler={saveHandler}
              totalVat={parseFloat(total * (0 / 100))}
              bankNameDDL={bankNameDDL}
              onHide={() => setShowPaymentModal(false)}
              rowDto={row}
              errors={errors}
              touched={touched}
              header={header}
              profileData={profileData}
              isDisabled={isDisabled}
              cashReturnAmount={cashReturnAmount}
              setCashReturnAmount={setCashReturnAmount}
              counter={counter}
            />
          </>
        )}
      </Formik>
      <AddCustomerForm show={showModal} onHide={() => setShowModal(false)} />
      <InvoiceList
        show={showInvoiceList}
        onHide={() => setShowInvoiceList(false)}
        gridData={gridData}
        setGridData={setGridData}
      />
    </>
  );
}
