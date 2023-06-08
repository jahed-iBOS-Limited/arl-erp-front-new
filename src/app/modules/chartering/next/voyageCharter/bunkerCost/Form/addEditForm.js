/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation, useHistory } from "react-router";
import Form from "./form";
import { toast } from "react-toastify";
import { saveBunkerCost } from "../helper";
import Loading from "../../../../_chartinghelper/loading/_loading";

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

export default function NextBunkerCostForm() {
  const { type, id } = useParams();
  const { state: preData } = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [consumption, setConsumption] = useState([]);
  const [bunkerPurchaseList, setBunkerPurchaseList] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

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
      Number(Lsmgo) !== consumption?.consumptionLsmgoqty ||
      Number(Lsfo1) !== consumption?.consumptionLsfo1qty ||
      Number(Lsfo2) !== consumption?.consumptionLsfo2qty
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
      saveBunkerCost(payload, setLoading, () => {
        cb();
        history.push({
          pathname: `/chartering/next/expense`,
          state: preData,
        });
      });
    }
  };

  const rowDtoHandler = (key, value, index) => {
    let data = [...bunkerPurchaseList];
    data[index][key] = value;
    data[index]["itemCost"] = bunkerPurchaseList[index]["itemRate"] * value;
    data[index]["remainingQty"] = value
      ? bunkerPurchaseList[index]["remaining"] -
        Number(bunkerPurchaseList[index]["consumption"])
      : data[index]["remaining"];
    setBunkerPurchaseList(data);
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title="Create Bunker Cost"
        initData={{ ...initData, ...preData }}
        saveHandler={saveHandler}
        viewType={type}
        setLoading={setLoading}
        consumptionHeader={consumptionHeader}
        consumption={consumption}
        setConsumption={setConsumption}
        bunkerPurchaseList={bunkerPurchaseList}
        setBunkerPurchaseList={setBunkerPurchaseList}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDtoHandler={rowDtoHandler}
      />
    </>
  );
}
