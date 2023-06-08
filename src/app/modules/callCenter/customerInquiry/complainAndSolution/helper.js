import axios from "axios";
import { toast } from "react-toastify";

export const DeleteComplain = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/Complains/DeleteSiteComplainInfo?complainId=${id}`
    );
    toast.success(res.data.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error.response.data.message);
    setLoading(false);
  }
};

export const editComplain = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/Complains/EditSiteComplainInfo`, payload);
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const approveOrRejectHandler = async (
  values,
  status,
  userId,
  levelId,
  rows,
  id,
  buId,
  setLoading,
  cb
) => {
  setLoading(true);
  const payload = getPayload(values, status, userId, levelId, rows, id, buId);
  try {
    const url = status
      ? `/oms/Complains/ApproveSiteComplain`
      : `/oms/Complains/RejectApprovalRequest`;
    const res = await axios.put(url, payload);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

const getPayload = (values, status, userId, levelId, rowData, id, buId) => {
  const rows = rowData.map(({ problemQnt, intAutoId }) => ({
    intAutoId: +intAutoId,
    problemQnt: +problemQnt,
  }));

  const approvementPayload = {
    approveHead: {
      userId: userId,
      permissionLevelId: levelId,
      permissionFor: 1,
      complainId: +id,
      businessUnitId: buId,
      tsdComments: levelId === 1 ? values?.comment : "",
      productionComments: levelId === 2 ? values?.comment : "",
      logisticComments: levelId === 3 ? values?.comment : "",
      plantHeadComments: levelId === 4 ? values?.comment : "",
      salesHeadComments: levelId === 5 ? values?.comment : "",
    },
    approveRow: rows,
  };

  const rejectionPayload = {
    userId: userId,
    permissionLevelId: levelId,
    permissionFor: 1,
    complainId: +id,
    businessUnitId: buId,
    problemQnt: 0,
    tsdComments: levelId === 1 ? values?.comment : "",
    productionComments: levelId === 2 ? values?.comment : "",
    logisticComments: levelId === 3 ? values?.comment : "",
    plantHeadComments: levelId === 4 ? values?.comment : "",
    salesHeadComments: levelId === 5 ? values?.comment : "",
  };
  return status ? approvementPayload : rejectionPayload;
};
