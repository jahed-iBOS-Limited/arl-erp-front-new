/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { validationSchema, initData, getRefNoDdlForPurchaseContractPo } from "./helper";
import { useLocation } from "react-router-dom";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {  getPOItemForContractItemDDLAction } from "../../_redux/Actions";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../../_helper/_todayDate";
import TotalNetAmount from "../../TotalNetAmount";
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect'
import FormikError from './../../../../../_helper/_formikError'
import axios from "axios";

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
  const [refNoDDL, setRefNoDDL] = useState([]);

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
    uomDDL,
    poItemsDDL,
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
      arr = rowDto?.filter(
        (item) => item?.item?.value === values?.item?.value
      );
    }


    if (arr?.length > 0) {
      toast.warn("Not allowed to duplicate items");
    } else {
      const priceStructure = values?.item?.priceStructure?.map((item) => ({
        ...item,
        value: item?.value || 0,
        amount: item?.amount || 0,
      }));

      const newData = {
        ...values,
        desc: values?.item?.label,
        selectedUom: {
          value: values?.item?.uoMId,
          label: values?.item?.uoMName,
        },
        orderQty: 0,
        basicPrice: 0,
        restofQty: values?.item?.restofQty || 0,
        refQty: values?.item?.refQty,
        priceStructure: priceStructure,
        netValue: 0,
        deliveryDate: _todayDate(),
      };
      setRowDto([...rowDto, newData]);
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm?.item?.value !== payload);

    const filterArr = rowDto.filter((itm) => {
      // don't filter other refference items
      if (itm?.referenceNo?.value !== payload?.referenceNo?.value) {
        return true
      }
      // flter refference items via item id
      if (itm?.item?.value !== payload?.item?.value && itm?.referenceNo?.value === payload?.referenceNo?.value) {
        return true
      } else {
        return false
      }
    });

    setRowDto([...filterArr]);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    if(name === "orderQty"){
      _sl.netValue = (value * _sl.basicPrice)  
    }else if(name=== "basicPrice"){
      _sl.netValue = (value * _sl.orderQty)
    }
    setRowDto(data);
  };

  const getItemDDL = (supplierId, refType, referenceNo) => {
    dispatch(
      getPOItemForContractItemDDLAction(
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


  useEffect(() => {
    if (location?.state?.refType?.value !== 3) {
      getRefNoDDL()
    }

  }, [profileData?.accountId, selectedBusinessUnit?.value])

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlForPurchaseContractPo(
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
        }) => (
          <>
            <Form className="form form-label-right po-label">
              <div className="global-form">
                <div className="form-group row">
                <div className="col-lg-2">
                    <label>Supplier Name</label>
                    <SearchAsyncSelect
                      selectedValue={values.supplierName}
                      handleChange={(valueOption) => {
                        setFieldValue('supplierName', valueOption)
                        setFieldValue("item", "");
                      }}
                      loadOptions={(v) => {
                        if (v.length < 3) return [];
                        return axios.get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${location?.state?.sbu?.value}`
                        ).then((res) => {
                          const updateList = res?.data.map(item => ({
                            ...item,
                          }))
                          return updateList
                        })
                      }}
                      disabled={true}
                      isDisabled={false}
                    />
                    <FormikError errors={errors} name="supplierName" touched={touched} />
                  </div>
                  {/* <div className="col-lg-2">
                    <NewSelect
                      name="supplierName"
                      options={supplierNameDDL}
                      value={values?.supplierName}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", "");
                        setFieldValue("supplierName", valueOption);
                        // if user select without reference in landing
                        // if (location?.state?.refType?.value === 3) {
                        //   getItemDDL(valueOption?.value, 3, 0);
                        // }
                        // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        if (values?.referenceNo) {
                          getItemDDL(
                            values?.supplierName?.value,
                            location?.state?.refType?.value,
                            values?.referenceNo?.value
                          );
                        }
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
                      disabled={values?.paymentTerms?.label === "Credit"}
                      placeholder="Cash/Advance(%)"
                      step="any"
                      min="0"
                      max="100"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Pay Days (After Invoice)</label>
                    <InputField
                      value={values?.payDays}
                      name="payDays"
                      placeholder="Pay Days"
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="incoterms"
                      options={incoTermsDDL}
                      value={values?.incoterms}
                      onChange={(valueOption) => {
                        setFieldValue("incoterms", valueOption);
                      }}
                      isDisabled
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
                    <NewSelect
                      name="contractType"
                      options={[
                        { value: "Scheduled", label: "Scheduled" },
                        { value: "Blanket", label: "Blanket" },
                      ]}
                      value={values?.contractType}
                      onChange={(valueOption) => {
                        setFieldValue("contractType", valueOption);
                      }}
                      label="Contract Type"
                      placeholder="Contract Type"
                      errors={errors}
                      touched={touched}
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
                    <label>Other Terms</label>
                    <InputField
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      type="text"
                    />
                  </div>
                </div>

                {/* End Header part */}

                {/* Start row part */}

                <div className="row mt-2">
                  <div className="col-lg-2">
                    <NewSelect
                      name="referenceNo"
                      options={refNoDDL}
                      value={values?.referenceNo}
                      isDisabled={
                        location.state?.refType?.value === 3
                        // || !values?.supplierName
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

                  {location.state?.refType?.value === 3 ? <div className="col-lg-2">
                    <label>Item</label>
                    <SearchAsyncSelect
                      selectedValue={values.item}
                      handleChange={(valueOption) => {
                        setFieldValue('item', valueOption)
                      }}
                      loadOptions={(v) => {
                        if (v.length < 3) return [];
                        return axios.get(
                          `/procurement/PurchaseOrderItemDDL/PurchaseContractItemList?ItemTypeId=0&OrderTypeId=${location?.state?.orderType?.value}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SbuId=${location?.state?.sbu?.value}&PurchaseOrgId=${location?.state?.purchaseOrg?.value}&PlantId=${location?.state?.plant?.value}&WearhouseId=${location?.state?.warehouse?.value}&RefTypeId=${location?.state?.refType?.value}&RefNoId=${0}&searchTerm=${v}`
                        ).then((res) => {
                          const updateList = res?.data.map(item => ({
                            ...item,
                          }))
                          return updateList
                        })
                      }}
                      // isDisabled={!values?.supplierName}
                    />
                    <FormikError errors={errors} name="item" touched={touched} />
                  </div> :

                    <div className="col-lg-2">
                      <NewSelect
                        name="item"
                        options={poItemsDDL || []}
                        value={values?.item}
                        isDisabled={
                          location.state?.refType?.value === 3 || !values.referenceNo
                        }
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        label="Item"
                        placeholder="Item"
                        errors={errors}
                        touched={touched}
                      />
                    </div>}


                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={poItemsDDL || []}
                      value={values?.item}
                      isDisabled={
                        location.state?.refType?.value === 3
                          ? !values.supplierName
                          : !values.referenceNo || !values?.supplierName
                      }
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      label="Item"
                      placeholder="Item"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-2">
                    <label>Delivery Date</label>
                    <InputField
                      value={values?.deliveryDate}
                      name="deliveryDate"
                      placeholder="Delivery Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <div
                      style={{ marginTop: "14px" }}
                      className="d-flex align-items-center"
                    >
                      <button
                        onClick={() =>{
                          setFieldValue("item", "");
                          addRowDtoData(values)
                        }}
                        disabled={!values.item}
                        className="btn btn-primary"
                        type="submit"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <TotalNetAmount
                rowDto={rowDto}
              />

              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={location?.state?.refType?.value !== 3}
                rowDtoHandler={rowDtoHandler}
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
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
