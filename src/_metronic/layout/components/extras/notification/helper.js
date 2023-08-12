import axios from "axios";
import store from "../../../../../redux/store";

// landing
export const getAllNotificationsActions = async (
  rowDto,
  setter,
  pageNo,
  pageSize,
  employeeId,
  accId,
  setNotificationLoading
) => {
  const peopledeskApiURL =  store.getState()?.authData?.peopledeskApiURL;
  setNotificationLoading && setNotificationLoading(true);
  try {
    const res = await axios.get(
      `${peopledeskApiURL}/Notification/GetAllNotificationByUserErp?pageNo=${pageNo}&pageSize=${pageSize}&employeeId=${employeeId}&accountId=${accId}`
    );
    setTimeout(() => {
      setNotificationLoading && setNotificationLoading(false);
    }, 500);
    setter([...rowDto, ...res?.data]);
  } catch (error) {
    setNotificationLoading && setNotificationLoading(false);
    setter([]);
  }
};
