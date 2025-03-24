// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  itemId,
  monthId,
  pageNo,
  pageSize,
  setIsLoading,
  setter
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/OutletBillProcess/GetOutletBillProcessPagination?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}&MonthId=${monthId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.status === 200) {
      const payload = {
        currentPage: res?.data?.currentPage,
        data: res?.data?.data?.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        }),
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
      };
      setter(payload);
      setIsLoading(false);
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const editBillProcess = async (payload) => {
  try {
    let res = await axios.put(
      `/rtm/OutletBillProcess/EditOutletBillProcess`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
    }
  } catch (err) {
    console.log(err?.response?.data?.message);
  }
};
