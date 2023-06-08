import axios from "axios";
import { toast } from "react-toastify";

export const getChalanDDL = async (accId, buId, setIsLoading, setter) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetPrimaryDeliveryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message);
      setIsLoading(false);
    }
  }
};

export const getLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setIsLoading,
  setter
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/PrimaryDeliveryReceive/PrimaryDeliveryRecieveLandingPasignation?AccountId=${accId}&BusinessunitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      console.log(res?.data);
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message);
      setIsLoading(false);
    }
  }
};

export const getDeliveryItem = async (deliveryId, setIsLoading, setter) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/PrimaryDeliveryReceive/GetItemListByDelivaryId?DelivaryId=${deliveryId}`
    );
    if (res?.status === 200) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            rowId: 0,
          };
        })
      );
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message);
      setIsLoading(false);
    }
  }
};

export const createDeliveryReceive = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/rtm/PrimaryDeliveryReceive/CreatePrimaryDeliveryReceive`,
      payload
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "createDeliveryReceive" });
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message, {
        toastId: "createDeliveryReceiveErr",
      });
      setIsLoading(false);
    }
  }
};

export const editDeliveryReceive = async (payload, setIsLoading) => {
  setIsLoading(true);
  try {
    let res = await axios.put(
      `/rtm/PrimaryDeliveryReceive/EditPrimaryDeliveryReceive`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "editDeliveryReceive" });
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message, {
        toastId: "editDeliveryReceiveErr",
      });
      setIsLoading(false);
    }
  }
};

export const getDeliveryReceiveById = async (
  invId,
  setIsLoading,
  singleData,
  setRowData
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/PrimaryDeliveryReceive/GetPrimaryDeliveyReceiveById?InventoryTransactionId=${invId}`
    );
    if (res?.status === 200) {
      setIsLoading(false);
      singleData({
        chalan: {
          value: res?.data?.objheader?.referenceId, // Need to change
          label: res?.data?.objheader?.referenceCode,
        },
        inventoryTransactionId: res?.data?.objheader?.inventoryTransactionId,
        inventoryTransactionCode:
          res?.data?.objheader?.inventoryTransactionCode,
      });
      setRowData(
        res?.data?.objrow?.map((item) => {
          return {
            rowId: item?.rowId,
            itemId: item?.productId,
            itemName: item?.productName,
            uomId: item?.uomId,
            uomName: item?.uomname,
            rate: item?.rate,
            orderQTY: item?.orderQTY,
            receiveQTY: item?.transactionQuantity,
            orderAmmount: item?.transactionAmount,
            receiveAmount: item?.transactionAmount,
            // Need two field more!!
          };
        })
      );
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message);
      setIsLoading(false);
    }
  }
};

export const getGridData = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/rtm/PrimaryDeliveryReceive/PrimaryDeliveryRecieveLandingPasignation?AccountId=${accId}&BusinessunitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};
