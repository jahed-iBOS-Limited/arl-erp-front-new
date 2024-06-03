/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import TextArea from "../../../../../_helper/TextArea";
import { IInput } from "../../../../../_helper/_input";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import TotalNetAmount from "../../TotalNetAmount";
import { getPOItemForStandradItemDDLAction } from "../../_redux/Actions";
import useAxiosGet from "../../customHooks/useAxiosGet";
import { getUniQueItems, lastPriceFunc } from "../../helper";
import { rowDtoDynamicHandler } from "../../utils";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import { excelFileToArray } from "./excelToArrayConvert";
import {
  getRefNoDdlForStandradPo,
  initData,
  setInputFieldsFunc,
  validationSchema,
} from "./helper";
import RowDtoTable from "./rowDtoTable";

// This form is also used for standard PO

export default function AssetStandardPOCreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
}) {
  const [inputFields, setInputFields] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [refNoDDL, setRefNoDDL] = useState([]);
  const [itemId, setItemId] = useState("");
  const [loading] = useState(false);
  const [
    transferUnitSupplierDDL,
    getTransferUnitSupplierDDL,
    ,
    setTransferUnitSupplierDDL,
  ] = useAxiosGet();

  const [isExcelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFiles, setExcelFiles] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  //const [excelDataForAmount, setExcelDataForAmount] = useState([]);


  // redux store data
  const storeData = useSelector((state) => {
    return {
      supplierNameDDL: state.purchaseOrder.supplierNameDDL,
      currencyDDL: state.purchaseOrder.currencyDDL,
      paymentTermsDDL: state.purchaseOrder.paymentTermsDDL,
      incoTermsDDL: state.purchaseOrder.incoTermsDDL,
      poReferenceNoDDL: state.purchaseOrder.poReferenceNoDDL,
      poItemsDDL: state.purchaseOrder.poItemsDDL,
      // uomDDL: state.commonDDL.uomDDL,
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  }, shallowEqual);

  const {
    supplierNameDDL,
    currencyDDL,
    paymentTermsDDL,
    incoTermsDDL,
    poItemsDDL,
    // uomDDL,
    profileData,
    selectedBusinessUnit,
  } = storeData;

  useEffect(() => {
    // all input fields : this function will set our all input fields  , then we will use loop to generate input fields in UI
    setInputFieldsFunc(setInputFields, storeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierNameDDL, currencyDDL, paymentTermsDDL, incoTermsDDL]);

  // add single item to row or add all item to row
  const addRowDtoData = (data, values) => {
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
          //desc: item?.description || "",
          desc: item?.quotationEntryRemarks === "" ? item?.description : item?.quotationEntryRemarks,
          selectedUom: { value: item?.uoMId, label: item?.uoMName },
          refQty: item?.refQty,
          orderQty: 0,
          restofQty: item?.restofQty || 0,
          netValue: 0,
          priceStructureTotal: 0,
          priceStructure: [], //priceStructure,
          // location?.state?.refType?.value === 1 => purchase contract
          negotiationRate: item?.negotiationRate,
          basicPrice: item?.basePrice || 0,
          discountPercentage: item?.discountPercentage || 0,
          lastPrice: lastPriceFunc(item?.lastPoInfo) || 0,
          vat: 0,
          userGivenVatAmount: "",
          vatAmount: 0,
          itemCategoryId: item?.itemCategoryId,
          partNo: item?.partNo,
          drawingNo: item?.drawingNo,
          shippingItemSubHead: item?.shippingItemSubHead,
        };
        return obj;
      });
      const modData = [...newData, ...rowDto]
        const sortedItems = modData?.sort((a, b) => {
          const subHeadA = a?.shippingItemSubHead || ''; 
          const subHeadB = b?.shippingItemSubHead || ''; 
          return subHeadA.localeCompare(subHeadB);
      });
      setRowDto(sortedItems);
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
          desc: values?.item?.quotationEntryRemarks === "" ? values?.item?.description : values?.item?.quotationEntryRemarks || "",
          selectedUom: {
            value: values?.item?.uoMId,
            label: values?.item?.uoMName,
          },
          orderQty: 0,
          refQty: values?.item?.refQty,
          restofQty: values?.item?.restofQty || 0,
          netValue: 0,
          priceStructureTotal: 0,
          priceStructure: [], //priceStructure,
          vat: 0,
          userGivenVatAmount: "",
          vatAmount: 0,
          // location?.state?.refType?.value === 1 => purchase contract
          basicPrice: values?.item?.basePrice || 0,
          discountPercentage: values?.item?.discountPercentage || 0,
          negotiationRate: values?.item?.negotiationRate,
          lastPrice: lastPriceFunc(values?.item?.lastPoInfo) || 0,
          itemCategoryId: values?.item?.itemCategoryId,
          partNo: values?.item?.partNo,
          drawingNo: values?.item?.drawingNo,
          shippingItemSubHead: values?.item?.shippingItemSubHead,
        };
        const modData = [...rowDto, newData]
        const sortedItems = modData?.sort((a, b) => {
          const subHeadA = a?.shippingItemSubHead || ''; 
          const subHeadB = b?.shippingItemSubHead || ''; 
          return subHeadA.localeCompare(subHeadB);
      });
        setRowDto(sortedItems);
      }
    }
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
    const modData = [...filterArr]
    const sortedItems = modData?.sort((a, b) => {
      const subHeadA = a?.shippingItemSubHead || ''; 
      const subHeadB = b?.shippingItemSubHead || ''; 
      return subHeadA.localeCompare(subHeadB);
  });
    setRowDto(sortedItems);
  };

  const getItemDDL = (supplierId, refType, referenceNo) => {
    dispatch(
      getPOItemForStandradItemDDLAction(
        //location?.state?.orderType?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.sbu?.value,
        supplierId,
        refType,
        referenceNo
      )
    );
  };

  useEffect(() => {
    if (location?.state?.refType?.value !== 3) {
      getRefNoDDL();
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // getRefNoDdlBySupplier
  const getRefNoDDL = () => {
    getRefNoDdlForStandradPo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.sbu?.value,
      0,
      location?.state?.refType?.value,
      location?.state?.purchaseOrg?.value,
      location?.state?.plant?.value,
      location?.state?.warehouse?.value,
      setRefNoDDL
    );
  };

  const [transferBu, getTransferBu] = useAxiosGet();
  const [, getBuTransaction] = useAxiosGet();

  // const businessTransactionDDL = useMemo(() => {
  //   if (buTransaction?.length > 0) {
  //     let data = buTransaction.map((item) => ({
  //       ...item,
  //       value: item?.businessTransactionId,
  //       label: item?.businessTransactionName,
  //     }));
  //     return data;
  //   }
  // }, [buTransaction]);

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

  const basicAmountFromExcelToUI = (excelDataForAmount) => {
    excelDataForAmount.forEach((excelElement, excelIndex) => {
      rowDto.forEach((rowElement, rowIndex) => {
        if (excelElement?.Item.trim().toLowerCase() === rowElement?.item?.itemName.trim().toLowerCase()) {
          rowDtoDynamicHandler(
            "basicPrice",
            excelElement?.Price || 0,
            rowIndex,
            rowDto,
            setRowDto
          );
        }
      })
    });
  }

  //   const getPercentageValue = (item) =>{
  //     if(!item?.numDiscountPercentage){
  //        return 0;
  //     }
  //     return Number(((item?.numDiscountPercentage / 100) * item?.numTotalSumValue).toFixed(2)) || 0; 
  //  }

  const getRunTimeGrossDiscount = (discountData) => {

    if (!discountData) {
      return 0;
    }

    const totalBasic = discountData.reduce((acc, cur) => acc + +cur?.netValue, 0)
    const discount = (totalBasic * discountData[0]?.discountPercentage) / 100
    return Number((discount || 0).toFixed(2))
  }

  useEffect(() => {
    getTransferBu(
      `/procurement/PurchaseOrder/TransferPoBusinessUnit_reverse?UnitId=${selectedBusinessUnit?.value}`
    );
    getBuTransaction(
      `/fino/BusinessTransaction/BusinessTransactionList?GroupId=1&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, [selectedBusinessUnit]);

  const totalValueWithoutDiscountAndVat = rowDto?.reduce((acc,cur)=>acc+cur?.netValue,0)
  console.log("totalValueWithoutDiscoutnAndVat",totalValueWithoutDiscountAndVat);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          deliveryAddress: location?.state?.warehouse?.address,
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
                        if (location?.state?.refType?.value === 4) {
                          getRefNoDdlForStandradPo(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            location?.state?.sbu?.value,
                            valueOption?.value,
                            location?.state?.refType?.value,
                            location?.state?.purchaseOrg?.value,
                            location?.state?.plant?.value,
                            location?.state?.warehouse?.value,
                            setRefNoDDL
                          );
                        }
                        setRowDto([])
                        setFieldValue("referenceNo", "")
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
                    <ISelect
                      label="Supplier Name"
                      options={supplierNameDDL || []}
                      value={values?.supplierName}
                      dependencyFunc={(currentValue, _, __, supplierName) => {
                        setFieldValue("item", "");
                        setFieldValue("referenceNo", "");
                        // if user select without reference in landing
                        // if (location?.state?.refType?.value === 3) {
                        //   getItemDDL(currentValue, 3, 0);
                        // }
                        // // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        // if (values?.referenceNo) {
                        //   getItemDDL(
                        //     currentValue,
                        //     location?.state?.refType?.value,
                        //     values?.referenceNo?.value
                        //   );
                        // }
                        // // if user select purchase request in landing
                        // if (isPurchaseRequestSelected) {
                        //   getRefNoDDL(currentValue);
                        // }
                      }}
                      name="supplierName"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {inputFields?.map((item, index) =>
                    item.type === 1 ? (
                      <div key={index} className="col-lg-2">
                        <ISelect
                          label={item.label}
                          options={item.options}
                          defaultValue={values[item.name]}
                          name={item.name}
                          isDisabled={
                            item?.name === "incoterms" &&
                              location?.state?.purchaseOrg?.label ===
                              "Foreign Procurement"
                              ? false
                              : item?.disabled
                          }
                          dependencyFunc={item?.dependencyFunc}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : item.type === 2 ? (
                      <div key={index} className="col-lg-2">
                        <IInput
                          value={values[item.name]}
                          label={item.label}
                          name={item.name}
                          step="any"
                          min={item.isNum ? "0" : ""}
                          disabled={
                            item?.name === "cash" &&
                            values?.paymentTerms?.label === "Credit"
                          }
                          type={item.isNum ? "number" : "text"}
                        />
                      </div>
                    ) : (
                      item.type === 3 && (
                        <div key={index} className="col-lg-2">
                          <IInput
                            value={values[item.name]}
                            label={item.label}
                            type="date"
                            name={item.name}
                            disabled={isEdit || item?.disabled}
                          />
                        </div>
                      )
                    )
                  )}
                  <div className="col-lg-2">
                    <IInput
                      value={values.freight}
                      label="Freight/Transport"
                      name={"freight"}
                      type={"number"}
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setFieldValue("freight", e.target.value);
                        } else {
                          setFieldValue("freight", "");
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values?.othersCharge}
                      label="Others Charge"
                      name="othersCharge"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setFieldValue("othersCharge", e.target.value);
                        } else {
                          setFieldValue("othersCharge", "");
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values.discount}
                      label={location?.state?.refType?.value === 4 ? `Gross Discount (${values?.referenceNo?.numDiscountPercentage ? values?.referenceNo?.numDiscountPercentage : ""}%)` : "Gross Discount"}
                      name={"discount"}
                      type={"number"}
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setFieldValue("discount", e.target.value);
                          setFieldValue("discountPercent", ((e.target?.value /totalValueWithoutDiscountAndVat) * 100).toFixed(2));
                        } else {
                          setFieldValue("discount", "");
                        }
                      }}
                      disabled={!totalValueWithoutDiscountAndVat}
                    />
                  </div>
                  <div className="col-lg-2">
                  <IInput
                      value={values.discountPercent}
                      label={"Gross Discount Percent %"}
                      name={"discountPercent"}
                      type={"number"}
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setFieldValue("discountPercent", e.target.value);
                          setFieldValue("discount", (totalValueWithoutDiscountAndVat *e.target?.value) / 100);

                        } else {
                          setFieldValue("discountPercent", "");
                        }
                      }}
                      disabled={!totalValueWithoutDiscountAndVat}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <IInput
                      value={values.commision}
                      label={"Commission"}
                      name={"commision"}
                      type={"number"}
                    />
                  </div> */}

                  <div className="col-lg-2">
                    <IInput
                      value={values?.leadTimeDays}
                      label="Lead Time (Days)"
                      name="leadTimeDays"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values?.originOfSparesShip}
                      label="Terms"
                      name="originOfSparesShip"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values?.descriptionShip}
                      label="Description"
                      name="descriptionShip"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values?.supplyLocationShip}
                      label="Supply Location"
                      name="supplyLocationShip"
                      type="text"
                    />
                  </div>
                  {values?.currency?.value === 141 &&
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
                          disabled={values?.currency?.value === 141}
                          onChange={(e) => {
                            setFieldValue("isTransfer", e.target.checked);
                            setFieldValue("transferBusinessUnit", "");
                            setFieldValue("costCenter", "");
                            setFieldValue("costElement", "");
                          }}
                        />
                      </div>
                    </div>
                  }

                  <div className={values.isTransfer ? "col-lg-6" : "col-lg-12"}>
                    {/* <IInput
                      value={values?.otherTerms}
                      label="Other Terms"
                      name="otherTerms"
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
                  {values.isTransfer && (
                    <>
                      <div className="col-lg-2">
                        <NewSelect
                          label="Transfer Business unit"
                          options={businessUnitDDL}
                          value={values?.transferBusinessUnit}
                          name="transferBusinessUnit"
                          isDisabled={!values?.isTransfer}
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue(
                                "transferBusinessUnit",
                                valueOption
                              );
                              getTransferUnitSupplierDDL(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${valueOption?.value}&SBUId=0`
                              );
                            } else {
                              setFieldValue("transferBusinessUnit", "");
                              setFieldValue("transferBusinessUnitSupplier", "");
                              setTransferUnitSupplierDDL([]);
                            }
                            // if (valueOption) {
                            //   getCostCenterDDL(
                            //     profileData?.accountId,
                            //     valueOption?.value,
                            //     values?.isTransfer,
                            //     setCostCenterList
                            //   );
                            //   getCostElementDDL(
                            //     profileData?.accountId,
                            //     valueOption?.value,
                            //     values?.isTransfer,
                            //     setCostElementList
                            //   );
                            //   getProfitCenterList(
                            //     valueOption?.value,
                            //     setProfitCenterList,
                            //     setLoading
                            //   );
                            // }
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          label="Transfer Business Unit Supplier"
                          options={transferUnitSupplierDDL || []}
                          value={values?.transferBusinessUnitSupplier}
                          name="transferBusinessUnitSupplier"
                          isDisabled={!values?.isTransfer}
                          onChange={(valueOption) => {
                            setFieldValue(
                              "transferBusinessUnitSupplier",
                              valueOption
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      {/* <div className="col-lg-2">
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
                      </div> */}
                      {/* <div className="col-lg-2">
                        <NewSelect
                          name="costCenter"
                          options={costCenterList}
                          value={values?.costCenter}
                          onChange={(valueOption) => {
                            setFieldValue("costCenter", valueOption);
                          }}
                          label="Cost Center"
                          placeholder="Cost Center"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.isTransfer}
                        />
                      </div> */}
                      {/* <div className="col-lg-2">
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
                      </div> */}
                    </>
                  )}
                  {/* <div className="col-lg-2">
                    <ISelect
                      label="Business Transaction"
                      options={businessTransactionDDL}
                      value={values?.businessTransaction}
                      name="businessTransaction"
                      isDisabled={!values?.isTransfer}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                </div>
                {/* {values?.supplierName?.label && (
                  <div style={{ marginTop: "-25px", color: "blue" }}>
                    <b>Supplier : {values?.supplierName?.label} , </b>
                    <b>
                      Supplier Address : {values?.supplierName?.supplierAddress}
                    </b>
                  </div>
                )} */}
                <div className="form-group row">
                  <div className="col-lg-2">
                    <ISelect
                      label="Reference No"
                      options={refNoDDL}
                      value={values?.referenceNo}
                      isDisabled={
                        location.state?.refType?.value === 3
                        // || !values?.supplierName
                      }
                      name="referenceNo"
                      dependencyFunc={(value, allValues, setFieldValue, label, valueOption) => {
                        if (valueOption) {
                          setRowDto([])
                          setFieldValue("item", "");
                          if (location?.state?.refType?.value) {
                            getItemDDL(
                              values?.supplierName?.value,
                              location?.state?.refType?.value,
                              value
                            );
                          }
                          if (location?.state?.refType?.value === 4) {
                            setFieldValue("othersCharge", valueOption?.numOthersCost)
                            setFieldValue("freight", valueOption?.numTransportCost)
                            //setFieldValue("discount", getPercentageValue(valueOption))
                          }
                        } else {
                          setRowDto([])
                          setFieldValue("item", "");
                          setFieldValue("othersCharge", "")
                          setFieldValue("freight", "")
                          //setFieldValue("discount", getPercentageValue(valueOption))
                        }
                      }}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {location.state?.refType?.value === 3 ? (
                    <div className="col-lg-4">
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
                              `/procurement/PurchaseOrderItemDDL/StandardPurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${location?.state?.orderType?.value
                              }&AccountId=${profileData?.accountId
                              }&BusinessUnitId=${selectedBusinessUnit?.value
                              }&SbuId=${location?.state?.sbu?.value
                              }&PurchaseOrgId=${location?.state?.purchaseOrg?.value
                              }&PlantId=${location?.state?.plant?.value
                              }&WearhouseId=${location?.state?.warehouse?.value
                              }&RefTypeId=${location?.state?.refType?.value
                              }&RefNoId=${0}&searchTerm=${v}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                              }));
                              return updateList;
                            });
                        }}
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
                      <ISelect
                        label="Item"
                        isDisabled={
                          location.state?.refType?.value === 3
                            ? values.isAllItem
                            : !values.referenceNo || values.isAllItem
                        }
                        options={poItemsDDL}
                        value={values.item}
                        dependencyFunc={(id) => {
                          setItemId(id);
                        }}
                        name="item"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}

                  {location?.state?.refType?.value !== 3 && (
                    <div className="col-lg-1">
                      <Field
                        name={values.isAllItem}
                        component={() => (
                          <input
                            id="poIsAllItem"
                            type="checkbox"
                            style={{ marginTop: "25px" }}
                            className="mx-2"
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
                          top: "20px",
                        }}
                      >
                        All Item
                      </label>
                    </div>
                  )}

                  <div className="col-lg-1">
                    <button
                      type="button"
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
                        marginTop: "20px",
                        marginLeft:
                          location?.state?.refType?.value === 3
                            ? "0px"
                            : "-20px",
                      }}
                      className="btn btn-primary"
                      onClick={() => {
                        addRowDtoData(poItemsDDL, values);
                        if (location.state?.refType?.value === 3) {
                          setFieldValue("isAllItem", false);
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {rowDto?.length > 0 &&
                    <>
                      <div className="col-lg-1">
                        <button
                          style={{ marginTop: "18px" }}
                          className="btn btn-primary mr-2 d-flex align-items-center"
                          type="button"
                          onClick={() => setExcelModalOpen(true)}
                        >
                          Upload
                          <i className="fa fa-upload ml-2"></i>
                        </button>
                      </div>
                    </>
                  }
                  <div
                    style={{ transform: "translateY(23px)" }}
                    className="col-lg"
                  >
                    <TotalNetAmount totalValueWithoutDiscountAndVat={totalValueWithoutDiscountAndVat} rowDto={rowDto} values={values} />
                  </div>
                </div>
              </div>

              {/* Attachment Modal */}
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={[
                  ".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                ]}
                fileObjects={excelFiles}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={100000000000000}
                open={isExcelModalOpen}
                onAdd={(newFileObjs) => {
                  setExcelFiles([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = excelFiles.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setExcelFiles(newData);
                }}
                onClose={() => setExcelModalOpen(false)}
                onSave={async () => {
                  setExcelModalOpen(false);
                  setDisabled(true);
                  const data = await excelFileToArray(
                    excelFiles[0].file,
                    excelFiles[0].name
                  );
                  //setExcelDataForAmount(data);
                  setExcelFiles([]);
                  basicAmountFromExcelToUI(data);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={location?.state?.refType?.value !== 3}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                porefType={location?.state?.refType?.value}
                // uomDDL={uomDDL}               
                values={values}
                //basicAmountFromExcelToUI={basicAmountFromExcelToUI}
                selectedBusinessUnit={selectedBusinessUnit}
                profileData={profileData}
                itemId={itemId}
                setItemId={setItemId}
                getRunTimeGrossDiscount={getRunTimeGrossDiscount}
                setFieldValue={setFieldValue}
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
