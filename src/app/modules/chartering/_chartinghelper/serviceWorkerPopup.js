import { confirmAlert } from "react-confirm-alert"; // Import
import { register } from "register-service-worker";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";

const IConfirmModal = (props) => {
  const { title, message, yesAlertFunc, noAlertFunc, ...rest } = props;
  return confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Update",
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

const updatePopup = () => {
  let confirmObject = {
    title: "New Update",
    closeOnClickOutside: false,
    message: 'Click "Update" to get the latest changes.',
    yesAlertFunc: () => {
      window.location.reload();
    },
    noAlertFunc: () => {},
  };
  IConfirmModal(confirmObject);
};

export const serviceWorkerPopup = () => {
  // if new content add
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  register(swUrl, {
    updated(registration) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      updatePopup();
    },
    offline() {
      toast.warning(
        "No internet connection found. App is running in offline mode.",
        { toastId: "Nointernet" }
      );
    },
    error(error) {
      if (process.env.NODE_ENV === "production") {
        console.error("Error during service worker registration:", error);
      }
    },
  });
};
