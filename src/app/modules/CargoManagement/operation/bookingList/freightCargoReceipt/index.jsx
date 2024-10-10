import React from 'react';
import './style.css';

const FreightCargoReceipt = () => {
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
                    <span className="section-title">Name:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Address:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Contact Person:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Phone:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Email:</span>
                </div>

                <div className="section">
                    <h2>Consignee Details:</h2>
                    <div className="input-line50"></div>
                    <span className="section-title">Name:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Address:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Contact Person:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Phone:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Email:</span>
                    <div className="new-line"></div>
                </div>

                <div className="section">
                    <h2>Transport Details:</h2>
                    <div className="input-line50"></div>
                    <span className="section-title">Transport Mode:</span>
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
                    <span className="section-title">Description of Goods:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Total Weight:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Total Volume:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Number of Packages:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Package Type:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Hazardous Material:</span>
                    <div className="new-line"></div>
                    <span className="section-title">Special Instructions:</span>
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
