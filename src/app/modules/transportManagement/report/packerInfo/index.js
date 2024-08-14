import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import QRCodeScanner from "../../../_helper/qrCodeScanner";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";

const initData = {
  shipmentId: "",
  shipmentCode: "",
  shippingPoint: "",
  vehicleNumber: "",
  driver: "",
  delliveryDate: "",
  packerName: "",
};

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function PackerInfo() {
  const [objProps, setObjprops] = useState({});
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [reportData, getReportData] = useAxiosGet();
  const [, onComplete, loader] = useAxiosPost();
  const [shipmentId, setShipmentId] = useState(null);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  const [isQrCodeShow, setIsQRCodeSHow] = useState(false);
  const [actionType, setActionType] = useState("Auto");
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
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
          {loader && <Loading />}
          <IForm
            title="Packer Info"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (selectedBusinessUnit?.value !== 4) {
                        return toast.warn(
                          "Only Business Unit Cement is Permitted !!!"
                        );
                      }
                      onComplete(
                        `/oms/LoadingPoint/CompletePacker?shipmentId=${
                          actionType === "Auto"
                            ? shipmentId
                            : reportData?.objHeader?.shipmentId
                        }`,
                        null,
                        () => {
                          resetForm(initData);
                        },
                        true
                      );
                    }}
                  >
                    Complete
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="col-lg-4 mb-2 mt-5">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "Auto"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setActionType("Auto");
                        resetForm(initData);
                      }}
                    />
                    Auto
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "Manual"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setActionType("Manual");
                        resetForm(initData);
                      }}
                    />
                    Manual
                  </label>
                </div>
                <div className="form-group  global-form row">
                  {["Auto"].includes(actionType) ? (
                    <div className="col-lg-3">
                      <div style={{ display: "inline-block", width: "95%" }}>
                        <InputField
                          value={shipmentId}
                          label="Shipment Id"
                          name="shipmentId"
                          type="text"
                          disabled
                        />
                      </div>
                      <span
                        className="pl-1"
                        style={{ display: "inline-block" }}
                      >
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQRCodeSHow(true);
                          }}
                          style={{ color: "blue", cursor: "pointer" }}
                          class="fa fa-qrcode"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>
                  ) : (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.shipmentCode}
                        label="Shipment Code"
                        name="shipmentCode"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("shipmentCode", e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            setFieldValue("shipmentCode", e.target.value);
                            getReportData(
                              `/wms/Delivery/GetDeliveryPrintInfoManual?businessUnitId=${selectedBusinessUnit?.value}&shipmentCode=${e.target.value}`,
                              (res) => {
                                setFieldValue(
                                  "shippingPoint",
                                  res?.objHeader?.shipPointName || ""
                                );
                                setFieldValue(
                                  "vehicleNumber",
                                  res?.objHeader?.strVehicleName || ""
                                );
                                setFieldValue(
                                  "driver",
                                  res?.objHeader?.driverName || ""
                                );
                                setFieldValue(
                                  "packerName",
                                  res?.objHeader?.packerName || ""
                                );
                                setFieldValue(
                                  "delliveryDate",
                                  _dateFormatter(res?.objHeader?.pricingDate) ||
                                    ""
                                );
                              }
                            );
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="col-lg-3">
                    <InputField
                      value={values?.shippingPoint}
                      label="Shipping Point"
                      name="shippingPoint"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("shippingPoint", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.vehicleNumber}
                      label="Vehicle Number"
                      name="vehicleNumber"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("vehicleNumber", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.driver}
                      label="Driver"
                      name="driver"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("driver", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.packerName}
                      label="Packer Name"
                      name="packerName"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("packerName", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.delliveryDate}
                      label="Delivery Date"
                      name="delliveryDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("delliveryDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              <IViewModal
                show={isQrCodeShow}
                onHide={() => setIsQRCodeSHow(false)}
              >
                <QRCodeScanner
                  QrCodeScannerCB={(result) => {
                    setIsQRCodeSHow(false);
                    setShipmentId(result);
                    getReportData(
                      `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${result}`,
                      (res) => {
                        setFieldValue(
                          "shippingPoint",
                          res?.objHeader?.shipPointName || ""
                        );
                        setFieldValue(
                          "vehicleNumber",
                          res?.objHeader?.strVehicleName || ""
                        );
                        setFieldValue(
                          "driver",
                          res?.objHeader?.driverName || ""
                        );
                        setFieldValue(
                          "packerName",
                          res?.objHeader?.packerName || ""
                        );
                        setFieldValue(
                          "delliveryDate",
                          _dateFormatter(res?.objHeader?.pricingDate) || ""
                        );
                      }
                    );
                  }}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
