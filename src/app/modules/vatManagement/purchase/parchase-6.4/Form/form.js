/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import Axios from "axios";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";
import {
  getCountryDDL_api,
  GetCustomHouseDDL_api,
  GetHSCodeByTarrifSchedule_api,
  getItemDDL,
  getItemTypeDDL,
  getPaymentTermDDL,
  getTaxConfig,
  getTaxPortDDL,
  getTradeTypeDDL,
  getUomDDL,
  getVatBranches,
  purchaseAttachment_action,
} from "../helper";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { _todayDate } from "./../../../../_helper/_todayDate";
// import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";

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
  setDisabled,
}) {
  // Validation schema
  const validationSchema = Yup.object().shape({
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
      label: Yup.string().required("Supplier is required"),
      value: Yup.string().required("Supplier is required"),
    }),
    tradeType: Yup.object().shape({
      label: Yup.string().required("Trade Type is required"),
      value: Yup.string().required("Trade Type is required"),
    }),
    // grnCode: Yup.object()
    //   .shape({
    //     label: Yup.string().required("GRN Number is required"),
    //     value: Yup.string().required("GRN Number is required"),
    //   })
    //   .nullable(),
    // grnCode: Yup.string().when("tradeType", {
    //   is: () => {
    //     return selectedBusinessUnit?.value !== 171;
    //   },
    //   then: Yup.string()
    //     .required("GRN Number is required")
    //     .typeError("GRN Number is required"),
    // }),
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
    vehicalInfo: Yup.string().required("Vehical Info is required"),
    address: Yup.string().required("Address is required"),
    transactionDate: Yup.date().required("Trade Type is required"),
    refferenceDate: Yup.date().required("Trade Type is required"),
    refferenceNo: Yup.string().required("Field is required"),

    totalAtv: Yup.number(),
    totalAit: Yup.number(),
  });

  // eslint-disable-next-line no-unused-vars
  const [taxBranchName, setTaxBranchName] = useState([]);
  const [customHouseDDL, setCustomHouseDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  const [countryDDL, setCountryDDL] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [itemTypeDDL, setItemTypeDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [uomDDL, setUomDDL] = useState([]);
  const [taxConfig, setTaxConfig] = useState({});
  const [tarrifScheduleInfoOne, setTarrifScheduleInfoOne] = useState([]);
  const [tarrifScheduleInfoTwo, setTarrifScheduleInfoTwo] = useState([]);
  const [taxPortDDL, setTaxPortDDL] = useState([]);
  // const [grnNumberDDL, setGrnNumberDDL] = useState([]);
  // const dispatch = useDispatch();
  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getVatBranches(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit.value,
        setTaxBranchName
      );
      getTaxPortDDL(setTaxPortDDL);
      getTradeTypeDDL(setTradeTypeDDL);
      getPaymentTermDDL(setPaymentTermDDL);
      getItemDDL(profileData.accountId, selectedBusinessUnit.value, setItemDDL);
      // GetGrnNumberDDLApi(selectedBusinessUnit.value, setGrnNumberDDL);
      getItemTypeDDL(setItemTypeDDL);
      getUomDDL(profileData.accountId, selectedBusinessUnit.value, setUomDDL);
      GetCustomHouseDDL_api(setCustomHouseDDL);
      getCountryDDL_api(setCountryDDL);
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
                  <div
                    className="row bank-journal  "
                    style={{ paddingBottom: "20px 0" }}
                  >
                    <div className="col-lg-3 pl pr-1 mb-1">
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
                          setRowDto([]);
                          setTarrifScheduleInfoOne([]);
                          setTarrifScheduleInfoTwo([]);
                          setFieldValue("selectedUom", "");
                          setFieldValue("supplyType", "");
                        }}
                        placeholder="Trade type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit || rowDto?.length > 0}
                      />
                    </div>
                    {/* <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="supplier"
                        options={supplierDDL}
                        value={values?.supplier}
                        label="Supplier Name/Bin No"
                        onChange={(valueOption) => {
                          setFieldValue("supplier", valueOption);
                          setFieldValue("address", valueOption?.address);
                        }}
                        placeholder="Supplier Name/Bin No"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div> */}

                    <div className="col-lg-3 mb-1">
                      <label>Supplier Name/Bin No</label>
                      <SearchAsyncSelect
                        selectedValue={values?.supplier || ""}
                        handleChange={(valueOption) => {
                          setFieldValue("address", valueOption?.address || "");
                          setFieldValue("supplier", valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 2) return [];
                          return Axios.get(
                            `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=1&Search=${v}`
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
                        type="date"
                        name="transactionDate"
                        placeholder=""
                      />
                    </div>

                    {/* <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="purchaseType"
                        options={[
                          { value: 1, label: "Examted" },
                          { value: 2, label: "Zero Rated" },
                          { value: 3, label: "Standard Rate" },
                        ]}
                        value={values?.purchaseType}
                        label="Purchase Type"
                        onChange={(valueOption) => {
                          setFieldValue("purchaseType", valueOption);
                        }}
                        placeholder="Purchase Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div> */}
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

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>
                        {" "}
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
                              const validNumber = /^[0-9]+$/.test(
                                e.target.value
                              );
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
                        <div className="col-lg-3 pl pr-1 mb-1">
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
                        </div>
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total VDS Amount(%)</label>
                          <InputField
                            value={values?.totalVdsAmount}
                            name="totalVdsAmount"
                            placeholder="Total VDS Amount"
                            type="number"
                            disabled={isEdit}
                            min={0}
                            step="any"
                          />
                        </div>
                      </>
                    )}

                    {taxConfig?.isAit && (
                      <div className="col-lg-3 pl pr-1 mb-1">
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
                      </div>
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
                                  const number = /^[0-9]+$/.test(
                                    e.target.value
                                  );
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
                    )}

                    {/* <div className="col-lg-3 mb-1">
                      <NewSelect
                        name="grnCode"
                        options={grnNumberDDL || []}
                        value={values?.grnCode}
                        label="GRN Number"
                        onChange={(valueOption) => {
                          setFieldValue("grnCode", valueOption);
                        }}
                        placeholder="GRN Number"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div> */}

                    <div className="col-lg-3 mb-1">
                      <label>GRN Number</label>
                      <SearchAsyncSelect
                        selectedValue={values?.grnCode || ""}
                        handleChange={(valueOption) => {
                          setFieldValue("grnCode", valueOption || "");
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 2) return [];
                          return Axios.get(
                            `/vat/TaxPurchase/GetGrnNumberDDL?businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
                          ).then((res) => {
                            return res?.data || "";
                          });
                        }}
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="grnCode"
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col d-flex justify-content-end align-items-center">
                      {!isEdit && (
                        <button
                          className="btn btn-primary mr-2 mt-5"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          Attachment
                        </button>
                      )}

                      {values?.fileName && (
                        <button
                          className="btn btn-primary mt-5"
                          type="button"
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.fileName)
                            );
                          }}
                        >
                          Attachment View
                        </button>
                      )}
                    </div> */}
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
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.tradeType}
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <label>Quantity</label>
                      <InputField
                        value={values?.quantity}
                        name="quantity"
                        placeholder="Quantity"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "quantity"
                          );
                        }}
                        type="number"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <label>Amount</label>
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

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <button
                        type="button"
                        disabled={
                          !values.selectedItem ||
                          !values.quantity ||
                          !values.amount
                        }
                        style={{
                          marginTop: "16px",
                        }}
                        onClick={(e) => {
                          // setter(values, () => {
                          //   setValues({
                          //     ...values,
                          //     selectedItem: "",
                          //     quantity: "",
                          //     amount: "",
                          //   });
                          // });

                          // if (values?.supplyType) {
                          if (values?.tradeType?.label === "Import") {
                            if (
                              +values?.numberOfItem > 0 &&
                              values?.numberOfItem > rowDto.length
                            ) {
                              setter(values, () => {
                                setValues({
                                  ...values,
                                  // selectedItem: "",
                                  quantity: "",
                                  amount: "",
                                  // tarrifSchedule: "",
                                  // supplyType: "",
                                });
                              });
                            } else {
                              toast.warning('Plz increase "Number Of Item"');
                            }
                          } else {
                            setter(values, () => {
                              setValues({
                                ...values,
                                // selectedItem: "",
                                quantity: "",
                                amount: "",
                                // tarrifSchedule: "",
                                // supplyType: "",
                              });
                            });
                          }
                          // } else {
                          //   toast.warning("Supply Type Not Found");
                          // }
                        }}
                        class="btn btn-primary ml-2"
                      >
                        Add
                      </button>
                    </div>
                    <div class="col-lg-4 d-flex flex-column justify-content-end align-items-end">
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
                        <strong>Amount (SD/VAT):</strong>
                        {rowDto
                          ?.reduce((acc, cur) => {
                            const amount = cur?.quantity * cur?.rate;
                            // const sdAmount = (amount * cur?.sd) / 100;
                            // const vatAmount = (amount * cur?.vat) / 100;
                            const sdAmount = +cur?.sd || 0;
                            const vatAmount = +cur?.vat || 0;
                            return acc + (amount + sdAmount + vatAmount);
                          }, 0)
                          ?.toFixed(2)}
                      </p>
                    </div>

                    <div className="col-12">
                      {/* {values?.selectedItem && ( */}
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
                      {/* )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 pr-0 table-responsive">
                  <table className={"table global-table"}>
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "100px" }}>Item Name</th>
                        <th style={{ width: "40px" }}>UOM</th>
                        <th style={{ width: "80px" }}>Amount</th>
                        <th style={{ width: "80px" }}>Quantity</th>
                        <th style={{ width: "80px" }}>Rate</th>
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
                          <td>
                            <div className="text-left pl-2">{item?.label}</div>
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.uom?.label}
                            </div>
                          </td>
                          <td>
                            <div className="text-left pl-2">{item?.amount}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              <input
                                onChange={(e) => {
                                  dataHandler(
                                    "quantity",
                                    e.target.value,
                                    index
                                  );
                                }}
                                className="form-control"
                                type="number"
                                min="0"
                                name="quantity"
                                value={item.quantity}
                                step="any"
                              />
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Number(item?.rate?.toFixed(2))}
                              {/* <input
                                onChange={(e) => {
                                  dataHandler("rate", e.target.value, index);
                                }}
                                className="form-control"
                                type="number"
                                min="0"
                                name="rate"
                                value={item.rate}
                                disabled={!item.isTariff}
                                step="any"
                              /> */}
                            </div>
                          </td>
                          {taxConfig?.isCd && (
                            <td>
                              <input
                                onChange={(e) => {
                                  if (e.target.value >= 0) {
                                    dataHandler("cd", e.target.value, index);
                                  }
                                }}
                                className="form-control"
                                type="number"
                                min="0"
                                name="cd"
                                value={item.cd}
                                step="any"
                              />
                            </td>
                          )}
                          {taxConfig?.isRd && (
                            <td>
                              <input
                                min="0"
                                onChange={(e) => {
                                  if (e.target.value >= 0) {
                                    dataHandler("rd", e.target.value, index);
                                  }
                                }}
                                className="form-control"
                                type="number"
                                name="rd"
                                value={item.rd}
                                step="any"
                              />
                            </td>
                          )}
                          {taxConfig?.isSd && (
                            <td>
                              <input
                                min="0"
                                onChange={(e) => {
                                  if (e.target.value >= 0) {
                                    dataHandler("sd", e.target.value, index);
                                  }
                                }}
                                className="form-control"
                                type="number"
                                name="sd"
                                value={item.sd}
                                step="any"
                              />
                            </td>
                          )}
                          {taxConfig?.isVat && (
                            <td>
                              <input
                                onChange={(e) => {
                                  dataHandler("vat", e.target.value, index);
                                  dataHandler(
                                    "rebateAmount",
                                    e.target.value,
                                    index
                                  );
                                }}
                                className="form-control"
                                type="number"
                                name="vat"
                                value={item.vat}
                                min={0}
                                step="any"
                              />
                            </td>
                          )}
                          {taxConfig?.isAt && (
                            <td>
                              <input
                                onChange={(e) => {
                                  dataHandler("at", e.target.value, index);
                                }}
                                className="form-control"
                                type="number"
                                name="at"
                                value={item.at}
                                min={0}
                                step="any"
                              />
                            </td>
                          )}

                          <td>
                            <input
                              onChange={(e) =>
                                dataHandler(
                                  "rebateAmount",
                                  e.target.value,
                                  index
                                )
                              }
                              min="0"
                              className="form-control"
                              type="number"
                              name="rebateAmount"
                              value={item.rebateAmount}
                              // disabled={true}
                              step="any"
                            />
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.totalAmount}
                            </div>
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
                  purchaseAttachment_action(
                    fileObjects,
                    setUploadImage,
                    setDisabled
                  );
                  setOpen(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
