import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { validationSchema, initData } from "./helper";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {  getPOItemForContractItemDDLAction } from "../../_redux/Actions";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import TotalNetAmount from "../../TotalNetAmount";
import { getRefNoDdlForPurchaseContractPo } from "../../Form/purchaseContract/helper";
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect'
import FormikError from './../../../../../_helper/_formikError'
import axios from "axios";

export default function CreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  id,
  singleData,
  viewPage,
}) {
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
    supplierNameDDL,
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
      arr = rowDto?.filter((item) => item?.item?.value === values?.item?.value);
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
        newItem: true,
        desc: values?.item?.label,
        selectedUom: { value: values?.item?.uoMId, label: values?.item?.uoMName },
        orderQty: "",
        basicPrice: "",
        deliveryDate: values?.deliveryDate,
        restofQty: values?.item?.restofQty || 0,
        priceStructure: priceStructure,
        netValue: 0,
      };
      setRowDto([...rowDto, newData]);
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm?.item?.value !== payload)

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
        singleData?.objHeaderDTO?.purchaseOrderTypeId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.objHeaderDTO?.sbuId,
        singleData?.objHeaderDTO?.purchaseOrgId,
        singleData?.objHeaderDTO?.plantId,
        singleData?.objHeaderDTO?.warehouseId,
        supplierId,
        refType,
        referenceNo
      )
    );
  };

  useEffect(() => {
    const newData = singleData?.objRowListDTO?.map((item, index) => {
      const priceStructure = item?.priceStructure?.map((item) => ({
        ...item,
        value: item?.value || 0,
        amount: item?.amount || 0,
      }));

      let obj = {
        ...item,
        item: {
          label: item?.itemName,
          value: item?.itemId,
          code: item?.itemCode,
          refQty: item?.referenceQty,
        },
        referenceNo: {
          value: item?.referenceId,
          label: item?.referenceCode,
        },
        desc: item?.purchaseDescription || "",
        selectedUom: {
          label: item?.uoMname,
          value: item?.uoMid,
        },
        orderQty: item?.contractQty,
        basicPrice: item?.basePrice,
        deliveryDate: _dateFormatter(item?.deliveryDate),
        initOrderQty: item?.initOrderQty || item?.orderQty,
        refQty: item?.referenceQty,
        restofQty: item?.restofQuantiy || 0,
        netValue: item?.totalValue,
        priceStructure: priceStructure,
      };
      return obj;
    });
    setRowDto([...newData]);

    // get item initially
    getItemDDL(
      singleData?.objHeaderDTO?.businessPartnerId,
      singleData?.objHeaderDTO?.referenceTypeId,
      0
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const {
    businessPartnerId,
    businessPartnerName,
    deliveryAddress,
    purchaseContractDate,
    lastShipmentDate,
    currencyId,
    currencyCode,
    paymentTermsId,
    paymentTerms,
    cashOrAdvancePercent,
    paymentDaysAfterDelivery,
    incoterms,
    incotermsId,
    supplierReference,
    referenceDate,
    validityDate,
    otherTerms,
    itemGroupName,
    contractTypeName,
  } = singleData?.objHeaderDTO;

  useEffect(() => {
    getRefNoDDL()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value])

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlForPurchaseContractPo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      singleData?.objHeaderDTO?.sbuId,
      singleData?.objHeaderDTO?.purchaseOrgId,
      singleData?.objHeaderDTO?.plantId,
      singleData?.objHeaderDTO?.warehouseId,
      singleData?.objHeaderDTO?.referenceType,
      setRefNoDDL
    );
  };


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          supplierName: {
            value: businessPartnerId,
            label: businessPartnerName,
          },
          deliveryAddress,
          orderDate: _dateFormatter(purchaseContractDate),
          lastShipmentDate: _dateFormatter(lastShipmentDate),
          currency: { value: currencyId, label: currencyCode },
          paymentTerms: {
            value: paymentTermsId,
            label: paymentTerms,
          },
          cash: cashOrAdvancePercent,
          payDays: paymentDaysAfterDelivery,
          incoterms: { value: incotermsId, label: incoterms },
          supplierReference,
          referenceDate: _dateFormatter(referenceDate),
          validity: _dateFormatter(validityDate),
          itemGroup: {
            value: itemGroupName,
            label: itemGroupName,
          },
          contractType: {
            value: contractTypeName,
            label: contractTypeName,
          },
          otherTerms,
          referenceNo: "",
          item: "",
          deliveryDate: _todayDate(),
          isAllItem: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => { });
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
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right po-label">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="supplierName"
                      options={supplierNameDDL}
                      value={values?.supplierName}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                        setFieldValue("item", "");
                        // if user select without reference in landing
                        if (singleData?.objHeaderDTO?.referenceTypeId === 3) {
                          getItemDDL(valueOption?.value, 3, 0);
                        }
                        // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        if (values?.referenceNo) {
                          getItemDDL(
                            values?.supplierName?.value,
                            singleData?.objHeaderDTO?.referenceTypeId,
                            values?.referenceNo?.value
                          );
                        }
                      }}
                      placeholder="Supplier Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Delivery Address</label>
                    <InputField
                      value={values?.deliveryAddress}
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                      disabled={viewPage || isEdit}
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
                      disabled={viewPage || isEdit}
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
                      isDisabled={viewPage || isEdit}
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
                      isDisabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Cash/Advance(%)</label>
                    <InputField
                      value={values?.cash}
                      name="cash"
                      disabled={
                        viewPage || values?.paymentTerms?.label === "Credit" || isEdit
                      }
                      placeholder="Cash/Advance(%)"
                      type="number"
                      min="0"
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
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="incoterms"
                      options={incoTermsDDL}
                      value={values?.incoterms}
                      isDisabled
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
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Reference Date</label>
                    <InputField
                      value={values?.referenceDate}
                      name="referenceDate"
                      placeholder="Reference Date"
                      type="date"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                  <NewSelect
                    name="itemGroup"
                    options={[
                      { value: "Asset", label: "Asset" },
                      { value: "Service", label: "Service" },
                      { value: "Others", label: "Others" },
                    ]}
                    value={values?.itemGroup}
                    onChange={(valueOption) => {
                      setFieldValue("itemGroup", valueOption);
                    }}
                    label="Item Group"
                    placeholder="Item Group"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                  <div className="col-lg-2">
                    <NewSelect
                      name="contractType"
                      options={[
                        {
                          value: "Scheduled",
                          label: "Scheduled",
                        },
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
                      isDisabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Validity</label>
                    <InputField
                      value={values?.validity}
                      name="validity"
                      placeholder="Validity"
                      type="date"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Other Terms</label>
                    <InputField
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      type="text"
                      disabled={viewPage || isEdit}
                    />
                  </div>
                </div>

                {/* End Header part */}

                {/* Start row part */}
                {!viewPage && (
                  <div className="row mt-2">
                    <div className="col-lg-3">
                      <NewSelect
                        name="referenceNo"
                        options={refNoDDL}
                        value={values?.referenceNo}
                        isDisabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
                          // || !values?.supplierName
                        }
                        onChange={(valueOption) => {
                          setFieldValue("referenceNo", valueOption);
                          setFieldValue("item", "");
                          if (singleData?.objHeaderDTO?.referenceTypeId) {
                            getItemDDL(
                              values?.supplierName?.value,
                              singleData?.objHeaderDTO?.referenceTypeId,
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
                    {singleData?.objHeaderDTO?.referenceTypeId === 3 ? <div className="col-lg-3">
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values.item}
                        handleChange={(valueOption) => {
                          setFieldValue('item', valueOption)
                        }}
                        loadOptions={(v) => {
                          return axios.post(
                            `/procurement/PurchaseOrderItemDDL/PurchaseContractItemList?ItemTypeId=0&OrderTypeId=${singleData?.objHeaderDTO?.purchaseOrderTypeId}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SbuId=${singleData?.objHeaderDTO?.sbuId}&PurchaseOrgId=${singleData?.objHeaderDTO?.purchaseOrganizationId}&PlantId=${singleData?.objHeaderDTO?.plantId}&WearhouseId=${singleData?.objHeaderDTO?.warehouseId}&PartnerId=${values?.supplierName?.value}&RefTypeId=${singleData?.objHeaderDTO?.referenceTypeId}&RefNoId=${0}&searchTerm=${v}`
                          ).then((res) => {
                            const updateList = res?.data.map(item => ({
                              ...item,
                            }))
                            return updateList
                          })
                        }}
                        disabled={true}
                      />
                      <FormikError errors={errors} name="item" touched={touched} />
                    </div> :

                      <div className="col-lg-3">
                        <NewSelect
                          name="item"
                          options={poItemsDDL || []}
                          value={values?.item}
                          isDisabled={
                            singleData?.objHeaderDTO?.referenceTypeId === 3
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
                      </div>}
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={poItemsDDL || []}
                        value={values?.item}
                        isDisabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
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
                    <div className="col-lg-3">
                      <label>Delivery Date</label>
                      <InputField
                        value={values?.deliveryDate}
                        name="deliveryDate"
                        placeholder="Delivery Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div
                        style={{ marginTop: "14px" }}
                        className="d-flex align-items-center"
                      >
                        <button
                          onClick={() =>{
                            addRowDtoData(values)
                            setFieldValue("item", "");
                          } }
                          className="btn btn-primary"
                          // type="button"
                          type="submit"
                        >
                          Add
                        </button>
                        {/* <b className="ml-1">Order Total : 0</b> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <TotalNetAmount rowDto={rowDto} />
              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={singleData?.objHeaderDTO?.referenceTypeId !== 3}
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
                uomDDL={uomDDL}
                viewPage={viewPage}
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
