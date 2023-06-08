import Axios from "axios";
import { toast } from "react-toastify";

export const getMonthDDL = async (setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getSalesCalenderStatusDDL = async (setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/GetSalesCalenderStatusDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

const getSalesCalenderStatus2DDL = async () => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/GetSalesCalenderStatusDDL`);
    if (res.status === 200 && res?.data) {
      return res?.data;
    }
  } catch (error) {}
};

export const getSalesCalender = async (
  accId,
  buId,
  monthId,
  yearId,
  setter,
  setFieldValue
) => {
  try {
    let res = await Axios.get(
      `/rtm/SalesCalender/GetSalesCalender?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${monthId}&YearId=${yearId}`
    );
    if (res?.status === 200) {
      if (res?.data?.length > 0) {
        const calendarStatusList = await getSalesCalenderStatus2DDL();
        const newData = res?.data?.map((itm) => {
          return {
            ...itm,
            calendarStatusDDL: calendarStatusList,
            calendarStatus: itm?.statusName
              ? { value: itm.satusId, label: itm.statusName }
              : calendarStatusList[0] || "",
          };
        });
        setter(newData);
        setFieldValue && setFieldValue("itemLists", newData);
      } else {
        setter([]);
        setFieldValue && setFieldValue("itemLists", []);
      }
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const createOrUpdateSalesCalender = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/SalesCalender/CreateOrUpdateSalesCalender`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    // toast.error(error?.response?.data?.title);
    toast.error("Please every fillup the calendar status feild");
    setDisabled(false);
  }
};
