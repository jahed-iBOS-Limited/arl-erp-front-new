import React, { useEffect } from "react";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import BookingDetailsInfo from "./bookingDetailsInfo";
import "./style.css";
function Details({ rowClickData }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  return (
    <div className="bookingDetails">
      {shipBookingRequestLoading && <Loading />}
      <BookingDetailsInfo bookingData={bookingData} />
    </div>
  );
}

export default Details;
