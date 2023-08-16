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

  const queryParams = new URLSearchParams();
    const routeUrl = data?.routeUrl;
    let path = '';
    if(data?.isErpMenu){
      queryParams.append('isRedirectHR', true);
      const iscommonapproval = routeUrl.includes('commonapproval');
      if (iscommonapproval) {
        queryParams.append('plantId', 0);
        queryParams.append('plantName', 'All');
        queryParams.append('moduleId', data?.erpModuleId || 0);
        queryParams.append('moduleName', data?.erpModuleName || '');
        queryParams.append('featureId', data?.erpModuleFeatureId || 0);
        queryParams.append('featureName', data?.erpModuleFeatureName || '');
        path = `${redirectBaseURL}/personal/approval/commonapproval?${queryParams.toString()}`
      } else {
        path = `${redirectBaseURL}${routeUrl}?${queryParams.toString()}`
      }
    }else {
      path = `${redirectBaseURL}${routeUrl}`
    }
  
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
