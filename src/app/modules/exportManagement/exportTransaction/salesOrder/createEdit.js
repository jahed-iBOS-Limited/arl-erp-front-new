import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { dateFormatterForInput } from "../../../productionManagement/msilProduction/meltingProduction/helper";
import DetailsView from "../../../salesManagement/orderManagement/salesOrder/Form/detailsView";
import {
  getOrderPendingDetails,
  GetPendingQuantityDetails,
  getUnBilledAmountDetails,
} from "../../../salesManagement/orderManagement/salesOrder/helper";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _formatMoney } from "../../../_helper/_formatMoney";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import SalesOrderRowTable from "./rowDtoTable";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "../../../financialManagement/invoiceManagementSystem/billregister/helper";

const initData = {
  orderReferenceType: "",
  soldToParty: "",
  shipToParty: "",
  shipToPartyAddress: "",
  contactPersonNo: "",
  partyRefNo: "",
  pricingDate: "",
  deliveryDate: "",
  paymentTerms: "",
  currency: "",
  fdaNo: "",
  salesTerm: "",
  modeOfShipment: "",
  placeOfShipment: "",
  placeOfDischarge: "",
  finalDestination: "",
  countryOfOrigin: "",
  freightCharge: "",
  narration: "",
  modifyCiPercentage: 0,
};

const validationSchema = Yup.object().shape({
  orderReferenceType: Yup.object()
    .shape({
      label: Yup.string().required("Order Reference Type is required"),
      value: Yup.string().required("Order Reference Type is required"),
    })
    .typeError("Order Reference Type is required"),
});

export default function SalesOrderCreateEdit() {
  const [objProps, setObjprops] = useState({});
  //const [rowData, setRowData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const location = useLocation();
  const [show, setShow] = useState(false);
  const [tableType, setTableType] = useState("");
  const [detailsData, setDetailsData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadedImage, setUploadedImage] = useState([]);

  const {
    orderType,
    sbu,
    plant,
    salesOrg,
    shipPoint,
    distributionChannel,
    salesOffice,
  } = location?.state?.landingData || {};

  const [soldToPartyDDL, getSoldToPartyDDL, soldToPartyLoading] = useAxiosGet();
  const [
    shipToPartyDDL,
    getShipToPartyDDL,
    shipToPartyLoading,
    setShipToPartyDDL,
  ] = useAxiosGet();
  const [
    orderReferenceTypeDDL,
    getOrderReferenceTypeDDL,
    orderReferenceTypeLoading,
  ] = useAxiosGet();
  const [
    partnerBalance,
    getPartnerBalance,
    partnerBalanceLoading,
  ] = useAxiosGet();
  const [
    referenceNoDDL,
    getReferenceNoDDL,
    referenceNoLoading,
    setReferenceNoDDL,
  ] = useAxiosGet();
  //const [itemDDL, getItemDDL, itemLoading, setItemDDL] = useAxiosGet();
  const [currencyDDL, getCurrencyDDL, currencyLoader] = useAxiosGet();
  const [
    salesQuotationDetails,
    getSalesQuotationDetails,
    salesQuotationDetailsLoading,
    setSalesQuotationDetails,
  ] = useAxiosGet();
  const [
    unDeliverdAmount,
    getUnDeliverdAmount,
    unDeliverdAmountLoading,
    setUnDeliverdAmount,
  ] = useAxiosGet();
  const [
    availableBalance,
    getAvailableBalance,
    availableBalanceLoading,
    setAvailableBalance,
  ] = useAxiosGet();
  const [
    partnerCreditLimit,
    getPartnerCreditLimit,
    partnerCreditLimitLoading,
    setPartnerCreditLimit,
  ] = useAxiosGet();
  const [, saveForeignSalesOrder, saveLoading] = useAxiosPost();
  useEffect(() => {
    getSoldToPartyDDL(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerForSalesOrderDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&Sbuid=${sbu?.value}&SalesOrg=${salesOrg?.value}&ShipPoint=${shipPoint?.value}&DistributionChannel=${distributionChannel?.value}`
    );
    getOrderReferenceTypeDDL(`/oms/SalesOrder/GetOrderReferanceTypeDDL`);
    getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileData,
    selectedBusinessUnit,
    sbu,
    salesOrg,
    shipPoint,
    distributionChannel,
  ]);

  // add single item to row or add all item to row
  // const addRowDtoData = (data, values) => {

  //   const addData = {
  //     customerItemName: values?.customerItemName,
  //     referenceNoName: values?.salesQuotationRef?.label,
  //     shipToPartnerId: values?.shipToParty?.value,
  //     shipToPartnerName: values?.shipToParty?.label,
  //     shipToPartnerAddress: values?.shipToParty?.address,
  //     //priceConditionId: priceForInternalUse?.priceConditionId || 0,
  //     isFreeItem: false,
  //     specification: "",
  //     narration: values?.narration,
  //     numItemPrice: +values.numItemPrice,
  //     transportRate: +values?.transportRate || 0,
  //     //isVatPrice: priceForInternalUseVATAX?.isVatPrice || false,
  //     //vatPrice: priceForInternalUseVATAX?.itemPrice || 0,
  //   };

  //   if (values?.isAllItem) {
  //     // get new items that not exit in rowdto
  //     const refferenceItems = getUniQueItemsForExportSales(data, rowData, values);

  //     console.log("refferenceItems", refferenceItems)

  //     // show error if no new item found
  //     if (refferenceItems?.length === 0) {
  //       return toast.warn("Not allowed to duplicate items");
  //     }

  //     const newData = refferenceItems?.map((item, index) => {

  //       let obj = {
  //         ...addData,
  //         itemCode: item.itemCode,
  //         itemId: item.itemId,
  //         itemName: item.itemName,
  //         numItemPrice: +item.itemPrice + (+values?.waterProofRate || 0),
  //         waterProofRate : +values?.waterProofRate || 0,
  //         numOrderValue: +item.value + ((+item.quantity * +values?.waterProofRate) || 0),
  //         numRequestQuantity: +item.quantity,
  //         uomName: item.uom,
  //         uomId: item.uomId,
  //         specification: item.specification || "",
  //         numDiscountValue: 0,
  //         netValue:
  //           (+item.value + ((+item.quantity * +values?.waterProofRate) || 0)) -
  //           ((+item.value + ((+item.quantity * +values?.waterProofRate) || 0)) * 0) / 100,
  //         isFree: "No",
  //         customerItemName: values?.customerItemName || item.itemName,
  //       };
  //       return obj;
  //     });
  //     setRowData([...newData, ...rowData]);
  //   } else {
  //     // if reference, can't add same reference and same item multiple
  //     // if not reference, can't add multiple item
  //     let arr;

  //     if (values?.salesQuotationRef) {
  //       arr = rowData?.filter(
  //         (item) =>
  //           item?.referenceNoName === values?.salesQuotationRef?.label &&
  //           item?.itemId === values?.item?.itemId
  //       );
  //     } else {
  //       arr = rowData?.filter(
  //         (item) => item?.itemId === values?.item?.itemId
  //       );
  //     }
  //     if (arr?.length > 0) {
  //       toast.warn("Not allowed to duplicate items");
  //     } else {
  //       const newData = {
  //         ...addData,
  //           itemCode: values?.item.itemCode,
  //           itemId: values?.item.itemId,
  //           itemName: values?.item.itemName,
  //           numItemPrice: +values?.item.itemPrice + (+values?.waterProofRate || 0),
  //           waterProofRate : +values?.waterProofRate || 0,
  //           numOrderValue: values?.item?.value + ((+values?.item.quantity * +values?.waterProofRate) || 0),
  //           numRequestQuantity: +values?.item.quantity,
  //           uomName: values?.item.uom,
  //           uomId: values?.item.uomId,
  //           specification: values?.item.specification || "",
  //           numDiscountValue: 0,
  //           netValue:
  //             (values?.item?.value + ((+values?.item.quantity * +values?.waterProofRate) || 0)) -
  //             ((values?.item?.value + ((+values?.item.quantity * +values?.waterProofRate) || 0)) * 0) / 100,
  //           isFree: "No",
  //           customerItemName:
  //             values?.customerItemName || values?.item.itemName,
  //       };
  //       setRowData([...rowData, newData]);
  //     }
  //   }
  // };

  const modifyOrderReferenceTypeDDL = orderReferenceTypeDDL?.filter(
    (itm) => itm?.value === 4
  );

  const saveHandler = (values, cb) => {
    if (!values?.deliveryDate) return toast.warn("Delivery Date is required");
    if (!uploadedImage?.length) return toast.warn("Please attach a file!");

    const newRowDto = salesQuotationDetails?.Data?.RowData?.map(
      (itm, index) => ({
        shipToPartnerId: values?.shipToParty?.value || 0,
        shipToPartnerName: values?.shipToParty?.label || "",
        shipToPartnerAddress: values?.shipToParty?.address || "",
        itemId: itm?.ItemId || 0,
        itemCode: itm?.ItemCode || "",
        itemName: itm?.ItemName || "",
        customerItemName: itm?.ItemName || "",
        numItemPrice: itm?.FobRatePerPieceBDT || 0, //its come from sales quotation per ctn usd price to bdt price
        numRequestQuantity: itm?.TotalPieces || 0,
        uomId: itm?.UomId || 0,
        uomName: itm?.UomName || "",
        numDiscountValue: 0,
        referenceNoName: values?.salesQuotationRef?.label || "",
        sequenceNo: 0,
        numOrderQuantity: itm?.TotalPieces || 0,
        priceConditionId: 0,
        numOrderValue: itm?.TotalFobAmountBDT,
        isFreeItem: false,
        specification: "",
        transportRate: 0,
        numWaterProofRate: 0,
        currencyPrice: itm?.FobRatePerCartonUSD || 0,
        currencyValue: itm?.TotalFobAmountUSD || 0,
        ciRate: +itm?.ciRate || 0,
        cogs: +itm?.cogs || 0,
        ciValue: +itm?.ciValue || 0,
      })
    );

    const payload = {
      objHeader: {
        accountId: profileData?.accountId || 1,
        businessUnitId: selectedBusinessUnit?.value || 0,
        salesOrderTypeId: orderType?.value || 0,
        salesOrderTypeName: orderType?.label || "",
        sbuid: sbu?.value || 0,
        sbuName: sbu?.label || "",
        plantId: plant?.value,
        currencyName: values?.currency?.label || "",
        currencyId: values?.currency?.value || 0,
        salesOrganizationId: salesOrg?.value || 0,
        distributionChannelId: distributionChannel?.value || 0,
        salesOfficeId: salesOffice?.value || 0,
        salesOfficeName: salesOffice?.label || "",
        soldToPartnerId: values?.soldToParty?.value || 0,
        soldToPartnerName: values?.soldToParty?.label || "",
        shiptoPartnerAddress: values?.shipToPartyAddress || "",
        shippointId: shipPoint?.value || 0,
        shippointName: shipPoint?.label || "",
        intTerritoryId: values?.shipToParty?.territoryId || 0,
        billToPartnerId: values?.soldToParty?.value || 0,
        billToPartnerName: values?.soldToParty?.label || "",
        partnerReffNo: values?.partyRefNo || "",
        partnerReffDate: _todayDate(),
        refferenceTypeId: values?.orderReferenceType?.value || 0,
        refferenceTypeName: values?.orderReferenceType?.label || "",
        pricingDate: values?.pricingDate,
        dueShippingDate: values?.deliveryDate,
        incotermId: 1,
        paymentTermId: values?.paymentTerms?.value || 0,
        narration: values?.narration || "",
        isPartialShipment: profileData?.accountId === 1 ? true : false,
        isTransshipment: false,
        numHeaderDiscountValue: 0,
        actionBy: profileData?.userId || 0,
        logisticBy: 1,
        shipToPartnerContactNo: values?.contactPersonNo || "",
        allotmentId: 0,
        productType: "",
        collectionDays: 0,
        isUnloadLabourByCompany: false,
        freightAmount: values?.freightCharge || 0,
        quotationId: values?.salesQuotationRef?.value || 0,
        attachmentno: uploadedImage[0]?.id,
      },
      objRow: newRowDto,
    };

    saveForeignSalesOrder(
      `/oms/SalesOrder/CreateForeignSalesOrder`,
      payload,
      cb,
      true
    );

    console.log("payload", payload);
  };

  // remove single data from rowDto
  //  const remover = (id) => {
  //   let ccdata = rowData.filter((itm, index) => index !== id);
  //   setRowData(ccdata);
  // };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        orderReferenceType:
          modifyOrderReferenceTypeDDL?.length > 0
            ? modifyOrderReferenceTypeDDL[0]
            : "",
        paymentTerms: { value: 1, label: "Cash/Advance" },
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(disabled ||
            soldToPartyLoading ||
            shipToPartyLoading ||
            orderReferenceTypeLoading ||
            partnerBalanceLoading ||
            referenceNoLoading ||
            currencyLoader ||
            salesQuotationDetailsLoading ||
            unDeliverdAmountLoading ||
            availableBalanceLoading ||
            partnerCreditLimitLoading ||
            saveLoading) && <Loading />}
          <IForm title="Create Sales order" getProps={setObjprops}>
            <Form>
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="orderReferenceType"
                    options={modifyOrderReferenceTypeDDL}
                    value={values?.orderReferenceType}
                    label="Order Reference Type"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("orderReferenceType", valueOption);
                      } else {
                        setFieldValue("orderReferenceType", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="soldToParty"
                    options={soldToPartyDDL}
                    value={values?.soldToParty}
                    label="Sold To Party"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("soldToParty", valueOption);
                        setShipToPartyDDL([]);
                        setFieldValue("shipToParty", "");
                        setFieldValue("shipToPartyAddress", "");
                        setFieldValue("contactPersonNo", "");
                        getShipToPartyDDL(
                          `/partner/PManagementCommonDDL/GetBusinessPartnerSalesShippingAddress?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&BusinessPartnerId=${valueOption?.value}`,
                          (data) => {
                            setFieldValue("shipToParty", data[0]);
                            setFieldValue(
                              "shipToPartyAddress",
                              data[0]?.address
                            );
                            setFieldValue(
                              "contactPersonNo",
                              data[0]?.contactNumber
                            );
                          }
                        );

                        getPartnerBalance(
                          `/partner/BusinessPartnerSales/GetBPartnerBalanceByPartnerId?BusinessPartnerId=${valueOption?.value}`
                        );
                        getReferenceNoDDL(
                          `/oms/SalesOrder/GetSalesQuotationDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&SoldToPartnerId=${valueOption?.value}`
                        );
                        getUnDeliverdAmount(
                          `/oms/SalesOrder/GetUndeliveryValues?SoldToPartnerId=${valueOption?.value}`
                        );
                        getAvailableBalance(
                          `/oms/SalesOrder/GetAvailableBalanceForInternalUser?pId=${valueOption?.value}`
                        );
                        getPartnerCreditLimit(
                          `/oms/SalesOrder/GetCreditLimitForInternalUser?pId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("soldToParty", "");
                        setReferenceNoDDL([]);
                        setShipToPartyDDL([]);
                        setUnDeliverdAmount({});
                        setAvailableBalance({});
                        setPartnerCreditLimit({});
                        setFieldValue("shipToParty", "");
                        setFieldValue("shipToPartyAddress", "");
                        setFieldValue("contactPersonNo", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipToParty"
                    options={shipToPartyDDL}
                    value={values?.shipToParty}
                    label="Ship To Party"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shipToParty", valueOption);
                        setFieldValue(
                          "shipToPartyAddress",
                          valueOption?.shiptoPartnerAddress
                        );
                        setFieldValue(
                          "contactPersonNo",
                          valueOption?.contactNumber
                        );
                      } else {
                        setFieldValue("shipToParty", "");
                        setFieldValue("shipToPartyAddress", "");
                        setFieldValue("contactPersonNo", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.shipToPartyAddress}
                    label="Ship To Party Address"
                    name="shipToPartyAddress"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("shipToPartyAddress", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.contactPersonNo}
                    label="Contact Person No"
                    name="contactPersonNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("contactPersonNo", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.partyRefNo}
                    label="Party Ref No"
                    name="partyRefNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("partyRefNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.pricingDate}
                    label="Pricing Date"
                    name="pricingDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("pricingDate", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.deliveryDate}
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("deliveryDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentTerms"
                    options={[{ value: 1, label: "Cash/Advance" }]}
                    value={values?.paymentTerms}
                    label="Payment Terms"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("paymentTerms", valueOption);
                      } else {
                        setFieldValue("paymentTerms", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="currency"
                    options={currencyDDL}
                    value={values?.currency}
                    label="Currency"
                    isDisabled={true}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("currency", valueOption);
                      } else {
                        setFieldValue("currency", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.fdaNo}
                    label="FDA No"
                    name="fdaNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("fdaNo", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.salesTerm}
                    label="Sales Term"
                    name="salesTerm"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("salesTerm", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.modeOfShipment}
                    label="Mode Of Shipment"
                    name="modeOfShipment"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("modeOfShipment", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.placeOfShipment}
                    label="Place Of Shipment"
                    name="placeOfShipment"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("placeOfShipment", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.placeOfDischarge}
                    label="Place Of Discharge"
                    name="placeOfDischarge"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("placeOfDischarge", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.finalDestination}
                    label="Final Destination"
                    name="finalDestination"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("finalDestination", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.countryOfOrigin}
                    label="Country Of Origin"
                    name="countryOfOrigin"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("countryOfOrigin", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.freightCharge}
                    label="Freight Charge"
                    name="freightCharge"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("freightCharge", e.target.value);
                    }}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    name="narration"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("narration", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-12">
                  {partnerBalance && (
                    <p className="m-0 my-2">
                      <b>Ledger Balance: </b>
                      {_formatMoney(partnerBalance?.[0]?.ledgerBalance)},
                      <b className="ml-2">Credit Limit: </b>{" "}
                      {_formatMoney(partnerCreditLimit)},
                      <b className="ml-2">Unbilled Amount: </b>
                      {_formatMoney(partnerBalance?.[0]?.unbilledAmount)}{" "}
                      <button
                        className="btn btn-sm btn-primary px-1 py-1"
                        type="button"
                        onClick={() => {
                          setTableType("unBilled");
                          getUnBilledAmountDetails(
                            selectedBusinessUnit?.value,
                            values?.soldToParty?.value,
                            setDetailsData,
                            setDisabled,
                            () => {
                              setShow(true);
                            }
                          );
                        }}
                      >
                        Details
                      </button>
                      ,<b className="ml-2">Available Balance: </b>{" "}
                      {_formatMoney(availableBalance)},
                      <b className="ml-2">Undelivered Amount: </b>
                      {_formatMoney(unDeliverdAmount?.unlideliveredValues)}
                      <b className="ml-2">Pending Qty: </b>
                      {_formatMoney(partnerBalance?.[0]?.pendingQty)}{" "}
                      <button
                        className="btn btn-sm btn-primary px-1 py-1"
                        type="button"
                        onClick={() => {
                          setTableType("order");
                          getOrderPendingDetails(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.soldToParty?.value,
                            setDetailsData,
                            setDisabled,
                            () => {
                              setShow(true);
                            }
                          );
                        }}
                      >
                        Details
                      </button>
                      <b className="ml-2">Transport Qty: </b>
                      {_formatMoney(partnerBalance?.[0]?.transportQty)}{" "}
                      <button
                        className="btn btn-sm btn-primary px-1 py-1"
                        type="button"
                        onClick={() => {
                          setTableType("delivery");
                          GetPendingQuantityDetails(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.soldToParty?.value,
                            setDetailsData,
                            setDisabled,
                            () => {
                              setShow(true);
                            }
                          );
                        }}
                      >
                        Details
                      </button>
                      {partnerBalance?.[0]?.isDayLimit && (
                        <>
                          <b className="ml-2">Day Limit: </b>
                          {"true"}
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group global-form row">
                <div className="col-lg-2">
                  <NewSelect
                    name="salesQuotationRef"
                    options={referenceNoDDL}
                    value={values?.salesQuotationRef}
                    label="Reference No"
                    onChange={(valueOption) => {
                      setFieldValue("modifyCiPercentage", 0);
                      if (valueOption) {
                        setFieldValue("salesQuotationRef", valueOption);

                        getSalesQuotationDetails(
                          `/oms/SalesQuotation/ViewForeignSalesQuotation?QuotationId=${valueOption?.value}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
                          (data) => {
                            const modifyData = { ...data };

                            const modifyRow = modifyData?.Data?.RowData?.map(
                              (item) => {
                                return {
                                  ...item,
                                  cogs: 0,
                                  ciRate: 0,
                                  ciValue: 0,
                                };
                              }
                            );

                            modifyData.Data.RowData = modifyRow;
                            setSalesQuotationDetails(modifyData);

                            setFieldValue(
                              "currency",
                              {
                                value: data?.Data?.HeaderData?.CurrencyId,
                                label: data?.Data?.HeaderData?.CurrencyName,
                              },
                              setFieldValue(
                                "partyRefNo",
                                data?.Data?.HeaderData?.PartnerReffNo
                              ),
                              setFieldValue(
                                "pricingDate",
                                data?.Data?.HeaderData?.PricingDate
                                  ? dateFormatterForInput(
                                      data?.Data?.HeaderData?.PricingDate
                                    )
                                  : ""
                              ),
                              setFieldValue(
                                "salesTerm",
                                data?.Data?.HeaderData?.SalesTerm
                              ),
                              setFieldValue(
                                "modeOfShipment",
                                data?.Data?.HeaderData?.ModeofShipment
                              ),
                              setFieldValue(
                                "placeOfShipment",
                                data?.Data?.HeaderData?.PortofShipment
                              ),
                              setFieldValue(
                                "placeOfDischarge",
                                data?.Data?.HeaderData?.PortofDishcharge
                              ),
                              setFieldValue(
                                "finalDestination",
                                data?.Data?.HeaderData?.FinalDestination
                              ),
                              setFieldValue(
                                "countryOfOrigin",
                                data?.Data?.HeaderData?.CountryOfOrigin
                              ),
                              setFieldValue(
                                "freightCharge",
                                data?.Data?.HeaderData?.FreightAmountBDT
                              )
                            );
                          }
                        );

                        // getItemDDL(`/oms/SalesOrder/GetReferenceWithItemListById?TypeId=${4}&Id=${valueOption?.value}`,
                        // (data) => {
                        //   setItemDDL(
                        //     data?.map((itm) => ({
                        //       ...itm,
                        //       value: itm?.itemId,
                        //       label: itm?.itemName,
                        //     }))
                        //   )
                        // },
                        // )
                      } else {
                        setFieldValue("salesQuotationRef", "");
                        setSalesQuotationDetails([]);

                        setFieldValue("currency", {});
                        setFieldValue("partyRefNo", "");
                        setFieldValue("pricingDate", "");
                        setFieldValue("salesTerm", "");
                        setFieldValue("modeOfShipment", "");
                        setFieldValue("placeOfShipment", "");
                        setFieldValue("placeOfDischarge", "");
                        setFieldValue("finalDestination", "");
                        setFieldValue("countryOfOrigin", "");
                        setFieldValue("freightCharge", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-2">
                  <button
                    className="btn btn-primary mr-2 mt-5"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>

                <DropzoneDialogBase
                  filesLimit={5}
                  acceptedFiles={["image/*", "application/pdf"]}
                  fileObjects={fileObjects}
                  cancelButtonText={"cancel"}
                  submitButtonText={"submit"}
                  maxFileSize={1000000}
                  open={open}
                  onAdd={(newFileObjs) => {
                    setFileObjects([].concat(newFileObjs));
                  }}
                  onDelete={(deleteFileObj) => {
                    const newData = fileObjects.filter(
                      (item) => item.file.name !== deleteFileObj.file.name
                    );
                    setFileObjects(newData);
                  }}
                  onClose={() => setOpen(false)}
                  onSave={() => {
                    setOpen(false);
                    empAttachment_action(fileObjects).then((data) => {
                      setUploadedImage(data);
                    });
                  }}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                />

                {/* <div className="col-lg-2">
                    <NewSelect
                      name="item"
                      options={itemDDL}
                      value={values?.item}
                      label="Item"
                      onChange={valueOption => {
                         if (valueOption) {
                            setFieldValue('item', valueOption); 
                            setFieldValue('customerItemName', valueOption?.label);  
                         } else {
                            setFieldValue('item', '');
                            setFieldValue('customerItemName', '');
                         }
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                          <InputField
                            value={values?.customerItemName}
                            label="Customer Item Name"
                            name="customerItemName"
                            type="text"
                            onChange={e => {
                             setFieldValue('customerItemName', e.target.value);
                          }}
                          />
                        </div>

                    <div className="col-lg-1">
                      <Field
                        name={values.isAllItem}
                        component={() => (
                          <input
                            id="soIsAllItem"
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

                  <div className="col-lg-1">
                    <button
                      type="button"
                      disabled={
                        values?.orderReferenceType?.value === 1
                                ? !values.item ||
                                  !values.orderReferenceType ||
                                  !values.shipToParty
                                : !values.orderReferenceType || !values?.salesQuotationRef}
                      style={{
                        marginTop: "20px",
                        marginLeft: "-20px"
                      }}
                      className="btn btn-primary"
                      onClick={() => {
                        addRowDtoData(itemDDL, values);
                          setFieldValue("isAllItem", false);
                      }}
                    >
                      Add
                    </button>
                  </div> */}
                <div
                  style={{ transform: "translateY(23px)" }}
                  className="col-lg"
                >
                  {/* <TotalNetAmount rowDto={rowDto} values={values} /> */}
                </div>
              </div>

              {/* RowDto table */}
              <SalesOrderRowTable
                //remover={remover}
                //rowDto={rowData}
                // setRowDto={setRowData}
                salesQuotationDetails={salesQuotationDetails}
                setSalesQuotationDetails={setSalesQuotationDetails}
                values={values}
                selectedBusinessUnit={selectedBusinessUnit}
                profileData={profileData}
                setFieldValue={setFieldValue}
              />

              <IViewModal
                title={`${
                  tableType === "order"
                    ? "Pending Order Details"
                    : tableType === "delivery"
                    ? "Pending Delivery Details"
                    : tableType === "unBilled"
                    ? "UnBilled Amount Details"
                    : ""
                }`}
                show={show}
                onHide={() => setShow(false)}
              >
                <DetailsView tableType={tableType} gridData={detailsData} />
              </IViewModal>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
