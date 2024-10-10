import React, { useEffect } from 'react';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import './style.css';
const HBLFormat = ({ rowClickData }) => {
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
        <div className='hbl-container'>
            <div className="container">
                <div className="input-line50"></div>
                <h1>HOUSE BILL OF LADING (HBL)</h1>
                <div className="input-line50"></div>

                <div className="">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        }}
                    >
                        <div>
                            <span className="section-title">HBL Number:</span>
                            <div className="solid-line"></div>
                        </div>
                        <div>
                            <span className="section-title">Date:</span>
                            <div className="solid-line"></div>

                        </div>
                    </div>
                </div>

                <div className="section">
                    <div
                        style={{
                            width: '50%'
                        }}>

                        <h2>Shipper Information:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Name: {bookingData?.shipperName}</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Address: {bookingData?.shipperAddress}</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Phone: {bookingData?.shipperContact}</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Email: {bookingData?.shipperEmail}</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>
                        <h2>Consignee Information:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Name: {bookingData?.consigneeName}</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Address: {bookingData?.consigneeAddress}</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Phone: {bookingData?.consigneeContact}</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Email: {bookingData?.consigneeEmail}</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>
                        <h2>Notify Party:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Name:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Address:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Phone:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Email:</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>
                        <h2>Freight Forwarder Details:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Company Name:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Address:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Phone:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Email:</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>
                        <h2>Carrier Details:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Carrier Name:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Booking Number:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Voyage/Flight No:</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>

                        <h2>Vessel/Flight Information:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Vessel/Flight Name:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Departure Port:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Destination Port:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">ETD (Estimated Time of Departure):</span>
                        <div className="solid-line"></div>

                        <span className="section-title">ETA (Estimated Time of Arrival):</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>

                        <h2>Cargo Description:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Description of Goods:</span>
                        <div className="solid-line"></div>
                        <span className="section-title">No. of Packages:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Package Type:</span>
                        <div className="solid-line"></div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }}
                        >
                            <div>
                                <span className="section-title">Total Weight:</span>
                                <div className="solid-line"></div>
                            </div>
                            <span className="section-title">kg</span>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }}
                        >
                            <div>
                                <span className="section-title">Total Volume:</span>
                                <div className="solid-line"></div>
                            </div>
                            <span className="section-title">cbm</span>
                        </div>

                        <span className="section-title">Marks & Numbers:</span>
                        <div className="solid-line"></div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }}
                        >
                            <div>
                                <span className="section-title">Gross Weight:</span>
                                <div className="solid-line"></div>
                            </div>
                            <span className="section-title">kg</span>

                        </div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>

                        <h2>Freight Terms:</h2>
                        <div className="input-line70"></div>

                        <span className="section-title">Freight Prepaid:</span>
                        <div className="new-line"></div>

                        <span className="section-title">Freight Payable at:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Place of Issue:</span>
                        <div className="solid-line"></div>

                        <span className="section-title">Date of Issue:</span>
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <div style={{
                        width: '50%'
                    }}>

                        <h2>Special Instructions:</h2>
                        <br />
                        <div className="input-line"></div>
                        <br />
                        <div className="solid-line"></div>
                        <br />
                        <div className="solid-line"></div>
                    </div>
                </div>

                <div className="section">
                    <h2>Declaration:</h2>
                    <p className="note">The shipper hereby declares that the particulars provided are true and correct and that
                        they
                        have verified the contents, weights, and measurements of the cargo.</p>
                </div>

                <div className="section">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px'
                    }}>
                        <div>
                            <span className="section-title">Shipper Signature:</span>
                            <div className="signature-line50"></div>
                        </div>
                        <div>
                            <span className="section-title">Date:</span>
                            <div className="signature-line50"></div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        }}
                    >
                        <div>
                            <span className="section-title">Freight Forwarder Signature:</span>
                            <div className="signature-line50"></div>
                        </div>
                        <div>
                            <span className="section-title">Date:</span>
                            <div className="signature-line50"></div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2>Terms and Conditions:</h2>
                    <br />
                    <div className="signature-line50"></div>

                    <p className="note">1. This House Bill of Lading is subject to the terms and conditions of the carrier.</p>
                    <p className="note">2. The carrier is not responsible for any discrepancies in the cargo description
                        provided by
                        the shipper.</p>
                    <p className="note">3. The liability of the carrier is limited to the extent mentioned in the carriage
                        contract.
                    </p>
                    <p className="note">4. This HBL is non-negotiable and serves only as a receipt of goods.</p>
                    <div className="signature-line50"></div>

                </div>
            </div>
        </div>
    )
}

export default HBLFormat;