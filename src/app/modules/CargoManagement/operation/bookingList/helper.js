import axios from "axios";

import IConfirmModal from "../../../_helper/_confirmModal";
import { imarineBaseUrl } from "../../../../App";
import { toast } from "react-toastify";

// export const getDistributionChannelDDL = async (accId, buId, sbuId, setter) => {
//   try {
//     let res = await axios.get(
//       `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
//     );
//     setter(res?.data);
//   } catch (err) {
//     setter([]);
//   }
// };

export const pickupHandler = ({ item }) => {
  console.log("Pickup Handler");
};

export const cancelHandler = ({ item, getBookingRequestStatusUpdate, CB }) => {
  const obj = {
    title: "Cancel Booking",
    message: "Are you sure you want to cancel this?",
    noAlertFunc: () => {},
    yesAlertFunc: () => {
      const payload = {
        ...commonBookingRequestStatusUpdate,
        bookingRequestId: item?.bookingRequestId,
      };
      getBookingRequestStatusUpdate(
        `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
        payload,
        () => {
          CB();
        }
      );
    },
  };
  IConfirmModal(obj);
};

export const buyerReceiveHandler = ({
  item,
  getBookingRequestStatusUpdate,
  CB,
}) => {
  const obj = {
    title: "Buyer Receive",
    message: "Are you sure you want to Buyer Receive this?",
    noAlertFunc: () => {},
    yesAlertFunc: () => {
      const payload = {
        ...commonBookingRequestStatusUpdate,
        isBuyerReceive: true,
        isActive: true,
        buyerReceive: new Date(),
        bookingRequestId: item?.bookingRequestId,
      };
      getBookingRequestStatusUpdate(
        `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
        payload,
        () => {
          CB();
        }
      );
    },
  };
  IConfirmModal(obj);
};

// export const bookingRequestStatusUpdateApi = async (data, setLoading, cb) => {
//   setLoading(true);
//   try {
//     const res = await axios.put(
//       `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
//       data
//     );
//     toast.success(res?.data?.message);
//     cb();
//     setLoading(false);
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.message || "An error occurred while updating!"
//     );
//     setLoading(false);
//   }
// };

export const DesPortReceiveHandler = ({
  item,
  getBookingRequestStatusUpdate,
  CB,
}) => {
  const obj = {
    title: "Cancel Booking",
    message: "Are you sure you want to cancel this?",
    noAlertFunc: () => {},
    yesAlertFunc: () => {
      const payload = {
        ...commonBookingRequestStatusUpdate,
        isDestPortReceive: true,
        isActive: true,
        destPortReceive: new Date(),
        bookingRequestId: item?.bookingRequestId,
      };
      getBookingRequestStatusUpdate(
        `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
        payload,
        () => {
          CB();
        }
      );
    },
  };
  IConfirmModal(obj);
};
export const InTransitHandler = ({
  item,
  getBookingRequestStatusUpdate,
  CB,
}) => {
  const obj = {
    title: "In Transit",
    message: "Are you sure you want to In Transit this?",
    noAlertFunc: () => {},
    yesAlertFunc: () => {
      const payload = {
        ...commonBookingRequestStatusUpdate,
        isInTransit: true,
        isActive: true,
        inTransit: new Date(),
        bookingRequestId: item?.bookingRequestId,
      };
      getBookingRequestStatusUpdate(
        `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
        payload,
        () => {
          CB();
        }
      );
    },
  };
  IConfirmModal(obj);
};

export const commonBookingRequestStatusUpdate = {
  bookingRequestId: 0,
  isPending: false,
  isHandOver: false,
  handOverDate: new Date(),
  isReceived: false,
  receivedDate: new Date(),
  isPlaning: false,
  planingDate: new Date(),
  isConfirm: false,
  confirmDate: new Date(),
  isCancel: false,
  cancelDate: new Date(),
  isInTransit: false,
  inTransit: new Date(),
  isDestPortReceive: false,
  destPortReceive: new Date(),
  isBuyerReceive: false,
  buyerReceive: new Date(),
  isActive: false,
  updatedAt: new Date(),
  
};

export const statusReturn = (itemObj) => {

  if (itemObj?.isDelivered) {
    return "Delivered";
  } else if (itemObj?.isDestPortReceive) {
    return "Dest Port Receive";
  } else if (itemObj?.isInTransit) {
    return "In Transit";
  } else if (itemObj?.isCustomsClearance) {
    return "Customs Clearance";
  } else if (itemObj?.isDispatch) {
    return "Dispatch";
  } else if (itemObj?.isDocumentChecklist) {
    return "Document Checklist";
  } else if (itemObj?.isCharges) {
    return "Charges";
  } else if (itemObj?.isHBLEmail) {
    return "HBL Email";
  } else if (itemObj?.isBL) {
    return "BL";
  } else if (itemObj?.isReceived) {
    return "Received";
  } else if (itemObj?.isPickup) {
    return "Pickup";
  } else if (itemObj?.isConfirm) {
    return "Confirm";
  } else if (itemObj?.isCancel) {
    return "Cancel";
  } else if (itemObj?.isPending) {
    return "Pending";
  } else {
    return "";
  }
};
