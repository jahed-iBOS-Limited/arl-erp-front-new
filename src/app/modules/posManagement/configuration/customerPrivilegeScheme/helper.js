import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
//GetPrivilegeSchemeLanding_api
export const GetPrivilegeSchemeLanding_api = async (
  accId,
  buId,
  whId,
  conditionType,
  status,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/PrivilegeScheme/GetPrivilegeSchemeLanding?AccountId=${accId}&BusinessUnitId=${buId}&OutletId=${whId}&ConditonTypeId=${conditionType}&Status=${status}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getWareHouseDDL = async (
  accountId,
  businessUnitId,
  plantId,
  userId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseRequest/OutletDDLPermissionWise?UserId=${userId}&AccountId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
export const GetSalesWiseItem_api = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemProfile/GetSalesWiseItem?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
export const GetItemGroupDDL_api = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/oms/PrivilegeScheme/GetItemGroupDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
export const GetCustomerGroupDDL_api = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/oms/PrivilegeScheme/GetCustomerGroupDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
// export const GetItemGroupById_api = async (id, setter, setLoading) => {
//   try {
//     setLoading && setLoading(true);
//     const res = await Axios.get(
//       `/item/ItemProfile/GetItemGroupById?ItemGroupById=${id}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//       setLoading && setLoading(false);
//     }
//   } catch (error) {
//     setLoading && setLoading(false);
//     setter([]);
//   }
// };

export const postPrivilegeScheme_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/oms/PrivilegeScheme/PostPrivilegeScheme`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const UpdateStatusPreviledgeSchemeById_api = async (
  schemeId,
  setDisabled,
  activeCB,
  values
) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/oms/PrivilegeScheme/UpdateStatusPreviledgeSchemeById?CustomersPrivilegeSchemeId=${schemeId}`
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      setDisabled(false);
      activeCB(values);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetConditionTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/oms/PrivilegeScheme/GetConditionTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getCustomerListByGenderDDL = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/CustomerGroup/GetCustomerListByGender?accountId=${accountId}&businessUnitId=${businessUnitId}&genderId=0`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const valuesEmptyFunc = (setFieldValue) => {
  setFieldValue("minimumQuantity", "");
  setFieldValue("maximumQuantity", "");
  setFieldValue("itemUoM", "");
  setFieldValue("offerItem", "");
  setFieldValue("maximumAmount", "");
  setFieldValue("discountFormat", "");
  setFieldValue("offerQuantity", "");
  setFieldValue("discountAmount", "");
  setFieldValue("minimumAmount", "");
  setFieldValue("durationType", "");
  setFieldValue("monthDuration", "");
  setFieldValue("basedOn", "");
};

const OfferBasedOnsetFieldFunc = (setFieldValue, valueOption) => {
  if (valueOption) {
    if ([1, 3, 7].includes(valueOption?.value)) {
      setFieldValue("offerBasedOn", { value: 2, label: "Amount" });
    } else {
      setFieldValue("offerBasedOn", { value: 1, label: "Quantity" });
    }
  } else {
    setFieldValue("offerBasedOn", "");
  }
};

export const conditionTypeOnChangeHandler = (obj) => {
  const {
    setFieldValue,
    valueOption,
    setItemDDL,
    profileData,
    selectedBusinessUnit,
    setCustomerDDL,
  } = obj;
  // Offer Based On "value obj set"
  OfferBasedOnsetFieldFunc(setFieldValue, valueOption);
  switch (valueOption?.value) {
    // All Item / All Customer
    case 1:
      setFieldValue("itemGroup", { value: 0, label: "All" });
      setFieldValue("customerGroup", { value: 0, label: "All" });
      break;
    // Item Group / All Customer
    case 2:
      setItemDDL([]);
      GetItemGroupDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
      setFieldValue("customerGroup", { value: 0, label: "All" });
      break;
    // All Item / Customer Group
    case 3:
      setCustomerDDL([]);
      GetCustomerGroupDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
      setFieldValue("itemGroup", { value: 0, label: "All" });
      break;
    // Item Group / Customer Group
    case 4:
      setCustomerDDL([]);
      setItemDDL([]);
      GetCustomerGroupDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
      GetItemGroupDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
      break;
    // Item / All Customer
    case 5:
      setItemDDL([]);
      GetSalesWiseItem_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
      setFieldValue("customerGroup", { value: 0, label: "All" });
      break;
    // Item / Customer Group
    case 6:
      setItemDDL([]);
      setCustomerDDL([]);
      GetSalesWiseItem_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
      GetCustomerGroupDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
      break;
    // All Item / Customer
    case 7:
      setCustomerDDL([]);
      getCustomerListByGenderDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
      setFieldValue("itemGroup", { value: 0, label: "All" });
      break;
    // Item Group / Customer
    case 8:
      setCustomerDDL([]);
      setItemDDL([]);
      GetItemGroupDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
      getCustomerListByGenderDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
      break;
    // Item / Customer
    case 9:
      setCustomerDDL([]);
      setItemDDL([]);
      GetSalesWiseItem_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
      getCustomerListByGenderDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
      break;
    default:
      break;
  }
};

export const offerBasedOnDDL = () => {
  return [
    { value: 1, label: "Quantity" },
    { value: 2, label: "Amount" },
  ];
};
export const customersPurchaseTypeDDL = () => {
  return [
    { value: 1, label: "Cash" },
    { value: 2, label: "Credit" },
    { value: 3, label: "Online" },
    { value: 4, label: "Both" },
  ];
};
export const schemeTypeDDL = () => {
  return [
    { value: 1, label: "Discount" },
    { value: 2, label: "Item" },
  ];
};
export const discountFormatDDL = () => {
  return [
    { value: 1, label: "% (Percentage)" },
    { value: 2, label: "Amount (Allocation)" },
  ];
};
export const durationTypeDDL = () => {
  return [
    { value: 1, label: "One Time" },
    // { value: 2, label: "Daily" },
    { value: 3, label: "Monthly" },
    { value: 4, label: "Yearly" },
  ];
};
export const basedOnDDL = (label) => {
  return [
    { value: 1, label: label },
    { value: 2, label: "Accumulation" },
  ];
};

export const GetPreviledgeSchemeById_api = async (
  schemeId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/PrivilegeScheme/GetPreviledgeSchemeById?CustomersPrivilegeSchemeId=${schemeId}`
    );
    setLoading(false);
    const row = res?.data?.objRow?.map((itm) => {
      const durationTypeName =
        durationTypeDDL()?.find(
          (findItm) => findItm?.value === itm?.durationTypeId
        )?.label || "";

      return {
        ...itm,
        discountFormatName:
          discountFormatDDL()?.find(
            (findItm) => findItm?.value === itm?.discountFormatId
          )?.label || "",
        durationTypeName: durationTypeName,
        basedOnName:
          offerBasedOnDDL(durationTypeName)?.find(
            (findItm) => findItm?.value === itm?.basedOnId
          )?.label || "",
        itemUomName: itm?.uomName || "",
      };
    });

    const {
      nameOfScheme,
      itemOrItemGroupId,
      itemOrItemGroupName,
      customerOrCustomerGroupId,
      customerOrCustomerGroupName,
      startDate,
      endDate,
      offerBasedOnId,
      schemeTypeId,
      customersPurchaseTypeId,
      warehouseId,
      warehouseName,
      conditionTypeId,
      conditionTypeName,
    } = res?.data?.objHeader;

    const offerBasedOn =
    offerBasedOnDDL().find((itm) => itm.value === offerBasedOnId) || "";

    const schemeType =
      schemeTypeDDL().find((itm) => itm.value === schemeTypeId) || "";

    const customersPurchaseType =
      customersPurchaseTypeDDL().find(
        (itm) => itm.value === customersPurchaseTypeId
      ) || "";

    const obj = {
      objHeader: {
        ...res?.data?.objHeader,
        outletName: warehouseId
          ? { value: warehouseId, label: warehouseName }
          : "",
        nameOfScheme: nameOfScheme || "",
        conditionType: conditionTypeId
          ? { value: conditionTypeId, label: conditionTypeName }
          : "",
        itemGroup: itemOrItemGroupId
          ? { value: itemOrItemGroupId, label: itemOrItemGroupName }
          : "",
        customerGroup: customerOrCustomerGroupId
          ? {
              value: customerOrCustomerGroupId,
              label: customerOrCustomerGroupName,
            }
          : "",
        schemeStartDate: _dateFormatter(startDate),
        schemeEndDate: _dateFormatter(endDate),
        offerBasedOn: offerBasedOn,
        schemeType: schemeType,
        customersPurchaseType: customersPurchaseType,
      },
      objRow: row,
    };
    setter(obj);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
