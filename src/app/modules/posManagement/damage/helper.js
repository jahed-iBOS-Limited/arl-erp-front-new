// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "./../../_helper/_todayDate";


export const getWareHouseDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/Warehouse/GetWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getItemDDL = async (accId, buId, whId, setter) => {
  try {
    const res = await axios.get(
      `/item/ItemSales/GetItemSalesforPOSDDL?AccountId=${accId}&BUnitId=${buId}&WarehouseId=${whId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const damageEntryLandingData= async (accId, buId, isLoading, setter, pageNo, pageSize)=>{
  try {
    isLoading(true)
    const res = await axios.get(
      `/oms/POSDamageEntry/GetDamageEntryLandingPasignation?accountId=${accId}&businessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
    );
    setter(res?.data);
    isLoading(false);
  } catch (error) {
    setter([]);
    isLoading(false);
  }
}

export const getDamageItemById = async (damageEntryId, setHeader, setRow) => {
  try {
    const res = await axios.get(
      `/oms/POSDamageEntry/GetDamageEntryById?damageEntryId=${damageEntryId}`
    );
    const header=res?.data?.objheader
    const resHeader={
      whName:{
        label:header?.warehouseName,
        value:header?.warehouseId
      },
      dteDamageEntryDate: _todayDate(header?.dteDamageEntryDate),
      ...header
    }
    setHeader(resHeader);
    setRow(res?.data?.objrow);
  } catch (error) {
  }
};

export const saveSalesDamage= async (payload) => {
  try{
    const res=await axios.post("/oms/POSDamageEntry/CreateDamageEntry", payload)
    if(res?.status=== 200){
      toast.success(res?.data?.message);
    }
  }catch (error) {
    toast.error(
      error?.response?.data?.message
    );
  }
}

export const editSalesDamage= async (payload) => {
  try{
    const res=await axios.put("/oms/POSDamageEntry/EditDamageEntry", payload)
    if(res?.status=== 200){
      toast.success(res?.data?.message);
    }
  }catch (error) {
    toast.error(
      error?.response?.data?.message
    );
  }
}