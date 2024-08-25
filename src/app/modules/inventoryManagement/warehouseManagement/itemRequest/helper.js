import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getItemRequestGridData = async (
  accId,
  buId,
  userId,
  setter,
  setLoading,
  setTotalCount,
  pageNo,
  pageSize,
  privacyType,
  sbuId,
  plantId,
  whId,
  status,
  fromDate,
  toDate,
  search,
) => {

  const searchPath = search ? `searchTerm=${search}&` : "";
  const statusPath = status!==undefined ? `&status=${status}` : "";
  const fromDatePath = fromDate ? `&fromDate=${fromDate}` : "";
  const toDatePath = toDate ? `&toDate=${toDate}` : "";

  setLoading(true);
  const requestUrl = `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}${statusPath}${fromDatePath}${toDatePath}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&PrivateOrPublic=${privacyType}`

  try {
    const res = await Axios.get(requestUrl)
    if (res.status === 200 && res?.data) {
      setTotalCount(res?.data?.totalCount);
      let gridData = res?.data?.data.map((data) => {
        return {
          sl: data.sl,
          itemRequestId: data.itemRequestId,
          itemRequestCode: data.itemRequestCode,
          requestDate: _dateFormatter(data.requestDate),
          validTill: _dateFormatter(data.validTill),
          dueDate: _dateFormatter(data.dueDate),
          strApproved: data.strApproved,
        };
      });
      setter(gridData);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

//get request type
export const getRequestType = async (setter) => {
  try {
    const res = await Axios.get(`/wms/ItemRequest/GetItemRequestTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveItemRequest = async (data, cb, setGridData, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/wms/ItemRequest/CreateItemRequest`, data);
    if (res.status === 200) {
      setGridData([]);
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getReferenceTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetItemRequestReferenceTypeDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getWarehouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleDataForEdit = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetItemRequestDatabyId?requestid=${id}`
    );
    if (res.status === 200 && res?.data) {
      let setDtoValue = res?.data[0];
      let newData = {
        objHeader: {
          ...setDtoValue.objHeader,
          requestDate: _dateFormatter(setDtoValue.objHeader.dteRequestDate),
          validTill: _dateFormatter(setDtoValue.objHeader.validTill),
          dueDate: _dateFormatter(setDtoValue.objHeader.dteDueDate),
          // will be added project
          actionType: setDtoValue?.objHeader?.intProjectId > 0 ?  { label: "Project", value: 1 } : { label: "Operation", value: 2 },
          project:
            setDtoValue?.objHeader?.intProjectId > 0
              ? {
                  value: setDtoValue?.objHeader?.intProjectId,
                  label: setDtoValue?.objHeader?.strProject,
                }
              : null,
          referenceId: "",
          quantity: "",
          remarks: "",
          item: "",
        },
        objRow: [...setDtoValue?.objRow],
      };
      setter(newData);
    }
  } catch (error) {}
};

export const getSingleData = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetItemRequestDatabyId?requestid=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveItemReqEdit = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/wms/ItemRequest/EditItemRequest`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      //cb()
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getItemAssetDDL = async (accId, buId, plnId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequestDDL/GetItemForAssetTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plnId}&WarehouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      let itemData = res?.data?.map((data) => {
        return {
          ...data,
          label: `${data.label} [${data.code}]`,
        };
      });
      setter(itemData);
    }
  } catch (error) {}
};

export const getItemforServiceItemDDL = async (
  accId,
  buId,
  plnId,
  whId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequestDDL/GetItemForServiceTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plnId}&WarehouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      let itemData = res?.data?.map((data) => {
        return {
          ...data,
          label: `${data?.label} [${data?.value}]`,
        };
      });
      setter(itemData);
      // setter(res?.data)
    }
  } catch (error) {}
};

export const getItemForOthersDDL = async (accId, buId, plnId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequestDDL/GetItemForOthersTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plnId}&WarehouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      let itemData = res?.data?.map((data) => {
        return {
          ...data,
          label: `${data?.label} [${data?.value}]`,
        };
      });
      setter(itemData);
      // setter(res?.data)
    }
  } catch (error) {}
};

export const getUOMList = async (
  itemId,
  buId,
  accId,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemUomconversionData?ItemId=${itemId}&BusinessUnitId=${buId}&AccountId=${accId}`
    );
    const data = res?.data?.convertedList;
    const newData = data?.map((item) => {
      return {
        value: item?.value,
        label: item?.label,
      };
    });
    setFieldValue("itemUom", {
      value: res?.data?.value,
      label: res?.data?.label,
    });
    setter(newData);
  } catch (error) {}
};



export const getReportItemReq = async (prId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryView/GetItemRequestViewById?requestid=${prId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};


export const getCostElement = async (unId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetCostElementByUnitId?businessUnitId=${unId}`
    );

    if(res.status === 200){
      let newData = res?.data.map(data=>{
        return {
          ...data,
          value:data?.costElementId,
          label:data?.costElementName
        }
      })

      setter(newData);
    }
    
  } catch (error) {}
};


export const sendEmailPostApi = async (dataObj) => {
  let formData = new FormData();
  formData.append("to", dataObj?.toMail);
  formData.append("cc", dataObj?.toCC);
  formData.append("bcc", dataObj?.toBCC);
  formData.append("subject", dataObj?.subject);
  formData.append("body", dataObj?.message);
  formData.append("file", dataObj?.attachment);
  try {
    let { data } = await Axios.post("/domain/MailSender/SendMail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Mail Send Successfully");
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Mail cant not send successfully"
    );
  }
};


export const postItemReqCancelAction = async (
  iId
) => {
  try {
    const res = await Axios.put(
      `/wms/ItemRequest/CancelItemRequestDatabyId?ItemRequest=${iId}`
    );
    if (res.status === 200) {     
      toast.success(res?.data?.message || "Cancel Successfully")    
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cancel Failed")
  }
};








