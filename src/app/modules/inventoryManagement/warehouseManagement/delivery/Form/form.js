import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { GetDataBySalesOrderAction, getShipToPartner_Action } from "../_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import InputField from "./../../../../_helper/_inputField";
import { toast } from "react-toastify";
import { GetShipmentTypeApi, bagType, carType, deliveryMode, mode } from "../utils";
import FormikInput from "../../../../chartering/_chartinghelper/common/formikInput";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IHistory from "../../../../_helper/_helperIcons/_history";
import IViewModal from "../../../../_helper/_viewModal";
import ItemInformation from "../../invTransaction/Form/receiveInventory/view/ItemInformation";
// Validation schema
export const validationSchema = Yup.object().shape({
  warehouse: Yup.object().shape({
    label: Yup.string().required("Warehouse is required"),
    value: Yup.string().required("Warehouse is required"),
  }),
  soldToParty: Yup.object().shape({
    label: Yup.string().required("Sold To Party is required"),
    value: Yup.string().required("Sold To Party is required"),
  }),
  // shipmentType: Yup.object().shape({
  //   label: Yup.string().required("Shipment Type is required"),
  //   value: Yup.string().required("Shipment Type is required"),
  // }),
  // requestTime: Yup.string().required(
  //   "Shipment Schedule Date & Time is required"
  // ),
  requestTime: Yup.string().when("businessUnitId", (businessUnitId) => {
    if (+businessUnitId === 4) {
      return Yup.string().required("Shipment Schedule Date & Time is required");
    }
  }),
  shipmentType: Yup.object().when("businessUnitId", (businessUnitId) => {
    if (+businessUnitId === 4) {
      return Yup.object().shape({
        label: Yup.string().required("Shipment Type is required"),
        value: Yup.string().required("Shipment Type is required"),
      });
    }
  }),

  deliveryType: Yup.object().shape({
    label: Yup.string().required("Delivery Type is required"),
    value: Yup.string().required("Delivery Type is required"),
  }),
  itemLists: Yup.array().of(
    Yup.object().shape({
      selectLocation: Yup.object()
        .shape({
          label: Yup.string().required("Location  is required"),
          value: Yup.string().required("Location  is required"),
        })
        .nullable(),
      deliveryQty: Yup.number()
        .min(0, "Minimum 0 number")
        .test("pendingQty", "Invalid qty ", function(value) {
          return this.parent.pendingQty >= value;
        })
        .required("Item Qty required"),
    })
  ),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  warehouseDDL,
  shipToPartyDispatcher,
  salesOrderDDL,
  deliveryTypeDDL,
  addBtnHandler,
  remover,
  partnerBalance,
  availableBalance,
  undeliveryValues,
  responseData,
  soldToPartnerDDL,
  shipToPartner,
  setBtnDisabled,
  setDisabled,
  is_BalanceCheck,
  categoryDDL,
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [currRowInfo, setCurrRowInfo] = useState({ isView: false, data: {}, rowIndex: 0 });

  const dispatch = useDispatch();
  const [shipmentTypeDDl, setShipmentTypeDDl] = React.useState([]);

  const totalAmountCalFunc = (array, name) => {
    if (name === "vatAmount" || name === "amount") {
      const totalQty = array?.reduce((acc, cur) => {
        return acc + +cur?.[name] + (+cur?.extraRate || 0);
      }, 0);
      return Number(totalQty.toFixed(2));
    } else {
      const totalQty = array?.reduce((acc, cur) => acc + +cur?.[name], 0);
      return Number(totalQty.toFixed(2));
    }
  };
  //M/S The Successors businessUnit
  const isTransportRate = selectedBusinessUnit?.value === 94;

  const isAvailableBalance = (array) => {
    /* when business unit will be 
    178 = Bongo Traders Ltd
    180 = Direct Trading Company Ltd 
    181 = Asia One Trading Company Ltd
    182 = Daily Trading Company Ltd
    183 = Eurasia Trading Company Ltd
    209 = Lineasia Trading Co. Ltd. 
    212 = Batayon Traders Ltd.
    216 = ARL Traders Ltd.
    221 = Akij Commodities Ltd. 
    232 = Akij Agro Feed Ltd.  
    */

    if ([178, 180, 181, 182, 183, 209, 212, 216, 221, 232].includes(selectedBusinessUnit?.value)) {
      return false;
    }
    // if Day Limit true
    if (partnerBalance?.isDayLimit) {
      if (availableBalance < 0) {
        // toast.warning("Balance not available", { toastId: 465656 });
        return false;
      }
    } else {
      // if Day Limit false
      if (is_BalanceCheck) {
        if (array?.length > 0 && availableBalance > 0) {
          const totalQty = array?.reduce((acc, cur) => acc + +cur?.amount, 0);

          if (availableBalance < totalQty) {
            toast.warning("Balance not available!", { toastId: 465656 });
            return true;
          }
        } else {
          return true;
        }
      }
    }

    return false;
  };

  const maxDate = () => {
    let today = new Date();

    // Add 30 days to today's date
    let thirtyDaysFromToday = new Date();
    thirtyDaysFromToday.setDate(today.getDate() + 30);

    return _dateFormatter(thirtyDaysFromToday);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={
          isEdit
            ? Yup.object().shape({
                itemLists: Yup.array().of(
                  Yup.object().shape({
                    selectLocation: Yup.object()
                      .shape({
                        label: Yup.string().required("Location  is required"),
                        value: Yup.string().required("Location  is required"),
                      })
                      .nullable(),
                    deliveryQty: Yup.number()
                      .min(0, "Minimum 0 number")
                      .test("maxDeliveryQty", "Invalid qty ", function(value) {
                        return this.parent.maxDeliveryQty >= value;
                      })
                      .required("Item Qty required"),
                  })
                ),
              })
            : validationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid, setValues }) => (
          <>
            {setBtnDisabled(isAvailableBalance(values?.itemLists))}
            <Form className="form form-label-right">
              <div className="row">
                {values?.warehouse && (
                  <div className="col-lg-12 text-center  h-75" style={{ backgroundColor: "yellow" }}>
                    <h5 style={{ fontSize: "30px", marginBottom: "0px" }} className="text-middle py-2">
                      Selected Warehouse: {values?.warehouse?.label}
                    </h5>
                  </div>
                )}
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left pb-2">
                    <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="warehouse"
                        options={warehouseDDL}
                        value={values?.warehouse}
                        label="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                          setFieldValue("itemLists", []);
                        }}
                        placeholder="Select Warehouse"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="soldToParty"
                        options={soldToPartnerDDL}
                        value={values?.soldToParty}
                        label="Select Sold To Party"
                        onChange={(valueOption) => {
                          setFieldValue("soldToParty", valueOption);
                          setFieldValue("shipToParty", "");
                          setFieldValue("salesOrder", "");
                          setFieldValue("shipmentType", "");
                          shipToPartyDispatcher(valueOption?.value);
                          setShipmentTypeDDl([]);
                          if ([4].includes(selectedBusinessUnit?.value)) {
                            GetShipmentTypeApi(
                              profileData?.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.terriToryId,
                              setShipmentTypeDDl,
                              setDisabled,
                              (resData) => {
                                setFieldValue("shipmentType", resData?.[0] || "");
                              }
                            );
                          }
                        }}
                        placeholder="Select Sold To Party"
                        errors={errors}
                        touched={touched}
                        isDisabled={values?.itemLists?.length > 0 ? true : isEdit}
                      />
                    </div>
                    <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="deliveryType"
                        options={deliveryTypeDDL}
                        value={values?.deliveryType}
                        label="Select Delivery Type"
                        onChange={(valueOption) => {
                          setFieldValue("deliveryType", valueOption);
                        }}
                        placeholder="Delivery Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Delivery Date</label>
                      <InputField
                        value={values?.deliveryDate}
                        name="deliveryDate"
                        placeholder="Delivery Date"
                        type="date"
                        disabled={isEdit}
                        max={maxDate()}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="mode"
                        options={mode}
                        value={values?.mode}
                        label="Select Mode"
                        onChange={(valueOption) => {
                          setFieldValue("mode", valueOption);
                        }}
                        placeholder="Select Mode"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="carType"
                        options={carType}
                        value={values?.carType}
                        label="Select Car Type"
                        onChange={(valueOption) => {
                          setFieldValue("carType", valueOption);
                        }}
                        placeholder="Select Car Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    {selectedBusinessUnit?.value === 4 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="bagType"
                          options={bagType}
                          value={values?.bagType}
                          label="Select Bag Type"
                          onChange={(valueOption) => {
                            setFieldValue("bagType", valueOption);
                          }}
                          placeholder="Select Bag Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <NewSelect
                        name="deliveryMode"
                        options={deliveryMode}
                        value={values?.deliveryMode}
                        label="Select Delivery Mode"
                        onChange={(valueOption) => {
                          setFieldValue("deliveryMode", valueOption);
                        }}
                        placeholder="Select Delivery Mode"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="category"
                        options={categoryDDL}
                        value={values?.category}
                        label="Category"
                        onChange={(valueOption) => {
                          setFieldValue("category", valueOption);
                        }}
                        placeholder="Select Category"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    {[4].includes(selectedBusinessUnit?.value) && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipmentType"
                            options={shipmentTypeDDl}
                            value={values?.shipmentType}
                            label="Select Shipment Type"
                            onChange={(valueOption) => {
                              setFieldValue("shipmentType", valueOption);
                            }}
                            placeholder="Select Shipment Type"
                            errors={errors}
                            touched={touched}
                            isDisabled={values?.itemLists?.length > 0 ? true : isEdit}
                            isClearable={false}
                          />
                        </div>
                        {!isEdit && (
                          <div className="col-lg-3">
                            <label>Shipment Schedule Date & Time</label>
                            <FormikInput
                              value={values?.requestTime}
                              name="requestTime"
                              type="datetime-local"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="col-lg-12">
                      <hr className="mt-2 mb-1" />
                    </div>
                    <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="salesOrder"
                        options={salesOrderDDL}
                        value={values?.salesOrder}
                        label="Select Order No"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrder", valueOption);
                          setFieldValue("shipToParty", "");
                          dispatch(
                            GetDataBySalesOrderAction(valueOption?.value, values?.warehouse?.value, setDisabled)
                          );
                          dispatch(
                            getShipToPartner_Action(
                              profileData?.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value,
                              setFieldValue
                            )
                          );
                        }}
                        placeholder="Select Order No"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.warehouse?.value || isEdit}
                      />
                    </div>
                    <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="shipToParty"
                        options={shipToPartner}
                        value={values?.shipToParty}
                        label="Select Ship To Party"
                        onChange={(valueOption) => {
                          setFieldValue("shipToParty", valueOption);
                        }}
                        placeholder="Select Ship To Party"
                        errors={errors}
                        touched={touched}
                        isDisabled={values?.itemLists?.length > 0 ? true : isEdit || !values?.salesOrder}
                      />
                    </div>

                    <>
                      <div className="col-lg-1 d-flex align-items-center">
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: "11px" }}
                          type="button"
                          onClick={() => addBtnHandler(values, setValues)}
                          disabled={
                            values?.warehouse &&
                            values?.soldToParty &&
                            values?.shipToParty &&
                            values?.salesOrder &&
                            values?.deliveryType
                              ? false
                              : true
                          }
                        >
                          Add
                        </button>
                      </div>

                      <div className="col-lg-5 delivery_Information">
                        {partnerBalance && (
                          <ul>
                            <li>
                              <b>Delivery Code: </b>
                              {responseData}
                            </li>
                            <li>
                              <b>Ledger Balance: </b>
                              {partnerBalance?.ledgerBalance}
                            </li>
                            <li>
                              <b>Credit Limit: </b>
                              {partnerBalance?.creditLimit}
                            </li>
                            <li>
                              <b>Unbilled Amount: </b>
                              {partnerBalance?.unbilledAmount}
                            </li>
                            <li>
                              <b>Available Balance: </b> {availableBalance}
                            </li>
                            <li>
                              <b>Undelivered Amount: </b>
                              {undeliveryValues?.unlideliveredValues}
                            </li>
                            <li>
                              <div>
                                <b className="">Delivery Amount: </b>
                                <span className={isAvailableBalance(values?.itemLists) ? "text-danger " : ""}>
                                  {totalAmountCalFunc(
                                    values?.itemLists,
                                    values?.itemLists?.[0]?.isVatPrice ? "vatAmount" : "amount"
                                  )}
                                </span>
                              </div>
                            </li>
                            <li>
                              <div>
                                <b>Delivery Qty: </b>
                                {totalAmountCalFunc(values?.itemLists, "deliveryQty")}
                              </div>
                            </li>
                            {partnerBalance?.isDayLimit && (
                              <>
                                <li>
                                  <div>
                                    <b>Day Limit: </b>
                                    {"true"}
                                  </div>
                                </li>
                              </>
                            )}
                          </ul>
                        )}
                      </div>
                    </>
                  </div>
                </div>
              </div>

              {/* table */}
              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0">
                  {values?.itemLists?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "75px" }}>Item Code</th>
                            <th style={{ width: "120px" }}>Specification</th>
                            <th style={{ width: "120px" }}>Ship to Party</th>
                            <th style={{ width: "120px" }}>Address</th>
                            <th style={{ width: "120px" }}>Item</th>
                            <th style={{ width: "120px" }}>Select Location</th>
                            <th style={{ width: "20px" }}>Price</th>
                            {[4].includes(selectedBusinessUnit?.value) && (
                              <>
                                <th style={{ width: "20px" }}>Extra Rate</th>
                              </>
                            )}
                            {isTransportRate && <th style={{ width: "20px" }}>Transport Rate</th>}
                            <th style={{ width: "20px" }}>Available Stock</th>
                            <th style={{ width: "20px" }}>Order Qty</th>
                            <th style={{ width: "20px" }}>Pending Qty</th>
                            <th style={{ width: "120px" }}>Delivery Qty</th>
                            <th style={{ width: "10px" }}>Offers</th>
                            {!isEdit && <th style={{ width: "50px" }}>Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {values?.itemLists.map((itm, index) => {
                            let _numItemPrice = itm?.isVatPrice ? itm?.vatItemPrice : itm?.numItemPrice;
                            return (
                              <>
                                <tr key={index}>
                                  <td>
                                    <div className="pl-2">{itm.itemCode}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2">{itm.specification}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2">{itm.shipToParty}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2">{itm.shipToPartnerAddress}</div>
                                  </td>
                                  <td style={{ width: "90px" }}>
                                    <div className="pl-2">
                                      {itm?.isSerialMaintain && (
                                        <IHistory
                                          title={"Info"}
                                          styles={{ margin: "5px" }}
                                          clickHandler={() => {
                                            setCurrRowInfo({
                                              isView: true,
                                              data: itm,
                                              rowIndex: index,
                                            });
                                          }}
                                        />
                                      )}
                                      {itm.itemName}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      width: "75px",
                                      verticalAlign: "middle",
                                    }}
                                    className="locationRowFild"
                                  >
                                    <NewSelect
                                      name={`itemLists.${index}.selectLocation`}
                                      options={itm?.objLocation}
                                      value={values?.itemLists[index]?.selectLocation || ""}
                                      onChange={(valueOption) => {
                                        setFieldValue(`itemLists.${index}.selectLocation`, valueOption || "");
                                      }}
                                      errors={errors}
                                      touched={touched}
                                      isDisabled={isEdit}
                                    />
                                  </td>
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">{_numItemPrice}</div>
                                  </td>
                                  {[4].includes(selectedBusinessUnit?.value) && (
                                    <>
                                      <td style={{ width: "20px" }}>
                                        <div className="text-right pr-2">{itm?.extraRate || 0}</div>
                                      </td>
                                    </>
                                  )}
                                  {isTransportRate && (
                                    <td style={{ width: "20px" }} className="text-right">
                                      {itm.transportRate || 0}
                                    </td>
                                  )}
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">{itm?.availableStock}</div>
                                  </td>
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">{itm.numOrderQuantity}</div>
                                  </td>
                                  <td style={{ width: "20px" }}>
                                    <div className="text-right pr-2">{itm.pendingQty}</div>
                                  </td>
                                  <td
                                    style={{
                                      width: "150px",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <div className="px-2">
                                      <InputField
                                        value={values?.itemLists[index]?.deliveryQty || ""}
                                        name={`itemLists.${index}.deliveryQty`}
                                        placeholder="Delivery Qty"
                                        type="number"
                                        step="any"
                                        onChange={(e) => {
                                          setFieldValue(`itemLists.${index}.deliveryQty`, e.target.value || "");
                                          setFieldValue(
                                            `itemLists.${index}.amount`,
                                            (values?.itemLists[index]?.numItemPrice * e.target.value).toFixed(2)
                                          );
                                          setFieldValue(
                                            `itemLists.${index}.vatAmount`,
                                            (values?.itemLists[index]?.vatItemPrice * e.target.value).toFixed(2)
                                          );

                                          // ======offer item qty change logic=====
                                          const modifid = values?.itemLists[index]?.offerItemList?.map((itm) => {
                                            let calNumber = (+itm?.offerRatio || 0) * (+e.target.value || 0);
                                            let acculNumber = 0;
                                            const decimalPoint = Number(`.${calNumber.toString().split(".")[1] || 0}`);
                                            if (decimalPoint >= 0.95) {
                                              acculNumber = Math.round(calNumber);
                                            } else {
                                              acculNumber = Math.floor(calNumber);
                                            }
                                            return {
                                              ...itm,
                                              deliveryQty: acculNumber,
                                              isItemShow: acculNumber > 0 ? true : false,
                                            };
                                          });
                                          setFieldValue(`itemLists.${index}.offerItemList`, modifid);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        max={isEdit ? itm?.maxDeliveryQty : itm?.pendingQty}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ width: "10px" }}>
                                    <div className="pl-2">{itm.freeItem ? "Yes" : "No"}</div>
                                  </td>
                                  {!isEdit && (
                                    <td className="text-center">
                                      <i className="fa fa-trash" onClick={() => remover(index, setValues, values)}></i>
                                    </td>
                                  )}
                                </tr>
                                {/* offer item show */}
                                {itm?.offerItemList?.length > 0 ? (
                                  <>
                                    {itm?.offerItemList
                                      ?.filter((itm) => itm?.isItemShow)
                                      ?.map((OfferItm) => (
                                        <tr key={index} style={{ background: "#ffffa9" }}>
                                          <td>
                                            <div className="pl-2">{OfferItm?.itemCode}</div>
                                          </td>
                                          <td>
                                            <div className="pl-2">{OfferItm?.specification}</div>
                                          </td>
                                          <td>
                                            <div className="pl-2">{OfferItm?.shipToParty}</div>
                                          </td>
                                          <td>
                                            <div className="pl-2">{OfferItm?.shipToPartnerAddress}</div>
                                          </td>
                                          <td style={{ width: "90px" }}>
                                            <div className="pl-2">{OfferItm?.itemName}</div>
                                          </td>
                                          <td
                                            style={{
                                              width: "75px",
                                              verticalAlign: "middle",
                                            }}
                                            className="locationRowFild"
                                          >
                                            {OfferItm?.selectLocation?.label}
                                          </td>
                                          <td style={{ width: "20px" }}>
                                            <div className="text-right pr-2">{_numItemPrice}</div>
                                          </td>
                                          {isTransportRate && (
                                            <td style={{ width: "20px" }} className="text-right">
                                              {OfferItm?.transportRate || 0}
                                            </td>
                                          )}
                                          <td style={{ width: "20px" }}>
                                            <div className="text-right pr-2">{OfferItm?.numOrderQuantity}</div>
                                          </td>
                                          <td style={{ width: "20px" }}>
                                            <div className="text-right pr-2">{OfferItm?.pendingQty}</div>
                                          </td>
                                          <td
                                            style={{
                                              width: "150px",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <div className="px-2">{OfferItm?.deliveryQty}</div>
                                          </td>
                                          <td style={{ width: "10px" }}>
                                            <div className="pl-2">Yes</div>
                                          </td>

                                          {!isEdit && <td className="text-center"></td>}
                                        </tr>
                                      ))}
                                  </>
                                ) : null}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" style={{ display: "none" }} ref={btnRef} onSubmit={() => handleSubmit()}></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              <IViewModal
                show={currRowInfo?.isView}
                onHide={() =>
                  setCurrRowInfo((prev) => ({
                    ...prev,
                    isView: false,
                  }))
                }
              >
                <ItemInformation
                  currRowInfo={currRowInfo}
                  setFieldValue={setFieldValue}
                  rowDto={values?.itemLists}
                  isFromDelivery={true}
                />
              </IViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
