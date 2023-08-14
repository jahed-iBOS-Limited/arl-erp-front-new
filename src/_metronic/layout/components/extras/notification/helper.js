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
  const peopledeskApiURL = store.getState()?.authData?.peopledeskApiURL;
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

export const NotificationRirectFunc = (data) => {
  const redirectBaseURL = redirectBaseURLGenerated(data);
  const routeUrl = data?.routeUrl;
  let path = `${redirectBaseURL}${routeUrl}`;
  window.open(path, "_blank");
};

const redirectBaseURLGenerated = (data) => {
  let redirectBaseURL = "";
  // if development then open in erpLocalUrl
  if (process.env.NODE_ENV === "development") {
    if (data?.isErpMenu) {
      redirectBaseURL = window.location.origin;
    } else {
      redirectBaseURL = data?.peopledeskApiURL;
    }
  } else {
    // if production then open in erp.peopledesk.io
    if (data?.isErpMenu) {
      redirectBaseURL = "https://erp.peopledesk.io";
    } else {
      redirectBaseURL = "https://arl.peopledesk.io";
    }
  }
  return redirectBaseURL;
};
