/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
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
import {
  getOrderPendingDetails,
  logisticByDDL,
  GetPendingQuantityDetails,
  getUnBilledAmountDetails,
  GetTradeOffersApi,
} from "../helper";
import { isBooleanDDL } from "./../helper";
import IViewModal from "../../../../_helper/_viewModal";
import DetailsView from "./detailsView";
import OfferDetailsModel from "./offerDetailsModel";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import StockInfo from "./stockInfo";
import useDebounce from "../../../../_helper/customHooks/useDebounce";

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
  shiptoPartnerAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Ship To Party Address is required"),
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
  waterProofRate: Yup.number().moreThan(
    0,
    "Input value must be greater than zero"
  ),
  pumpChargeRate: Yup.number().moreThan(
    0,
    "Input value must be greater than zero"
  ),

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
  transportZoneDDL,
  headerData,
  setDisabled,
  collectionDays,
  getCommissionRatesForEssential,
  brokerDDL,
}) {
  const dispatch = useDispatch();
  const debounce = useDebounce();
  const [show, setShow] = useState(false);
  const [offerDetailsModel, setOfferDetailsModel] = useState(false);
  const [isStockModal, setIsStockModalShow] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [tradeOffersList, setTradeOffersList] = useState([]);
  const [tableType, setTableType] = useState("");
  //M/S The Successors businessUnit
  const isTransportRate = selectedBusinessUnit?.value === 94;

  //Akij Essentials Ltd
  const isBUIEssentials = selectedBusinessUnit?.value === 144;
  const isBUILineAsia = selectedBusinessUnit?.value === 209;
  const isBUICommodities = selectedBusinessUnit?.value === 221;
  const channelBulk = headerData?.distributionChannel?.value === 67;

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
        onSubmit={(values, { resetForm }) => {
          getCommissionRatesForEssential((commissionRates) => {
            saveHandler(values, commissionRates, () => {
              resetForm(initData);
              setModalShow(true);
            });
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
                            setFieldValue("transportZone", "");
                            setAlotementPrice(0);
                            setRowDto([]);

                            dispatch(
                              getShipToPartner_Action(
                                accountId,
                                selectedBusinessUnit.value,
                                currentValue
                              )
                            );
                            dispatch(getPartnerBalance_action(currentValue));
                            dispatch(getUndeliveryValues_action(currentValue));
                            dispatch(
                              getPriceStructureCheck_Acion(currentValue, 1)
                            );

                            dispatch(getAvailableBalance_Action(currentValue));
                            dispatch(
                              getCreditLimitForInternalUser_action(currentValue)
                            );
                            dispatch(
                              getTotalPendingQuantityAction(
                                accountId,
                                selectedBusinessUnit,
                                {
                                  ...values,
                                  soldtoParty: valueOptions,
                                }
                              )
                            );
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

                            const transportZoneMetch = transportZoneDDL?.find(
                              (itm) => itm?.value === optionValue?.upozilaId
                            );
                            setter("transportZone", transportZoneMetch || "");
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
                                {
                                  ...values,
                                  pricingDate: e.target.value,
                                }
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
                              required
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
                              required
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

                      {/* If Magnum or Akij ispat BUI = 171, 224 Selected */}
                      {[224, 171].includes(selectedBusinessUnit?.value) &&
                      values?.soldtoParty?.value ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name="productType"
                            options={[
                              {
                                value: "Straight",
                                label: "Straight",
                              },
                              { value: "Bend", label: "Bend" },
                            ]}
                            value={values?.productType}
                            label="Product Type"
                            onChange={(valueOption) => {
                              setFieldValue("productType", valueOption);
                            }}
                            placeholder="Product Type"
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit}
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

                      <div className="col-lg-3">
                        <NewSelect
                          name="transportZone"
                          options={transportZoneDDL}
                          value={values?.transportZone}
                          label="Ship To Party Transport Zone"
                          onChange={(valueOption) => {
                            setFieldValue("transportZone", valueOption);
                          }}
                          placeholder="No Data Found"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="logisticBy"
                          options={logisticByDDL}
                          value={values?.logisticBy}
                          label="Logistic By"
                          onChange={(valueOption) => {
                            setFieldValue("logisticBy", valueOption);
                          }}
                          placeholder="No Data Found"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          isClearable={false}
                        />
                      </div>
                      {selectedBusinessUnit?.value === 175 && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="isWaterProof"
                              options={isBooleanDDL}
                              value={values?.isWaterProof}
                              label="Is Water Proof"
                              onChange={(valueOption) => {
                                setFieldValue("isWaterProof", valueOption);
                                setFieldValue("waterProofRate", "");
                              }}
                              placeholder="No Data Found"
                              errors={errors}
                              touched={touched}
                              isDisabled={isEdit || rowDto?.length > 0}
                              isClearable={false}
                            />
                          </div>
                          {values?.isWaterProof?.value ? (
                            <div className="col-lg-3">
                              <label>Water Proof Rate</label>
                              <InputField
                                value={values?.waterProofRate}
                                name="waterProofRate"
                                placeholder="Water Proof Rate"
                                type="number"
                                required={values?.waterProofRate}
                                isClearable
                                disabled={rowDto?.length > 0}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="col-lg-3">
                            <NewSelect
                              name="isPumpCharge"
                              options={isBooleanDDL}
                              value={values?.isPumpCharge}
                              label="Is Pump Charge"
                              onChange={(valueOption) => {
                                setFieldValue("isPumpCharge", valueOption);
                                setFieldValue("pumpChargeRate", "");
                              }}
                              placeholder="No Data Found"
                              errors={errors}
                              touched={touched}
                              isDisabled={isEdit}
                              isClearable={false}
                            />
                          </div>
                          {values?.isPumpCharge?.value ? (
                            <div className="col-lg-3">
                              <label>Pump Charge Rate</label>
                              <InputField
                                value={values?.pumpChargeRate}
                                name="pumpChargeRate"
                                placeholder="Pump Charge Rate"
                                type="number"
                                required={values?.pumpChargeRate}
                                isClearable
                                disabled={rowDto?.length > 0}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                      {!isEdit ? (
                        <div className="col-lg-3">
                          <label>Collections Days</label>
                          <InputField
                            value={values?.collectionDays}
                            name="collectionDays"
                            placeholder="Collection Days"
                            type="number"
                            required={values?.collectionDays}
                            disabled={!collectionDays?.isEditableDueDays}
                          />
                        </div>
                      ) : null}
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="isUnloadLabourByCompany"
                            options={[
                              { value: false, label: "No" },
                              { value: true, label: "Yes" },
                            ]}
                            value={values?.isUnloadLabourByCompany}
                            label="Unload by Company"
                            onChange={(valueOption) => {
                              setFieldValue(
                                "isUnloadLabourByCompany",
                                valueOption
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      {isBUIEssentials && channelBulk && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="haveBroker"
                              options={[
                                { value: false, label: "No" },
                                { value: true, label: "Yes" },
                              ]}
                              value={values?.haveBroker}
                              label="Have Broker"
                              onChange={(valueOption) => {
                                setFieldValue("haveBroker", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {values?.haveBroker?.value === true && (
                            <div className="col-lg-3">
                              <NewSelect
                                name="brokerName"
                                options={brokerDDL || []}
                                value={values?.brokerName}
                                label="Broker Name"
                                onChange={(valueOption) => {
                                  setFieldValue("brokerName", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          )}
                        </>
                      )}

                      <div className="col-lg-12">
                        {partnerBalance && (
                          <p className="m-0 my-2">
                            <b>Ledger Balance: </b>
                            {_formatMoney(partnerBalance.ledgerBalance)},
                            <b className="ml-2">Credit Limit: </b>{" "}
                            {_formatMoney(creditLimitForInternalUser)},
                            <b className="ml-2">Unbilled Amount: </b>
                            {_formatMoney(partnerBalance.unbilledAmount)}{" "}
                            <button
                              className="btn btn-sm btn-primary px-1 py-1"
                              type="button"
                              onClick={() => {
                                setTableType("unBilled");
                                getUnBilledAmountDetails(
                                  selectedBusinessUnit?.value,
                                  values?.soldtoParty?.value,
                                  setDetailsData,
                                  setDisabled,
                                  () => {
                                    setShow(true);
                                  }
                                );
                              }}
                            >
                              Details
                            </button>
                            ,<b className="ml-2">Available Balance: </b>{" "}
                            {_formatMoney(availableBalance)},
                            <b className="ml-2">Undelivered Amount: </b>
                            {_formatMoney(
                              undeliveryValues?.unlideliveredValues
                            )}
                            <b className="ml-2">Pending Qty: </b>
                            {_formatMoney(partnerBalance?.pendingQty)}{" "}
                            <button
                              className="btn btn-sm btn-primary px-1 py-1"
                              type="button"
                              onClick={() => {
                                setTableType("order");
                                getOrderPendingDetails(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  values?.soldtoParty?.value,
                                  setDetailsData,
                                  setDisabled,
                                  () => {
                                    setShow(true);
                                  }
                                );
                              }}
                            >
                              Details
                            </button>
                            <b className="ml-2">Transport Qty: </b>
                            {_formatMoney(partnerBalance?.transportQty)}{" "}
                            <button
                              className="btn btn-sm btn-primary px-1 py-1"
                              type="button"
                              onClick={() => {
                                setTableType("delivery");
                                GetPendingQuantityDetails(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  values?.soldtoParty?.value,
                                  setDetailsData,
                                  setDisabled,
                                  () => {
                                    setShow(true);
                                  }
                                );
                              }}
                            >
                              Details
                            </button>
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
                    <div className="col-lg-3 mt-5">
                      <h5>
                        SO Validity Days:{" "}
                        {collectionDays?.salesOrderValidityDays}
                      </h5>
                    </div>
                  </div>
                </div>
                {/* End Left */}
              </div>
              <hr className="m-1"></hr>
              <div className="row">
                <div className="col-lg-12 m-0 p-0">
                  <div className="row global-form m-0">
                    {/*  isEdit view */}

                    {!isEdit && (
                      <>
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
                          {[
                            144,
                            178,
                            180,
                            181,
                            182,
                            183,
                            209,
                            212,
                            216,
                            221,
                          ].includes(selectedBusinessUnit?.value) &&
                            values?.item?.value && (
                              <>
                                <button
                                  style={{
                                    position: "absolute",
                                    right: "13px",
                                    top: "-10px",
                                    zIndex: "9",
                                  }}
                                  onClick={() => {
                                    setIsStockModalShow(true);
                                  }}
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Stock
                                </button>
                              </>
                            )}

                          <NewSelect
                            name="item"
                            options={itemPlantDDL || []}
                            value={values?.item}
                            label="Item"
                            onChange={(valueOption) => {
                              setFieldValue("quantityTop", "");
                              setFieldValue("uom", "");
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
                            isDisabled={
                              values?.refType?.value === 1 ? false : true
                            }
                          />
                        </div>

                        <div className="col-lg-3">
                          <IInput
                            value={values.quantityTop}
                            label="Quantity"
                            name="quantityTop"
                            disabled={
                              values?.refType?.value === 1 ? false : true
                            }
                            type="number"
                            min="0"
                            step="any"
                            onChange={(e) => {
                              /* if 'Bongo Traders Ltd' BUI Select */
                              if (selectedBusinessUnit?.isTredingBusiness) {
                                if (
                                  +values?.alotement?.numQty >=
                                    e.target.value ||
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
                                  setFieldValue(
                                    "allCheckbox",
                                    e.target.checked
                                  );
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
                              if (
                                values?.isWaterProof?.value &&
                                !values?.waterProofRate
                              )
                                return toast.warn(
                                  "Please give water proof rate"
                                );

                              if (
                                values?.isPumpCharge?.value &&
                                !values?.pumpChargeRate
                              )
                                return toast.warn(
                                  "Please give pump charge rate"
                                );

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
                      </>
                    )}
                    <div className="offset-lg-2 col-lg-5 d-flex justify-content-lg-end">
                      <div className="right mt-4">
                        <div>
                          {isEdit && (
                            <>
                              {" "}
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
                            </>
                          )}
                          {rowDto?.length > 0 && (
                            <button
                              onClick={() => {
                                const itmList = rowDto?.map((itm) => ({
                                  itemId: itm.itemId,
                                  itemName: itm.itemName,
                                  orderQty: itm?.numRequestQuantity || 0,
                                  distributionChannelId:
                                    headerData.distributionChannel.value,
                                }));
                                GetTradeOffersApi(
                                  itmList,
                                  _todayDate(),
                                  setTradeOffersList,
                                  setDisabled
                                );
                                setOfferDetailsModel(true);
                              }}
                              type="button"
                              className="btn btn-primary ml-2"
                            >
                              <i class="fa fa-gift" aria-hidden="true"></i>
                              Offer
                            </button>
                          )}
                        </div>
                      </div>
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
                              values?.refType?.value !== 1 || isBUIEssentials
                                ? { minWidth: "100px" }
                                : {}
                            }
                          >
                            Quantity
                          </th>
                          {isTransportRate && <th>Transport Rate</th>}

                          <th
                            style={
                              (values?.refType?.value === 1 &&
                                priceStructureCheck?.value) ||
                              isBUIEssentials
                                ? { minWidth: "100px" }
                                : {}
                            }
                          >
                            Basic Price
                          </th>
                          {isBUIEssentials && channelBulk && <th>Account Price</th>}
                          {selectedBusinessUnit?.value === 175 ? (
                            <>
                              {" "}
                              <th>Water Proof Rate</th>
                              <th>Pump Charge Rate </th>
                            </>
                          ) : (
                            <></>
                          )}

                          <th>Amount</th>
                          <th>Discount</th>
                          <th>Net Value</th>
                          {isEdit ? "" : <th>Action</th>}
                          {isBUIEssentials &&
                            channelBulk &&
                            values?.brokerName?.value && (
                              <>
                                <th>B. Commission Rate</th>
                                <th>Total Commission</th>
                              </>
                            )}
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((itm, index) => {
                          let VATNumOrderValue =
                            (itm.vatPrice || 0) *
                            (itm?.numRequestQuantity || 0);
                          return (
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
                                {values?.refType?.value !== 1 ||
                                isBUIEssentials ? (
                                  <IInput
                                    value={rowDto[index]?.numRequestQuantity}
                                    name="numRequestQuantity"
                                    type="number"
                                    required
                                    min="0"
                                    step="any"
                                    onChange={(e) => {
                                      rowDtoHandler(
                                        e.target.value,
                                        index,
                                        itm.numOrderValue,
                                        itm.numDiscountValue,
                                        itm.numItemPrice
                                      );
                                    }}
                                  />
                                ) : (
                                  rowDto[index]?.numRequestQuantity
                                )}
                              </td>
                              {isTransportRate && (
                                <td className="text-right">
                                  {itm.transportRate}
                                </td>
                              )}

                              {selectedBusinessUnit?.value === 220 && // AKIJ Building Solutions Limited
                              [
                                128, // B2B Lube Oil
                                129, // B2C Lube Oil
                              ].includes(
                                headerData?.distributionChannel?.value
                              ) ? (
                                <td
                                  className="align-middle"
                                  style={{ width: "100px" }}
                                >
                                  <InputField
                                    value={rowDto[index]?.numItemPrice}
                                    name="numItemPrice"
                                    placeholder="Price"
                                    type="number"
                                    min="0"
                                    step="any"
                                    onBlur={(e) => {
                                      if (
                                        e?.target?.value <
                                        rowDto[index]?.tempNumItemPrice
                                      ) {
                                        toast.warn("Price cannot be reduced");
                                        rowDtoHandlerPrice(
                                          +rowDto[index]?.tempNumItemPrice,
                                          index,
                                          itm.numOrderValue,
                                          itm.numDiscountValue,
                                          itm.numItemPrice,
                                          itm?.transportRate
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      rowDtoHandlerPrice(
                                        +e?.target?.value,
                                        index,
                                        itm.numOrderValue,
                                        itm.numDiscountValue,
                                        itm.numItemPrice,
                                        itm?.transportRate
                                      );
                                      debounce(() => {});
                                    }}
                                  />
                                </td>
                              ) : /* is Vat Price true*/
                              !isBUICommodities &&
                                itm.isVatPrice &&
                                headerData?.salesOrg?.value !== 17 ? (
                                <td className="text-center">
                                  {itm.vatPrice || 0}
                                </td>
                              ) : (
                                <>
                                  {(values?.refType?.value === 1 &&
                                    priceStructureCheck?.value) ||
                                  // &&
                                  // selectedBusinessUnit?.value !== 183
                                  ((isBUIEssentials ||
                                    isBUILineAsia ||
                                    isBUICommodities) &&
                                    selectedBusinessUnit?.value !== 183) ? (
                                    <td
                                      className="align-middle"
                                      style={{ width: "100px" }}
                                    >
                                      <InputField
                                        value={rowDto[index]?.numItemPrice}
                                        name="numItemPrice"
                                        placeholder="Price"
                                        type="number"
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
                                </>
                              )}
                              {isBUIEssentials && channelBulk && <td className="text-center">{itm?.accountsItemPrice}</td>}
                              {selectedBusinessUnit?.value === 175 ? (
                                <>
                                  <td className="text-center">
                                    {itm?.waterProofRate}
                                  </td>
                                  <td className="text-center">
                                    {itm?.pumpChargeRate}
                                  </td>
                                </>
                              ) : (
                                <></>
                              )}
                              <td className="text-center">
                                {itm.isVatPrice
                                  ? VATNumOrderValue.toFixed(2)
                                  : itm.numOrderValue.toFixed(2)}
                              </td>
                              <td className="text-center">
                                {itm.numDiscountValue}
                              </td>

                              <td className="text-center">
                                {itm.isVatPrice
                                  ? (
                                      VATNumOrderValue -
                                      (itm.numDiscountValue || 0)
                                    ).toFixed(2)
                                  : itm.netValue.toFixed(2)}
                              </td>
                              {isEdit ? (
                                ""
                              ) : (
                                <td className="text-center">
                                  <i
                                    className="fa fa-trash"
                                    onClick={() => remover(index)}
                                  ></i>
                                </td>
                              )}
                              {isBUIEssentials &&
                                channelBulk &&
                                values?.brokerName?.value && (
                                  <>
                                    <td
                                      className="align-middle"
                                      style={{
                                        width: "100px",
                                        backgroundColor: "#c0cb1bbf",
                                      }}
                                    >
                                      <InputField
                                        value={
                                          rowDto[index]?.commissionAgentRate
                                        }
                                        name="commissionAgentRate"
                                        placeholder="Commission Rate"
                                        type="number"
                                        step="any"
                                        onChange={(e) => {
                                          let _data = [...rowDto];
                                          _data[index].commissionAgentRate = +e
                                            ?.target?.value;
                                          setRowDto(_data);
                                        }}
                                      />
                                    </td>
                                    <td
                                      className="text-center"
                                      style={{
                                        backgroundColor: "#c0cb1bbf",
                                      }}
                                    >
                                      {itm.commissionAgentRate *
                                        itm?.numRequestQuantity || 0}
                                    </td>
                                  </>
                                )}
                            </tr>
                          );
                        })}
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
                  window.location.reload();
                }}
                createSaveData={createSaveData}
              />
              <IViewModal
                title={`${
                  tableType === "order"
                    ? "Pending Order Details"
                    : tableType === "delivery"
                    ? "Pending Delivery Details"
                    : tableType === "unBilled"
                    ? "UnBilled Amount Details"
                    : ""
                }`}
                show={show}
                onHide={() => setShow(false)}
              >
                <DetailsView tableType={tableType} gridData={detailsData} />
              </IViewModal>
              <IViewModal
                title="Offer Details"
                show={offerDetailsModel}
                onHide={() => setOfferDetailsModel(false)}
              >
                <OfferDetailsModel tradeOffersList={tradeOffersList} />
              </IViewModal>

              {isStockModal && (
                <>
                  <IViewModal
                    title={`Stock Info [${values?.item?.label}]`}
                    show={isStockModal}
                    onHide={() => setIsStockModalShow(false)}
                  >
                    <StockInfo values={values} />
                  </IViewModal>
                </>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
