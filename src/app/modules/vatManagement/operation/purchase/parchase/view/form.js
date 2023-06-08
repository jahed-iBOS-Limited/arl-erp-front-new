/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Loading from "./../../../../../_helper/_loading";
import NewSelect from "./../../../../../_helper/_select";
import { useDispatch } from "react-redux";
import {
  getSupplierDDL,
  getTradeTypeDDL,
  getPaymentTermDDL,
  getTaxConfig,
  getTaxPortDDL,
} from "../helper";
import InputField from "../../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
import IViewModal from "./../../../../../_helper/_viewModal";
import HSCodeInfoModel from "./../Form/HSCodeInfoModel";
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  isDisabled,
}) {
  const [setTaxBranchName] = useState([]);
  const [rowClickData, setRowClickData] = useState("");
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [taxConfig, setTaxConfig] = useState("");
  const [HSCodeViewModel, setHSCodeViewModel] = useState(false);
  const [taxPortDDL, setTaxPortDDL] = useState([]);

  // const [check, setCheck] = useState(false);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSupplierDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSupplierDDL
      );
      getTaxPortDDL(setTaxPortDDL);
      getTradeTypeDDL(setTradeTypeDDL);
      getPaymentTermDDL(setPaymentTermDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      initData?.tradeType?.value
    ) {
      getTaxConfig(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData?.tradeType?.value,
        setTaxConfig
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, initData]);

  const dispatch = useDispatch();

  const totalVDSAmountFunc = () => {
    if (rowDto?.length > 0) {
      const totalVDSAmount = rowDto
        .filter((itm) => itm.vat < 15)
        .reduce((acc, cur) => (acc += cur?.rebateAmount), 0);
      return totalVDSAmount;
    } else {
      return 0;
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            {isDisabled && <Loading />}
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="tradeType"
                    options={tradeTypeDDL}
                    value={values?.tradeType}
                    label="Trade Type"
                    onChange={(valueOption) => {}}
                    placeholder="Trade type"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    {values?.tradeType?.label === "Local Purchase"
                      ? "Supplier Name/Bin No"
                      : "Supplier Name"}
                  </label>
                  <SearchAsyncSelect
                    selectedValue={values?.supplier}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                      setFieldValue("address", valueOption?.address);
                    }}
                    loadOptions={(v) => {}}
                    isDisabled={isEdit || !values?.tradeType}
                  />
                  <FormikError
                    errors={errors}
                    name="supplier"
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Address</label>
                  <InputField
                    value={values?.address}
                    name="address"
                    placeholder=""
                    type="text"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Transaction Date</label>
                  <InputField
                    value={values?.transactionDate}
                    type="date"
                    name="transactionDate"
                    placeholder=""
                    disabled
                  />
                </div>
                {values?.tradeType?.label === "Local Purchase" && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="vehicalInfo"
                      options={[]}
                      value={values?.vehicalInfo}
                      label="Vehical Info"
                      onChange={(valueOption) => {
                        setFieldValue("vehicalInfo", valueOption);
                      }}
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                )}

                {values?.tradeType?.label === "Import" && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="customsHouse"
                        options={[]}
                        value={values?.customsHouse}
                        label="Customs House"
                        onChange={(valueOption) => {
                          setFieldValue("customsHouse", valueOption);
                          setFieldValue(
                            "CustomsHouseCode",
                            valueOption?.code || ""
                          );
                        }}
                        placeholder=""
                        errors={errors}
                        touched={touched}
                        isDisabled
                      />
                    </div>

                    {values?.customsHouse?.code && (
                      <div className="col-lg-3">
                        <label>Customs House Code</label>
                        <InputField
                          value={values?.CustomsHouseCode}
                          name="CustomsHouseCode"
                          placeholder=""
                          type="text"
                          disabled
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="col-lg-3">
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

                <div className="col-lg-3">
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
                    disabled
                  />
                </div>
                {values?.tradeType?.label === "Import" && (
                  <>
                    <div className="col-lg-3">
                      <label>LC No.</label>
                      <InputField
                        value={values?.lcNumber}
                        name="lcNumber"
                        placeholder=""
                        type="text"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>LC Date</label>
                      <InputField
                        value={values?.lcDate}
                        name="lcDate"
                        placeholder=""
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="country"
                        options={[]}
                        value={values?.country}
                        label="Country Of Origin"
                        onChange={(valueOption) => {
                          setFieldValue("country", valueOption);
                        }}
                        placeholder=""
                        errors={errors}
                        touched={touched}
                        isDisabled
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="port"
                        options={taxPortDDL}
                        value={values?.port}
                        label="Port"
                        onChange={(valueOption) => {
                          setFieldValue("port", valueOption);
                        }}
                        placeholder=""
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Number Of Item</label>
                      <InputField
                        value={values?.numberOfItem || 0}
                        name="numberOfItem"
                        placeholder=""
                        type="number"
                        min="0"
                        onChange={(e) => {}}
                        disabled={true}
                      />
                    </div>
                  </>
                )}

                {values?.tradeType?.label === "Local Purchase" && (
                  <>
                    {/* <div className="col-lg-3">
                      <label>Total TDS Amount(%)</label>
                      <InputField
                        value={values?.totalTdsAmount}
                        name="totalTdsAmount"
                        s
                        placeholder=""
                        type="number"
                        disabled={isEdit}
                        min={0}
                        step="any"
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <label>Total VDS Amount</label>
                      <InputField
                        value={totalVDSAmountFunc()}
                        name="totalVdsAmount"
                        placeholder=""
                        type="number"
                        disabled={isEdit}
                        min={0}
                        step="any"
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <label>Total AIT Amount</label>
                      <InputField
                        value={values?.totalAit}
                        name="totalAit"
                        placeholder=""
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
                      value={values?.CPCCode?.label}
                      name="CPCCode"
                      placeholder=""
                      type="text"
                      disabled
                    />
                  </div>
                )}

                {/* {values?.CPCCode?.label && (
                  <div className="col-lg-3 d-flex align-items-center">
                    <b>Description: </b> {values?.CPCCode?.details}
                  </div>
                )} */}
                <div className="col-lg-3">
                  {values?.fileNo && (
                    <button
                      className="btn btn-primary mt-7"
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
              {values?.tradeType?.label === "Import" ? null : (
                <div className="d-flex justify-content-end align-items-center">
                  <p className="mr-3">
                    <strong>Amount (Without SD/VAT):</strong>{" "}
                    {rowDto
                      ?.reduce((acc, cur) => acc + cur?.quantity * cur?.rate, 0)
                      ?.toFixed(2)}
                  </p>
                  <p className="mr-3">
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
                  <p className="mr-3">
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
              {taxConfig && (
                <div className="row">
                  <div className="col-lg-12 pr-0 pr-3">
                    <table className="table table-striped table-bordered mt-3 global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "45px" }}>HS Code</th>
                          <th style={{ width: "120px" }}>Item Name</th>
                          <th style={{ width: "120px" }}>Supply Type</th>
                          <th style={{ width: "60px" }}>Unit</th>
                          <th style={{ width: "50px" }}>Quantity</th>
                          <th style={{ width: "50px" }}>
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
                          {/* Last Change Assign By HM Ikbal */}
                          {/* <th style={{ width: "50px" }}>Rebate/Refund %</th>
                        <th style={{ width: "50px" }}>Rebate Amount</th> */}
                          <th style={{ width: "50px" }}>Rebate Amount</th>
                          <th style={{ width: "50px" }}>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 && (
                          <>
                            {" "}
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
                                  <div className="text-left pl-2">
                                    {item?.label}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {item?.supplyTypeName}
                                  </div>
                                </td>
                                <td>{item?.uom?.label}</td>
                                <td>
                                  <div className="text-right">
                                    {_fixedPoint(item.quantity)}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pl-2">
                                    {_fixedPoint(item?.amount, true, 0)}
                                  </div>
                                </td>

                                {values?.tradeType?.label ===
                                "Import" ? null : (
                                  <td className="text-right">
                                    {_fixedPoint(item.rate)}
                                  </td>
                                )}

                                {taxConfig?.isCd && (
                                  <td>
                                    <div className="text-center">
                                      {_fixedPoint(item.cd)}
                                    </div>
                                  </td>
                                )}
                                {taxConfig?.isRd && (
                                  <td>
                                    <div className="text-center">
                                      {_fixedPoint(item.rd)}
                                    </div>
                                  </td>
                                )}
                                {taxConfig?.isSd && (
                                  <td>
                                    <div className="text-right">
                                      {_fixedPoint(item.sd)}
                                    </div>
                                  </td>
                                )}
                                {taxConfig?.isVat && (
                                  <td>
                                    <div className="text-right">
                                      {_fixedPoint(item.vat)}
                                    </div>
                                  </td>
                                )}
                                {taxConfig?.isAit && (
                                  <td>
                                    <div className="text-center">
                                      {_fixedPoint(item.ait)}
                                    </div>
                                  </td>
                                )}
                                {taxConfig?.isAt && (
                                  <td>
                                    <div className="text-center">
                                      {_fixedPoint(item.at)}
                                    </div>
                                  </td>
                                )}
                                <td>
                                  <div className="text-right">
                                    {_fixedPoint(item.rebateAmount, true, 0)}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right">
                                    {_fixedPoint(item.totalAmount, true, 0)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}

                        <tr>
                          <td
                            colspan={
                              values?.tradeType?.label === "Local Purchase"
                                ? 10
                                : 13
                            }
                            className="text-right"
                          >
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_fixedPoint(
                                rowDto?.reduce(
                                  (acc, cur) => (acc += cur.rebateAmount),
                                  0
                                ),
                                true,
                                0
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {" "}
                              {_fixedPoint(
                                rowDto?.reduce(
                                  (acc, cur) => (acc += cur.totalAmount),
                                  0
                                ),
                                true,
                                0
                              )}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
          </>
        )}
      </Formik>
    </>
  );
}
