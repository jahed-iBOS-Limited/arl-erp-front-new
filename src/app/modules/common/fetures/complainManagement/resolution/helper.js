import axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';

export const getComplainStatus = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainStatus?businessUnitId=${buId}`
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
        : '',
      respondentName: res?.data?.respondentId
        ? {
            value: res?.data?.respondentId,
            label: res?.data?.respondentName,
          }
        : '',
      respondentContact: res?.data?.contactNo || '',
      issueType: res?.data?.complainCategoryId
        ? {
            value: res?.data?.complainCategoryId,
            label: res?.data?.complainCategoryName,
          }
        : '',
      issueTitle: res?.data?.issueTitle || '',
      distributionChannel: res?.data?.distributionChannelId
        ? {
            value: res?.data?.distributionChannelId,
            label: res?.data?.distributionChannelName,
          }
        : '',
      product: res?.data?.itemId
        ? {
            value: res?.data?.itemId,
            label: res?.data?.itemName,
          }
        : '',
      issueDetails: res?.data?.description || '',
    });
  } catch (error) {
    setLoaing(false);
  }
};

export const investigateReviewApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/CustomerPoint/InvestigateReview`,
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
export const delegateComplainApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/CustomerPoint/DelegateComplain`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const checkDelegationMenuPermission = async (
  userId,
  setLoading,
  setIsPermitted
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/IsDelegateMenuAllowThisUsers?UserId=${userId}`
    );
    setIsPermitted(res?.data);

    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const allowDelegationMenuPermission = async (
  values,
  setLoading,
  setIsPermitted
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/CustomerPoint/DelegateMenuPermissionToUser`,
      {
        userReferenceName: values?.delegateTo?.label,
        userReferenceId: values?.delegateTo?.value,
      }
    );
    console.log(res?.data);
    setIsPermitted(true);
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

export const saveColseComplainApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/CustomerPoint/ColseComplain`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    // toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getInvestigateComplainbyApi = async (complainId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/InvestigateComplainbyId?ComplainId=${complainId}`
    );
    setter(res?.data || []);
  } catch (error) {}
};

export const complainLandingPasignationByEmployeeId = async (
  accId,
  buId,
  respondentTypeId,
  fromDate,
  toDate,
  statusId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search,
  employeeId,
  respondentBusinessUnitId,
  issueTypeId
) => {
  setLoading(true);
  setter([]);
  try {
    const _search = search ? `&search=${search}` : '';
    const _employeeId = employeeId ? `&employeeId=${employeeId}` : '';
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainLandingPasignationByEmployeeId?accountId=${accId}&businessUnitId=${buId}&respondentTypeId=${respondentTypeId}&statusId=${statusId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${_search}${_employeeId}&respondentBusinessUnitId=${
        respondentBusinessUnitId || 0
      }&issueTypeId=${issueTypeId}`
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
    label: 'Employee',
  },
  {
    value: 2,
    label: 'Supplier',
  },
  {
    value: 3,
    label: 'Customer',
  },
  {
    value: 4,
    label: 'End User',
  },
];
export const getComplainByIdWidthOutModify = async (
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
    });
  } catch (error) {
    setLoaing(false);
  }
};

export const feedbackReviewApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/CustomerPoint/UpdateComplainReviewFeedback`,
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
