import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';

const FreightCargoReceipt = ({ rowClickData }) => {
    const componentRef = useRef();
    const [, createHblFcrNumber, createHblFcrNumberLoading] = useAxiosPut();

    const { selectedBusinessUnit } = useSelector(
        (state) => state?.authData || {},
        shallowEqual
    );
    const bookingRequestId = rowClickData?.bookingRequestId;
    const [
        shipBookingRequestGetById,
        setShipBookingRequestGetById,
        shipBookingRequestLoading,
    ] = useAxiosGet();

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
              margin: 50px !important;
            }
          }
        `,
    });

    useEffect(() => {
        if (bookingRequestId) {
            setShipBookingRequestGetById(
                `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
            );
            commonGetByIdHandler();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingRequestId]);
    const saveHandler = (values) => {
        createHblFcrNumber(
            `${imarineBaseUrl}/domain/ShippingService/CreateHblFcrNumber?BookingId=${bookingRequestId}&typeId=2`,
            null,
            () => {
                commonGetByIdHandler();
            }
        );
    };
    const commonGetByIdHandler = () => {
        setShipBookingRequestGetById(
            `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
        );
    };
    const bookingData = shipBookingRequestGetById || {};
    if (shipBookingRequestLoading) return <div
        className='d-flex justify-content-center align-items-center'
    >
        <Loading />
    </div>
    return (
        <>
            <div className="">
                {/* Save button add */}

                <div className="d-flex justify-content-end">
                    {!bookingData?.fcrnumber && (
                        <>
                            {" "}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    saveHandler();
                                }}
                            >
                                Generate
                            </button>
                        </>
                    )}

                    {bookingData?.fcrnumber && (
                        <>
                            <button
                                onClick={handlePrint}
                                type="button"
                                className="btn btn-primary px-3 py-2"
                            >
                                <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
                                Print
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div
                style={{
                    fontSize: 11,
                    display: "grid",
                    gap: 10
                }}
                ref={componentRef}
            >

                <div>
                    <span>To :</span> <br />

                    <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{bookingData?.consigneeName}</span><br />
                    <span>{bookingData?.consigneeAddress}</span> <br />
                    <span>{bookingData?.consigneeContactPerson}</span><br />
                    <span>{bookingData?.consigneeContact}</span><br />
                </div>
                <div
                    style={{
                        justifyContent: "center",
                        display: "flex",
                    }}
                >
                    <span style={{ borderBottom: "1px solid #000000", fontSize: 14, fontWeight: 600, }}>TO WHOM IT MAY CONCERN</span> <br />
                </div>
                <div><span style={{ borderBottom: "1px solid #000000", fontSize: 14, fontWeight: 600, }}>SHIPMENT REF. :</span> <br /></div>

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
                            <span style={{ padding: 2, }}>SHIPPER NAME</span>
                            <span style={{ padding: 2 }}>: {bookingData?.shipperName}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>POL </span>
                            <span style={{ padding: 2 }}>: {bookingData?.portOfLoading}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>POD</span>
                            <span style={{ padding: 2 }}>: {bookingData?.portOfDischarge}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>INCOTERMS</span>
                            <span style={{ padding: 2 }}>: {bookingData?.incoterms}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>TRANSPORT CARRIER</span>
                            <span style={{ padding: 2 }}>: YANG MING MARINE TRANSPORT CORP</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>M.VSL/FLIGHT NAME</span>
                            <span style={{ padding: 2 }}>: {bookingData?.transportPlanning?.vesselName}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>F.VSL/FLIGHT NAME</span>
                            <span style={{ padding: 2 }}>: {bookingData?.transportPlanning?.vesselName}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>ETA</span>
                            <span style={{ padding: 2 }}>: 27-12-2023</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>MBL/MAWB NUM</span>
                            <span style={{ padding: 2 }}>: {bookingData?.blnumber}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>HBL/HAWB NUM</span>
                            <span style={{ padding: 2 }}>:{bookingData?.hblnumber}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>PALLET/CONTAINER NO.</span>
                            <span style={{ padding: 2 }}>: {bookingData?.transportPlanning?.noOfPallets} / {bookingData?.transportPlanning?.noOfContainer}</span>
                        </div>
                    </div>
                    {/* right side */}
                    <div>
                        <div
                            style={{
                                display: "grid",
                                gap: 10,
                                paddingBottom: 10
                            }}

                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 3fr ",
                                }}
                            >
                                <span style={{ padding: 2 }}>L/C NO </span>
                                <span style={{ padding: 2 }}>: {bookingData?.lcNo ?? "N/A"}</span>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 3fr ",
                                }}
                            >
                                <span style={{ padding: 2 }}>L/C DATE </span>
                                <span style={{ padding: 2 }}>: {bookingData?.lcDate ? moment(bookingData?.lcDate).format("DD MMM YYYY HH:mm A") : 'N/A'}</span>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 3fr ",
                                }}
                            >
                                <span style={{ padding: 2 }}>MODE</span>
                                <span style={{ padding: 2 }}>: {bookingData?.modeOfTransport}</span>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>M.VSL/FLIGHT NUM</span>
                            <span style={{ padding: 2 }}>: {bookingData?.flightNumber}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>F.VSL/FLIGHT NUM</span>
                            <span style={{ padding: 2 }}>: </span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>ATA</span>
                            <span style={{ padding: 2 }}>: 31-12-2023</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>MBL/MAWB DATE</span>
                            <span style={{ padding: 2 }}>: {moment(bookingData?.bldate).format("YYYY-MM-DD, HH:mm A")}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>HBL/HAWB DATE</span>
                            <span style={{ padding: 2 }}>: {moment(bookingData?.hbldate).format("YYYY-MM-DD, HH:mm A")}</span>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 3fr ",

                            }}
                        >
                            <span style={{ padding: 2 }}>SEAL NUMBER</span>
                            <span style={{ padding: 2 }}>: {bookingData?.fcrnumber || 'N/A'}</span>
                        </div>

                    </div>
                </div>
                <span>This is to certify that the freight for the above mentioned shipment is as under.</span>
                <p>FREIGHT:</p>
                <div
                    style={{
                        paddingLeft: 25,
                    }}
                >
                    <span>Ocean Freight is 850.00/40’HQ</span> <br />
                    <span>Total Container: 01 X 40’HQ</span> <br />
                    <span>Ex Rate 110.50</span> <br />
                    <span>So, Total Ocean Freight is USD 850.00 or BDT 93,925.00</span> <br />
                    <span>Goods Description: BRAND NEW CAPITAL MACHINERY WITH THEIR STANDARD ACCESSORIES</span> <br />
                </div>
                <span style={{ paddingLeft: 10 }}>Thanks and Best Regards,</span>
                <span>Sincerely Yours</span>
                <div style={{ paddingTop: "5rem" }}>
                    <span>For : {selectedBusinessUnit?.label}</span> <br />
                    <span>As Agents</span> <br />
                </div>
                <div style={{ paddingTop: '5rem' }}>
                    <div style={{ borderTop: "1px solid #000000", backgroundColor: "#000000" }} />
                    <div
                        style={{
                            display: "grid",
                            justifyContent: "center",
                            textAlign: "center",

                        }}
                    >
                        <span>{selectedBusinessUnit?.label}</span>
                        <span>{selectedBusinessUnit?.address}</span>
                    </div>
                </div>

            </div>
        </>


    );
};

export default FreightCargoReceipt;
