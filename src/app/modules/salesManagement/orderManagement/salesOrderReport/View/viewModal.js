import React, { useEffect, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getAvailableBalance_Action,
  getDataBySalesOrderId_Action,
  getPartnerBalance_action,
  getUndeliveryValues_action,
  SetAvailableBalanceEmpty_Action,
  SetPartnerBalanceEmpty_Action,
  SetUndeliveryValuesEmpty_Action,
  getCreditLimitForInternalUser_action,
} from "../_redux/Actions";
import { setSalesOrderSingleEmpty } from "./../_redux/Actions";
import { ISelect } from "./../../../../_helper/_inputDropDown";
import { Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { IInput } from "../../../../_helper/_input";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICalendar from "../../../../_helper/_inputCalender";
import Loading from "./../../../../_helper/_loading";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "./../../../../_helper/_inputField";


const initData = {
  id: undefined,
  soldtoParty: "",
  partnerReffNo: "",
  currency: "",
  pricingDate: _todayDate(),
  dueShippingDate: _todayDate(),
  isTransshipment: false,
  isPartialShipment: false,
  refType: "",
  incoterm: "",
  paymentTerms: "",
  validity: "",
  numItemPrice: "",
  referenceNo: "",
  shipToParty: "",
  item: "",
  customerItemName: "",
  allCheckbox: false,
  numDiscountValue: "",
  narration: "",
  numRequestQuantity: "",
  uom: "",
  shipToPartnerContactNo: "",
  shiptoPartnerAddress: "",
};

export default function ViewForm({ id, show, onHide }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ totalAmount: 0, totalQty: 0 });
  const dispatch = useDispatch();
  // edit page back single data remove
  useEffect(() => {
    return () => {
      dispatch(setSalesOrderSingleEmpty());
      dispatch(SetPartnerBalanceEmpty_Action());
      dispatch(SetAvailableBalanceEmpty_Action());
      dispatch(SetUndeliveryValuesEmpty_Action());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let salesOrderData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        partnerBalance: state.salesOrder.partnerBalance,
        undeliveryValues: state.salesOrder.undeliveryValues,
        availableBalance: state.salesOrder.availableBalance,
        creditLimitForInternalUser: state.salesOrder.creditLimitForInternalUser,
      };
    },
    { shallowEqual }
  );

  let {
    partnerBalance,
    undeliveryValues,
    availableBalance,
    profileData,
    selectedBusinessUnit,
    creditLimitForInternalUser,
  } = salesOrderData;

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(
        getDataBySalesOrderId_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          id,
          setLoading
        )
      );
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // get single sales order  unit from store
  const singleData = useSelector((state) => {
    return state.salesOrder?.singleData;
  }, shallowEqual);

  useEffect(() => {
    if (singleData?.objRow) {
      const newRowDto = singleData?.objRow.map((itm) => ({
        ...itm,
        netValue:
          itm.numOrderValue - (itm.numOrderValue * itm.numDiscountValue) / 100,
        isFree: itm.isFreeItem ? "Yes" : "No",
      }));
      setRowDto(newRowDto);
    } else {
      setRowDto([]);
    }
  }, [singleData]);
  // edit page Initial action call and data load
  useEffect(() => {
    if (id && singleData?.objHeader?.soldToPartnerId) {
      dispatch(
        getPartnerBalance_action(singleData?.objHeader?.soldToPartnerId)
      );
      dispatch(
        getUndeliveryValues_action(singleData?.objHeader?.soldToPartnerId)
      );
      dispatch(
        getAvailableBalance_Action(singleData?.objHeader?.soldToPartnerId, [+id], 1)
      );
      dispatch(
        getCreditLimitForInternalUser_action(
          singleData?.objHeader?.soldToPartnerId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, singleData]);

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalQty = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalAmount += +rowDto[i].netValue;
        totalQty += +rowDto[i].numRequestQuantity;
      }
    }
    setTotal({ totalAmount, totalQty });
  }, [rowDto]);
  //M/S The Successors businessUnit
  const isTransportRate = selectedBusinessUnit?.value === 94;
  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Sales Order"}
        isShow={singleData?.objHeader && false}
      >
        <Formik
          enableReinitialize={true}
          initialValues={singleData?.objHeader || initData}
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
              {loading && <Loading />}
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Sold to Party"
                      options={""}
                      value={values.soldtoParty}
                      name="soldtoParty"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Ship To Party"
                      options={""}
                      value={values.shipToParty}
                      name="shipToParty"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values.partnerReffNo}
                      label="Party Ref. No"
                      name="partnerReffNo"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ICalendar
                      label="Pricing Date"
                      name="pricingDate"
                      type="date"
                      errors={errors}
                      touched={touched}
                      value={_dateFormatter(values.pricingDate || "")}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ICalendar
                      label="Delivery Date"
                      name="dueShippingDate"
                      type="date"
                      errors={errors}
                      touched={touched}
                      value={_dateFormatter(values.dueShippingDate)}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Incoterm"
                      options={""}
                      value={values.incoterm}
                      name="incoterm"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Payment Terms"
                      options={""}
                      value={values.paymentTerms}
                      name="paymentTerms"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Currency"
                      options={""}
                      value={values.currency}
                      name="currency"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Reference Type"
                      options={""}
                      value={values.refType}
                      name="refType"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values.shiptoPartnerAddress}
                      label="Ship To Party Address"
                      name="shiptoPartnerAddress"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values.narration || values.narration}
                      label="Comments"
                      name="narration"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Ship To Party Contact No.</label>
                    <InputField
                      value={values?.shipToPartnerContactNo}
                      name="shipToPartnerContactNo"
                      placeholder="Ship To Party Contact No."
                      type="text"
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3 mt-4 text-center d-flex justify-content-around">
                    <div>
                      <label className="d-block" for="isTransshipment">
                        Transshipment
                      </label>
                      <Field
                        name={values.isTransshipment}
                        component={() => (
                          <input
                            disabled={true}
                            id="isTransshipment"
                            type="checkbox"
                            className="ml-2"
                            value={values.isTransshipment || ""}
                            checked={values.isTransshipment}
                            name={values.isTransshipment}
                            onChange={(e) => {
                              setFieldValue(
                                "isTransshipment",
                                e.target.checked
                              );
                            }}
                          />
                        )}
                        label="Transshipment"
                      />
                    </div>
                    <div>
                      <label className="d-block" for="isPartialShipment">
                        Partial Shipment
                      </label>
                      <Field
                        name={values.isPartialShipment}
                        component={() => (
                          <input
                            disabled={true}
                            id="isPartialShipment"
                            type="checkbox"
                            className="ml-2"
                            value={values.isPartialShipment || ""}
                            checked={values.isPartialShipment}
                            name={values.isPartialShipment}
                            onChange={(e) => {
                              setFieldValue(
                                "isPartialShipment",
                                e.target.checked
                              );
                            }}
                          />
                        )}
                        label="PartialShipment"
                      />
                    </div>
                  </div>
                  <div className="col-lg-9 mt-5 text-right">
                    {partnerBalance && (
                      // <p>
                      //   <b>Ledger Balance: </b>
                      //   {partnerBalance.ledgerBalance}, <b>Credit Limit: </b>{" "}
                      //   {partnerBalance.creditLimit}, <b>Unbilled Amount: </b>{" "}
                      //   {partnerBalance.unbilledAmount},{" "}
                      //   <b>Available Balance: </b> {availableBalance}{" "}
                      //   <b>Undelivered Amount: </b>{" "}
                      //   {undeliveryValues?.unlideliveredValues}
                      // </p>
                      <p className="m-0 my-2">
                        <b>Ledger Balance: </b>
                        {partnerBalance.ledgerBalance},
                        <b className="ml-2">Credit Limit: </b>{" "}
                        {creditLimitForInternalUser},
                        <b className="ml-2">Unbilled Amount: </b>
                        {partnerBalance.unbilledAmount},
                        <b className="ml-2">Available Balance: </b>{" "}
                        {availableBalance},
                        <b className="ml-2">Undelivered Amount: </b>
                        {undeliveryValues?.unlideliveredValues}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-lg-2 d-flex">
                    <b className="">Total Amount: </b> {total?.totalAmount}
                  </div>
                  <div className="col-lg-2">
                    <b className="">Total Qty: </b> {total?.totalQty}
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
        {/* Modal Grid */}

        <div className="react-bootstrap-table table-responsive">
          <table className={"table table-striped table-bordered global-table "}>
            <thead>
              <tr>
                <th>SL</th>
                <th>Reference No</th>
                <th>specification</th>
                <th>Ship To Party</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Customer Item Name</th>
                <th>Uom</th>
                <th>Is Free</th>
                <th>Quantity</th>
                {isTransportRate && <th>Transport Rate</th>}

                <th>Basic Price</th>
                <th>Amount</th>
                <th>Discount</th>

                <th>Net Value</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((itm, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="align-middle">{itm.referenceNoName}</td>
                    <td className="align-middle">{itm.specification}</td>
                    <td className="align-middle">{itm.shipToPartnerName}</td>
                    <td className="align-middle">{itm.itemCode}</td>
                    <td className="align-middle">{itm.itemName}</td>
                    <td className="align-middle">{itm.customerItemName}</td>
                    <td className="align-middle">{itm.uomName}</td>
                    <td className="align-middle">{itm.isFree}</td>
                    <td className="align-middle">{itm.numRequestQuantity}</td>
                    {isTransportRate && (
                      <td className="text-right">{itm.transportRate || 0}</td>
                    )}
                    <td className="text-right">
                      {_formatMoney(itm.numItemPrice)}
                    </td>
                    <td className="text-right">
                      {_formatMoney(itm.numOrderValue)}
                    </td>
                    <td className="align-middle">{itm.numDiscountValue}</td>

                    <td className="text-right">
                      {_formatMoney(
                        itm.numOrderValue -
                          (itm.numOrderValue * itm.numDiscountValue) / 100
                      )}{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </IViewModal>
    </div>
  );
}
