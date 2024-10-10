import React, { useEffect } from 'react';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import './style.css';

const FreightInvoice = ({ rowClickData }) => {
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
        <div className="freightInvoice-container">
            <div className="container-freight">
                {/* Header */}
                <div className="container-freight">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvmFSyWpG3yZ2NkMdPaOR9g6dO_BhgUP4BA&s"
                        alt="Freight Forwarder Logo"
                        className="logo"
                    />
                    <h1>Freight Forwarder's Name</h1>
                    <div className="company-details">
                        <div>[Company Name]</div>
                        <div>[Company Address]</div>
                        <div>[City, Postal Code, Country]</div>
                        <div>Phone: </div>
                        <div>Email:</div>
                        <div>Website: </div>
                        <div>[Tax ID Number] </div>
                        <div>Invoice Number: </div>
                        <div>Invoice Date: </div>
                        <div>Due Date:</div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="client-details">
                    <h3>Bill To</h3>
                    <div className="tab">
                        <div>Client’s Name: </div>
                        <div>Client’s Address:</div>
                        <div>[City, Postal Code, Country]</div>
                        <div>Phone Number: </div>
                        <div>Contact Person’s Name</div>
                    </div>
                </div>

                {/* Shipment Details */}
                <div className="shipment-details">
                    <h3>Shipment Details</h3>
                    <div className="tab">
                        <div>Shipment Reference Number: </div>
                        <div>Bill of Lading Number (BOL): </div>
                        <div>Carrier: </div>
                        <div>Origin: </div>
                        <div>Destination: </div>
                        <div>Incoterms: </div>
                        <div>Mode of Transport:</div>
                    </div>
                </div>

                {/* Freight Charges Breakdown */}
                <div className="charges-breakdown">
                    <h3>Freight Charges Breakdown</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity/Weight</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Freight Charges</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Fuel Surcharge</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Documentation Fee</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Handling Fee</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Customs Brokerage</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Port/Terminal Charges</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Insurance (if applicable)</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Other Charges</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Taxes & Duties */}
                <div className="taxes-freight">
                    <h3>Taxes & Duties</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>VAT (if applicable)</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Customs Duties (if any)</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Other Taxes (if any)</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Grand Total */}
                <div className="grand-total">
                    <h3>Grand Total</h3>
                    <div className="tab">
                        <div>Total Amount Payable: </div>
                        <div>Currency: </div>
                    </div>
                </div>

                {/* Payment Instructions */}
                <div className="payment-instructions">
                    <h3>Payment Instructions</h3>
                    <div className="tab">
                        <div>Bank Name: </div>
                        <div>Bank Address: </div>
                        <div>Account Number: </div>
                        <div>IBAN: </div>
                        <div>SWIFT/BIC Code: </div>
                        <div>Reference: Please quote Invoice Number when making payment.</div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="terms-conditions">
                    <h3>Terms & Conditions</h3>
                    <div className="tab">
                        <div>Payment is due within [X] days of the invoice date.</div>
                        <div>Late payments may incur a [X]% penalty fee.</div>
                        <div>All charges are subject to the applicable Incoterms 2020.</div>
                        <div>Liability for goods in transit is subject to the carrier’s terms and conditions.</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer">
                    {/* <p>Thank you for your business!</p> */}
                </div>
            </div>
        </div>
    );
};

export default FreightInvoice;
