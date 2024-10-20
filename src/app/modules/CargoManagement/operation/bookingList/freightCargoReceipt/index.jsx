import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const FreightCargoReceipt = ({ rowClickData }) => {
    const componentRef = useRef();

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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingRequestId]);
    const bookingData = shipBookingRequestGetById || {};
    if (shipBookingRequestLoading) return <div
        className='d-flex justify-content-center align-items-center'
    >
        <Loading />
    </div>
    const tableData = [
        {
            marksAndNos: 'WWWWWWWWWW',
            noOfPkgs: '1',
            descriptionOfPackagesAndGoods: 'S.T.C. 1 PALLET OF 1 DRUM',
            weight: {
                value: '450 Lbs',
                measurement: '20412 Kgs',
            },
            measurement: {
                value: '2.0 Cft',
                measurement: '0.056 Cbm',
            }
        },
        {
            marksAndNos: '',
            noOfPkgs: '3',
            descriptionOfPackagesAndGoods: `40' Container (Closed) Said To Contain: 1 X 40' Container 3 Pallets 3,000 Lbs. Of`,
            weight: {
                value: '450 Lbs',
                measurement: '20412 Kgs',
            },
            measurement: {
                value: '2.0 Cft',
                measurement: '0.056 Cbm',
            }
        },
    ];
    const tableColumns = [
        { name: 'MARKS & NOS.', key: 'col1' },
        { name: 'NO. OF PKGS', key: 'col2' },
        { name: 'DESCRIPTION OF PACKAGES AND GOODS', key: 'col3' },
        { name: 'WEIGHT', key: 'col4' },
        { name: 'MEASUREMENT (H W L)', key: 'col5' },
    ]

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "20px 0px",
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
                    border: '2px solid #000',
                    padding: '10px 0px',
                }}
                ref={componentRef}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.5fr',
                        gap: '10px',
                    }}
                >
                    <div
                        style={{
                            marginLeft: '10px',
                            marginTop: '30px',
                        }}
                    >
                        <div
                            style={{
                                marginLeft: '10px',
                                paddingBottom: '50px'
                            }}
                        >
                            <p
                                style={{
                                    borderTop: '2px solid #000',
                                    width: '50%',
                                }}
                            > IATA 1-4325/1</p>
                            <p>FMC # 4900</p>
                            <p> CHB Lic 123-456</p>
                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                padding: '10px',
                                fontWeight: 600,
                            }}
                        >
                            <p
                                style={{
                                    paddingBottom: '5px',

                                }}
                            >Shipper/Exporter:</p>
                            <p>{bookingData?.shipperName}</p>
                            <p>{bookingData?.shipperAddress}</p>
                            <p>{bookingData?.shipperContactPerson}</p>
                            <p>{bookingData?.shipperContact}</p>
                            <p>{bookingData?.shipperEmail}</p>

                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                padding: '10px',
                                fontWeight: 600,
                            }}
                        >
                            <p
                                style={{
                                    paddingBottom: '5px',

                                }}
                            >Consignee:</p>
                            <p>{bookingData?.consigneeName}</p>
                            <p>{bookingData?.consigneeAddress}</p>
                            <p>{bookingData?.consigneeContactPerson}</p>
                            <p>{bookingData?.consigneeContact}</p>
                            <p>{bookingData?.consigneeEmail}</p>
                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                padding: '10px',
                                fontWeight: 600,
                            }}
                        >
                            <p
                                style={{
                                    paddingBottom: '5px',

                                }}
                            >Notify Party:</p>
                            <p>{bookingData?.notifyParty}</p>

                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                padding: '0px 10px',
                                fontWeight: 600,
                            }}
                        >
                            <p>Port or Airport:</p>
                            <p>WANDO TERMINAL</p>
                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                fontWeight: 600,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        borderRight: '1px solid #000',
                                        width: '50%',
                                        padding: '0px 10px',

                                    }}
                                >
                                    <p>Exporting Carrier (Vessel/Airline)</p>
                                    <p>{bookingData?.transportPlanning?.vesselName}</p>
                                </div>
                                <div
                                    style={{
                                        padding: '0px 10px',
                                    }}
                                >
                                    <p>Port of Loading</p>
                                    <p>{bookingData?.portOfLoading}</p>
                                </div>
                            </div>

                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                fontWeight: 600,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        borderRight: '1px solid #000',
                                        borderTop: 'none',
                                        minWidth: '50%',
                                        padding: '0px 10px',

                                    }}
                                >
                                    <p>Air/Sea Port of Discharge</p>
                                    <p>{bookingData?.portOfDischarge}</p>
                                </div>
                                <div
                                    style={{
                                        padding: '0px 10px',
                                    }}
                                >
                                    <p>For Transfer to</p>
                                    <p>SJO</p>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div
                        style={{
                            marginRight: '10px',
                        }}
                    >
                        <div
                            style={{
                                textAlign: 'center',

                            }}
                        >
                            <p style={{ fontSize: 20, fontWeight: 600, borderBottom: '2px solid #000', marginBottom: '10px' }}>Your company logo here</p>
                            <p>4421 Conlin Street, Suite 202</p>
                            <p>Metairie, LA 70006</p>
                            <p>Phone: (504) 888-5598</p>
                            <p>Fax: (504) 888-5599</p>
                            <p>Email: melcogroup@comm.net</p>
                            <p>Internet: <a href="http://www.melcogroup.com" target="_blank" rel="noreferrer">www.melcogroup.com</a></p>
                            <p
                                style={{
                                    fontWeight: 700,
                                    fontSize: '2rem',
                                }}
                            >
                                FORWARDER{"'"}S <br /> CARGO RECEIPT
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '5px',
                                    justifyContent: 'center',
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: 600
                                    }}
                                >DATE</p>
                                <p>5/03/1999</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0px 10px',

                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '2px',

                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: 600
                                    }}
                                >REFERENCE # </p>
                                <p>345</p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '2px',
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: 600
                                    }}
                                >BL/AWB #: BL #</p>
                                <p>23845345</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '2px',
                                justifyContent: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: 600,
                                }}
                            >BOOKING # </p>
                            <p>CSB5678</p>
                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                padding: '10px',
                                fontWeight: 600,
                            }}
                        >
                            <p>Point & Country of Origin:</p>
                            <p>{bookingData?.originAddress}</p>

                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                padding: '10px',
                                fontWeight: 600,
                            }}
                        >
                            <p
                                style={{
                                    paddingBottom: '2px',

                                }}
                            >Domestic Routing / Export Instructions:</p>
                            <div
                                style={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                <p>Latasa Uruguay Trading S.A.</p>
                                <p>Plaza Independencia 808-PB 101</p>
                                <p>Montevideo, Uruguay</p>
                                <p>Y Riesgo del Consignatario Carg????</p>

                            </div>
                        </div>
                        <div
                            style={{
                                border: '1px solid #000',
                                borderTop: 'none',
                                padding: '10px',
                                fontWeight: 600,
                            }}
                        >
                            <p
                                style={{
                                    paddingBottom: '5px',

                                }}
                            >For Delivery of Goods Please Apply To:</p>
                            <div
                                style={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                <p>Latasa Uruguay Trading S.A.</p>
                                <p>Plaza Independencia 808-PB 101</p>
                                <p>Montevideo, Uruguay</p>
                                <p>Y Riesgo del Consignatario Carg????</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5rem',
                        border: '1px solid #000',
                        marginTop: '50px',
                        marginRight: '10px',
                        marginLeft: '10px',

                    }}
                >
                    <table style={{ width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr
                                style={{
                                    borderBottom: '1px solid #000',
                                    fontWeight: 600,
                                }}
                            >
                                {tableColumns.map((column, index) => (
                                    <th key={index}>{column.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookingData?.rowsData?.map((row, index) => (
                                <tr key={index}>
                                    <td>{row?.marksAndNos}</td>
                                    <td>{row?.numberOfPackages}</td>
                                    <td>{row?.descriptionOfGoods}</td>
                                    <td>
                                        {row?.netWeightKG} KG<span style={{ paddingRight: '20px' }}></span> {row?.grossWeightKG} KG
                                    </td>
                                    <td>{row?.dimsHeight}<span style={{ paddingRight: '20px' }}></span> {row?.dimsWidth}<span style={{ paddingRight: '20px' }}></span> {row?.dimsLength}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                        }}
                    >
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: '#000',
                                margin: '0px 10px',
                            }}
                        />
                        <div
                            style={{
                                height: '1px',
                                backgroundColor: '#000',
                                margin: '0px 10px',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                padding: '10px',
                                fontWeight: 600,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                maxWidth: '55%',
                            }}
                        >
                            <p> WE CERTIFY THAT THE SHIPMENT DESCRIBED ABOVE HAS BEEN RECEIVED BY US IN APPARENT GOOD CONDITION FROM THE ABOVE MENTIONED SHIPPER/EXPORTER.</p>
                            <p>THE SHIPMENT IS SCHEDULED FOR IRREVOCABLE REFORWARDING ADDRESSED TO THE ABOVE NAMED CONSIGNEE/NOTIFY PARTY, DEPARTING HERE ON 3/04/1998 DUE TO ARRIVE AT THE ABOVE STATED DESTINATION ON/OR ABOUT 3/11/1998</p>
                            <p>IF YOU HAVE ANY QUESTIONS OR REQUIRE ADDITIONAL INFORMATION, PLEASE REFER TO THE ABOVE DESCRIBED SHIPMENT AND CONTACT Traffic Contact</p>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                padding: '10px',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                maxWidth: '55%',
                            }}
                        >
                            <p>This company has policy against payment, solicitation, or receipt of any rebate, directly or indirectly, which would be unlawful under the United States Shipping Act 1984. Inon recent we shall nowvide a detailed list of the components of these charges and a true com of any nertinent document relating to the charges in this invoice.</p>
                        </div>
                    </div>

                </div>

            </div>
        </>


    );
};

export default FreightCargoReceipt;
