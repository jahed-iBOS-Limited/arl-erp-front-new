import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from "../../../../../App";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import logisticsLogo from "./logisticsLogo.png";
import NewHBLFormatAir from "./newHBLFormat";
import "./style.css";

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
  const data =
  {
    id: 1,
    marksNo: "As per invoice",
    shippingUnit: "170 ( ONE HUNDRED SEVENTY CTNS ONLY) CTNS",
    text1: "MAN TROUSERS",
    text2: "98% COTTON 2% ELASTANE",
    orderNo: "24982-D/1",
    hsCode: "H.S. CODE: 62034200 CAT: 6",
    description: "M/VSL:NORTHERN MAGNITUDE V-336W",
    invoiceNo: " JDL/GW/23/866",
    license: "253012375998-G",
    exp: " 1741-009662-2023",
    item: bookingData?.transportPlanning?.containerDesc,
    grossWeight: "3960.000",
    measurement: "16.300",
    // SHIPPED ON BOARD EX:CHATTOGRAM, Bangladesh 01.09.2023 Feeder Vessel: HANSA HOMBURG V-10W1
    shippedOnBoard: "Bangladesh 01.09.2023",
    feederVessel: "HANSA HOMBURG V-10W1"

  }

  const SingleItem = ({ item }) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 6fr 1fr 1fr",
          fontSize: 11,
          textTransform: "uppercase"
        }}
      >
        <div
          style={{
            borderRight: "1px solid #000000",
            borderBottom: "1px solid #000000",
            padding: 2

          }}
        >
          {item?.marksNo}
        </div>
        <div
          style={{
            borderRight: "1px solid #000000",
            borderBottom: "1px solid #000000",
            padding: 2

          }}
        >
          {item?.shippingUnit}
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
              gap: 20
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <span>{item?.text1}</span>
                <span> {item?.text2}</span>
                <span> {item?.orderNo}</span>
                <span>  {item?.hsCode}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <span>SHIPPED ON BOARD: <br />{item?.shippedOnBoard}</span>
                <span>Feeder Vessel: <br />{item?.feederVessel}</span>
              </div>
            </div>
            <div
              style={{ textAlign: "center" }}
            >
              {item?.description}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}><span>INV.NO.: {item?.invoiceNo}</span> <span>DATE.: 23.08.2023</span></div>
              <div style={{ display: "flex", justifyContent: "space-around" }}><span>L/C NO: {item?.license}</span><span>DATE.: 23.08.2023</span></div>
              <div style={{ display: "flex", justifyContent: "space-around" }}> <span>EXP No.:  {item?.exp}</span><span>DATE.: 23.08.2023</span></div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Container No.</th>
                  <th style={{ textAlign: "start" }}>Seal No.</th>
                  <th style={{ textAlign: "start" }}>Size</th>
                  <th style={{ textAlign: "start" }}>Qty</th>
                  <th style={{ textAlign: "start" }}>CBM</th>
                  <th style={{ textAlign: "start" }}>Kgs</th>
                </tr>
              </thead>
              <tbody>
                {
                  item?.item?.map((list) => (
                    <tr key={list}>
                      <td>{list.containerNumber}</td>
                      <td>{list.sealNumber}</td>
                      <td>{list.size}</td>
                      <td>{list.quantity}</td>
                      <td>{list.cbm}</td>
                      <td>{list.kgs}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

          </div>
        </div>
        <div
          style={{
            borderRight: "1px solid #000000",
            borderBottom: "1px solid #000000",
            padding: 2,
            textAlign: "center"

          }}
        >{item?.grossWeight} <br /> kgs</div>
        <div
          style={{
            borderBottom: "1px solid #000000",
            padding: 2,
            textAlign: "center"
          }}
        >
          {item?.measurement} <br /> cbm
        </div>
      </div>

    )
  }
  return (
    <div className="hbl-container" ref={componentRef}>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid #000000"
          }}
        >
          <p
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              textAlign: "center",
              fontWeight: 500

            }}
          >Bill of Landing</p>
          <p
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              textAlign: "center"

            }}
          >
            NOT NEGOTIABLE UNLESS CONSIGNED &quot;TO ORDER&quot;
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            fontSize: 11
          }}
        >
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
            }}
          >
            {/* shipper section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: 4,
                paddingBottom: 5,
                borderBottom: '1px solid #000000'
              }}
            >
              <span>{bookingData?.shipperName}</span>
              <span>{bookingData?.shipperAddress}</span>
              <span>{bookingData?.shipperContactPerson}</span>
              <span>{bookingData?.shipperContact}</span>
              <span>{bookingData?.shipperEmail}</span>

            </div>
            {/* Consignee section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: 4,
                paddingBottom: 5,
                borderBottom: "1px solid #000000",

              }}
            >
              <span>Consignee (if To Order so indicate)</span>
              <span>UNTO THE ORDER OF:</span>
              <span>{bookingData?.consigneeName}</span>
              <span>{bookingData?.consigneeContactPerson}</span>
              <span>{bookingData?.consigneeContact}</span>
              <span>{bookingData?.consigneeEmail}</span>
              <span>{bookingData?.consigneeAddress} {bookingData?.consigneeAddress && ","} {bookingData?.consigState} {bookingData?.consigState && ","}{bookingData?.consigneeAddress}</span>
              <span> {bookingData?.consigCountry}</span>

            </div>
            {/* Notify Part */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: 4,
                paddingBottom: 20,
                borderBottom: "1px solid #000000"
              }}
            >
              <span>Notify Party (No claim shall attach for failure to notify)</span>
              <span>{bookingData?.notifyParty}</span>
              {/* <span>NIEUWEZIJDS VOORBURGWAL 307</span>
              <span>1012 RM AMSTERDAM</span>
              <span>THE NETHERLANDS, EORI: ESA15075062-Netherlands</span> */}


            </div>
            {/* Precarriage */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                fontSize: 11,
                gap: 2,
                borderBottom: "1px solid #000000"
              }}
            >
              <div style={{ borderRight: '1px solid #000000', paddingRight: 2, paddingLeft: 2 }}> Precarriage by </div>
              <div style={{ paddingBottom: 2 }}>Place of Receipt <br />{bookingData?.transportPlanning?.pickupLocation}</div>
            </div>

            {/* Vessel */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                fontSize: 11,
                gap: 2,
                borderBottom: "1px solid #000000"
              }}
            >
              <div style={{ borderRight: '1px solid #000000', paddingRight: 2, paddingLeft: 2 }}>Vessel <br />{bookingData?.transportPlanning?.vesselName}</div>
              <div style={{ paddingBottom: 2 }}>Port of Loading <br />{bookingData?.portOfLoading}</div>
            </div>
            {/* Port of Discharge */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                fontSize: 11,
                gap: 2,
              }}
            >
              <div style={{ borderRight: '1px solid #000000', paddingRight: 2, paddingLeft: 2 }}>Vessel <br />Port of Discharge : {bookingData?.portOfDischarge}</div>
              <div style={{ paddingBottom: 2 }}>Place of delivery <br />{bookingData?.pickupPlace}</div>
            </div>
          </div>
          {/* //! right section */}
          <div
            style={{
              borderBottom: "1px solid #000000",
            }}
          >
            {/* country of origin */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                fontSize: 11,
                borderBottom: '1px solid #000',
                gap: 2,
              }}
            >
              <div style={{ borderRight: '1px solid #000000', paddingRight: 2, paddingLeft: 2 }}> Country of Origin <br />{bookingData?.countryOfOrigin} </div>
              <div>Bill of Lading No. <br />MLL3002</div>
            </div>
            {/* image  */}
            <div
              style={{
                borderBottom: "1px solid #000000"
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 20

                }}
              >
                <img src={logisticsLogo} alt=""
                  style={{
                    height: 25,
                    width: 150,
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "center"
                }}
              >
                {selectedBusinessUnit?.label}
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingBottom: 2
                }}
              >
                {selectedBusinessUnit?.address}
              </div>
            </div>
            {/* delivery agent section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 2,
                paddingTop: 4,
                paddingBottom: 20,
                borderBottom: '1px solid #000000',

              }}
            >
              <span>Delivery Agent:</span>
              <span>INDITEX-ZARA, LELYSTAD BRANCH</span>
              <span>NIEUWEZIJDS VOORBURGWAL 307</span>
              <span>1012 RM AMSTERDAM</span>
              <span>-Netherlan</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 2,
                paddingTop: 4,
              }}
            >
              <div>
                No. of Bills of Lading
              </div>
            </div>
          </div>

        </div>

        {/* table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 6fr 1fr 1fr",
            borderBottom: "1px solid #000000",
            fontSize: 11
          }}
        >
          <div
            style={{
              borderRight: "1px solid #000000",
              padding: 2

            }}
          >
            Marks & Numbers
          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              padding: 2

            }}
          >No. of pkgs. or
            shipping units</div>
          <div
            style={{
              borderRight: "1px solid #000000",
              padding: 2

            }}
          >
            Description of Goods & Pkgs
          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              padding: 2

            }}
          >Gross Weight <br /> kgs</div>
          <div
            style={{
              padding: 2
            }}
          >
            Measurement <br /> M3
          </div>

        </div>
        <SingleItem item={data} />
        {/* table footer section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 6fr 1fr 1fr",
            fontSize: 11,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 10,
              textAlign: "center"

            }}
          >
            Total
          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 10,

            }}
          >

          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 10,

            }}
          >
            Temperature Control Instruction
          </div>
          <div
            style={{
              borderRight: "1px solid #000000",
              borderBottom: "1px solid #000000",
              padding: 10,
              textAlign: "center"

            }}
          ></div>
          <div
            style={{
              borderBottom: "1px solid #000000",
              padding: 10,
              textAlign: "center"
            }}
          >

          </div>
        </div>
        {/* bottom section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            fontSize: 11,

          }}
        >
          {/* bottom left */}
          <div
            style={{
              borderRight: "1px solid #000000"
            }}
          >
            <span> Freight Details, Charges etc</span>
            <p style={{ paddingLeft: 20, paddingBottom: "5rem" }}>FREIGHT COLLECT</p>
            <p style={{ borderTop: "1px solid #000000" }}>
              <span style={{ paddingLeft: 20, paddingBottom: "2rem" }}>JURISDICTION AND LAW CLAUSE</span>
            </p>
            <p style={{ paddingLeft: 5, paddingRight: 5, lineHeight: 1.5 }}> The contract evidenced by or contained in this Bill of lading is governed by
              the law of Bangladesh and any claim or dispute arising hereunder or in
              connection herewith shall be determined by the courts of Bangladesh and no
              other courts</p>
          </div>
          {/* bottom right */}
          <div

          >
            <div style={{ borderBottom: "1px solid #000000", padding: 2 }}>Excess Value Declaration: Refer to Clause 6(4) (B) + (C) on reverse side</div>
            <div style={{ padding: 2, paddingRight: 20, paddingBottom: 5 }}>
              RECEIVED by the Carrier the Goods as specified above in apparent good order and condition unless
              otherwise stated to be transported to such place as agreed authorised or permitted here in and subject to
              all the terms and conditions appearing on the front and reverse of this bill of lading to which the merchant
              agrees by accepting this Bill of lading any local privileges and customs not with standing. The particulars
              given above as stated by the shipper and the weight, measure, quantity, condition, contents and value of the
              Goods are unknown to the carrier.  In WITNESS where of one (1) original Bill of Lading has been signed if
              not otherwise stated above, the same being accomplished the other (s) if any, to be void. If required by the
              Carrier one (1) original Bill of Lading must be surrendered duly endorsed in exchange for the goods or
              delivery order.
            </div>
            <div style={{ display: "flex", gap: 5, width: "100%", paddingBottom: 2, paddingLeft: 2 }}>
              <div> Place and date of issue</div>
              <div style={{ width: "70%", borderBottom: "1px solid #CCCCCC" }}> 01.09.2023</div>
            </div>
            <div style={{ paddingLeft: 2 }}>Signed on behalf of the Carrier:</div>
            <div style={{ padding: 10 }}> FOR MGH LOGISTICS PVT. LTD.</div>

            <div style={{ display: "flex", gap: 5, width: "100%", paddingBottom: 2, paddingLeft: 2 }}>
              <div> By AS</div>
              <div style={{ width: "70%", borderBottom: "1px solid #CCCCCC" }}> AGENT</div>
            </div>
            <div style={{ paddingLeft: 2 }}>MGH LOGISTICS PVT. LTD.</div>

          </div>


        </div>

      </div>
    </div>
  );
};
