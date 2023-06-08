import axios from "axios";
// import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

export const IConfirmModal = (props) => {
  const { title, message, yesAlertFunc } = props;
  return confirmAlert({
    title: title,
    message: message,
    closeOnClickOutside: false,
    buttons: [
      {
        label: "Ok",
        onClick: () => yesAlertFunc(),
      },
    ],
  });
};

export const updateManualAddNDeduct = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.put(
      `/hcm/EmpRemunerationAddDed/UpdateManualAdditionDeduction`,
      payload
    );
    let confirmObject = {
      title: `${res?.data?.message}`,
      message: ``,
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        window.location.reload();
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
    cb();
    // toast.success(res?.data?.message, {
    //   toastId: "updateManualAddNDeduct",
    // });
    setDisabled(false);
  } catch (err) {
    let confirmObject = {
      title: `${err?.response?.data?.message}`,
      message: ``,
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        window.location.reload();
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
    // toast.warning(err?.response?.data?.message, {
    //   toastId: "updateManualAddNDeduct",
    // });
    setDisabled(false);
  }
};
