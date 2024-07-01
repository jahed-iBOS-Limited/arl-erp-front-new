import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _currentTime } from "../../../_helper/_currentTime";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import QrCodeScanner from "./QRCodeScanner";
const initData = {
  strCardNumber: "",
  vehicleOutTime: "",
  vehicleOutTimeAfterLunch: "",
  intActionBy: "",
  dteActionDate: "",
  intStatus: "",
  intAutoId: "",
  intReferenceId: "",
  businessUnit: "",
};
const GetOutByCard = () => {
  const [objProps, setObjprops] = useState({});
  const [QRCodeScanner, setQRCodeScanner] = useState(false);
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [data, getData, dataLoader, setData] = useAxiosGet();
  const [afterLunch, setAfterLunch] = useState(true);
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
    }
  }, [selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    if (!values?.businessUnit) {
      return toast.warn("Please Select Business Unit");
    }
    if (values?.vehicleOutTime === "") {
      return toast.warn("Please Select Vehicle Out Time");
    }
    saveData(
      `/mes/MSIL/VehicleGateOutCreate`,
      {
        vehicleOutTime:
          data[0]?.intReferenceTypeId === 3 && afterLunch
            ? null
            : values?.vehicleOutTime,
        vehicleOutTimeAfterLunch:
          data[0]?.intReferenceTypeId === 3 && afterLunch
            ? values?.vehicleOutTime
            : null,
        intBusinessUnitId: values?.businessUnit?.value,
        intActionBy: profileData?.userId,
        dteActionDate: _todayDate(),
        intStatus: data[0]?.intReferenceTypeId,
        intAutoId: data[0]?.intAutoId,
        intReferenceId: data[0]?.intReferenceId,
      },
      cb,
      true
    );
  };

  const qurScanHandler = ({ setFieldValue, values }) => {
    setFieldValue("vehicleOutTime", _currentTime());
    document.getElementById("cardNoInput").disabled = true;
    getData(
      `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForGateOut&BusinessUnitId=${values?.businessUnit?.value}&search=${values?.strCardNumber}`,
      (data) => {
        if (data?.length <= 0) {
          setFieldValue("strCardNumber", "");
          toast.warn("Vehicle entry not found");
          document.getElementById("cardNoInput").disabled = false;
          document.getElementById("cardNoInput").focus();
        }
      }
    );
  };
  return (
    <IForm title="Gate Out By Card" getProps={setObjprops}>
      {(dataLoader || saveDataLoader) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("businessUnit", valueOption);
                            setFieldValue("strCardNumber", "");
                            setFieldValue("vehicleOutTime", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          } else {
                            setFieldValue("businessUnit", "");
                            setFieldValue("strCardNumber", "");
                            setFieldValue("vehicleOutTime", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          }
                        }}
                      />
                    </div>
                    <div
                      className="col-lg-3 d-flex"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          cursor: "pointer",
                          color: "blue",
                          zIndex: '9999'
                        }}
                        onClick={() => {
                          setQRCodeScanner(true);
                        }}
                      >
                        QR Code <i class="fa fa-qrcode" aria-hidden="true"></i>
                      </div>
                      <div style={{ width: "inherit" }}>
                        <InputField
                          id="cardNoInput"
                          autoFocus
                          value={values?.strCardNumber}
                          label="Get Entry Card No"
                          name="strCardNumber"
                          type="text"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              setFieldValue("vehicleOutTime", _currentTime());
                              document.getElementById(
                                "cardNoInput"
                              ).disabled = true;
                              getData(
                                `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForGateOut&BusinessUnitId=${values?.businessUnit?.value}&search=${values?.strCardNumber}`,
                                (data) => {
                                  if (data?.length <= 0) {
                                    setFieldValue("strCardNumber", "");
                                    toast.warn("Vehicle entry not found");
                                    document.getElementById(
                                      "cardNoInput"
                                    ).disabled = false;
                                    document
                                      .getElementById("cardNoInput")
                                      .focus();
                                  }
                                }
                              );
                            } else {
                              document.getElementById(
                                "cardNoInput"
                              ).disabled = false;
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
                          setData([]);
                          setFieldValue("strCardNumber", "");
                          setFieldValue("vehicleOutTime", "");
                          document.getElementById(
                            "cardNoInput"
                          ).disabled = false;
                          document.getElementById("cardNoInput").focus();
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
                      <InputField
                        value={values?.vehicleOutTime}
                        label="Out Time"
                        name="vehicleOutTime"
                        type="time"
                        onChange={(e) => {
                          setFieldValue("vehicleOutTime", e.target.value);
                        }}
                      />
                    </div>

                    {data[0]?.intReferenceTypeId === 3 ? (
                      <div className="col-lg-3 d-flex align-items-center mt-5">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          name="outSlot"
                          id="isComplete"
                          checked={afterLunch}
                          onChange={(e) => {
                            setAfterLunch(!afterLunch);
                          }}
                        />
                        <label htmlFor="isComplete" className="pl-1 pointer">
                          After Lunch
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div
                  style={{
                    width: "80%",
                    margin: "0 auto",
                  }}
                  className="row mt-5"
                >
                  <div className="col-lg-12 mb-5 text-center">
                    <h1>Delivery Details</h1>
                  </div>
                  {data?.length > 0 && (
                    <>
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="w-100">
                            <tbody className="text-left">
                              <tr className="mb-3">
                                <td className="text-left">
                                  <h6>Entry Date</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>
                                    {_dateFormatter(data?.[0]?.entryDate)}
                                  </h6>
                                </td>
                              </tr>
                              <tr className="mb-3">
                                <td className="text-left">
                                  <h6>Entry Code</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.strEntryCode}</h6>
                                </td>
                              </tr>
                              <tr className="mb-3">
                                <td className="text-left">
                                  <h6>Client Type Name</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.strClientTypeName}</h6>
                                </td>
                              </tr>
                              <tr className="mb-3">
                                <td className="text-left">
                                  <h6>Truck Number</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.strTruckNumber}</h6>
                                </td>
                              </tr>
                              <tr className="mb-3">
                                <td className="text-left">
                                  <h6>Driver Name</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.strDriverName}</h6>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="w-100">
                            <tbody className="text-left">
                              <tr>
                                <td className="text-left">
                                  <h6>Driver Mobile No</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.strDriverMobileNo}</h6>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-left">
                                  <h6>In Time</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.tmInTime}</h6>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-left">
                                  <h6>Shift Incharge</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.strShiftIncharge}</h6>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-left">
                                  <h6>Net Weight</h6>
                                </td>
                                <td>
                                  <h6>:</h6>
                                </td>
                                <td>
                                  <h6>{data?.[0]?.netWeight}</h6>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onClick={() =>
                    saveHandler(values, () => {
                      resetForm();
                      setData([]);
                      document.getElementById("cardNoInput").disabled = false;
                      document.getElementById("cardNoInput").focus();
                    })
                  }
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
              {QRCodeScanner && (
                <>
                  <IViewModal
                    show={QRCodeScanner}
                    onHide={() => {
                      setQRCodeScanner(false);
                    }}
                  >
                    <QrCodeScanner
                      QrCodeScannerCB={(result) => {
                        setFieldValue("strCardNumber", result);
                        setQRCodeScanner(false);
                        qurScanHandler({
                          setFieldValue,
                          values: {
                            ...values,
                            strCardNumber: result,
                          },
                        });
                      }}
                    />
                  </IViewModal>
                </>
              )}
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
};

export default GetOutByCard;
