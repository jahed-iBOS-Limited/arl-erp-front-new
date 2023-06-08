import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import Axios from "axios";
import {
  GetCustomHouseDDL_api,
  getTradeTypeDDL,
  getPaymentTermDDL,
  getItemDDL,
  getUomDDL,
  getTaxConfig,
  getDeliveryToDDL,
  getSelectedItemInfo,
  getTaxPortDDL,
  GetHSCodeByTarrifSchedule_api,
} from "../helper";

import * as Yup from "yup";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";

const validationSchema = Yup.object().shape({
  deliveryTo: Yup.object().shape({
    label: Yup.string().required("Delivery To is required"),
    value: Yup.string().required("Delivery To is required"),
  }),

  supplier: Yup.object().shape({
    label: Yup.string().required("Customer Name/Bin No is required"),
    value: Yup.string().required("Customer Name/Bin No is required"),
  }),

  tradeType: Yup.object().shape({
    label: Yup.string().required("Trade Type is required"),
    value: Yup.string().required("Trade Type is required"),
  }),
  refferenceNo: Yup.string(),
  vehicalInfo: Yup.string().required("Vehical Info is required"),
  address: Yup.string().required("address is required"),
  deliveryAddress: Yup.string().required("Delivery Address is required"),

  transactionDate: Yup.date().required("Trade Type is required"),
  refferenceDate: Yup.date().required("Trade Type is required"),
  taxDeliveryDateTime: Yup.date().required("Trade Type is required"),

  customsHouse: Yup.string().when("tradeType", {
    is: (tradeType) => {
      return [3, 4].includes(+tradeType?.value);
    },
    then: Yup.string()
      .required("Customs House is required")
      .typeError("Customs House is required"),
  }),
  port: Yup.string().when("tradeType", {
    is: (tradeType) => {
      return [3, 4].includes(+tradeType?.value);
    },
    then: Yup.string()
      .required("Port is required")
      .typeError("Port is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  remover,
  setter,
  rowDto,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  dataHandler,
  itemSelectHandler,
}) {
  // eslint-disable-next-line no-unused-vars
  const [customHouseDDL, setCustomHouseDDL] = useState([]);
  const [taxPortDDL, setTaxPortDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [uomDDL, setUomDDL] = useState([]);
  const [deliveryToDDL, setDeliveryToDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [taxConfig, setTaxConfig] = useState({});
  const [selectedItemInfo, setSelectedItemInfo] = useState({});
  const [tarrifScheduleInfoOne, setTarrifScheduleInfoOne] = useState([]);
  const [tarrifScheduleInfoTwo, setTarrifScheduleInfoTwo] = useState([]);

  // const [check, setCheck] = useState(false);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetCustomHouseDDL_api(setCustomHouseDDL);
      getTaxPortDDL(setTaxPortDDL);
      getTaxConfig(selectedBusinessUnit.value, setTaxConfig);
      getTradeTypeDDL(setTradeTypeDDL);
      getPaymentTermDDL(setPaymentTermDDL);
      getItemDDL(profileData.accountId, selectedBusinessUnit.value, setItemDDL);
      getUomDDL(profileData.accountId, selectedBusinessUnit.value, setUomDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-12">
                  <div className="row" style={{ paddingBottom: "10px 0" }}>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="tradeType"
                        options={tradeTypeDDL}
                        value={values?.tradeType}
                        label="Trade Type"
                        onChange={(valueOption) => {
                          setFieldValue("tradeType", valueOption);
                          setFieldValue("selectedItem", "");
                          setFieldValue("selectedUom", "");
                          setFieldValue("rate", "");
                          setTarrifScheduleInfoOne([]);
                          setTarrifScheduleInfoTwo([]);
                        }}
                        placeholder="Trade Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>

                    {/* <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="supplier"
                        options={supplierDDL}
                        value={values?.supplier}
                        label="Customer Name/Bin No"
                        onChange={(valueOption) => {
                          setFieldValue("supplier", valueOption);
                          setFieldValue("deliveryTo", "");
                          setFieldValue("address", valueOption?.address);
                          getDeliveryToDDL(valueOption?.value, setDeliveryToDDL);
                        }}
                        placeholder="Customer Name/Bin No"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div> */}

                    <div className="col-lg-3 mb-1">
                      <label>Customer Name/Bin No</label>
                      <SearchAsyncSelect
                        selectedValue={values?.supplier || ""}
                        handleChange={(valueOption) => {
                          setFieldValue("supplier", valueOption);
                          setFieldValue("deliveryTo", "");
                          setFieldValue("address", valueOption?.address);
                          setDeliveryToDDL([]);
                          getDeliveryToDDL(
                            valueOption?.value,
                            setDeliveryToDDL
                          );
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 2) return [];
                          return Axios.get(
                            `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=2&Search=${v}`
                          ).then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                              // label: `${item?.name}(${item?.label})`,
                            }));
                            return updateList;
                          });
                        }}
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="supplier"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Address</label>
                      <InputField
                        value={values?.address}
                        name="address"
                        placeholder="Address"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <InputField
                        value={values?.transactionDate}
                        label="Transaction Date"
                        // disabled={id ? true : false}
                        type="date"
                        name="transactionDate"
                        placeholder=""
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="deliveryTo"
                        options={deliveryToDDL}
                        value={values?.deliveryTo}
                        label="Delivery To"
                        onChange={(valueOption) => {
                          setFieldValue("deliveryTo", valueOption);
                          setFieldValue(
                            "deliveryAddress",
                            valueOption?.address
                          );
                        }}
                        placeholder="Delivery To"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Delivery Address</label>
                      <InputField
                        value={values?.deliveryAddress || ""}
                        name="deliveryAddress"
                        placeholder="Address"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <InputField
                        value={values?.taxDeliveryDateTime}
                        label="Delivery Date"
                        // disabled={id ? true : false}
                        type="date"
                        name="taxDeliveryDateTime"
                        placeholder=""
                      />
                    </div>

                    {[3, 4].includes(values?.tradeType?.value) && (
                      <>
                        <div className="col-lg-3 mb-1">
                          <NewSelect
                            name="customsHouse"
                            options={customHouseDDL || []}
                            value={values?.customsHouse}
                            label="Customs House"
                            onChange={(valueOption) => {
                              setFieldValue("customsHouse", valueOption);
                              setFieldValue(
                                "customsHouseCode",
                                valueOption?.code || ""
                              );
                            }}
                            placeholder="Customs House"
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit}
                          />
                        </div>
                        {values?.customsHouse?.code && (
                          <div className="col-lg-3 mb-1">
                            <label>Customs House Code</label>
                            <InputField
                              value={values?.customsHouseCode}
                              name="customsHouseCode"
                              placeholder="Customs House"
                              type="text"
                              disabled
                            />
                          </div>
                        )}
                        <div className="col-lg-3 mb-1">
                          <NewSelect
                            name="port"
                            options={taxPortDDL}
                            value={values?.port}
                            label="Port"
                            onChange={(valueOption) => {
                              setFieldValue("port", valueOption);
                            }}
                            placeholder="Port"
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit}
                          />
                        </div>
                      </>
                    )}

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Vehical Info</label>
                      <InputField
                        value={values?.vehicalInfo}
                        name="vehicalInfo"
                        placeholder="Vehical Info"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Refference No</label>
                      <InputField
                        value={values?.refferenceNo}
                        name="refferenceNo"
                        placeholder="Refference No"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <InputField
                        value={values?.refferenceDate}
                        label="Refference Date"
                        // disabled={id ? true : false}
                        type="date"
                        name="refferenceDate"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                {/* Item Input */}
                <div className="col-md-12">
                  <div className="row " style={{ paddingTop: "10px" }}>
                    <div className="col-lg-2 pl pr-1 mb-1">
                      <NewSelect
                        name="selectedItem"
                        options={itemDDL}
                        value={values?.selectedItem}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("selectedUom", {
                            value: valueOption?.uomId,
                            label: valueOption?.uomName,
                          });

                          getSelectedItemInfo(
                            valueOption?.value,
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            setSelectedItemInfo,
                            setFieldValue
                          );
                          setTarrifScheduleInfoOne([]);
                          setTarrifScheduleInfoTwo([]);
                          if (values?.tradeType?.value === 5) {
                            GetHSCodeByTarrifSchedule_api(
                              valueOption?.hsCode,
                              2,
                              setTarrifScheduleInfoTwo
                            );
                          } else {
                            GetHSCodeByTarrifSchedule_api(
                              valueOption?.hsCode,
                              1,
                              setTarrifScheduleInfoOne
                            );
                          }

                          setFieldValue("selectedItem", valueOption);
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.tradeType}
                      />
                    </div>
                    <div className="col-lg-2 pl pr-1 mb-1">
                      <NewSelect
                        name="selectedUom"
                        options={uomDDL}
                        value={values?.selectedUom}
                        label="UOM"
                        onChange={(valueOption) => {
                          setFieldValue("selectedUom", valueOption);
                        }}
                        placeholder="Select Uom"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-2 pl pr-1 mb-1">
                      <label>Quantity</label>
                      <InputField
                        value={values?.quantity}
                        name="quantity"
                        placeholder="Quantity"
                        type="number"
                        min="0"
                        onChange={(e) => {
                          setFieldValue("quantity", e.target.value);
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "quantity"
                          );
                        }}

                        // disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <label>Rate</label>
                      <InputField
                        value={values?.rate}
                        name="rate"
                        placeholder="Rate"
                        type="number"
                        disabled={true}
                        onChange={(e) => {
                          setFieldValue("rate", e.target.value);
                          NegetiveCheck(e.target.value, setFieldValue, "rate");
                        }}
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <button
                        type="button"
                        disabled={
                          !values.selectedItem ||
                          !values.selectedUom ||
                          !values.quantity ||
                          !values.rate
                        }
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={(e) => {
                          setter({ values, selectedItemInfo }, () => {
                            setValues({
                              ...values,
                              selectedItem: "",
                              selectedUom: "",
                              quantity: "",
                              rate: "",
                            });
                            setSelectedItemInfo({});
                          });
                        }}
                        class="btn btn-primary ml-2"
                      >
                        Add
                      </button>
                    </div>
                    <div className="col-12">
                      {values?.selectedItem && (
                        <>
                          <div className="d-flex justify-content-between w-100">
                            <div className="">
                              <label style={{ display: "block" }}>
                                <span style={{ fontWeight: "bold" }}>
                                  HSCode:{" "}
                                </span>{" "}
                                {values?.selectedItem?.hsCode}
                              </label>
                            </div>

                            {/* if type import */}
                            {tarrifScheduleInfoOne?.length > 0 && (
                              <>
                                <div className="">
                                  <label style={{ display: "block" }}>
                                    <span style={{ fontWeight: "bold" }}>
                                      Vat:{" "}
                                    </span>{" "}
                                    {tarrifScheduleInfoOne?.[0]?.vat}
                                  </label>
                                </div>
                                {/* <div className="">
                                  <label style={{ display: "block" }}>
                                    <span style={{ fontWeight: "bold" }}>
                                      SD:{" "}
                                    </span>{" "}
                                    {tarrifScheduleInfoOne?.[0]?.sd}
                                  </label>
                                </div> */}
                              </>
                            )}

                            {tarrifScheduleInfoTwo?.length > 0 && (
                              <>
                                <div className="">
                                  <label style={{ display: "block" }}>
                                    <span style={{ fontWeight: "bold" }}>
                                      Vat:{" "}
                                    </span>{" "}
                                    {tarrifScheduleInfoTwo?.[0]?.vat}
                                  </label>
                                </div>
                                {/* <div className="">
                                  <label style={{ display: "block" }}>
                                    <span style={{ fontWeight: "bold" }}>
                                      SD:{" "}
                                    </span>{" "}
                                    {tarrifScheduleInfoTwo?.[0]?.sd}
                                  </label>
                                </div> */}
                              </>
                            )}

                            <div className="">
                              <label style={{ display: "block" }}>
                                <span style={{ fontWeight: "bold" }}>
                                  Description:{" "}
                                </span>{" "}
                                {values?.selectedItem?.description}
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 pr-0">
                  <table className={"table global-table"}>
                    <thead
                    // className={rowDto?.length < 1 && "d-none"}
                    >
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "120px" }}>Item Name</th>
                        <th style={{ width: "100px" }}>UOM</th>
                        <th style={{ width: "50px" }}>Quantity</th>
                        <th style={{ width: "50px" }}>Rate</th>
                        <th style={{ width: "50px" }}>SD%</th>
                        <th style={{ width: "50px" }}>VAT%</th>
                        <th style={{ width: "50px" }}>Surcharge</th>
                        <th style={{ width: "50px" }}>Total Amount</th>
                        <th style={{ width: "50px" }}>isFree</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-left pl-2">{item?.label}</div>
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.uom?.label}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">{item.quantity}</div>
                          </td>
                          <td>
                            <div className="text-right pr-1">{item.rate}</div>
                          </td>

                          <td>
                            <div className="text-right pr-1">{item.sd}</div>
                          </td>

                          <td>
                            <div className="text-right pr-1">{item.vat}</div>
                          </td>

                          <td>
                            <div className="text-right pr-1">
                              {item.surcharge}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-1">
                              {item.totalAmount}
                            </div>
                          </td>

                          <td className="text-center">
                            <input
                              onChange={(e) => {
                                dataHandler("isFree", e.target.checked, index);
                              }}
                              checked={item.isFree}
                              type="checkbox"
                            />
                          </td>
                          <td className="text-center">
                            <IDelete remover={remover} id={index} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
