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
        bookingRequestId: item?.bookingRequestId,
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
      };
      getBookingRequestStatusUpdate(
        `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
        payload,
        () => {
          CB()
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
