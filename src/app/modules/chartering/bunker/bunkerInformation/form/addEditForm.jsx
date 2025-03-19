/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import Form from "./form";
import {
  editBunkerInformation,
  GetBunkerInformationById,
  GetItemInfoFromPurchase,
  getItemRateByVoyageId,
  saveBunkerInformation,
} from "../helper";
import { useLocation, useHistory } from "react-router-dom";
import { getVesselDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import { savePurchaseBunker } from "../../purchaseBunker/helper";
import { toast } from "react-toastify";

const initData = {
  vesselName: "",
  voyageNo: "",
  voyageType: "",
  bodLsmgoQty: "",
  bodLsfo1Qty: "",
  bodLsfo2Qty: "",
  borLsmgoQty: "",
  borLsfo1Qty: "",
  borLsfo2Qty: "",
  adjustmentLsmgoQty: "",
  adjustmentLsfo1Qty: "",
  adjustmentLsfo2Qty: "",
  bunkerSaleLsmgoQty: "",
  bunkerSaleLsmgoRate: "",
  bunkerSaleLsmgoValue: "",
  bunkerSaleLsfo1Qty: "",
  bunkerSaleLsfo1Rate: "",
  bunkerSaleLsfo1Value: "",
  bunkerSaleLsfo2Qty: "",
  bunkerSaleLsfo2Rate: "",
  bunkerSaleLsfo2Value: "",
  consumptionLsmgoQty: "",
  consumptionLsfo1Qty: "",
  consumptionLsfo2Qty: "",
  bunkerPurchaseLsmgoQty: "",
  bunkerPurchaseLsmgoRate: "",
  bunkerPurchaseLsmgoValue: "",
  bunkerPurchaseLsfo1Qty: "",
  bunkerPurchaseLsfo1Rate: "",
  bunkerPurchaseLsfo1Value: "",
  bunkerPurchaseLsfo2Qty: "",
  bunkerPurchaseLsfo2Rate: "",
  bunkerPurchaseLsfo2Value: "",
  hireType: "",
  isComplete: false,
};

export default function BunkerInfoForm() {
  const { charterType, type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [purchaseList, setPurchaseList] = React.useState([]);
  const [returnID, setReturnID] = useState("");
  const [singleData, setSingleData] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [itemRates, setItemRates] = useState({});
  const { state } = useLocation();
  const history = useHistory();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    if (state?.voyageTypeName) {
      GetItemInfoFromPurchase(
        selectedBusinessUnit?.value,
        state?.vesselId,
        state?.voyageNoId,
        setPurchaseList,
        setLoading
      );
    }
    if (id) {
      GetBunkerInformationById(id, setSingleData, setLoading, (data) => {
        getItemRateByVoyageId(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          data?.vesselId,
          data?.voyageNoId,
          setLoading,
          setItemRates
        );
      });
    }
  }, [profileData, selectedBusinessUnit, state, id]);

  const saveHandler = (values, cb) => {
    // checking is complete by BOR Quantities
    // const isComplete =
    //   Number(values?.borLsmgoQty) > 0 ||
    //   Number(values?.borLsfo1Qty) > 0 ||
    //   Number(values?.borLsfo2Qty) > 0;

    if (
      !returnID &&
      (values?.voyageNo?.voyageTypeName || values?.voyageType) ===
        "Time Charter" &&
      values?.isComplete
    ) {
      return toast.warn("Please purchase bunker first");
    }

    if (id) {
      const data = {
        bunkerInformationId: id,
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageNoId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        bodLsmgoQty: +values?.bodLsmgoQty,
        voyageTypeId: values?.voyageNo?.voyageTypeID || values?.voyageTypeId,
        voyageTypeName: values?.voyageNo?.voyageTypeName || values?.voyageType,
        bodLsfo1Qty: +values?.bodLsfo1Qty,
        bodLsfo2Qty: +values?.bodLsfo2Qty,
        borLsmgoQty: +values?.borLsmgoQty,
        borLsfo1Qty: +values?.borLsfo1Qty,
        borLsfo2Qty: +values?.borLsfo2Qty,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        adjustmentLsmgoQty: +values?.adjustmentLsmgoQty,
        adjustmentLsfo1Qty: +values?.adjustmentLsfo1Qty,
        adjustmentLsfo2Qty: +values?.adjustmentLsfo2Qty,
        consumptionLsmgoQty: +values?.consumptionLsmgoQty,
        consumptionLsfo1Qty: +values?.consumptionLsfo1Qty,
        consumptionLsfo2Qty: +values?.consumptionLsfo2Qty,
        bunkerSaleLsmgoQty: +values?.bunkerSaleLsmgoQty,
        bunkerSaleLsmgoRate: +values?.bunkerSaleLsmgoRate,
        bunkerSaleLsmgoValue: +values?.bunkerSaleLsmgoValue,
        bunkerSaleLsfo1Qty: +values?.bunkerSaleLsfo1Qty,
        bunkerSaleLsfo1Rate: +values?.bunkerSaleLsfo1Rate,
        bunkerSaleLsfo1Value: +values?.bunkerSaleLsfo1Value,
        bunkerSaleLsfo2Qty: +values?.bunkerSaleLsfo2Qty,
        bunkerSaleLsfo2Rate: +values?.bunkerSaleLsfo2Rate,
        bunkerSaleLsfo2Value: +values?.bunkerSaleLsfo2Value,
        complete: values?.isComplete,
        isComplete: values?.isComplete,
      };
      editBunkerInformation(data, setLoading, () => {
        history.push("/chartering/bunker/bunkerInformation");
      });
    } else {
      const payload = {
        vesselId: values?.vesselName?.value,
        vesselName: values?.vesselName?.label,
        voyageNoId: values?.voyageNo?.value,
        voyageNo: values?.voyageNo?.label,
        bodLsmgoQty: +values?.bodLsmgoQty,
        voyageTypeId: values?.voyageNo?.voyageTypeID,
        voyageTypeName: values?.voyageNo?.voyageTypeName,
        bodLsfo1Qty: +values?.bodLsfo1Qty,
        bodLsfo2Qty: +values?.bodLsfo2Qty,
        borLsmgoQty: +values?.borLsmgoQty,
        borLsfo1Qty: +values?.borLsfo1Qty,
        borLsfo2Qty: +values?.borLsfo2Qty,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
        adjustmentLsmgoQty: +values?.adjustmentLsmgoQty,
        adjustmentLsfo1Qty: +values?.adjustmentLsfo1Qty,
        adjustmentLsfo2Qty: +values?.adjustmentLsfo2Qty,
        consumptionLsmgoQty: +values?.consumptionLsmgoQty,
        consumptionLsfo1Qty: +values?.consumptionLsfo1Qty,
        consumptionLsfo2Qty: +values?.consumptionLsfo2Qty,
        bunkerSaleLsmgoQty: +values?.bunkerSaleLsmgoQty,
        bunkerSaleLsmgoRate: +values?.bunkerSaleLsmgoRate,
        bunkerSaleLsmgoValue: +values?.bunkerSaleLsmgoValue,
        bunkerSaleLsfo1Qty: +values?.bunkerSaleLsfo1Qty,
        bunkerSaleLsfo1Rate: +values?.bunkerSaleLsfo1Rate,
        bunkerSaleLsfo1Value: +values?.bunkerSaleLsfo1Value,
        bunkerSaleLsfo2Qty: +values?.bunkerSaleLsfo2Qty,
        bunkerSaleLsfo2Rate: +values?.bunkerSaleLsfo2Rate,
        bunkerSaleLsfo2Value: +values?.bunkerSaleLsfo2Value,
        complete: values?.isComplete,
        isComplete: values?.isComplete,
      };
      saveBunkerInformation(payload, setLoading, cb);
    }
  };

  const bunkerPurchase = (values, cb) => {
    const rowArray = [];
    if (values?.bunkerPurchaseLsmgoQty > 0) {
      rowArray.push({
        itemName: "LSMGO",
        itemId: 1,
        itemQty: +values?.bunkerPurchaseLsmgoQty,
        itemRate: +values?.bunkerPurchaseLsmgoRate,
        itemValue: +values?.bunkerPurchaseLsmgoValue,
        dollarRate: 0,
        remaining: 0,
        consumption: +values?.consumptionLsmgoQty,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
      });
    }
    if (values?.bunkerPurchaseLsfo1Qty) {
      rowArray.push({
        itemName: "LSFO-1",
        itemId: 2,
        itemQty: +values?.bunkerPurchaseLsfo1Qty,
        itemRate: +values?.bunkerPurchaseLsfo1Rate,
        itemValue: +values?.bunkerPurchaseLsfo1Value,
        dollarRate: 0,
        remaining: 0,
        consumption: +values?.consumptionLsfo1Qty,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
      });
    }
    if (values?.bunkerPurchaseLsfo2Qty > 0) {
      rowArray.push({
        itemName: "LSFO-2",
        itemId: 3,
        itemQty: +values?.bunkerPurchaseLsfo2Qty,
        itemRate: +values?.bunkerPurchaseLsfo2Rate,
        itemValue: +values?.bunkerPurchaseLsfo2Value,
        dollarRate: 0,
        remaining: 0,
        consumption: +values?.consumptionLsfo2Qty,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        insertby: profileData?.userId,
      });
    }

    const payload = {
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageId: values?.voyageNo?.value,
      voyageNo: values?.voyageNo?.label,
      purchaseFromId: 2,
      purchaseFromName: "Charterer",
      stakeholderId: values?.voyageNo?.chaterId,
      companyName: values?.voyageNo?.chaterName,
      portId: 0,
      portName: "",
      purchaseDate: _todayDate(),
      currencyId: 0,
      currencyName: "",
      itemId: 0,
      itemName: "",
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      insertby: profileData?.userId,
      purchaseBunkerRow: rowArray,
    };
    if (rowArray?.length > 0) {
      savePurchaseBunker(
        payload,
        setLoading,
        () => {
          // cb("don'tShowMessage");
        },
        setReturnID
      );
    }
    // else {
    //   cb("showMessage");
    // }
  };

  const getConsumption = (values, setFieldValue) => {
    const Lsmgo = purchaseList
      ?.filter((item) => item?.itemId === 1)
      .reduce((acc, curr) => acc + curr?.itemQty, 0);

    const Lsfo1 = purchaseList
      ?.filter((item) => item?.itemId === 2)
      .reduce((acc, curr) => acc + curr?.itemQty, 0);

    const Lsfo2 = purchaseList
      ?.filter((item) => item?.itemId === 3)
      .reduce((acc, curr) => acc + curr?.itemQty, 0);

    const lsmgoConsumption =
      Lsmgo +
      values?.bodLsmgoQty +
      values?.adjustmentLsmgoQty -
      values?.borLsmgoQty;

    const lsfo1Consumption =
      Lsfo1 +
      values?.bodLsfo1Qty +
      values?.adjustmentLsfo1Qty -
      values?.borLsfo1Qty;

    const lsfo2Consumption =
      Lsfo2 +
      values?.bodLsfo2Qty +
      values?.adjustmentLsfo2Qty -
      values?.borLsfo2Qty;
    setFieldValue("consumptionLsmgoQty", Number(lsmgoConsumption.toFixed(2)));
    setFieldValue("consumptionLsfo1Qty", Number(lsfo1Consumption.toFixed(2)));
    setFieldValue("consumptionLsfo2Qty", Number(lsfo2Consumption.toFixed(2)));
    setIsCalculated(true);
  };

  const modifiedSingleData = {
    ...singleData,
    vesselName: {
      value: singleData?.vesselId,
      label: singleData?.vesselName,
    },
    voyageNo: {
      value: singleData?.voyageNoId,
      label: singleData?.voyageNo,
    },
    voyageType: singleData?.voyageTypeName,
    voyageTypeId: singleData?.voyageTypeId,
    bunkerSaleLsmgoRate: itemRates?.lsmgoPrice,
    bunkerSaleLsfo1Rate: itemRates?.lsifoPrice,
    bunkerSaleLsfo2Rate: itemRates?.lsifoPrice,
    bunkerPurchaseLsmgoRate: itemRates?.lsmgoPrice,
    bunkerPurchaseLsfo1Rate: itemRates?.lsifoPrice,
    bunkerPurchaseLsfo2Rate: itemRates?.lsifoPrice,
    hireType: singleData?.hireTypeName,
    isComplete: singleData?.complete,
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        initData={id ? modifiedSingleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        charterType={charterType}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        bunkerPurchase={bunkerPurchase}
        setPurchaseList={setPurchaseList}
        purchaseList={purchaseList}
        getConsumption={getConsumption}
        returnID={returnID}
        isCalculated={isCalculated}
        setItemRates={setItemRates}
        hireType={singleData?.hireTypeName}
      />
    </>
  );
}
