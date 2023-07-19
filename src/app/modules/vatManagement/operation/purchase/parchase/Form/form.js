/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Axios from "axios";
import { NegetiveCheck } from "./../../../../../_helper/_negitiveCheck";
import {
  getVatBranches,
  getSupplierDDL,
  getTradeTypeDDL,
  getPaymentTermDDL,
  // getItemDDL,
  getUomDDL,
  getTaxConfig,
  getItemTypeDDL,
  getTaxPortDDL,
  getVehicleDDL,
  getCountryDDL_api,
  GetCustomHouseDDL_api,
  GetItemInfoByItemHs_api,
  GetItemVatInfoByHsCodeImport_api,
  GetItemVatInfoByHsCodeLocal,
} from "../helper";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import { useHistory } from "react-router-dom";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { purchaseAttachment_action } from "../helper";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
import { toast } from "react-toastify";
import { getIsClosingCheck_api } from "./../../../../../_helper/commonHelper";
import IViewModal from "./../../../../../_helper/_viewModal";
import HSCodeInfoModel from "./HSCodeInfoModel";

// Validation schema
const validationSchema = Yup.object().shape({
  // purchaseType: Yup.object().shape({
  //   label: Yup.string().required("Purchase Type is required"),
  //   value: Yup.string().required("Purchase Type is required"),
  // }),

  lcNumber: Yup.string().when("tradeType", {
    is: (tradeType) => {
      return [2].includes(+tradeType?.value);
    },
    then: Yup.string()
      .min(16, "Minimum 16 symbols")
      .max(16, "Maximum 16 symbols")
      .required("LC No. is required")
      .typeError("LC No. is required"),
  }),

  supplier: Yup.object().shape({
    label: Yup.string().required("Field is required"),
    value: Yup.string().required("Field is required"),
  }),
  tradeType: Yup.object().shape({
    label: Yup.string().required("Trade Type is required"),
    value: Yup.string().required("Trade Type is required"),
  }),

  customsHouse: Yup.string().when("tradeType", {
    is: (tradeType) => {
      return [2].includes(+tradeType?.value);
    },
    then: Yup.string()
      .required("Customs House is required")
      .typeError("Customs House is required"),
  }),
  port: Yup.string().when("tradeType", {
    is: (tradeType) => {
      return [2].includes(+tradeType?.value);
    },
    then: Yup.string()
      .required("Port is required")
      .typeError("Port is required"),
  }),

  address: Yup.string().required("Address is required"),
  refferenceNo: Yup.string().required("Field is required"),
  transactionDate: Yup.date().required("Transaction date is required"),
  refferenceDate: Yup.date().required("Reference date is required"),
  totalAtv: Yup.number(),
  totalAit: Yup.number(),
  CPCCode: Yup.string().when("tradeType", {
    is: (tradeType) => {
      return [2].includes(+tradeType?.value);
    },
    then: Yup.string()
      .matches(/^\w{4}-\w*$/, "Invalid Number")
      .matches(/^[0-9]+-[0-9]*$/, "Must be only number")
      .min(8, "Minimum 7 symbols")
      .max(8, "Maximum 7 symbols")
      .required("CPC Code is required")
      .typeError("CPC Code is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  remover,
  setter,
  rowDto,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  dataHandler,
  setUploadImage,
  setItemVatInfo,
  setDisabled,
  totalVDSAmount,
  setTotalVDSAmount,
  setIsClosingCheck,
}) {
  // eslint-disable-next-line no-unused-vars
  const [taxBranchName, setTaxBranchName] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [countryDDL, setCountryDDL] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [itemTypeDDL, setItemTypeDDL] = useState([]);
  const [rowClickData, setRowClickData] = useState("");
  const [itemDDL, setItemDDL] = useState([]);
  const [customHouseDDL, setCustomHouseDDL] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [uomDDL, setUomDDL] = useState([]);
  const [taxConfig, setTaxConfig] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [HSCodeViewModel, setHSCodeViewModel] = useState(false);
  const [taxPortDDL, setTaxPortDDL] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit.value &&
      profileData?.userId
    ) {
      getVatBranches(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit.value,
        setTaxBranchName
      );
      getTaxPortDDL(setTaxPortDDL);
      getSupplierDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSupplierDDL
      );
      getTradeTypeDDL(setTradeTypeDDL);
      getPaymentTermDDL(setPaymentTermDDL);
      // getItemDDL(profileData.accountId, selectedBusinessUnit.value, setItemDDL);
      getItemTypeDDL(setItemTypeDDL);
      getUomDDL(profileData.accountId, selectedBusinessUnit.value, setUomDDL);
      getVehicleDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setVehicleDDL
      );
      getCountryDDL_api(setCountryDDL);
      GetCustomHouseDDL_api(setCustomHouseDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  // const rebateAmountCalculationFulnc = (e, vat, rate, quantity, index) => {
  //   const rebateAmount = e.target.value
  //     ? (parseInt(vat) / 100) * (rate * quantity)
  //     : 0;
  //   dataHandler(
  //     "rebateAmount",
  //     Number.parseFloat(rebateAmount).toFixed(2),
  //     index
  //   );
  // };

  useEffect(() => {
    if (
      isEdit &&
      profileData.accountId &&
      selectedBusinessUnit.value &&
      initData?.tradeType?.value
    ) {
      getTaxConfig(
        profileData.accountId,
        selectedBusinessUnit.value,
        initData?.tradeType?.value,
        setTaxConfig
      );
    }
  }, [profileData, selectedBusinessUnit, initData]);

  const history = useHistory();

  useEffect(() => {
    if (!isEdit) {
      if (tradeTypeDDL?.length > 0) {
        getTaxConfig(
          profileData.accountId,
          selectedBusinessUnit.value,
          tradeTypeDDL?.[0]?.value,
          setTaxConfig
        );
      }
    }
  }, [tradeTypeDDL]);

  const totalVDSAmountFunc = () => {
    if (rowDto?.length > 0) {
      const totalVDSAmount = rowDto
        .filter((itm) => itm.vat < 15)
        .reduce((acc, cur) => (acc += cur?.rebateAmount), 0);
      setTotalVDSAmount(_fixedPoint(totalVDSAmount) || 0);
    } else {
      setTotalVDSAmount(0);
    }
  };

  useEffect(() => {
    if (initData?.transactionDate) {
      getIsClosingCheck_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        initData?.transactionDate,
        setIsClosingCheck
      );
    }
  }, [initData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                tradeType: tradeTypeDDL?.length > 0 ? tradeTypeDDL?.[0] : "",
              }
        }
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
          
            {values?.tradeType?.label === "Local Purchase" &&
              totalVDSAmountFunc()}
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3 mb-1">
                  <NewSelect
                    name="tradeType"
                    options={tradeTypeDDL}
                    value={values?.tradeType}
                    label="Trade Type"
                    onChange={(valueOption) => {
                      setFieldValue("tradeType", valueOption);
                      getTaxConfig(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        setTaxConfig
                      );
                      setFieldValue("totalAit", "");
                      setFieldValue("totalVdsAmount", "");
                      setFieldValue("totalTdsAmount", "");
                      setFieldValue("CPCCode", "");

                      setFieldValue("tarrifSchedule", "");
                      setFieldValue("port", "");
                      setFieldValue("supplier", "");
                      setFieldValue("lcNumber", "");
                      setFieldValue("supplyType", "");
                      setFieldValue("selectedItem", "");
                      setFieldValue("vehicalInfo", "");

                      setFieldValue("lcDate", "");
                      setFieldValue("customsHouse", "");
                      setFieldValue("CustomsHouseCode", "");
                      if (valueOption?.label === "Import") {
                        setFieldValue("lcDate", _todayDate());
                      }
                    }}
                    placeholder="Trade type"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || rowDto?.length > 0}
                  />
                </div>
                <div className="col-lg-3 mb-1">
                  <label>
                    {values?.tradeType?.label === "Local Purchase"
                      ? "Supplier Name/Bin No"
                      : "Supplier Name"}
                  </label>
                  <SearchAsyncSelect
                    selectedValue={values?.supplier}
                    handleChange={(valueOption) => {
                      setFieldValue("address", valueOption?.address || "");
                      setFieldValue("supplier", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 2) return [];
                      return Axios.get(
                        `/vat/TaxDDL/GetPartnerBinDDL?PartnerTypeId=${1}&AccountId=${
                          profileData?.accountId
                        }&BusinessUnitId=${
                          selectedBusinessUnit?.value
                        }&BinNo=${v}&TradeType=${values?.tradeType?.value}`
                      ).then((res) => {
                        const updateList = res?.data.map((item) => ({
                          ...item,
                          label: `${item?.name}(${item?.label})`,
                        }));
                        return updateList;
                      });
                    }}
                    isDisabled={isEdit || !values?.tradeType}
                  />
                  <FormikError
                    errors={errors}
                    name="supplier"
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3 mb-1">
                  <label>Address</label>
                  <InputField
                    value={values?.address}
                    name="address"
                    placeholder="Address"
                    type="text"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3 mb-1">
                  <label>Transaction Date</label>
                  <InputField
                    value={values?.transactionDate}
                    type="date"
                    name="transactionDate"
                    placeholder=""
                    disabled={isEdit}
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
                {values?.tradeType?.label === "Local Purchase" && (
                  <div className="col-lg-3 mb-1">
                    <div className="d-flex">
                      <NewSelect
                        name="vehicalInfo"
                        options={vehicleDDL}
                        value={values?.vehicalInfo}
                        label="Vehical Info"
                        onChange={(valueOption) => {
                          setFieldValue("vehicalInfo", valueOption);
                        }}
                        placeholder="Vehical Info"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                        style={{ flex: 1 }}
                      />
                      {!isEdit && (
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
                      )}
                    </div>
                  </div>
                )}

                {values?.tradeType?.label === "Import" && (
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
                            "CustomsHouseCode",
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
                          value={values?.CustomsHouseCode}
                          name="CustomsHouseCode"
                          placeholder="Customs House"
                          type="text"
                          disabled
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="col-lg-3 mb-1">
                  <label>
                    {values?.tradeType?.label === "Local Purchase"
                      ? "Challan No"
                      : "Bill Of Entry No"}
                  </label>
                  <InputField
                    value={values?.refferenceNo}
                    name="refferenceNo"
                    placeholder={
                      values?.tradeType?.label === "Local Purchase"
                        ? "Challan No"
                        : "Bill Of Entry No"
                    }
                    type="text"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3 mb-1">
                  <label>
                    {values?.tradeType?.label === "Local Purchase"
                      ? "Challan Date"
                      : "Bill of Entry Date"}
                  </label>
                  <InputField
                    value={values?.refferenceDate}
                    type="date"
                    name="refferenceDate"
                    placeholder=""
                    disabled={isEdit}
                  />
                </div>
                {values?.tradeType?.label === "Import" && (
                  <>
                    <div className="col-lg-3 mb-1">
                      <label>LC No.</label>
                      <InputField
                        value={values?.lcNumber}
                        name="lcNumber"
                        placeholder="LC No."
                        type="text"
                        disabled={isEdit}
                        onChange={(e) => {
                          const validNumber = /^[0-9]+$/.test(e.target.value);
                          if (validNumber || e.target.value === "") {
                            if (e.target.value.length <= 16) {
                              setFieldValue("lcNumber", e.target.value);
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3 mb-1">
                      <label>LC Date</label>
                      <InputField
                        value={values?.lcDate}
                        name="lcDate"
                        placeholder="LC Date"
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="country"
                        options={countryDDL || []}
                        value={values?.country}
                        label="Country Of Origin"
                        onChange={(valueOption) => {
                          setFieldValue("country", valueOption);
                        }}
                        placeholder="Country Of Origin"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>

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
                    <div className="col-lg-3">
                      <label>Number Of Item</label>
                      <InputField
                        value={values?.numberOfItem}
                        name="numberOfItem"
                        placeholder="Number Of Item"
                        type="number"
                        min="0"
                        disabled={isEdit}
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "numberOfItem"
                          );
                        }}
                      />
                    </div>
                  </>
                )}

                {values?.tradeType?.label === "Local Purchase" && (
                  <>
                    {/* <div className="col-lg-3 mb-1">
                      <label>Total TDS Amount(%)</label>
                      <InputField
                        value={values?.totalTdsAmount}
                        name="totalTdsAmount"
                        s
                        placeholder="Total TDS Amount"
                        type="number"
                        disabled={isEdit}
                        min={0}
                        step="any"
                      />
                    </div> */}
                    <div className="col-lg-3 mb-1">
                      <label>Total VDS Amount</label>
                      <InputField
                        value={totalVDSAmount}
                        name="totalVdsAmount"
                        placeholder="Total VDS Amount"
                        type="number"
                        disabled
                        min={0}
                        step="any"
                      />
                    </div>
                    {/* <div className="col-lg-3 mb-1">
                      <label>Total AIT Amount</label>
                      <InputField
                        value={values?.totalAit}
                        name="totalAit"
                        placeholder="Total AIT Amount"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "totalAit"
                          );
                        }}
                        type="number"
                        min="0"
                        disabled={isEdit}
                        step="any"
                      />
                    </div> */}
                  </>
                )}
                {values?.tradeType?.label === "Import" && (
                  <div className="col-lg-3">
                    <label>CPC Code</label>
                    <InputField
                      value={values?.CPCCode || ""}
                      name="CPCCode"
                      placeholder="eg: 0000-000"
                      type="text"
                      disabled={isEdit}
                      onChange={(e) => {
                        const isHyphen = /^\w{4}-\w*$/.test(e.target.value);
                        const isNumber = /^[0-9]+-?[0-9]*$/.test(
                          e.target.value
                        );
                        if (isNumber || e.target.value === "") {
                          if (e.target.value.toString().length > 4) {
                            if (isHyphen) {
                              if (e.target.value.toString().length <= 8) {
                                setFieldValue("CPCCode", e.target.value);
                              }
                            } else {
                              const number = /^[0-9]+$/.test(e.target.value);
                              if (
                                e.target.value.toString().length === 5 &&
                                number
                              ) {
                                toast.warning("Please enter a hyphen(-)", {
                                  toastId: "hyphen",
                                });
                              }
                            }
                          } else {
                            setFieldValue("CPCCode", e.target.value);
                          }
                        }
                      }}
                    />
                  </div>
                  // <div className="col-lg-3 mb-1">
                  //   <label>CPC Code</label>
                  //   <SearchAsyncSelect
                  //     selectedValue={values?.CPCCode}
                  //     handleChange={(valueOption) => {
                  //       setFieldValue("CPCCode", valueOption);
                  //     }}
                  //     loadOptions={(v) => {
                  //       if (v?.length < 2) return [];
                  //       return Axios.get(
                  //         `/vat/TaxDDL/GetCPCInfoByCode?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SearchTerm=${v}`
                  //       ).then((res) => {
                  //         const updateList = res?.data.map((item) => ({
                  //           ...item,
                  //         }));
                  //         return updateList;
                  //       });
                  //     }}
                  //     isClearable={true}
                  //     isDisabled={isEdit}
                  //   />
                  //   <FormikError
                  //     errors={errors}
                  //     name="CPCCode"
                  //     touched={touched}
                  //   />
                  // </div>
                )}

                {/* {values?.CPCCode?.label && (
                  <div className="col-lg-3 d-flex align-items-center">
                    <b>Description: </b> {values?.CPCCode?.details}
                  </div>
                )} */}

                <div className="col d-flex justify-content-end align-items-center">
                  {!isEdit && (
                    <button
                      className="btn btn-primary mr-2 mt-5"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                  )}

                  {values?.fileNo && (
                    <button
                      className="btn btn-primary mt-5"
                      type="button"
                      onClick={() => {
                        dispatch(getDownlloadFileView_Action(values?.fileNo));
                      }}
                    >
                      Attachment View
                    </button>
                  )}
                </div>
              </div>

              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Trade Name/HS Code</label>
                  <SearchAsyncSelect
                    selectedValue={values?.tarrifSchedule}
                    handleChange={(valueOption) => {
                      setFieldValue("tarrifSchedule", valueOption);
                      setFieldValue("supplyType", "");
                      setFieldValue("selectedItem", "");
                      setItemDDL([]);
                      setItemVatInfo("");
                      GetItemInfoByItemHs_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.hscode,
                        setItemDDL
                      );
                      // tradeType Import
                      if (values?.tradeType?.label === "Import") {
                        GetItemVatInfoByHsCodeImport_api(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.hscode,
                          setItemVatInfo,
                          setDisabled
                        );
                      }
                    }}
                    placeholder="Search by HS Code / Description"
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return Axios.get(
                        `/vat/TaxItemGroup/GetItemTarifSchedule?Searchterm=${v}&Type=${values?.tradeType?.value}`
                      ).then((res) => {
                        const updateList = res?.data.map((item) => ({
                          ...item,
                          label: item?.description,
                        }));
                        return updateList;
                      });
                    }}
                    isClearable={true}
                    isDisabled={!values?.tradeType}
                  />
                  <FormikError
                    errors={errors}
                    name="tarrifSchedule"
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-2">
                  <NewSelect
                    name="supplyType"
                    options={supplyTypeDDL || []}
                    value={values?.supplyType}
                    label="Supply Type"
                    onChange={(valueOption) => {
                      setFieldValue("supplyType", valueOption);
                      setFieldValue("selectedItem", "");
                      if (values?.tradeType?.label === "Local Purchase") {
                        setItemVatInfo("");
                        GetItemVatInfoByHsCodeLocal(
                          values?.tarrifSchedule?.hscode,
                          valueOption?.value,
                          setItemVatInfo,
                          setDisabled
                        );
                      }
                    }}
                    placeholder="Supply Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.tarrifSchedule}
                  />
                </div> */}

                <div className="col-lg-3">
                  <NewSelect
                    name="selectedItem"
                    options={itemDDL || []}
                    value={values?.selectedItem}
                    label="Item"
                    onChange={(valueOption) => {
                      setFieldValue("selectedItem", valueOption);
                      setFieldValue("selectedUom", {
                        value: valueOption?.uomId,
                        label: valueOption?.uomName,
                      });

                      setFieldValue(
                        "supplyType",
                        valueOption?.supplyTypeId
                          ? {
                              value: valueOption?.supplyTypeId,
                              label: valueOption?.supplyTypeName,
                            }
                          : ""
                      );
                      if (values?.tradeType?.label === "Local Purchase") {
                        setItemVatInfo("");
                        GetItemVatInfoByHsCodeLocal(
                          values?.tarrifSchedule?.hscode,
                          valueOption?.supplyTypeId,
                          setItemVatInfo,
                          setDisabled
                        );
                      }
                    }}
                    placeholder="Item Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.tarrifSchedule}
                  />
                </div>

                <div className="col-lg-2">
                  <label>Quantity</label>
                  <InputField
                    value={values?.quantity}
                    name="quantity"
                    placeholder="Quantity"
                    onChange={(e) => {
                      NegetiveCheck(e.target.value, setFieldValue, "quantity");
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>

                <div className="col-lg-2">
                  <label>
                    {values?.tradeType?.label === "Import"
                      ? "Assessable Value"
                      : "Amount"}
                  </label>
                  <InputField
                    value={values?.amount}
                    name="amount"
                    placeholder="Amount"
                    onChange={(e) => {
                      NegetiveCheck(e.target.value, setFieldValue, "rate");
                      if (e.target.value > 0) {
                        setFieldValue("amount", e.target.value);
                      } else {
                        setFieldValue("amount", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>

                <div className="col-lg-2">
                  <button
                    disabled={
                      !values.selectedItem || !values.quantity || !values.amount
                    }
                    style={{
                      marginTop: "16px",
                    }}
                    onClick={(e) => {
                      if (values?.supplyType) {
                        if (values?.tradeType?.label === "Import") {
                          if (
                            +values?.numberOfItem > 0 &&
                            values?.numberOfItem > rowDto.length
                          ) {
                            setter(values, () => {
                              setValues({
                                ...values,
                                selectedItem: "",
                                quantity: "",
                                amount: "",
                                tarrifSchedule: "",
                                supplyType: "",
                              });
                            });
                          } else {
                            toast.warning('Plz increase "Number Of Item"');
                          }
                        } else {
                          setter(values, () => {
                            setValues({
                              ...values,
                              selectedItem: "",
                              quantity: "",
                              amount: "",
                              tarrifSchedule: "",
                              supplyType: "",
                            });
                          });
                        }
                      } else {
                        toast.warning("Supply Type Not Found");
                      }
                    }}
                    class="btn btn-primary ml-2"
                    type="button"
                  >
                    Add
                  </button>
                </div>
                {values?.tarrifSchedule?.hscode && (
                  <div class="col-lg-7 d-flex align-items-center">
                    <p className="m-0 mr-4">
                      <b>HS Code: </b>
                      {values?.tarrifSchedule?.hscode || ""}
                    </p>
                    <p className="m-0">
                      <b>Description: </b>
                      {values?.tarrifSchedule?.description || ""}
                    </p>
                  </div>
                )}
                {values?.tradeType?.label === "Import" ? null : (
                  <div class="col mt-2 d-flex flex-column justify-content-end align-items-end">
                    <p className="mb-1">
                      <strong>Amount (Without SD/VAT):</strong>{" "}
                      {rowDto
                        ?.reduce(
                          (acc, cur) => acc + cur?.quantity * cur?.rate,
                          0
                        )
                        ?.toFixed(2)}
                    </p>
                    <p className="mb-1">
                      <strong>Total (SD/VAT):</strong>{" "}
                      {rowDto
                        ?.reduce((acc, cur) => {
                          const amount = cur?.quantity * cur?.rate;
                          const sdAmount = (amount * cur?.sd) / 100;
                          const vatAmount = (amount * cur?.vat) / 100;
                          return acc + (sdAmount + vatAmount);
                        }, 0)
                        ?.toFixed(2)}
                    </p>
                    <p className="mb-1">
                      <strong>Grand Total:</strong>{" "}
                      {rowDto
                        ?.reduce((acc, cur) => {
                          const amount = cur?.quantity * cur?.rate;
                          const sdAmount = (amount * cur?.sd) / 100;
                          const vatAmount = (amount * cur?.vat) / 100;
                          return acc + (amount + sdAmount + vatAmount);
                        }, 0)
                        ?.toFixed(2)}
                    </p>
                  </div>
                )}

                <div class="col-lg-12"></div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <table className={"table global-table"}>
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "45px" }}>HS Code</th>
                        <th style={{ width: "120px" }}>Item Name</th>
                        <th style={{ width: "120px" }}>Supply Type</th>
                        <th style={{ width: "60px" }}>Unit</th>
                        <th style={{ width: "80px" }}>Quantity</th>
                        <th style={{ width: "80px" }}>
                          {" "}
                          {values?.tradeType?.label === "Import"
                            ? "Assessable Value"
                            : "Amount"}
                        </th>

                        {values?.tradeType?.label === "Import" ? null : (
                          <th style={{ width: "50px" }}>Rate</th>
                        )}

                        {taxConfig?.isCd && (
                          <th style={{ width: "50px" }}>CD</th>
                        )}
                        {taxConfig?.isRd && (
                          <th style={{ width: "50px" }}>RD</th>
                        )}
                        {taxConfig?.isSd && (
                          <th style={{ width: "50px" }}>SD</th>
                        )}
                        {taxConfig?.isVat && (
                          <th style={{ width: "50px" }}>VAT</th>
                        )}
                        {taxConfig?.isAit && (
                          <th style={{ width: "50px" }}>AIT</th>
                        )}
                        {taxConfig?.isAt && (
                          <th style={{ width: "50px" }}>AT</th>
                        )}
                        <th style={{ width: "50px" }}>Rebate Amount</th>
                        <th style={{ width: "50px" }}>Total Amount</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td
                            onClick={() => {
                              setRowClickData(item);
                              setHSCodeViewModel(true);
                            }}
                            className="underLine"
                          >
                            {item?.hsCode || ""}
                          </td>
                          <td>
                            <div className="text-left pl-2">{item?.label}</div>
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.supplyTypeName}
                            </div>
                          </td>
                          <td>{item?.uom?.label}</td>
                          <td className="text-right">
                            {_fixedPoint(item.quantity)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.amount)}
                          </td>

                          {values?.tradeType?.label === "Import" ? null : (
                            <td className="text-right">
                              {_fixedPoint(item.rate)}
                            </td>
                          )}

                          {taxConfig?.isCd && (
                            <td className="text-right">
                              {_fixedPoint(item?.cd)}
                            </td>
                          )}
                          {taxConfig?.isRd && (
                            <td className="text-right">
                              {_fixedPoint(item?.rd)}
                            </td>
                          )}
                          {taxConfig?.isSd && (
                            <td className="text-right">
                              {_fixedPoint(item?.sd)}
                            </td>
                          )}
                          {taxConfig?.isVat && (
                            <td className="text-right">
                              {_fixedPoint(item?.vat)}
                            </td>
                          )}
                          {taxConfig?.isAit && (
                            <td className="text-right">
                              {_fixedPoint(item?.ait)}
                            </td>
                          )}

                          {taxConfig?.isAt && (
                            <td className="text-right">
                              {_fixedPoint(item?.at)}
                            </td>
                          )}

                          <td className="text-right">
                            {_fixedPoint(item?.rebateAmount)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.totalAmount, true, 0)}
                          </td>
                          <td
                            className="text-center"
                            style={{ verticalAlign: "middle" }}
                          >
                            <IDelete remover={remover} id={index} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {HSCodeViewModel && (
                <IViewModal
                  show={HSCodeViewModel}
                  onHide={() => setHSCodeViewModel(false)}
                >
                  <HSCodeInfoModel rowClickData={rowClickData} />
                </IViewModal>
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
                purchaseAttachment_action(fileObjects, setUploadImage);
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
