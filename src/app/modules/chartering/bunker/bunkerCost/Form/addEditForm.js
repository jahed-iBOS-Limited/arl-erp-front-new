/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import Form from "./form";
import { toast } from "react-toastify";
import { GetBunkerCostById, saveBunkerCost } from "../helper";
import { getVesselDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";

const initData = {
  vesselName: "",
  voyageNo: "",
};

const consumptionHeader = [
  { name: "SL" },
  { name: "Item Name" },
  { name: "Consumption" },
  { name: "Added Consumption" },
];

export default function BunkerCostForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageDDL, setVoyageDDL] = useState([]);
  const [consumption, setConsumption] = useState([]);
  const [bunkerPurchaseList, setBunkerPurchaseList] = useState([]);
  const [singleData, setSingleData] = useState({});

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
    if (id) {
      GetBunkerCostById(
        id,
        setSingleData,
        setBunkerPurchaseList,
        setConsumption,
        setLoading
      );
    }
  }, [profileData, selectedBusinessUnit, id]);

  const saveHandler = (values, cb) => {
    const Lsmgo = bunkerPurchaseList
      ?.filter((item) => item?.itemId === 1)
      .reduce((acc, curr) => acc + Number(curr?.consumption), 0);

    const Lsfo1 = bunkerPurchaseList
      ?.filter((item) => item?.itemId === 2)
      .reduce((acc, curr) => acc + Number(curr?.consumption), 0);

    const Lsfo2 = bunkerPurchaseList
      ?.filter((item) => item?.itemId === 3)
      .reduce((acc, curr) => acc + Number(curr?.consumption), 0);

    if (
      Number(Lsmgo.toFixed(2)) !==
        Number(consumption?.consumptionLsmgoqty.toFixed(2)) ||
      Number(Lsfo1.toFixed(2)) !==
        Number(consumption?.consumptionLsfo1qty.toFixed(2)) ||
      Number(Lsfo2.toFixed(2)) !==
        Number(consumption?.consumptionLsfo2qty.toFixed(2))
    ) {
      return toast.error("Please check consumption adjustment");
    }

    if (id) {
      if (
        bunkerPurchaseList?.filter(
          (item) => item?.remaining < item?.consumption
        )?.length
      )
        toast.error(
          "Consumption can not be greater than remaining quantity. So, Please check the consumptions"
        );

      // editVoyage(data, setLoading, cb);
    } else {
      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          vesselId: values?.vesselName?.value,
          vesselName: values?.vesselName?.label,
          voyageId: values?.voyageNo?.value,
          vonageName: values?.voyageNo?.label,
          bunkerInformationId: consumption?.bunkerInformationId,
          adjustQtyLsmgo: consumption?.adjustmentLsmgoQty,
          adjustQtyLsfo1: consumption?.adjustmentLsfo1Qty,
          adjustQtyLsfo2: consumption?.adjustmentLsfo2Qty,
          consmQtyLsmgo: consumption?.consumptionLsmgoqty,
          consmQtyLsfo1: consumption?.consumptionLsfo1qty,
          consmQtyLsfo2: consumption?.consumptionLsfo2qty,
          actionBy: profileData?.userId,
          totalBunkerCost: bunkerPurchaseList?.reduce(
            (acc, curr) => acc + Number(curr?.itemCost),
            0
          ),
        },
        objRow: bunkerPurchaseList?.map((item) => ({
          itemId: item?.itemId,
          itemName: item?.itemName,
          purchaseId: item?.purchaseBunkerHeaderId,
          purchaseRowId: item?.purchaseBunkerRowId,
          purchaseDate: item?.dtePurchaseDate,
          purchaseQty: +item?.itemQty,
          purchaseRate: +item?.itemRate,
          consumptionQty: +item?.consumption,
          consumptionValue: +item?.cost || 0,
        })),
      };
      saveBunkerCost(payload, setLoading, cb);
    }
  };

  const rowDtoHandler = (key, value, index) => {
    let data = [...bunkerPurchaseList];
    data[index][key] = value;
    data[index]["itemCost"] = Number(
      (bunkerPurchaseList[index]["itemRate"] * value).toFixed(2)
    );
    data[index]["remainingQty"] = value
      ? Number(
          (
            bunkerPurchaseList[index]["remaining"] -
            Number(bunkerPurchaseList[index]["consumption"])
          )?.toFixed(2)
        )
      : Number(data[index]["remaining"]?.toFixed(2));
    setBunkerPurchaseList(data);
  };

  const title =
    type === "view"
      ? "View Bunker Cost"
      : type === "edit"
      ? "Edit Bunker Cost"
      : "Create Bunker Cost";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        voyageDDL={voyageDDL}
        setVoyageDDL={setVoyageDDL}
        setLoading={setLoading}
        consumptionHeader={consumptionHeader}
        consumption={consumption}
        setConsumption={setConsumption}
        bunkerPurchaseList={bunkerPurchaseList}
        setBunkerPurchaseList={setBunkerPurchaseList}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDtoHandler={rowDtoHandler}
        profileData={profileData}
      />
    </>
  );
}
