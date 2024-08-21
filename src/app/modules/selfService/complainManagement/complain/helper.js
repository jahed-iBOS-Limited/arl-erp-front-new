import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const employeEnroll_Api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const modify = res?.data?.map((itm) => ({
        value: itm.value,
        label: `${itm.label} (${itm.value})`,
      }));
      setter(modify);
    }
  } catch (error) {}
};
export const getComplainStatus = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainStatus?businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getComplainCategory = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainCategory?businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getComplainSubcategoryApi = async (buId, ctgId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainSubcategory?BusinessUnitId=${buId}&ComplainCategoryId=${ctgId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getComplainById = async (
  complainId,
  accId,
  buId,
  setLoaing,
  setSingleData
) => {
  setLoaing(true);
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/GetComplainById?complainId=${complainId}&accountId=${accId}&businessUnitId=${buId}`
    );
    setLoaing(false);

    setSingleData({
      ...res?.data,
      occurrenceDate: _dateFormatter(res?.data?.requestDateTime),
      respondentType: res?.data?.respondentTypeId
        ? {
            value: res?.data?.respondentTypeId,
            label: res?.data?.respondentTypeName,
          }
        : "",
      respondentName: res?.data?.respondentId
        ? {
            value: res?.data?.respondentId,
            label: res?.data?.respondentName,
          }
        : "",
      respondentContact: res?.data?.contactNo || "",
      issueType: res?.data?.complainCategoryId
        ? {
            value: res?.data?.complainCategoryId,
            label: res?.data?.complainCategoryName,
          }
        : "",
      issueSubType: res?.data?.complainSubCategoryId
        ? {
            value: res?.data?.complainSubCategoryId,
            label: res?.data?.complainSubCategoryName,
          }
        : "",
      issueTitle: res?.data?.issueTitle || "",
      distributionChannel: res?.data?.distributionChannelId
        ? {
            value: res?.data?.distributionChannelId,
            label: res?.data?.distributionChannelName,
          }
        : "",
      contactSource: res?.data?.contactSourceId
        ? {
            value: res?.data?.contactSourceId,
            label: res?.data?.contactSourceName,
          }
        : "",
      product: res?.data?.itemId
        ? {
            value: res?.data?.itemId,
            label: res?.data?.itemName,
          }
        : "",
      issueDetails: res?.data?.description || "",

      occurrenceTime: res?.data?.occurrenceTime
        ? moment(res?.data?.occurrenceTime, "HH:mm:ss").format("HH:mm:ss")
        : "",
      respondentBusinessUnit: res?.data?.respondentBusinessUnitId
        ? {
            value: res?.data?.respondentBusinessUnitId,
            label: res?.data?.respondentBusinessUnitIdName,
          }
        : "",
      respondent: res?.data?.respondentType || "",
      respondentOrg: res?.data?.respondentOrg || "",
      designationOrRelationship: res?.data?.designationOrRelationship || "",
      additionalCommentAndSuggestion: res?.data?.commentAndSuggestion || "",
      itemCategory: res?.data?.itemCategoryId
        ? {
            value: res?.data?.itemCategoryId,
            label: res?.data?.itemCategoryName,
          }
        : "",
      challanOrPO: res?.data?.challanOrPoId
        ? {
            value: res?.data?.challanOrPoId,
            label: res?.data?.challanOrPoName,
          }
        : "",
      deliveryDate: res?.data?.deliveryDate
        ? _dateFormatter(res?.data?.deliveryDate)
        : "",
      reference: res?.data?.reference || "",
      respondentAddress: res?.data?.respondentAddress || "",
      sourceCustomerType: {
        label: res?.data?.sourceCustomerType || "",
        value: res?.data?.sourceCustomerType || "",
      },
      customer: {
        label: res?.data?.customerName || "",
        value: res?.data?.customerId || 0,
      },
      upazila: {
        value: 0,
        upazilaName: res?.data?.upazilaName || "",
        districtName: res?.data?.districtName || "",
        label: `${res?.data?.upazilaName}(${res?.data?.districtName})`,
      },
    });
  } catch (error) {
    setLoaing(false);
  }
};

export const attachment_action = async (
  attachment,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  setFieldValue("attachment", "");
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    setFieldValue("attachment", data?.[0]?.id);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error("Document not upload");
  }
};

export const createComplain = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/CustomerPoint/CreateAndUpdateComplain`,
      payload
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const updateComplain = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/CustomerPoint/UpdateAndDelegateComplain`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const investigateComplainApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/CustomerPoint/InvestigateComplain`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const customerListDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(
      res?.data?.map((itm) => {
        return {
          ...itm,
          label: `${itm?.label} (${itm?.code})`,
        };
      })
    );
  } catch (error) {
    setter([]);
  }
};
export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data || []);
  } catch (error) {
    setter([]);
  }
};
export const getSupplierDDLApi = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getItemSalesByChanneldDDLApi = async (
  accId,
  buId,
  dcId,
  setter
) => {
  try {
    const res = await axios.get(
      `/item/ItemSales/GetItemSalesByChanneldDDL?accountId=${accId}&businessUnitId=${buId}&distributionChannelId=${dcId}`
    );
    setter(res?.data || []);
  } catch (error) {
    setter([]);
  }
};

export const complainLandingPasignation = async (
  accId,
  buId,
  respondentTypeId,
  fromDate,
  toDate,
  statusId,
  issueTypeId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search,
  respondentBusinessUnitId
) => {
  setLoading(true);
  setter([]);
  try {
    const _search = search ? `&search=${search}` : "";
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainLandingPasignation?accountId=${accId}&businessUnitId=${buId}&respondentTypeId=${respondentTypeId}&statusId=${statusId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${_search}&respondentBusinessUnitId=${respondentBusinessUnitId ||
        0}&issueTypeId=${issueTypeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const respondentTypeDDL = [
  {
    value: 1,
    label: "Employee",
  },
  {
    value: 2,
    label: "Supplier",
  },
  {
    value: 3,
    label: "Customer",
  },
  {
    value: 4,
    label: "End User",
  },
];

export const getBusinessUnitDDLApi = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=0`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getItemCategoryDDL = async (accId, buId, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/ItemPlantWarehouse/GetItemCategoryDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
