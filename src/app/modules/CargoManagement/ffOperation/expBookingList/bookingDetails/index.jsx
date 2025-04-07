import React, { useEffect } from 'react';
import { imarineBaseUrl } from '../../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import BookingDetailsInfo from './bookingDetailsInfo';
import './style.css';
function Details({ rowClickData, isAirOperation }) {
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  // GetBookedRequestBillingData?bookingId=20
  const [
    billingData,
    setGetBookedRequestBillingData,
    getBookedRequestBillingDataLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      );
      setGetBookedRequestBillingData(
        `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingData?bookingId=${bookingRequestId}`,
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}&isAirOperation=${
          isAirOperation || false
        }`
      );
      setGetBookedRequestBillingData(
        `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingData?bookingId=${bookingRequestId}&isAirOperation=${
          isAirOperation || false
        }`
      );
    }
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  return (
    <div className="bookingDetails">
      {(shipBookingRequestLoading || getBookedRequestBillingDataLoading) && (
        <Loading />
      )}
      <BookingDetailsInfo bookingData={bookingData} billingData={billingData} />
    </div>
  );
}

export default Details;
