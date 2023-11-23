/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  validationSchema,
  getPlantDDL,
  getLCTypeDDL,
  getIncoTermsDDL,
  getMaterialTypeDDL,
  getBankNameDDL,
  getCountryNameDDL,
  getFinalDestinationDDL,
  getCurrencyDDL,
  getBeneficaryDDL,
  // getUoMDDL,
  getSBUDDL,
  checkPurchaseRequestNo,
  // checkItemFromPurchaseRequest,
  getItemDDL,
} from "../helper";
import ICustomTable from "../../../../_helper/_customTable";
// import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
// import Axios from "axios";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { setRowAmount } from "../utils";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
const header = ["SL", "Item", "HS Code", "UoM", "Quantity", "Rate", "Amount"];
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  viewType,
  setRowDto,
  rowDto,
  profileData,
  selectedBusinessUnit,
  remover,
  purchaseRequestValidity,
  setPurchaseRequestValidity,
  // setter,
  setDataToGrid,
}) {
  // all ddl
  const [plantDDL, setPlantDDL] = useState([]);
  // const [purchaseOrganizationDDL, setPurchaseOrganizationDDL] = useState([]);
  const [lcTypeDDL, setLCTypeDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [bankNameDDL, setBankNameDDL] = useState([]);
  const [incoTermsDDL, setIncoTermsDDL] = useState([]);
  const [countryOriginDDL, setCountryOriginDDL] = useState([]);
  const [finalDestinationDDL, setFinalDestinationDDL] = useState([]);
  const [materialTypeDDL, setMaterialTypeDDL] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [beneficiaryNameDDL, setBeneficiaryNameDDL] = useState([]);
  // const [uomDDL, setUomDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  // const [materialTypeId, setMaterialTypeId] = useState("");
  const [itemDDL, setItemDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        7,
        setPlantDDL
      );
      getLCTypeDDL(setLCTypeDDL);
      getIncoTermsDDL(setIncoTermsDDL);
      getMaterialTypeDDL(setMaterialTypeDDL);
      getBankNameDDL(
        setBankNameDDL,
        profileData?.accountId,
        selectedBusinessUnit?.value
      );
      getCountryNameDDL(setCountryOriginDDL);
      getFinalDestinationDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setFinalDestinationDDL
      );
      getCurrencyDDL(setCurrencyDDL);
      getSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
      getBeneficaryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBeneficiaryNameDDL
      );
      // getUoMDDL(profileData?.accountId, selectedBusinessUnit?.value, setUomDDL);
      // setItemDDL(profileData?.accountId, selectedBusinessUnit, setItemDDL)
    }
  }, [profileData, selectedBusinessUnit]);

  //searchable drop down in po list;
  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPRNoList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values }, () => {
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
          setFieldValue,
          setValues,
        }) => (
          <>
            {/* {console.log(errors, "errors")} */}
            {console.log(values, "values")}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 col-md-3">
                    <label>
                      Purchase Request No
                      {viewType !== "view" && values?.purchaseRequestNo && (
                        <span>
                          <small
                            style={{
                              color: `${purchaseRequestValidity?.status === true
                                ? "green"
                                : "red"
                                }`,
                            }}
                          >
                            {purchaseRequestValidity?.status === true
                              ? "Purchase Request No Valid"
                              : purchaseRequestValidity?.status === false
                                ? "Purchase Request No Invalid"
                                : ""}
                          </small>
                        </span>
                      )}{" "}
                    </label>
                    <SearchAsyncSelect
                      isDisabled={viewType === "view" || viewType === "edit"}
                      paddingRight="10px"
                      name="purchaseRequestNo"
                      placeholder="Purchase Request No"
                      type="text"
                      disabled={viewType === "view"}
                      selectedValue={values?.purchaseRequestNo}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("purchaseRequestNo", valueOption);
                        checkPurchaseRequestNo(
                          valueOption?.label,
                          setPurchaseRequestValidity,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setFieldValue
                        );
                        getItemDDL(valueOption?.label, setItemDDL);
                        setFieldValue("sbuDDL", "");
                        setFieldValue("plantDDL", "");
                        setRowDto([]);
                        setFieldValue("isAllItem", false);
                        setFieldValue("itemDDL", "");
                      }}
                      loadOptions={loadPartsList}
                    />
                  </div>

                  {/* <div className='col-lg-3'>
                    <label>
                      Purchase Request No{" "}
                      {viewType !== "view" && (
                        <span>
                          <small
                            style={{
                              color: `${
                                purchaseRequestValidity?.status === true
                                  ? "green"
                                  : "red"
                              }`,
                            }}
                          >
                            {purchaseRequestValidity?.status === true
                              ? "Purchase Request No Valid"
                              : purchaseRequestValidity?.status === false
                              ? "Purchase Request No Invalid"
                              : ""}
                          </small>
                        </span>
                      )}{" "}
                    </label>
                    <InputField
                      value={values?.purchaseRequestNo}
                      name='purchaseRequestNo'
                      placeholder='Purchase Request No'
                      type='text'
                      disabled={viewType === "view"}
                      onBlur={(e) => {
                        checkPurchaseRequestNo(
                          e?.target?.value,
                          setPurchaseRequestValidity,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setFieldValue
                        );
                        getItemDDL(e?.target?.value, setItemDDL);
                        setFieldValue("sbuDDL", "");
                        setFieldValue("plantDDL", "");
                      }}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.sbuDDL}
                      options={sbuDDL || []}
                      label="SBU"
                      placeholder="SBU"
                      name="sbuDDL"
                      type="text"
                      onChange={(valueOption) => {
                        setFieldValue("sbuDDL", valueOption);
                      }}
                      // isDisabled={viewType === "view" || viewType === "edit"}
                      isDisabled
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.plantDDL}
                      options={plantDDL || []}
                      label="Plant"
                      placeholder="Plant"
                      name="plantDDL"
                      type="text"
                      onChange={(valueOption) => {
                        setFieldValue("plantDDL", valueOption);
                      }}
                      // isDisabled={viewType === "view" || viewType === "edit"}
                      isDisabled
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>PI No</label>
                    <InputField
                      value={values?.pinumber}
                      name="pinumber"
                      placeholder="PI No"
                      type="text"
                      disabled={viewType === "view" || viewType === "edit"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="beneficiaryNameDDL"
                      options={beneficiaryNameDDL}
                      value={values?.beneficiaryNameDDL}
                      label="Beneficiary Name"
                      onChange={(valueOption) => {
                        setFieldValue("beneficiaryNameDDL", valueOption);
                      }}
                      placeholder="Beneficiary Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Expire Date</label>
                    <InputField
                      value={values?.expireDate}
                      name="expireDate"
                      placeholder="Expire Date"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <NewSelect
                      name="lcTypeDDL"
                      options={lcTypeDDL}
                      value={values?.lcTypeDDL}
                      label="LC Type"
                      onChange={(valueOption) => {
                        setFieldValue("lcTypeDDL", valueOption);
                      }}
                      placeholder="LC Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3 ">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipDate}
                      name="lastShipDate"
                      placeholder="Last Shioment Date"
                      type="date"
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3 ">
                    <NewSelect
                      name="incoTermsDDL"
                      options={incoTermsDDL}
                      value={values?.incoTermsDDL}
                      label="Inco Terms"
                      onChange={(valueOption) => {
                        setFieldValue("incoTermsDDL", valueOption);
                      }}
                      placeholder="Inco Terms"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3 ">
                    <NewSelect
                      name="materialTypeDDL"
                      options={materialTypeDDL}
                      value={values?.materialTypeDDL}
                      label="Material Type"
                      onChange={(valueOption) => {
                        setFieldValue("materialTypeDDL", valueOption);
                        // setMaterialTypeId(valueOption);
                      }}
                      placeholder="Material Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>
                  {/* <div className="col-lg-3 ">
                    <NewSelect
                      name="bankNameDDL"
                      options={bankNameDDL}
                      value={values?.bankNameDDL}
                      label="Bank Name"
                      onChange={(valueOption) => {
                        setFieldValue("bankNameDDL", valueOption);
                      }}
                      placeholder="Bank Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div> */}
                  <div className="col-lg-3 ">
                    <NewSelect
                      name="countryOriginDDL"
                      options={countryOriginDDL}
                      value={values?.countryOriginDDL}
                      label="Country Origin"
                      onChange={(valueOption) => {
                        setFieldValue("countryOriginDDL", valueOption);
                      }}
                      placeholder="Country Origin"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Loading Port</label>
                    <InputField
                      value={values?.loadingPort}
                      name="loadingPort"
                      placeholder="Loading Port"
                      type="text"
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3 ">
                    <NewSelect
                      name="finalDestinationDDL"
                      options={finalDestinationDDL}
                      value={values?.finalDestinationDDL}
                      label="Final Destination"
                      onChange={(valueOption) => {
                        setFieldValue("finalDestinationDDL", valueOption);
                      }}
                      placeholder="Final Distination"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <NewSelect
                      name="currencyDDL"
                      options={currencyDDL}
                      value={values?.currencyDDL}
                      label="Currency"
                      onChange={(valueOption) => {
                        setFieldValue("currencyDDL", valueOption);
                      }}
                      placeholder="Currency"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Tolarance (%)</label>
                    <InputField
                      value={values?.tolerance}
                      name="tolerance"
                      placeholder="Tolerance"
                      type="number"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Usance (In Days)</label>
                    <InputField
                      value={values?.usance}
                      name="usance"
                      placeholder="Usance"
                      type="number"
                      min="0"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Presentation(Days)</label>
                    <InputField
                      value={values?.presentation}
                      name="presentation"
                      placeholder="Presentation(Days)"
                      type="number"
                      min="0"
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Other Terms</label>
                    <InputField
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      type="text"
                      disabled={viewType === "view"}
                    />
                  </div>
                </div>
              </div>

              {/* extra code */}

              <div className="global-form">
                {viewType !== "view" && (
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemDDL"
                        options={itemDDL}
                        value={values?.itemDDL}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("itemDDL", valueOption);
                        }}
                        placeholder="Select Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          values?.isAllItem === true ||
                          !values?.purchaseRequestNo
                        }
                      />
                    </div>
                    <div
                      className="col-lg-1 d-flex align-items-center"
                      style={{ marginTop: "11px", marginLeft: "17px" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isAllItem"
                        disabled={
                          values?.itemDDL ||
                          !values?.purchaseRequestNo ||
                          rowDto.length > 0
                        }
                        onChange={(e) => {
                          setFieldValue("isAllItem", e?.target?.checked);
                        }}
                      />
                      <label className="">All Item</label>
                    </div>
                    <div
                      className="col-lg-3"
                      style={{ marginTop: "17px", marginLeft: "17px" }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        disable={!values?.purchaseRequestNo}
                        onClick={() => {
                          if (values?.isAllItem) {
                            return getItemDDL(
                              values?.purchaseRequestNo?.label,
                              setRowDto
                            );
                          } else {
                            // return setter(values, rowDto, setRowDto);
                            if (values?.itemDDL) {
                              return setDataToGrid(values, rowDto, setRowDto);
                            }
                          }
                        }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                )}
                <ICustomTable
                  ths={
                    viewType === "view"
                      ? header
                      : [
                        "SL",
                        "Item",
                        "HS Code",
                        "UoM",
                        "Quantity",
                        "Rate",
                        "Amount",
                        "Action",
                      ]
                  }
                >
                  {rowDto?.length > 0 &&
                    rowDto?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td style={{ width: "250px" }}>{item?.label}</td>
                          <td style={{ width: "250px" }}>
                            <InputField
                              name={item?.hscode}
                              value={item?.hscode}
                              onChange={e => {
                                item.hscode = e.target.value
                                setRowDto([...rowDto])
                              }}
                              errors={errors}
                              touched={touched}
                            /></td>
                          <td style={{ width: "150px" }}>
                            <NewSelect
                              name="uom"
                              value={item?.uom}
                              onChange={(valueOption) => {
                                setFieldValue("uom", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled
                            />
                          </td>
                          <td
                            style={{ width: "100px" }}
                            className="text-center"
                          >
                            <InputField
                              value={item?.quantity}
                              name="quantity"
                              placeholder="Quantity"
                              type="number"
                              min="0"
                              step="any"
                              required
                              onChange={(e) => {
                                setRowAmount(
                                  "quantity",
                                  index,
                                  e?.target?.value,
                                  rowDto,
                                  setRowDto
                                );
                              }}
                              disabled={viewType === "view"}
                            />
                          </td>
                          <td
                            style={{ width: "100px" }}
                            className="text-center"
                          >
                            <InputField
                              value={item?.rate}
                              name="rate"
                              placeholder="Rate"
                              type="number"
                              required
                              min="0"
                              step="any"
                              onChange={(e) => {
                                setRowAmount(
                                  "rate",
                                  index,
                                  e?.target?.value,
                                  rowDto,
                                  setRowDto
                                );
                              }}
                              disabled={viewType === "view"}
                            />
                          </td>

                          <td
                            style={{ width: "100px" }}
                            className="text-center"
                          >
                            <InputField
                              value={item?.totalAmount}
                              name="totalAmount"
                              placeholder="Amount"
                              type="number"
                              min="0"
                              disabled
                            />
                          </td>
                          {viewType !== "view" && (
                            <td
                              style={{ width: "150px" }}
                              className="text-center"
                            >
                              <IDelete remover={remover} id={index} />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  <tr>
                    <td colspan="5"></td>
                    <td style={{ fontWeight: "700" }}>Total</td>
                    <td className="text-right" style={{ fontWeight: "700" }}>
                      {_formatMoney(
                        rowDto?.reduce(
                          (acc, item) => acc + item?.totalAmount,
                          0
                        )
                      )}
                    </td>
                    {viewType !== "view" && <td></td>}
                  </tr>
                </ICustomTable>
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
