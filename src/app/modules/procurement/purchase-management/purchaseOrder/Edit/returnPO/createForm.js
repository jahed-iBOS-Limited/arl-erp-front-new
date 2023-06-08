import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import { validationSchema, initData, getReturnPOInfoById } from "./helper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {  editPurchaseReturn, getPOItemForReturnItemDDLAction } from "../../_redux/Actions";
import RowDtoTable from "./rowDtoTable";
import { toast } from "react-toastify";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import TotalNetAmount from "../../TotalNetAmount";
import { getUniQueItems } from "../../helper";
import { getRefNoDdlForReturnPo } from "../../Form/returnPO/helper";




export default function ReturnPOCreateForm({
  btnRef,
  //saveHandler,
  resetBtnRef,
  disableHandler,
  singleData,
  viewPage,
  isEdit,
  poIds,
  singlereturnCB
}) {
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [refNoDDL, setRefNoDDL] = useState([]);

  // redux store data
  const storeData = useSelector((state) => {
    return {
      supplierNameDDL: state.purchaseOrder.supplierNameDDL,
      poReferenceNoDDL: state.purchaseOrder.poReferenceNoDDL,
      poItemsDDL: state.purchaseOrder.poItemsDDL,
      itemListWithoutRef: state.purchaseOrder.itemListWithoutRef,
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  }, shallowEqual);

  const {
    supplierNameDDL,
    poItemsDDL,
    profileData,
    selectedBusinessUnit,
  } = storeData;

  // add single item to row or add all item to row
  const addRowDtoData = (data, values) => {


    let poDataCheck = rowDto.filter(data => data?.referenceNo?.value !== values?.referenceNo?.value)
     if(poDataCheck.length > 0){
       return toast.warning("Not allowed to differente PO")
     }

    if (values?.isAllItem) {
      // get new items that not exit in rowdto
      const refferenceItems = getUniQueItems(data, rowDto, values);

      // show error if no new item found
      if (refferenceItems?.length === 0) {
        return toast.warn("Not allowed to duplicate items");
      }

      const newData = refferenceItems?.map((item, index) => {
        // const priceStructure = item?.priceStructure?.map((item) => ({
        //   ...item,
        //   value: item?.value || 0,
        //   amount: item?.amount || 0,
        // }));

        let obj = {
          ...values,
          newItem:true,
          item: { ...item, code: item?.code },
          desc: item?.label,
          selectedUom: { value: item?.uomId, label: item?.uomName },
          orderQty: item?.restofQty || 0,
          basicPrice: item?.basePrice || 0,
          refQty: item?.refQty,
          restofQty: item?.receiveQty || 0,
          poQuantity:item?.poQty,
          invReturnQty: item?.returnQty || 0,
          netValue: 0,
          vat:0,
          vatAmount:0,
          priceStructure:[] //priceStructure,
        };
        return obj;
      });
      setRowDto([...newData, ...rowDto]);
    } else {
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
        // const priceStructure = values?.item?.priceStructure?.map((item) => ({
        //   ...item,
        //   value: item?.value || 0,
        //   amount: item?.amount || 0,
        // }));

        const newData = {
          ...values,
          newItem:true,
          item: { ...values?.item, code: values?.item?.code },
          desc: values?.item?.label,
          selectedUom: {
            value: values?.item?.uomId,
            label: values?.item?.uomName,
          },
          orderQty: 0,
          basicPrice: values?.item?.basePrice || 0,
          refQty: values?.item?.refQty,
          invReturnQty: values?.item?.returnQty || 0,
          poQuantity:values?.item?.poQty,
          restofQty: values?.item?.receiveQty || 0,
          netValue: 0,
          vat:0,
          vatAmount:0,
          priceStructure:[] //priceStructure,
        };
        setRowDto([...rowDto, newData]);
      }
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm.item?.value !== payload)

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
  // const rowDtoHandler = (name, value, sl) => {
  //   let data = [...rowDto];
  //   let _sl = data[sl];
  //   _sl[name] = value;
  //   setRowDto(data);
  // };

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    if(name === "orderQty"){
      _sl.vatAmount = (value * _sl.basicPrice)/100  * _sl?.vat
      _sl.netValue = (value * _sl.basicPrice) + ((value * _sl.basicPrice)/100  * _sl?.vat)
    }else if(name=== "basicPrice"){
      _sl.vatAmount = (value * _sl.orderQty)/100  * _sl?.vat
      _sl.netValue = (value * _sl.orderQty) + ((value * _sl.orderQty)/100  * _sl?.vat)
    }else if(name=== "vat"){
      _sl.vatAmount = (_sl.orderQty * _sl.basicPrice)/100  * value
      _sl.netValue = (_sl.orderQty * _sl.basicPrice) + ((_sl.orderQty * _sl.basicPrice)/100  * value)
    }
    setRowDto(data);
  };

  const getItemDDL = (supplierId, refType, referenceNo) => {
    dispatch(
      getPOItemForReturnItemDDLAction(
        singleData?.objHeaderDTO?.purchaseOrderTypeId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.objHeaderDTO?.sbuId,
        singleData?.objHeaderDTO?.purchaseOrganizationId,
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
      // const priceStructure = item?.priceStructure?.map((item) => ({
      //   ...item,
      //   value: item?.value || 0,
      //   amount: item?.amount || 0,
      // }));

      let obj = {
        ...item,
        item: {
          label: item?.itemName,
          itemName:item?.itemName,
          value: item?.itemId,
          code: item?.itemCode,
          refQty: item?.referenceQty,
        },
        referenceNo: { value: item?.referenceId, label: item?.referenceCode },
        desc: item?.purchaseDescription || "",
        selectedUom: { label: item?.uomName, value: item?.uomId },
        orderQty: item?.orderQty,
        basicPrice: item?.basePrice,
        refQty: item?.referenceQty,
        poQuantity:item?.poQty,
        invReturnQty: item?.returnQty || 0,
        netValue: item?.totalValue,
        restofQty: item?.rcvQty,
        priceStructure:[] ,//priceStructure,
        initOrderQty:item?.orderQty,
        vat:item?.vatPercentage,
        vatAmount:item?.vatAmount,
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


  useEffect(() => {
    getRefNoDDL()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[profileData?.accountId,selectedBusinessUnit?.value])

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlForReturnPo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      singleData?.objHeaderDTO?.sbuId,
      singleData?.objHeaderDTO?.purchaseOrganizationId,
      singleData?.objHeaderDTO?.plantId,
      singleData?.objHeaderDTO?.warehouseId,
      singleData?.objHeaderDTO?.referenceTypeName,
      singleData?.objHeaderDTO?.businessPartnerId,
      setRefNoDDL
    );
  };

  const {
    businessPartnerId,
    supplierName,
    deliveryAddress,
    lastShipmentDate,
    currencyId,
    currencyCode,
    paymentTerms,
    paymentTermsName,
    cashOrAdvancePercent,
    paymentDaysAfterDelivery,
    incotermsName,
    incotermsId,
    supplierReference,
    referenceDate,
    validityDate,
    otherTerms,
    purchaseOrderDate,
    returnDate,
    freight,
    grossDiscount,
    commission
  } = singleData?.objHeaderDTO;


  const saveHandler = async (values, rowDto, cb) => {
    // setDisabled(true)
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        // check atleast one row item quantity should be greater than 0
        // we will save only those field , where order qty is greater than 0
        const foundArr = rowDto?.filter((item) => item?.orderQty > 0)
        if (foundArr.length === 0){
          //setDisabled(false)
          return toast.warn('Enter quantity')
        }

        const objRowListDTO = foundArr?.map((item, index) => ({
          referenceId: +item?.referenceNo?.value || 0,
          referenceCode: item?.referenceNo?.label || '',
          referenceQty: +item?.item?.refQty || 0,
          itemId: +item?.item?.value || 0,
          itemName: item?.item?.itemName || '',
          uoMid: +item?.selectedUom?.value || 0,
          rowId: item?.rowId || 0,
          uoMname: item?.selectedUom?.label || '',
          controllingUnitId: +item?.controllingUnit?.value || 0,
          controllingUnitName: item?.controllingUnit?.label || '',
          costCenterId: +item?.costCenter?.value || 0,
          costCenterName: item?.costCenter?.label || '',
          costElementId: +item?.costElement?.value || 0,
          costElementName: item?.costElement?.label || '',
          purchaseDescription: item?.desc || '',
          orderQty: +item?.orderQty || 0,
          basePrice: +item?.basicPrice || 0,
          finalPrice: +(item?.orderQty * item?.basicPrice) || 0,
          totalValue: +item?.netValue || 0,
          vatPercentage: +item?.vat || 0,
          vatAmount: +item?.vatAmount || 0,
          discount: 0,
          // objPriceRowListDTO:
          //   item?.priceStructure?.map((item2, index) => ({
          //     rowId: item2?.rowId || 0,
          //     priceStructureId: item2?.priceStructureId || 0,
          //     priceStructureName: item2?.priceStructureName || '',
          //     priceComponentId: item2?.priceComponentId || 0,
          //     priceComponentCode: item2?.priceComponentCode || '',
          //     priceComponentName: item2?.priceComponentName || '',
          //     valueType: item2?.valueType || '',
          //     value: +item2?.value || 0,
          //     amount: +item2?.amount || 0,
          //     baseComponentId: item2?.baseComponentId || 0,
          //     serialNo: item2?.serialNo || 0,
          //     sumFromSerial: item2?.sumFromSerial,
          //     sumToSerial: item2?.sumToSerial,
          //     mannual: item2?.mannual,
          //     factor: item2?.factor,
          //   })) || [],
        }))

        const payload = {
          objHeaderDTO: {
            purchaseOrderId: poIds,
            purchaseOrderNo: 'string',
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value || 0,
            sbuId: +singleData?.objHeaderDTO?.sbuId,
            plantId: +singleData?.objHeaderDTO?.plantId,
            priceStructureId: 0,
            plantName: singleData?.objHeaderDTO?.plantName,
            warehouseId: +singleData?.objHeaderDTO?.warehouseId,
            warehouseName: singleData?.objHeaderDTO?.warehouseName,
            supplyingWarehouseId: values?.supplyingWh?.value || 0,
            supplyingWarehouseName: values?.supplyingWh?.label || '',
            purchaseOrganizationId: +singleData?.objHeaderDTO
              ?.purchaseOrganizationId,
            businessPartnerId: +values?.supplierName?.value || 0,
            purchaseOrderDate: values?.orderDate || '2020-11-10T08:52:28.574Z',
            purchaseOrderTypeId: +singleData?.objHeaderDTO?.purchaseOrderTypeId,
            incotermsId: +values?.incoterms?.value || 0,
            returnDate: values?.returnDate || '2020-12-06T09:35:19.200Z',
            currencyId: +values?.currency?.value || 0,
            currencyCode: values?.currency?.label || '',
            supplierReference: values?.supplierReference || '',
            referenceDate: values?.referenceDate || '2020-11-10T08:52:28.574Z',
            referenceTypeId: +singleData?.objHeaderDTO?.referenceTypeId,
            paymentTerms: +values?.paymentTerms?.value || 0,
            creditPercent: 0,
            cashOrAdvancePercent: parseFloat(values?.cash) || 0,
            otherTerms: values?.otherTerms || '',
            poValidityDate: values?.validity || '2020-11-10T08:52:28.574Z',
            lastShipmentDate:
              values?.lastShipmentDate || '2020-11-10T08:52:28.574Z',
            paymentDaysAfterDelivery: +values.payDays || 0,
            deliveryAddress: values?.deliveryAddress || '',
            actionBy: +profileData?.userId,
            grossDiscount: values?.grossDiscount || 0,
            freight: values?.freight || 0,
            commission: values?.commission || 0,
          },
          objRowListDTO,
        }
        dispatch(
          editPurchaseReturn({
            data: payload,
            cb,
           // setDisabled,
           singlereturnCB
          })
        )
      // others
    } else {
     // setDisabled(false)
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          supplierName: { value: businessPartnerId, label: supplierName },
          deliveryAddress,
          returnDate: returnDate ? _dateFormatter(returnDate) : "",
          orderDate: purchaseOrderDate ? _dateFormatter(purchaseOrderDate) : "",
          lastShipmentDate: _dateFormatter(lastShipmentDate),
          currency: { value: currencyId, label: currencyCode },
          paymentTerms: { value: paymentTerms, label: paymentTermsName },
          cash: cashOrAdvancePercent,
          payDays: paymentDaysAfterDelivery,
          incoterms: { value: incotermsId, label: incotermsName },
          supplierReference,
          referenceDate: _dateFormatter(referenceDate),
          validity: _dateFormatter(validityDate),
          otherTerms,
          referenceNo: "",
          item: "",
          isAllItem: false,
          commission:commission,
          freight:freight,
          grossDiscount:grossDiscount
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => {});
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
                        
                      }}
                      placeholder="Supplier Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewPage || isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Return Date</label>
                    <InputField
                      value={values?.returnDate}
                      name="returnDate"
                      placeholder="Return Date"
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
                  <div className="col-lg-2">
                    <label>Delivery Address</label>
                    <InputField
                      value={viewPage || values?.deliveryAddress}
                      disabled
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Order Date</label>
                    <InputField
                      value={viewPage || values?.orderDate}
                      disabled={true}
                      name="orderDate"
                      placeholder="Order Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={viewPage || values?.lastShipmentDate}
                      disabled
                      name="lastShipmentDate"
                      placeholder="Last Shipment Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    {/* <label>Currency</label>
                  <InputField
                    value={values?.currency}
                    disabled
                    name="currency"
                    placeholder="Currency"
                  /> */}
                    <NewSelect
                      name="currency"
                      options={[]}
                      isDisabled
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
                      options={[]}
                      isDisabled
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
                      disabled
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
                      disabled
                      placeholder="Pay Days"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="incoterms"
                      options={[]}
                      isDisabled
                      value={values?.incoterms}
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
                      disabled
                      placeholder="Supplier Reference"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Reference Date</label>
                    <InputField
                      value={values?.referenceDate}
                      name="referenceDate"
                      disabled
                      placeholder="Reference Date"
                      type="date"
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>Validity</label>
                    <InputField
                      value={values?.validity}
                      name="validity"
                      disabled
                      placeholder="Validity"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                  <label>Freight</label>
                    <InputField
                      value={values.freight}
                      placeholder={"Freight"}
                      name={"freight"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                  <label>Gross Discount</label>
                    <InputField
                      value={values.grossDiscount}
                      placeholder={"Gross Discount"}
                      name={"grossDiscount"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                  <label>Commission</label>
                    <InputField
                      value={values.commission}
                      placeholder={"Commission"}
                      name={"commission"}
                      type={"number"}
                    />
                  </div>
                </div>
                {!viewPage && (
                  <div className="form-group row">
                    <div className="col-lg-3">
                      <ISelect
                        label="Reference No"
                        options={refNoDDL}
                        value={values.referenceNo}
                        isDisabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
                          // || !values?.supplierName
                        }
                        name="referenceNo"
                        dependencyFunc={(value, allValues, setFieldValue) => {
                          getReturnPOInfoById(value, setFieldValue);
                          setFieldValue("item", "");
                          if (singleData?.objHeaderDTO?.referenceTypeId) {
                            getItemDDL(
                              values?.supplierName?.value,
                              singleData?.objHeaderDTO?.referenceTypeId,
                              value
                            );
                          }
                        }}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <ISelect
                        label="Item"
                        isDisabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
                            ? values.isAllItem
                            : !values.referenceNo || values.isAllItem
                        }
                        options={poItemsDDL || []}
                        value={values.item}
                        name="item"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg">
                      <Field
                        name={values.isAllItem}
                        component={() => (
                          <input
                            style={{
                              position: "absolute",
                              top: "36px",
                              left: "65px",
                            }}
                            id="poIsAllItem"
                            type="checkbox"
                            className="ml-2"
                            value={values.isAllItem || ""}
                            checked={values.isAllItem}
                            name="isAllItem"
                            onChange={(e) => {
                              setFieldValue("isAllItem", e.target.checked);
                              setFieldValue("item", "");
                            }}
                          />
                        )}
                        label="isAllItem"
                      />
                      <label
                        style={{
                          position: "absolute",
                          top: "28px",
                        }}
                      >
                        All Item
                      </label>

                      <button
                        // type="button"
                        type="submit"
                        disabled={
                          singleData?.objHeaderDTO?.referenceTypeId === 3
                            ? !values.isAllItem
                              ? !values.item
                              : false
                            : !values.isAllItem
                            ? !values.referenceNo || !values.item
                            : !values.referenceNo
                        }
                        style={{
                          marginTop: "30px",
                          transform: "translateX(95px)",
                        }}
                        className="btn btn-primary ml-2"
                        onClick={() => {
                          addRowDtoData(poItemsDDL, values);
                          setFieldValue("item", "");
                          if (singleData?.objHeaderDTO?.referenceTypeId === 3) {
                            setFieldValue("isAllItem", false);
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div style={{ paddingTop: "32px" }} className="col-lg">
                      {/* <b className="ml-1">Order Total : 0</b> */}
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
