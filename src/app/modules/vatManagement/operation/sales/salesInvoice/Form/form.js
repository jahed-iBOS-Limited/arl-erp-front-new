import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Axios from "axios";
import {
  getTradeTypeDDL,
  getPaymentTermDDL,
  getItemDDL,
  getUomDDL,
  getTaxConfig,
  getDeliveryToDDL,
  getSelectedItemInfo,
  GetCustomHouseDDL_api,
  getVehicleDDL,
  salesAttachment_action,
  getTaxPortDDL,
} from "../helper";

import * as Yup from "yup";
import NewSelect from "./../../../../../_helper/_select";
import InputField from "./../../../../../_helper/_inputField";
import { NegetiveCheck } from "./../../../../../_helper/_negitiveCheck";
import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import { _formatMoney } from "./../../../../../_helper/_formatMoney";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../../_helper/_formikError";
import { useHistory } from "react-router-dom";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
import { getIsClosingCheck_api } from "./../../../../../_helper/commonHelper";
import { _contactNoValidation } from "./../../../../../_helper/_contactNoValidation";

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
  address: Yup.string().required("Customer Address is required"),
  deliveryAddress: Yup.string().required("Delivery Address is required"),
  driverContact: Yup.string()
    .min(11, "Maximum 11 number")
    .max(11, "Maximum 11 number"),
  transactionDate: Yup.date().required("Invoice Date is required"),
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
  setUploadImage,
  setIsClosingCheck,
}) {
  const [taxPortDDL, setTaxPortDDL] = useState([]);
  // const [supplierDDL, setSupplierDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [uomDDL, setUomDDL] = useState([]);
  const [deliveryToDDL, setDeliveryToDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [taxConfig, setTaxConfig] = useState({});
  const [selectedItemInfo, setSelectedItemInfo] = useState({});
  const [rateValidation, setRateValidation] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [customHouseDDL, setCustomHouseDDL] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);

  // const [check, setCheck] = useState(false);
  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      GetCustomHouseDDL_api(setCustomHouseDDL);
      getTaxPortDDL(setTaxPortDDL);
      getTaxConfig(selectedBusinessUnit.value, setTaxConfig);
      getTradeTypeDDL(setTradeTypeDDL);
      getPaymentTermDDL(setPaymentTermDDL);
      getItemDDL(profileData.accountId, selectedBusinessUnit.value, setItemDDL);
      getUomDDL(profileData.accountId, selectedBusinessUnit.value, setUomDDL);
      getVehicleDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setVehicleDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const rateOnchangeHandler = (value, setFieldValue, values) => {
    const percentage = (+values?.declarePrice / 100) * 7.5;
    const maxValue = +values?.declarePrice + percentage;
    const minValue = +values?.declarePrice - percentage;
    if (value <= maxValue && value >= minValue) {
      setFieldValue("rate", value);
      setRateValidation(false);
    } else {
      setFieldValue("rate", value);
      setRateValidation(true);
    }
  };

  // const totalAmount = rowDto?.reduce(
  //   (acc, cur) => (acc += +cur?.totalAmount),
  //   0
  // );

  const history = useHistory();

  useEffect(() => {
    if (initData?.transactionDate) {
      getIsClosingCheck_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        initData?.transactionDate,
        setIsClosingCheck
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);
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
                          setFieldValue("customsHouse", "");
                          setFieldValue("customsHouseCode", "");
                          setFieldValue("port", "");
                        }}
                        placeholder="Trade Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3  ">
                      <label>Customer Name/Bin No</label>
                      <SearchAsyncSelect
                        selectedValue={values?.supplier}
                        handleChange={(valueOption) => {
                          setFieldValue("address", valueOption?.address);
                          setFieldValue("supplier", valueOption);
                          setFieldValue("deliveryTo", "");
                          setFieldValue("deliveryAddress", "");
                          setFieldValue("address", valueOption?.address);
                          getDeliveryToDDL(
                            valueOption?.value,
                            setDeliveryToDDL,
                            setFieldValue
                          );
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 2) return [];
                          return Axios.get(
                            `/vat/TaxDDL/GetPartnerBinDDL?PartnerTypeId=${2}&AccountId=${
                              profileData?.accountId
                            }&BusinessUnitId=${
                              selectedBusinessUnit?.value
                            }&BinNo=${v}&TradeType=0`
                          ).then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                              label: `${item?.name}(${item?.label})`,
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
                      <label>Customer Address</label>
                      <InputField
                        value={values?.address}
                        name="address"
                        placeholder="Customer Address"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Invoice Date</label>
                      <InputField
                        value={values?.transactionDate}
                        type="date"
                        name="transactionDate"
                        placeholder=""
                        min={_todayDate()}
                        onChange={(e) => {
                          setFieldValue("transactionDate", e.target.value);
                          getIsClosingCheck_api(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            e.target.value,
                            setIsClosingCheck
                          );
                        }}
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
                      <div className="d-flex">
                        <NewSelect
                          name="vehicalInfo"
                          options={vehicleDDL}
                          value={values?.vehicalInfo}
                          label="Vehicle"
                          onChange={(valueOption) => {
                            setFieldValue("vehicalInfo", valueOption);
                            setFieldValue(
                              "driverName",
                              valueOption?.driverName || ""
                            );
                            setFieldValue(
                              "driverContact",
                              valueOption?.contactNumber || ""
                            );
                          }}
                          placeholder="Vehicle"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                          style={{ flex: 1 }}
                        />

                        <div
                          className="mt-6 pl-2"
                          onClick={() => {
                            history.push(
                              "/configuration/vehicleManagement/vehicle/create"
                            );
                          }}
                        >
                          <i
                            style={{ fontSize: "15px", color: "#3699FF" }}
                            className="fa pointer fa-plus-circle"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Driver Name</label>
                      <InputField
                        value={values?.driverName || ""}
                        name="driverName"
                        placeholder="Driver Name"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Driver Contact No.</label>
                      <InputField
                        value={values?.driverContact || ""}
                        name="driverContact"
                        placeholder="Driver Contact No."
                        type="text"
                        disabled={isEdit}
                        onChange={(e) => {
                          if (_contactNoValidation(e.target.value)) {
                            setFieldValue("driverContact", e.target.value);
                          }
                        }}
                        min="0"
                        defaultNumber={true}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>PO No (Optional)</label>
                      <InputField
                        value={values?.refferenceNo}
                        name="refferenceNo"
                        placeholder="Refference No"
                        type="text"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {values?.attachmentLink && (
                        <button
                          className="btn btn-primary mt-7"
                          type="button"
                          onClick={() => {
                            // dispatch(
                            //   getDownlloadFileView_Action(values?.attachmentLink)
                            // );
                          }}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row global-form">
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
                          setFieldValue("selectedItem", valueOption);
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
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
                        step="any"
                        // disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-1 position-relative">
                      <label>Rate</label>
                      <InputField
                        value={values?.rate}
                        name="rate"
                        placeholder="Rate"
                        type="number"
                        disabled={
                          !values?.declarePrice || !values?.selectedItem
                        }
                        onChange={(e) => {
                          rateOnchangeHandler(
                            e.target.value,
                            setFieldValue,
                            values
                          );

                          //NegetiveCheck(e.target.value, setFieldValue, "rate")
                        }}
                        min="0"
                        step="any"
                      />
                      <p
                        className="text-danger mb-0"
                        style={{
                          position: "absolute",
                          bottom: "-13px",
                          left: "7px",
                          width: "268px",
                        }}
                      >
                        {rateValidation &&
                          "For price change of +_ 7.5% you need new declaration!"}
                      </p>
                    </div>

                    <div className="col-lg-4 pl pr-1 mb-1 d-flex justify-content-around align-items-center mt-2">
                      <p className="mb-0">
                        <b>Declare Price: </b>
                        {values?.declarePrice || 0}
                      </p>
                      <button
                        type="button"
                        disabled={
                          !values.selectedItem ||
                          !values.selectedUom ||
                          !values.quantity ||
                          !values.rate ||
                          rateValidation
                        }
                        onClick={(e) => {
                          setter({ values, selectedItemInfo }, () => {
                            setValues({
                              ...values,
                              selectedItem: "",
                              selectedUom: "",
                              quantity: "",
                              rate: "",
                              declarePrice: "0",
                            });
                            setSelectedItemInfo({});
                          });
                        }}
                        class="btn btn-primary ml-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {rowDto?.length > 0 && (
                <div className="row">
                  <div class="col mt-2 d-flex flex-column justify-content-end align-items-end">
                    <p className="mb-1">
                      <strong>Amount (Without SD/VAT):</strong>{" "}
                      {_formatMoney(
                        rowDto
                          ?.reduce(
                            (acc, cur) => acc + cur?.quantity * cur?.rate,
                            0
                          )
                          ?.toFixed(2)
                      )}
                    </p>
                    <p className="mb-1">
                      <strong>Total (SD/VAT):</strong>{" "}
                      {_formatMoney(
                        rowDto
                          ?.reduce((acc, cur) => {
                            // const amount = cur?.quantity * cur?.rate;
                            // const sdAmount = (amount * cur?.sd) / 100;
                            // const vatAmount = (amount * cur?.vat) / 100;
                            return acc + (cur?.sdtotal + cur?.vatTotal);
                          }, 0)
                          ?.toFixed(2)
                      )}
                    </p>
                    <p className="mb-1">
                      <strong>Grand Total:</strong>{" "}
                      {_formatMoney(
                        rowDto
                          ?.reduce((acc, cur) => {
                            const amount = cur?.quantity * cur?.rate;
                            // const sdAmount = (amount * cur?.sd) / 100;
                            // const vatAmount = (amount * cur?.vat) / 100;
                            return (
                              acc + (amount + cur?.sdtotal + cur?.vatTotal)
                            );
                          }, 0)
                          ?.toFixed(2)
                      )}
                    </p>
                    {/* <p className="mb-0 ml-1">
                    <strong>Total Amount</strong>{" "}
                    {_formatMoney(totalAmount.toFixed(2))}
                  </p> */}
                  </div>
                  <div className="col-lg-12 pr-0">
                    <table className={"table global-table"}>
                      <thead
                      // className={rowDto?.length < 1 && "d-none"}
                      >
                        {/* <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Item Name</th>
                          <th style={{ width: "100px" }}>UOM</th>
                          <th style={{ width: "50px" }}>Quantity</th>
                          <th style={{ width: "50px" }}>Rate</th>
                          <th style={{ width: "50px" }}>SD%</th>
                          <th style={{ width: "50px" }}>VAT%</th>
                          <th style={{ width: "50px" }}>Surcharge%</th>
                          <th style={{ width: "50px" }}>Total Amount</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr> */}
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Item Name</th>
                          <th style={{ width: "100px" }}>UOM</th>
                          <th style={{ width: "50px" }}>Quantity</th>
                          <th style={{ width: "50px" }}>Rate(Taka)</th>
                          <th style={{ width: "50px" }}>Total Value(Taka)</th>
                          <th style={{ width: "50px" }}>SD%</th>
                          <th style={{ width: "50px" }}>SD Amount</th>
                          <th style={{ width: "50px" }}>VAT%/Fixed</th>
                          <th style={{ width: "50px" }}>VAT Amount</th>
                          {/* <th style={{ width: "50px" }}>Surcharge%</th>
                          <th style={{ width: "50px" }}>Surcharge Amount</th> */}
                          <th style={{ width: "50px" }}>
                            Total including VAT&SD
                          </th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          // <tr key={index}>
                          //   <td>{index + 1}</td>
                          //   <td>
                          //     <div className="text-left pl-2">
                          //       {item?.label}
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <div className="text-left pl-2">
                          //       {item?.uom?.label}
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <div className="text-right">
                          //       {_fixedPoint(item.quantity)}
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <div className="text-right pr-1">
                          //       {_fixedPoint(item.rate)}
                          //     </div>
                          //   </td>

                          //   <td>
                          //     <div className="text-right pr-1">
                          //       {item?.isOnQty ? "Fixed" : _fixedPoint(item.sd)}
                          //     </div>
                          //   </td>

                          //   <td>
                          //     <div className="text-right pr-1">
                          //       {item?.isOnQty
                          //         ? "Fixed"
                          //         : _fixedPoint(item.vat)}
                          //     </div>
                          //   </td>

                          //   <td>
                          //     <div className="text-right pr-1">
                          //       {item?.isOnQty
                          //         ? "Fixed"
                          //         : _fixedPoint(item.surcharge)}
                          //     </div>
                          //   </td>
                          //   <td>
                          //     <div className="text-right pr-1">
                          //       {_fixedPoint(item.totalAmount, true)}
                          //     </div>
                          //   </td>

                          //   {/* <td className="text-center">
                          //   <input
                          //     onChange={(e) => {
                          //       dataHandler("isFree", e.target.checked, index);
                          //     }}
                          //     checked={item.isFree}
                          //     type="checkbox"
                          //   />
                          // </td> */}
                          //   <td className="text-center">
                          //     <IDelete remover={remover} id={index} />
                          //   </td>
                          // </tr>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="text-left pl-2">
                                {item?.label}
                              </div>
                            </td>
                            <td>
                              <div className="text-left pl-2">
                                {item?.uom?.label}
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                                {_fixedPoint(item.quantity)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-1">
                                {_fixedPoint(item.rate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-1">
                                {_fixedPoint(item.totalPrice)}
                              </div>
                            </td>

                            <td>
                              <div className="text-right pr-1">
                                {`${_fixedPoint(item.sd)}%`}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-1">
                                {_fixedPoint(item.sdtotal)}
                              </div>
                            </td>

                            <td>
                              <div className="text-right pr-1">
                                {item?.isOnQty
                                  ? _fixedPoint(item.vat)
                                  : `${_fixedPoint(item.vat)}%`}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-1">
                                {_fixedPoint(item.vatTotal)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-1">
                                {_fixedPoint(item.totalAmount, true)}
                              </div>
                            </td>
                            <td className="text-center">
                              <IDelete remover={remover} id={index} />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colspan="5">
                            <b>Total</b>
                          </td>

                          <td>
                            <div className="text-right pr-1">
                              <b>
                                {_fixedPoint(
                                  rowDto?.reduce(
                                    (acc, cur) => (acc += +cur?.totalPrice),
                                    0
                                  )
                                )}
                              </b>
                            </div>
                          </td>
                          <td></td>
                          <td>
                            <div className="text-right pr-1">
                              <b>
                                {_fixedPoint(
                                  rowDto?.reduce(
                                    (acc, cur) => (acc += +cur?.sdtotal),
                                    0
                                  )
                                )}
                              </b>
                            </div>
                          </td>
                          <td></td>
                          <td>
                            <div className="text-right pr-1">
                              <b>
                                {_fixedPoint(
                                  rowDto?.reduce(
                                    (acc, cur) => (acc += +cur?.vatTotal),
                                    0
                                  )
                                )}
                              </b>
                            </div>
                          </td>

                          <td>
                            <div className="text-right pr-1">
                              <b>
                                {" "}
                                {_fixedPoint(
                                  rowDto?.reduce(
                                    (acc, cur) => (acc += +cur?.totalAmount),
                                    0
                                  ),
                                  true
                                )}
                              </b>
                            </div>
                          </td>
                          <td> </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={["image/*", "application/pdf"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={1000000}
              open={open}
              onAdd={(newFileObjs) => {
                setFileObjects([].concat(newFileObjs));
              }}
              onDelete={(deleteFileObj) => {
                const newData = fileObjects.filter(
                  (item) => item.file.name !== deleteFileObj.file.name
                );
                setFileObjects(newData);
              }}
              onClose={() => setOpen(false)}
              onSave={() => {
                salesAttachment_action(fileObjects, setUploadImage);
                setOpen(false);
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
    </>
  );
}
