import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

const ISuccessPopup = (props) => {
  const { title, message, okAlertFunc } = props;
  return confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "OK",
        onClick: () => okAlertFunc(),
      },
    ],
  });
};

export default ISuccessPopup;
