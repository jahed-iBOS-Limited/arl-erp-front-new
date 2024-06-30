import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ShippingPrint from "../shipping/shippingUnitView/shippingPrint";
const validationSchema = Yup.object().shape({});
function LoadingSlip() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  // eslint-disable-next-line no-unused-vars
  const [regDDL, getRegDDL, regDDLloader] = useAxiosGet();
  const [, getRegData, regDataLoader] = useAxiosGet();
  const [shipmentDDL, getShipmentDDL, shipmentDDLLoader] = useAxiosGet();
  const [showModal, setShowModal] = useState(false);
  const [clickRowData, setClickRowData] = useState({});
  return (
    <ICustomCard title="Loading Slip">
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            strCardNumber: "",
            shipment: "",
            entryCode: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
            <>
              {(regDDLloader || regDataLoader || shipmentDDLLoader) && (
                <Loading />
              )}
              <div className="row global-form">
                <div className="col-lg-3 d-flex">
                  <div style={{ width: "inherit" }}>
                    <InputField
                      id="cardNoInput"
                      autoFocus
                      value={values?.strCardNumber}
                      label="কার্ড নাম্বার"
                      name="strCardNumber"
                      type="text"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setFieldValue("entryCode", "");
                          setFieldValue("shipment", "");
                          document.getElementById(
                            "cardNoInput"
                          ).disabled = true;
                          getRegDDL(
                            `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumber&BusinessUnitId=${selectedBusinessUnit?.value}&search=${values?.strCardNumber}`,
                            (data) => {
                              if (data?.length > 0) {
                                getRegData(
                                  `/mes/MSIL/GetAllMSIL?PartName=SecondWeightEntryCodeDDL&BusinessUnitId=${selectedBusinessUnit?.value}&search=${data?.[0]?.label}`,
                                  (data) => {
                                    if (data.length > 0) {
                                      const entryCodeObj = data?.[0] || "";
                                      setFieldValue("entryCode", entryCodeObj);
                                      getShipmentDDL(
                                        `/mes/MSIL/GetAllMSIL?PartName=ShipmentByGetVehicleEntry&AutoId=${entryCodeObj?.value}`,
                                        (resData) => {
                                          if (resData?.length === 1) {
                                            setFieldValue(
                                              "shipment",
                                              resData?.[0] || ""
                                            );
                                            const firstShipment =
                                              resData?.[0] || {};
                                            setShowModal(true);
                                            setClickRowData({
                                              ...firstShipment,
                                              id: firstShipment?.value,
                                              shipmentCode:
                                                firstShipment?.label,
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              } else {
                                toast.warn("কার্ড নাম্বার সঠিক নয়");
                                setFieldValue("strCardNumber", "");
                                setFieldValue("entryCode", "");
                                setFieldValue("shipment", "");
                                document.getElementById(
                                  "cardNoInput"
                                ).disabled = false;
                                document.getElementById("cardNoInput").focus();
                              }
                            }
                          );
                        }
                      }}
                      onChange={(e) => {
                        setFieldValue("strCardNumber", e.target.value);
                      }}
                    />
                  </div>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "5px",
                      cursor: "pointer",
                      marginTop: "20px",
                    }}
                    onClick={() => {
                      setFieldValue("strCardNumber", "");
                      document.getElementById("cardNoInput").disabled = false;
                      document.getElementById("cardNoInput").focus();
                      resetForm();
                    }}
                  >
                    <i
                      style={{
                        color: "blue",
                      }}
                      className="fa fa-refresh"
                      aria-hidden="true"
                    ></i>
                  </span>
                </div>
                <div className="col-lg-3">
                  <label>রেজি. নং</label>
                  <SearchAsyncSelect
                    // isDisabled
                    selectedValue={values?.entryCode}
                    handleChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("entryCode", valueOption);
                        setFieldValue("shipment", "");
                        getShipmentDDL(
                          `/mes/MSIL/GetAllMSIL?PartName=ShipmentByGetVehicleEntry&AutoId=${valueOption?.value}`,
                          (resData) => {
                            if (resData?.length === 1) {
                              setFieldValue("shipment", resData?.[0] || "");
                              const firstShipment = resData?.[0] || {};
                              setShowModal(true);
                              setClickRowData({
                                ...firstShipment,
                                id: firstShipment?.value,
                                shipmentCode: firstShipment?.label,
                              });
                            }
                          }
                        );
                      } else {
                        setFieldValue("entryCode", "");
                      }
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return axios
                        .get(
                          `/mes/MSIL/GetAllMSIL?PartName=SecondWeightEntryCodeDDL&BusinessUnitId=${selectedBusinessUnit?.value}&search=${v}`
                        )
                        .then((res) => {
                          return res?.data;
                        })
                        .catch((err) => []);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipment"
                    options={shipmentDDL || []}
                    value={values?.shipment}
                    label="শিপমেন্ট নং"
                    onChange={(valueOption) => {
                      setFieldValue("shipment", valueOption);
                      setShowModal(true);
                      setClickRowData({
                        ...valueOption,
                        id: valueOption?.value,
                        shipmentCode: valueOption?.label,
                      });
                    }}
                  />
                </div>
              </div>

              <IViewModal
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                  setClickRowData({});
                }}
              >
                <ShippingPrint
                  id={clickRowData?.id}
                  shipmentCode={clickRowData?.shipmentCode}
                  state={clickRowData}
                />
              </IViewModal>
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
}

export default LoadingSlip;
