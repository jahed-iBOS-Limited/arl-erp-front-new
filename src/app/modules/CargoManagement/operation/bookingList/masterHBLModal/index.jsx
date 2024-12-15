import React, { useState } from "react";
import { imarineBaseUrl } from "../../../../../App";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import logisticsLogo from "./logisticsLogo.png";
import { convertNumberToWords } from "../../../../_helper/_convertMoneyToWord";
import moment from "moment";
export default function MasterHBLModal({ selectedRow }) {
  // /domain/ShippingService/GetHBLList
  const [hblListData, getHBLList, isLoadingGetHBLList] = useAxiosPost();
  const [notifyParty, setNotifyParty] = useState(null);

  React.useEffect(() => {
    const payload = selectedRow?.map((item) => {
      return {
        bookingReqestId: item?.bookingRequestId,
      };
    });
    getHBLList(
      `${imarineBaseUrl}/domain/ShippingService/GetHBLList`,
      payload,
      (data) => {
        // console.log("data", data);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const freightAgentReference = hblListData[0]?.freightAgentReference;
  const subtotalGrossWeight = hblListData?.reduce((subtotal, item) => {
    const rows = item?.rowsData || [];
    const weightSubtotal = rows?.reduce(
      (sum, row) => sum + (row?.totalGrossWeightKG || 0),
      0
    );
    return subtotal + weightSubtotal;
  }, 0);
  const totalVolumeCBM = hblListData?.reduce((subtotal, item) => {
    const rows = item?.rowsData || [];
    const volumeSubtotal = rows?.reduce(
      (sum, row) => sum + (row?.totalVolumeCBM || 0),
      0
    );
    return subtotal + volumeSubtotal;
  }, 0);
  const totalNumberOfPackages = hblListData?.reduce((subtotal, item) => {
    const rows = item?.rowsData || [];
    const packageSubtotal = rows?.reduce(
      (sum, row) => sum + (row?.totalNumberOfPackages || 0),
      0
    );
    return subtotal + packageSubtotal;
  }, 0);
  return (
    <>
      <div>
        <div className="hblContainer">
          <div className="airandConsigneeInfo">
            <div className="top borderBottom">
              <div className="leftSide borderRight">
                <div className="shipperInfo borderBottom">
                  <img
                    src={logisticsLogo}
                    alt=""
                    style={{ height: 70, width: "80%", objectFit: "contain" }}
                  />
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      paddingLeft: 10,
                      marginTop: 10,
                    }}
                  >
                    Akij Logistics Limited
                  </div>{" "}
                  <div style={{ fontWeight: 400, paddingLeft: 10 }}>
                    Bir Uttam Mir Shawkat Sarak, Dhaka 1208
                  </div>
                </div>
                <div className="consigneeInfo borderBottom">
                  <p className="textTitle">Consignee:</p>
                  <p>{freightAgentReference}</p>
                </div>
                <div className="notifyParty borderBottom">
                  <p className="textTitle">Notify Party:</p>
                  {hblListData?.map((item, index) => {
                    return (
                      <>
                        <p>{item?.notifyPartyDtl1?.participantsName}</p>
                        <p>
                          {item?.notifyPartyDtl1?.zipCode &&
                            `${item?.notifyPartyDtl1?.zipCode}, `}
                          {item?.notifyPartyDtl1?.state &&
                            `${item?.notifyPartyDtl1?.state}, `}
                          {item?.notifyPartyDtl1?.city &&
                            `${item?.notifyPartyDtl1?.city}, `}
                          {item?.notifyPartyDtl1?.country &&
                            `${item?.notifyPartyDtl1?.country}, `}
                          {item?.notifyPartyDtl1?.address}
                        </p>
                        <br />
                      </>
                    );
                  })}
                </div>
                <div className="preCarriageInfo borderBottom">
                  <div className="firstColumn">
                    <p className="textTitle">Pre-Carriage By:</p>
                    <p>
                      {/* {bookingData?.transportPlanning?.map((item, index) => {
                        return (
                          <>
                            {item?.vesselName}{' '}
                            {index < bookingData?.transportPlanning?.length - 1
                              ? ','
                              : ''}
                          </>
                        );
                      })} */}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">Place of Receipt:</p>
                    {/* <p>{bookingData?.pickupPlace}</p> */}
                  </div>
                </div>
                <div className="oceanVesselInfo">
                  <div className="firstColumn">
                    <p className="textTitle">Ocean Vessel:</p>
                    <p>
                      {/* {bookingData?.transportPlanning?.map((item, index) => {
                        return (
                          <>
                            {item?.vesselName || ''} / {item?.voyagaNo || ''}{' '}
                            <br />
                            {index < bookingData?.transportPlanning?.length - 1
                              ? ','
                              : ''}
                          </>
                        );
                      })} */}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">Port of Loading:</p>
                    {/* <p> {bookingData?.portOfLoading}</p> */}
                  </div>
                </div>
              </div>
              <div className="rightSide">
                <div className="rightSideTop">
                  <div className="leftSide borderRight">
                    <p className="textTitle">Date of Issue:</p>
                    <p>
                      {/* {bookingData?.createdAt &&
                        moment(bookingData?.createdAt).format('DD-MM-YYYY')} */}
                    </p>
                  </div>
                  <div className="rightSide">
                    <p className="textTitle">B/L Number:</p>
                    {/* <p>{bookingData?.hblnumber}</p> */}
                  </div>
                </div>
                <div className="rightSideMiddleContent">
                  <div style={{ height: 40 }}></div>
                  <h1>BILL OF LADING</h1>
                  <div
                    style={{
                      minHeight: 80,
                      width: "90%",
                      border: "1px solid black",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        padding: 5,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                        }}
                      >
                        B/L No:
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                        }}
                      >
                        123456
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                        }}
                      >
                        WHL SCAC : WHLC
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                        }}
                      >
                        SCAC: TSUS
                      </div>
                    </div>
                  </div>
                  <h1 style={{ marginTop: 10, marginBottom: 10 }}>ORIGINAL</h1>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem nisi porro est labore laborum consectetur,
                    repellendus, dolorem perspiciatis consequatur architecto
                    ipsam velit eligendi esse. Qui exercitationem laboriosam
                    aliquam debitis recusandae!
                  </p>
                </div>
                <div className="rightSideBottom">
                  <p className="textTitle" style={{ paddingBottom: 5 }}>
                    Shipping Line Details:
                  </p>
                  <div style={{ paddingLeft: 5 }}>
                    <p>
                      {/*
                    // todo: add shipping line details
                  <br /> */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="middle">
              <div className="firstRow borderBottom">
                <div className="firstColumn borderRight">
                  <p className="textTitle">Port of Discharge:</p>
                  {/* <p>{bookingData?.portOfDischarge}</p> */}
                </div>
                <div className="secondColumn">
                  <div className="item borderRight">
                    <p className="textTitle">Final Destination:</p>
                    {/* <p>{bookingData?.finalDestinationAddress}</p> */}
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
                    Marks
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
                    {hblListData?.map((item, index) => {
                      return (
                        <div>
                          <p>Description Of Goods:</p>

                          {item?.rowsData?.map((rowItem, index) => {
                            return (
                              <>
                                <p>{rowItem?.descriptionOfGoods}</p>
                                <p>
                                  Po No:{" "}
                                  {rowItem?.dimensionRow?.map((i, index) => {
                                    return (
                                      (i?.poNumber || "") +
                                      (index < rowItem?.dimensionRow?.length - 1
                                        ? ","
                                        : "")
                                    );
                                  })}
                                </p>
                                <p>
                                  Color:{" "}
                                  {rowItem?.dimensionRow?.map((i, index) => {
                                    return (
                                      (i?.color || "") +
                                      (index < rowItem?.dimensionRow?.length - 1
                                        ? ","
                                        : "")
                                    );
                                  })}
                                </p>
                                <p>
                                  H.S Code:{" "}
                                  {(item?.hsCode || "") +
                                    (index < rowItem?.rowsData?.length - 1
                                      ? ","
                                      : "")}
                                </p>
                                <br />
                              </>
                            );
                          })}

                          <br />
                          <p>
                            Invoice No:
                            {item?.invoiceNumber}
                          </p>
                          <p>
                            {item?.infoType === "lc"
                              ? "LC No"
                              : item?.infoType === "tt"
                              ? "TT No"
                              : "S/C No"}
                            :{" "}
                            {item?.objPurchase?.map((item, index) => {
                              return `${item?.lcnumber ||
                                ""} : ${item?.lcdate &&
                                `${moment(item?.lcdate).format(
                                  "DD-MM-YYYY"
                                )}`}${
                                index < item?.objPurchase?.length - 1 ? "," : ""
                              }`;
                            })}
                          </p>
                          <p>
                            Exp No:
                            {item?.expOrCnfNumber || ""} :{" "}
                            {item?.expOrCnfDate &&
                              `${moment(item?.expOrCnfDate).format(
                                "DD-MM-YYYY"
                              )}`}
                          </p>
                          <p>
                            Stuffing mode:
                            {item?.modeOfStuffings}
                          </p>
                          <br />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="thirdColumn">
                  <div className="item borderRight">
                    <p>
                      {/* totalGrossWeightKG sum */}
                      {subtotalGrossWeight}
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
                      {totalVolumeCBM}
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
                        {/* {bookingData?.transportPlanning?.[0]
                          ?.estimatedTimeOfDepart &&
                          moment(
                            bookingData?.transportPlanning?.[0]
                              ?.estimatedTimeOfDepart,
                          ).format('DD-MM-YYYY')} */}
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
                      {/* {['exw'].includes(bookingData?.incoterms) &&
                        'COLLECT EXW'}
                      {['fca', 'fob'].includes(bookingData?.incoterms) &&
                        'COLLECT'}
                      {['cif', 'cpt', 'cfr'].includes(bookingData?.incoterms) &&
                        'PREPAID'}
                      {['dap', 'ddp', 'ddu'].includes(bookingData?.incoterms) &&
                        'COLLECT DAP/DDP/DDU'}
                      {['other'].includes(bookingData?.incoterms) && 'COLLECT'} */}
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
        ></p>
      </div>
    </>
  );
}
