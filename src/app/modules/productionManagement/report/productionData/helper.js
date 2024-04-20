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
      let result = {};
      if (index === 0 || item?.itemId !== data[index - 1]?.itemId) {
        result = itemMatchFn(item?.itemId, index, data);
      }
      return {
        ...item,
        count: result.count || 0,
        totalProductionQty: result.totalProductionQty || 0,
      };
    });
    console.log(data, "data")
    setter(newData);
    setLoading(false);
  } catch (error) {
    console.log(error, "error")
    setter([]);
    setLoading(false);
  }
};

let itemMatchFn = (itemId, index, data) => {
  let count = 0;
  let totalProductionQty = 0;
  for (let i = index; i < data.length; i++) {
    if (data[i]?.itemId === itemId) {
      count++;
      totalProductionQty += +data[i]?.productionQty || 0;
    } else {
      break;
    }
  }
  return {
    count,
    totalProductionQty,
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
