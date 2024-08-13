import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import QRCodeScanner from "../../../_helper/qrCodeScanner";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  shipmentId: "",
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
  const [, onComplete] = useAxiosPost();
  const [shipmentId, setShipmentId] = useState(null);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  const [isQrCodeShow, setIsQRCodeSHow] = useState(false);
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
          {false && <Loading />}
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
                      if (!shipmentId) {
                        return toast.warn("Required Shipment Id");
                      }
                      onComplete(
                        `/oms/LoadingPoint/CompletePacker?shipmentId=${shipmentId}`
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
                <div className="form-group  global-form row">
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
                    <span className="pl-1" style={{ display: "inline-block" }}>
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
                      type="number"
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
                    setFieldValue(
                      "shippingPoint",
                      result?.objHeader?.shipPointName || ""
                    );
                    setFieldValue(
                      "vehicleNumber",
                      result?.objHeader?.strVehicleName || ""
                    );
                    setFieldValue(
                      "driver",
                      result?.objHeader?.driverName || ""
                    );
                    setFieldValue(
                      "packerName",
                      result?.objHeader?.packerName || ""
                    );
                    setFieldValue(
                      "delliveryDate",
                      result?.objHeader?.pricingDate || ""
                    );

                    getReportData(
                      `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${result}`
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
