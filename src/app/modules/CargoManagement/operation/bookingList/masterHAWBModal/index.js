import { Form, Formik } from "formik";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import "./HAWBFormat.css";
import logisticsLogo from "./logisticsLogo.png";
const validationSchema = Yup.object().shape({});

const MasterHBAWModal = ({ selectedRow, isPrintView }) => {
  const [hbawListData, getHBAWList] = useAxiosPost();

  const [isPrintViewMode, setIsPrintViewMode] = useState(isPrintView || false);
  const formikRef = React.useRef();

  const saveHandler = (values, cb) => {
    console.log(values);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Master HBAW`,
    pageStyle: `
        @media print {
          body {
            -webkit-print-color-adjust: exact;

          }
          @page {
            size: portrait !important;
            margin: 50px 30px 30px 30px !important;
          }
        }
      `,
  });
  React.useEffect(() => {
    const payload = selectedRow?.map((item) => {
      return {
        bookingReqestId: item?.bookingRequestId,
      };
    });
    getHBAWList(
      `${imarineBaseUrl}/domain/ShippingService/GetHBLList`,
      payload,
      (hbawRestData) => {
        // // pickupPlaceDDL
        // const pickupPlace = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.pickupPlace,
        //   };
        // });
        // setPickupPlaceDDL(pickupPlace);
        // // portOfLoadingDDL
        // const portOfLoading = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.portOfLoading,
        //   };
        // });
        // setPortOfLoadingDDL(portOfLoading);

        // // finalDestinationAddressDDL
        // const finalDestinationAddress = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.finalDestinationAddress,
        //   };
        // });
        // setFinalDestinationAddressDDL(finalDestinationAddress);

        // // portOfDischargeDDL
        // const portOfDischarge = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.portOfDischarge,
        //   };
        // });
        // setPortOfDischargeDDL(portOfDischarge);
        // // vesselNameDDL
        // const vesselName = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.transportPlanning?.vesselName || '',
        //   };
        // });
        // setVesselNameDDL(vesselName);

        // // voyagaNoDDL
        // const voyagaNo = data?.map((item, index) => {
        //   return {
        //     value: index + 1,
        //     label: item?.transportPlanning?.voyagaNo || '',
        //   };
        // });
        const firstIndex = hbawRestData[0];
        const totalNumberOfPackages = hbawRestData?.reduce((subtotal, item) => {
          const rows = item?.rowsData || [];
          const packageSubtotal = rows?.reduce(
            (sum, row) => sum + (row?.totalNumberOfPackages || 0),
            0
          );
          return subtotal + packageSubtotal;
        }, 0);
        const prepaidNatureAndQuantityOfGoods = hbawRestData
          ?.map((item) =>
            item?.rowsData
              .map((row) => {
                const description = row?.descriptionOfGoods;
                const hsCode = `H.S Code: ${row?.hsCode}`;
                const poNumbers = `Po No: ${row?.dimensionRow
                  .map((dim) => dim?.poNumber)
                  .join(", ")}`;
                const styles = `Style: ${row?.dimensionRow
                  .map((dim) => dim?.style)
                  .join(",")}`;
                const colors = `Color: ${row?.dimensionRow
                  .map((dim) => dim?.color)
                  .join(",")}`;
                return `${description}\n ${hsCode}\n ${poNumbers}\n ${styles}\n ${colors}\n`;
              })
              .join("\n")
          )
          .join("\n");
        const subtotalGrossWeight = hbawRestData?.reduce((subtotal, item) => {
          const rows = item?.rowsData || [];
          const weightSubtotal = rows?.reduce(
            (sum, row) => sum + (row?.totalGrossWeightKG || 0),
            0
          );
          return subtotal + weightSubtotal;
        }, 0);
        const totalVolumeCBM = hbawRestData?.reduce((subtotal, item) => {
          const rows = item?.rowsData || [];
          const volumeSubtotal = rows?.reduce(
            (sum, row) => sum + (row?.totalVolumeCBM || 0),
            0
          );
          return subtotal + volumeSubtotal;
        }, 0);
        const airportOfDepartureAndRouting = firstIndex?.transportPlanning?.airTransportRow?.map(
          (item) => {
            return `(${item?.fromPort} - ${item?.toPort}) `;
          }
        );

        const obj = {
          consignee: `${firstIndex?.freightAgentReference}\n${firstIndex?.deliveryAgentDtl?.zipCode}, ${firstIndex?.deliveryAgentDtl?.state}, ${firstIndex?.deliveryAgentDtl?.city}, ${firstIndex?.deliveryAgentDtl?.country}, ${firstIndex?.deliveryAgentDtl?.address}`,

          gsaName: "missing",
          agentIatacode: firstIndex?.transportPlanning?.iatanumber || "",
          referenceNumber: "missing",
          optionalShippingInformation: "missing",
          noOfPiecesRcp: totalNumberOfPackages,
          prepaidNatureAndQuantityOfGoods: prepaidNatureAndQuantityOfGoods,
          grossWeight: subtotalGrossWeight, //"missing",
          grossWeightKgLb: "grossWeightKgLb",
          to: "missing",
          to1: "to1",
          byFirstCarrierRoutingAndDestination:
            "byFirstCarrierRoutingAndDestination",
          to2: "to2",
          by2: "by2",
          currency: firstIndex?.currency || "",
          cghscode: "cGHSCode",
          declaredValueForCarriage: "",
          declaredValueForCustoms: firstIndex?.invoiceValue
            ? firstIndex?.invoiceValue
            : "AS PER INV",
          airportOfDestination: ` ${firstIndex?.transportPlanning?.airTransportRow?.[
            firstIndex?.transportPlanning?.airTransportRow?.length - 1
          ]?.toPort
            }`,
          amountOfInsurance: "amountOfInsurance",
          handlingInformation: "handlingInformation",
          accountNumber: "accountNumber",
          airportOfDepartureAndRouting: `${firstIndex?.transportPlanning?.airLineOrShippingLine}\n ${airportOfDepartureAndRouting}`,
          rateClassCommodityItemNo: "rateClassCommodityItemNo",
          chargeableWeight: "chargeableWeight",
          rateOrCharge: "rateOrCharge",
          prepaidPrepaidAmount: "prepaidPrepaidAmount",
          collectPrepaidAmount: "collectPrepaidAmount",
          prepaidValuationCharge: "prepaidValuationCharge",
          collectTotalOtherChargesDueCarrier1:
            "collectTotalOtherChargesDueCarrier1",
          collectTotalOtherChargesDueCarrier2:
            "collectTotalOtherChargesDueCarrier2",
          totalPrepaid: "totalPrepaid",
          totalCollect: "totalCollect",
          currencyConversionRates: "currencyConversionRates",
          ccchargesInDestCurrency: "ccchargesInDestCurrency",
          chargesAtDestination: "chargesAtDestination",

          //
          airMasterBlId: 0,
          isActive: true,
          createdBy: 0,
          bookingReqest: {
            bookingReqestId: 0,
          },
          masterBlNo: "string",
          shipperNameAndAddress: "string",
          consigneeNameAndAddress: "string",
          issuingCarrierAgentNameAndCity: "string",
          requestedFlightDate: "2024-12-17T12:11:17.873Z",
          prepaidTotalAmount: "string",
          prepaidWeightCharge: "string",
          prepaidTaxAmount: "prepaidTaxAmount",
          prepaidTotalOtherChargesDueAgent: "string",
          prepaidTotalOtherChargesDueCarrier1: "string",
          prepaidTotalOtherChargesDueCarrier2: "string",

          forCarrierUseOnlyAtDestination: "string",
          totalCollectCharges: "string",
          signatureOfShipperOrAgent: "string",
          executedOnDate: "2024-12-17T12:11:17.873Z",
          atPlace: "string",
          signatureOfIssuingCarrierOrAgent: "string",

          collectTotalAmount: "string",
          collectNatureAndQuantityOfGoods: "string",
          collectWeightCharge: "string",
          collectValuationCharge: "string",
          collectTaxAmount: "string",
          collectTotalOtherChargesDueAgent: "string",
          createdAt: "2024-12-17T12:11:17.873Z",
          serverTime: "2024-12-17T12:11:17.873Z",
          hblNos: [
            {
              hblnumber: "string",
            },
          ],
        };
        Object.keys(obj).forEach((key) => {
          formikRef.current.setFieldValue(key, obj[key]);
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  {isPrintViewMode ? (
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
                  ) : (
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="hawbWrapper" ref={componentRef}>
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <div className="masterHawbContainer">
                    <div className="shipperAandConsigneeInfo">
                      <div className="top borderBottom">
                        <div className="leftSide borderRight">
                          <div className="shipperInfo borderBottom">
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                              }}
                            >
                              <div>
                                <p className="textTitle">
                                  Shipper's Name and Address:
                                </p>
                                <p>TO THE ORDER OF</p>
                                <p>Akij Logistics Limited</p>
                              </div>
                              <div className="borderLeft borderBottom p-2">
                                <p className="textTitle">Company Info:</p>
                                <p> Bir Uttam Mir Shawkat Sarak, Dhaka 1208</p>
                              </div>
                            </div>
                          </div>
                          <div className="consigneeInfo borderBottom">
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                              }}
                            >
                              <div>
                                <p className="textTitle">
                                  Consignee's Name and Address:
                                </p>
                                <p>TO THE ORDER OF</p>
                              </div>
                              <div className="borderLeft borderBottom p-2">
                                <p className="textTitle">Delivery Agent:</p>
                                {isPrintView ? (
                                  <p>
                                    {values?.consignee
                                      ? values?.consignee
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                ) : (
                                  <textarea
                                    name="consignee"
                                    value={values?.consignee}
                                    rows={4}
                                    cols={40}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "consignee",
                                        e.target.value
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          {/* GSA Name */}
                          <div>
                            <div
                              style={{
                                height: "70px",
                                borderBottom: "1px solid #000",
                              }}
                            >
                              <p className="textTitle">GSA Name:</p>
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.gsaName
                                      ? values?.gsaName
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <textarea
                                    name="gsaName"
                                    value={values?.gsaName}
                                    onChange={(e) => {
                                      setFieldValue("gsaName", e.target.value);
                                    }}
                                  />
                                </>
                              )}
                            </div>

                            <div
                              style={{
                                height: "60px",
                              }}
                            >
                              <div style={{ display: "flex", height: "100%" }}>
                                <div
                                  className="borderRight"
                                  style={{ width: "50%" }}
                                >
                                  <p className="textTitle">Agent IATA Code</p>
                                  {isPrintViewMode ? (
                                    <>
                                      <p>{values?.agentIatacode || ""}</p>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <div className="col-lg-12">
                                        <NewSelect
                                          name="agentIatacode"
                                          options={[]}
                                          value={
                                            values?.agentIatacode
                                              ? {
                                                value: 0,
                                                label: values?.agentIatacode,
                                              }
                                              : ""
                                          }
                                          label=""
                                          onChange={(valueOption) => {
                                            setFieldValue(
                                              "agentIatacode",
                                              valueOption?.label
                                            );
                                          }}
                                          errors={errors}
                                          touched={touched}
                                          isCreatableSelect={true}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div style={{ width: "50%" }}>
                                  <p className="textTitle ">Account Number</p>
                                  {isPrintViewMode ? (
                                    <>
                                      <p>{values?.accountNumber || ""}</p>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <div className="col-lg-12">
                                        <NewSelect
                                          name="accountNumber"
                                          options={[]}
                                          value={
                                            values?.accountNumber
                                              ? {
                                                value: 0,
                                                label: values?.accountNumber,
                                              }
                                              : ""
                                          }
                                          label=""
                                          onChange={(valueOption) => {
                                            setFieldValue(
                                              "accountNumber",
                                              valueOption?.label
                                            );
                                          }}
                                          errors={errors}
                                          touched={touched}
                                          isCreatableSelect={true}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rightSide">
                          <div className="rightSideTop">
                            <div>
                              <p className="textTitle">Not Negotiable</p>
                              <h6 className="airWayBillTitle">AIR WAYBILL</h6>
                              <p>(Air Consigniment Note)</p>
                              <p>Issued by</p>
                            </div>
                            <div>
                              <img src={logisticsLogo} alt="barcode" />
                              <p>
                                <b>Akij Logistics Limited</b>
                              </p>
                            </div>
                          </div>
                          <div className="rightSideBottom" />
                          <div
                            className="rightSideMiddle borderBottom"
                            style={{ paddingBottom: "8px" }}
                          >
                            <p className="rightSideMiddleTitle">
                              Copies 1,2 and 3 of this Air Waybill arc originals
                              and have the same validity
                            </p>
                            <p className="rightSideMiddleContent">
                              It is agreed that the goods described herein are
                              accepted in apparent good order and condition
                              (except as noted) for carriage SUBJECT TO THE
                              CONDITIONS OF CONTRACT ON THE REVERSE HEREOF. ALL
                              GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING
                              ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY
                              INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND
                              SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED
                              VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER
                              DEEMS APPROPRIATE. THE SHIPPER'S ATTENTION IS
                              DRAWN TO THE NOTICE CONCERNING CARRIER·s
                              LIMITATION OF LIABILITY. Shipper may increase such
                              limitation of liabHity by declaring a higher value
                              for carriage and paying a suppfemental charge if
                              required.
                            </p>
                          </div>
                          <div className="rightSideButtom">
                            <div>
                              <p className="textTitle">
                                Accounting Information
                              </p>
                              <div className="text-center">
                                <br />
                                <h2>
                                  FREIGHT{" "}
                                  {["exw"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && "COLLECT EXW"}
                                  {["fca", "fob"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && "COLLECT"}
                                  {["cif", "cpt", "cfr"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && "PREPAID"}
                                  {["dap", "ddp", "ddu"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && "COLLECT DAP/DDP/DDU"}
                                  {["other"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && "COLLECT"}
                                </h2>
                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="borderBottom"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          minHeight: "50px",
                        }}
                      >
                        <div className="borderRight">
                          <div>
                            <p className="textTitle">
                              Airport of Departure and Requested Routing
                            </p>
                            {isPrintViewMode ? (
                              <>
                                <p>
                                  {values?.airportOfDepartureAndRouting
                                    ? values?.airportOfDepartureAndRouting
                                      ?.split("\n")
                                      .map((item, index) => {
                                        return (
                                          <>
                                            {item}
                                            <br />
                                          </>
                                        );
                                      })
                                    : ""}
                                </p>
                              </>
                            ) : (
                              <>
                                {" "}
                                <div className="col-lg-12">
                                  <textarea
                                    name="airportOfDepartureAndRouting"
                                    value={values?.airportOfDepartureAndRouting}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "airportOfDepartureAndRouting",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            minHeight: "50px",
                          }}
                        >
                          <div className="borderRight">
                            <p className=" textTitle">Reference Number</p>
                            {isPrintViewMode ? (
                              <>
                                <p>{values?.referenceNumber || ""}</p>
                              </>
                            ) : (
                              <>
                                {" "}
                                <div className="col-lg-12">
                                  <InputField
                                    name="referenceNumber"
                                    value={values?.referenceNumber}
                                    type="text"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "referenceNumber",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          <div>
                            <p className="textTitle">
                              Optional Shipping Information
                            </p>
                            {isPrintViewMode ? (
                              <>
                                <p>
                                  {values?.optionalShippingInformation
                                    ? values?.optionalShippingInformation
                                      ?.split("\n")
                                      .map((item, index) => {
                                        return (
                                          <>
                                            {item}
                                            <br />
                                          </>
                                        );
                                      })
                                    : ""}
                                </p>
                              </>
                            ) : (
                              <>
                                {" "}
                                <div className="col-lg-12">
                                  <textarea
                                    name="optionalShippingInformation"
                                    value={values?.optionalShippingInformation}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "optionalShippingInformation",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div />
                      </div>
                      <div className="top borderBottom airInfo">
                        <div className="leftSide borderRight">
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "3fr 2fr",
                              minHeight: "100%",
                            }}
                          >
                            <div
                              className="borderRight"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 4fr",
                              }}
                            >
                              <div className="borderRight">
                                <p className="textTitle"> To</p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.to
                                        ? values?.to
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <textarea
                                      name="to"
                                      value={values?.to}
                                      onChange={(e) => {
                                        setFieldValue("to", e.target.value);
                                      }}
                                      style={{
                                        minWidth: "40px",
                                      }}
                                    //  rows={3}
                                    // cols={40}
                                    />
                                  </>
                                )}
                              </div>
                              <div>
                                <p className="textTitle">
                                  By First Carrier (Routing and Destination)
                                  {isPrintViewMode ? (
                                    <>
                                      <p>
                                        {values?.byFirstCarrierRoutingAndDestination
                                          ? values?.byFirstCarrierRoutingAndDestination
                                            ?.split("\n")
                                            .map((item, index) => {
                                              return (
                                                <>
                                                  {item}
                                                  <br />
                                                </>
                                              );
                                            })
                                          : ""}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <div className="col-lg-12">
                                        <textarea
                                          name="byFirstCarrierRoutingAndDestination"
                                          value={
                                            values?.byFirstCarrierRoutingAndDestination
                                          }
                                          onChange={(e) => {
                                            setFieldValue(
                                              "byFirstCarrierRoutingAndDestination",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </div>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                              }}
                            >
                              <div className="borderRight">
                                <p className="textTitle">To</p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.to1
                                        ? values?.to1
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <textarea
                                      name="to1"
                                      value={values?.to1}
                                      onChange={(e) => {
                                        setFieldValue("to1", e.target.value);
                                      }}
                                      style={{
                                        minWidth: "40px",
                                      }}
                                    //  rows={3}
                                    // cols={40}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="borderRight">
                                <p className="textTitle">By</p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.strBy1
                                        ? values?.strBy1
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <textarea
                                      name="strBy1"
                                      value={values?.strBy1}
                                      onChange={(e) => {
                                        setFieldValue("strBy1", e.target.value);
                                      }}
                                      style={{
                                        minWidth: "40px",
                                      }}
                                    //  rows={3}
                                    // cols={40}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="borderRight">
                                <p className="textTitle">To</p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.to2
                                        ? values?.to2
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <textarea
                                      name="to2"
                                      value={values?.to2}
                                      onChange={(e) => {
                                        setFieldValue("to2", e.target.value);
                                      }}
                                      style={{
                                        minWidth: "40px",
                                      }}
                                    //  rows={3}
                                    // cols={40}
                                    />
                                  </>
                                )}
                              </div>
                              <div>
                                <p className="textTitle">By</p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.by2
                                        ? values?.by2
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <textarea
                                      name="by2"
                                      value={values?.by2}
                                      onChange={(e) => {
                                        setFieldValue("by2", e.target.value);
                                      }}
                                      style={{
                                        minWidth: "40px",
                                      }}
                                    //  rows={3}
                                    // cols={40}
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rightSide">
                          <div className="rightSideColumnOne borderRight">
                            <div style={{ display: "flex", height: "100%" }}>
                              <div
                                style={{ display: "flex", height: "100%" }}
                                className="commonWithOne borderRight"
                              >
                                <div className="hawbCurrency borderRight">
                                  <div className="borderRight">
                                    <p className="textTitle">Currency</p>
                                    {isPrintViewMode ? (
                                      <>
                                        <p>
                                          {values?.currency
                                            ? values?.currency
                                              ?.split("\n")
                                              .map((item, index) => {
                                                return (
                                                  <>
                                                    {item}
                                                    <br />
                                                  </>
                                                );
                                              })
                                            : ""}
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <textarea
                                          name="currency"
                                          value={values?.currency}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "currency",
                                              e.target.value
                                            );
                                          }}
                                          style={{
                                            minWidth: "50px",
                                          }}
                                        //  rows={3}
                                        // cols={40}
                                        />
                                      </>
                                    )}
                                  </div>
                                  <div>
                                    <p className="textTitle">CHGS Code</p>
                                    {isPrintViewMode ? (
                                      <>
                                        <p>
                                          {values?.cghscode
                                            ? values?.cghscode
                                              ?.split("\n")
                                              .map((item, index) => {
                                                return (
                                                  <>
                                                    {item}
                                                    <br />
                                                  </>
                                                );
                                              })
                                            : ""}
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <textarea
                                          name="cghscode"
                                          value={values?.cghscode}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "cghscode",
                                              e.target.value
                                            );
                                          }}
                                          style={{
                                            minWidth: "50px",
                                          }}
                                        //  rows={3}
                                        // cols={40}
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="air-flight-info"
                                  style={{
                                    width: "100%",
                                  }}
                                >
                                  <div className="air-flight-catagory">
                                    <p className="borderBottom textTitle">
                                      WT/VAL
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        height: "100%",
                                      }}
                                    >
                                      <p
                                        className="borderRight textTitle"
                                        style={{
                                          width: "50%",
                                        }}
                                      >
                                        {["cif", "cpt", "cfr"].includes(
                                          hbawListData?.[0]?.incoterms
                                        )
                                          ? "PPD"
                                          : ""}
                                      </p>
                                      <p
                                        className="textTitle"
                                        style={{
                                          width: "50%",
                                        }}
                                      >
                                        {["cif", "cpt", "cfr"].includes(
                                          hbawListData?.[0]?.incoterms
                                        )
                                          ? ""
                                          : "CCX"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="air-flight-info"
                                style={{
                                  flex: 1,
                                }}
                              >
                                <div className="air-flight-catagory">
                                  <p className="borderBottom textTitle">
                                    Other
                                  </p>
                                  <div
                                    style={{ display: "flex", height: "100%" }}
                                  >
                                    <p
                                      className="borderRight textTitle"
                                      style={{
                                        width: "50%",
                                      }}
                                    >
                                      {["cif", "cpt", "cfr"].includes(
                                        hbawListData?.[0]?.incoterms
                                      )
                                        ? "PPD"
                                        : ""}
                                    </p>
                                    <p
                                      className="textTitle"
                                      style={{
                                        width: "50%",
                                      }}
                                    >
                                      {["cif", "cpt", "cfr"].includes(
                                        hbawListData?.[0]?.incoterms
                                      )
                                        ? ""
                                        : "CCX"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              flex: 1,
                            }}
                          >
                            <div style={{ display: "flex", height: "100%" }}>
                              <div
                                className="borderRight"
                                style={{
                                  width: "50%",
                                }}
                              >
                                <p className="textTitle">
                                  Declared Value for Carriage
                                </p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.declaredValueForCarriage
                                        ? values?.declaredValueForCarriage
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <textarea
                                      name="declaredValueForCarriage"
                                      value={values?.declaredValueForCarriage}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "declaredValueForCarriage",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                              <div
                                style={{
                                  width: "50%",
                                }}
                              >
                                <p className="textTitle">
                                  Declared Value for Customs
                                </p>
                                {isPrintViewMode ? (
                                  <>
                                    <p>
                                      {values?.declaredValueForCustoms
                                        ? values?.declaredValueForCustoms
                                          ?.split("\n")
                                          .map((item, index) => {
                                            return (
                                              <>
                                                {item}
                                                <br />
                                              </>
                                            );
                                          })
                                        : ""}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <textarea
                                      name="declaredValueForCustoms"
                                      value={values?.declaredValueForCustoms}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "declaredValueForCustoms",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div />
                      </div>

                      <div className="top borderBottom airInfo">
                        <div className="leftSide borderRight">
                          <div style={{ display: "flex", height: "100%" }}>
                            <div
                              className="air-destination-info borderRight"
                              style={{ width: "50%" }}
                            >
                              <p className="textTitle">
                                Airport of Destination
                              </p>
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.airportOfDestination
                                      ? values?.airportOfDestination
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <div className="col-lg-12">
                                    <textarea
                                      name="airportOfDestination"
                                      value={values?.airportOfDestination}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "airportOfDestination",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div style={{ width: "50%" }}>
                              <div style={{ display: "flex", height: "100%" }}>
                                <div
                                  className="borderRight"
                                  style={{ width: "50%" }}
                                >
                                  <p className="textTitle ">Flight/Date</p>
                                  {isPrintViewMode ? (
                                    <>
                                      <p>{values?.requestedFlightDate || ""}</p>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <div className="col-lg-12">
                                        <InputField
                                          name="requestedFlightDate"
                                          value={values?.requestedFlightDate}
                                          type="date"
                                          onChange={(e) => {
                                            setFieldValue(
                                              "requestedFlightDate",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="" style={{ width: "50%" }}>
                                  <p className="textTitle ">Flight/Date</p>
                                  {isPrintViewMode ? (
                                    <>
                                      <p>{values?.requestedFlightDate || ""}</p>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <div className="col-lg-12">
                                        <InputField
                                          name="requestedFlightDate"
                                          value={values?.requestedFlightDate}
                                          type="date"
                                          onChange={(e) => {
                                            setFieldValue(
                                              "requestedFlightDate",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rightSide">
                          <div style={{ display: "flex" }}>
                            <div className="amountofInsurance borderRight commonWithOne">
                              <p className="textTitle">Amount of Insurance</p>
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.amountOfInsurance
                                      ? values?.amountOfInsurance
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <textarea
                                    name="amountOfInsurance"
                                    value={values?.amountOfInsurance}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "amountOfInsurance",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </div>
                            <div>
                              <p>
                                INSURANCE-if Carrier offers insurance and such
                                insurance is requested in accordance with
                                condition on reverse hereof, indicate amount to
                                be insured in figures in box marked amount of
                                insurance
                              </p>
                            </div>
                          </div>
                        </div>
                        <div />
                      </div>
                      <div style={{ minHeight: 50 }} className="borderBottom">
                        <p className="textTitle">Handling Information</p>
                        {isPrintViewMode ? (
                          <>
                            <p>
                              {values?.handlingInformation
                                ? values?.handlingInformation
                                  ?.split("\n")
                                  .map((item, index) => {
                                    return (
                                      <>
                                        {item}
                                        <br />
                                      </>
                                    );
                                  })
                                : ""}
                            </p>
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className="col-lg-12">
                              <textarea
                                name="handlingInformation"
                                value={values?.handlingInformation}
                                onChange={(e) => {
                                  setFieldValue(
                                    "handlingInformation",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {/* cargo info */}
                      <div className="cargoInfo borderBottom">
                        <div>
                          <div
                            style={{ display: "flex", textAlign: "center" }}
                            className="borderBottom textTitle"
                          >
                            <div className="noPiecesRcp borderRight">
                              <p>No Of Pieces RCP</p>
                            </div>
                            <div className="grossWeight borderRight">
                              <p>Gross Weight</p>
                            </div>
                            <div className="kgIB borderRight">
                              <p>KG IB</p>
                            </div>
                            <div className="grossWeight borderRight">
                              <p>Rate Class / Community Item No</p>
                            </div>

                            <div className="chargeableWeight borderRight">
                              <p>Chargeable Weight</p>
                            </div>
                            <div className="rateAndCharge borderRight">
                              <p>Rate</p>
                            </div>
                            <div className="total borderRight">
                              <p>Total</p>
                            </div>
                            <div className="natureandQuantityofGoods">
                              <p>
                                Nature and Quantity of Goods <br />
                                (incl, Dimensions or volume)
                              </p>
                            </div>
                          </div>
                        </div>
                        <div style={{ height: "100%", fontWeight: "500" }}>
                          <div style={{ display: "flex", height: "100%" }}>
                            <div
                              className="noPiecesRcp borderRight"
                              style={{
                                position: "relative",
                              }}
                            >
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.noOfPiecesRcp
                                      ? values?.noOfPiecesRcp
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <textarea
                                    name="noOfPiecesRcp"
                                    value={values?.noOfPiecesRcp}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "noOfPiecesRcp",
                                        e.target.value
                                      );
                                    }}
                                    style={{
                                      minWidth: "40px",
                                    }}
                                    rows={20}
                                  />
                                </>
                              )}
                            </div>
                            <div className="grossWeight borderRight">
                              <>
                                {isPrintViewMode ? (
                                  <>
                                    {values?.grossWeight
                                      ? values?.grossWeight
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <textarea
                                      value={values?.grossWeight}
                                      name="grossWeight"
                                      rows={3}
                                      cols={40}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "grossWeight",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </>
                                )}
                              </>
                            </div>
                            <div className="kgIB borderRight">
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.grossWeightKgLb
                                      ? values?.grossWeightKgLb
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <div className="col-lg-12">
                                    <textarea
                                      name="grossWeightKgLb"
                                      value={values?.grossWeightKgLb}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "grossWeightKgLb",
                                          e.target.value
                                        );
                                      }}
                                      rows={20}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="grossWeight borderRight">
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.rateClassCommodityItemNo
                                      ? values?.rateClassCommodityItemNo
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <div className="col-lg-12">
                                    <textarea
                                      name="rateClassCommodityItemNo"
                                      value={values?.rateClassCommodityItemNo}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "rateClassCommodityItemNo",
                                          e.target.value
                                        );
                                      }}
                                      rows={20}
                                    />
                                  </div>
                                </>
                              )}
                              <p></p>
                            </div>

                            <div className="chargeableWeight borderRight">
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.chargeableWeight
                                      ? values?.chargeableWeight
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <div className="col-lg-12">
                                    <textarea
                                      name="chargeableWeight"
                                      value={values?.chargeableWeight}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "chargeableWeight",
                                          e.target.value
                                        );
                                      }}
                                      rows={20}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="rateAndCharge borderRight">
                              {isPrintViewMode ? (
                                <>
                                  <p>
                                    {values?.rateOrCharge
                                      ? values?.rateOrCharge
                                        ?.split("\n")
                                        .map((item, index) => {
                                          return (
                                            <>
                                              {item}
                                              <br />
                                            </>
                                          );
                                        })
                                      : ""}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <div className="col-lg-12">
                                    <textarea
                                      name="rateOrCharge"
                                      value={values?.rateOrCharge}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "rateOrCharge",
                                          e.target.value
                                        );
                                      }}
                                      rows={20}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="total borderRight">
                              <p></p>
                            </div>
                            <div className="natureandQuantityofGoods">
                              {isPrintViewMode ? (
                                <>
                                  {values?.prepaidNatureAndQuantityOfGoods
                                    ? values?.prepaidNatureAndQuantityOfGoods
                                      ?.split("\n")
                                      .map((item, index) => {
                                        return (
                                          <>
                                            {item}
                                            <br />
                                          </>
                                        );
                                      })
                                    : ""}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <textarea
                                    value={
                                      values?.prepaidNatureAndQuantityOfGoods
                                    }
                                    name="prepaidNatureAndQuantityOfGoods"
                                    rows={24}
                                    cols={40}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "prepaidNatureAndQuantityOfGoods",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* collect info */}
                      <div className="collectInfo">
                        {/* row item (1) */}
                        <div className="collectItemRow collectItemRowOne ">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart borderBottom">
                              {/* grap */}
                              <div className="collectChartBox">
                                <span className=" collectChartBoxItem collectChartBoxPrepaid textTitle">
                                  Prepaid
                                </span>
                                <sapn className=" collectChartBoxItem collectChartBoxWC textTitle">
                                  Weight charge
                                </sapn>
                                <span className=" collectChartBoxItem collectChartBoxCollect textTitle">
                                  Collect
                                </span>
                              </div>
                              <div className="collectChartLeft borderRight">
                                {["cif", "cpt", "cfr"].includes(
                                  hbawListData?.[0]?.incoterms
                                ) && (
                                    <>
                                      {isPrintViewMode ? (
                                        <>
                                          <p>
                                            {values?.prepaidPrepaidAmount
                                              ? values?.prepaidPrepaidAmount
                                                ?.split("\n")
                                                .map((item, index) => {
                                                  return (
                                                    <>
                                                      {item}
                                                      <br />
                                                    </>
                                                  );
                                                })
                                              : ""}
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="col-lg-12 collectChartValue">
                                            <textarea
                                              name="prepaidPrepaidAmount"
                                              value={values?.prepaidPrepaidAmount}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "prepaidPrepaidAmount",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                              </div>
                              <div className="collectChartRight">
                                {!["cif", "cpt", "cfr"].includes(
                                  hbawListData?.[0]?.incoterms
                                ) && (
                                    <>
                                      {isPrintViewMode ? (
                                        <>
                                          <p>
                                            {values?.collectPrepaidAmount
                                              ? values?.collectPrepaidAmount
                                                ?.split("\n")
                                                .map((item, index) => {
                                                  return (
                                                    <>
                                                      {item}
                                                      <br />
                                                    </>
                                                  );
                                                })
                                              : ""}
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="col-lg-12">
                                            <textarea
                                              name="collectPrepaidAmount"
                                              value={values?.collectPrepaidAmount}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "collectPrepaidAmount",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight"></div>
                        </div>
                        {/* row item (2) */}
                        <div className="collectItemRow collectItemRowTwo ">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart borderBottom">
                              {/* grap */}
                              <div
                                className="collectChartBox "
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                              >
                                <span className=" collectChartBoxItem collectChartBoxValuationCharge textTitle">
                                  Valuation charge
                                </span>
                              </div>
                              <div className="collectChartLeft borderRight">
                                {["cif", "cpt", "cfr"].includes(
                                  hbawListData?.[0]?.incoterms
                                ) && (
                                    <>
                                      {isPrintViewMode ? (
                                        <>
                                          <p>
                                            {values?.prepaidValuationCharge
                                              ? values?.prepaidValuationCharge
                                                ?.split("\n")
                                                .map((item, index) => {
                                                  return (
                                                    <>
                                                      {item}
                                                      <br />
                                                    </>
                                                  );
                                                })
                                              : ""}
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="col-lg-12">
                                            <textarea
                                              name="prepaidValuationCharge"
                                              value={
                                                values?.prepaidValuationCharge
                                              }
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "prepaidValuationCharge",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                              </div>
                              <div className="collectChartRight">
                                {!["cif", "cpt", "cfr"].includes(
                                  hbawListData?.[0]?.incoterms
                                ) && (
                                    <>
                                      {isPrintViewMode ? (
                                        <>
                                          <p>
                                            {values?.prepaidValuationCharge
                                              ? values?.prepaidValuationCharge
                                                ?.split("\n")
                                                .map((item, index) => {
                                                  return (
                                                    <>
                                                      {item}
                                                      <br />
                                                    </>
                                                  );
                                                })
                                              : ""}
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="col-lg-12">
                                            <textarea
                                              name="prepaidValuationCharge"
                                              value={
                                                values?.prepaidValuationCharge
                                              }
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "prepaidValuationCharge",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight"></div>
                        </div>
                        {/* row item (3) */}
                        <div className="collectItemRow collectItemRowThree borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              {/* grap */}
                              <div
                                className="collectChartBox"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                              >
                                <span className=" collectChartBoxItem collectChartTax textTitle">
                                  Tax
                                </span>
                              </div>
                              <div className="collectChartLeft borderRight">
                                <p className="collectChartValue">
                                  {["cif", "cpt", "cfr"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && (
                                      <>
                                        {isPrintViewMode ? (
                                          <>
                                            <p>
                                              {values?.prepaidTaxAmount
                                                ? values?.prepaidTaxAmount
                                                  ?.split("\n")
                                                  .map((item, index) => {
                                                    return (
                                                      <>
                                                        {item}
                                                        <br />
                                                      </>
                                                    );
                                                  })
                                                : ""}
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            {" "}
                                            <div className="col-lg-12">
                                              <textarea
                                                name="prepaidTaxAmount"
                                                value={values?.prepaidTaxAmount}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    "prepaidTaxAmount",
                                                    e.target.value
                                                  );
                                                }}
                                                cols={1}
                                              />
                                            </div>
                                          </>
                                        )}
                                      </>
                                    )}
                                </p>
                              </div>
                              <div className="collectChartRight">
                                <p className="collectChartValue">
                                  {!["cif", "cpt", "cfr"].includes(
                                    hbawListData?.[0]?.incoterms
                                  ) && (
                                      <>
                                        {isPrintViewMode ? (
                                          <>
                                            <p>
                                              {values?.prepaidTaxAmount
                                                ? values?.prepaidTaxAmount
                                                  ?.split("\n")
                                                  .map((item, index) => {
                                                    return (
                                                      <>
                                                        {item}
                                                        <br />
                                                      </>
                                                    );
                                                  })
                                                : ""}
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            {" "}
                                            <div className="col-lg-12">
                                              <textarea
                                                name="prepaidTaxAmount"
                                                value={values?.prepaidTaxAmount}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    "prepaidTaxAmount",
                                                    e.target.value
                                                  );
                                                }}
                                                cols={1}
                                              />
                                            </div>
                                          </>
                                        )}
                                      </>
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight">
                            <div>
                              <p className="textTitle"></p>
                            </div>
                          </div>
                        </div>
                        {/* row item (4) */}
                        <div className="collectItemRow collectItemRowFour borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              <div style={{ width: "100%" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "relative",
                                  }}
                                  className="borderBottom totalOtherChargesDueAgent"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxTotalOtherChargesDueAgent textTitle">
                                      Total Other Charges Due Agent
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    {["cif", "cpt", "cfr"].includes(
                                      hbawListData?.[0]?.incoterms
                                    ) && (
                                        <>
                                          {isPrintViewMode ? (
                                            <>
                                              <p>
                                                {values?.totalOtherChargesDueAgent
                                                  ? values?.totalOtherChargesDueAgent
                                                    ?.split("\n")
                                                    .map((item, index) => {
                                                      return (
                                                        <>
                                                          {item}
                                                          <br />
                                                        </>
                                                      );
                                                    })
                                                  : ""
                                                }
                                              </p>
                                            </>
                                          ) : (
                                            <>
                                              {" "}
                                              <div className="col-lg-12">
                                                <textarea
                                                  name="totalOtherChargesDueAgent"
                                                  value={
                                                    values?.totalOtherChargesDueAgent
                                                  }
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "totalOtherChargesDueAgent",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </>
                                      )}
                                  </div>
                                  <div className="collectChartRight">
                                    {!["cif", "cpt", "cfr"].includes(
                                      hbawListData?.[0]?.incoterms
                                    ) && (
                                        <>
                                          {isPrintViewMode ? (
                                            <>
                                              <p>
                                                {values?.totalOtherChargesDueAgent
                                                  ? values?.totalOtherChargesDueAgent
                                                    ?.split("\n")
                                                    .map((item, index) => {
                                                      return (
                                                        <>
                                                          {item}
                                                          <br />
                                                        </>
                                                      );
                                                    })
                                                  : ""
                                                }
                                              </p>
                                            </>
                                          ) : (
                                            <>
                                              {" "}
                                              <div className="col-lg-12">
                                                <textarea
                                                  name="totalOtherChargesDueAgent"
                                                  value={
                                                    values?.totalOtherChargesDueAgent
                                                  }
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "totalOtherChargesDueAgent",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </>
                                      )}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "relative",
                                  }}
                                  className="totalOtherChargesDueCarrier borderBottom"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxTotalOtherChargesDueCarrier textTitle">
                                      Total OtherCharges Due Carrier
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    {["cif", "cpt", "cfr"].includes(
                                      hbawListData?.[0]?.incoterms
                                    ) && (
                                        <>
                                          {isPrintViewMode ? (
                                            <>
                                              <p>
                                                {values?.collectTotalOtherChargesDueCarrier1
                                                  ? values?.collectTotalOtherChargesDueCarrier1
                                                    ?.split("\n")
                                                    .map((item, index) => {
                                                      return (
                                                        <>
                                                          {item}
                                                          <br />
                                                        </>
                                                      );
                                                    })
                                                  : ""}
                                              </p>
                                            </>
                                          ) : (
                                            <>
                                              {" "}
                                              <div className="col-lg-12">
                                                <textarea
                                                  name="collectTotalOtherChargesDueCarrier1"
                                                  value={
                                                    values?.collectTotalOtherChargesDueCarrier1
                                                  }
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "collectTotalOtherChargesDueCarrier1",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </>
                                      )}
                                  </div>
                                  <div className="collectChartRight">
                                    {!["cif", "cpt", "cfr"].includes(
                                      hbawListData?.[0]?.incoterms
                                    ) && (
                                        <>
                                          {isPrintViewMode ? (
                                            <>
                                              {
                                                values?.collectTotalOtherChargesDueCarrier2
                                                  ? values?.collectTotalOtherChargesDueCarrier2
                                                    ?.split("\n")
                                                    .map((item, index) => {
                                                      return (
                                                        <>
                                                          {item}
                                                          <br />
                                                        </>
                                                      );
                                                    })
                                                  : ""
                                              }
                                            </>
                                          ) : (
                                            <>
                                              {" "}
                                              <div className="col-lg-12">
                                                <textarea
                                                  name="collectTotalOtherChargesDueCarrier2"
                                                  value={
                                                    values?.collectTotalOtherChargesDueCarrier2
                                                  }
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      "collectTotalOtherChargesDueCarrier2",
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </>
                                      )}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "relative",
                                  }}
                                  className="totalOtherChargesDueCarrier"
                                >
                                  {/* grap */}
                                  <div className="collectChartLeft borderRight">
                                    {/*  // todo */}
                                  </div>
                                  <div className="collectChartRight">
                                    {/*  // todo */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collectItemRight">
                            <div>
                              <p className="smallTitle">
                                Shipper certifies that the particulars on the
                                face hereof are correct and that insofar as any
                                part of the consignment contains restricted
                                articles, such part is properly described by
                                name and is in proper condition for carriage by
                                air according to the applicable Dangerous Goods
                                Regulations.
                              </p>
                              <h1
                                className="collectChartValue"
                                style={{
                                  textAlign: "center",
                                  marginTop: 5,
                                  textTransform: "uppercase",
                                }}
                              >
                                {hbawListData?.[0]?.shipperName}
                              </h1>
                              <hr
                                style={{
                                  borderTop: "1px dotted",
                                  marginTop: 50,
                                  marginBottom: 0,
                                }}
                              />
                              <p className="text-center">
                                <b>Signature of Shipper or his Agent</b>
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* row item (5) */}
                        <div className="collectItemRow collectItemRowFive borderBottom">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              <div style={{ width: "100%" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "relative",
                                  }}
                                  className="borderBottom totalOtherChargesTotalPrepaid"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxTotalPrepaid textTitle">
                                      Total Prepaid
                                    </span>
                                    {/*  Total Collect*/}
                                    <span className=" collectChartBoxItem collectChartBoxTotalCollect textTitle">
                                      Total Collect{" "}
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="collectChartValue">
                                      {["cif", "cpt", "cfr"].includes(
                                        hbawListData?.[0]?.incoterms
                                      ) && (
                                          <>
                                            {isPrintViewMode ? (
                                              <>
                                                <p>
                                                  {values?.totalPrepaid
                                                    ? values?.totalPrepaid
                                                      ?.split("\n")
                                                      .map((item, index) => {
                                                        return (
                                                          <>
                                                            {item}
                                                            <br />
                                                          </>
                                                        );
                                                      })
                                                    : ""}
                                                </p>
                                              </>
                                            ) : (
                                              <>
                                                {" "}
                                                <div className="col-lg-12">
                                                  <textarea
                                                    name="totalPrepaid"
                                                    value={values?.totalPrepaid}
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        "totalPrepaid",
                                                        e.target.value
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              </>
                                            )}
                                          </>
                                        )}
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    <p className="collectChartValue">
                                      {!["cif", "cpt", "cfr"].includes(
                                        hbawListData?.[0]?.incoterms
                                      ) && (
                                          <>
                                            {isPrintViewMode ? (
                                              <>
                                                <p>
                                                  {values?.totalCollect
                                                    ? values?.totalCollect
                                                      ?.split("\n")
                                                      .map((item, index) => {
                                                        return (
                                                          <>
                                                            {item}
                                                            <br />
                                                          </>
                                                        );
                                                      })
                                                    : ""}
                                                </p>
                                              </>
                                            ) : (
                                              <>
                                                {" "}
                                                <div className="col-lg-12">
                                                  <textarea
                                                    name="totalCollect"
                                                    value={values?.totalCollect}
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        "totalCollect",
                                                        e.target.value
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              </>
                                            )}
                                          </>
                                        )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "relative",
                                  }}
                                  className="currencyConversionRate "
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxCurrencyConversionRate textTitle">
                                      Currency Conversion Rate
                                    </span>
                                    {/* CC charges in dest currency */}
                                    <span className=" collectChartBoxItem collectChartBoxCCChargesInDestCurrency textTitle">
                                      CC Charges in Dest Currency{" "}
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    {isPrintViewMode ? (
                                      <>
                                        <p>
                                          {values?.currencyConversionRates
                                            ? values?.currencyConversionRates
                                              ?.split("\n")
                                              .map((item, index) => {
                                                return (
                                                  <>
                                                    {item}
                                                    <br />
                                                  </>
                                                );
                                              })
                                            : ""}
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        <div className="col-lg-12">
                                          <textarea
                                            name="currencyConversionRates"
                                            value={
                                              values?.currencyConversionRates
                                            }
                                            onChange={(e) => {
                                              setFieldValue(
                                                "currencyConversionRates",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="collectChartRight">
                                    {isPrintViewMode ? (
                                      <>
                                        <p>
                                          {values?.ccchargesInDestCurrency
                                            ? values?.ccchargesInDestCurrency
                                              ?.split("\n")
                                              .map((item, index) => {
                                                return (
                                                  <>
                                                    {item}
                                                    <br />
                                                  </>
                                                );
                                              })
                                            : ""}
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        <div className="col-lg-12">
                                          <textarea
                                            name="ccchargesInDestCurrency"
                                            value={
                                              values?.ccchargesInDestCurrency
                                            }
                                            onChange={(e) => {
                                              setFieldValue(
                                                "ccchargesInDestCurrency",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="collectItemRight"
                            style={{ width: "100%" }}
                          >
                            <div
                              className=""
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 30,
                                marginTop: 5,
                              }}
                            >
                              <p>
                                <b>
                                  {hbawListData?.[0]?.confirmDate &&
                                    moment(
                                      hbawListData?.[0]?.confirmDate
                                    ).format("DD-MM-YYYY")}{" "}
                                  Dhaka
                                </b>
                              </p>
                              <p>
                                <b>Akij Logistics Limited</b>
                              </p>
                            </div>
                            <hr
                              style={{
                                borderTop: "1px dotted",
                                marginTop: 25,
                                marginBottom: 0,
                              }}
                            />
                            <div
                              className="smallTitle"
                              style={{
                                display: "flex",
                                gap: 10,
                                textTransform: "uppercase",
                              }}
                            >
                              <p>Executed on</p>
                              <p>(Date)</p>
                              <p>at</p>
                              <p>(Place)</p>
                              <p>signature of issuing Carrier or its Agent</p>
                            </div>
                          </div>
                        </div>
                        {/* row item (6) */}
                        <div className="collectItemRow collectItemRowSix">
                          <div className="collectItemLeft borderRight">
                            <div className="collectChart">
                              <div style={{ width: "100%" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    position: "relative",
                                  }}
                                  className="totalOtherChargesChargesAtDestination"
                                >
                                  {/* grap */}
                                  <div
                                    className="collectChartBox"
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <span className=" collectChartBoxItem collectChartBoxChargesAtDestination textTitle">
                                      Charges at Destination
                                    </span>
                                  </div>
                                  <div className="collectChartLeft borderRight">
                                    <p className="">
                                      For Carrier's use only at Destination
                                    </p>
                                  </div>
                                  <div className="collectChartRight">
                                    {isPrintViewMode ? (
                                      <>
                                        <p>
                                          {values?.chargesAtDestination
                                            ? values?.chargesAtDestination
                                              ?.split("\n")
                                              .map((item, index) => {
                                                return (
                                                  <>
                                                    {item}
                                                    <br />
                                                  </>
                                                );
                                              })
                                            : ""}
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        <div className="col-lg-12">
                                          <textarea
                                            name="chargesAtDestination"
                                            value={values?.chargesAtDestination}
                                            onChange={(e) => {
                                              setFieldValue(
                                                "chargesAtDestination",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="collectItemRight"
                            style={{ width: "100%" }}
                          >
                            <div className="collectChartBox">
                              <span className=" collectChartBoxItem collectChartBoxChargesAtDestination textTitle">
                                Charges at Destination
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default MasterHBAWModal;
