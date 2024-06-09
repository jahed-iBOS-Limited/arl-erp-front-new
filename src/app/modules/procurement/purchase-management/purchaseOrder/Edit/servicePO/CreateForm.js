/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema, initData, getProfitCenterList } from "./helper";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getPOItemForServiceItemDDLAction,
  getPOWihoutServiceItemDDLAction,
} from "../../_redux/Actions";
import {
  getCostCenterDDL,
  getControllingUnitDDL,
  getCostElementDDL,
  getCostElementDDLTwo,
} from "./helper";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import TotalNetAmount from "../../TotalNetAmount";
import { getRefNoDdlForServicePo } from "../../Form/servicePO/helper";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import axios from "axios";
import TextArea from "../../../../../_helper/TextArea";
import useAxiosGet from "../../customHooks/useAxiosGet";
import Loading from "../../../../../_helper/_loading";
import { toast } from "react-toastify";

export default function CreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  singleData,
  viewPage,
}) {
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [cuList, setCuList] = useState([]);
  const [costCenterList, setCostCenterList] = useState([]);
  const [costCenterListTwo, setCostCenterListTwo] = useState([]);
  const [costElementList, setCostElementList] = useState([]);
  const [costElementListTwo, setCostElementListTwo] = useState([]);
  const [refNoDDL, setRefNoDDL] = useState([]);
  const [profitCenterList, setProfitCenterList] = useState([]);
  const [profitCenterListTwo, setProfitCenterListTwo] = useState([]);
  const [loading, setLoading] = useState(false);

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

    if (
      arr?.length > 0 &&
      ![12, 17, 102, 117, 208].includes(selectedBusinessUnit?.value)
    ) {
      return toast.warn("Not allowed to duplicate items");
    } else {
      // const priceStructure = values?.item?.priceStructure?.map((item) => ({
      //   ...item,
      //   value: item?.value || 0,
      //   amount: item?.amount || 0,
      // }));

      const newData = {
        ...values,
        newItem: true,
        desc: values?.item?.label,
        selectedUom: {
          value: values?.item?.uoMId,
          label: values?.item?.uoMName,
        },
        orderQty: "",
        basicPrice: "",
        restofQty: values?.item?.restofQty,
        netValue: 0,
        vat: 0,
        userGivenVatAmount: "",
        vatAmount: 0,
        priceStructure: [], //priceStructure,
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

  useEffect(() => {
    getControllingUnitDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCuList
    );
    getCostCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      false,
      setCostCenterListTwo
    );
  }, [profileData, selectedBusinessUnit]);

  const getItemDDL = (supplierId, refType, referenceNo) => {
    if (singleData?.objHeaderDTO?.referenceTypeId === 3) {
      // if without ref is selected
      dispatch(
        getPOWihoutServiceItemDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          singleData?.objHeaderDTO?.purchaseOrganizationId,
          singleData?.objHeaderDTO?.plantId,
          singleData?.objHeaderDTO?.warehouseId,
          supplierId,
          refType,
          referenceNo
        )
      );
    } else {
      dispatch(
        getPOItemForServiceItemDDLAction(
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
    }
  };

  useEffect(() => {
    const newData = singleData?.objRowListDTO?.map((item, index) => {
      // const priceStructure = item?.priceStructure?.map((item) => ({
      //   ...item,
      //   value: item?.value || 0,
      //   amount: item?.amount || 0,
      // }));
      const transferObj = {
        costElement: {
          value: item?.costElementId,
          label: item?.costElementName,
        },
        costCenter: { value: item?.costCenterId, label: item?.costCenterName },
        profitCenter: {
          value: item?.profitCenterId,
          label: item?.profitCenterName,
        },
      };
      const withoutTransferObj = {
        costElementTwo: {
          value: item?.costElementId,
          label: item?.costElementName,
        },
        costCenterTwo: {
          value: item?.costCenterId,
          label: item?.costCenterName,
        },
        profitCenterTwo: {
          value: item?.profitCenterId,
          label: item?.profitCenterName,
        },
      };

      const isTransfer = transferBusinessUnitId && transferBusinessUnitName;

      let obj = {
        ...item,
        item: {
          label: item?.itemName,
          itemName: item?.itemName,
          value: item?.itemId,
          code: item?.itemCode,
          refQty: item?.referenceQty,
        },
        referenceNo: { value: item?.referenceId, label: item?.referenceCode },
        desc: item?.purchaseDescription || "",
        selectedUom: { label: item?.uomName, value: item?.uomId },
        orderQty: item?.orderQty,
        initOrderQty: item?.initOrderQty || item?.orderQty,
        basicPrice: item?.basePrice,
        refQty: item?.referenceQty,
        restofQty: item?.restofQty,
        netValue: item?.totalValue,
        priceStructure: [], //priceStructure,
        vat: item?.vatPercentage,
        userGivenVatAmount: item?.baseVatAmount || 0,
        vatAmount: item?.vatAmount,
      };
      const newObj = isTransfer
        ? { ...obj, ...transferObj }
        : { ...obj, ...withoutTransferObj };
      return newObj;
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
    supplierName,
    deliveryAddress,
    purchaseOrderDate,
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
    freight,
    grossDiscount,
    commission,
    othersCharge,
    supplierAddress,
    transferBusinessUnitName,
    transferBusinessUnitId,
    businessTransactionId,
    businessTransactionName,
    transferCostCenterId,
    transferCostCenterName,
    transferCostElementId,
    transferCostElementName,
    profitCenterId,
    profitCenterName,
  } = singleData?.objHeaderDTO;

  // getRefNoDdlBySupplier
  useEffect(() => {
    getRefNoDDL();
    getCostCenterDDL(
      profileData?.accountId,
      transferBusinessUnitId,
      transferBusinessUnitId && transferBusinessUnitName ? true : false,
      setCostCenterList
    );
    getCostElementDDLTwo(
      profileData?.accountId,
      transferBusinessUnitId,
      setCostElementList
    );
    getProfitCenterList(
      selectedBusinessUnit?.value,
      setProfitCenterListTwo,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlForServicePo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      singleData?.objHeaderDTO?.sbuId,
      singleData?.objHeaderDTO?.purchaseOrganizationId,
      singleData?.objHeaderDTO?.plantId,
      singleData?.objHeaderDTO?.warehouseId,
      singleData?.objHeaderDTO?.referenceTypeName,
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

  useEffect(() => {
    getTransferBu(
      `/procurement/PurchaseOrder/TransferPoBusinessUnit?UnitId=${selectedBusinessUnit?.value}`
    );
    getBuTransaction(
      `/fino/BusinessTransaction/BusinessTransactionList?GroupId=1&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, [selectedBusinessUnit]);

  const getIsDisabledAddBtn = (values) => {
    if (values.isTransfer) {
      if (
        !values?.controllingUnit ||
        !values?.item ||
        !values?.costElement ||
        !values?.costCenter ||
        !values?.profitCenter
      ) {
        return true;
      }
    } else {
      if (
        !values?.controllingUnit ||
        !values?.costElementTwo ||
        !values?.costCenterTwo ||
        !values?.profitCenterTwo ||
        !values?.item
      ) {
        return true;
      }
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          isTransfer:
            transferBusinessUnitId && transferBusinessUnitName ? true : "",
          transferBusinessUnit:
            transferBusinessUnitId && transferBusinessUnitName
              ? {
                  value: transferBusinessUnitId,
                  label: transferBusinessUnitName,
                }
              : "",
          businessTransaction:
            businessTransactionId && businessTransactionName
              ? {
                  value: businessTransactionId,
                  label: businessTransactionName,
                }
              : "",
          supplierName: {
            value: businessPartnerId,
            label: supplierName,
            supplierAddress,
          },
          deliveryAddress,
          orderDate: _dateFormatter(purchaseOrderDate),
          lastShipmentDate: _dateFormatter(lastShipmentDate),
          currency: { value: currencyId, label: currencyCode },
          paymentTerms: paymentTerms? { value: paymentTerms, label: paymentTermsName }: '',
          cash: cashOrAdvancePercent,
          payDays: paymentDaysAfterDelivery,
          incoterms: incotermsId? { value: incotermsId, label: incotermsName }: '',
          supplierReference,
          referenceDate: _dateFormatter(referenceDate),
          validity: _dateFormatter(validityDate),
          otherTerms,
          referenceNo: "",
          item: "",
          controllingUnit: "",
          profitCenter:
            profitCenterId && profitCenterName
              ? {
                  value: profitCenterId,
                  label: profitCenterName,
                }
              : "",
          costCenter: {
            value: transferCostCenterId,
            label: transferCostCenterName,
          },
          costElement: {
            value: transferCostElementId,
            label: transferCostElementName,
          },
          costCenterTwo: "",
          costElementTwo: "",
          commission: commission,
          freight: freight,
          grossDiscount: grossDiscount,
          othersCharge,
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
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            {console.log(values)}
            {console.log(errors)}
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
                    {/* <NewSelect
                      name="supplierName"
                      options={supplierNameDDL}
                      value={values?.supplierName}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                        setFieldValue("item", "");
                        // if user select without reference in landing
                        if (singleData?.objHeaderDTO?.referenceTypeId === 3) {
                          // getItemDDL(valueOption?.value, 3, 0);
                          dispatch(
                            getPOWihoutServiceItemDDLAction(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              singleData?.objHeaderDTO?.purchaseOrganizationId,
                              singleData?.objHeaderDTO?.plantId,
                              singleData?.objHeaderDTO?.warehouseId,
                              valueOption?.value,
                              3,
                              0
                            )
                          );
                        }
                        // if user has reference, we call this action based on supplier selection and also based on reference selection in reference dd
                      }}
                      placeholder="Supplier Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={viewPage}
                    /> */}
                    <label>Supplier Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.supplierName}
                      handleChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption || "");
                        // setFieldValue("item", "");
                        // setFieldValue("referenceNo", "");
                      }}
                      loadOptions={(v) => {
                        if (v.length < 3) return [];
                        return axios
                          .get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${singleData?.objHeaderDTO?.sbuId}`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                            }));
                            return updateList;
                          });
                      }}
                    />
                    <FormikError
                      errors={errors}
                      name="supplierName"
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Delivery Address</label>
                    <InputField
                      value={values?.deliveryAddress}
                      name="deliveryAddress"
                      placeholder="Delivery Address"
                      type="text"
                      disabled={viewPage}
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
                      disabled={viewPage}
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
                      isDisabled={viewPage}
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
                      isDisabled={viewPage}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Cash/Advance(%)</label>
                    <InputField
                      value={values?.cash}
                      name="cash"
                      disabled={
                        viewPage || values?.paymentTerms?.label === "Credit"
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
                      disabled={viewPage}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="incoterms"
                      options={incoTermsDDL}
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
                      placeholder="Supplier Reference"
                      type="text"
                      disabled={viewPage}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Reference Date</label>
                    <InputField
                      value={values?.referenceDate}
                      name="referenceDate"
                      placeholder="Reference Date"
                      type="date"
                      disabled={viewPage}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Validity</label>
                    <InputField
                      value={values?.validity}
                      name="validity"
                      placeholder="Validity"
                      type="date"
                      disabled={viewPage}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <label>Other Terms</label>
                    <InputField
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      type="text"
                      disabled={viewPage}
                    />
                  </div> */}

                  <div className="col-lg-2">
                    <label>Freight/Transport</label>
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
                  <div className="col-lg-2">
                    <label>Others Charge</label>
                    <InputField
                      value={values?.othersCharge}
                      name="othersCharge"
                      type="number"
                      placeholder="Others Charge"
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    {values?.supplierName?.label && (
                      <div style={{ color: "blue", marginTop: "23px" }}>
                        <b>Supplier : {values?.supplierName?.label} , </b>
                        <b>
                          Supplier Address :{" "}
                          {values?.supplierName?.supplierAddress}
                        </b>
                      </div>
                    )}
                  </div> */}
                  <div className={values.isTransfer ? "col-lg-4" : "col-lg-6"}>
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
                          setRowDto([]);
                          setFieldValue("transferBusinessUnit", "");
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
                          setFieldValue("profitCenterTwo", "");
                          setFieldValue("costCenterTwo", "");
                          setFieldValue("costElementTwo", "");
                        }}
                      />
                    </div>
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
                            setFieldValue("transferBusinessUnit", valueOption);
                            if (valueOption) {
                              getCostCenterDDL(
                                profileData?.accountId,
                                valueOption?.value,
                                values?.isTransfer,
                                setCostCenterList
                              );
                              getCostElementDDLTwo(
                                profileData?.accountId,
                                valueOption?.value,
                                setCostElementList
                              );
                              getProfitCenterList(
                                valueOption?.value,
                                setProfitCenterList,
                                setLoading
                              );
                            }
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
                            setFieldValue("costCenter", valueOption);
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

                {/* End Header part */}

                {/* Start row part */}
                {!viewPage && (
                  <div className="row mt-2">
                    <div className="col-lg-2">
                      <NewSelect
                        name="controllingUnit"
                        options={cuList}
                        value={values?.controllingUnit}
                        onChange={(valueOption) => {
                          setFieldValue("controllingUnit", valueOption);
                          getCostElementDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setCostElementListTwo
                          );
                          setFieldValue("costElement", "");
                        }}
                        label="Controlling Unit"
                        placeholder="Controlling Unit"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.isTransfer ? (
                      ""
                    ) : (
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
                            name="costElementTwo"
                            options={costElementListTwo}
                            value={values?.costElementTwo}
                            isDisabled={!values?.controllingUnit}
                            onChange={(valueOption) => {
                              setFieldValue("costElementTwo", valueOption);
                            }}
                            label="Cost Element"
                            placeholder="Cost Element"
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
                              setFieldValue("costCenterTwo", valueOption);
                            }}
                            label="Cost Center"
                            placeholder="Cost Center"
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
                    {singleData?.objHeaderDTO?.referenceTypeId === 3 ? (
                      <div className="col-lg-2">
                        <label>Item</label>
                        <SearchAsyncSelect
                          selectedValue={values.item}
                          handleChange={(valueOption) => {
                            setFieldValue("item", valueOption);
                          }}
                          loadOptions={(v) => {
                            return axios
                              .get(
                                `/procurement/PurchaseOrderItemDDL/ServicePurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${
                                  singleData?.objHeaderDTO?.purchaseOrderTypeId
                                }&AccountId=${
                                  profileData?.accountId
                                }&BusinessUnitId=${
                                  selectedBusinessUnit?.value
                                }&SbuId=${
                                  singleData?.objHeaderDTO?.sbuId
                                }&PurchaseOrgId=${
                                  singleData?.objHeaderDTO
                                    ?.purchaseOrganizationId
                                }&PlantId=${
                                  singleData?.objHeaderDTO?.plantId
                                }&WearhouseId=${
                                  singleData?.objHeaderDTO?.warehouseId
                                }&RefTypeId=${
                                  singleData?.objHeaderDTO?.referenceTypeId
                                }&RefNoId=${0}&searchTerm=${v}`
                              )
                              .then((res) => {
                                const updateList = res?.data.map((item) => ({
                                  ...item,
                                }));
                                return updateList;
                              });
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="item"
                          touched={touched}
                        />
                      </div>
                    ) : (
                      <div className="col-lg-2">
                        <NewSelect
                          name="item"
                          // options={poItemsDDL || []}
                          // load service if wihtout ref selected
                          options={poItemsDDL}
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
                      </div>
                    )}

                    <div className="col-lg-2">
                      <div
                        style={{ marginTop: "14px" }}
                        className="d-flex align-items-center"
                      >
                        <button
                          onClick={() => {
                            addRowDtoData(values);
                          }}
                          disabled={getIsDisabledAddBtn(values)}
                          className="btn btn-primary"
                          type="button"
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
