// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../App";

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetDistributionChannel?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getItemDDL = async (accId, buId, dcId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetItemInfoByChannelIdDDL?AccountId=${accId}&BusinessUnitI=${buId}&DistributionChannel=${dcId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getRetailPriceLandingData = async (
  accId,
  buId,
  dcId,
  pageNo,
  pageSize,
  setter,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/RetailPrice/GetRetailPriceLandingPasignation?accountId=${accId}&businessUnitid=${buId}&distributionChannelId=${dcId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const createRetailPrice = async (payload, cb) => {
  try {
    let res = await axios.post(`/rtm/RetailPrice/CreateRetailPrice`, payload);
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "createRetailPrice" });
      cb();
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const editRetailPrice = async (payload) => {
  try {
    let res = await axios.put(`/rtm/RetailPrice/EditRetailPrice`, payload);
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "editRetailPrice" });
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getRetailPriceId = async (
  accId,
  buId,
  actionBy,
  dId,
  setSingleData,
  setRowData,
  setDisabled
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/RetailPrice/GetBusinessTypeById?distributionChannelId=${dId}`
    );
    if (res?.status === 200) {
      const data = res?.data;

      const payload = {
        distribution: {
          value: data[0]?.distributionChannelId,
          label: data[0]?.distributionChannelName,
        },
        item: "",
        UomId: "",
        UoM: "",
        rate: "",
      };

      const rowData = data?.map((item) => {
        return {
          configId: item?.configId,
          accountId: accId,
          businessUnitId: buId,
          itemId: item?.itemId,
          itemName: item?.itemName,
          itemBanglaName: item?.itemBanglaName,
          uomId: item?.uomId,
          uomName: item?.uomName,
          distributionChannelId: item?.distributionChannelId,
          distributionChannelName: item?.distributionChannelName,
          itemRate: item?.itemRate,
          dprate: item?.dpRate,
          tprate: item?.tpRate,
          actionBy: actionBy,
          dteLastActionDateTime: item?.dteLastActionDateTime,
          isActive: item?.isActive,
          itemCode: item?.itemCode,
          packageQuantity: item?.packageQty,
          productImage: item?.productImage,
          productTypeId: item?.productTypeId,
          productTypeName: item?.productTypeName,
        };
      });

      setSingleData(payload);
      setRowData(rowData);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const retailPriceAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const getRetailPriceImageFile_api = async (id) => {
  try {
    const res = await axios.get(
      `${APIUrl}/domain/Document/DownlloadFile?id=${id}`
    );

    if (res.status === 200 && res.data) {
      return res?.config?.url;
    }
  } catch (error) {}
};
