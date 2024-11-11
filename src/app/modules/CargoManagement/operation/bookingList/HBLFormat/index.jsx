import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import logisticsLogo from "./logisticsLogo.png";
import NewHBLFormatAir from "./newHBLFormat";

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

  const bookingData = shipBookingRequestGetById || {};

  const componentRef = useRef();
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

  return (
    <>
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
      {shipBookingRequestLoading && <Loading />}
      <NewHBLFormatAir componentRef={componentRef} bookingData={bookingData} />
      {/* <HBLFormatInvoice componentRef={componentRef} bookingData={bookingData} /> */}
    </>
  );
};


export default HBLFormat;

export const HBLFormatInvoice = ({ componentRef, bookingData }) => {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  console.log(selectedBusinessUnit)
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 400,
        display: "flex",
        flexDirection: "column",
        gap: 10,

      }}
      ref={componentRef}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src={logisticsLogo}
            alt="Logo"
            style={{
              height: 25,
              width: 150,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600
              }}
            >
              {selectedBusinessUnit?.label}
            </div>
            <div>
              {selectedBusinessUnit?.address}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 500
          }}
        >BILL OF LADING</div>
      </div>
      <div>
        {/* shipper */}
        <div
          style={{
            borderTop: "1px solid #000000",
            borderBottom: "1px solid #000000",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >

            <div>
              <div className="printSectionNoneWithNewLine" >Shipper/Exporter (Complete Name and Address)</div>
              <div>{bookingData?.shipperName}</div>
              <div>{bookingData?.shipperAddress}</div>
              <div>{bookingData?.shipperContactPerson}</div>
              <div>{bookingData?.shipperContact}</div>
              <div>{bookingData?.shipperEmail}</div>
              <div>{bookingData?.shipperState} ,{bookingData?.shipperCountry}</div>
            </div>
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  borderBottom: "1px solid #000000",
                }}
              >
                <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
                  <div className="printSectionNoneWithNewLine">Booking Number</div>
                  <div>{bookingData?.bookingRequestCode}</div>
                </div>
                <div
                  style={{
                    borderLeft: "1px solid #000000",
                  }}
                >
                  <div style={{ paddingLeft: 5 }}>
                    <div className="printSectionNoneWithNewLine">Bill of Lading Number</div>
                    <div>{bookingData?.hblnumber}</div>
                  </div>
                </div>

              </div>
              <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
                <div className="printSectionNoneWithNewLine">Export References</div>
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        {/* Consignee */}
        <div
          style={{
            borderBottom: "1px solid #000000",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div>
              <div className="printSectionNoneWithNewLine">Consignee (Complete Name and Address)</div>
              <div>{bookingData?.consigneeName}</div>
              <div>{bookingData?.consigneeAddress}</div>
              <div>{bookingData?.consigneeContactPerson}</div>
              <div>{bookingData?.consigneeContact}</div>
              <div>{bookingData?.consigState}, {bookingData?.consigCountry}</div>
              <div>{bookingData?.consigneeEmail}</div>

            </div>
            <div>
              <div
                style={{
                  borderBottom: "1px solid #000000",
                }}
              >
                <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
                  <div className="printSectionNoneWithNewLine">Forwarding Agent – References (Complete Name and Address)</div>
                  <div>{bookingData?.freightAgentReference}</div>
                  <br />
                </div>


              </div>
              <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
                <div className="printSectionNoneWithNewLine">Point and Country of Origin</div>
                <div>{bookingData?.originAddress}, {bookingData?.countryOfOrigin}</div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        {/* Notify Party (Complete Name and Address) */}
        <div
          style={{
            borderBottom: "1px solid #000000",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div>
              <div className="printSectionNoneWithNewLine">Notify Party (Complete Name and Address)</div>
              <div>{bookingData?.notifyParty}</div>
              <br />
              <br />
              <br />
            </div>
            <div>

              <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
                <div className="printSectionNoneWithNewLine">For Delivery Please Apply To</div>
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid #000000",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div>
                <div className="printSectionNoneWithNewLine">Loading Pier/Terminal</div>
                <br />
              </div>
              <div
                style={{
                  borderLeft: "1px solid #000000",
                }}
              >
                <div style={{ paddingLeft: 5 }}>
                  <div className="printSectionNoneWithNewLine">Place of Receipt</div>
                  <div>{bookingData?.pickupPlace} </div>
                </div>
              </div>

            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
                <div className="printSectionNoneWithNewLine">Pre-Carriage By</div>
                <br />
              </div>
              <div
                style={{
                  borderLeft: "1px solid #000000",
                }}
              >
                <div style={{ paddingLeft: 5 }}>
                  <div className="printSectionNoneWithNewLine">Number of Originals</div>
                  <br />
                </div>
              </div>

            </div>
            <div>

            </div>
          </div>
        </div>
        {/* Vessel/Voyage */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid #000000",
          }}
        >
          <div >
            <div
              style={{
                borderBottom: "1px solid #000000",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div>
                  <div className="printSectionNoneWithNewLine">Vessel/Voyage Number</div>
                  <div>{bookingData?.transportPlanning?.vesselName}</div>
                  <div>

                  </div>
                  <br />
                </div>
                <div
                  style={{
                    borderLeft: "1px solid #000000",
                  }}
                >
                  <div style={{ paddingLeft: 5 }}>
                    <div className="printSectionNoneWithNewLine">Port of Export</div>
                    <div>{bookingData?.portOfLoading}</div>
                  </div>
                </div>

              </div>

            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div>
                <div className="printSectionNoneWithNewLine">Port of Discharge</div>
                <div>{bookingData?.portOfDischarge}</div>
              </div>
              <div
                style={{
                  borderLeft: "1px solid #000000",
                }}
              >
                <div style={{ paddingLeft: 5 }}>
                  <div className="printSectionNoneWithNewLine">Container Number</div>
                  <br />
                </div>
              </div>

            </div>

          </div>
          <div style={{ paddingLeft: 5, borderLeft: "1px solid #000000", }}>
            <div className="printSectionNoneWithNewLine">For Delivery Please Apply To</div>
            <div>{bookingData?.finalDestinationAddress}</div>
            <br />
            <br />
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px solid #000000",
            textAlign: "center",
            padding: 5,
          }}
        >PARTICULARS FURNISHED BY SHIPPER</div>
        {/* table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 6fr 1fr 1fr",
          }}
        >
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 2,
              textAlign: "center"

            }}
          >
            Marks and Numbers
          </div>

          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 2

            }}
          >
            <div
              style={{
                display: "grid",
                gap: 200
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <span>Number/Kinds of Packages</span>
                  {
                    bookingData?.rowsData?.map((item, index) => (
                      <div key={Math.random()}>
                        {item?.totalNumberOfPackages}
                        {index < bookingData?.rowsData?.length - 1 ? "," : ""}
                        <br />
                      </div>
                    ))
                  }
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div>Description of Goods</div>
                  {
                    bookingData?.rowsData?.map((item, index) => (
                      <div key={Math.random()}>
                        {item?.descriptionOfGoods}, {item?.hsCode}
                        {index < bookingData.rowsData.length - 1 ? "," : ""}
                        <br />
                      </div>
                    ))
                  }
                  <br />
                </div>
              </div>

              <div>These commodities, technologies, or software were exported from the United States in accordance with
                the Export Administration Regulations. Diversion contrary to U.S. law prohibited.</div>

            </div>
          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 2,
              textAlign: "center"

            }}
          >
            Gross Weight <br />
            {
              bookingData?.rowsData?.map((item, index) => (
                <div key={Math.random()}>
                  {item?.totalGrossWeightKG}
                </div>
              ))
            }
          </div>
          <div
            style={{
              borderBottom: "1px solid #000000",
              padding: 2,
              textAlign: "center"
            }}
          >
            Measurement
            <br />
            {
              bookingData?.rowsData?.map((item, index) => (
                <div key={Math.random()}>
                  {item?.totalVolumeCBM}
                </div>
              ))

            }
          </div>
        </div>
        {/* table footer section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "7fr 1fr 1fr",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 5

            }}
          >
            Liability Limits for loss or damage to Goods are applicable. Carrier’s liability for Goods is limited to $500 per package or shipping unit.
            Excess Liability Coverage is requested by Merchant in the amount of _____________________. Merchant understands that there is an
            additional charge for excess liability coverage and you are willing to pay such charge. Excess liability coverage cannot exceed the actual
            value of the Goods.
          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              textAlign: "center"

            }}
          >
            Total
            <br />
            {
              bookingData?.rowsData?.map((item, index) => (
                <div key={Math.random()}>
                  {item?.totalGrossWeightKG}
                </div>
              ))
            }
          </div>
          <div
            style={{
              borderBottom: "1px solid #000000",
              textAlign: "center"

            }}
          >
            Total <br />
            {
              bookingData?.rowsData?.map((item, index) => (
                <div key={Math.random()}>
                  {item?.totalVolumeCBM}
                </div>
              ))

            }
          </div>



        </div>
        {/* bottom section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr ",
            gap: 10,
            padding: 5,
            alignItems: "center"
          }}
        >
          <div>
            RECEIVED by the Carrier from the Merchant in apparent good order and condition unless otherwise indicated, the Goods mentioned
            above to be carried by the Vessel and carriers subject to the Bill of Lading from the Place of Receipt or the Port of Export to the Port of
            Discharge or Place of Delivery shown above.
            <br />
            <br />
            If the Goods are shipped by the Merchant in a Container, then this Bill of Lading is a receipt and part of the contract for the Container
            and any statements made by the Carrier in this Bill of Lading as to the number, good order and condition of the Goods shall apply only to
            the number of such Containers and their exterior condition.
            <br />
            <br />
            The Carrier has the right to use feeder ships, barges, airplanes, motor carrier, air or rail cars for all or any part of this Carriage of the
            Goods. When the Place of Receipt is an inland point, notations in this Bill of Lading such as “On Board,” “Loaded on Board,” “Shipped on
            Board” mean on board the conveyance performing the overland or air carriage from the Place of Receipt to the Load Port.
            <br />
            <br />
            One original of this Bill of Lading must be surrendered duly endorsed in exchange for the Goods. When one of the originals of this Bill of
            Lading has been accomplished, other bills of lading will stand void.
          </div>
          <div>
            Carrier: <span
              style={{
                borderBottom: "1px solid #000000",
                display: "inline-block",
                textAlign: "center"
              }}
            >
              {selectedBusinessUnit?.label}
            </span>
            <br />
            <br />
            <br />
            <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                alignItems: "center"
              }}
            >
              <div>
                By: <span
                  style={{
                    borderBottom: "1px solid #000000",
                    display: "inline-block",
                    textAlign: "center",
                    width: "50%"
                  }}

                >

                </span>
                <span> (As Carrier)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 5
                }}
              >
                <div>
                  Date:
                </div>
                <span
                  style={{
                    borderBottom: "1px solid #000000",
                    display: "inline-block",
                    textAlign: "center",
                    width: "100%"
                  }}
                >

                </span>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
