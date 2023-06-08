import axios from "axios";
import { toast } from "react-toastify";

export const attachmentUploadEntry = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/SiteUploadAttachment/createSiteUploadAttachment`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAttachmentUploads = async (
  accId,
  buId,
  type,
  month,
  year,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  const typeId = type ? `&typeId=${type}` : "";
  const monthId = month ? `&monthId=${month}` : "";
  const yearId = year ? `&yearId=${year}` : "";
  try {
    const res = await axios.get(
      `/oms/SiteUploadAttachment/getUploadAttachmentLanding?AccountId=${accId}&BusinessId=${buId}${typeId}${monthId}${yearId}&vieworder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getSalesOrgList = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getItemList = async (
  accId,
  buId,
  channelId,
  salesOrgId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${channelId}&SalesOrgId=${salesOrgId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
