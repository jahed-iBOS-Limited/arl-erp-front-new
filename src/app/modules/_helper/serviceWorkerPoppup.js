import { confirmAlert } from "react-confirm-alert"; // Import
import { register } from "register-service-worker";
import { toast } from "react-toastify";
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

const updatePoppup = () => {
  let confirmObject = {
    title: "Update Action",
    closeOnClickOutside: false,
    message:
      'If you press "Yes" button then you will get the Latest Changes , Or if you press "No" then you need to refresh the page manually for get latest Changes.',
    yesAlertFunc: () => {
      window.location.reload();
    },
    noAlertFunc: () => {},
  };
  IConfirmModal(confirmObject);
};

export const serviceWorkerPoppup = () => {
  // if new content add
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  register(swUrl, {
    updated(registration) {
      console.log("New content is available; please refresh");
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      updatePoppup();
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
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
