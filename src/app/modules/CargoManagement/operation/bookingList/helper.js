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
      const commonPaylaod  = commonBookingRequestStatusUpdate(item);
      const payload = {
        ...commonPaylaod,
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
      const commonPaylaod  = commonBookingRequestStatusUpdate(item);
      const payload = {
        ...commonPaylaod,
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
      const commonPaylaod  = commonBookingRequestStatusUpdate(item);
      const payload = {
        ...commonPaylaod,
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
      const commonPaylaod  = commonBookingRequestStatusUpdate(item);
      const payload = {
        ...commonPaylaod,
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

export const commonBookingRequestStatusUpdate = (item) => {
  return {
    bookingRequestId: item?.bookingRequestId || 0,
    isPending: item?.isPending || false,
    isHandOver: item?.isHandOver || false,
    handOverDate: item?.handOverDate || new Date(),
    isReceived: item?.isReceived || false,
    receivedDate: item?.receivedDate || new Date(),
    isPlaning: item?.isPlaning || false,
    planingDate: item?.planingDate || new Date(),
    isConfirm: item?.isConfirm || false,
    confirmDate: item?.confirmDate || new Date(),
    isCancel: item?.isCancel || false,
    cancelDate: item?.cancelDate || new Date(),
    isInTransit: item?.isInTransit || false,
    inTransit: item?.inTransit || new Date(),
    isDestPortReceive: item?.isDestPortReceive || false,
    destPortReceive: item?.destPortReceive || new Date(),
    isBuyerReceive: item?.isBuyerReceive || false,
    buyerReceive: item?.buyerReceive || new Date(),
    isActive: item?.isActive || false,
    updatedAt: item?.updatedAt || new Date(),

    // new modify
    isDelivered: item?.isDelivered || false,
    deliveredDate: item?.deliveredDate || new Date(),
    isCustomsClearance: item?.isCustomsClearance || false,
    customsClearanceDate: item?.customsClearanceDate || new Date(),
    isDispatch: item?.isDispatch || false,
    dispatchDate: item?.dispatchDate || new Date(),
    isDocumentChecklist: item?.isDocumentChecklist || false,
    documentChecklistDate: item?.documentChecklistDate || new Date(),
    isCharges: item?.isCharges || false,
    chargesDate: item?.chargesDate || new Date(),
    isHBLEmail: item?.isHBLEmail || false,
    hblEmailDate: item?.hblEmailDate || new Date(),
    isBL: item?.isBL || false,
    blDate: item?.blDate || new Date(),
    isPickup: item?.isPickup || false,
    pickupDate: item?.pickupDate || new Date(),
    isTransport:  item?.isTransport || false,
    transportDate: item?.transportDate || new Date(),
  };
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
  } else if (itemObj?.isTransport) {
    return "Transport";
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
