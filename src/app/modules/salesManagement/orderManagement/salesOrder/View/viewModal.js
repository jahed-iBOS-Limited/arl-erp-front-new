import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import {
  SetAvailableBalanceEmpty_Action,
  SetPartnerBalanceEmpty_Action,
  SetUndeliveryValuesEmpty_Action,
  getAvailableBalance_Action,
  getCreditLimitForInternalUser_action,
  getDataBySalesOrderId_Action,
  getItemPlant_Action,
  // getItemPlant_Action,
  getPartnerBalance_action,
  getSalesOrderGridData,
  getShipToPartner_Action,
  getUndeliveryValues_action,
} from "../_redux/Actions";
import { logisticByDDL, updateSalesOrder } from "../helper";
import { ISelect } from "./../../../../_helper/_inputDropDown";
import Loading from "./../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { setSalesOrderSingleEmpty } from "./../_redux/Actions";

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

export default function ViewForm({ id, show, onHide, isLoading }) {
  const { type } = useParams();
  const { state } = useLocation();
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

  // get single sales order  unit from store
  const singleData = useSelector((state) => {
    return state.salesOrder?.singleData;
  }, shallowEqual);

  let salesOrderData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        partnerBalance: state.salesOrder.partnerBalance,
        undeliveryValues: state.salesOrder.undeliveryValues,
        availableBalance: state.salesOrder.availableBalance,
        creditLimitForInternalUser: state.salesOrder.creditLimitForInternalUser,
        shipToPartner: state.salesOrder.shipToPartner,
        currencyListDDL: state.salesOrder.currencyListDDL,
        transportZoneDDL: state.salesOrder.transportZoneDDL,
        itemPlantDDL: state.salesOrder.itemPlantDDL,
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
    shipToPartner,
    currencyListDDL,
    transportZoneDDL,
    itemPlantDDL,
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
    }
    // dispatch(
    //   getCurrencyListDDL_Action(
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value
    //   )
    // );
    // dispatch(
    //   getTransportZoneDDL_action(
    //     profileData?.accountId,
    //     selectedBusinessUnit?.value
    //   )
    // );
    if (selectedBusinessUnit?.value === 144) {
      dispatch(
        getItemPlant_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          state?.distributionChannel?.value,
          state?.salesOrg?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (singleData?.objHeader?.soldToPartnerId) {
      dispatch(
        getShipToPartner_Action(
          profileData?.accountId,
          selectedBusinessUnit.value,
          singleData?.objHeader?.soldToPartnerId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (singleData?.objRow) {
      const newRowDto = singleData?.objRow.map((itm) => ({
        ...itm,
        netValue:
          itm.numOrderValue - (itm.numOrderValue * itm.numDiscountValue) / 100,
        isFree: itm.isFreeItem ? "Yes" : "No",
        item: { value: itm?.itemId, label: itm?.itemName },
        shipToPartner: {
          value: itm?.shipToPartnerId,
          label: itm?.shipToPartnerName,
        },
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
        getAvailableBalance_Action(
          singleData?.objHeader?.soldToPartnerId,
          [+id],
          1
        )
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

  const rowDataHandler = (index, name, value) => {
    let _data = [...rowDto];
    _data[index][name] = value;

    const orderValue =
      name === "numRequestQuantity"
        ? _data[index]["numItemPrice"] * value
        : name === "numItemPrice"
        ? _data[index]["numRequestQuantity"] * value
        : _data[index]["numOrderValue"];

    _data[index]["numOrderValue"] = orderValue;
    setRowDto(_data);
  };

  const saveHandler = (values) => {
    const payload = {
      userId: profileData?.userId,
      businessUnitId: selectedBusinessUnit?.value,
      objHeader: {
        salesOrderId: id,
        partnerReffNo: values?.partnerReffNo,
        pricingDate: values?.pricingDate,
        currencyName: values?.currency?.label,
        currencyId: values?.currency?.value,
        narration: values?.narration,
        logisticBy: values?.logisticBy?.value,
        shipToPartnerAddress: values?.shiptoPartnerAddress,
        shipToPartnerContactNo: values?.shipToPartnerContactNo,
        shipPointId: 0,
        shipPointName: "",
      },
      objRow: rowDto?.map((item, i) => {
        return {
          rowId: item?.rowId,
          shipToPartnerId: item?.shipToPartner?.value,
          shipToPartnerName: item?.shipToPartner?.label,
          shipToPartnerAddress: "",
          itemId: item?.item?.value,
          itemCode: "",
          itemName: item?.item?.label,
          requestQuantity: item?.numRequestQuantity,
          itemPrice: item?.numItemPrice,
          customerItemName: item?.item?.label,
          uomId: 0,
          uomName: "",
          referenceNoName: "",
          orderQuantity: +item?.numOrderQuantity,
          undeliveryQuantity: item?.numRequestQuantity,
          orderValue: item?.numOrderValue,
          specification: "",
        };
      }),
    };
    if (type === "update") {
      updateSalesOrder(payload, setLoading, () => {
        onHide();
        dispatch(
          getSalesOrderGridData(
            profileData.accountId,
            selectedBusinessUnit.value,
            state?.shippoint?.value,
            state?.orderStatus?.value,
            0,
            15,
            null,
            isLoading
          )
        );
      });
    }
  };

  const p = state?.addressChangingPermission;
  const viewMode = type !== "update" || !p;

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={`${type === "update" ? "Edit" : "View"} Sales Order`}
        isShow={singleData?.objHeader && false}
      >
        <Formik
          enableReinitialize={true}
          initialValues={singleData?.objHeader || initData}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              {loading && <Loading />}
              {type === "update" && (
                <div className="text-right">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      saveHandler(values);
                    }}
                  >
                    Save
                  </button>
                </div>
              )}

              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Sold to Party"
                      options={[]}
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
                      options={shipToPartner || []}
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
                      disabled={viewMode}
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
                      disabled={viewMode}
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
                      options={[]}
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
                      options={currencyListDDL || []}
                      value={values.currency}
                      name="currency"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={viewMode}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Reference Type"
                      options={[]}
                      value={values.refType}
                      name="refType"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values.shiptoPartnerAddress}
                      label="Ship To Party Address"
                      name="shiptoPartnerAddress"
                      disabled={type !== "update"}
                      // disabled={viewMode}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values.narration}
                      label="Comments"
                      name="narration"
                      disabled={viewMode}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Ship To Party Contact No.</label>
                    <InputField
                      value={values?.shipToPartnerContactNo}
                      name="shipToPartnerContactNo"
                      placeholder="Ship To Party Contact No."
                      type="text"
                      disabled={viewMode}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="transportZone"
                      options={transportZoneDDL || []}
                      value={values?.transportZone}
                      label="Ship To Party Transport Zone"
                      onChange={(valueOption) => {
                        setFieldValue("transportZone", valueOption);
                      }}
                      placeholder="No Data Found"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="logisticBy"
                      options={logisticByDDL || []}
                      value={values?.logisticBy}
                      label="Logistic By"
                      onChange={(valueOption) => {
                        setFieldValue("logisticBy", valueOption);
                      }}
                      placeholder="No Data Found"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewMode}
                    />
                  </div>
                  {selectedBusinessUnit?.value === 175 && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="isWaterProof"
                          options={[]}
                          value={values?.isWaterProof}
                          label="Is Water Proof"
                          onChange={(valueOption) => {
                            setFieldValue("isWaterProof", valueOption);
                          }}
                          placeholder="No Data Found"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="isPumpCharge"
                          options={[]}
                          value={values?.isPumpCharge}
                          label="Is Pump Charge"
                          onChange={(valueOption) => {
                            setFieldValue("isPumpCharge", valueOption);
                          }}
                          placeholder="No Data Found"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                      </div>
                    </>
                  )}
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

        <div
        // className="react-bootstrap-table table-responsive"
        >
          <table
            // className={"table table-striped table-bordered global-table "}
            className={
              "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
            }
          >
            <thead>
              <tr>
                <th>SL</th>
                <th>Reference No</th>
                <th>specification</th>
                <th style={viewMode ? {} : { width: "200px" }}>
                  Ship To Party
                </th>
                {viewMode && <th>Item Code</th>}
                <th style={viewMode ? {} : { width: "200px" }}>Item Name</th>
                {viewMode && <th>Customer Item Name</th>}
                {viewMode && <th>Uom</th>}
                <th>Is Free</th>
                <th>Quantity</th>
                {isTransportRate && <th>Transport Rate</th>}

                <th>Basic Price</th>
                {salesOrderData?.selectedBusinessUnit?.value === 175 ? (
                  <>
                    <th>Water Proof Rate</th>
                    <th>Pump Charge Rate </th>
                  </>
                ) : (
                  <></>
                )}
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
                    <td className="align-middle">
                      {viewMode ? (
                        itm.shipToPartnerName
                      ) : (
                        <NewSelect
                          name="shipToPartner"
                          value={itm?.shipToPartner || {}}
                          options={shipToPartner || []}
                          onChange={(e) => {
                            rowDataHandler(index, "shipToPartner", e);
                          }}
                        />
                      )}
                    </td>
                    {viewMode && (
                      <td className="align-middle">{itm.itemCode}</td>
                    )}
                    <td className="align-middle">
                      {viewMode ? (
                        itm.itemName
                      ) : (
                        // <></>
                        <NewSelect
                          name="item"
                          value={itm?.item || {}}
                          options={itemPlantDDL || []}
                          onChange={(e) => {
                            rowDataHandler(index, "item", e);
                          }}
                        />
                      )}
                    </td>
                    {viewMode && (
                      <td className="align-middle">{itm.customerItemName}</td>
                    )}
                    {viewMode && (
                      <td className="align-middle">{itm.uomName}</td>
                    )}
                    <td className="align-middle">{itm.isFree}</td>
                    <td className="align-middle">
                      {viewMode ? (
                        itm?.numOrderQuantity // itm?.numRequestQuantity
                      ) : (
                        // <></>
                        <input
                          type="number"
                          name="numRequestQuantity"
                          value={itm?.numRequestQuantity}
                          // value={itm?.numOrderQuantity}
                          onChange={(e) => {
                            rowDataHandler(
                              index,
                              "numRequestQuantity",
                              // "numOrderQuantity",
                              e?.target?.value
                            );
                          }}
                        />
                      )}
                    </td>
                    {isTransportRate && (
                      <td className="text-right">
                        {itm.numTransportRate || 0}
                      </td>
                    )}
                    <td className="text-right">
                      {viewMode ? (
                        _formatMoney(itm.numItemPrice)
                      ) : (
                        <input
                          name="numItemPrice"
                          value={itm.numItemPrice}
                          onChange={(e) => {
                            rowDataHandler(
                              index,
                              "numItemPrice",
                              e?.target?.value
                            );
                          }}
                        />
                      )}
                    </td>
                    {salesOrderData?.selectedBusinessUnit?.value === 175 ? (
                      <>
                        <td className="text-center">
                          {itm?.numWaterProofRate || 0}
                        </td>
                        <td className="text-center">
                          {itm?.numPumpChargeRate || 0}
                        </td>
                      </>
                    ) : (
                      <></>
                    )}
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
