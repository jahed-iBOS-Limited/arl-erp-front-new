/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema, initData, getRefNoDdlForServicePo } from "./helper";
import { useLocation } from "react-router-dom";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getPOItemForServiceItemDDLAction } from "../../_redux/Actions";

import {
  getCostCenterDDL,
  getControllingUnitDDL,
  getCostElementDDL,
} from "./helper";
import TotalNetAmount from "../../TotalNetAmount";
// import { purchaseOrderSlice } from "../../_redux/Slice";
// const { actions: slice } = purchaseOrderSlice;
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import axios from "axios";
import TextArea from "../../../../../_helper/TextArea";
import { lastPriceFunc } from "../../helper";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import useAxiosGet from "../../customHooks/useAxiosGet";
import { getProfitCenterList } from "../assetStandardPo/helper";
import Loading from "../../../../../_helper/_loading";
import { toast } from "react-toastify";

export default function CreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
}) {
  const location = useLocation();

  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [cuList, setCuList] = useState([]);
  const [costCenterList, setCostCenterList] = useState([]);
  const [costCenterListTwo, setCostCenterListTwo] = useState([]);
  const [costElementList, setCostElementList] = useState([]);
  const [costElementListTwo, setCostElementListTwo] = useState([]);
  const [refNoDDL, setRefNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profitCenterList, setProfitCenterList] = useState([]);
  const [profitCenterListTwo, setProfitCenterListTwo] = useState([]);

  // const location = useLocation();

  // redux store data
  const storeData = useSelector((state) => {
    return {
      supplierNameDDL: state.purchaseOrder.supplierNameDDL,
      currencyDDL: state.purchaseOrder.currencyDDL,
      paymentTermsDDL: state.purchaseOrder.paymentTermsDDL,
      incoTermsDDL: state.purchaseOrder.incoTermsDDL,
      poReferenceNoDDL: state.purchaseOrder.poReferenceNoDDL,
      poItemsDDL: state.purchaseOrder.poItemsDDL,
      uomDDL: state.commonDDL.uomDDL,
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  }, shallowEqual);

  const {
    currencyDDL,
    paymentTermsDDL,
    incoTermsDDL,
    poItemsDDL,
    uomDDL,
    profileData,
    selectedBusinessUnit,
  } = storeData;

  const addRowDtoData = (values) => {
    // if reference, can't add same reference and same item multiple
    // if not reference, can't add multiple item
     let arr;

    if (values?.referenceNo) {
      arr = rowDto?.filter(
        (item) =>
          item.referenceNo?.value === values?.referenceNo?.value &&
          item?.item?.value === values?.item?.value
      );
    } else {
      arr = rowDto?.filter((item) => item?.item?.value === values?.item?.value);
    }
    if (arr?.length > 0 && ![12,17,102,117,208].includes(selectedBusinessUnit?.value)) {
      return toast.warn("Not allowed to duplicate items");
    }

      // const priceStructure = values?.item?.priceStructure?.map((item) => ({
      //   ...item,
      //   value: item?.value || 0,
      //   amount: item?.amount || 0,
      // }));

      const newData = {
        ...values,
        desc: "",
        selectedUom: {
          value: values?.item?.uoMId,
          label: values?.item?.uoMName,
        },
        orderQty: 0,
        restofQty: values?.item?.restofQty || 0,
        refQty: values?.item?.refQty,
        basicPrice: 0,
        lastPrice: lastPriceFunc(values?.item?.lastPoInfo) || 0,
        netValue: 0,
        vat: 0,
        userGivenVatAmount: "",
        vatAmount: 0,
        priceStructure: [], //priceStructure,
      };
      setRowDto([...rowDto, newData]);
    
  };

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm?.item?.value !== payload);

    const filterArr = rowDto.filter((itm) => {
      // don't filter other refference items
      if (itm?.referenceNo?.value !== payload?.referenceNo?.value) {
        return true;
      }
      // flter refference items via item id
      if (
        itm?.item?.value !== payload?.item?.value &&
        itm?.referenceNo?.value === payload?.referenceNo?.value
      ) {
        return true;
      } else {
        return false;
      }
    });

    setRowDto([...filterArr]);
  };

  useEffect(() => {
    getControllingUnitDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCuList
    );
    getCostCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      null,
      setCostCenterListTwo
    );
    // getCostElementDDL(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   null,
    //   setCostElementListTwo
    // );
    getProfitCenterList(
      selectedBusinessUnit?.value,
      setProfitCenterListTwo,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  const getItemDDL = (supplierId, refType, referenceNo) => {
    dispatch(
      getPOItemForServiceItemDDLAction(
        location?.state?.orderType?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.sbu?.value,
        location?.state?.purchaseOrg?.value,
        location?.state?.plant?.value,
        location?.state?.warehouse?.value,
        supplierId,
        refType,
        referenceNo
      )
    );
  };
  // getRefNoDdlBySupplier
  useEffect(() => {
    getRefNoDDL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlForServicePo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.sbu?.value,
      location?.state?.purchaseOrg?.value,
      location?.state?.plant?.value,
      location?.state?.warehouse?.value,
      location?.state?.refType?.label,
      setRefNoDDL
    );
  };

  const [transferBu, getTransferBu] = useAxiosGet();

  const businessUnitDDL = useMemo(() => {
    if (transferBu?.length > 0) {
      let data = transferBu.map((item) => ({
        ...item,
        value: item?.businessUnitId,
        label: item?.businessUnitName,
      }));
      return data;
    }
  }, [transferBu]);

  useEffect(() => {
    getTransferBu(
      `/procurement/PurchaseOrder/TransferPoBusinessUnit?UnitId=${selectedBusinessUnit?.value}`
    );
  }, [selectedBusinessUnit]);
  const getIsDisabledAddBtn = (values) => {
    if (values.isTransfer) {
      if (!values?.controllingUnit || !values?.item || !values?.costElement|| !values?.costCenter || !values?.profitCenter) {
        return true;
      }
    } else {
      if (!values?.controllingUnit || !values?.costElementTwo || !values?.costCenterTwo || !values?.profitCenterTwo || !values?.item) {
        return true;
      }
    }
  }
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          deliveryAddress: location?.state?.warehouse?.address,
          currency: currencyDDL[0],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => {
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
          isValid,
          setTouched,
        }) => (
          <>
            {loading && <Loading />}
            <Form className="form form-label-right po-label">
              <div className="global-form">
                {values?.supplierName?.label && (
                  <div style={{ color: "blue" }}>
                    <b>Supplier : {values?.supplierName?.label} , </b>
                    <b>
                      Supplier Address : {values?.supplierName?.supplierAddress}
                    </b>
                  </div>
                )}
                <div className="form-group row">
                  <div className="col-lg-2">
                    <label>Supplier Name</label>
                    <SearchAsyncSelect
                      selectedValue={values.supplierName}
                      handleChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                        // setFieldValue("item", "");
                        // setFieldValue("referenceNo", "");
                      }}
                      loadOptions={(v) => {
                        if (v.length < 3) return [];
                        return axios
                          .get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${location?.state?.sbu?.value}`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                            }));
                            return updateList;
                          });
                      }}
                      disabled={true}
                      isDisabled={false}
                    />
                    <FormikError
                      errors={errors}
                      name="supplierName"
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <NewSelect
                      name="supplierName"
                      options={supplierNameDDL}
                      value={values?.supplierName}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                        setFieldValue("item", "");
                        setFieldValue("referenceNo", "");
                        // console.log(valueOption)
                        // getRefNoDDL(valueOption?.value)
                        // if user select without reference in landing
                        if (location?.state?.refType?.value === 3) {
                          getItemDDL(valueOption?.value, 3, 0);
                        }
                        // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        if (values?.referenceNo) {
                          getItemDDL(
                            values?.supplierName?.value,
                            location?.state?.refType?.value,
                            values?.referenceNo?.value
                          );
                        }
                        // dispatch(slice.SetPoItemsDDL([]));
                      }}
                      placeholder="Supplier Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-2">
                    <label>Delivery Address</label>
                    <InputField
                      value={values?.deliveryAddress}
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Order Date</label>
                    <InputField
                      value={values?.orderDate}
                      name="orderDate"
                      placeholder="Order Date"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      name="lastShipmentDate"
                      placeholder="Last Shipment Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="currency"
                      options={currencyDDL}
                      value={values?.currency}
                      label="Currency"
                      onChange={(valueOption) => {
                        setFieldValue("currency", valueOption);
                      }}
                      placeholder="Currency"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="paymentTerms"
                      options={paymentTermsDDL}
                      value={values?.paymentTerms}
                      onChange={(valueOption) => {
                        setFieldValue("cash", "");
                        setFieldValue("paymentTerms", valueOption);
                      }}
                      label="Payment Terms"
                      placeholder="Payment Terms"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Cash/Advance(%)</label>
                    <InputField
                      value={values?.cash}
                      name="cash"
                      step="any"
                      min="0"
                      max="100"
                      disabled={values?.paymentTerms?.label === "Credit"}
                      placeholder="Cash/Advance(%)"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Pay Days (After MRR)</label>
                    <InputField
                      value={values?.payDays}
                      name="payDays"
                      placeholder="Pay Days"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="incoterms"
                      options={incoTermsDDL}
                      value={values?.incoterms}
                      isDisabled={
                        location?.state?.purchaseOrg?.label !==
                        "Foreign Procurement"
                      }
                      onChange={(valueOption) => {
                        setFieldValue("incoterms", valueOption);
                      }}
                      label="Incoterms"
                      placeholder="Incoterms"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Supplier Reference</label>
                    <InputField
                      value={values?.supplierReference}
                      name="supplierReference"
                      placeholder="Supplier Reference"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Reference Date</label>
                    <InputField
                      value={values?.referenceDate}
                      name="referenceDate"
                      placeholder="Reference Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Validity</label>
                    <InputField
                      value={values?.validity}
                      name="validity"
                      placeholder="Validity"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Freight/Transport</label>
                    <InputField
                      value={values.freight}
                      placeholder={"Freight"}
                      name={"freight"}
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Gross Discount</label>
                    <InputField
                      value={values.discount}
                      placeholder={"Gross Discount"}
                      name={"discount"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Commission</label>
                    <InputField
                      value={values.commision}
                      placeholder={"Commission"}
                      name={"commision"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Others Charge</label>
                    <InputField
                      value={values?.othersCharge}
                      name="othersCharge"
                      type="number"
                      placeholder="Others Charge"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Lead Time (Days)</label>
                    <InputField
                      value={values?.leadTimeDays}
                      name="leadTimeDays"
                      type="number"
                      placeholder="Lead Time (Days)"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="controllingUnit"
                      options={cuList}
                      value={values?.controllingUnit}
                      onChange={(valueOption) => {
                        setFieldValue("controllingUnit", valueOption);
                        setFieldValue("costElement", "");
                      }}
                      label="Controlling Unit"
                      placeholder="Controlling Unit"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-10">
                    {/* <label>Other Terms</label>
                    <InputField
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      type="text"
                    /> */}
                    <label>Other Terms</label>
                    <TextArea
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      rows="1"
                      max={1000}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <div
                      style={{ marginTop: "23px" }}
                      className="d-flex align-items-center"
                    >
                      <span className="mr-2">Is Transfer</span>
                      <Field
                        type="checkbox"
                        name="isTransfer"
                        checked={values.isTransfer}
                        onChange={(e) => {
                          setFieldValue("isTransfer", e.target.checked);
                          setRowDto([])
                          setFieldValue("transferBusinessUnit", "");
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
                          setFieldValue("profitCenterTwo", "");
                          setFieldValue("costCenterTwo", "");
                          setFieldValue("costElementTwo", "");
                          if (!e?.target?.checked) {
                            setTouched({
                              ...touched,
                              transferBusinessUnit: false,
                              costCenter: false,
                              costElement: false,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                  {values.isTransfer && (
                    <>
                      <div className="col-lg-2">
                        <ISelect
                          label="Transfer Business unit"
                          options={businessUnitDDL}
                          value={values?.transferBusinessUnit}
                          name="transferBusinessUnit"
                          isDisabled={!values?.isTransfer}
                          setFieldValue={setFieldValue}
                          dependencyFunc={(
                            value,
                            values,
                            setFieldValue,
                            label,
                            valueOption
                          ) => {
                            getCostCenterDDL(
                              profileData?.accountId,
                              valueOption?.value,
                              values?.isTransfer,
                              setCostCenterList
                            );
                            // getCostElementDDL(
                            //   profileData?.accountId,
                            //   valueOption?.value,
                            //   values?.isTransfer,
                            //   setCostElementList
                            // );
                            getProfitCenterList(
                              valueOption?.value,
                              setProfitCenterList,
                              setLoading
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          name="profitCenter"
                          options={profitCenterList || []}
                          value={values?.profitCenter}
                          onChange={(valueOption) => {
                            setFieldValue("profitCenter", valueOption);
                          }}
                          label="Profit Center"
                          placeholder="Profit Center"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.isTransfer}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          name="costCenter"
                          options={costCenterList}
                          value={values?.costCenter}
                          onChange={(valueOption) => {                          
                            if(valueOption){
                              setFieldValue("costCenter", valueOption);
                              setFieldValue("costElement", "");
                              getCostElementDDL(
                                values?.transferBusinessUnit?.value,
                                profileData?.accountId,
                                valueOption?.value,
                                setCostElementList
                              );
                            }else{
                              setFieldValue("costCenter", "");
                              setFieldValue("costElement", "");
                              setCostElementList([]);
                            }
                          }}
                          label="Cost Center"
                          placeholder="Cost Center"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.isTransfer}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          name="costElement"
                          options={costElementList}
                          value={values?.costElement}
                          onChange={(valueOption) => {
                            setFieldValue("costElement", valueOption);
                          }}
                          label="Cost Element"
                          placeholder="Cost Element"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.isTransfer}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* End Header part */}

                {/* Start row part */}
                {/* {values?.supplierName?.label && (
                  <div style={{ marginTop: "-25px", color: "blue" }}>
                    <b>Supplier : {values?.supplierName?.label} , </b>
                    <b>
                      Supplier Address : {values?.supplierName?.supplierAddress}
                    </b>
                  </div>
                )} */}

                <div className="row mt-2">
                  {values.isTransfer ? "":(
                    <>
                      <div className="col-lg-2">
                        <NewSelect
                          name="profitCenterTwo"
                          options={profitCenterListTwo || []}
                          value={values?.profitCenterTwo}
                          onChange={(valueOption) => {
                            setFieldValue("profitCenterTwo", valueOption);
                          }}
                          label="Profit Center"
                          placeholder="Profit Center"
                          errors={errors}
                          touched={touched}
                        
                        />
                      </div>
                    
                      <div className="col-lg-2">
                        <NewSelect
                          name="costCenterTwo"
                          options={costCenterListTwo}
                          value={values?.costCenterTwo}
                          onChange={(valueOption) => {
                            
                            if(valueOption){
                              setFieldValue("costCenterTwo", valueOption);
                              setFieldValue("costElementTwo", "");
                              getCostElementDDL(
                                selectedBusinessUnit?.value,
                                profileData?.accountId,                                
                                valueOption?.value,
                                setCostElementListTwo
                              );
                            }else{
                              setFieldValue("costCenterTwo", "");
                              setFieldValue("costElementTwo", "");
                              setCostElementListTwo([]);
                            }
                          }}
                          label="Cost Center"
                          placeholder="Cost Center"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          name="costElementTwo"
                          options={costElementListTwo}
                          value={values?.costElementTwo}
                          onChange={(valueOption) => {
                            setFieldValue("costElementTwo", valueOption);
                          }}
                          label="Cost Element"
                          placeholder="Cost Element"
                          errors={errors}
                          touched={touched}
                        />
                      </div> 
                    </>
                  )}
                  <div className="col-lg-2">
                    <NewSelect
                      name="referenceNo"
                      options={refNoDDL}
                      value={values?.referenceNo}
                      isDisabled={
                        location.state?.refType?.value === 3
                        // ||  !values?.supplierName
                      }
                      onChange={(valueOption) => {
                        setFieldValue("referenceNo", valueOption);
                        setFieldValue("item", "");
                        if (location?.state?.refType?.value) {
                          getItemDDL(
                            values?.supplierName?.value,
                            location?.state?.refType?.value,
                            valueOption?.value
                          );
                        }
                      }}
                      label="Reference No"
                      placeholder="Reference No"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {location.state?.refType?.value === 3 ? (
                    <div className="col-lg-2">
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values.item}
                        handleChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrderItemDDL/ServicePurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${
                                location?.state?.orderType?.value
                              }&AccountId=${
                                profileData?.accountId
                              }&BusinessUnitId=${
                                selectedBusinessUnit?.value
                              }&SbuId=${
                                location?.state?.sbu?.value
                              }&PurchaseOrgId=${
                                location?.state?.purchaseOrg?.value
                              }&PlantId=${
                                location?.state?.plant?.value
                              }&WearhouseId=${
                                location?.state?.warehouse?.value
                              }&RefTypeId=${
                                location?.state?.refType?.value
                              }&RefNoId=${0}&searchTerm=${v}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                              }));
                              return updateList;
                            });
                        }}
                        disabled={true}
                        // isDisabled={!values?.supplierName}
                      />
                      <FormikError
                        errors={errors}
                        name="item"
                        touched={touched}
                      />
                    </div>
                  ) : (
                    <div className="col-lg-4">
                      <NewSelect
                        name="item"
                        // load service if wihtout ref selected
                        options={poItemsDDL}
                        value={values?.item}
                        isDisabled={
                          location.state?.refType?.value === 3 ||
                          !values.referenceNo
                        }
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        label="Item"
                        placeholder="Item"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  <div className="col-lg-2">
                    <div
                      style={{ marginTop: "19px" }}
                      className="d-flex align-items-center"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          addRowDtoData(values);
                        }}
                        disabled={ getIsDisabledAddBtn(values)}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                      {/* <b className="ml-1">Order Total : 0</b> */}
                    </div>
                  </div>
                </div>
              </div>

              <TotalNetAmount rowDto={rowDto} />

              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={location?.state?.refType?.value !== 3}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
                uomDDL={uomDDL}
              />

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
                onClick={() => {
                  setRowDto([]);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
