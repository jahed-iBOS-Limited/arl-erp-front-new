import Axios from "axios";
// import { toast } from "react-toastify";

// territoryDDL Api call
export const getTerritoryDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
// CustomerDDl Api call
export const  getCustomerDDL = async (accId, buId, territoryId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetCustomerDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerrytoryId=${territoryId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//InventoryStatement_api Api call
export const inventoryStatement_api = async (
  partnerId,
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setinventoryStatementAllData
) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMInvReport/RTMInvReport?businesspartnerid=${partnerId}&accountId=${accId}&businessunitId=${buId}&fromdate=${fromDate}&todate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.result?.objrow);
      setinventoryStatementAllData(res?.data?.result?.objrow);
    }
  } catch (error) {
    
  }
};

//InventoryStatement_api Api call
export const InventoryLedger_api = async (
  partnerId,
  accId,
  buId,
  fromDate,
  toDate,
  setter
) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMInvReport/RTMInvReport?businesspartnerid=${partnerId}&accountId=${accId}&businessunitId=${buId}&fromdate=${fromDate}&todate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.result?.objrow);
    }
  } catch (error) {
    
  }
};
