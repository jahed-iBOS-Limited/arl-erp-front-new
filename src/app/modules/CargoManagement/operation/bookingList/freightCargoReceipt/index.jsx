import React, { useEffect } from 'react';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import './style.css';

const FreightCargoReceipt = ({ rowClickData }) => {
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
    const bookingData = shipBookingRequestGetById?.[0] || {};
    if (shipBookingRequestLoading) return <div
        className='d-flex justify-content-center align-items-center'
    >
        <Loading />
    </div>

    return (
        <div className='freightCargoReceipt'>
            <div className="container">
                <div className="input-line50"></div>
                <h1>FREIGHT CARGO RECEIPT (FCR)</h1>
                <div className="input-line50"></div>

                <div className="section">
                    <div className="two-column-grid">
                        <span className="section-title">FCR Number:</span>
                        <span className="section-title">Date:</span>
                    </div>
                </div>

                <div className="section">
                    <h2>Shipper Details:</h2>
                    <div className="input-line50"></div>
                    <span className="section-title">Name: {bookingData?.shipperName}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Address: {bookingData?.shipperAddress}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Contact Person: {bookingData?.shipperContactPerson}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Phone: {bookingData?.shipperContact}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Email: {bookingData?.shipperEmail}</span>
                </div>

                <div className="section">
                    <h2>Consignee Details:</h2>
                    <div className="input-line50"></div>
                    <span className="section-title">Name: {bookingData?.consigneeName}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Address: {bookingData?.consigneeAddress}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Contact Person: {bookingData?.consigneeContactPerson}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Phone: {bookingData?.consigneeContact}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Email: {bookingData?.consigneeEmail}</span>
                    <div className="new-line"></div>
                </div>

                <div className="section">
                    <h2>Transport Details:</h2>
                    <div className="input-line50"></div>
                    <span className="section-title">Transport Mode: {bookingData?.modeOfTransport}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Carrier:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Vessel/Flight No:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Departure Port:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Destination Port:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Booking Number:</span>
                    <div className="new-line"></div>
                </div>

                <div className="section">
                    <h2>Cargo Details:</h2>
                    <div className="input-line50"></div>
                    <span className="section-title">Description of Goods: {bookingData?.descriptionOfGoods}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Total Weight: {bookingData?.netWeightKG}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Total Volume: {bookingData?.volumeCBM}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Number of Packages: {bookingData?.numberOfPackages}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Package Type: {bookingData?.typeOfPackaging}</span>
                    <div className="new-line"></div>
                    <span className="section-title">Hazardous Material:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Special Instructions: {bookingData?.shInstructionText}</span>
                    <div className="new-line"></div>
                </div>

                <div className="section">
                    <h2>Signature:</h2>
                    <div className="signature-line50"></div>
                    <div className="two-column-grid">
                        <div>
                            <span className="section-title">Shipper Signature:</span>
                            <div className="signature-line"></div>
                        </div>
                        <div>
                            <span className="section-title">Date:</span>
                            <div className="signature-line"></div>
                        </div>
                    </div>
                    <div className="two-column-grid">
                        <div>
                            <span className="section-title">Freight Forwarder Signature:</span>
                            <div className="signature-line"></div>
                        </div>
                        <div>
                            <span className="section-title">Date:</span>
                            <div className="signature-line"></div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2>Notes</h2>
                    <p className="note">1. This receipt serves as proof of cargo acceptance by the freight forwarder.</p>
                    <p className="note">2. All goods are subject to the terms and conditions of carriage.</p>
                    <p className="note">3. Any discrepancies must be reported within [insert time period] of receipt.</p>
                    <div className="signature-line50"></div>
                </div>
            </div>
        </div>
    );
};

export default FreightCargoReceipt;
