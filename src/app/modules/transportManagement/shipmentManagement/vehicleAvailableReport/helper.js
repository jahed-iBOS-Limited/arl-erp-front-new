import Axios from "axios";
import { toast } from "react-toastify";

//get vehicle status ddl
export const getVehicleStatusDDL = async (setter) => {
  try {
    const res = await Axios.get(`/tms/TransportMgtDDL/GetVehicleStatusDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// get checkpost
export const getCheckpostListPermissionByUser = async (
  userId,
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetCheckpostListPermissionByUser?UserId=${userId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      // const ddlWithNameID = res?.data.map((item) => {
      //   return {
      //     value: item?.organizationUnitReffId,
      //     label: item?.organizationUnitReffName,
      //   };
      // });
      // setter(ddlWithNameID);
      setter(res?.data);
    }
  } catch (error) {}
};

// Get landing data
export const getItemRequestGridData = async (
  chekcPostId,
  accId,
  vehicleStsId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  count,
  searchValue
) => {
  try {
    setLoading(true);
    const searchPath = searchValue ? `search=${searchValue}&` : "";
    const res = await Axios.get(
      `/tms/CheckpostVehicleInOut/GetCheckpostVehicleInOutByCheckpostIdLanding?${searchPath}CheckpostId=${chekcPostId}&AccountId=${accId}&VehicleStatusId=${vehicleStsId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      let gridData = res?.data?.data?.map((data) => {
        return {
          vehicleId: data?.vehicleId,
          vehicleNo: data?.vehicleNo,
          driverName: data?.driverName,
          inDateTime: data?.inDateTime,
          purposeName: data?.purposeName,
          cameFrom: data?.cameFrom,
        };
      });
      setter(gridData);
      count(res?.data?.totalCount);
    }
  } catch (error) {
    setLoading(false);
    //
  }
};
/** 
export const getItemRequestGridData = async (
  accId,
  buId,
  SbuId,
  plantId,
  wareId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetItemRequestPagination?accountId=${accId}&businessUnitId=${buId}&sbuId=${SbuId}&plantId=${plantId}&warehouse=${wareId}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      let gridData = res?.data?.data.map((data) => {
        return {
          sl: data.sl,
          itemRequestId: data.itemRequestId,
          itemRequestCode: data.itemRequestCode,
          requestDate: _dateFormatter(data.requestDate),
          validTill: _dateFormatter(data.validTill),
          dueDate: _dateFormatter(data.dueDate),
          // strApproved: data.strApproved,
        };
      });
      setter(gridData);
    }
  } catch (error) {
    
  }
};
*/
//get request type
export const getRequestType = async (setter) => {
  try {
    const res = await Axios.get(`/wms/ItemRequest/GetItemRequestTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveItemRequest = async (data, cb, setGridData) => {
  try {
    const res = await Axios.post(`/wms/ItemRequest/CreateItemRequest`, data);
    if (res.status === 200) {
      setGridData([]);
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {}
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

export const getPlantDDL = async (userId, ccId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${ccId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
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
          requestDate: setDtoValue.objHeader.dteRequestDate,
          validTill: setDtoValue.objHeader.validTill,
          dueDate: setDtoValue.objHeader.dteDueDate,
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

export const saveItemReqEdit = async (data, cb) => {
  try {
    const res = await Axios.put(`/wms/ItemRequest/EditItemRequest`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      //cb()
    }
  } catch (error) {}
};

export const getItemDDL = async (accId, buId, plnId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plnId}&WhId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
