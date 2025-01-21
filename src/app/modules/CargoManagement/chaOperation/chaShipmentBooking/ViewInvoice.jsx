import React from "react";

export default function ViewInvoice() {
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

  const totalStyle = {
    fontWeight: "bold",
    textAlign: "right",
    padding: "5px",
    border: "1px solid #000",
  };
  return (
    <div
      style={{
        fontSize: 13,
      }}
    >
      <table style={tableStyle}>
        <thead>
          <tr>
            <td colSpan="4" style={cellStyle}>
              <div>
                <span>Company:</span> <br /> <hr />
                <span>Address:</span> <br /> <br /> <hr />
                <span>Phone No:</span> <br />
                <hr />
                <span>Email ID:</span> <br />
                <hr />
                <span>BIN:</span> <br />
              </div>
            </td>
            <td colSpan="2" style={{ ...cellStyle, textAlign: "center" }}>
              <img
                src="/vite.svg"
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
            <td style={cellStyle}>Invoice No.:</td>
            <td colSpan="2" style={cellStyle}>
              ABC-2022-0001
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              Name:
            </td>
            <td style={cellStyle}>Date:</td>
            <td colSpan="2" style={cellStyle}>
              DD/MM/YYYY
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              Address:
            </td>
            <td colSpan="3" style={cellStyle}>
              Commodity:
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              Place of Customs:
            </td>
            <td colSpan="3" style={cellStyle}>
              Weight:
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              IP/EXP No.:
            </td>
            <td colSpan="3" style={cellStyle}>
              Quantity:
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              IP/EXP Date:
            </td>
            <td colSpan="3" style={cellStyle}>
              Delivery Place:
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              LC No.:
            </td>
            <td colSpan="3" style={cellStyle}>
              Invoice No.:
            </td>
          </tr>
          <tr>
            <td colSpan="3" style={cellStyle}>
              LC Date:
            </td>
            <td colSpan="3" style={cellStyle}>
              Invoice Value:
            </td>
          </tr>
          <tr>
            <td style={cellStyle} colSpan="3">
              Bill of Entry / Export No.:
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
  );
}
