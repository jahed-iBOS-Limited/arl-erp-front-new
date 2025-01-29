import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const IConfirmModal = (props) => {
  const { title, message, yesAlertFunc, noAlertFunc, ...rest } = props;
  return confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Yes",
        onClick: () => yesAlertFunc(),
      },
      {
        label: "No",
        onClick: () => noAlertFunc(),
      },
    ],
    ...rest,
  });
};

export default IConfirmModal;
