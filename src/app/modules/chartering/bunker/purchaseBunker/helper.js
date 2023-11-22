import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
import { iMarineBaseURL } from "../../helper";
export const savePurchaseBunker = async (data, setLoading, cb, setReturnID) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/PurchaseBunker/CreatePurchaseBunker`,
      data
    );
    setLoading(false);
    toast.success(res?.data?.message);
    setReturnID && setReturnID(res?.data?.returnId);
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editPurchaseBunker = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/PurchaseBunker/EditPurchaseBunker`,
      data
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getPurchaseBunkerLandingData = async (
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  searchValue,
  setter,
  setLoading
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PurchaseBunker/GetPurchaseBunker?VesselId=${vesselId}&VoyageId=${voyageId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getPurchaseBunkerById = async (
  id,
  setHeader,
  setRow,
  setLoading
) => {
  setLoading(true);

  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/PurchaseBunker/GetPurchaseBunkerViewDetailsById?purchaseBunkerHeaderId=${id}`
    );
    const {
      vesselName,
      vesselId,
      voyageNo,
      voyageId,
      purchaseFromName,
      purchaseFromId,
      purchaseDate,
      stakeholderId,
      companyName,
      portId,
      portName,
      currencyName,
      currencyId,
    } = res?.data[0];

    const firstIteminRow = res?.data[0]?.purchaseBunkerRow[0];

    const modifyHeader = {
      vesselName: {
        value: vesselId,
        label: vesselName,
      },
      voyageNo: {
        value: voyageId,
        label: voyageNo,
      },
      purchaseFrom: {
        value: purchaseFromId,
        label: purchaseFromName,
      },
      supplierName: {
        value: stakeholderId,
        label: companyName,
      },
      supplierPort: {
        value: portId,
        label: portName,
      },
      charterer: {
        value: stakeholderId,
        label: companyName,
      },
      purchaseDate: _dateFormatter(purchaseDate),
      currency: {
        value: currencyId,
        label: currencyName,
      },

      itemQty:
        res?.data[0]?.purchaseBunkerRow?.length > 1
          ? 0
          : firstIteminRow?.itemQty || 0,
      itemRate:
        res?.data[0]?.purchaseBunkerRow?.length > 1
          ? 0
          : firstIteminRow?.itemRate || 0,
      itemValue:
        res?.data[0]?.purchaseBunkerRow?.length > 1
          ? 0
          : firstIteminRow?.itemValue || 0,

      item:
        res?.data[0]?.purchaseBunkerRow?.length > 1
          ? {}
          : {
              value: firstIteminRow?.itemId,
              label: firstIteminRow?.itemName,
              itemId: firstIteminRow?.itemId,
              itemName: firstIteminRow?.itemName,
              itemQty: firstIteminRow?.itemQty,
              itemRate: firstIteminRow?.itemRate,
              itemValue: firstIteminRow?.itemValue,
            },
    };

    setHeader(modifyHeader);
    setRow(res?.data[0]?.purchaseBunkerRow);
    setLoading(false);
  } catch (error) {
    setHeader({});
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteItemFromPurchaseBunker = async (
  headerId,
  rowId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.delete(
      `${iMarineBaseURL}/domain/PurchaseBunker/DeleteSchaseBunker?purchaseBunkerHeaderId=${headerId}&purchaseBunkerRowId=${rowId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
