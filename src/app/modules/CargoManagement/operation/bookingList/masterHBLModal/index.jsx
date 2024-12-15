import { Form, Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import { convertNumberToWords } from "../../../../_helper/_convertMoneyToWord";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import logisticsLogo from "./logisticsLogo.png";
import "./style.css";

const validationSchema = Yup.object().shape({});
export default function MasterHBLModal({ selectedRow }) {
  // /domain/ShippingService/GetHBLList
  const [hblListData, getHBLList, isLoadingGetHBLList] = useAxiosPost();
  const [pickupPlaceDDL, setPickupPlaceDDL] = useState([]);
  const [portOfLoadingDDL, setPortOfLoadingDDL] = useState([]);
  const [finalDestinationAddressDDL, setFinalDestinationAddressDDL] = useState(
    []
  );
  const [portOfDischargeDDL, setPortOfDischargeDDL] = useState([]);
  const [vesselNameDDL, setVesselNameDDL] = useState([]);
  const [voyagaNoDDL, setVoyagaNoDDL] = useState([]);

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
        // pickupPlaceDDL
        const pickupPlace = data?.map((item, index) => {
          return {
            value: index + 1,
            label: item?.pickupPlace,
          };
        });
        setPickupPlaceDDL(pickupPlace);
        // portOfLoadingDDL
        const portOfLoading = data?.map((item, index) => {
          return {
            value: index + 1,
            label: item?.portOfLoading,
          };
        });
        setPortOfLoadingDDL(portOfLoading);

        // finalDestinationAddressDDL
        const finalDestinationAddress = data?.map((item, index) => {
          return {
            value: index + 1,
            label: item?.finalDestinationAddress,
          };
        });
        setFinalDestinationAddressDDL(finalDestinationAddress);

        // portOfDischargeDDL
        const portOfDischarge = data?.map((item, index) => {
          return {
            value: index + 1,
            label: item?.portOfDischarge,
          };
        });
        setPortOfDischargeDDL(portOfDischarge);
        // vesselNameDDL
        const vesselName = data?.map((item, index) => {
          return {
            value: index + 1,
            label: item?.transportPlanning?.vesselName || "",
          };
        });
        setVesselNameDDL(vesselName);

        // voyagaNoDDL
        const voyagaNo = data?.map((item, index) => {
          return {
            value: index + 1,
            label: item?.transportPlanning?.voyagaNo || "",
          };
        });
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
  const formikRef = React.useRef();
  const saveHandler = (values, cb) => {};
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
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 5,
                }}
              >
                <div className="col-lg-3">
                  <NewSelect
                    name="mblNumber"
                    options={[]}
                    value={values?.mblNumber}
                    label="MBL Number"
                    onChange={(valueOption) => {
                      let value = {
                        ...valueOption,
                        value: 0,
                        label: valueOption?.label || "",
                      };
                      setFieldValue("mblNumber", value);
                    }}
                    errors={errors}
                    touched={touched}
                    isCreatableSelect={true}
                  />
                </div>
                <div className="masterhblContainer">
                  <div className="airandConsigneeInfo">
                    <div className="top borderBottom">
                      <div className="leftSide borderRight">
                        <div className="shipperInfo borderBottom">
                          <img
                            src={logisticsLogo}
                            alt=""
                            style={{
                              height: 70,
                              width: "80%",
                              objectFit: "contain",
                            }}
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
                            <div className="col-lg-12">
                              <NewSelect
                                name="vesselName"
                                options={vesselNameDDL || []}
                                value={values?.vesselName}
                                label=""
                                onChange={(valueOption) => {
                                  let value = {
                                    ...valueOption,
                                    value: 0,
                                    label: valueOption?.label || "",
                                  };
                                  setFieldValue("vesselName", value);
                                }}
                                errors={errors}
                                touched={touched}
                                isCreatableSelect={true}
                              />
                            </div>
                          </div>
                          <div className="rightSide">
                            <p className="textTitle">Place of Receipt:</p>
                            {/* <p>{bookingData?.pickupPlace}</p> */}
                            <div className="col-lg-12">
                              <NewSelect
                                name="pickupPlace"
                                options={pickupPlaceDDL || []}
                                value={values?.pickupPlace}
                                label=""
                                onChange={(valueOption) => {
                                  let value = {
                                    ...valueOption,
                                    value: 0,
                                    label: valueOption?.label || "",
                                  };
                                  setFieldValue("pickupPlace", value);
                                }}
                                errors={errors}
                                touched={touched}
                                isCreatableSelect={true}
                              />
                            </div>
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
                            <div className="col-lg-12">
                              <NewSelect
                                name="voyagaNo"
                                options={voyagaNoDDL || []}
                                value={values?.voyagaNo}
                                label=""
                                onChange={(valueOption) => {
                                  let value = {
                                    ...valueOption,
                                    value: 0,
                                    label: valueOption?.label || "",
                                  };
                                  setFieldValue("voyagaNo", value);
                                }}
                                errors={errors}
                                touched={touched}
                                isCreatableSelect={true}
                              />
                            </div>
                          </div>
                          <div className="rightSide">
                            <p className="textTitle">Port of Loading:</p>
                            {/* <p> {bookingData?.portOfLoading}</p> */}
                            <div className="col-lg-12">
                              <NewSelect
                                name="portOfLoading"
                                options={portOfLoadingDDL || []}
                                value={values?.portOfLoading}
                                label=""
                                onChange={(valueOption) => {
                                  let value = {
                                    ...valueOption,
                                    value: 0,
                                    label: valueOption?.label || "",
                                  };
                                  setFieldValue("portOfLoading", value);
                                }}
                                errors={errors}
                                touched={touched}
                                isCreatableSelect={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rightSide">
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
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                {hblListData?.map((item, index) => {
                                  return (
                                    <span>
                                      {item?.hblNumber}
                                      {index < hblListData?.length - 1
                                        ? ","
                                        : ""}
                                    </span>
                                  );
                                })}
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
                          <h1 style={{ marginTop: 10, marginBottom: 10 }}>
                            ORIGINAL
                          </h1>
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Voluptatem nisi porro est labore laborum
                            consectetur, repellendus, dolorem perspiciatis
                            consequatur architecto ipsam velit eligendi esse.
                            Qui exercitationem laboriosam aliquam debitis
                            recusandae!
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
                          <div className="col-lg-12">
                            <NewSelect
                              name="portOfDischarge"
                              options={portOfDischargeDDL || []}
                              value={values?.portOfDischarge}
                              label=""
                              onChange={(valueOption) => {
                                let value = {
                                  ...valueOption,
                                  value: 0,
                                  label: valueOption?.label || "",
                                };
                                setFieldValue(
                                  "portOfLoportOfDischargeading",
                                  value
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              isCreatableSelect={true}
                            />
                          </div>
                        </div>
                        <div className="secondColumn">
                          <div className="item borderRight">
                            <p className="textTitle">Final Destination:</p>
                            {/* <p>{bookingData?.finalDestinationAddress}</p> */}
                            <div className="col-lg-12">
                              <NewSelect
                                name="finalDestinationAddress"
                                options={finalDestinationAddressDDL || []}
                                value={values?.finalDestinationAddress}
                                label=""
                                onChange={(valueOption) => {
                                  let value = {
                                    ...valueOption,
                                    value: 0,
                                    label: valueOption?.label || "",
                                  };
                                  setFieldValue(
                                    "finalDestinationAddress",
                                    value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                                isCreatableSelect={true}
                              />
                            </div>
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
                      <div className="thirdRow">
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
                                convertNumberToWords(
                                  totalNumberOfPackages
                                )}{" "}
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
                                          {rowItem?.dimensionRow?.map(
                                            (i, index) => {
                                              return (
                                                (i?.poNumber || "") +
                                                (index <
                                                rowItem?.dimensionRow?.length -
                                                  1
                                                  ? ","
                                                  : "")
                                              );
                                            }
                                          )}
                                        </p>
                                        <p>
                                          Color:{" "}
                                          {rowItem?.dimensionRow?.map(
                                            (i, index) => {
                                              return (
                                                (i?.color || "") +
                                                (index <
                                                rowItem?.dimensionRow?.length -
                                                  1
                                                  ? ","
                                                  : "")
                                              );
                                            }
                                          )}
                                        </p>
                                        <p>
                                          H.S Code:{" "}
                                          {(item?.hsCode || "") +
                                            (index <
                                            rowItem?.rowsData?.length - 1
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
                                        index < item?.objPurchase?.length - 1
                                          ? ","
                                          : ""
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
}
