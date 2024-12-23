import moment from "moment";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { imarineBaseUrl } from "../../../../../App";
import { amountToWords } from "../../../../_helper/_ConvertnumberToWord";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

import logisticsLogo from "./logisticsLogo.png";
import "./style.css";
import NewSelect from "../../../../_helper/_select";
const invoiceTypeDDL = [
  {
    value: 1,
    label: "Freight",
    email: null,
    ownerId: 0,
    ownerName: null,
    isOwner: false,
    code: null,
    isDollarConvesionRequire: null,
  },
  {
    value: 2,
    label: "Consignee",
    email: null,
    ownerId: 0,
    ownerName: null,
    isOwner: false,
    code: null,
    isDollarConvesionRequire: null,
  },
  //   {
  //     value: 3,
  //     label: "Dummy",
  //     email: null,
  //     ownerId: 0,
  //     ownerName: null,
  //     isOwner: false,
  //     code: null,
  //     isDollarConvesionRequire: null,
  //   },
];
const CommonInvoice = ({ rowClickData }) => {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [invoiceType, setInvoiceType] = React.useState({
    value: 1,
    label: "Freight",
  });
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    ,
    getCargoBookingInvoice,
    cargoBookingInvoiceLoading,
    ,
  ] = useAxiosPost();
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const [
    billingData,
    setGetBookedRequestBillingData,
    getBookedRequestBillingDataLoading,
  ] = useAxiosGet();

  useEffect(() => {
    commonGetByIdHandler();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);
  const bookingData = {
    ...shipBookingRequestGetById,
    billingData:
      shipBookingRequestGetById?.billingData?.filter((item) => {
        return item?.chargeAmount;
      }) || [],
  };

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

  const commonGetByIdHandler = () => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      );
      setGetBookedRequestBillingData(
        `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingData?bookingId=${bookingRequestId}`
      );
    }
  };

  const saveHandler = (values) => {
    const paylaod = {
      accountId: profileData?.accountId || 0,
      unitId: selectedBusinessUnit?.value || 0,
      bookingDate: new Date(),
      bookingNumber: bookingData?.bookingRequestCode || "",
      paymentTerms: "",
      actionBy: profileData?.userId || 0,
      rowString: bookingData?.billingData?.map((item) => {
        return {
          intHeadOfChargeid: item?.headOfChargeId,
          strHeadoffcharges: item?.headOfCharges,
          intCurrencyid: bookingData?.currencyId,
          strCurrency: bookingData?.currency,
          numrate: 0,
          numconverstionrate: 0,
          strUom: "",
          numamount: item?.chargeAmount || 0,
          numvatAmount: 0,
        };
      }),
    };
    getCargoBookingInvoice(
      `${imarineBaseUrl}/domain/ShippingService/CargoBookingInvoice`,
      paylaod,
      () => {
        commonGetByIdHandler();
      },
      true
    );
  };
  const getActualAmount = (row) => {
    if (invoiceType?.label === "Freight") {
      return row?.collectionActualAmount;
    }
    if (invoiceType?.label === "Consignee") {
      return row?.paymentActualAmount;
    }
  };
  const getDummyAmount = (row) => {
    if (invoiceType?.label === "Freight") {
      return row?.collectionDummyAmount;
    }
    if (invoiceType?.label === "Consignee") {
      return row?.paymentDummyAmount;
    }
  };
  const getCalculatedActualAmount = () => {
    if (invoiceType?.label === "Freight") {
      return billingData?.reduce((acc, cur) => {
        return acc + (+cur?.collectionActualAmount || 0);
      }, 0);
    }
    if (invoiceType?.label === "Consignee") {
      return billingData?.reduce((acc, cur) => {
        return acc + (+cur?.paymentActualAmount || 0);
      }, 0);
    }
  };
  const getCalculatedDummyAmount = () => {
    if (invoiceType?.label === "Freight") {
      return billingData?.reduce((acc, cur) => {
        return acc + (+cur?.collectionDummyAmount || 0);
      }, 0);
    }
    if (invoiceType?.label === "Consignee") {
      return billingData?.reduce((acc, cur) => {
        return acc + (+cur?.paymentDummyAmount || 0);
      }, 0);
    }
  };

  return (
    <>
      <div>
        {/* Save button add */}
        <div className="d-flex justify-content-between align-items-center  py-2">
          <div className="col-lg-3 p-0">
            <NewSelect
              name="invoiceType"
              options={invoiceTypeDDL || []}
              value={invoiceType}
              label="Invoice Type"
              onChange={(valueOption) => {
                setInvoiceType(valueOption);
              }}
              placeholder="Select Invoice Type"
            />
          </div>
          <div className="d-flex justify-content-end">
            {!bookingData?.invoiceNo && (
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

            {bookingData?.invoiceNo && (
              <>
                <button
                  onClick={handlePrint}
                  type="button"
                  className="btn btn-primary px-3 py-2"
                >
                  <i
                    className="mr-1 fa fa-print pointer"
                    aria-hidden="true"
                  ></i>
                  Print
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {(shipBookingRequestLoading || cargoBookingInvoiceLoading) && <Loading />}
      <div
        ref={componentRef}
        style={{
          fontSize: 11,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
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
          <div
            style={{
              textAlign: "right",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {selectedBusinessUnit?.label}
            </span>
            <br />
            <span>{selectedBusinessUnit?.address}</span>
          </div>
        </div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
            backgroundColor: "#DDE3E8",
            padding: 2,
            border: "1px solid #000000",
          }}
        >
          {" "}
          INVOICE : {bookingData?.invoiceNo || "N/A"}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "7fr .5fr 7fr",
            // border: "1px solid #000000",
          }}
        >
          <div
            style={{
              border: "1px solid #000000",
            }}
          >
            <div style={{ padding: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {bookingData?.consigneeName}
              </span>
              <br />
              <span>
                {bookingData?.consigneeAddress},{bookingData?.consigState},
                {bookingData?.consigCountry}
              </span>
              <br />
            </div>
          </div>
          <div />
          <div style={{ border: "1px solid #000000" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr ",
              }}
            >
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  borderRight: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                  backgroundColor: "#DDE3E8",
                }}
              >
                {" "}
                INVOICE DATE
              </span>
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                }}
              >
                {bookingData?.invoiceDate
                  ? moment(bookingData?.invoiceDate).format("YYYY-MM-DD")
                  : "N/A"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr ",
              }}
            >
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  borderRight: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                  backgroundColor: "#DDE3E8",
                }}
              >
                SHIPMENT NO
              </span>
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                }}
              >
                {bookingData?.awbnumber}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr ",
              }}
            >
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  borderRight: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                  backgroundColor: "#DDE3E8",
                }}
              >
                SALES ORDER NO
              </span>
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                }}
              >
                {" "}
                {bookingData?.bookingRequestCode}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr ",
              }}
            >
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  borderRight: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                  backgroundColor: "#DDE3E8",
                }}
              >
                DUE DATE
              </span>
              <span
                style={{
                  borderBottom: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                }}
              >
                {bookingData?.createdAt
                  ? moment(bookingData?.createdAt).format("YYYY-MM-DD")
                  : "N/A"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr ",
              }}
            >
              <span
                style={{
                  borderRight: "1px solid #000000",
                  padding: 2,
                  paddingBottom: 20,
                  fontWeight: 600,
                  backgroundColor: "#DDE3E8",
                }}
              >
                TERMS
              </span>
              <span style={{ padding: 2, fontWeight: 600 }}>
                {" "}
                Pay able immediately Due net{" "}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr ",
              }}
            >
              <span
                style={{
                  borderTop: "1px solid #000000",
                  borderRight: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                  backgroundColor: "#DDE3E8",
                }}
              >
                Trade
              </span>
              <span
                style={{
                  borderTop: "1px solid #000000",
                  padding: 2,
                  fontWeight: 600,
                }}
              >
                Export
              </span>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              border: "1px solid #000000",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: "#DDE3E8",
                padding: 2,
                borderBottom: "1px solid #000000",
              }}
            >
              SHIPMENT DETAILS
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr ",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  padding: 2,
                  borderRight: "1px solid #000000",
                }}
              >
                <span>Shipper</span>
                <br />
                <span>Consignee</span>
                <br />
                <span>Port of Loading</span>
                <br />
                <span>Port of Discharge</span>
                <br />
                <span>IncoTerms</span>
                <br />
                <span>ETD</span>
                <br />
                <span>Master Number</span>
                <br />
                <span>House Number</span>
                <br />
                <span>ATA</span>
              </div>
              <div
                style={{
                  textTransform: "uppercase",
                  padding: 2,
                  borderRight: "1px solid #000000",
                }}
              >
                <span>{bookingData?.shipperName}</span>
                <br />
                <span>{bookingData?.consigneeName}</span>
                <br />
                <span>{bookingData?.portOfLoading}</span>
                <br />
                <span>{bookingData?.portOfDischarge}</span>
                <br />
                <span>{bookingData?.incoterms}</span>
                <br />
                <span>
                  {bookingData?.dateOfRequest
                    ? moment(bookingData?.dateOfRequest).format("YYYY-MM-DD")
                    : "N/A"}
                </span>
                <br />
                <span>{bookingData?.blnumber || "N/A"}</span>
                <br />
                <span>{bookingData?.hblnumber || "N/A"}</span>
                <br />
                <span>
                  {bookingData?.arrivalDateTime
                    ? moment(bookingData?.arrivalDateTime).format(
                        "YYYY-MM-DD HH:mm A"
                      )
                    : "N/A"}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  padding: 2,
                  borderRight: "1px solid #000000",
                }}
              >
                <span>LC No.</span>
                <br />
                <span>LC Date</span>
                <br />
                <span>Place of Delivery</span>
                <br />
                <span>Commodity</span>
                <br />
                <span>Flight</span>
                <br />
                <span>Master Date</span>
                <br />
                <span>House Date</span>
                <br />
                <span>Volume</span>
                <br />
                <span>Chrg. Wt</span>
              </div>
              <div style={{ padding: 2 }}>
                <span>{bookingData?.lcNo ?? "N/A"} </span>
                <br />
                <span>
                  {bookingData?.lcDate
                    ? moment(bookingData?.lcDate).format("DD MMM YYYY HH:mm A")
                    : "N/A"}
                </span>
                <br />
                <span>{bookingData?.pickupPlace}</span>
                <br />
                <span></span>
                <br />
                <span></span>
                <br />
                <span>
                  {bookingData?.bldate
                    ? moment(bookingData?.bldate).format("YYYY-MM-DD")
                    : "N/A"}
                </span>
                <br />
                <span>
                  {bookingData?.hbldate
                    ? moment(bookingData?.hbldate).format("YYYY-MM-DD")
                    : "N/A"}
                </span>
                <br />
                <span>
                  {bookingData?.rowsData?.reduce((acc, cur) => {
                    return acc + (+cur?.totalVolumeCBM || 0);
                  }, 0)}
                </span>
                <br />
                <span>
                  {bookingData?.rowsData?.reduce((acc, cur) => {
                    return acc + (+cur?.grossWeightKG || 0);
                  }, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <table
          border="1"
          cellPadding="5"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#DDE3E8" }}>
              <th>SL</th>
              <th>Attribute</th>
              <th>Dummy Amount</th>
              <th>Actual Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceType &&
              billingData?.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "right" }}> {index + 1} </td>
                  <td className="align-middle">
                    <label>{row?.headOfCharges}</label>
                  </td>
                  <td style={{ textAlign: "right" }}>{getDummyAmount(row)}</td>
                  <td style={{ textAlign: "right" }}>{getActualAmount(row)}</td>
                </tr>
              ))}
            <tr
              style={{
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: "#DDE3E8",
                textAlign: "right",
              }}
            >
              <td colSpan="2"> Total Amount</td>
              <td> {getCalculatedDummyAmount()}</td>
              <td> {getCalculatedActualAmount()}</td>
            </tr>
            <tr>
              <td
                colSpan="5"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  textAlign: "left",
                }}
              >
                {" "}
                Amount in Words:
                {amountToWords(
                  bookingData?.billingData?.reduce((acc, cur) => {
                    return acc + (+cur?.chargeAmount || 0);
                  }, 0) || 0
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid #000",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                backgroundColor: "#DDE3E8",
                padding: 2,
              }}
            >
              Transfer Fund to
            </div>
          </div>
          <div
            style={{
              borderLeft: "1px solid #000000",
            }}
          >
            <div
              style={{
                padding: 2,
                paddingBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Beneficiary Details:
              </span>
              <br />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {selectedBusinessUnit?.label}
              </span>
              <br />
              <span>{selectedBusinessUnit?.address}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <p>Prepared By: </p>
          <p>Prepared By: </p>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600 }}>Special Note:</p>
        <span style={{ fontSize: 14, maxWidth: "70%" }}>
          {" "}
          Payment to be made by Payment Order/Electronic transfer only in favor
          of TRANSMARINE LOGISTICS LTD. No query/claim will be entertained after
          07 days from the date of receipt of Invoice. Interest @ 2% pe rMonth
          is chargeable on bill not paid on presentation.
        </span>

        <p style={{ fontSize: 14, fontWeight: 600 }}>Note:</p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            textAlign: "center",
            backgroundColor: "#DDE3E8",
            padding: 2,
            border: "1px solid #000000",
          }}
        >
          {" "}
          This is a system generated invoice and it does not require any company
          chop and signature
        </p>
      </div>
    </>
  );
};

export default CommonInvoice;
