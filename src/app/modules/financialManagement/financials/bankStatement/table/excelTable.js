import React from "react";
import numberWithCommas from "./../../../../_helper/_numberWithCommas";

export default function ExcelTable({
  id,
  values,
  adviceReportData,
  //   netTotal,
  //   seTotalAmount,
}) {
  return (
    <>
       <div className="table-responsive">
       <table
        id={id}
        className="table table-striped table-bordered global-table advice-table"
        style={{ width: "100%" }}
      >
        <thead>
          {values?.advice?.info === "others" ? (
            <tr>
              <th
                style={{
                  width: "115px",
                  border: "1px solid #000",
                }}
              >
                Account Name
              </th>
              <th
                style={{
                  width: "70px",
                  border: "1px solid #000",
                }}
              >
                Code NO
              </th>
              <th
                style={{
                  width: "160px",
                  border: "1px solid #000",
                }}
              >
                Bank Name
              </th>
              <th
                style={{
                  width: "65px",
                  border: "1px solid #000",
                }}
              >
                Branch
              </th>
              <th
                style={{
                  width: "55px",
                  border: "1px solid #000",
                }}
              >
                A/C Type
              </th>
              <th
                style={{
                  width: "115px",
                  border: "1px solid #000",
                }}
              >
                Account No
              </th>
              <th
                style={{
                  width: "51px",
                  border: "1px solid #000",
                }}
              >
                Amount{" "}
              </th>
              <th
                style={{
                  width: "80px",
                  border: "1px solid #000",
                }}
              >
                Payment Info
              </th>
              <th
                style={{
                  width: "56px",
                  border: "1px solid #000",
                }}
              >
                Comments
              </th>
              <th
                style={{
                  width: "85px",
                  border: "1px solid #000",
                }}
              >
                Routing No
              </th>
              <th
                style={{
                  width: "95px",
                  border: "1px solid #000",
                }}
              >
                Instrument No
              </th>
              <th
                style={{
                  width: "35px",
                  border: "1px solid #000",
                }}
              >
                Sl No
              </th>
            </tr>
          ) : (
            <tr>
              <th
                style={{
                  width: "35px",
                  border: "1px solid #000",
                }}
              >
                Sl No
              </th>
              <th
                style={{
                  border: "1px solid #000",
                }}
              >
                Bank Account No
              </th>
              <th
                style={{
                  border: "1px solid #000",
                }}
              >
                Account Name
              </th>
              <th
                style={{
                  border: "1px solid #000",
                }}
              >
                Net Amount{" "}
              </th>
              <th
                style={{
                  border: "1px solid #000",
                }}
              >
                Payment Info
              </th>
              <th
                style={{
                  border: "1px solid #000",
                }}
              >
                Branch
              </th>
            </tr>
          )}
        </thead>

        {/* tbody */}
        <tbody>
          {values?.advice?.info === "others" ? (
            <>
              {adviceReportData?.map((itm, index) => {
                // netTotal += itm?.amount;
                // seTotalAmount(netTotal);
                return (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.accountName}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div>{itm?.codeNo}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.bankName}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.branch}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.acType}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-right pr-2">
                        <span className="d-none">{` ${"\u200C"} `}</span>
                        <span>{itm?.accountNo}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-right pr-2">
                        {numberWithCommas(itm?.amount)}
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-right pr-2">{itm?.paymentInfo}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.comments}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-right pr-2">
                        <span className="d-none">{` ${"\u200C"} `}</span>
                        <span>{itm?.routingNo}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.instrumentNo}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-center"> {itm?.slNo}</div>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              {adviceReportData?.map((itm, index) => {
                // netTotal += itm?.amount;
                // seTotalAmount(netTotal);
                return (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-center"> {itm?.slNo}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">
                        <span className="d-none">{` ${"\u200C"} `}</span>
                        <span>{itm?.accountNo}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.accountName}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-right pr-2">
                        {numberWithCommas(itm?.amount)}
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="text-right pr-2">{itm?.paymentInfo}</div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                      }}
                    >
                      <div className="pl-2">{itm?.branch}</div>
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
      </div>
    </>
  );
}
