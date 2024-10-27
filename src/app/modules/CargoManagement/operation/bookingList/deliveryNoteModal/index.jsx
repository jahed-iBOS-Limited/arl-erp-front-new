import React, { useEffect, useRef } from 'react';
import { imarineBaseUrl } from '../../../../../App';
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import logisticsLogo from "./logisticsLogo.png";
import './style.css';

import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import Loading from '../../../../_helper/_loading';

const tableData = [
    { description: 'EX Work Charges FXD', rate: '107.50USD', conversion: '110.50000', uom: 'PerShipment', totalBDT: '11,878.75' },
    { description: 'Air Freight', rate: '2.75USD', conversion: '110.50000', uom: '1', totalBDT: '55,609.13' }
];

export default function DeliveryNoteModal({ rowClickData }) {
    const bookingRequestId = rowClickData?.bookingRequestId;
    const componentRef = useRef();
    const { selectedBusinessUnit } = useSelector(
        (state) => state?.authData || {},
        shallowEqual
    );

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
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Customs-RTGS",
        pageStyle: `
          @media print {
            body {
              -webkit-print-color-adjust: exact;
           
            }
            @page {
              size: portrait !important;
              margin: 15px !important;
            }
          }
        `,
    });
    if (shipBookingRequestLoading) return <div
        className='d-flex justify-content-center align-items-center'
    >
        <Loading />
    </div>
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}
            >
                <button
                    onClick={handlePrint}
                    type="button"
                    className="btn btn-primary px-3 py-2"
                >
                    <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
                    Print
                </button>
            </div>

            <div
                style={{
                    fontSize: 11,
                    display: "grid",
                    gap: 10
                }}
                ref={componentRef}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 11fr"
                    }}
                >
                    <img src={logisticsLogo} alt=""
                        style={{
                            height: 25,
                            width: 150,
                            objectFit: "cover",
                        }}
                    />
                    <div
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 600 }}> {selectedBusinessUnit?.label}</span><br />
                        <span>  {selectedBusinessUnit?.address}</span> <br />
                    </div>

                </div>
                <div style={{ backgroundColor: "#D6DADD", height: "1px" }} />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr ",
                        // border: "1px solid #000000",

                    }}
                >
                    {/* left side  */}
                    <div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2, fontWeight: 600, }}>Challan No </span>
                            <span style={{ padding: 2 }}>: DC01020249230</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2, fontWeight: 600, }}>Sold To Partner </span>
                            <span style={{ padding: 2 }}>: AKIJ READY MIX CONCRETE LTD. (Narayangong Plant)</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2, fontWeight: 600, }}>Ship To Partner</span>
                            <span style={{ padding: 2 }}>: AKIJ READY MIX CONCRETE LTD. (Narayangong Plant) [22216566]</span>
                        </div>
                    </div>
                    {/* right side */}
                    <div >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2, fontWeight: 600, }}>Delivery From </span>
                            <span style={{ padding: 2 }}>: ACCL Factory</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2, fontWeight: 600, }}>ShipPoint </span>
                            <span style={{ padding: 2 }}>: ACCL Factory</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2, fontWeight: 600, }}>Delivery Order</span>
                            <span style={{ padding: 2 }}>: ACCL Factory</span>
                        </div>

                    </div>
                </div>
                {/* table  */}
                <div
                    style={{
                        paddingTop: 20, paddingBottom: 20
                    }}
                >

                    <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', }} >
                        <thead>
                            <tr style={{ backgroundColor: "#D6DADD" }}>
                                <th>SL</th>
                                <th>PRODUCT DESCRIPTION</th>
                                <th>UOM</th>
                                <th>QNT.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td>{row.description}</td>
                                    <td style={{ textAlign: "left" }}>{row.rate}</td>
                                    <td style={{ textAlign: "right" }}>{row.conversion}</td>
                                </tr>
                            ))}
                            <tr style={{ fontSize: 14, fontWeight: 600, textAlign: "right" }}>
                                <td colSpan="3" > Total</td>
                                <td> 67,487.88</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* signature  */}
                <div
                    style={{
                        paddingTop: "5rem"
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                        }}
                    >
                        <div>  <span style={{ borderTop: "1px solid #000000", paddingTop: 2 }}>Officer</span></div>
                        <div>  <span style={{ borderTop: "1px solid #000000", paddingTop: 2 }}>Driver's Signature</span></div>
                        <div
                            style={{
                                textAlign: "right"
                            }}
                        >  <span style={{ borderTop: "1px solid #000000", paddingTop: 2 }}>Receiver's Signature With Seal & Date 22</span></div>

                    </div>
                </div>


            </div>
        </div>
    )
}

