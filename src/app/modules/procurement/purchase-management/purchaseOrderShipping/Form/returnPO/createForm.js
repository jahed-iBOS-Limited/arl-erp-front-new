import React, { useState} from "react";
import { Formik, Form, Field } from "formik";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import { confirmAlert } from "react-confirm-alert";
import {
  validationSchema,
  initData,
  getReturnPOInfoById,
  getRefNoDdlForReturnPo,
} from "./helper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// import { getPOItemDDLAction } from "../../_redux/Actions";
import RowDtoTable from "./rowDtoTable";
import { toast } from "react-toastify";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import TotalNetAmount from "../../TotalNetAmount";
import { getUniQueItems } from "../../helper";
import { getPOItemForReturnItemDDLAction, savePurchaseOrderForReturnStandardService } from "../../_redux/Actions";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import FormikError from "../../../../../_helper/_formikError";

export default function ReturnPOCreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
}) {
  const location = useLocation();
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
    poItemsDDL,
    profileData,
    selectedBusinessUnit,
  } = storeData;

  // add single item to row or add all item to row
  const addRowDtoData = (data, values) => {

    let poDataCheck = rowDto.filter(data => data?.referenceNo?.value !== values?.referenceNo?.value)
     if(poDataCheck.length > 0){
       return toast.warning("Not allowed to different PO")
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
          item: { ...item },
          desc: item?.label,
          selectedUom: { value: item?.uomId, label: item?.uomName },
          orderQty:0, //item?.restofQty >= item?.invReturnQty ?  item?.invReturnQty : item?.restofQty || 0,
          restofQty: item?.receiveQty || 0,
          refQty: item?.refQty,
          poQuantity:item?.poQty,
          invReturnQty: item?.returnQty || 0,
          basicPrice: item?.basePrice || 0,
          priceStructure:[], //priceStructure,
          netValue:0,
          vat:0,
          vatAmount:0,
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
          item: { ...values?.item },
          desc: values?.item?.label,
          selectedUom: {
            value: values?.item?.uomId,
            label: values?.item?.uomName,
          },
          orderQty:0, //values?.item?.restofQty >= values?.item?.invReturnQty ?  values?.item?.invReturnQty : values?.item?.restofQty || 0,
          restofQty: values?.item?.receiveQty || 0,
          refQty: values?.item?.refQty,
          invReturnQty: values?.item?.returnQty || 0,
          basicPrice: values?.item?.basePrice || 0,
          poQuantity:values?.item?.poQty,
          netValue:0 ,
          vat:0,
          vatAmount:0,
          priceStructure:[], //priceStructure,
        };
        setRowDto([...rowDto, newData]);
      }
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm.item?.value !== payload);

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
  // rowdto handler for catch data from row's input field in rowTable
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
   dispatch( getPOItemForReturnItemDDLAction(
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
      ))
  };

  // useEffect(() => {
  //   getRefNoDDL()
  // },[profileData?.accountId,selectedBusinessUnit?.value])

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlForReturnPo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.sbu?.value,
      location?.state?.purchaseOrg?.value,
      location?.state?.plant?.value,
      location?.state?.warehouse?.value,
      location?.state?.refType?.label,
      supplierId,
      setRefNoDDL
    );
  };

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };
   

  const saveHandler = async (values, rowDto, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // for asset , standard, service PO, subcontract PO, stock transfer, return PO
        // check atleast one row item quantity should be greater than 0
        // we will save only those field , where order qty is greater than 0
        const foundArr = rowDto?.filter((item) => item?.orderQty > 0);
        if (foundArr.length === 0) return toast.warn("Enter quantity");

        //check basic price is greater then 0
        //if(location?.state?.orderType?.value === 6){
          const foundBasicPrice = rowDto?.filter((item) => item?.orderQty > 0).filter((item) => item?.basicPrice === 0);
          if (foundBasicPrice.length > 0) return toast.warn("Basic price must be greater then 0");
       // }


        const objRowListDTO = foundArr?.map((item, index) => ({
          referenceId: +item?.referenceNo?.value || 0,
          referenceCode: item?.referenceNo?.label || "",
          referenceQty: +item?.item?.refQty || 0,
          itemId: +item?.item?.value || 0,
          itemName: item?.item?.itemName || "",
          uoMid: +item?.selectedUom?.value || 0,
          uoMname: item?.selectedUom?.label || "",
          controllingUnitId: +item?.controllingUnit?.value || 0,
          bomId: 0,
          controllingUnitName: item?.controllingUnit?.label || "",
          costCenterId: +item?.costCenter?.value || 0,
          costCenterName: item?.costCenter?.label || "",
          costElementId: +item?.costElement?.value || 0,
          costElementName: item?.costElement?.label || "",
          purchaseDescription: item?.desc || "",
          orderQty: +item?.orderQty || 0,
          basePrice: +item?.basicPrice || 0,
          finalPrice: +(item?.orderQty * item?.basicPrice) || 0,
          totalValue: +item?.netValue || 0,
          actionBy: +profileData?.userId || 0,
          lastActionDateTime: "2020-11-10T08:52:28.574Z",
          vatPercentage: +item?.vat || 0,
          vatAmount: +item?.vatAmount || 0,
          discount: 0,
          // objPriceRowListDTO:
          //   item?.priceStructure?.map((item2, index) => ({
          //     rowId: 0,
          //     priceStructureId: item2?.priceStructureId || 0,
          //     priceStructureName: item2?.priceStructureName || "",
          //     priceComponentId: item2?.priceComponentId || 0,
          //     priceComponentCode: item2?.priceComponentCode || "",
          //     priceComponentName: item2?.priceComponentName || "",
          //     valueType: item2?.valueType || "",
          //     value: +item2?.value || 0,
          //     amount: +item2?.amount || 0,
          //     baseComponentId: item2?.baseComponentId || 0,
          //     serialNo: item2?.serialNo || 0,
          //     sumFromSerial: item2?.sumFromSerial,
          //     sumToSerial: item2?.sumToSerial,
          //     mannual: item2?.mannual,
          //     factor: item2?.factor,
          //   })) || [],
        }));
        const payload = {
          objHeaderDTO: {
            // purchaseOrderNo: "string",
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value || 0,
            sbuId: +location?.state?.sbu?.value,
            plantId: +location?.state?.plant?.value,
            priceStructureId: 0,
            plantName: location?.state?.plant?.label,
            warehouseId: +location?.state?.warehouse?.value,
            warehouseName: location?.state?.warehouse?.label,
            supplyingWarehouseId: values?.supplyingWh?.value || 0,
            supplyingWarehouseName: values?.supplyingWh?.label || "",
            purchaseOrganizationId: +location?.state?.purchaseOrg?.value,
            businessPartnerId: +values?.supplierName?.value || 0,
            purchaseOrderDate: values?.orderDate || "2020-11-10T08:52:28.574Z",
            purchaseOrderTypeId: +location?.state?.orderType?.value,
            incotermsId: +values?.incoterms?.value || 0,
            currencyId: +values?.currency?.value || 0,
            // currencyCode: values?.currency?.label || "",
            supplierReference: values?.supplierReference || "",
            returnDate: values?.returnDate || "2020-12-06T09:35:19.200Z",
            referenceDate: values?.referenceDate || "2020-11-10T08:52:28.574Z",
            referenceTypeId: +location?.state?.refType?.value,
            paymentTerms: +values?.paymentTerms?.value || 0,
            creditPercent: 0,
            cashOrAdvancePercent: parseFloat(values?.cash) || 0,
            otherTerms: values?.otherTerms || "",
            poValidityDate: values?.validity || "2020-11-10T08:52:28.574Z",
            lastShipmentDate:
              values?.lastShipmentDate || "2020-11-10T08:52:28.574Z",
            paymentDaysAfterDelivery: +values.payDays || 0,
            deliveryAddress: values?.deliveryAddress || "",
            actionBy: +profileData?.userId,
            grossDiscount: values?.discount || 0,
            freight: values?.freight || 0,
            commission: values?.commision || 0
          },
          objRowListDTO,
        };
        dispatch(
          savePurchaseOrderForReturnStandardService({
            data: payload,
            cb,
            IConfirmModal,
          })
        );
    } else {
    }
  };



  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          setValues,
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
                        setFieldValue("supplierName", valueOption);
                        setFieldValue("item", "");
                        setFieldValue("referenceNo", "");                     
                        getRefNoDDL(valueOption?.value)
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
                        setFieldValue("supplierName", valueOption);
                        setFieldValue("item", "");
                        setFieldValue("referenceNo", "");                     
                        getRefNoDDL(valueOption?.value)
                        // // if user select without reference in landing
                        // if (location?.state?.refType?.value === 3) {
                        //   getItemDDL(valueOption?.value, 3, 0);
                        // }
                        // // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        // if (values?.referenceNo) {
                        //   getItemDDL(
                        //     values?.supplierName?.value,
                        //     location?.state?.refType?.value,
                        //     values?.referenceNo?.value
                        //   );
                        // }
                        // if user select without reference in landing
                        
                        // if (location?.state?.refType?.value === 3) {
                        //   getItemDDL(valueOption?.value, 3, 0);
                        // }
                        // // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        // if (values?.referenceNo) {
                        //   getItemDDL(
                        //     values?.supplierName?.value,
                        //     location?.state?.refType?.value,
                        //     values?.referenceNo?.value
                        //   );
                        // }
                        // // if user select PO reference in landing
                        // if (isPoReferenceSelected) {
                        //   getRefNoDDL_action(valueOption?.value)
                        // }
                       
                      }}
                      placeholder="Supplier Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-2">
                    <label>Return Date</label>
                    <InputField
                      value={values?.returnDate}
                      name="returnDate"
                      placeholder="Return Date"
                      type="date"
                      disabled={true}
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
                  <div className="col-lg-2">
                    <label>Delivery Address</label>
                    <InputField
                      value={values?.deliveryAddress}
                      disabled
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Order Date</label>
                    <InputField
                      value={values?.orderDate}
                      disabled
                      name="orderDate"
                      placeholder="Order Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Last Shipment Date</label>
                    <InputField
                      value={values?.lastShipmentDate}
                      disabled
                      name="lastShipmentDate"
                      placeholder="Last Shipment Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
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
                    <label>Pay Days (After Invoice)</label>
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
                </div>

                <div className="form-group row">
                  <div className="col-lg-2">
                    <ISelect
                      label="Reference No"
                      options={
                        //poReferenceNoDDL
                        refNoDDL
                      }
                      // options={isPoReferenceSelected ? refNoDDL : poReferenceNoDDL}
                      value={values.referenceNo}
                      isDisabled={
                        location.state?.refType?.value === 3
                         || !values?.supplierName
                      }
                      name="referenceNo"
                      dependencyFunc={(value, allValues, setFieldValue) => {
                        getReturnPOInfoById(value, setFieldValue);
                        setFieldValue("item", "");
                       // if (location?.state?.refType?.value) {
                          getItemDDL(
                            values?.supplierName?.value,
                            location?.state?.refType?.value,
                            value
                          );
                      //  }
                      }}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <ISelect
                      label="Item"
                      isDisabled={
                        location.state?.refType?.value === 3
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
                      type="submit"
                      disabled={
                        location.state?.refType?.value === 3
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
                        if (location.state?.refType?.value === 3) {
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
              </div>

              <TotalNetAmount rowDto={rowDto} />

              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={location?.state?.refType?.value !== 3}
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
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
