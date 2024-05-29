/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { validationSchema } from "../../delivery/Form/form";
import { bagType, carType, deliveryMode, mode } from "../../delivery/utils";

const Form = ({
  rows,
  buId,
  title,
  remover,
  initData,
  categoryDDL,
  warehouseDDL,
  barcodeHandler,
  deliveryTypeDDL,
  addBtnHandler,
  partnerBalance,
  availableBalance,
  undeliveryValues,
  deliveryCode,
  saveHandler,
  isAvailableBalance,
  viewType,
}) => {
  const history = useHistory();

  const totalAmountCalFunc = (array, name) => {
    const totalQty = array?.reduce((acc, cur) => acc + +cur?.[name], 0);
    return totalQty;
  };

  const isTransportRate = buId === 94;

  const isEdit = "";

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
          values,
          setFieldValue,
          errors,
          touched,
          setValues,
          handleSubmit,
          resetForm,
        }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={
              viewType === "view"
                ? false
                : () => {
                    resetForm(initData);
                  }
            }
            saveHandler={
              viewType === "view"
                ? false
                : () => {
                    handleSubmit();
                  }
            }
          >
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 mb-1">
                    <NewSelect
                      name="warehouse"
                      options={warehouseDDL}
                      value={values?.warehouse}
                      label="Select Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                      placeholder="Select Warehouse"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3 mb-1 d-flex">
                    <div style={{ width: "inherit" }}>
                      <InputField
                        label="Sales Order Code"
                        value={values?.soCode}
                        name="soCode"
                        placeholder={"Sales Order Code"}
                        type="text"
                        disabled={!values?.warehouse || viewType}
                        onKeyPress={(e) => {
                          if (e?.charCode === 13) {
                            e.preventDefault();
                            const value = e?.target?.value;
                            barcodeHandler(value, values, setFieldValue);
                          }
                        }}
                      />
                    </div>

                    {!viewType && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "5px",
                          cursor: "pointer",
                          marginTop: "20px",
                        }}
                        onClick={() => {
                          setFieldValue("soCode", "");
                        }}
                      >
                        <i
                          style={{
                            color: "blue",
                          }}
                          className="fa fa-refresh"
                          aria-hidden="true"
                        ></i>
                      </span>
                    )}
                  </div>

                  <div className="col-lg-3 mb-1">
                    <NewSelect
                      name="soldToParty"
                      options={[]}
                      value={values?.soldToParty}
                      label="Select Sold To Party"
                      onChange={(valueOption) => {
                        setFieldValue("soldToParty", valueOption);
                        setFieldValue("shipToParty", "");
                        setFieldValue("salesOrder", "");
                        // shipToPartyDispatcher(valueOption?.value);
                      }}
                      placeholder="Select Sold To Party"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
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
                      isDisabled={viewType}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Delivery Date</label>
                    <InputField
                      value={values?.deliveryDate}
                      name="deliveryDate"
                      placeholder="Delivery Date"
                      type="date"
                      disabled={viewType}
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
                      isDisabled={viewType}
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
                      isDisabled={viewType}
                    />
                  </div>
                  {buId === 4 && (
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
                        isDisabled={viewType}
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
                      isDisabled={viewType}
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
                      isDisabled={viewType}
                    />
                  </div>
                  <IButton
                    onClick={() => {
                      addBtnHandler(values, setValues);
                    }}
                    disabled={viewType}
                  >
                    Add
                  </IButton>
                  <>
                    <div className="col-lg-6 delivery_Information mt-5">
                      {partnerBalance && (
                        <ul>
                          <li>
                            <b>Delivery Code: </b>
                            {deliveryCode}
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
                              <span
                                className={
                                  isAvailableBalance(values?.itemLists)
                                    ? "text-danger "
                                    : ""
                                }
                              >
                                {totalAmountCalFunc(
                                  values?.itemLists,
                                  values?.itemLists?.[0]?.isVatPrice
                                    ? "vatAmount"
                                    : "amount"
                                )}
                              </span>
                            </div>
                          </li>
                          <li>
                            <div>
                              <b>Delivery Qty: </b>
                              {totalAmountCalFunc(
                                values?.itemLists,
                                "deliveryQty"
                              )}
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
            </form>

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
                          {isTransportRate && (
                            <th style={{ width: "20px" }}>Transport Rate</th>
                          )}
                          <th style={{ width: "20px" }}>Order Qty</th>
                          <th style={{ width: "20px" }}>Pending Qty</th>
                          <th style={{ width: "120px" }}>Delivery Qty</th>
                          <th style={{ width: "10px" }}>Offers</th>
                          {!viewType && (
                            <th style={{ width: "50px" }}>Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {values?.itemLists?.map((itm, index) => {
                          let _numItemPrice = itm?.isVatPrice
                            ? itm?.vatItemPrice
                            : itm?.numItemPrice;
                          return (
                            <>
                              <tr key={index}>
                                <td>
                                  <div className="pl-2">{itm.itemCode}</div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {itm.specification}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {itm.shipToPartnerName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {itm.shipToPartnerAddress}
                                  </div>
                                </td>
                                <td style={{ width: "90px" }}>
                                  <div className="pl-2">{itm.itemName}</div>
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
                                    value={
                                      values?.itemLists[index]
                                        ?.selectLocation || ""
                                    }
                                    onChange={(valueOption) => {
                                      setFieldValue(
                                        `itemLists.${index}.selectLocation`,
                                        valueOption || ""
                                      );
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={viewType}
                                  />
                                </td>
                                <td style={{ width: "20px" }}>
                                  <div className="text-right pr-2">
                                    {_numItemPrice}
                                  </div>
                                </td>
                                {isTransportRate && (
                                  <td
                                    style={{ width: "20px" }}
                                    className="text-right"
                                  >
                                    {itm.transportRate || 0}
                                  </td>
                                )}
                                <td style={{ width: "20px" }}>
                                  <div className="text-right pr-2">
                                    {itm.numOrderQuantity}
                                  </div>
                                </td>
                                <td style={{ width: "20px" }}>
                                  <div className="text-right pr-2">
                                    {itm.pendingQty}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    width: "150px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <div className="px-2">
                                    <InputField
                                      value={
                                        values?.itemLists[index]?.deliveryQty ||
                                        ""
                                      }
                                      name={`itemLists.${index}.deliveryQty`}
                                      placeholder="Delivery Qty"
                                      type="number"
                                      step="any"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `itemLists.${index}.deliveryQty`,
                                          e.target.value || ""
                                        );
                                        setFieldValue(
                                          `itemLists.${index}.amount`,
                                          (
                                            values?.itemLists[index]
                                              ?.numItemPrice * e.target.value
                                          ).toFixed(2)
                                        );
                                        setFieldValue(
                                          `itemLists.${index}.vatAmount`,
                                          (
                                            values?.itemLists[index]
                                              ?.vatItemPrice * e.target.value
                                          ).toFixed(2)
                                        );

                                        // ======offer item qty change logic=====
                                        const modifid = values?.itemLists[
                                          index
                                        ]?.offerItemList?.map((itm) => {
                                          let calNumber =
                                            (+itm?.offerRatio || 0) *
                                            (+e.target.value || 0);
                                          let acculNumber = 0;
                                          const decimalPoint = Number(
                                            `.${calNumber
                                              .toString()
                                              .split(".")[1] || 0}`
                                          );
                                          if (decimalPoint >= 0.95) {
                                            acculNumber = Math.round(calNumber);
                                          } else {
                                            acculNumber = Math.floor(calNumber);
                                          }
                                          return {
                                            ...itm,
                                            deliveryQty: acculNumber,
                                            isItemShow:
                                              acculNumber > 0 ? true : false,
                                          };
                                        });
                                        setFieldValue(
                                          `itemLists.${index}.offerItemList`,
                                          modifid
                                        );
                                      }}
                                      errors={errors}
                                      touched={touched}
                                      max={
                                        isEdit
                                          ? itm?.maxDeliveryQty
                                          : itm?.pendingQty
                                      }
                                      disabled={viewType === "view"}
                                    />
                                  </div>
                                </td>
                                <td style={{ width: "10px" }}>
                                  <div className="pl-2">
                                    {itm.freeItem ? "Yes" : "No"}
                                  </div>
                                </td>
                                {!viewType && (
                                  <td className="text-center">
                                    <i
                                      className="fa fa-trash"
                                      onClick={() => {
                                        remover(index, setValues, values);
                                      }}
                                    ></i>
                                  </td>
                                )}
                              </tr>
                              {/* offer item show */}
                              {itm?.offerItemList?.length > 0 ? (
                                <>
                                  {itm?.offerItemList
                                    ?.filter((itm) => itm?.isItemShow)
                                    ?.map((OfferItm) => (
                                      <tr key={index}>
                                        <td>
                                          <div className="pl-2">
                                            {OfferItm?.itemCode}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="pl-2">
                                            {OfferItm?.specification}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="pl-2">
                                            {OfferItm?.shipToParty}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="pl-2">
                                            {OfferItm?.shipToPartnerAddress}
                                          </div>
                                        </td>
                                        <td style={{ width: "90px" }}>
                                          <div className="pl-2">
                                            {OfferItm?.itemName}
                                          </div>
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
                                          <div className="text-right pr-2">
                                            {_numItemPrice}
                                          </div>
                                        </td>
                                        {isTransportRate && (
                                          <td
                                            style={{ width: "20px" }}
                                            className="text-right"
                                          >
                                            {OfferItm?.transportRate || 0}
                                          </td>
                                        )}
                                        <td style={{ width: "20px" }}>
                                          <div className="text-right pr-2">
                                            {OfferItm?.numOrderQuantity}
                                          </div>
                                        </td>
                                        <td style={{ width: "20px" }}>
                                          <div className="text-right pr-2">
                                            {OfferItm?.pendingQty}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            width: "150px",
                                            verticalAlign: "middle",
                                          }}
                                        >
                                          <div className="px-2">
                                            {OfferItm?.deliveryQty}
                                          </div>
                                        </td>
                                        <td style={{ width: "10px" }}>
                                          <div className="pl-2">Yes</div>
                                        </td>

                                        {!isEdit && (
                                          <td className="text-center"></td>
                                        )}
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
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default Form;
