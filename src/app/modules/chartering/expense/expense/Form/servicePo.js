import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useLocation } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { initData, lastPriceFunc, validationSchemaForPo } from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import TextArea from "../../../../_helper/TextArea";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import { ISelect } from "../../../../_helper/_inputDropDown";
import {
  getControllingUnitDDL,
  getCostCenterDDL,
  getProfitCenterList,
} from "../../../../procurement/purchase-management/purchaseOrder/Edit/servicePO/helper";
import {
  getCurrencyDDLAction,
  getPaymentTermsListDDLAction,
  getPlantListDDLAction,
  getPOItemForServiceItemDDLAction,
  getWareHouseDDLAction,
  savePurchaseOrderForAssetStandardService,
} from "../../../../procurement/purchase-management/purchaseOrder/_redux/Actions";
import {
  getCostElementDDL,
  getRefNoDdlForServicePo,
} from "../../../../procurement/purchase-management/purchaseOrder/Form/servicePO/helper";
import Loading from "../../../../_helper/_loading";
import TotalNetAmount from "../../../../procurement/purchase-management/purchaseOrder/TotalNetAmount";
import RowDtoTable from "./rowDtoTable";
import IForm from "../../../../_helper/_form";
import { confirmAlert } from "react-confirm-alert";
import { useHistory } from "react-router-dom";
import {
  getPurchaseOrgDDLAction,
  getSbuDDLAction,
  getUomDDLAction,
} from "../../../../_helper/_redux/Actions";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { imarineBaseUrl } from "../../../../../App";

export default function ServicePO({
  setIsShowPoModal,
  isShowPoModal,
  setSingleData,
  singleData,
}) {
  const {
    profileData: { accountId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
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
  const [attachmentList, setAttachmentList] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const history = useHistory();
  const [, postUpdateExpense, loadingUpdateExpense] = useAxiosPost();
  const [
    transferUnitSupplierDDL,
    getTransferUnitSupplierDDL,
    ,
    setTransferUnitSupplierDDL,
  ] = useAxiosGet();

  useEffect(() => {
    dispatch(getSbuDDLAction(accountId, buId));
    dispatch(getPurchaseOrgDDLAction(accountId, buId));
    dispatch(getPlantListDDLAction(profileData?.userId, accountId, buId));
  }, [profileData, buId]);
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
    };
  }, shallowEqual);

  const {
    currencyDDL,
    paymentTermsDDL,
    incoTermsDDL,
    poItemsDDL,
    uomDDL,
    profileData,
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
    if (arr?.length > 0 && ![12, 17, 102, 117, 208].includes(buId)) {
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
    getControllingUnitDDL(accountId, buId, setCuList);
    getCostCenterDDL(accountId, buId, null, setCostCenterListTwo);

    getProfitCenterList(buId, setProfitCenterListTwo, setLoading);
    dispatch(getUomDDLAction(accountId, buId));
  }, [profileData, buId]);

  const getItemDDL = (values, supplierId, refType, referenceNo) => {
    dispatch(
      getPOItemForServiceItemDDLAction(
        5,
        accountId,
        buId,
        buId,
        values?.purchaseOrg?.value,
        values?.plant?.value,
        values?.warehouse?.value,
        supplierId,
        refType,
        referenceNo
      )
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
      `/procurement/PurchaseOrder/TransferPoBusinessUnit_reverse?UnitId=${buId}`
    );
    dispatch(getPaymentTermsListDDLAction());
  }, [buId]);
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
    if (values && accountId && buId) {
      // for asset , standard, service PO, subcontract PO, stock transfer, return PO

      // check atleast one row item quantity should be greater than 0
      // we will save only those field , where order qty is greater than 0
      const foundArr = rowDto?.filter((item) => item?.orderQty > 0);
      if (foundArr.length === 0) return toast.warn("Enter quantity");

      //check basic price is greater then 0
      //if(location?.state?.orderType?.value === 6){
      const foundBasicPrice = rowDto
        ?.filter((item) => item?.orderQty > 0)
        .filter((item) => item?.basicPrice === 0);
      if (foundBasicPrice.length > 0)
        return toast.warn("Basic price must be greater then 0");
      // }

      setDisabled(true);

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
        costCenterId: values?.isTransfer
          ? +item?.costCenter?.value || 0
          : +item?.costCenterTwo?.value || 0,
        costCenterName: values?.isTransfer
          ? item?.costCenter?.label
          : item?.costCenterTwo?.label || "",
        costElementId: values?.isTransfer
          ? +item?.costElement?.value || 0
          : +item?.costElementTwo?.value || 0,
        costElementName: values?.isTransfer
          ? item?.costElement?.label
          : item?.costElementTwo?.label || "",
        purchaseDescription: item?.desc || "",
        orderQty: +item?.orderQty || 0,
        basePrice: +item?.basicPrice || 0,
        finalPrice: +(item?.orderQty * item?.basicPrice) || 0,
        totalValue: +item?.netValue || 0,
        actionBy: +profileData?.userId || 0,
        lastActionDateTime: "2020-11-10T08:52:28.574Z",
        vatPercentage: +item?.vat || 0,
        vatAmount: +item?.vatAmount || 0,
        baseVatAmount: +item?.userGivenVatAmount || 0,
        discount: 0,
        profitCenterId: values?.isTransfer
          ? item?.profitCenter?.value || 0
          : item?.profitCenterTwo?.value || 0,
      }));
      const payload = {
        objHeaderDTO: {
          // purchaseOrderNo: "string",
          accountId: +accountId,
          businessUnitId: +buId || 0,
          sbuId: +sbuDDL[0]?.value,
          plantId: +values?.plant?.value,
          priceStructureId: 0,
          plantName: values?.plant?.label,
          warehouseId: +values?.warehouse?.value,
          warehouseName: values?.warehouse?.label,
          supplyingWarehouseId: values?.supplyingWh?.value || 0,
          supplyingWarehouseName: values?.supplyingWh?.label || "",
          purchaseOrganizationId: +values?.purchaseOrg?.value,
          businessPartnerId: +values?.supplierName?.value || 0,
          purchaseOrderDate: values?.orderDate || "2020-11-10T08:52:28.574Z",
          purchaseOrderTypeId: 5,
          incotermsId: +values?.incoterms?.value || 0,
          currencyId: +values?.currency?.value || 0,
          // currencyCode: values?.currency?.label || "",
          supplierReference: values?.supplierReference || "",
          returnDate: values?.returnDate || "2020-12-06T09:35:19.200Z",
          referenceDate: values?.referenceDate || "2020-11-10T08:52:28.574Z",
          referenceTypeId: 3,
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
          commission: values?.commision || 0,
          othersCharge: values?.othersCharge || 0,
          transferBusinessUnitId: values?.transferBusinessUnit?.value || 0,
          transferCostElementId: values?.costElement?.value || 0,
          transferCostCenterId: values?.costCenter?.value || 0,
          profitCenterId: values?.profitCenter?.value || 0,
          intTransferUnitPartnerId: values?.isTransfer
            ? values?.transferBusinessUnitSupplier?.value || 0
            : 0,
          strTransferUnitPartnerName: values?.isTransfer
            ? values?.transferBusinessUnitSupplier?.label || ""
            : "",
        },
        objRowListDTO,
        objImageListDTO: values?.attachmentList?.map((attachment) => ({
          imageId: attachment?.id || "",
        })),
      };
      dispatch(
        savePurchaseOrderForAssetStandardService({
          data: payload,
          cb,
          setDisabled,
          IConfirmModal,
          estimatePDAPOPage: "",
          history,
        })
      );
    } else {
      setDisabled(false);
    }
  };
  const plantDDL = useSelector((state) => state.purchaseOrder.plantDDL);
  const wareHouseDDL = useSelector((state) => state.purchaseOrder.wareHouseDDL);
  const purchaseOrgDDL = useSelector((state) => state.commonDDL.purchaseOrgDDL);
  const sbuDDL = useSelector((state) => state.commonDDL.sbuDDL);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          currency: currencyDDL[0],
          controllingUnit: cuList?.[0],
        }}
        validationSchema={validationSchemaForPo}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values, attachmentList }, rowDto, (res) => {
            console.log({ res });
            console.log({ singleData });
            resetForm(initData);
            setAttachmentList([]);
            setRowDto([]);
            postUpdateExpense(
              `${imarineBaseUrl}/domain/AdditionalCost/UpdatetAdditonalCostByPO`,
              {
                additionalCostId: singleData?.additionalCost,
                vesselId: singleData?.vesselId,
                voyageId: singleData?.voyageId,
                costId: singleData?.costId,
                purchaseOrderNo: res?.data?.code,
              },
              () => {
                setIsShowPoModal(false);
                setSingleData({});
              },
              true
            );
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
            <IForm
              customTitle={` PO Register  `}
              isHiddenReset
              isHiddenBack
              isHiddenSave
              renderProps={() => {
                return (
                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save
                    </button>
                  </div>
                );
              }}
            >
              <Form className="form form-label-right po-label">
                <div className="global-form">
                  {values?.supplierName?.label && (
                    <div style={{ color: "blue" }}>
                      <b>Supplier : {values?.supplierName?.label} , </b>
                      <b>
                        Supplier Address :{" "}
                        {values?.supplierName?.supplierAddress}
                      </b>
                    </div>
                  )}

                  <div className="form-group row">
                    <div className="col-lg-2">
                      <NewSelect
                        name="purchaseOrg"
                        options={purchaseOrgDDL}
                        value={values?.purchaseOrg}
                        label="Purchase Org"
                        onChange={(valueOption) => {
                          if (valueOption?.value) {
                            setFieldValue("purchaseOrg", valueOption);
                            getRefNoDdlForServicePo(
                              accountId,
                              buId,
                              sbuDDL[0]?.value,
                              valueOption?.value,
                              values?.plant?.value,
                              values?.warehouse?.value,
                              "Without Reference",
                              setRefNoDDL
                            );
                            dispatch(
                              getPOItemForServiceItemDDLAction(
                                5,
                                accountId,
                                buId,
                                buId,
                                valueOption.value,
                                values?.plant?.value,
                                values?.warehouse?.value,
                                values?.supplierName?.value,
                                3,
                                values?.referenceNo
                              )
                            );
                          }
                        }}
                        placeholder="Purchase Org"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="plant"
                        options={plantDDL}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);

                          if (valueOption?.value) {
                            setFieldValue("plant", valueOption);
                            dispatch(
                              getWareHouseDDLAction(
                                profileData?.userId,
                                accountId,
                                buId,
                                valueOption?.value
                              )
                            );
                            dispatch(
                              getCurrencyDDLAction(
                                accountId,
                                values?.purchaseOrg?.value,
                                buId
                              )
                            );
                            getRefNoDdlForServicePo(
                              accountId,
                              buId,
                              sbuDDL[0]?.value,
                              values?.purchaseOrg?.value,
                              valueOption?.value,
                              values?.warehouse?.value,
                              "Without Reference",
                              setRefNoDDL
                            );
                            getPOItemForServiceItemDDLAction(
                              5,
                              accountId,
                              buId,
                              buId,
                              values?.purchaseOrg?.value,
                              valueOption.value,
                              values?.warehouse?.value,
                              values?.supplierName?.value,
                              3,
                              values?.referenceNo
                            );
                          }
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="warehouse"
                        options={wareHouseDDL}
                        value={values?.warehouse}
                        label="Warehouse"
                        onChange={(valueOption) => {
                          if (valueOption?.value) {
                            setFieldValue("warehouse", valueOption);
                            setFieldValue(
                              "deliveryAddress",
                              valueOption?.address
                            );

                            getRefNoDdlForServicePo(
                              accountId,
                              buId,
                              sbuDDL[0]?.value,
                              values?.purchaseOrg?.value,
                              values?.plant?.value,
                              valueOption?.value,
                              "Without Reference",
                              setRefNoDDL
                            );
                            getPOItemForServiceItemDDLAction(
                              5,
                              accountId,
                              buId,
                              buId,
                              values?.purchaseOrg?.value,
                              values?.plant?.value,
                              valueOption.value,
                              values?.supplierName?.value,
                              3,
                              values?.referenceNo
                            );
                          }
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                        disabled={values?.plant?.value ? false : true}
                      />
                    </div>
                  </div>
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
                              `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${buId}&SBUId=${sbuDDL[0]?.value}`
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
                          values?.purchaseOrg?.label !== "Foreign Procurement"
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
                    <div className="col-lg-2 mt-5">
                      <AttachmentUploaderNew
                        CBAttachmentRes={(attachmentData) => {
                          if (Array.isArray(attachmentData)) {
                            setAttachmentList(attachmentData);
                          }
                        }}
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
                          disabled={true}
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
                                accountId,
                                valueOption?.value,
                                values?.isTransfer,
                                setCostCenterList
                              );
                              // getCostElementDDL(
                              //   accountId,
                              //   valueOption?.value,
                              //   values?.isTransfer,
                              //   setCostElementList
                              // );
                              getProfitCenterList(
                                valueOption?.value,
                                setProfitCenterList,
                                setLoading
                              );
                              getTransferUnitSupplierDDL(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accountId}&UnitId=${valueOption?.value}&SBUId=0`
                              );
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
                              if (valueOption) {
                                setFieldValue("costCenter", valueOption);
                                setFieldValue("costElement", "");
                                getCostElementDDL(
                                  values?.transferBusinessUnit?.value,
                                  accountId,
                                  valueOption?.value,
                                  setCostElementList
                                );
                              } else {
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
                    {values.isTransfer ? (
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
                            name="costCenterTwo"
                            options={costCenterListTwo}
                            value={values?.costCenterTwo}
                            onChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("costCenterTwo", valueOption);
                                setFieldValue("costElementTwo", "");
                                getCostElementDDL(
                                  buId,
                                  accountId,
                                  valueOption?.value,
                                  setCostElementListTwo
                                );
                              } else {
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
                        isDisabled={true}
                        onChange={(valueOption) => {
                          setFieldValue("referenceNo", valueOption);
                          setFieldValue("item", "");
                          getItemDDL(
                            values,
                            values?.supplierName?.value,
                            3,
                            valueOption?.value
                          );
                        }}
                        label="Reference No"
                        placeholder="Reference No"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2">
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values.item}
                        handleChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        loadOptions={(v) => {
                          console.log({ values });
                          if (v.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrderItemDDL/ServicePurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${5}&AccountId=${accountId}&BusinessUnitId=${buId}&SbuId=${
                                sbuDDL[0]?.value
                              }&PurchaseOrgId=${
                                values?.purchaseOrg?.value
                              }&PlantId=${values?.plant?.value}&WearhouseId=${
                                values?.warehouse?.value
                              }&RefTypeId=${3}&RefNoId=${0}&searchTerm=${v}`
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
                          disabled={getIsDisabledAddBtn(values)}
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
                  isWithoutRef={false} //location?.state?.refType?.value !== 3}
                  remover={remover}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  values={values}
                  uomDDL={uomDDL}
                />

                <button
                  type="submit"
                  style={{ display: "none" }}
                  // ref={btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  // ref={resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                  onClick={() => {
                    setRowDto([]);
                    setIsShowPoModal(false);
                  }}
                ></button>
              </Form>
            </IForm>
          </>
        )}
      </Formik>
    </>
  );
}
