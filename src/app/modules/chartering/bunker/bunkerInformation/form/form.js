import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import {
  getPreBORInformationByVoyageId,
  validationSchema,
  getItemRateByVoyageId,
  GetItemInfoFromPurchase,
} from "../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { getVoyageDDLNew } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import ICustomTable from "../../../_chartinghelper/_customTable";

export default function Form({
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  setLoading,
  profileData,
  selectedBusinessUnit,
  bunkerPurchase,
  purchaseList,
  setPurchaseList,
  getConsumption,
  returnID,
  isCalculated,
  setItemRates,
  hireType,
}) {
  const history = useHistory();
  const [voyageNoDDL, setVoyageNoDDL] = React.useState([]);

  const headers = [
    { name: "SL" },
    { name: "Item Name" },
    { name: "Item Quantity" },
  ];

  const setData = (
    values,
    targetValue,
    value,
    setFieldValue,
    qtyFieldOne,
    qtyFieldTwo,
    valueFieldOne,
    valueFieldTwo,
    rateFieldOne,
    rateFieldTwo
  ) => {
    if ((values?.voyageNo?.hireTypeName || hireType) === "Own Ship") {
      if (targetValue > value) {
        setFieldValue(qtyFieldOne, targetValue - value);
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(
          valueFieldTwo,
          (targetValue - value) * values[rateFieldTwo]
        );
        setFieldValue(valueFieldOne, "");
      } else if (targetValue < value) {
        setFieldValue(qtyFieldTwo, value - targetValue);
        setFieldValue(qtyFieldOne, "");
        setFieldValue(
          valueFieldOne,
          (value - targetValue) * values[rateFieldOne]
        );
        setFieldValue(valueFieldTwo, "");
      } else {
        setFieldValue(qtyFieldOne, "");
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(valueFieldOne, "");
        setFieldValue(valueFieldTwo, "");
      }
    } else if (
      (values?.voyageNo?.hireTypeName || hireType) === "Charterer Ship"
    ) {
      if (targetValue > value) {
        setFieldValue(qtyFieldTwo, targetValue - value); // targetValue = bor value = bod
        setFieldValue(qtyFieldOne, "");
        setFieldValue(
          valueFieldOne,
          (targetValue - value) * values[rateFieldTwo]
        );
        setFieldValue(valueFieldTwo, "");
      } else if (targetValue < value) {
        setFieldValue(qtyFieldOne, value - targetValue);
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(
          valueFieldTwo,
          (value - targetValue) * values[rateFieldOne]
        );
        setFieldValue(valueFieldOne, "");
      } else {
        setFieldValue(qtyFieldOne, "");
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(valueFieldOne, "");
        setFieldValue(valueFieldTwo, "");
      }
    }
  };

  const BODDisableHandler = (values) => {
    const result =
      (values?.hireTypeId === 1 && values?.voyageNo?.label !== "1") ||
      viewType ||
      !values?.voyageNo;

    return result;
  };

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
          // values?.isComplete
          //   ? bunkerPurchase(values, (show) => {
          //       saveHandler(values, (message) => {
          //         show === "showMessage" && toast.success(message);
          //         resetForm(initData);
          //       });
          //     })
          //   : saveHandler(values, () => {
          //       resetForm(initData);
          //     });
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
          setValues,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{`Bunker Information`}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-4">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setFieldValue("voyageNo", "");
                        setVoyageNoDDL([]);
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 2,
                            voyageTypeId: 0,
                          });
                        } else {
                          resetForm(initData);
                        }
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);
                        setFieldValue(
                          "voyageType",
                          valueOption?.voyageTypeName
                        );
                        // setFieldValue("hireType", valueOption?.hireTypeName);

                        if (valueOption && valueOption?.label !== "1") {
                          getPreBORInformationByVoyageId(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.vesselName?.value,
                            valueOption?.value,
                            setFieldValue,
                            setLoading
                          );
                          if (
                            valueOption?.voyageTypeName === "Voyage Charter"
                          ) {
                            GetItemInfoFromPurchase(
                              selectedBusinessUnit?.value,
                              values?.vesselName?.value,
                              valueOption?.value,
                              setPurchaseList,
                              setLoading
                            );
                          } else {
                            getItemRateByVoyageId(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.vesselName?.value,
                              valueOption?.value,
                              setLoading,
                              setItemRates,
                              setFieldValue
                            );
                          }
                        }
                        setValues({
                          ...initData,
                          vesselName: values?.vesselName,
                          voyageType: valueOption?.voyageTypeName,
                          voyageNo: valueOption,
                          hireType: valueOption?.hireTypeName,
                          hireTypeId: valueOption?.hireTypeId,
                        });
                      }}
                      isDisabled={viewType || !values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>Voyage Type</label>
                    <FormikInput
                      value={values?.voyageType || ""}
                      name="voyageType"
                      placeholder="Voyage Type"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Ship Type</label>
                    <FormikInput
                      value={values?.hireType || ""}
                      name="hireType"
                      placeholder="Ship Type"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-2 mt-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="isComplete"
                      name="isComplete"
                      value={values?.isComplete}
                      checked={values?.isComplete}
                      onChange={(e) => {
                        setFieldValue("isComplete", e.target.checked);
                      }}
                      disabled={viewType === "view"}
                    />
                    <label htmlFor="isComplete" className="pl-1">
                      Is Complete
                    </label>
                  </div>
                  {/*  
                  
                  _____ BOD ___________ 
                  
                  
                  */}
                  <div className="col-lg-12 mt-3">
                    <h6>BOD</h6>
                  </div>
                  <div className="col-lg-2">
                    <label>LSMGO QTY</label>
                    <FormikInput
                      value={values?.bodLsmgoQty}
                      name="bodLsmgoQty"
                      placeholder="LSMGO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={BODDisableHandler(values)}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-1 QTY</label>
                    <FormikInput
                      value={values?.bodLsfo1Qty}
                      name="bodLsfo1Qty"
                      placeholder="LSFO-1 QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      // disabled={values?.voyageNo?.label !== "1" || viewType}
                      disabled={BODDisableHandler(values)}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-2 QTY</label>
                    <FormikInput
                      value={values?.bodLsfo2Qty}
                      name="bodLsfo2Qty"
                      placeholder="LSFO-2 QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      // disabled={values?.voyageNo?.label !== "1" || viewType}
                      disabled={BODDisableHandler(values)}
                    />
                  </div>
                  {/* 
                  
                  
                  
                  
                  
                  
                  
                  */}
                  <div className="col-lg-12 mt-3">
                    <h6>BOR</h6>
                  </div>
                  <div className="col-lg-2">
                    <label>LSMGO QTY</label>
                    <FormikInput
                      value={values?.borLsmgoQty}
                      name="borLsmgoQty"
                      placeholder="LSMGO QTY"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("borLsmgoQty", e?.target?.value);
                        setData(
                          values,
                          e?.target?.value,
                          values?.bodLsmgoQty,
                          setFieldValue,
                          "bunkerPurchaseLsmgoQty",
                          "bunkerSaleLsmgoQty",
                          "bunkerSaleLsmgoValue",
                          "bunkerPurchaseLsmgoValue",
                          "bunkerSaleLsmgoRate",
                          "bunkerPurchaseLsmgoRate"
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-1 QTY</label>
                    <FormikInput
                      value={values?.borLsfo1Qty}
                      name="borLsfo1Qty"
                      placeholder="LSFO-1 QTY"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("borLsfo1Qty", e?.target?.value);
                        setData(
                          values,
                          e?.target?.value,
                          values?.bodLsfo1Qty,
                          setFieldValue,
                          "bunkerPurchaseLsfo1Qty",
                          "bunkerSaleLsfo1Qty",
                          "bunkerSaleLsfo1Value",
                          "bunkerPurchaseLsfo1Value",
                          "bunkerSaleLsfo1Rate",
                          "bunkerPurchaseLsfo1Rate"
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-2 QTY</label>
                    <FormikInput
                      value={values?.borLsfo2Qty}
                      name="borLsfo2Qty"
                      placeholder="LSFO-2 QTY"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("borLsfo2Qty", e.target.value);

                        setData(
                          values,
                          e?.target?.value,
                          values?.bodLsfo2Qty,
                          setFieldValue,
                          "bunkerPurchaseLsfo2Qty",
                          "bunkerSaleLsfo2Qty",
                          "bunkerSaleLsfo2Value",
                          "bunkerPurchaseLsfo2Value",
                          "bunkerSaleLsfo2Rate",
                          "bunkerPurchaseLsfo2Rate"
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-12 mt-3">
                    <h6>Adjustment</h6>
                  </div>
                  <div className="col-lg-2">
                    <label>LSMGO QTY</label>
                    <FormikInput
                      value={values?.adjustmentLsmgoQty}
                      name="adjustmentLsmgoQty"
                      placeholder="LSMGO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-1 QTY</label>
                    <FormikInput
                      value={values?.adjustmentLsfo1Qty}
                      name="adjustmentLsfo1Qty"
                      placeholder="LSFO-1 QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-2 QTY</label>
                    <FormikInput
                      value={values?.adjustmentLsfo2Qty}
                      name="adjustmentLsfo2Qty"
                      placeholder="LSFO-2 QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  {((values?.voyageNo?.voyageTypeName || values?.voyageType) ===
                    "Voyage Charter" ||
                    viewType === "view") && (
                    <>
                      <div className="col-lg-6"> </div>
                      <div className="col-lg-6">
                        <ICustomTable ths={headers}>
                          {purchaseList?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.itemQty}</td>
                            </tr>
                          ))}
                        </ICustomTable>{" "}
                      </div>
                    </>
                  )}

                  {/*
                  
                  
                  
                  
                  
                  */}

                  {(values?.voyageNo?.voyageTypeName === "Time Charter" ||
                    values?.voyageType === "Time Charter") && (
                    <>
                      <div className="col-lg-12 mt-3">
                        <h6>Bunker Sale</h6>
                      </div>
                      <div className="col-lg-2">
                        <label>LSMGO QTY</label>
                        <FormikInput
                          value={values?.bunkerSaleLsmgoQty}
                          name="bunkerSaleLsmgoQty"
                          placeholder="LSMGO QTY"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("bunkerSaleLsmgoQty", e.target.value);
                            setFieldValue(
                              "bunkerSaleLsmgoValue",
                              Number(e.target.value) *
                                (Number(values?.bunkerSaleLsmgoRate) || 1)
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSMGO Rate</label>
                        <FormikInput
                          value={values?.bunkerSaleLsmgoRate}
                          name="bunkerSaleLsmgoRate"
                          placeholder="LSMGO Rate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "bunkerSaleLsmgoRate",
                              e.target.value
                            );
                            setFieldValue(
                              "bunkerSaleLsmgoValue",
                              Number(e.target.value) *
                                (Number(values?.bunkerSaleLsmgoQty) || 1)
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSMGO Value</label>
                        <FormikInput
                          value={values?.bunkerSaleLsmgoValue}
                          name="bunkerSaleLsmgoValue"
                          placeholder="LSMGO Value"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-1 QTY</label>
                        <FormikInput
                          value={values?.bunkerSaleLsfo1Qty}
                          name="bunkerSaleLsfo1Qty"
                          placeholder="LSFO-1 QTY"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("bunkerSaleLsfo1Qty", e.target.value);
                            setFieldValue(
                              "bunkerSaleLsfoValue",
                              Number(e.target.value) *
                                (Number(values?.bunkerSaleLsfoRate) || 1)
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-1 Rate</label>
                        <FormikInput
                          value={values?.bunkerSaleLsfo1Rate}
                          name="bunkerSaleLsfo1Rate"
                          placeholder="LSFO-1 Rate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "bunkerSaleLsfo1Rate",
                              e.target.value
                            );
                            setFieldValue(
                              "bunkerSaleLsfoValue",
                              Number(e.target.value) *
                                (Number(values?.bunkerSaleLsfoQty) || 1)
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-1 Value</label>
                        <FormikInput
                          value={values?.bunkerSaleLsfo1Value}
                          name="bunkerSaleLsfo1Value"
                          placeholder="LSFO-1 Value"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-2 QTY</label>
                        <FormikInput
                          value={values?.bunkerSaleLsfo2Qty}
                          name="bunkerSaleLsfo2Qty"
                          placeholder="LSFO-2 QTY"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("bunkerSaleLsfo2Qty", e.target.value);
                            setFieldValue(
                              "bunkerSaleLsfoValue",
                              Number(e.target.value) *
                                (Number(values?.bunkerSaleLsfoRate) || 1)
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-2 Rate</label>
                        <FormikInput
                          value={values?.bunkerSaleLsfo2Rate}
                          name="bunkerSaleLsfo2Rate"
                          placeholder="LSFO-2 Rate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "bunkerSaleLsfo2Rate",
                              e.target.value
                            );
                            setFieldValue(
                              "bunkerSaleLsfoValue",
                              Number(e.target.value) *
                                (Number(values?.bunkerSaleLsfoQty) || 1)
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-2 Value</label>
                        <FormikInput
                          value={values?.bunkerSaleLsfo2Value}
                          name="bunkerSaleLsfo2Value"
                          placeholder="LSFO-2 Value"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>{" "}
                      {viewType !== "view" && (
                        <>
                          <div className="col-lg-12 d-flex mt-3">
                            <h6>Bunker Purchase</h6>
                          </div>
                          <div className="col-lg-2">
                            <label>LSMGO QTY</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsmgoQty}
                              name="bunkerPurchaseLsmgoQty"
                              placeholder="LSMGO QTY"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bunkerPurchaseLsmgoQty",
                                  e.target.value
                                );
                                setFieldValue(
                                  "bunkerPurchaseLsmgoValue",
                                  Number(e.target.value) *
                                    (Number(values?.bunkerPurchaseLsmgoRate) ||
                                      1)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSMGO Rate</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsmgoRate}
                              name="bunkerPurchaseLsmgoRate"
                              placeholder="LSMGO Rate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bunkerPurchaseLsmgoRate",
                                  e.target.value
                                );
                                setFieldValue(
                                  "bunkerPurchaseLsmgoValue",
                                  Number(e.target.value) *
                                    (Number(values?.bunkerPurchaseLsmgoQty) ||
                                      1)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSMGO Value</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsmgoValue}
                              name="bunkerPurchaseLsmgoValue"
                              placeholder="LSMGO Value"
                              type="number"
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSFO-1 QTY</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsfo1Qty}
                              name="bunkerPurchaseLsfo1Qty"
                              placeholder="LSFO-1 QTY"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bunkerPurchaseLsfo1Qty",
                                  e.target.value
                                );
                                setFieldValue(
                                  "bunkerPurchaseLsfo1Value",
                                  Number(e.target.value) *
                                    (Number(values?.bunkerPurchaseLsfo1Rate) ||
                                      1)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSFO-1 Rate</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsfo1Rate}
                              name="bunkerPurchaseLsfo1Rate"
                              placeholder="LSFO-1 Rate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bunkerPurchaseLsfo1Rate",
                                  e.target.value
                                );
                                setFieldValue(
                                  "bunkerPurchaseLsfoValue",
                                  Number(e.target.value) *
                                    (Number(values?.bunkerPurchaseLsfoQty) || 1)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSFO-1 Value</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsfo1Value}
                              name="bunkerPurchaseLsfo1Value"
                              placeholder="LSFO-1 Value"
                              type="number"
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSFO-2 QTY</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsfo2Qty}
                              name="bunkerPurchaseLsfo2Qty"
                              placeholder="LSFO-2 QTY"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bunkerPurchaseLsfo2Qty",
                                  e.target.value
                                );
                                setFieldValue(
                                  "bunkerPurchaseLsfo2Value",
                                  Number(e.target.value) *
                                    (Number(values?.bunkerPurchaseLsfo2Rate) ||
                                      1)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSFO-2 Rate</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsfo2Rate}
                              name="bunkerPurchaseLsfo2Rate"
                              placeholder="LSFO-2 Rate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bunkerPurchaseLsfo2Rate",
                                  e.target.value
                                );
                                setFieldValue(
                                  "bunkerPurchaseLsfo2Value",
                                  Number(e.target.value) *
                                    (Number(values?.bunkerPurchaseLsfo2Qty) ||
                                      1)
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-2">
                            <label>LSFO-2 Value</label>
                            <FormikInput
                              value={values?.bunkerPurchaseLsfo2Value}
                              name="bunkerPurchaseLsfo2Value"
                              placeholder="LSFO-2 Value"
                              type="number"
                              errors={errors}
                              touched={touched}
                              disabled={true}
                            />
                          </div>
                          {values?.isComplete && (
                            <div className="col-lg-2">
                              <button
                                className="btn btn-primary mt-5 px-3 py-2"
                                type="button"
                                onClick={() => {
                                  bunkerPurchase(values);
                                }}
                                disabled={
                                  viewType === "view" ||
                                  returnID ||
                                  (values?.bunkerPurchaseLsfo2Qty < 1 &&
                                    values?.bunkerPurchaseLsfo1Qty < 1 &&
                                    values?.bunkerPurchaseLsmgoQty < 1)
                                }
                              >
                                Purchase
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {/* 
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  */}
                  <div className="col-lg-12 mt-3">
                    <div className="d-flex">
                      <h6>Consumption</h6>
                      {(values?.voyageNo?.voyageTypeName ||
                        values?.voyageType) === "Voyage Charter" &&
                        viewType !== "view" && (
                          <button
                            className="btn btn-primary ml-2 px-3 py-2"
                            type="button"
                            onClick={() => {
                              getConsumption(values, setFieldValue);
                            }}
                            disabled={
                              viewType === "view" ||
                              (values?.borLsmgoQty < 1 &&
                                values?.borLsfo1Qty < 1 &&
                                values?.borLsfo2Qty < 1)
                              // ||
                              // isCalculated
                            }
                          >
                            Calculate
                          </button>
                        )}
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>LSMGO QTY</label>
                    <FormikInput
                      value={
                        values?.consumptionLsmgoQty ||
                        values?.consumptionLsmgoqty
                      }
                      name="consumptionLsmgoQty"
                      placeholder="LSMGO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-1 QTY</label>
                    <FormikInput
                      value={
                        values?.consumptionLsfo1Qty ||
                        values?.consumptionLsfo1qty
                      }
                      name="consumptionLsfo1Qty"
                      placeholder="LSFO-1 QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LSFO-2 QTY</label>
                    <FormikInput
                      value={
                        values?.consumptionLsfo2Qty ||
                        values?.consumptionLsfo2qty
                      }
                      name="consumptionLsfo2Qty"
                      placeholder="LSFO-2 QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
