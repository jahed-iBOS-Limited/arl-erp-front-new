import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from "../../../../App";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import logisticsLogo from "./logisticsLogo.png";

export default function ViewInvoice({ clickRowDto }) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [
    singleChaShipmentBooking,
    getSingleChaShipmentBooking,
    singleChaShipmentBookingLoading,
  ] = useAxiosGet();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Invoice",
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
  const item = [
    {
      id: 1,
      name: "Customs Duty",
    },
    {
      id: 2,
      name: "Freight Forwarder NOC Fee",
    },
    {
      id: 3,
      name: "Shipping Charge",
    },
    {
      id: 5,
      name: "Port Charge",
    },
    {
      id: 6,
      name: "C&F Association Fee",
    },
    {
      id: 7,
      name: "B/L verify",
    },
    {
      id: 8,
      name: "BSTI Charge",
    },
    {
      id: 9,
      name: "Examin Leabur Charge",
    },
    {
      id: 10,
      name: "Delivery Leabur Charge",
    },
    {
      id: 11,
      name: "Special Delivery Charge",
    },
    {
      id: 12,
      name: "IGM Correction Misc. Exp.",
    },
    {
      id: 13,
      name: "Documents Handeling Charge",
    },
    {
      id: 14,
      name: "Transport Charge",
    },
    {
      id: 15,
      name: "Transport Leabour Charge for (Loading/ Unloading)",
    },
    {
      id: 16,
      name: "Misc Exp. For Documentation/ Shipment Error",
    },
    {
      id: 17,
      name: "Additional",
    },
  ];
  const tableStyle = {
    fontSize: "12px",
    width: "100%",
    borderCollapse: "collapse",
  };

  const cellStyle = {
    border: "1px solid #000",
    padding: "5px",
    textAlign: "left",
  };

  useEffect(() => {
    if (clickRowDto?.chabookingId) {
      getSingleChaShipmentBooking(
        `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingById?ChaShipmentbookingId=${clickRowDto?.chabookingId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowDto]);

  if (singleChaShipmentBookingLoading) {
    return <Loading />;
  }

  const totalStyle = {
    fontWeight: "bold",
    textAlign: "right",
    padding: "5px",
    border: "1px solid #000",
  };

  return (
    <div>
      <div className="d-flex justify-content-end py-2">
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
          fontSize: 13,
        }}
        ref={componentRef}
      >
        <table style={tableStyle}>
          <thead>
            <tr>
              <td colSpan="4" style={cellStyle}>
                <div>
                  <span>Company: {selectedBusinessUnit?.label}</span> <br />{" "}
                  <hr />
                  <span>
                    Address: House - 5, Road - 6, Sector 1, Uttara, Dhaka
                  </span>{" "}
                  <br /> <br /> <hr />
                  <span>Phone No: N/A</span> <br />
                  <hr />
                  <span>Email ID: N/A</span> <br />
                  <hr />
                  <span>BIN: N/A</span> <br />
                </div>
              </td>
              <td colSpan="2" style={{ ...cellStyle, textAlign: "center" }}>
                <img
                  src={logisticsLogo}
                  alt="Company Logo"
                  style={{ height: "50px" }}
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: "#365339",
                  height: "1.5rem",
                  border: "1px solid #000",
                }}
              />
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  border: "1px solid #000",
                  padding: "5px 0",
                }}
              >
                Tax Invoice
              </td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: "#365339",
                  height: "1.5rem",
                  border: "1px solid #000",
                }}
              />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Bill To:
              </td>
              <td style={cellStyle}>Invoice No.: </td>
              <td colSpan="2" style={cellStyle}>
                {singleChaShipmentBooking?.commercialInvoiceNo}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Name: {singleChaShipmentBooking?.customerName}
              </td>
              <td style={cellStyle}>Date:</td>
              <td colSpan="2" style={cellStyle}>
                {singleChaShipmentBooking?.dteCreatedAt
                  ? _dateFormatter(singleChaShipmentBooking?.dteCreatedAt)
                  : ""}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Address: N/A
              </td>
              <td colSpan="3" style={cellStyle}>
                Commodity: {singleChaShipmentBooking?.commodityName}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                Place of Customs: {singleChaShipmentBooking?.portOfReceive}
              </td>
              <td colSpan="3" style={cellStyle}>
                Weight: {singleChaShipmentBooking?.grossWeight}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                IP/EXP No.: {singleChaShipmentBooking?.exp}
              </td>
              <td colSpan="3" style={cellStyle}>
                Quantity: {singleChaShipmentBooking?.containerQty}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                IP/EXP Date:{" "}
                {singleChaShipmentBooking?.expDate
                  ? _dateFormatter(singleChaShipmentBooking?.expDate)
                  : ""}
              </td>
              <td colSpan="3" style={cellStyle}>
                Delivery Place: {singleChaShipmentBooking?.placeOfDelivery}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                LC No.: N/A
              </td>
              <td colSpan="3" style={cellStyle}>
                Invoice No.: {singleChaShipmentBooking?.commercialInvoiceNo}
              </td>
            </tr>
            <tr>
              <td colSpan="3" style={cellStyle}>
                LC Date: N/A
              </td>
              <td colSpan="3" style={cellStyle}>
                Invoice Value: {singleChaShipmentBooking?.invoiceValue}
              </td>
            </tr>
            <tr>
              <td style={cellStyle} colSpan="3">
                Bill of Entry / Export No.:{" "}
                {singleChaShipmentBooking?.billOfEntry}
              </td>
              <td style={cellStyle} colSpan="3"></td>
            </tr>
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: "#365339",
                  height: "1.5rem",
                  border: "1px solid #000",
                }}
              />
            </tr>

            <tr>
              <th style={cellStyle}>SL.</th>
              <th colSpan="2" style={{ ...cellStyle, textAlign: "center" }}>
                Description
              </th>
              <th style={{ ...cellStyle, textAlign: "center" }}>QTY</th>
              <th style={{ ...cellStyle, textAlign: "center" }}>Amount</th>
            </tr>
            {item.map((item, index) => (
              <tr key={index}>
                <td style={cellStyle}>{index + 1}</td>
                <td colSpan="2" style={cellStyle}>
                  {item?.name}
                </td>
                <td style={cellStyle}></td>
                <td
                  style={{
                    ...cellStyle,
                    border: "none",
                    borderRight: "1px solid #000",
                  }}
                ></td>
              </tr>
            ))}
            <tr>
              <td
                colSpan="6"
                style={{
                  backgroundColor: "#365339",
                  height: "1.5rem",
                  border: "1px solid #000",
                }}
              />
            </tr>
            <tr>
              <td colSpan="4" style={totalStyle}>
                Sub Total:
              </td>
              <td style={cellStyle}>0</td>
            </tr>
            <tr>
              <td colSpan="4" style={totalStyle}>
                Advance:
              </td>
              <td style={cellStyle}>0</td>
            </tr>
            <tr>
              <td colSpan="4" style={totalStyle}>
                Total Due:
              </td>
              <td style={cellStyle}>0</td>
            </tr>
            <tr>
              <td colSpan="6" style={cellStyle}>
                Amount in words:
              </td>
            </tr>
            <tr>
              <td colSpan="6" style={cellStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "50px 50px 5px 50px",
                  }}
                >
                  <div>Prepared By:</div>
                  <div>Checked By:</div>
                  <div>Confirmed By:</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
