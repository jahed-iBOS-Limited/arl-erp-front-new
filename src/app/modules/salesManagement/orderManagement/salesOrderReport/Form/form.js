import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { useDispatch } from "react-redux";

import {
  getPartnerBalance_action,
  getReferenceItemlistById_Action,
  getReferenceWithItemListById_Action,
  getShipToPartner_Action,
  getUndeliveryValues_action,
  getAvailableBalance_Action,
  getCreditLimitForInternalUser_action,
  getTotalPendingQuantityAction,
  SetPartnerBalanceEmpty_Action,
  SetUndeliveryValuesEmpty_Action,
  SetAvailableBalanceEmpty_Action,
  getAllocateItemDDLAction,
} from "../_redux/Actions";
import { getPriceStructureCheck_Acion } from "./../_redux/Actions";
import ViewForm from "./viewModal";
import NewSelect from "../../../../_helper/_select";
import { Table } from "react-bootstrap";
import InputField from "./../../../../_helper/_inputField";
import { _formatMoney } from "../../../../_helper/_formatMoney";

// Validation schema
const validationSchema = Yup.object().shape({
  numItemPrice: Yup.number()
    .min(2, "Minimum 1 symbols")
    .max(10000000000000000000, "Maximum 10000000000000000000 symbols"),
  // .required("Price is required"),
  // .required("Discount No is required"),
  partnerReffNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols"),
  // .required("Comments is required"),
  narration: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols"),
  // .required("Party Ref. No is required"),
  pricingDate: Yup.date().required("Pricing Date is required"),
  dueShippingDate: Yup.date().required("Delivery Date is required"),
  // validity: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Validity is required"),
  soldtoParty: Yup.object().shape({
    label: Yup.string().required("Sold to Party is required"),
    value: Yup.string().required("Sold to Party is required"),
  }),
  currency: Yup.object().shape({
    label: Yup.string().required("Currency is required"),
    value: Yup.string().required("Currency is required"),
  }),
  refType: Yup.object().shape({
    label: Yup.string().required("Reference Type is required"),
    value: Yup.string().required("Reference Type is required"),
  }),
  // incoterm: Yup.object().shape({
  //   label: Yup.string().required("Incoterm is required"),
  //   value: Yup.string().required("Incoterm is required"),
  // }),
  paymentTerms: Yup.object().shape({
    label: Yup.string().required("Payment Terms is required"),
    value: Yup.string().required("Payment Terms is required"),
  }),
  shipToParty: Yup.object().shape({
    label: Yup.string().required("Ship To Party is required"),
    value: Yup.string().required("Ship To Party is required"),
  }),
  // shipToPartnerContactNo: Yup.number()
  // .test("shipToPartnerContactNo", "Maximum 11 number", function(value) {
  //   if(value){
  //     if(`${value}`.length === 11){
  //       return true
  //     }else {
  //       return false
  //     }
  //   }else {
  //     return true
  //   }
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  setter,
  soldToPartnerDDL,
  currencyListDDL,
  orderReferanceTypeDDL,
  BUalesOrgIncotermDDL,
  paymentTermsListDDL,
  accountId,
  selectedBusinessUnit,
  shipToPartner,
  itemPlantDDL,
  partnerBalance,
  remover,
  rowDto,
  referenceNoHandler,
  referenceNo,
  rowDtoHandler,
  itemUOMDDL,
  undeliveryValues,
  priceStructureCheck,
  itemOnChangeHandler,
  total,
  availableBalance,
  salesOrderApprovalHandler,
  modalShow,
  setModalShow,
  createSaveData,
  setRowDto,
  setSingleHeaderData,
  rowDtoHandlerPrice,
  creditLimitForInternalUser,
  rejectHandler,
  id,
  profileData,
  alotementDDL,
  setAlotementPrice,
  balanceCheckFunc,
}) {
  const dispatch = useDispatch();
  //M/S The Successors businessUnit
  const isTransportRate = selectedBusinessUnit?.value === 94;
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,

                paymentTerms:
                  paymentTermsListDDL?.length > 0 ? paymentTermsListDDL[0] : "",
                currency:
                  currencyListDDL?.length > 0
                    ? currencyListDDL.find((itm) => itm?.value === 141) || ""
                    : "",
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setModalShow(true);
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
              <div className="row mt-2">
                <div className="col-lg-12 m-0 p-0">
                  <div className="row global-form m-0">
                    <>
                      <div className="col-lg-3">
                        <ISelect
                          label="Select Sold to Party"
                          options={soldToPartnerDDL || []}
                          value={values.soldtoParty}
                          name="soldtoParty"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isDisabled={rowDto.length || isEdit}
                          dependencyFunc={(
                            currentValue,
                            value,
                            setter,
                            label,
                            valueOptions
                          ) => {
                            setter("shipToParty", "");
                            setter("numItemPrice", "");
                            setter("item", "");
                            setter("refType", "");
                            setFieldValue("alotement", "");
                            setAlotementPrice(0);
                            setRowDto([]);
                            if (currentValue) {
                              dispatch(
                                getShipToPartner_Action(
                                  accountId,
                                  selectedBusinessUnit.value,
                                  currentValue
                                )
                              );
                              dispatch(getPartnerBalance_action(currentValue));
                              dispatch(
                                getUndeliveryValues_action(currentValue)
                              );
                              dispatch(
                                getPriceStructureCheck_Acion(currentValue, 1)
                              );

                              dispatch(
                                getAvailableBalance_Action(currentValue)
                              );
                              dispatch(
                                getCreditLimitForInternalUser_action(
                                  currentValue
                                )
                              );
                              dispatch(
                                getTotalPendingQuantityAction(
                                  accountId,
                                  selectedBusinessUnit,
                                  { ...values, soldtoParty: valueOptions }
                                )
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ISelect
                          label="Ship To Party"
                          options={shipToPartner || []}
                          value={values.shipToParty}
                          name="shipToParty"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.soldtoParty || isEdit}
                          dependencyFunc={(
                            currentValue,
                            values,
                            setter,
                            label,
                            optionValue
                          ) => {
                            setter(
                              "shipToPartnerContactNo",
                              optionValue?.contactNumber || ""
                            );
                            setter(
                              "shiptoPartnerAddress",
                              optionValue?.shiptoPartnerAddress || ""
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <IInput
                          value={values.partnerReffNo}
                          label="Party Ref. No"
                          name="partnerReffNo"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ICalendar
                          label="Pricing Date"
                          name="pricingDate"
                          type="date"
                          errors={errors}
                          touched={touched}
                          value={values.pricingDate || ""}
                          disabled={isEdit}
                          onChange={(e) => {
                            setFieldValue("pricingDate", e.target.value);
                            setFieldValue("alotement", "");
                            setAlotementPrice(0);
                            dispatch(
                              getTotalPendingQuantityAction(
                                accountId,
                                selectedBusinessUnit,
                                { ...values, pricingDate: e.target.value }
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ICalendar
                          label="Delivery Date"
                          name="dueShippingDate"
                          type="date"
                          errors={errors}
                          touched={touched}
                          value={values.dueShippingDate}
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          label="Incoterm(Optional)"
                          options={BUalesOrgIncotermDDL || []}
                          value={values.incoterm}
                          name="incoterm"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          onChange={(valueOption) => {
                            setFieldValue("incoterm", valueOption);
                          }}
                          placeholder="Incoterm"
                        />
                      </div>
                      <div className="col-lg-3">
                        <ISelect
                          label="Payment Terms"
                          options={paymentTermsListDDL || []}
                          value={values.paymentTerms}
                          name="paymentTerms"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ISelect
                          label="Select Currency"
                          options={currencyListDDL || []}
                          value={values.currency}
                          name="currency"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <ISelect
                          label="Reference Type"
                          options={orderReferanceTypeDDL || []}
                          value={values.refType}
                          name="refType"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          dependencyFunc={(currentValue, value, setter) => {
                            referenceNoHandler(currentValue, values);
                            setter("referenceNo", "");
                            setter("quantityTop", "");
                            setter("item", "");
                          }}
                          isDisabled={
                            rowDto.length ||
                            isEdit ||
                            !values?.soldtoParty ||
                            !values.shipToParty
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Ship To Party Address</label>
                        <InputField
                          value={values?.shiptoPartnerAddress}
                          name="shiptoPartnerAddress"
                          placeholder="Ship To Party Address"
                          type="text"
                          required={values?.shiptoPartnerAddress}
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <IInput
                          value={values.narration || values.narration}
                          label="Comments"
                          name="narration"
                          disabled={isEdit}
                        />
                      </div>
                      {profileData?.accountId !== 1 && (
                        <>
                          <div className="col-lg-3 mt-4 text-center d-flex justify-content-around">
                            <div>
                              <label className="d-block" for="isTransshipment">
                                Transshipment
                              </label>
                              <Field
                                name={values.isTransshipment}
                                component={() => (
                                  <input
                                    disabled={isEdit}
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
                              <label
                                className="d-block"
                                for="isPartialShipment"
                              >
                                Partial Shipment
                              </label>
                              <Field
                                name={values.isPartialShipment}
                                component={() => (
                                  <input
                                    disabled={isEdit}
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
                        </>
                      )}

                      {!isEdit ? (
                        <>
                          <div className="col-lg-3">
                            <label>Contact Person Name</label>
                            <InputField
                              value={values?.shipToPartnerContactNoNameOnly}
                              name="shipToPartnerContactNoNameOnly"
                              placeholder="Contact Person Name"
                              type="text"
                              required={values?.shipToPartnerContactNo}
                              disabled={isEdit}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Contact Person No.</label>
                            <InputField
                              value={values?.shipToPartnerContactNo}
                              name="shipToPartnerContactNo"
                              placeholder="Contact Person No"
                              type="number"
                              required={values?.shipToPartnerContactNoNameOnly}
                              disabled={isEdit}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="col-lg-3">
                          <label>Contact Person Name & No.</label>
                          <InputField
                            value={values?.shipToPartnerContactNo}
                            name="shipToPartnerContactNo"
                            placeholder="Contact Number"
                            type="text"
                            disabled={isEdit}
                          />
                        </div>
                      )}

                      {/* If Magnum BUI = 171 Selected */}
                      {(selectedBusinessUnit?.value === 171 ||
                        selectedBusinessUnit?.value === 224) &&
                      values?.soldtoParty?.value ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name="productType"
                            options={[
                              {
                                value: "Straight",
                                label: "Straight",
                              },
                              {
                                value: "Bend",
                                label: "Bend",
                              },
                            ]}
                            value={values?.productType}
                            label="Product Type"
                            onChange={(valueOption) => {
                              setFieldValue("productType", valueOption);
                            }}
                            placeholder="Product Type"
                            errors={errors}
                            touched={touched}
                            disabled={isEdit}
                          />
                        </div>
                      ) : null}

                      {/* if 'Bongo Traders Ltd' BUI Select  */}
                      {selectedBusinessUnit?.isTredingBusiness &&
                        alotementDDL?.length > 0 && (
                          <div className="col-lg-3">
                            <NewSelect
                              name="alotement"
                              options={alotementDDL || []}
                              value={values?.alotement}
                              label="Alotement"
                              onChange={(valueOption) => {
                                setAlotementPrice(valueOption?.points || 0);
                                setFieldValue("item", "");
                                setFieldValue("uom", "");
                                setFieldValue("customerItemName", "");
                                setFieldValue("alotement", {
                                  ...valueOption,
                                  numQty: valueOption?.numQty || 0,
                                });
                                dispatch(
                                  getAllocateItemDDLAction(
                                    accountId,
                                    selectedBusinessUnit.value,
                                    valueOption?.value
                                  )
                                );
                              }}
                              placeholder="Alotement"
                              errors={errors}
                              touched={touched}
                              isDisabled={rowDto.length || !values?.soldtoParty}
                            />
                          </div>
                        )}

                      <div className="col-lg-12">
                        {partnerBalance && (
                          <p className="m-0 my-2">
                            <b>Ledger Balance: </b>
                            {_formatMoney(partnerBalance.ledgerBalance)},
                            <b className="ml-2">Credit Limit: </b>{" "}
                            {_formatMoney(creditLimitForInternalUser)},
                            <b className="ml-2">Unbilled Amount: </b>
                            {_formatMoney(partnerBalance.unbilledAmount)},
                            <b className="ml-2">Available Balance: </b>{" "}
                            {_formatMoney(availableBalance)},
                            <b className="ml-2">Undelivered Amount: </b>
                            {_formatMoney(
                              undeliveryValues?.unlideliveredValues
                            )}
                            {partnerBalance?.isDayLimit && (
                              <>
                                <b className="ml-2">Day Limit: </b>
                                {"true"}
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    </>
                  </div>
                </div>
                {/* End Left */}
              </div>
              <hr className="m-1"></hr>
              <div className="row">
                <div className="col-lg-12 m-0 p-0">
                  <div className="row global-form m-0">
                    <div className="col-lg-3">
                      <ISelect
                        label="Reference No."
                        options={referenceNo || []}
                        value={values.referenceNo}
                        name="referenceNo"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          values?.refType?.value === 1 || !values?.refType
                        }
                        dependencyFunc={(currentValue, value, setter) => {
                          setter("item", "");
                          dispatch(
                            getReferenceItemlistById_Action(
                              currentValue,
                              values.refType.value
                            )
                          );
                          dispatch(
                            getReferenceWithItemListById_Action(
                              values?.refType?.value,
                              currentValue
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemPlantDDL || []}
                        value={values?.item}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("quantityTop", "");
                          setFieldValue(
                            "customerItemName",
                            valueOption?.label || ""
                          );
                          setFieldValue("item", valueOption);
                          if (valueOption?.value) {
                            itemOnChangeHandler(
                              valueOption?.value,
                              values,
                              setFieldValue
                            );
                          }
                        }}
                        placeholder="Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          selectedBusinessUnit?.isTredingBusiness &&
                          alotementDDL?.length > 0
                            ? !values.soldtoParty ||
                              !values?.shipToParty ||
                              !values?.refType ||
                              !values?.alotement
                            : !values.soldtoParty ||
                              !values?.shipToParty ||
                              !values?.refType
                        }
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput
                        value={values?.customerItemName}
                        label="Customer Item Name"
                        name="customerItemName"
                        setFieldValue={setFieldValue}
                        disabled={selectedBusinessUnit?.value === 4}
                      />
                    </div>
                    <div className="col-lg-3">
                      <ISelect
                        label="Select UoM"
                        options={itemUOMDDL || []}
                        value={values?.uom}
                        name="uom"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={values?.refType?.value === 1 ? false : true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <IInput
                        value={values.quantityTop}
                        label="Quantity"
                        name="quantityTop"
                        disabled={values?.refType?.value === 1 ? false : true}
                        type="number"
                        min="0"
                        step="any"
                        onChange={(e) => {
                          /* if 'Bongo Traders Ltd' BUI Select */
                          if (selectedBusinessUnit?.isTredingBusiness) {
                            if (
                              +values?.alotement?.numQty >= e.target.value ||
                              +values?.alotement?.numQty === 0 ||
                              isNaN(values?.alotement?.numQty)
                            ) {
                              setFieldValue("quantityTop", e.target.value);
                            }
                          } else {
                            setFieldValue("quantityTop", e.target.value);
                          }
                        }}
                      />
                    </div>
                    {isTransportRate && (
                      <div className="col-lg-3">
                        <label>Transport Rate</label>
                        <InputField
                          value={values?.transportRate}
                          name="transportRate"
                          placeholder="Transport Rate"
                          type="number"
                          min="0"
                        />
                      </div>
                    )}
                    <div className="col-lg-1 mt-4">
                      <label className="d-block" for="allCheckbox">
                        All Item
                      </label>
                      <Field
                        name={values.allCheckbox}
                        component={() => (
                          <input
                            id="allCheckbox"
                            type="checkbox"
                            className="ml-2"
                            value={values.allCheckbox || ""}
                            checked={values.allCheckbox}
                            name={values.allCheckbox}
                            onChange={(e) => {
                              setFieldValue("allCheckbox", e.target.checked);
                            }}
                            disabled={!values.referenceNo}
                          />
                        )}
                        label="PartialShipment"
                      />
                    </div>

                    <div className="col-lg-1">
                      <button
                        onClick={() => {
                          setter(values);
                          setFieldValue("item", "");
                          setFieldValue("uom", "");
                          setFieldValue("customerItemName", "");
                          setFieldValue("quantityTop", "");
                          setFieldValue("transportRate", 0);
                        }}
                        disabled={
                          values?.refType?.value === 1
                            ? !values.uom ||
                              !values.quantityTop ||
                              !values.item ||
                              !values.refType ||
                              !values.shipToParty
                            : !values.refType || !values?.referenceNo
                        }
                        type="button"
                        className="btn btn-primary mt-6"
                      >
                        Add
                      </button>
                    </div>
                    <div className="offset-lg-3 col-lg-4 d-flex justify-content-lg-end">
                      {isEdit && (
                        <div className="right mt-4">
                          <button
                            onClick={() => {
                              salesOrderApprovalHandler();
                            }}
                            type="button"
                            className="btn btn-success mr-2"
                            // disabled={
                            //   availableBalance &&
                            //   availableBalance <= total.totalAmount
                            //     ? true
                            //     : false
                            // }
                            style={{
                              color: "#fff",
                              backgroundColor: "rgb(45 136 35)",
                              borderColor: "rgb(45 136 35)",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              rejectHandler(id);
                            }}
                            type="button"
                            className="btn btn-danger"
                          >
                            Rejected
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="col text-right">
                      <div className="left">
                        <div className="d-flex justify-content-end">
                          <span
                            className={balanceCheckFunc() ? "text-danger " : ""}
                          >
                            {" "}
                            <b className="">Total Amount: </b>
                            {total?.totalAmount.toFixed(2)}
                          </span>
                          <b className="ml-3">Total Qty: </b>{" "}
                          {total?.totalQty.toFixed(2)}
                          {/* if 'Bongo Traders Ltd' BUI Select */}
                          {selectedBusinessUnit?.isTredingBusiness && (
                            <div
                              className={
                                +values?.alotement?.numQty < 0
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              <b className="ml-3">Pending Quantity: </b>
                              {values?.alotement?.numQty}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Start */}
              <div className="row cash_journal bank-journal bank-journal-custom ">
                <div className="col-lg-12 pr-0 pl-0">
                  {rowDto?.length > 0 && (
                    <Table
                      responsive
                      className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
                    >
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
                          <th
                            style={
                              values?.refType?.value === 1
                                ? {}
                                : { minWidth: "100px" }
                            }
                          >
                            Quantity
                          </th>
                          {isTransportRate && <th>Transport Rate</th>}

                          <th
                            style={
                              values?.refType?.value === 1 &&
                              priceStructureCheck?.value
                                ? { minWidth: "100px" }
                                : {}
                            }
                          >
                            Basic Price
                          </th>
                          <th>Amount</th>
                          <th>Discount</th>
                          {/* <th>Price Structure</th> */}
                          <th>Net Value</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((itm, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="align-middle">
                              {itm.referenceNoName}
                            </td>
                            <td className="align-middle">
                              {itm.specification}
                            </td>
                            <td className="align-middle">
                              {itm.shipToPartnerName}
                            </td>
                            <td className="align-middle">{itm.itemCode}</td>
                            <td className="align-middle">{itm.itemName}</td>
                            <td className="align-middle">
                              {itm.customerItemName}
                            </td>
                            <td className="align-middle">{itm.uomName}</td>
                            <td className="align-middle">{itm.isFree}</td>
                            <td className="align-middle">
                              {values?.refType?.value === 1 ? (
                                rowDto[index]?.numRequestQuantity
                              ) : (
                                <IInput
                                  value={rowDto[index]?.numRequestQuantity}
                                  name="numRequestQuantity"
                                  type="number"
                                  required
                                  min="1"
                                  step="any"
                                  onChange={(e) =>
                                    rowDtoHandler(
                                      e.target.value,
                                      index,
                                      itm.numOrderValue,
                                      itm.numDiscountValue,
                                      itm.numItemPrice
                                    )
                                  }
                                />
                              )}
                            </td>
                            {isTransportRate && (
                              <td className="text-right">
                                {itm.transportRate}
                              </td>
                            )}

                            {values?.refType?.value === 1 &&
                            priceStructureCheck?.value ? (
                              <td className="align-middle">
                                <InputField
                                  value={rowDto[index]?.numItemPrice}
                                  name="numItemPrice"
                                  placeholder="Price"
                                  type="number"
                                  disabled={!priceStructureCheck?.value}
                                  min="0"
                                  step="any"
                                  onChange={(e) =>
                                    rowDtoHandlerPrice(
                                      e.target.value,
                                      index,
                                      itm.numOrderValue,
                                      itm.numDiscountValue,
                                      itm.numItemPrice,
                                      itm?.transportRate
                                    )
                                  }
                                />
                              </td>
                            ) : (
                              <td className="text-center">
                                {itm.numItemPrice}
                              </td>
                            )}

                            <td className="text-center">
                              {itm.numOrderValue.toFixed(2)}
                            </td>
                            <td className="text-center">
                              {itm.numDiscountValue}
                            </td>

                            <td className="text-center">
                              {itm.netValue.toFixed(2)}{" "}
                            </td>
                            <td className="text-center">
                              <i
                                className="fa fa-trash"
                                onClick={() => remover(index)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
              {/* Table End */}
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
                onClick={() => {
                  resetForm(initData);
                }}
              ></button>

              <ViewForm
                show={modalShow}
                onHide={() => {
                  setModalShow(false);
                  setSingleHeaderData("");
                  dispatch(SetPartnerBalanceEmpty_Action());
                  dispatch(SetAvailableBalanceEmpty_Action());
                  dispatch(SetUndeliveryValuesEmpty_Action());
                  setRowDto([]);
                }}
                createSaveData={createSaveData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
