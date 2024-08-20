import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICustomTable from "../../../_helper/_customTable";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import QRCodeScanner from "../../../_helper/qrCodeScanner";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import IButton from "../../../_helper/iButton";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  shipmentId: "",
  shipmentCode: "",
  shippingPoint: "",
  vehicleNumber: "",
  driver: "",
  deliveryDate: "",
  packerName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const headers_one = ["SL", "Item", "UoM", "Quantity"];
const headers_two = [
  "SL",
  "Shipment Code",
  "Route Name",
  "Transport Name",
  "Provider Type",
  "Shipping Type",
  "Vehicle",
  "Total Qty",
];

export default function PackerInformation() {
  const [objProps, setObjprops] = useState({});
  const [reportData, getReportData, loading, setReportData] = useAxiosGet();
  const [, onComplete, loader] = useAxiosPost();
  const [shipmentId, setShipmentId] = useState(null);
  const [isQrCodeShow, setIsQRCodeSHow] = useState(false);
  const [actionType, setActionType] = useState("Manual");
  const [rowData, getRowData, rowLoading, setRowData] = useAxiosGet();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  // const saveHandler = (values, cb) => {
  //   alert("Working...");
  // };

  const getData = (values, _pageNo = 0, _pageSize = 300) => {
    getRowData(
      `/oms/LoadingPoint/GetPackerLoadingConfirmation?isTransferChallan=false&statusId=${values?.type?.value}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}`
    );
  };

  const isLoading = loader || loading || rowLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      // onSubmit={(values, { resetForm }) => {
      //   saveHandler(values, () => {
      //     resetForm(initData);
      //   });
      // }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue, setValues }) => (
        <>
          {isLoading && <Loading />}
          <IForm
            title="Packer Information"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {![1, 2].includes(values?.type?.value) &&
                    !reportData?.objHeader?.isLoaded && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={
                          !reportData?.objHeader?.shipmentId && !shipmentId
                        }
                        onClick={() => {
                          if (selectedBusinessUnit?.value !== 4) {
                            return toast.warn(
                              "Only Business Unit Cement is Permitted !!!"
                            );
                          }
                          if (reportData?.objHeader?.isLoaded) {
                            return toast.warn("Already Completed");
                          }
                          onComplete(
                            `/oms/LoadingPoint/CompletePacker?shipmentId=${reportData?.objHeader?.shipmentId}&actionBy=${profileData?.userId}&typeId=2`,

                            // actionType === "Auto"
                            //   ? shipmentId
                            //   : reportData?.objHeader?.shipmentId
                            null,
                            () => {
                              resetForm(initData);
                              setShipmentId(null);
                            },
                            true
                          );
                        }}
                      >
                        Complete
                      </button>
                    )}
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Loading Pending" },
                      { value: 3, label: "QR Code/Card Scan" },
                      { value: 2, label: "Loading Completed" },
                    ]}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      setRowData([]);
                      setReportData({});
                    }}
                    placeholder="Type"
                  />
                </div>
                {[1, 2].includes(values?.type?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                        value={values?.shipPoint}
                        label="ShipPoint"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                        }}
                        placeholder="ShipPoint"
                      />
                    </div>
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <IButton
                      onClick={() => {
                        getData(values);
                      }}
                    />
                  </>
                )}

                {[3].includes(values?.type?.value) && (
                  <>
                    <div className="col-lg-4 mb-2 mt-5">
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="actionType"
                          checked={actionType === "Manual"}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(e) => {
                            setActionType("Manual");
                            setValues({ ...initData, type: values?.type });

                            setShipmentId(null);
                            setReportData({});
                          }}
                        />
                        By Card Number
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="actionType"
                          checked={actionType === "Auto"}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(e) => {
                            setActionType("Auto");
                            setValues({ ...initData, type: values?.type });
                            setShipmentId(null);
                            setReportData({});
                          }}
                        />
                        By QR Code
                      </label>
                    </div>
                    {reportData?.objHeader?.isLoaded && (
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                        className="text-danger"
                      >
                        Packer Completed
                      </p>
                    )}
                    <div className="col-lg-12"></div>
                    {["Auto"].includes(actionType) ? (
                      <div className="col-lg-3">
                        <div style={{ display: "inline-block", width: "95%" }}>
                          <InputField
                            value={shipmentId}
                            label="Card Id"
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
                          label="Card Number"
                          name="shipmentCode"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("shipmentCode", e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              setFieldValue("shipmentCode", e.target.value);
                              getReportData(
                                // `/wms/Delivery/GetDeliveryPrintInfoManual?businessUnitId=${selectedBusinessUnit?.value}&shipmentCode=${e.target.value}`,
                                `/wms/Delivery/GetDeliveryPrintInfoByVehicleCardNumber?strCardNumber=${e.target.value}`,
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
                                    "deliveryDate",
                                    _dateFormatter(
                                      res?.objHeader?.pricingDate
                                    ) || ""
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
                        value={values?.deliveryDate}
                        label="Delivery Date"
                        name="deliveryDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("deliveryDate", e.target.value);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

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
                      // `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${+result}`,
                      `/wms/Delivery/GetDeliveryPrintInfoByVehicleCardNumber?strCardNumber=${result}`,
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
                          "deliveryDate",
                          _dateFormatter(res?.objHeader?.pricingDate) || ""
                        );
                      }
                    );
                  }}
                />
              </IViewModal>

              {(reportData?.objRow?.length > 0 ||
                rowData?.data?.length > 0) && (
                <ICustomTable
                  ths={
                    [1, 2].includes(values?.type?.value)
                      ? headers_two
                      : headers_one
                  }
                >
                  {[3].includes(values?.type?.value)
                    ? reportData?.objRow?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.uomName}</td>
                            <td className="text-right">{item?.quantity}</td>
                          </tr>
                        );
                      })
                    : rowData?.data?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.shipmentCode}</td>
                            <td>{item?.routeName}</td>
                            <td>{item?.transportModeName}</td>
                            <td>{item?.strOwnerType}</td>
                            <td>{item?.shippingTypeName}</td>
                            <td>{item?.vehicleName}</td>
                            <td className="text-right">{item?.itemTotalQty}</td>
                          </tr>
                        );
                      })}
                  <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                    <td
                      colSpan={[1, 2].includes(values?.type?.value) ? 7 : 3}
                      className="text-right"
                    >
                      Total
                    </td>
                    {[1, 2].includes(values?.type?.value) ? (
                      <td>
                        {rowData?.data?.reduce(
                          (total, curr) => (total += curr?.itemTotalQty),
                          0
                        )}
                      </td>
                    ) : (
                      <td>
                        {reportData?.objRow?.reduce(
                          (total, curr) => (total += curr?.quantity),
                          0
                        )}
                      </td>
                    )}
                  </tr>
                </ICustomTable>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
