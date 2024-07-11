/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveSalesOrder,
  getBUalesOrgIncotermDDL_Action,
  getSalesQuotationDDL_Action,
  getItemUOMDDL_Action,
  getReferenceItemDetailsById_Action,
  getPriceForInternalUse_Action,
  getDataBySalesOrderId_Action,
  getPriceForInternalUseVATAX_Action,
  saveEditedSalesOrder,
  getUndeliveryValues_action,
  getSalesOrderApproval_Aciton,
  SetAvailableBalanceEmpty_Action,
  getDiscountStructureCheck_Action,
  getSalesDiscount_Action,
  uoMitemPlantWarehouseDDL_action,
  getSalesOrderApproveCheck_action,
  SetSalesDiscountEmpty_action,
  SetTotalPendingQuantityEmptyAction,
  getTotalPendingQuantityAction,
  getAllocateItemDDLAction,
  GetSalesConfigurationBalanceCheck_acion,
  getTransportZoneDDL_action,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import {
  getSoldToPartner_Action,
  getCurrencyListDDL_Action,
} from "./../_redux/Actions";
import { useLocation } from "react-router-dom";
import { getOrderReferanceTypeDDL_Action } from "./../_redux/Actions";
import { getPaymentTermsListDDL_Action } from "./../_redux/Actions";
import { getItemPlant_Action } from "./../_redux/Actions";
import { getSalesContactDDL_Action } from "./../_redux/Actions";
import { getSalesOrderDDL_action } from "./../_redux/Actions";
import { setSalesOrderSingleEmpty } from "./../_redux/Actions";
import { toast } from "react-toastify";
import { getShipToPartner_Action } from "./../_redux/Actions";
import { getPartnerBalance_action } from "./../_redux/Actions";
import { getPriceStructureCheck_Acion } from "./../_redux/Actions";
import { getAvailableBalance_Action } from "./../_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import { SetPartnerBalanceEmpty_Action } from "./../_redux/Actions";
import { SetUndeliveryValuesEmpty_Action } from "./../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
import { isUniq } from "./../../../../_helper/uniqChecker";
import {
  getBrokers,
  getChannelBaseCollectionDays,
  rejectSalesOrder,
} from "../helper";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
const initData = {
  id: undefined,
  soldtoParty: "",
  partnerReffNo: "",
  currency: "",
  pricingDate: _todayDate(),
  dueShippingDate: _todayDate(),
  isTransshipment: false,
  isPartialShipment: false,
  refType: "",
  incoterm: "",
  paymentTerms: "",
  validity: "",
  numItemPrice: 0,
  referenceNo: "",
  shipToParty: "",
  item: "",
  allCheckbox: false,
  numDiscountValue: 0,
  narration: "",
  numRequestQuantity: "",
  uom: "",
  quantityTop: "",
  customerItemName: "",
  shipToPartnerContactNo: "",
  shipToPartnerContactNoNameOnly: "", // Last Added
  shiptoPartnerAddress: "",
  alotement: "",
  transportZone: "",
  transportRate: 0,
  productType: {
    value: "Straight",
    label: "Straight",
  },
  logisticBy: { value: 1, label: "Company" },
  isWaterProof: { value: false, label: "No" },
  waterProofRate: "",
  pumpChargeRate: "",
  isPumpCharge: { value: false, label: "No" },
  isUnloadLabourByCompany: { value: false, label: "No" },
  haveBroker: { value: false, label: "No" },
  brokerName: "",
  attachment: "",
};

export default function SalesOrderForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [alotementPrice, setAlotementPrice] = useState(0);
  const [createSaveData, setCeateSaveData] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [singleHeaderData, setSingleHeaderData] = useState("");
  // const [formValues, setFormValues] = useState({});
  const dispatch = useDispatch();
  const { state: headerData } = useLocation();
  const [total, setTotal] = useState({ totalAmount: 0, totalQty: 0 });
  const [collectionDays, selCollectionDays] = useState(0);
  const [, getCommissionRates, loader] = useAxiosPost();
  const [brokerDDL, setBrokerDDL] = useState([]);
  let {
    profileData,
    selectedBusinessUnit,
    soldToPartnerDDL,
    currencyListDDL,
    orderReferanceTypeDDL,
    BUalesOrgIncotermDDL,
    paymentTermsListDDL,
    shipToPartner,
    itemPlantDDL,
    partnerBalance,
    referenceNo,
    itemUOMDDL,
    undeliveryValues,
    priceStructureCheck,
    priceForInternalUse,
    referenceWithItemListById,
    referenceItemDetailsById,
    availableBalance,
    salesOrderApproveCheck,
    creditLimitForInternalUser,
    alotementDDL,
    isBalanceCheck,
    transportZoneDDL,
    priceForInternalUseVATAX,
  } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        soldToPartnerDDL: state.salesOrder.soldToPartnerDDL,
        currencyListDDL: state.salesOrder.currencyListDDL,
        orderReferanceTypeDDL: state.salesOrder.orderReferanceTypeDDL,
        BUalesOrgIncotermDDL: state.salesOrder.BUalesOrgIncotermDDL,
        paymentTermsListDDL: state.salesOrder.paymentTermsListDDL,
        shipToPartner: state.salesOrder.shipToPartner,
        itemPlantDDL: state.salesOrder.itemPlantDDL,
        partnerBalance: state.salesOrder.partnerBalance,
        undeliveryValues: state.salesOrder.undeliveryValues,
        referenceNo: state.salesOrder.referenceNo,
        itemUOMDDL: state.salesOrder?.uoMitemPlantWarehouseDDL,
        priceStructureCheck: state.salesOrder.priceStructureCheck,
        // discountStructureCheck: state.salesOrder.discountStructureCheck,
        priceForInternalUse: state.salesOrder.priceForInternalUse,
        priceForInternalUseVATAX: state.salesOrder.priceForInternalUseVATAX,
        referenceItemDetailsById: state.salesOrder.referenceItemDetailsById,
        referenceWithItemListById: state.salesOrder.referenceWithItemListById,
        availableBalance: state.salesOrder.availableBalance,
        salesDiscount: state.salesOrder.salesDiscount,
        salesOrderApproveCheck: state.salesOrder.salesOrderApproveCheck,
        creditLimitForInternalUser: state.salesOrder.creditLimitForInternalUser,
        alotementDDL: state.salesOrder.alotementDDL,
        isBalanceCheck: state.salesOrder.isBalanceCheck,
        transportZoneDDL: state.salesOrder.transportZoneDDL,
      };
    },
    { shallowEqual }
  );
  // get single sales order  unit from store
  const singleData = useSelector((state) => {
    return state.salesOrder?.singleData;
  }, shallowEqual);
  //Akij Essentials Ltd
  const isBUIEssentials = selectedBusinessUnit?.value === 144;
  const balanceCheckFunc = () => {
    // if Day Limit true
    if (partnerBalance?.isDayLimit) {
      if (availableBalance < 0) {
        // toast.warning("Balance not available", { toastId: 465656 });
        return true;
      }
    } else {
      // if Day Limit false
      if (
        availableBalance &&
        availableBalance < total.totalAmount &&
        isBalanceCheck?.balanceCheckOnOrder
      ) {
        // toast.warning("Balance not available", { toastId: 465656 });
        return true;
      }
    }
    return false;
  };

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (
      id &&
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      dispatch(
        getDataBySalesOrderId_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          id,
          setDisabled
        )
      );
      dispatch(getSalesOrderApproveCheck_action(profileData?.userId));
    } else {
      dispatch(setSalesOrderSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  //Initial single row data set
  useEffect(() => {
    if (singleData?.objRow) {
      const newRowDto = singleData?.objRow.map((itm) => ({
        ...itm,
        netValue:
          itm.numOrderValue - (itm.numOrderValue * itm.numDiscountValue) / 100,
        isFree: itm.isFreeItem ? "Yes" : "No",
        waterProofRate: itm?.waterProofRate || itm?.numWaterProofRate || 0,
        pumpChargeRate: itm?.pumpChargeRate || itm?.numPumpChargeRate || 0,
      }));
      setRowDto(newRowDto);
    }
    if (singleData?.objHeader) {
      setSingleHeaderData(singleData?.objHeader);
      dispatch(
        getTotalPendingQuantityAction(
          profileData?.accountId,
          selectedBusinessUnit,
          {
            soldtoParty: singleData?.objHeader?.soldtoParty,
            pricingDate: singleData?.objHeader?.pricingDate,
          }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  //Dispatch Get inital action
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBrokers(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBrokerDDL,
        setDisabled
      );
      dispatch(
        getCurrencyListDDL_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(getOrderReferanceTypeDDL_Action());
      dispatch(getBUalesOrgIncotermDDL_Action());
      dispatch(
        getPaymentTermsListDDL_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          headerData?.salesOrg?.value
        )
      );
      dispatch(
        getItemUOMDDL_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        GetSalesConfigurationBalanceCheck_acion(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getTransportZoneDDL_action(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const responseData = (soldToPartnerId, soId, salesOrderCode) => {
    setCeateSaveData({ soldToPartnerId, soId, salesOrderCode });
  };

  const getCommissionRatesForEssential = (cb) => {
    if (
      selectedBusinessUnit?.value === 144 &&
      headerData?.distributionChannel?.value === 71
    ) {
      const payload = rowDto?.map((item) => {
        return {
          itemId: item?.itemId,
          itemQuantity: item?.numRequestQuantity,
        };
      });
      getCommissionRates(
        `/oms/SalesOrder/SlabWiseItemGroupDiscount`,
        payload,
        (resData) => {
          cb(resData);
        }
      );
    } else {
      cb();
    }
  };

  const saveHandler = async (values, commissionRates, cb) => {
    const callBackFunc = () => {
      history.push(`/sales-management/ordermanagement/salesorder`);
    };

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const newRowDto = rowDto.map((itm, index) => ({
          ...itm,
          sequenceNo: ++index,
          numItemPrice: +itm?.numItemPrice,
          numRequestQuantity: +itm.numRequestQuantity,
          numOrderQuantity: +itm.numRequestQuantity,
          numWaterProofRate: +itm?.waterProofRate || 0,
          numPumpChargeRate: +itm?.pumpChargeRate || 0,
          isFree: itm.isFree === "Yes" ? true : false,
          isFreeItem: itm.isFree === "Yes" ? true : false,
        }));
        const payload = {
          objHeader: {
            salesOrderId: singleData?.objHeader.salesOrderId || 0,
            currencyName: values.currency.label,
            currencyId: values.currency.value,
            numHeaderDiscountValue: singleData?.objRow[0]?.numDiscountValue,
            narration: values.narration,
            actionBy: profileData.userId,
            intTerritoryId: values?.shipToParty?.territoryId || 0,
            shipToPartnerContactNo: values?.shipToPartnerContactNo || "",
            allotmentId: +values?.alotement?.value || 0,
            logisticBy: values?.logisticBy?.value,
            isWaterProof: values?.isWaterProof?.value,
            isPump: values?.isPumpCharge?.value,
            isUnloadLabourByCompany: values?.isUnloadLabourByCompany?.value,
            salesOrderValidityDays: collectionDays?.salesOrderValidityDays,
            salesOrderExpiredDate: "2023-06-22T14:08:10.512Z",
            // collectionDays: values?.collectionDays || 0,
            attachment: values?.attachment,
          },
          objRow: newRowDto,
        };
        if (newRowDto?.length > 0) {
          if (isBUIEssentials) {
            dispatch(saveEditedSalesOrder(payload, setDisabled, callBackFunc));
          } else {
            if (balanceCheckFunc()) {
              toast.warning("Balance not available", { toastId: 465656 });
            } else {
              dispatch(
                saveEditedSalesOrder(payload, setDisabled, callBackFunc)
              );
            }
          }
        } else {
          toast.warning("You must have to add at least one item");
        }
      } else {
        const newRowDto = rowDto.map((itm, index) => {
          // these two values (commissionRate, commissionAmount) are only for distributor channel of Akij essentials Ltd.
          const commissionRate = commissionRates?.find(
            (rate) => rate?.itemId === itm?.itemId
          )?.discountRate;
          const commissionAmount = commissionRate * itm?.numRequestQuantity;

          return {
            ...itm,
            sequenceNo: ++index,
            numRequestQuantity: +itm.numRequestQuantity,
            numOrderQuantity: +itm.numRequestQuantity,
            numWaterProofRate: +itm?.waterProofRate || 0,
            numPumpChargeRate: +itm?.pumpChargeRate || 0,
            numItemPrice: +itm?.numItemPrice,
            isFree: itm.isFree === "Yes" ? true : false,
            isFreeItem: itm.isFree === "Yes" ? true : false,
            numCommissionRate: commissionRate,
            numCommissionAmount: commissionAmount,
          };
        });
        const payload = {
          objHeader: {
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            salesOrderTypeId: headerData.orderType.value,
            salesOrderTypeName: headerData.orderType.label,
            sbuid: headerData.sbu.value,
            sbuName: headerData.sbu.label,
            plantId: headerData.plant.value,
            salesOrganizationId: headerData.salesOrg.value,
            distributionChannelId: headerData.distributionChannel.value,
            salesOfficeId: headerData.salesOffice.value,
            salesOfficeName: headerData.salesOffice.label,
            soldToPartnerId: values.soldtoParty.value,
            soldToPartnerName: values.soldtoParty.label,
            billToPartnerId: values.soldtoParty.value,
            billToPartnerName: values.soldtoParty.label,
            partnerReffNo: values.partnerReffNo,
            partnerReffDate: _todayDate(),
            refferenceTypeId: values.refType.value,
            refferenceTypeName: values.refType.label,
            pricingDate: values.pricingDate,
            dueShippingDate: values.dueShippingDate,
            incotermId: values.incoterm.value || 0,
            paymentTermId: values.paymentTerms.value,
            isPartialShipment:
              profileData?.accountId === 1 ? true : values.isPartialShipment,
            isTransshipment: values.isTransshipment,
            numHeaderDiscountValue: 1,
            narration: values.narration,
            actionBy: profileData.userId,
            currencyName: values.currency.label,
            currencyId: values.currency.value,
            shippointId: headerData.shippoint.value,
            shippointName: headerData.shippoint.label,
            intTerritoryId: values?.shipToParty?.territoryId,
            shipToPartnerContactNo:
              `${values?.shipToPartnerContactNoNameOnly ||
                ""}-${values?.shipToPartnerContactNo || ""}` || "",
            shiptoPartnerAddress: values?.shiptoPartnerAddress || "N/A",
            allotmentId: +values?.alotement?.value || 0,
            productType: [224, 171].includes(selectedBusinessUnit?.value)
              ? values?.productType?.label
              : "",
            logisticBy: values?.logisticBy?.value,
            isWaterProof: values?.isWaterProof?.value,
            isPump: values?.isPumpCharge?.value,
            collectionDays: values?.collectionDays || 0,
            isUnloadLabourByCompany: values?.isUnloadLabourByCompany?.value,
            salesOrderValidityDays: collectionDays?.salesOrderValidityDays,
            salesOrderExpiredDate: "2023-06-22T14:08:10.512Z",
            commissionAgentId: values?.brokerName?.value,
            attachment: values?.attachment,
          },
          objRow: newRowDto,
        };
        if (newRowDto?.length > 0) {
          if (balanceCheckFunc()) {
            toast.warning("Balance not available", { toastId: 465656 });
          } else {
            dispatch(
              saveSalesOrder({
                data: payload,
                cb,
                responseData,
                setRowDto,
                setDisabled,
              })
            );
            setRowDto([]);
          }
        } else {
          toast.warning("You must have to add at least one item");
        }
      }
    } else {
      setDisabled(false);
    }
  };
  //referenceNo Change  handler
  const referenceNoHandler = (id, values) => {
    if (id === 2) {
      dispatch(
        getSalesContactDDL_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.soldtoParty?.value
        )
      );
    } else if (id === 4) {
      dispatch(
        getSalesQuotationDDL_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.soldtoParty?.value
        )
      );
    } else if (id === 3) {
      dispatch(
        getSalesOrderDDL_action(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    } else if (id === 1) {
      dispatch(
        getItemPlant_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          headerData?.distributionChannel?.value,
          headerData?.salesOrg?.value
        )
      );
    }
  };
  const ifBusinessUnitCement_rowAddFunc = (values, addData) => {
    const numOrderValue = priceForInternalUse?.itemPrice * +values?.quantityTop;
    const netValue = numOrderValue - (numOrderValue * 0) / 100;
    const obj = {
      customerItemName: values?.customerItemName,
      referenceNoName: values?.referenceNo?.label,
      shipToPartnerId: values?.shipToParty?.value,
      shipToPartnerName: values?.shipToParty?.label,
      shipToPartnerAddress: values?.shipToParty?.address,
      priceConditionId: priceForInternalUse?.priceConditionId || 0,
      isFreeItem: false,
      specification: "",
      narration: values?.narration,
      // new
      itemId: values?.item?.value,
      itemCode: values?.item?.code,
      itemName: values?.item?.label,
      numRequestQuantity: +values?.quantityTop,
      numItemPrice: priceForInternalUse?.itemPrice,
      numOrderValue: numOrderValue,
      numDiscountValue: 0,
      netValue: netValue,
      isFree: "No",
      uomName: values?.uom?.label,
      uomId: values?.uom?.value,
      isVatPrice: priceForInternalUseVATAX?.isVatPrice || false,
      vatPrice: priceForInternalUseVATAX?.itemPrice || 0,
    };

    setRowDto([...rowDto, obj]);
  };

  // salesDiscount CB
  const salesDiscountCB = (salesDiscount, addData) => {
    if (salesDiscount) {
      const newSalesDiscount = salesDiscount?.item?.map((itm) => {
        //Price
        // const itemPrice = !priceStructureCheck?.value
        //   ? +itm.price
        //   : +formValues.numItemPrice;
        //total
        const _price = alotementPrice || itm?.price || 0;
        const numOrderValue = _price * itm?.quantity;

        const additionalRate =
          (+addData?.waterProofRate || 0) + (+addData?.pumpChargeRate || 0);

        //netValue
        const netValue =
          selectedBusinessUnit?.value === 175
            ? numOrderValue +
              additionalRate * itm?.quantity -
              itm?.discountValue
            : numOrderValue - (numOrderValue * itm?.discountValue) / 100;
        return {
          ...addData,
          itemId: itm?.itemId,
          itemCode: itm?.itemCode,
          itemName: itm?.itemName,
          numRequestQuantity: +itm?.quantity,
          numItemPrice: _price || 0,
          tempNumItemPrice: _price || 0,
          //numOrderValue: itm?.itemValue,
          numOrderValue:
            selectedBusinessUnit?.value === 94
              ? +itm?.quantity * +addData?.transportRate +
                (+itm?.quantity * +_price || 0) +
                numOrderValue
              : selectedBusinessUnit?.value === 175
              ? +itm?.quantity * additionalRate + numOrderValue
              : +numOrderValue,
          numDiscountValue: itm?.discountValue,
          netValue: netValue,
          isFree: itm?.isFree ? "Yes" : "No",
          uomName: itm?.uomName,
          uomId: itm?.uomId,
        };
      });

      setRowDto([...rowDto, ...newSalesDiscount]);
    }
  };

  //SalesDiscountApiCall
  const SalesDiscountApiCallFunc = (values, addData) => {
    const payload = {
      unitId: selectedBusinessUnit?.value,
      plantId: headerData?.plant?.value,
      plantName: headerData?.plant?.label,
      partnerId: values?.soldtoParty?.value,
      shipToPartnerId: values?.shipToParty?.value,
      channelId: headerData?.distributionChannel?.value,
      salesOrganizationId: headerData?.salesOrg?.value,
      itemId: values?.item?.value,
      quantity: +values?.quantityTop || 0,
      pricingDate: values?.pricingDate,
      serialNo: 0,
      uomId: values?.uom?.value,
      uomName: values?.uom?.label,
    };
    if (isUniq("itemId", payload?.itemId, rowDto)) {
      if (selectedBusinessUnit?.value === 4) {
        // if Akij Cement company business unit
        ifBusinessUnitCement_rowAddFunc(values);
      } else {
        dispatch(
          getSalesDiscount_Action(payload, setDisabled, (salesDiscount) => {
            salesDiscountCB(salesDiscount, addData);
          })
        );
      }
    }
  };

  // row item add handler
  const setter = (values) => {
    const addData = {
      customerItemName: values?.customerItemName,
      referenceNoName: values?.referenceNo?.label,
      shipToPartnerId: values?.shipToParty?.value,
      shipToPartnerName: values?.shipToParty?.label,
      shipToPartnerAddress: values?.shipToParty?.address,
      priceConditionId: priceForInternalUse?.priceConditionId || 0,
      isFreeItem: false,
      specification: "",
      narration: values?.narration,
      numItemPrice: +values.numItemPrice || 0,
      tempNumItemPrice: +values.numItemPrice || 0,
      transportRate: +values?.transportRate || 0,
      isVatPrice: priceForInternalUseVATAX?.isVatPrice || false,
      vatPrice: priceForInternalUseVATAX?.itemPrice || 0,
      waterProofRate: +values?.waterProofRate || 0,
      pumpChargeRate: +values?.pumpChargeRate || 0,
      commissionAgentRate: "",
    };

    if (!values.referenceNo) {
      //WIthout Referance
      // setFormValues(addData);
      SalesDiscountApiCallFunc(values, addData);
    } else {
      if (values.allCheckbox) {
        const additionalRate =
          (+values?.waterProofRate || 0) + (+values?.pumpChargeRate || 0);

        //if Checkbox true
        const allChecItem = referenceWithItemListById.map((itm) => ({
          ...addData,
          itemCode: itm.itemCode,
          itemId: itm.itemId,
          itemName: itm.itemName,
          numItemPrice: +itm.itemPrice + additionalRate,
          tempNumItemPrice: +itm.itemPrice + additionalRate,
          waterProofRate: +values?.waterProofRate || 0,
          pumpChargeRate: +values?.pumpChargeRate || 0,
          numOrderValue: +itm.value + +itm.quantity * additionalRate,
          numRequestQuantity: +itm.quantity,
          uomName: itm.uom,
          uomId: itm.uomId,
          specification: itm.specification || "",
          numDiscountValue: 0,
          netValue: +itm.value + +itm.quantity * additionalRate,
          isFree: "No",
          customerItemName: values?.customerItemName || itm.itemName,
        }));

        const array1 = [...rowDto, ...allChecItem];
        const unique = [
          ...new Map(array1.map((item) => [item["itemId"], item])).values(),
        ];
        setRowDto(unique);
      } else {
        const additionalRate =
          (+values?.waterProofRate || 0) + (+values?.pumpChargeRate || 0);

        //if Checkbox false
        if (referenceItemDetailsById) {
          const referenceItemDetails = {
            ...addData,
            itemCode: referenceItemDetailsById.itemCode,
            itemId: referenceItemDetailsById.itemId,
            itemName: referenceItemDetailsById.itemName,
            numItemPrice: +referenceItemDetailsById.itemPrice + additionalRate,
            tempNumItemPrice:
              +referenceItemDetailsById.itemPrice + additionalRate,
            waterProofRate: +values?.waterProofRate || 0,
            numOrderValue:
              referenceItemDetailsById?.value +
              (+referenceItemDetailsById.quantity * additionalRate || 0),
            numRequestQuantity: +referenceItemDetailsById.quantity,
            uomName: referenceItemDetailsById.uom,
            uomId: referenceItemDetailsById.uomId,
            specification: referenceItemDetailsById.specification || "",
            numDiscountValue: 0,
            netValue:
              referenceItemDetailsById?.value +
              (+referenceItemDetailsById.quantity * additionalRate || 0),
            isFree: "No",
            customerItemName:
              values?.customerItemName || referenceItemDetailsById.itemName,
          };
          if (isUniq("itemId", referenceItemDetails?.itemId, rowDto)) {
            setRowDto([...rowDto, referenceItemDetails]);
          }
        } else {
          toast.warn("Data Not found", { toastId: 456 });
        }
      }
    }
  };

  // //WIthout Referance
  // useEffect(() => {
  //   if (salesDiscount) {
  //     const newSalesDiscount = salesDiscount?.item?.map((itm) => {
  //       //Price
  //       // const itemPrice = !priceStructureCheck?.value
  //       //   ? +itm.price
  //       //   : +formValues.numItemPrice;
  //       //total
  //       const _price = alotementPrice || itm?.price || 0;
  //       const numOrderValue = _price * itm?.quantity;
  //       //netValue
  //       const netValue =
  //         selectedBusinessUnit?.value === 175
  //           ? numOrderValue +
  //             +formValues?.waterProofRate * itm?.quantity -
  //             itm?.discountValue
  //           : numOrderValue - (numOrderValue * itm?.discountValue) / 100;
  //       return {
  //         ...formValues,
  //         itemId: itm?.itemId,
  //         itemCode: itm?.itemCode,
  //         itemName: itm?.itemName,
  //         numRequestQuantity: +itm?.quantity,
  //         numItemPrice: _price || 0,
  //         //numOrderValue: itm?.itemValue,
  //         numOrderValue:
  //           selectedBusinessUnit?.value === 94
  //             ? +itm?.quantity * +formValues?.transportRate +
  //               (+itm?.quantity * +_price || 0) +
  //               numOrderValue
  //             : selectedBusinessUnit?.value === 175
  //             ? +itm?.quantity * +formValues?.waterProofRate + numOrderValue
  //             : +numOrderValue,
  //         numDiscountValue: itm?.discountValue,
  //         netValue: netValue,
  //         isFree: itm?.isFree ? "Yes" : "No",
  //         uomName: itm?.uomName,
  //         uomId: itm?.uomId,
  //       };
  //     });

  //     setRowDto([...rowDto, ...newSalesDiscount]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [salesDiscount]);

  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };
  //Onchange handler with rowdto dynamic key
  const rowDtoHandler = (
    value,
    sl,
    numOrderValue,
    numDiscountValue,
    numItemPrice
  ) => {
    const total = +numItemPrice * +value;
    const discount = (total * numDiscountValue) / 100;
    const cloneArray = [...rowDto];
    cloneArray[sl].numRequestQuantity = +value;
    cloneArray[sl].numOrderValue = +numItemPrice * +value;
    cloneArray[sl].netValue = total - discount;
    setRowDto([...cloneArray]);
  };
  const rowDtoHandlerPrice = (
    value,
    sl,
    numOrderValue,
    numDiscountValue,
    numItemPrice,
    transportRate
  ) => {
    const cloneArray = [...rowDto];
    const total = +cloneArray[sl].numRequestQuantity * value;
    const discount = (total * numDiscountValue) / 100;

    cloneArray[sl].numItemPrice = value;
    cloneArray[sl].numOrderValue =
      selectedBusinessUnit?.value === 94
        ? +transportRate * +cloneArray[sl].numRequestQuantity +
          +cloneArray[sl].numRequestQuantity * value
        : +cloneArray[sl].numRequestQuantity * value;
    cloneArray[sl].netValue = cloneArray[sl].numOrderValue - discount;
    setRowDto([...cloneArray]);
  };

  const itemOnChangeHandler = (currentValue, values, setFieldValue) => {
    var todayDate = new Date().toISOString().slice(0, 10);
    const territoryId =
      selectedBusinessUnit?.value === 4 ? 0 : values?.shipToParty?.territoryId;
    dispatch(
      getPriceForInternalUse_Action(
        selectedBusinessUnit?.value,
        values?.soldtoParty?.value,
        currentValue,
        todayDate,
        territoryId,
        headerData?.distributionChannel?.value,
        headerData?.salesOrg?.value,
        setDisabled,
        setFieldValue,
        selectedBusinessUnit
      )
    );
    dispatch(
      getPriceForInternalUseVATAX_Action(
        selectedBusinessUnit?.value,
        values?.soldtoParty?.value,
        currentValue,
        todayDate,
        territoryId,
        headerData?.distributionChannel?.value,
        headerData?.salesOrg?.value,
        setDisabled,
        setFieldValue,
        selectedBusinessUnit
      )
    );
    if (values?.referenceNo?.value) {
      dispatch(
        getReferenceItemDetailsById_Action(
          values?.refType?.value,
          values?.referenceNo?.value,
          currentValue,
          setFieldValue
        )
      );
    }
    dispatch(
      uoMitemPlantWarehouseDDL_action(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        headerData?.plant?.value,
        currentValue,
        setFieldValue
      )
    );
  };
  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalQty = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        let netAmount = +rowDto[i]?.isVatPrice
          ? (+rowDto[i]?.vatPrice || 0) *
              (+rowDto[i]?.numRequestQuantity || 0) -
            (+rowDto[i]?.numDiscountValue || 0)
          : +rowDto[i].netValue;

        totalAmount += netAmount;
        totalQty += +rowDto[i].numRequestQuantity;
      }
    }
    setTotal({ totalAmount, totalQty });
  }, [rowDto]);

  // edit page Initial action call and data load
  useEffect(() => {
    if (
      id &&
      singleData?.objHeader?.soldToPartnerId &&
      singleData?.objHeader?.refferenceTypeId
    ) {
      dispatch(
        getShipToPartner_Action(
          profileData?.accountId,
          selectedBusinessUnit.value,
          singleData?.objHeader?.soldToPartnerId
        )
      );
      dispatch(
        getPartnerBalance_action(singleData?.objHeader?.soldToPartnerId)
      );
      dispatch(
        getUndeliveryValues_action(singleData?.objHeader?.soldToPartnerId)
      );
      dispatch(
        getPriceStructureCheck_Acion(singleData?.objHeader?.soldToPartnerId, 1)
      );
      dispatch(
        getDiscountStructureCheck_Action(
          singleData?.objHeader?.soldToPartnerId,
          2
        )
      );
      dispatch(
        getAvailableBalance_Action(
          singleData?.objHeader?.soldToPartnerId,
          [+id],
          1
        )
      );
      // if 'Bongo Traders Ltd' BUI Select
      if (singleData?.objHeader?.allotmentId) {
        dispatch(
          getAllocateItemDDLAction(
            profileData?.accountId,
            selectedBusinessUnit.value,
            singleData?.objHeader?.allotmentId
          )
        );
      } else {
        referenceNoHandler(singleData?.objHeader?.refferenceTypeId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, singleData]);

  const salesOrderApprovalHandler = () => {
    if (salesOrderApproveCheck) {
      const callBackFunc = () => {
        history.goBack();
      };
      dispatch(
        getSalesOrderApproval_Aciton(
          headerData?.salesOrderId,
          profileData?.userId,
          callBackFunc
        )
      );
    } else {
      toast.warning("Approval permission not found");
    }
  };

  //landidng page form data condition chack
  useEffect(() => {
    if (!headerData?.orderType?.value && !id) {
      // history.push({
      //   pathname: `/sales-management/ordermanagement/salesorder`,
      // });
      history.goBack();
    }

    if (headerData?.distributionChannel?.value) {
      getChannelBaseCollectionDays(
        selectedBusinessUnit?.value,
        headerData?.distributionChannel?.value,
        selCollectionDays
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);

  useEffect(() => {
    return () => {
      setRowDto([]);
      dispatch(setSalesOrderSingleEmpty());
      dispatch(SetPartnerBalanceEmpty_Action());
      dispatch(SetAvailableBalanceEmpty_Action());
      dispatch(SetUndeliveryValuesEmpty_Action());
      dispatch(SetSalesDiscountEmpty_action());
      dispatch(SetTotalPendingQuantityEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    balanceCheckFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      headerData?.sbu?.value &&
      headerData?.salesOrg?.value &&
      headerData?.shippoint?.value &&
      headerData?.distributionChannel?.value
    ) {
      dispatch(
        getSoldToPartner_Action(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          headerData?.sbu?.value,
          headerData?.salesOrg?.value,
          headerData?.shippoint?.value,
          headerData?.distributionChannel?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, headerData]);

  // cancel handler
  const rejectHandler = (id) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to reject sales order?`,
      yesAlertFunc: () => {
        const payload = {
          salesOrderId: +id,
          businessUnitId: selectedBusinessUnit?.value,
          rejectedBy: profileData?.userId,
        };
        const callBackFunc = () => {
          // history.push(`/sales-management/ordermanagement/salesorder`);
          history.goBack();
        };
        rejectSalesOrder(payload, setDisabled, callBackFunc);
      },
      noAlertFunc: () => {
        // history.push(`/sales-management/ordermanagement/salesorder/edit/${id}`);
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      {(isDisabled || loader) && <Loading />}
      <IForm
        title="Create Sales Order"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        <Form
          {...objProps}
          setDisabled={setDisabled}
          initData={
            singleHeaderData || {
              ...initData,
              collectionDays: collectionDays?.days || 0,
            }
          }
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id || false}
          soldToPartnerDDL={soldToPartnerDDL}
          currencyListDDL={currencyListDDL}
          orderReferanceTypeDDL={orderReferanceTypeDDL}
          BUalesOrgIncotermDDL={BUalesOrgIncotermDDL}
          paymentTermsListDDL={paymentTermsListDDL}
          shipToPartner={shipToPartner}
          itemPlantDDL={itemPlantDDL}
          partnerBalance={partnerBalance}
          rowDto={rowDto}
          setter={setter}
          referenceNoHandler={referenceNoHandler}
          referenceNo={referenceNo}
          remover={remover}
          rowDtoHandler={rowDtoHandler}
          itemUOMDDL={itemUOMDDL}
          undeliveryValues={undeliveryValues}
          priceStructureCheck={priceStructureCheck}
          itemOnChangeHandler={itemOnChangeHandler}
          total={total}
          availableBalance={availableBalance}
          salesOrderApprovalHandler={salesOrderApprovalHandler}
          modalShow={modalShow}
          setModalShow={setModalShow}
          createSaveData={createSaveData}
          setRowDto={setRowDto}
          setSingleHeaderData={setSingleHeaderData}
          rowDtoHandlerPrice={rowDtoHandlerPrice}
          headerData={headerData}
          creditLimitForInternalUser={creditLimitForInternalUser}
          rejectHandler={rejectHandler}
          id={id}
          profileData={profileData}
          alotementDDL={alotementDDL}
          setAlotementPrice={setAlotementPrice}
          balanceCheckFunc={balanceCheckFunc}
          transportZoneDDL={transportZoneDDL}
          collectionDays={collectionDays}
          getCommissionRatesForEssential={getCommissionRatesForEssential}
          brokerDDL={brokerDDL}
        />
      </IForm>
    </>
  );
}
