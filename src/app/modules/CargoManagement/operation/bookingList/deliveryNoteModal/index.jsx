import React from 'react'
import './style.css'
export default function DeliveryNoteModal() {
    return (
        <div className='DeliveryNoteModal'>
            <div className="container">
                <div className="input-line50"></div>

                <h1 className="section-title">DELIVERY NOTE</h1>
                <br />

                <div className="input-line50"></div>

                <div className="section">
                    <span className="section-title">Delivery Note Number:</span>
                    <div className="solid-line50"></div>
                </div>

                <div className="section">
                    <span className="section-title">Date:</span>
                    <div className="solid-line50"></div>
                </div>

                <div className="section">
                    <p>Shipper Information</p>
                    <div className="input-line50"></div>

                    <span className="section-title">Company Name:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Address:</span>
                    <div className="solid-line"></div>
                    <br />
                    <div className="solid-line"></div>

                    <span className="section-title">Phone:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Email:</span>
                    <div className="solid-line50"></div>
                </div>

                <div className="section">
                    <p>Consignee Information</p>
                    <div className="input-line50"></div>

                    <span className="section-title">Company Name:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Address:</span>
                    <div className="solid-line"></div>
                    <br />
                    <div className="solid-line"></div>

                    <span className="section-title">Phone:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Email:</span>
                    <div className="solid-line50"></div>
                </div>

                <div className="section">
                    <p>Delivery Information</p>
                    <div className="input-line50"></div>
                    <span className="section-title">Warehouse Location:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Delivery Address:</span>
                    <div className="solid-line50"></div>
                    <br />
                    <div className="solid-line50"></div>

                    <span className="section-title">Delivery Date & Time:</span>
                    <div className="solid-line50"></div>
                </div>

                <div className="section">
                    <p>Transporter/Driver Information</p>
                    <div className="input-line50"></div>
                    <span className="section-title">Driver Name:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Vehicle Number:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Contact Number:</span>
                    <div className="solid-line50"></div>

                    <span className="section-title">Delivery Person:</span>
                    <div className="solid-line50"></div>
                </div>

                <div className="section">
                    <p>Itemized List of Goods</p>
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Description of Goods</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Weight (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((num) => (
                                <tr key={num}>
                                    <td>{num}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="section" style={{ marginTop: '10px' }}>
                        <span className="section-title">Total Quantity:</span>
                        <div className="solid-line50"></div>

                        <span className="section-title">Total Weight:</span>
                        <div className="solid-line50"></div>
                    </div>
                </div>

                <div className="section">
                    <p>Special Handling Instructions</p>
                    <div className="solid-line"></div>
                    <br />
                    <div className="solid-line"></div>
                </div>

                <div className="section">
                    <p>Acknowledgment</p>
                    <div className="signature-line50"></div>

                    <span className="section-title">Received by (Consignee):</span>
                    <div className="signature-line-solid50"></div>

                    <span className="section-title">Signature:</span>
                    <div className="signature-line-solid50"></div>

                    <span className="section-title">Date:</span>
                    <div className="signature-line-solid50"></div>
                </div>

                <div className="section">
                    <p>Notes:</p>
                    <div className="signature-line"></div>
                    <p className="note">- Please verify the items and quantities upon delivery.</p>
                    <p className="note">- Report any discrepancies or damages immediately to the delivery personnel.</p>
                    <div className="signature-line"></div>
                </div>

                <div className="internal-section">
                    <p>For Internal Use Only</p>
                    <div className="signature-line50"></div>

                    <span className="section-title">Checked by (Warehouse):</span>
                    <div className="signature-line-solid50"></div>

                    <span className="section-title">Signature:</span>
                    <div className="signature-line-solid50"></div>

                    <span className="section-title">Date:</span>
                    <div className="signature-line-solid50"></div>

                    <p >Comments:</p>
                    <div className="signature-line-solid"></div>

                    <br />
                    <div className="signature-line-solid"></div>
                </div>
            </div>
        </div>
    )
}

