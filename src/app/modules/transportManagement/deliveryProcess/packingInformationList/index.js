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
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import IButton from "../../../_helper/iButton";
import { _todayDate } from "../../../_helper/_todayDate";
import InfoCircle from "../../../_helper/_helperIcons/_infoCircle";
import ShippingInfoDetails from "../storeInformationList/shippingNote";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";

const initData = {
  type: { value: 1, label: "Loading In Progress" },
  shipmentId: "",
  shipmentCode: "",
  shippingPoint: "",
  vehicleNumber: "",
  driver: "",
  deliveryDate: "",
  packerName: "",
  tlm: "",
  viewType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const headers_one = ["SL", "Item", "Bag Type", "UoM", "Quantity"];
const headers_two = [
  "SL",
  "Shipment Code",
  "Vehicle",
  "Bag Type",
  "Total Qty",
  "UoM",
  "Route Name",
  "Transport Name",
  "Provider Type",
  "Shipping Type",
  "TLM",
  "Bursting Qty",
  "Actions",
];

export default function PackingInformationList() {
  const [objProps, setObjprops] = useState({});
  const [reportData, getReportData, loading, setReportData] = useAxiosGet();
  const [, onComplete, loader] = useAxiosPost();
  const [shipmentId, setShipmentId] = useState(null);
  const [isQrCodeShow, setIsQRCodeSHow] = useState(false);
  const [actionType, setActionType] = useState("Manual");
  const [rowData, getRowData, rowLoading, setRowData] = useAxiosGet();
  const [open, setOpen] = useState(false);
  const [singleItem, setSingleItem] = useState({});
  const [showReport, setShowReport] = useState(false);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
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
      `/oms/LoadingPoint/GetPackingSupervisorConfirmation?isTransferChallan=false&statusId=${values?.type?.value}&accountId=${accId}&businessUnitId=${buId}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}` // `/oms/LoadingPoint/GetPackerLoadingConfirmation?isTransferChallan=false&statusId=${values?.type?.value}&accountId=${accId}&businessUnitId=${buId}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}`
      // `/oms/LoadingPoint/GetStoreLoadingConfirmation?isTransferChallan=false&statusId=${values?.type?.value}&accountId=${accId}&businessUnitId=${buId}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&pageNo=${_pageNo}&pageSize=${_pageSize}`
    );
  };

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `fe886d74-87ab-42e5-8695-b4be96e51aca`;
  const parameterValues = (values) => {
    const shiftWisePackerInformation = [
      { name: "fromdate", value: `${values?.fromDate}` },
      { name: "todate", value: `${values?.toDate}` },
      { name: "ViewType", value: `${+values?.viewType?.value}` },
      { name: "unitid", value: `${+buId}` },
      { name: "intShippoint", value: `${values?.shipPoint?.value}` },
    ];

    return shiftWisePackerInformation;
  };

  const isLoading = loader || loading || rowLoading;

  const receiveHandler = (values, item) => {
    onComplete(
      `/oms/LoadingPoint/CompletePacker?shipmentId=${item?.shipmentId}&actionBy=${userId}&typeId=3`,
      null,
      () => {
        getData(values);
      },
      true
    );
  };

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
            title="Packing Information"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {!reportData?.objHeader?.isLoaded && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        (!reportData?.objHeader?.shipmentId && !shipmentId) ||
                        !values?.tlm
                      }
                      onClick={() => {
                        if (reportData?.objHeader?.isLoaded) {
                          return toast.warn("Already Completed");
                        }
                        onComplete(
                          `/oms/LoadingPoint/CompletePacker?shipmentId=${reportData?.objHeader?.shipmentId}&actionBy=${userId}&typeId=1&tlm=${values?.tlm?.value}`,

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
                      { value: 1, label: "Loading In Progress" },
                      // { value: 3, label: "Scan Card/QR Code" },
                      // { value: 2, label: "Loading Completed" },
                      { value: 4, label: "Shift wise Packer Information" },
                    ]}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      setRowData([]);
                      setReportData({});
                      setShowReport(false);
                    }}
                    placeholder="Type"
                  />
                </div>
                {[1, 2, 4].includes(values?.type?.value) && (
                  <>
                    {[1, 2, 4].includes(values?.type?.value) && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: "All" },
                            ...shipPointDDL,
                          ]}
                          value={values?.shipPoint}
                          label="ShipPoint"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          placeholder="ShipPoint"
                        />
                      </div>
                    )}
                    {[4].includes(values?.type?.value) && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="viewType"
                          options={[
                            { value: 1, label: "Top Sheet" },
                            { value: 2, label: "Details" },
                          ]}
                          value={values?.viewType}
                          label="View Type"
                          onChange={(valueOption) => {
                            setFieldValue("viewType", valueOption);
                            setShowReport(false);
                          }}
                          placeholder="View Type"
                        />
                      </div>
                    )}
                    <FromDateToDateForm
                      obj={{
                        values,
                        setFieldValue,
                        type: "datetime-local",
                        step: [4].includes(values?.type?.value) ? 1 : false,
                        onChange: () => {
                          setShowReport(false);
                        },
                      }}
                    />
                    <IButton
                      onClick={() => {
                        if (values?.type?.value === 4) {
                          setShowReport(true);
                        } else {
                          setShowReport(false);
                          getData(values);
                        }
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
                    <div className="col-lg-3">
                      <NewSelect
                        name="tlm"
                        options={[
                          { value: 1, label: "TLM-1" },
                          { value: 2, label: "TLM-2" },
                          { value: 3, label: "TLM-3" },
                          { value: 4, label: "TLM-4" },
                          { value: 5, label: "TLM-5" },
                          { value: 6, label: "TLM-6" },
                        ]}
                        value={values?.tlm}
                        label="TLM"
                        onChange={(valueOption) => {
                          setFieldValue("tlm", valueOption);
                        }}
                        placeholder="TLM"
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
                            <td>{item?.bagType}</td>
                            <td>{item?.uomName}</td>
                            <td className="text-right">{item?.quantity}</td>
                          </tr>
                        );
                      })
                    : rowData?.data?.map((item, index) => {
                        return (
                          <tr
                            style={{
                              backgroundColor: `${
                                item?.bagType === "Pasting"
                                  ? "#57d557c2"
                                  : item?.bagType === "Sewing"
                                  ? "#6cbbe7de"
                                  : item?.bagType === "MES PCC"
                                  ? "#bb8ef2f0"
                                  : ""
                              }`,
                            }}
                          >
                            <td>{index + 1}</td>
                            <td>{item?.shipmentCode}</td>
                            <td>{item?.vehicleName}</td>
                            <td>{item?.bagType}</td>
                            <td className="text-right">{item?.itemTotalQty}</td>
                            <td>{item?.shippingTypeId === 9 ? "Ton" : ""}</td>
                            <td>{item?.routeName}</td>
                            <td>{item?.transportModeName}</td>
                            <td>{item?.strOwnerType}</td>
                            <td>{item?.shippingTypeName}</td>
                            <td>{item?.tlm}</td>
                            <td>{item?.brustingQuantity}</td>
                            <td
                              className="text-center"
                              style={{ backgroundColor: "#e0ffff" }}
                            >
                              <div className="d-flex justify-content-around">
                                <button
                                  className="btn btn-info btn-sm px-2"
                                  type="button"
                                  onClick={() => {
                                    receiveHandler(values, item);
                                  }}
                                >
                                  Received
                                </button>

                                <InfoCircle
                                  title={"Shipment Details"}
                                  clickHandler={() => {
                                    setSingleItem(item);
                                    setOpen(true);
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                    <td
                      colSpan={4}
                      // colSpan={[1, 2].includes(values?.type?.value) ? 9 : 4}
                      className="text-right"
                    >
                      Total
                    </td>
                    {[1, 2].includes(values?.type?.value) ? (
                      <>
                        <td>
                          {rowData?.data?.reduce(
                            (total, curr) => (total += curr?.itemTotalQty),
                            0
                          )}
                        </td>
                        <td colSpan={9}></td>
                      </>
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
              <IViewModal show={open} onHide={() => setOpen(false)}>
                <ShippingInfoDetails
                  obj={{
                    id: singleItem?.shipmentId,
                    shipmentCode: singleItem?.shipmentCode,
                    tlm: singleItem?.tlm,
                    setOpen,
                    getData,
                    values,
                    isActionable: false,
                  }}
                />
              </IViewModal>
              {showReport && (
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
