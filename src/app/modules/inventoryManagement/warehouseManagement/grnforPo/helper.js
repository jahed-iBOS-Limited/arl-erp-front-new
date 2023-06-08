import Axios from "axios";
import { toast } from "react-toastify";
// import { _dateFormatter } from "./../../../_helper/_dateFormate";

export const getSbuDDL = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${BuId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getPlantDDL = async (userId,accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getWareHouseDDL = async (accId, BuId, plntId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${BuId}&PlantId=${plntId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getTransactinGrpDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetTransectionGroupDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getRefTypeDDL = async (grpId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetReferenceTypeDDL?InvTGoupId=${grpId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getRefNoDDL = async (
  trnGrpId,
  refTypeId,
  refTypeName,
  accId,
  buId,
  sbuId,
  plntId,
  wrhID,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetReferenceNo?InvTransGroupId=${trnGrpId}&InvTrnsRefTypeId=${refTypeId}&InvTrnsRefTypeName=${refTypeName}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plntId}&WearhouseId=${wrhID}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getTransactionTypeDDL = async (invGrpId, refTypeId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetTransectionTypeDDL?InvTGoupId=${invGrpId}&RefenceTypeId=${refTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getInvLocationDDL = async (accId, buId, plntId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryLocation/GetInventoryLocationDDL?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plntId}&WhId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getInvStockTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetInventoryStockDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getBusinessPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getEmployeeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getItemDDL = async (accId, buId, plantId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&WhId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      // alert("fetched location")
      setter(res?.data);
    }
  } catch (error) {
    // alert("error")
    
  }
};

export const getGridData = async (
  accId,
  BuId,
  sbuId,
  plntId,
  wireHouseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetInventoryTransectionPagination?accountId=${accId}&businessUnitId=${BuId}&sbuId=${sbuId}&plantId=${plntId}&warehouse=${wireHouseId}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {
    
  }
};

export const createInvTransaction = async (payload, cb) => {
  try {
    const res = await Axios.post(
      `/wms/InventoryTransaction/CreateInvTransection`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data.message || "Create Successfull");
      cb();

      // setter(res?.data);
    }
  } catch (error) {
    // toast.success(error.data.message || "error")
    
  }
};

export const editInvTransaction = async (payload, cb) => {
  try {
    const res = await Axios.put(
      `/wms/InventoryTransaction/EditInventoryTransaction`,

      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data.message || "update Successfull");
      cb();

      // setter(res?.data);
    }
  } catch (error) {
    // toast.success(error.data.message || "error")
    
  }
};

export const getItemsByRefTypeAndNo = async (
  refType,
  refNo,
  setter,
  formikSetter
) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetItemInfo?RefTypeName=${refType}&RefNoId=${refNo}`
    );
    if (res.status === 200 && res?.data) {
      const modify = res?.data?.[0].objRow.map((item) => ({
        code: item.itemCode,
        label: item.itemName,
        value: item.itemId,
        ...item,
      }));

      setter(modify, true);

      const { objtransfer } = res.data?.[0];
      
      formikSetter("plantFrom", {
        value: objtransfer?.fromPlantId,
        label: objtransfer?.fromPlantName,
      });

      formikSetter("wareHouseFrom", {
        value: objtransfer?.fromWhid,
        label: objtransfer?.fromWhName,
      });

      formikSetter("plantTo", {
        value: objtransfer?.toPlantId,
        label: objtransfer?.toPlantName,
      });

      formikSetter("wareHouseTo", {
        value: objtransfer?.toWhid,
        label: objtransfer?.toWhName,
      });
    }
  } catch (error) {
    // toast.success(error.data.message || "error")
    
  }
};

export const getInvTransactionById = async (id, setter, rowDataSetter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetInvTransectionById?TransectionId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const objHeader = res.data.map((item) => ({
        transactionGroup: {
          value: item?.objHeader?.transactionGroupId,
          label: item?.objHeader?.transactionGroupName,
        },
        referenceType: {
          value: item?.objHeader?.referenceTypeId,
          label: item?.objHeader?.referenceTypeName,
        },
        referenceNo: {
          value: item?.objHeader?.referenceId,
          label: item?.objHeader?.referenceCode,
        },
        transactionType: {
          value: item?.objHeader?.transactionTypeId,
          label: item?.objHeader?.transactionTypeName,
        },
        // plantFrom: {
        //   value: item?.objTransfer?.fromPlantId,
        //   label: item?.objTransfer?.fromPlantName,
        // },
        businessPartner: {
          value: item?.objHeader?.businessPartnerId,
          label: item?.objHeader?.businessPartnerName,
        },
        personnel: {
          value: item?.objHeader?.personnelId,
          label: item?.objHeader?.personnelName,
        },
        plantFrom: {
          value: item?.objTransfer?.fromPlantId,
          label: item?.objTransfer?.fromPlantName,
        },
        plantTo: {
          value: item?.objTransfer?.toPlantId,
          label: item?.objTransfer?.toPlantName,
        },
        wareHouseFrom: {
          value: item?.objTransfer?.fromWhid,
          label: item?.objTransfer?.fromWhName,
        },
        wareHouseTo: {
          value: item?.objTransfer?.toWhid,
          label: item?.objTransfer?.toWhName,
        },
        transferId: item?.objTransfer?.transferId,
      }));

      const objRow = res.data[0].objRow.map((item) => ({
        configId: 5,
        rowId: item?.rowId || 0,
        value: item?.itemId,
        label: item?.itemName,
        quantity: item?.numTransactionQuantity,
        refQty: item?.refQty || 0,
        restQty: item?.restQty || 0,
        // code: "HPD",
        // configId:"",
        code: item?.itemCode,
        location: {
          value: item?.inventoryLocationId,
          label: item?.inventoryLocationName,
        },
        stockType: {
          value: item?.inventoryStockTypeId,
          label: item?.inventoryStockTypeName,
        },
      }));
      if (rowDataSetter) rowDataSetter(objRow);
      setter(objHeader[0]);

      // setter(modified)
      // rowDataSetter(res.data9[0].)
    }
  } catch (error) {
    // toast.success(error.data.message || "error")
    
  }
};
