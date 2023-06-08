import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getPlantNameDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleData = async (id, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/mes/ShopFloorInventoryTransaction/GetInventoryTransactionDataById?shopFloorInvTranId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const resHeader = res?.data?.getShopFloorInventoryTransactionHeader;
      const resRow = res?.data?.getShopFloorInventoryTransactionRow;
      const header = {
        amount: "",
        checkbox: false,
        item: "",
        narration: "",
        qty: "",
        receiveFrom: resHeader?.receiveFromName,
        referenceCode: {
          value: resHeader?.referenceId,
          label: resHeader?.referenceCode,
        },
        referenceType: {
          value: resHeader?.referenceTypeId,
          label: resHeader?.referenceType,
        },
        transaction: {
          value: resHeader?.transactionTypeId,
          label: resHeader?.transactionTypeName,
        },
        transactionDate: _dateFormatter(resHeader?.dteTransactionDateTime),
        transferTo: {
          value: resHeader?.referenceTypeId,
          label: resHeader?.referenceType,
        },
      };

      const row = resRow?.map((item) => {
        return {
          checkbox: false,
          item: {
            value: item?.itemId,
            label: item?.itemName,
            poMaterialReqID: 0,
            description: item?.uoMname,
            baseUomid: item?.uoMid,
            transactionQuantity: item?.transactionQty,
            code: item?.itemCode,
          },
          transactionQuantity: item?.transactionQty,
          itemCode: item?.itemCode,
          qty: "",
          receiveFrom: resHeader?.receiveFromName,
          referenceCode: {
            value: resHeader?.referenceId,
            label: resHeader?.referenceCode,
          },
          referenceType: {
            value: resHeader?.referenceTypeId,
            label: resHeader?.referenceType,
          },
          transaction: {
            value: resHeader?.referenceTypeId,
            label: resHeader?.referenceType,
          },
          transactionDate: _dateFormatter(resHeader?.dteTransactionDateTime),
          transferTo: {
            value: resHeader?.transferToId,
            label: resHeader?.transferToName,
          },
        };
      });

      console.log("-===", header);
      console.log("-===2", row);

      setter(header);
      setRowDto(row);
    }
  } catch (error) {}
};

// shop floor ddl
export const getShopfloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// shop floor transaction ddl
export const getShopFloorTransactionTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/mes/MesDDL/GetShopFloorTransactionTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// shop floor code ddl
export const getShopFloorReferenceCodeDDL = async (
  transactionType,
  plantId,
  shopFloorId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShopFloorReferenceCodeDDL?transactionType=${transactionType}&plantId=${plantId}&shopfloorId=${shopFloorId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// Shop Floor Transfer DDL
export const getShopFloorTransferDDL = async (
  transactionType,
  plantId,
  fromShopFloorId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShopFloorTransferDDL?transactionType=${transactionType}&plantId=${plantId}&fromShopFloorId=${fromShopFloorId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// Item type DDL
export const getShopFloorItemDDL = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShoopFloorItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}`
    );
    
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + ' [Current Stock: ' + item?.currentStock + ']',
            itemName: item?.label
          };
        })
      );
    }
  } catch (error) {
    setter([]);
  }
};

// Item type DDL
export const getShopFloorFGItemDDL = async (accId, buId, plantId, shopFloorId,setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShoopFloorFGItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopfloorId=${shopFloorId}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + ' [Current Stock: ' + item?.currentStock + ']',
            itemName: item?.label
          };
        })
      );
    }
  } catch (error) {
    setter([]);
  }
};

// grid data  according to reference code
export const getInventoryTransactionData = async (
  transactionType,
  referenceCode,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/ShopFloorInventoryTransaction/GetInventoryTransactionData?transactionType=${transactionType}&InventoryTransactionReferarance=${referenceCode}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// create
// /mes/ShopFloorInventoryTransaction/CreateInvTransaction
export const createInvTransaction = async (
  data,
  warehouseCheck,
  cb,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/mes/ShopFloorInventoryTransaction/CreateInvTransaction?warehouseCheck=${warehouseCheck}`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const ShopFloorTransactionLandingAction = async (
  plantId,
  shopFloorId,
  transactionTypeId,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/mes/ShopFloorInventoryTransaction/GetInventoryTransactionLandingPagination?plantId=${plantId}&shopFloorId=${shopFloorId}&TransactionTypeId=${transactionTypeId}&pageNumber=1&pageSize=111&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([])
    setLoader(false);
  }
};
