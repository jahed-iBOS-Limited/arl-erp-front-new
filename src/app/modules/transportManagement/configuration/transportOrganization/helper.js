/* eslint-disable no-unused-vars */
import Axios from "axios";
import { toast } from "react-toastify";

export const GetTransportOrganizationPagination = async (
  accountId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/TransportOrganization/BusinessUnitTransportOrganizationLanding?AccountId=${accountId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}
      `
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};

export const getTransportOrganizationView = async (
  TransportOrganizationId,
  setter,
  setterRow
) => {
  try {
    const res = await Axios.get(
      `tms/TransportOrganization/GetBusinessUnitTransportOrganizationById?TransportOrganizationId=${TransportOrganizationId}`
    );

    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = {
        ...data,
        transportOrganizationName: data?.transportOrganizationName,
      };
      setter(newData);
      const rowDtoModified = data?.extendData?.map((itm) => ({
        businessUnitName: {
          value: itm.businessUnitId,
          label: itm.businessUnitName,
        },
      }));

      setterRow(rowDtoModified);
    }
  } catch (error) {
    
  }
};

export const saveTransportOrganization = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/TransportOrganization/CreateTransportOrganization`,
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

export const ExtendTransportOrganization = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/TransportOrganization/CreateExtendSave`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Extended successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editTransportOrganization = async (data, cb) => {
  try {
    const res = await Axios.put(
      `/tms/TransportOrganization/EditTransportOrganization`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      cb();
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
  }
};

export const getTransportOrganizationByAccountId_api = async (
  accountId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/tms/TransportOrganization/GetTransportOrganizationByAccountId?AccountId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getBusinessUnitDDL_api = async (actionBy, accountId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${actionBy}&ClientId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const newdata = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newdata);
    }
  } catch (error) {
    
  }
};
