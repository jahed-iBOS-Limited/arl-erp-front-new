/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  GetItemInfoFromPurchase,
  getPreBORInformationByVoyageId,
  saveBunkerInformation,
} from "../helper";
import { useLocation, useHistory } from "react-router-dom";
// import { _todayDate } from "../../../../_chartinghelper/_todayDate";
import Loading from "../../../../_chartinghelper/loading/_loading";

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
};

export default function NextBunkerInfoForm() {
  // const { charterType, type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [purchaseList, setPurchaseList] = React.useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [preBOR, setPreBOR] = useState({});
  const { state: preData } = useLocation();
  const history = useHistory();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (preData?.voyageNo?.label !== "1") {
      getPreBORInformationByVoyageId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        preData?.vesselName?.value,
        preData?.voyageNo?.value,
        setPreBOR,
        setLoading
      );
    }

    GetItemInfoFromPurchase(
      selectedBusinessUnit?.value,
      preData?.vesselName?.value,
      preData?.voyageNo?.value,
      setPurchaseList,
      setLoading
    );
  }, [preData, selectedBusinessUnit, profileData]);

  const saveHandler = (values, cb) => {
    // checking is complete by BOR Quantities
    // const isComplete =
    //   Number(values?.borLsmgoQty) > 0 ||
    //   Number(values?.borLsfo1Qty) > 0 ||
    //   Number(values?.borLsfo2Qty) > 0;

    const payload = {
      vesselId: values?.vesselName?.value,
      vesselName: values?.vesselName?.label,
      voyageNoId: values?.voyageNo?.value,
      voyageNo: values?.voyageNo?.label,
      bodLsmgoQty: +values?.bodLsmgoQty,
      voyageTypeId: values?.voyageType?.value,
      voyageTypeName: values?.voyageType?.label,
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
      isComplete: false,
    };
    saveBunkerInformation(payload, setLoading, () => {
      cb();
      history.push({
        pathname: `/chartering/next/${
          preData?.voyageType?.value === 1 ? "ballastPassage" : "bunkerCost"
        }`,
        state: preData,
      });
    });
  };

  // const bunkerPurchase = (values, cb) => {
  //   const rowArray = [];
  //   if (values?.bunkerPurchaseLsmgoQty > 0) {
  //     rowArray.push({
  //       itemName: "LSMGO",
  //       itemId: 1,
  //       itemQty: +values?.bunkerPurchaseLsmgoQty,
  //       itemRate: +values?.bunkerPurchaseLsmgoRate,
  //       itemValue: +values?.bunkerPurchaseLsmgoValue,
  //       dollarRate: 0,
  //       remaining: 0,
  //       consumption: +values?.consumptionLsmgoQty,
  //       accountId: profileData?.accountId,
  //       businessUnitId: selectedBusinessUnit?.value,
  //       insertby: profileData?.userId,
  //     });
  //   }
  //   if (values?.bunkerPurchaseLsfo1Qty) {
  //     rowArray.push({
  //       itemName: "LSFO-1",
  //       itemId: 2,
  //       itemQty: +values?.bunkerPurchaseLsfo1Qty,
  //       itemRate: +values?.bunkerPurchaseLsfo1Rate,
  //       itemValue: +values?.bunkerPurchaseLsfo1Value,
  //       dollarRate: 0,
  //       remaining: 0,
  //       consumption: +values?.consumptionLsfo1Qty,
  //       accountId: profileData?.accountId,
  //       businessUnitId: selectedBusinessUnit?.value,
  //       insertby: profileData?.userId,
  //     });
  //   }
  //   if (values?.bunkerPurchaseLsfo2Qty > 0) {
  //     rowArray.push({
  //       itemName: "LSFO-2",
  //       itemId: 3,
  //       itemQty: +values?.bunkerPurchaseLsfo2Qty,
  //       itemRate: +values?.bunkerPurchaseLsfo2Rate,
  //       itemValue: +values?.bunkerPurchaseLsfo2Value,
  //       dollarRate: 0,
  //       remaining: 0,
  //       consumption: +values?.consumptionLsfo2Qty,
  //       accountId: profileData?.accountId,
  //       businessUnitId: selectedBusinessUnit?.value,
  //       insertby: profileData?.userId,
  //     });
  //   }

  //   const payload = {
  //     vesselId: values?.vesselName?.value,
  //     vesselName: values?.vesselName?.label,
  //     voyageId: values?.voyageNo?.value,
  //     voyageNo: values?.voyageNo?.label,
  //     purchaseFromId: 2,
  //     purchaseFromName: "Charterer",
  //     stakeholderId: values?.voyageNo?.chaterId,
  //     companyName: values?.voyageNo?.chaterName,
  //     portId: 0,
  //     portName: "",
  //     purchaseDate: _todayDate(),
  //     currencyId: 0,
  //     currencyName: "",
  //     itemId: 0,
  //     itemName: "",
  //     accountId: profileData?.accountId,
  //     businessUnitId: selectedBusinessUnit?.value,
  //     insertby: profileData?.userId,
  //     purchaseBunkerRow: rowArray,
  //   };
  //   if (rowArray?.length > 0) {
  //     savePurchaseBunker(payload, setLoading, () => {
  //       cb("don'tShowMessage");
  //     });
  //   } else {
  //     cb("showMessage");
  //   }
  // };

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
      +values?.bodLsmgoQty +
      +values?.adjustmentLsmgoQty -
      +values?.borLsmgoQty;

    const lsfo1Consumption =
      Lsfo1 +
      +values?.bodLsfo1Qty +
      +values?.adjustmentLsfo1Qty -
      +values?.borLsfo1Qty;

    const lsfo2Consumption =
      Lsfo2 +
      values?.bodLsfo2Qty +
      values?.adjustmentLsfo2Qty -
      values?.borLsfo2Qty;
    setFieldValue("consumptionLsmgoQty", lsmgoConsumption);
    setFieldValue("consumptionLsfo1Qty", lsfo1Consumption);
    setFieldValue("consumptionLsfo2Qty", lsfo2Consumption);
    setIsCalculated(true);
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        initData={{
          ...initData,
          ...preData,
          bodLsmgoQty: preBOR?.borLsmgoQty,
          bodLsfo1Qty: preBOR?.borLsfo1Qty,
          bodLsfo2Qty: preBOR?.borLsfo2Qty,
          bunkerSaleLsmgoRate: preData?.lsmgoRate,
          bunkerSaleLsfo1Rate: preData?.lsfo1Rate,
          bunkerSaleLsfo2Rate: preData?.lsfo2Rate,
          bunkerPurchaseLsmgoRate: preData?.lsmgoRate,
          bunkerPurchaseLsfo1Rate: preData?.lsfo1Rate,
          bunkerPurchaseLsfo2Rate: preData?.lsfo2Rate,
        }}
        saveHandler={saveHandler}
        setLoading={setLoading}
        // bunkerPurchase={bunkerPurchase}
        setPurchaseList={setPurchaseList}
        purchaseList={purchaseList}
        getConsumption={getConsumption}
        isCalculated={isCalculated}
      />
    </>
  );
}
