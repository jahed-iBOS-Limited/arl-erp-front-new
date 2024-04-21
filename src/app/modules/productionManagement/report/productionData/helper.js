import axios from "axios";

export const getPlantNameDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getShopfloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetProductionDataReport = async ({
  accId,
  buId,
  sId,
  itemId,
  billType,
  fromDate,
  toDate,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetProductionDataReport?AccountId=${accId}&BusinessUnitId=${buId}&ShopFloorId=${sId}&fromDate=${fromDate}&toDate=${toDate}&ItemId=${itemId}&BomTypeId=${billType}`
    );
    const data = [...res?.data];
    let newData = data.map((item, index, data) => {
      let itemOrderNumberMatchResult = {};
      let itemMatchResult = {};
      const isItemOrderNumberMatch =
        item?.itemId !== data[index - 1]?.itemId ||
        item?.productionOrderId !== data[index - 1]?.productionOrderId;
        const isItemMatch =
        item?.itemId !== data[index - 1]?.itemId 

      if (index === 0 || isItemOrderNumberMatch) {
        itemOrderNumberMatchResult = itemOrderNumberMatchFn(item, index, data);
      }
      if (index === 0 || isItemMatch) {
        itemMatchResult = itemMatchFn(item, index, data);
      }
      return {
        ...item,
        itemOrderNumberCount: itemOrderNumberMatchResult.count || 0,
        totalSubTotalMT: itemOrderNumberMatchResult.totalSubTotalMT || 0,
        itemMatchCount: itemMatchResult.count || 0,
        totalTotalMT: itemMatchResult.totalTotalMT || 0,
      };
    });
    // console.log(newData, "newData");
    setter(newData);
    setLoading(false);
  } catch (error) {
    console.log(error, "error");
    setter([]);
    setLoading(false);
  }
};

let itemOrderNumberMatchFn = (item, index, data) => {
  let count = 0;
  let totalSubTotalMT = 0;
  for (let i = index; i < data.length; i++) {
    const isPrvItemMatch =
      item?.itemId === data[i]?.itemId &&
      item?.productionOrderId === data[i]?.productionOrderId;
    if (isPrvItemMatch) {
      count++;
      totalSubTotalMT += +data[i]?.subTotalMT || 0;
    } else {
      break;
    }
  }
  return {
    count,
    totalSubTotalMT,
  };
};

let itemMatchFn = (item, index, data) => {
  let count = 0;
  let totalTotalMT = 0;
  for (let i = index; i < data.length; i++) {
    const isPrvItemMatch = item?.itemId === data[i]?.itemId;
    if (isPrvItemMatch) {
      count++;
      totalTotalMT += +data[i]?.subTotalMT || 0;
    } else {
      break;
    }
  }
  return {
    count,
    totalTotalMT,
  };
};

// itemName ddl
export const getItemNameDDL = async (accId, buId, plantId, sid, setter) => {
  try {
    const res = await axios.get(
      // previous api - /mes/MesDDL/GetItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}
      `/mes/MesDDL/GetItemNameByBOMandRouting?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${sid}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + " [" + item?.code + "]",
          };
        })
      );
    }
  } catch (error) {}
};
