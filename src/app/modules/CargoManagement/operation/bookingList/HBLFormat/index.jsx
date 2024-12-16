import moment from "moment";
import React from "react";
import ReactQuill from "react-quill";
import { convertNumberToWords } from "../../../../_helper/_convertMoneyToWord";
import logisticsLogo from "./logisticsLogo.png";
import "./style.css";
export const HBLFormatInvoice = ({
  componentRef,
  bookingData,
  htmlContent,
  changeHandelar,
}) => {
  return (
    <div className="hblWrapper">
      <SingleItem
        bookingData={bookingData}
        changeHandelar={changeHandelar}
        htmlContent={htmlContent}
      />
      <div className="multipleInvoicePrint" ref={componentRef}>
        <SingleItem
          footerText="ORIGINAL 1 (FOR CONSIGNEE)"
          bookingData={bookingData}
          htmlContent={htmlContent}
          isPrintView={true}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
        />
        <SingleItem
          footerText="ORIGINAL 2 (FOR CONSIGNEE)"
          bookingData={bookingData}
          isPrintView={true}
          htmlContent={htmlContent}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
        />
        <SingleItem
          footerText="ORIGINAL 3 (FOR SHIPPER)"
          bookingData={bookingData}
          isPrintView={true}
          htmlContent={htmlContent}
        />
        <div
          style={{
            pageBreakAfter: "always",
          }}
          isPrintView={true}
        />
        <SingleItem
          footerText="ORIGINAL 4 (FOR SHIPPER)"
          bookingData={bookingData}
          isPrintView={true}
          htmlContent={htmlContent}
        />
      </div>
    </div>
  );
};

const SingleItem = ({
  footerText = "",
  bookingData,
  changeHandelar,
  htmlContent,
  isPrintView,
}) => {
  const totalNumberOfPackages = bookingData?.rowsData?.reduce((acc, item) => {
    return acc + (+item?.totalNumberOfPackages || 0);
  }, 0);

  console.log(htmlContent?.marks, "htmlContent?.marks");
  return (
    <>
      <div>
        <div className="hblContainer">
          <div className="airandConsigneeInfo">
            <div className="top borderBottom">
              <div className="leftSide borderRight">
                <div className="shipperInfo borderBottom">
                  <p className="textTitle">
                    {bookingData?.objPurchase?.[0]?.infoType === "lc"
                      ? "Shipper And Bank"
                      : "Shipper"}
                  </p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === "lc" &&
                      bookingData?.shipperBank}
                  </p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === "lc" &&
                      bookingData?.shipperBankAddress}
                  </p>
                  <p>
                    {' '}
                    {bookingData?.objPurchase?.[0]?.infoType === 'lc'
                      ? 'A/C '
                      : ''}
                    {bookingData?.shipperName}
                  </p>
                  <p>{bookingData?.shipperAddress}</p>
                  {/* <p>{bookingData?.shipperContactPerson}</p> */}
                  <p>{bookingData?.shipperContact}</p>
                  <p>{bookingData?.shipperEmail}</p>
                  <p>
                    {bookingData?.shipperState} ,{bookingData?.shipperCountry}
                  </p>
                </div>
                <div className="consigneeInfo borderBottom">
                  <p className="textTitle">Consignee:</p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === 'lc' &&
                      bookingData?.buyerBank}
                  </p>
                  <p>
                    {bookingData?.objPurchase?.[0]?.infoType === 'lc' &&
                      bookingData?.notifyBankAddr}
                  </p>
                  <p>
                    {' '}
                    {bookingData?.objPurchase?.[0]?.infoType === 'lc'
                      ? 'A/C '
                      : ''}
                    {bookingData?.consigneeName}
                  </p>
                  <p>{bookingData?.consigneeAddress}</p>
                  {/* <p>{bookingData?.consigneeContactPerson}</p> */}
                  <p>{bookingData?.consigneeContact}</p>
                  <p>
                    {bookingData?.consigState}, {bookingData?.consigCountry}
                  </p>
                  <p>{bookingData?.consigneeEmail}</p>
                </div>
                <div className="notifyParty borderBottom">
                  <p className="textTitle">Notify Party:</p>
                  <p>{bookingData?.notifyPartyDtl1?.participantsName}</p>
                  <p>
                    {bookingData?.notifyPartyDtl1?.zipCode &&
                      `${bookingData?.notifyPartyDtl1?.zipCode}, `}
                    {bookingData?.notifyPartyDtl1?.state &&
                      `${bookingData?.notifyPartyDtl1?.state}, `}
                    {bookingData?.notifyPartyDtl1?.city &&
                      `${bookingData?.notifyPartyDtl1?.city}, `}
                    {bookingData?.notifyPartyDtl1?.country &&
                      `${bookingData?.notifyPartyDtl1?.country}, `}
                    {bookingData?.notifyPartyDtl1?.address}
                  </p>
                </div>
                <div className="preCarriageInfo borderBottom">
                  <div className="firstColumn">
                    <p className="textTitle">Pre-Carriage By:</p>
                    <p>{bookingData?.transportPlanning?.vesselName}</p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">Place of Receipt:</p>
                    <p>{bookingData?.pickupPlace}</p>
                  </div>
                </div>
                <div className="oceanVesselInfo">
                  <div className="firstColumn">
                    <p className="textTitle">Ocean Vessel:</p>
                    <p>
                      {bookingData?.transportPlanning?.vesselName || ""} /{" "}
                      {bookingData?.transportPlanning?.voyagaNo || ""}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">Port of Loading:</p>
                    <p> {bookingData?.portOfLoading}</p>
                  </div>
                </div>
              </div>
              <div className="rightSide">
                <div className="rightSideTop">
                  <div className="leftSide borderRight">
                    <p className="textTitle">Date of Issue:</p>
                    <p>
                      {bookingData?.createdAt &&
                        moment(bookingData?.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">B/L Number:</p>
                    <p>{bookingData?.hblnumber}</p>
                  </div>
                </div>
                <div className="rightSideMiddleContent">
                  <img
                    src={logisticsLogo}
                    alt=""
                    style={{ height: 100, width: 150, objectFit: "contain" }}
                  />
                  <h1>Akij Logistics Limited</h1>
                  <h3>Bir Uttam Mir Shawkat Sarak, Dhaka 1208</h3>
                </div>
                <div className="rightSideBottom">
                  <p className="textTitle" style={{ paddingBottom: 5 }}>
                    For delivery of goods please apply to:
                  </p>
                  <div style={{ paddingLeft: 5 }}>
                    <p>
                      {bookingData?.freightAgentReference} <br />
                    </p>
                    {bookingData?.deliveryAgentDtl?.zipCode &&
                      `${bookingData?.deliveryAgentDtl?.zipCode}, `}
                    {bookingData?.deliveryAgentDtl?.state &&
                      `${bookingData?.deliveryAgentDtl?.state}, `}
                    {bookingData?.deliveryAgentDtl?.city &&
                      `${bookingData?.deliveryAgentDtl?.city}, `}
                    {bookingData?.deliveryAgentDtl?.country &&
                      `${bookingData?.deliveryAgentDtl?.country}, `}{" "}
                    {bookingData?.deliveryAgentDtl?.address &&
                      `${bookingData?.deliveryAgentDtl?.address}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="middle">
              <div className="firstRow borderBottom">
                <div className="firstColumn borderRight">
                  <p className="textTitle">Port of Discharge:</p>
                  <p>{bookingData?.portOfDischarge}</p>
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p className="textTitle">Final Destination:</p>
                    <p>{bookingData?.finalDestinationAddress}</p>
                  </div>
                  <div className="item borderRight">
                    <p className="textTitle">Freight payable at</p>
                  </div>
                </div>
                <div className="thirdColumn">
                  <p className="textTitle">Number of Original B/L:</p>
                </div>
              </div>
              <div className="secondRow borderBottom textTitle">
                <div className="firstColumn borderRight">
                  <p>Marks &amp; Numbers</p>
                  <p>Container &amp; Seal Numbers</p>
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p>No. of Packages</p>
                  </div>
                  <div className="item borderRight">
                    <p>Description of Packages and Goods</p>
                    <p>Particularly Furnished by Shipper</p>
                  </div>
                </div>
                <div className="thirdColumn">
                  <div className="item borderRight">
                    <p>Gross weight</p>
                    <p>KG</p>
                  </div>
                  <div className="item">
                    <p>Measurement</p>
                    <p>CBM</p>
                  </div>
                </div>
              </div>
              <div className="thirdRow borderBottom">
                <div className="firstColumn borderRight">
                  <div
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    {isPrintView ? (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: htmlContent?.marks || "",
                          }}
                        ></div>
                      </>
                    ) : (
                      <ReactQuill
                        value={htmlContent?.marks || ""}
                        onChange={(value) => {
                          changeHandelar &&
                            changeHandelar({
                              key: "marks",
                              value,
                            });
                        }}
                        modules={{
                          toolbar: false,
                        }}
                        style={{
                          padding: 0,
                          margin: 0,
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p>
                      {/* totalNumberOfPackages sum */}
                      {totalNumberOfPackages}
                      <br />
                      Cartons
                    </p>
                  </div>
                  <div
                    className="item borderRight"
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    <p>
                      {" "}
                      {totalNumberOfPackages} Cartons (
                      {totalNumberOfPackages &&
                        convertNumberToWords(totalNumberOfPackages)}{" "}
                      Cartons only)
                    </p>
                    <p>Description Of Goods:</p>

                    {bookingData?.rowsData?.map((item, index) => {
                      return (
                        <>
                          <p>{item?.descriptionOfGoods}</p>
                          <p>
                            Po No:{" "}
                            {item?.dimensionRow?.map((i, index) => {
                              return (
                                (i?.poNumber || "") +
                                (index < item?.dimensionRow?.length - 1
                                  ? ","
                                  : "")
                              );
                            })}
                          </p>
                          <p>
                            Color:{" "}
                            {item?.dimensionRow?.map((i, index) => {
                              return (
                                (i?.color || "") +
                                (index < item?.dimensionRow?.length - 1
                                  ? ","
                                  : "")
                              );
                            })}
                          </p>
                          <p>
                            H.S Code:{" "}
                            {(item?.hsCode || "") +
                              (index < bookingData?.rowsData?.length - 1
                                ? ","
                                : "")}
                          </p>
                          <br />
                        </>
                      );
                    })}

                    <br />
                    <p>
                      Invoice No: {bookingData?.refInvoiceNo} :{' '}
                      {bookingData?.refInvoiceDate &&
                        `${moment(bookingData?.refInvoiceDate).format(
                          'DD-MM-YYYY',
                        )}`}
                    </p>
                    <p>
                      {bookingData?.infoType === "lc"
                        ? "LC No"
                        : bookingData?.infoType === "tt"
                        ? "TT No"
                        : "S/C No"}
                      :{" "}
                      {bookingData?.objPurchase?.map((item, index) => {
                        return `${item?.lcnumber || ""} : ${item?.lcdate &&
                          `${moment(item?.lcdate).format("DD-MM-YYYY")}`}${
                          index < bookingData?.objPurchase?.length - 1
                            ? ","
                            : ""
                        }`;
                      })}
                    </p>
                    <p>
                      Exp No:
                      {bookingData?.expOrCnfNumber || ""} :{" "}
                      {bookingData?.expOrCnfDate &&
                        `${moment(bookingData?.expOrCnfDate).format(
                          "DD-MM-YYYY"
                        )}`}
                    </p>
                    <p>Stuffing mode: {bookingData?.modeOfStuffings}</p>
                    <br />
                    <table
                      style={{
                        width: "250px",
                      }}
                    >
                      <>
                        <tr>
                          <td>Conainer No</td>
                          <td>Seal No</td>
                          <td>Size</td>
                          <td>Mode</td>
                        </tr>
                        {bookingData?.transportPlanning?.containerDesc?.map(
                          (i, index) => {
                            return (
                              <tr key={Math.random()}>
                                <td>{i?.containerNumber}</td>
                                <td>{i?.sealNumber}</td>
                                <td>{i?.size}</td>
                                <td>
                                  {bookingData?.modeOfStuffingSeaName || ""}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    </table>
                  </div>
                </div>
                <div className="thirdColumn">
                  <div className="item borderRight">
                    <p>
                      {/* totalGrossWeightKG sum */}
                      {bookingData?.rowsData?.reduce((acc, item) => {
                        return acc + (+item?.totalGrossWeightKG || 0);
                      }, 0)}{" "}
                      KGS
                    </p>
                  </div>
                  <div
                    className="item"
                    style={{
                      position: "relative",
                    }}
                  >
                    <p>
                      {/* totalVolumeCBM sum */}
                      {bookingData?.rowsData?.reduce((acc, item) => {
                        return acc + (+item?.totalVolumeCBM || 0);
                      }, 0)}{" "}
                      CBM
                    </p>
                    <div
                      style={{
                        fontWeight: 700,
                        position: "absolute",
                        top: "79px",
                        left: "-67px",
                        zIndex: 9,
                        fontSize: "13px",
                      }}
                    >
                      <p>Shipped On Board</p>
                      <p>
                        Date:{" "}
                        {bookingData?.transportPlanning
                          ?.estimatedTimeOfDepart &&
                          moment(
                            bookingData?.transportPlanning
                              ?.estimatedTimeOfDepart
                          ).format("DD-MM-YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="bottomLeft">
                <div className="bottomFirstColumn">
                  <div className="firstColumn">
                    <p className="textTitle text-center">
                      Freight and Disbursment
                    </p>
                    <h3
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        minHeight: "200px",
                        borderBottom: "1px solid #000",
                      }}
                    >
                      {" "}
                      FREIGHT{" "}
                      {["exw"].includes(bookingData?.incoterms) &&
                        "COLLECT EXW"}
                      {["fca", "fob"].includes(bookingData?.incoterms) &&
                        "COLLECT"}
                      {["cif", "cpt", "cfr"].includes(bookingData?.incoterms) &&
                        "PREPAID"}
                      {["dap", "ddp", "ddu"].includes(bookingData?.incoterms) &&
                        "COLLECT DAP/DDP/DDU"}
                      {["other"].includes(bookingData?.incoterms) && "COLLECT"}
                    </h3>
                    <h3>CARGO SHOULD BE</h3>
                  </div>
                </div>
                {/* <div className="bottomSecondColumn borderBottom">
          <div className="firstColumn">
            <p
              className="textTitle"
              style={{
                fontSize: '14px',
                padding: '10px',
              }}
            >
              TOTAL PREPAID
            </p>
          </div>
        </div>
        <div className="bottomThirdColumn">
          <div className="firstColumn">
            <p
              className="textTitle"
              style={{
                fontSize: '14px',
                padding: '10px',
              }}
            >
              TOTAL COLLECT
            </p>
          </div>
        </div> */}
              </div>
              <div className="bottomRight">
                <div
                  className="thirdColumn"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p className="textTitle">
                      Received by Akij Logistics Limited. for shipment by ocean
                      vessel, between port of loading and port of discharge, and
                      for arrangement or procurement of pre-carriage from place
                      of acceptance and/or on carriage to place of delivery as
                      indicated above: the goods as specified above in apparent
                      good order and condition unless otherwise stated. The
                      goods to be delivered at the above mentioned port of
                      discharge or place of delivery whichever applies. Subject
                      to Akij Logistics Limited. terms contained on the reverse
                      side hereof, to which the Shipper agrees by accepting this
                      Bill of Lading. In witness whereof three (3) original
                      Bills of Lading have been signed, if not otherwise stated
                      above, one of which being accomplished the other(s) to be
                      void.
                    </p>
                    <br />
                    <p
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Dhaka, Bangladesh
                    </p>
                  </div>
                  <p
                    style={{
                      borderTop: "1px solid",
                      padding: "0px 20px",
                      display: "flex",
                      justifyContent: "end",
                      width: "240px",
                      fontSize: "14px",
                      marginBottom: "23px",
                      alignSelf: "flex-end",
                      marginRight: "20px",
                    }}
                  >
                    Stamp and authorized signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {footerText}
        </p>
      </div>
    </>
  );
};
