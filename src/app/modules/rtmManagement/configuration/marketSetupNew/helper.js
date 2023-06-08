import axios from "axios";
import { toast } from "react-toastify";



export const getSalesTerritoryGridData = async (accId, buId, setter) => {
  try {
    const res= await axios.get(
      `/rtm/MarketSetupNew/GethierarchyTree?AccountId=${accId}&BusinessUnitId=${buId}`
    )
    setter(res?.data)
  } catch (err) {

  }
};

export const createSalesTerritory = async (data) => {
  try {
    const res= await axios.post(`/oms/TerritoryInfo/CreateTerritoryInfo`, data)
    if (res.status === 200) {
      toast.success(res?.data?.message);
    }
  } catch (err) {

  }
};
