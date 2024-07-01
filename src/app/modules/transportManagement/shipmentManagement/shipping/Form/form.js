/* eslint-disable jsx-a11y/no-distracting-elements */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ICalendar from "../../../../_helper/_inputCalender";
import { ISelect } from "../../../../_helper/_inputDropDown";
import Loading from "./../../../../_helper/_loading";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
import axios from "axios";
import { Input } from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  GetPendingDeliveryDDLAction,
  getDeliveryItemVolumeInfoAction,
  getDeliveryeDatabyId,
  getStockStatusOnShipmentAction,
  getVehicleNo_action,
} from "../_redux/Actions";
import { getItemListForChallan, getTransportStatusAndInfo } from "../helper";
import ShipmentDetailsInfo from "../shippingUnitView/shipmentDetails";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import NewSelect from "./../../../../_helper/_select";
import { getLoadingPointDDLAction } from "./../_redux/Actions";
import ChallanItemsPreview from "./itemsPreview";
import QRCodeScanner from "../../../../_helper/qrCodeScanner";
// import InputField from "../../../../_helper/_inputField";
// Validation schema
const validationSchema = Yup.object().shape({
  Vehicle: Yup.object().shape({
    label: Yup.string().required("Vehicle is required"),
    value: Yup.string().required("Vehicle is required"),
  }),
  route: Yup.object().shape({
    label: Yup.string().required("route is required"),
    value: Yup.string().required("route is required"),
  }),

  transportZone: Yup.object().shape({
    label: Yup.string().required("Transport Zone is required"),
    value: Yup.string().required("Transport Zone is required"),
  }),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Ship Point is required"),
    value: Yup.string().required("Ship Point is required"),
  }),

  loadingPoint: Yup.object().shape({
    label: Yup.string().required("Loading Point is required"),
    value: Yup.string().required("Loading Point is required"),
  }),
  pendingDelivery: Yup.object().shape({
    label: Yup.string().required("Pending Delivery is required"),
    value: Yup.string().required("Pending Delivery is required"),
  }),
  supplierName: Yup.object().when("Vehicle", (Vehicle, Schema) => {
    if (Vehicle?.isRental)
      return Schema.required("Vehicle Supplier Name is required");
  }),
  laborSupplierName: Yup.object().when(
    "isLaborImpart",
    (isLaborImpart, Schema) => {
      if (isLaborImpart?.value)
        return Schema.required("Labor/Handling Supplier Name is required");
    }
  ),
  shipmentdate: Yup.date().required("Shipment Date required"),

  estimatedTimeofArrival: Yup.date().required(
    "Estimated Time of Arrival required"
  ),
});
const validationSchemaEdit = Yup.object().shape({
  lastDistance: Yup.number()
    .min(0, "Minimum 0 strings")
    .max(1000000, "Maximum 1000000 strings")
    .required("Last Distance is required"),

  Vehicle: Yup.object().shape({
    label: Yup.string().required("Vehicle is required"),
    value: Yup.string().required("Vehicle is required"),
  }),
  route: Yup.object().shape({
    label: Yup.string().required("route is required"),
    value: Yup.string().required("route is required"),
  }),

  shipmentdate: Yup.date().required("Shipment Date required"),
  supplierName: Yup.object().when("Vehicle", (Vehicle, Schema) => {
    if (Vehicle?.isRental) return Schema.required("Supplier Name is required");
  }),
  estimatedTimeofArrival: Yup.date().required(
    "Estimated Time of Arrival required"
  ),
  transportZone: Yup.object().shape({
    label: Yup.string().required("Transport Zone is required"),
    value: Yup.string().required("Transport Zone is required"),
  }),
  laborSupplierName: Yup.object().when(
    "isLaborImpart",
    (isLaborImpart, Schema) => {
      if (isLaborImpart?.value)
        return Schema.required("Labor Supplier Name is required");
    }
  ),
});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  plantDDL,
  ShipmentTypeDDL,
  salesOrgDDL,
  distributionChannelDDL,
  salesOfficeDDL,
  soldToPartyDDL,
  addBtnHandler,
  headerData,
  PendingDeliveryDDL,
  remover,
  vehicleSingeDataView,
  vehicleSingleData,
  accId,
  buId,
  loadingPointDDL,
  ShippointDDL,
  vehicleNo,
  routeListDDL,
  setCostlaborRateStatus,
  isSubsidyRunning,
  setDisabled,
  deliveryeDatabydata,
}) {
  const [QRCodeScannerModal, setQRCodeScannerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [controls, setControls] = useState([]);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [transportStatus, setTransportStatus] = useState([]);
  const [, getEntryCodeDDL, entryCodeDDLloader] = useAxiosGet();
  const [pumpDDL, getPumpDDL, , setPumpDDL] = useAxiosGet();
  const [, getVehicleEntryDDL, vehicleEntryDDLloader] = useAxiosGet();
  const [shipmentDetailInfo, getShipmentDetailInfo, loader] = useAxiosGet();
  // const [, getVehicleForReadyMix] = useAxiosGet();
  const [
    vehicleDDL,
    getVehicleDDL,
    isLoadingVehicleDDL,
    setVehicleDDL,
  ] = useAxiosGet();
  const dispatch = useDispatch();
  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setControls([
      {
        label: "Select Ship Point",
        name: "shipPoint",
        options: ShippointDDL,
        value: initData.shipPoint,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          dispatch(GetPendingDeliveryDDLAction(currentValue, buId, accId));
          dispatch(getLoadingPointDDLAction(accId, buId, currentValue));
          setter("loadingPoint", "");
          setter("pendingDelivery", "");
        },
      },
      {
        label: "Get Entry Card No",
        name: "strCardNo",
        value: initData.strCardNo,
        type: "cardInput",
        isDisabled: isEdit,
      },
      {
        label: "Gate Entry Code",
        name: "veichleEntry",
        value: initData.veichleEntry,
        type: "asyncSelect",
        isDisabled: isEdit,
      },
      {
        label: "Select Vehicle",
        name: "Vehicle",
        options: vehicleDDL,
        value: initData.Vehicle,
        isDisabled: isEdit ? false : rowDto?.length,
        dependencyFunc: (currentValue, values, setter, label, valueOption) => {
          vehicleSingeDataView(label, accId, buId, setter);
          setter("supplierName", "");
          setter("laborSupplierName", "");

          // if isGateMaintain true and  buidId (175) than veichleEntry data found
          const veichleEntry = valueOption?.strEntryCode
            ? {
                value: valueOption?.intEntryId,
                label: valueOption?.strEntryCode,
              }
            : "";
          setter("veichleEntry", veichleEntry);
        },
      },
      {
        label: "Select Route",
        name: "route",
        options: routeListDDL || [],
        value: initData.route,
        isDisabled: !routeListDDL?.length,
      },
      {
        label: "Loading Point",
        name: "loadingPoint",
        options: loadingPointDDL,
        value: initData.loadingPoint,
        isDisabled: isEdit,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ShippointDDL,
    vehicleDDL,
    ShipmentTypeDDL,
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    salesOfficeDDL,
    soldToPartyDDL,
    loadingPointDDL,
    routeListDDL,
    rowDto,
  ]);

  const isGateMaintain = shippointDDL?.find(
    (i) => i.value === headerData?.pgiShippoint?.value
  )?.isGateMaintain;

  useEffect(() => {
    if (vehicleDDL?.length > 0 && document.getElementById("cardNoInput")) {
      document.getElementById("cardNoInput").focus();
    }
  }, [vehicleDDL]);

  const formikRef = React.useRef(null);
  useEffect(() => {
    if (isGateMaintain && buId === 175) {
      const partName = "GetAvailableVehicleForReadyMixShipment";
      getVehicleDDL(
        `/mes/MSIL/GetAllMSIL?PartName=${partName}&BusinessUnitId=${buId}`,
        (resData) => {
          const modifyData = resData?.map((item) => {
            return {
              ...item,
              driverName: item?.strDriverName,
            };
          });
          setVehicleDDL(modifyData);

          if (formikRef.current) {
            // modifyData lest index data set
            const vehicle = modifyData[modifyData?.length - 1];
            formikRef.current.setFieldValue(
              "Vehicle",
              vehicle?.value ? vehicle : ""
            );
            vehicleSingeDataView(
              vehicle?.label,
              accId,
              buId,
              formikRef.current.setFieldValue
            );
            // if isGateMaintain true and  buidId (175) than veichleEntry data found
            const veichleEntry = vehicle?.strEntryCode
              ? {
                  value: vehicle?.intEntryId,
                  label: vehicle?.strEntryCode,
                }
              : "";
            formikRef.current.setFieldValue("veichleEntry", veichleEntry);
          }
        }
      );
    } else {
      getVehicleDDL(
        `/tms/Vehicle/GetAvailableVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, isGateMaintain]);

  useEffect(() => {
    if (buId === 175 && headerData?.pgiShippoint?.value) {
      getPumpDDL(
        `/oms/Shipment/GetPumpModelDDL?businessUnitId=175&shipPointId=${headerData?.pgiShippoint?.value}`,
        (data) => {
          const modifiedData = data.map((itm) => ({
            ...itm,
            value: itm?.pumpModelId,
            label: itm?.pumpModelName,
          }));
          setPumpDDL(modifiedData);
          if (formikRef.current) {
            console.log("object");
            formikRef.current.setFieldValue("pump", modifiedData?.[0] || "");
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, headerData]);

  useEffect(() => {
    if (!isEdit) {
      if (formikRef.current) {
        formikRef.current.setFieldValue(
          "loadingPoint",
          loadingPointDDL?.[0] || ""
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingPointDDL]);

  const qurScanHandler = ({ setFieldValue, values }) => {
    document.getElementById("cardNoInput").disabled = true;
    getEntryCodeDDL(
      `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForShipment&BusinessUnitId=${buId}&search=${values?.strCardNo}`,
      (data) => {
        if (data[0]?.strEntryCode) {
          setFieldValue("veichleEntry", isGateMaintain ? data?.[0] : "");
          getVehicleEntryDDL(
            `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accId}&businessUnitId=${buId}&EntryCode=${data[0]?.strEntryCode}`,
            (data) => {
              const find = vehicleDDL?.find(
                (i) => i.veichleId === data[0]?.vehicleId
              );
              if (find) {
                setFieldValue("laborSupplierName", "");
                vehicleSingeDataView(find?.label, accId, buId, setFieldValue);
                setFieldValue("Vehicle", find || "");
                setFieldValue("supplierName", "");
                setFieldValue("laborSupplierName", "");
                const controlsModify = [...controls];
                controlsModify[2].isDisabled = true;
                setControls(controlsModify);
              }
            }
          );
        } else {
          setFieldValue("strCardNo", "");
          setFieldValue("veichleEntry", "");
          document.getElementById("cardNoInput").disabled = false;
          document.getElementById("cardNoInput").focus();
          toast.warn("Card Number Not Found");
        }
      }
    );
  };
  return (
    <>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? validationSchemaEdit : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (isGateMaintain && !values?.veichleEntry?.value)
            return toast.warn("Veichle Entry is required ");
          saveHandler(values, () => {
            resetForm(initData);
            document.getElementById("cardNoInput").disabled = false;
            document.getElementById("cardNoInput").focus();
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {(loading ||
              loadingTwo ||
              entryCodeDDLloader ||
              vehicleEntryDDLloader ||
              isLoadingVehicleDDL ||
              loader) && <Loading />}
            {isSubsidyRunning && (
              <marquee
                direction="left"
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Transport subsidiary is running....
              </marquee>
            )}
            <Form className="form form-label-right">
              <div className="row mt-1">
                <div className="col-lg-9 text-center">
                  <h4>Warehouse: {deliveryeDatabydata?.warehouseName}</h4>
                </div>
                {values?.Vehicle && (
                  <div
                    className="col-lg-3"
                    style={{ backgroundColor: "yellow" }}
                  >
                    <h5>
                      {values?.Vehicle?.ownerType &&
                        `${values?.Vehicle?.ownerType} Vehicle`}
                    </h5>
                  </div>
                )}
                <div className="col-lg-12 p-0 m-0">
                  <div
                    className="row global-form m-0"
                    style={{ paddingBottom: "10px" }}
                  >
                    <>
                      {controls.map((itm) => {
                        return itm?.type === "asyncSelect" ? (
                          isGateMaintain && (
                            <>
                              <div className="col-lg-3">
                                <label>{itm?.label}</label>
                                <SearchAsyncSelect
                                  // isDisabled={itm?.isDisabled}
                                  selectedValue={values[itm?.name]}
                                  handleChange={(valueOption) => {
                                    setFieldValue(itm?.name, valueOption || "");
                                    const find = vehicleDDL?.find(
                                      (i) =>
                                        i.veichleId === valueOption?.vehicleId
                                    );
                                    if (find) {
                                      setFieldValue("laborSupplierName", "");
                                      vehicleSingeDataView(
                                        find?.label,
                                        accId,
                                        buId,
                                        setFieldValue
                                      );
                                      setFieldValue("Vehicle", find || "");
                                      setFieldValue("supplierName", "");
                                      setFieldValue("laborSupplierName", "");
                                      const controlsModify = [...controls];
                                      controlsModify[2].isDisabled = true;
                                      setControls(controlsModify);
                                    }
                                  }}
                                  placeholder={itm?.label}
                                  loadOptions={(v) => {
                                    const searchValue = v.trim();
                                    if (searchValue?.length < 2) return [];
                                    return axios
                                      .get(
                                        `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accId}&businessUnitId=${buId}&EntryCode=${v}`
                                      )
                                      .then((res) => res?.data);
                                  }}
                                  isDisabled={
                                    itm?.isDisabled ||
                                    (isGateMaintain && buId === 175)
                                  }
                                />
                                <FormikError
                                  errors={errors}
                                  name="product"
                                  touched={touched}
                                />
                              </div>
                            </>
                          )
                        ) : itm?.type === "cardInput" ? (
                          isGateMaintain && (
                            <>
                              {isGateMaintain && buId === 175 ? (
                                <></>
                              ) : (
                                <>
                                  {" "}
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
                                        zIndex: "1",
                                      }}
                                      onClick={() => {
                                        setQRCodeScannerModal(true);
                                      }}
                                    >
                                      QR Code{" "}
                                      <i
                                        class="fa fa-qrcode"
                                        aria-hidden="true"
                                      ></i>
                                    </div>
                                    <div style={{ width: "inherit" }}>
                                      <InputField
                                        disabled={
                                          itm?.isDisabled ||
                                          (isGateMaintain && buId === 175)
                                        }
                                        id="cardNoInput"
                                        value={values?.strCardNo}
                                        label={itm?.label}
                                        name="strCardNo"
                                        type="text"
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            document.getElementById(
                                              "cardNoInput"
                                            ).disabled = true;
                                            getEntryCodeDDL(
                                              `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForShipment&BusinessUnitId=${buId}&search=${values?.strCardNo}`,
                                              (data) => {
                                                if (data[0]?.strEntryCode) {
                                                  setFieldValue(
                                                    "veichleEntry",
                                                    isGateMaintain
                                                      ? data?.[0]
                                                      : ""
                                                  );
                                                  getVehicleEntryDDL(
                                                    `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accId}&businessUnitId=${buId}&EntryCode=${data[0]?.strEntryCode}`,
                                                    (data) => {
                                                      const find = vehicleDDL?.find(
                                                        (i) =>
                                                          i.veichleId ===
                                                          data[0]?.vehicleId
                                                      );
                                                      if (find) {
                                                        setFieldValue(
                                                          "laborSupplierName",
                                                          ""
                                                        );
                                                        vehicleSingeDataView(
                                                          find?.label,
                                                          accId,
                                                          buId,
                                                          setFieldValue
                                                        );
                                                        setFieldValue(
                                                          "Vehicle",
                                                          find || ""
                                                        );
                                                        setFieldValue(
                                                          "supplierName",
                                                          ""
                                                        );
                                                        setFieldValue(
                                                          "laborSupplierName",
                                                          ""
                                                        );
                                                        const controlsModify = [
                                                          ...controls,
                                                        ];
                                                        controlsModify[2].isDisabled = true;
                                                        setControls(
                                                          controlsModify
                                                        );
                                                      }
                                                    }
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    "strCardNo",
                                                    ""
                                                  );
                                                  setFieldValue(
                                                    "veichleEntry",
                                                    ""
                                                  );
                                                  document.getElementById(
                                                    "cardNoInput"
                                                  ).disabled = false;
                                                  document
                                                    .getElementById(
                                                      "cardNoInput"
                                                    )
                                                    .focus();
                                                  toast.warn(
                                                    "Card Number Not Found"
                                                  );
                                                }
                                              }
                                            );
                                          }
                                        }}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "strCardNo",
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </div>
                                    {!isEdit && (
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
                                          setFieldValue("strCardNo", "");
                                          document.getElementById(
                                            "cardNoInput"
                                          ).disabled = false;
                                          document
                                            .getElementById("cardNoInput")
                                            .focus();
                                          resetForm(initData);
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
                                    )}
                                  </div>
                                </>
                              )}
                            </>
                          )
                        ) : (
                          <div className="col-lg-3">
                            <ISelect
                              label={itm.label}
                              placeholder={itm.label}
                              options={itm.options}
                              value={values[itm.name]}
                              name={itm.name}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              values={values}
                              touched={touched}
                              dependencyFunc={itm.dependencyFunc}
                              isDisabled={itm?.isDisabled}
                            />
                          </div>
                        );
                      })}
                      <div className="col-lg-3">
                        <InputField
                          value={values.lastDistance}
                          label="Last Distance (KM)"
                          name="lastDistance"
                          type="number"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="isLaborImpart"
                          options={[
                            { value: false, label: "No" },
                            { value: true, label: "Yes" },
                          ]}
                          value={values?.isLaborImpart}
                          label="Labor/Handling Provided"
                          onChange={(valueOption) => {
                            setFieldValue("isLaborImpart", valueOption);
                            setFieldValue("supplierName", "");
                            setFieldValue("laborSupplierName", "");
                          }}
                          placeholder="Labor/Handling Provided"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Estimated of Arrival Date </label>
                        <ICalendar
                          value={values.estimatedTimeofArrival || ""}
                          name="estimatedTimeofArrival"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Planned Loading Time </label>
                        <ICalendar
                          value={values.planedLoadingTime || ""}
                          name="planedLoadingTime"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values.driverName || ""}
                          placeholder="Driver Name"
                          name="driverName"
                          label="Driver Name"
                          component={Input}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values.driverContactNo || ""}
                          placeholder="Driver Contact No"
                          name="driverContactNo"
                          label="Driver Contact No"
                          component={Input}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3" style={{ display: "none" }}>
                        <InputField
                          value={values.driverId || ""}
                          placeholder="Driver Id"
                          name="driverId"
                          label="Driver Id"
                          component={Input}
                          type="text"
                        />
                      </div>
                      {buId === 175 ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name="pump"
                            options={pumpDDL || []}
                            value={values?.pump}
                            label="Pump Information"
                            onChange={(valueOption) => {
                              setFieldValue("pump", valueOption);
                            }}
                            placeholder="Pump Information"
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit}
                          />
                        </div>
                      ) : null}
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="pendingDelivery"
                            placeholder="Pending Delivery List"
                            label="Pending Delivery List"
                            options={PendingDeliveryDDL || []}
                            value={values?.pendingDelivery}
                            isDisabled={!values?.Vehicle}
                            onChange={(valueOption) => {
                              setFieldValue("pendingDelivery", valueOption);

                              if (valueOption?.value) {
                                dispatch(
                                  getDeliveryItemVolumeInfoAction(
                                    valueOption?.value,
                                    setDisabled
                                  )
                                );
                                dispatch(
                                  getDeliveryeDatabyId(
                                    valueOption?.value,
                                    values,
                                    buId,
                                    setCostlaborRateStatus,
                                    setLoading
                                  )
                                );
                                dispatch(
                                  getStockStatusOnShipmentAction(
                                    valueOption?.value,
                                    buId,
                                    setLoadingTwo
                                  )
                                );
                                dispatch(
                                  getVehicleNo_action(valueOption?.value, buId)
                                );
                                getTransportStatusAndInfo(
                                  1,
                                  buId,
                                  valueOption?.value,
                                  setTransportStatus,
                                  setDisabled
                                );
                                // getShipmentDetailInfo(
                                //   `/oms/Shipment/ChallanWiseTransportZoneRate?accountId=${accId}&businessUnitId=${buId}&deliveryId=${valueOption?.value}&shipPointId=${values?.shipPoint?.value}`
                                // );
                              }
                            }}
                          />
                        </div>
                      )}

                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          onClick={() => {
                            getShipmentDetailInfo(
                              `/oms/Shipment/ChallanWiseTransportZoneRate?accountId=${accId}&businessUnitId=${buId}&deliveryId=${values?.pendingDelivery?.value}`,
                              // `/oms/Shipment/ChallanWiseShipmentInfoDetails?accountId=${accId}&businessUnitId=${buId}&deliveryCode=${values?.pendingDelivery?.label}`
                              (resData) => {
                                if (resData?.data?.length) {
                                  setShow(true);
                                } else {
                                  toast.warning("Shipment details not found!");
                                }
                              }
                            );
                          }}
                          disabled={!values?.pendingDelivery}
                        >
                          See Slab Rates
                        </button>
                      </div>
                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          onClick={() => {
                            const payload = rowDto?.map((e) => e?.deliveryId);
                            getItemListForChallan(
                              accId,
                              buId,
                              setPreviewItems,
                              payload,
                              setDisabled,
                              () => {
                                setOpen(true);
                              }
                            );
                          }}
                          disabled={!rowDto?.length}
                        >
                          Preview
                        </button>
                      </div>
                      {values?.Vehicle?.isRental && (
                        <div className="col-lg-3">
                          <label> Vehicle Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.supplierName}
                            handleChange={(valueOption) => {
                              setFieldValue("supplierName", valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                  }));
                                  return updateList;
                                });
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="supplierName"
                            touched={touched}
                          />
                        </div>
                      )}
                      {values?.isLaborImpart?.value && (
                        <div className="col-lg-3">
                          <label>Labor/Handling Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.laborSupplierName}
                            handleChange={(valueOption) => {
                              setFieldValue("laborSupplierName", valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                  }));
                                  return updateList;
                                });
                            }}
                            // isDisabled={isEdit}
                          />
                          <FormikError
                            errors={errors}
                            name="laborSupplierName"
                            touched={touched}
                          />
                        </div>
                      )}

                      {/* <div className="col-lg-12"></div> */}
                      <div
                        className={
                          values?.Vehicle?.isRental
                            ? `col-lg-9 ${
                                windowSize?.width > 1000
                                  ? "d-flex justify-content-between align-items-center"
                                  : ""
                              }`
                            : `col-lg-11 ${
                                windowSize?.width > 1000
                                  ? "d-flex justify-content-between align-items-center"
                                  : ""
                              }`
                        }
                        style={{ marginTop: "10px" }}
                      >
                        <div
                          className={` ${windowSize?.width < 600 &&
                            "col-lg-6 mr-2"}`}
                        >
                          <b className="mr-2 ">
                            Vehicle Capacity : &nbsp;
                            {rowDto?.length
                              ? values?.unloadVehicleWeight ||
                                vehicleSingleData?.weight
                              : 0}
                            &nbsp; Ton,
                          </b>
                          <b>
                            {/* Volume Capacity : */}
                            {rowDto?.length
                              ? values.itemTotalNetWeight ||
                                // deliveryItemVolumeInfo.netWeight
                                vehicleSingleData?.volume
                              : 0}
                            &nbsp; CFT
                          </b>
                        </div>

                        <div
                          className={` ${windowSize?.width < 600 &&
                            "col-lg-6 mr-2"}`}
                        >
                          <b className="mr-2">
                            Product Actual : &nbsp;
                            {rowDto?.length
                              ? values?.unloadVehicleVolume ||
                                // vehicleSingleData?.volume
                                rowDto
                                  .map((itm) => itm?.itemTotalGrowssWeight)
                                  .reduce((sum, curr) => {
                                    return (sum += curr);
                                  }, 0)
                              : 0}
                            &nbsp; Ton,
                          </b>
                          <b>
                            {rowDto?.length &&
                              rowDto
                                .map((itm) => itm?.itemTotalVolume)
                                .reduce((sum, curr) => {
                                  return (sum += curr);
                                }, 0)}
                            &nbsp; CFT
                          </b>
                        </div>

                        <div
                          className={` ${windowSize?.width < 600 &&
                            "col-lg-6 mr-2"}`}
                        >
                          <b>Total Number Of Challan : {rowDto?.length}</b>{" "}
                        </div>
                        <div
                          className={` ${windowSize?.width < 600 &&
                            "col-lg-6 mr-2"}`}
                        >
                          <b>
                            Total Quantity :{" "}
                            {rowDto?.reduce((acc, cur) => {
                              return acc + Number(cur?.quantity);
                            }, 0)}
                          </b>{" "}
                        </div>
                        {buId === 4 && (
                          <div
                            className={` ${windowSize?.width < 600 &&
                              "col-lg-6 mr-2"}`}
                          >
                            <b>Request Vehicle No : {vehicleNo}</b>{" "}
                          </div>
                        )}
                      </div>

                      {!isEdit && (
                        <div className="col d-flex justify-content-end align-items-center">
                          <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => addBtnHandler(values, setFieldValue)}
                            disabled={
                              !values.pendingDelivery ||
                              !values.shipPoint ||
                              !values.loadingPoint
                            }
                          >
                            Add
                          </button>
                        </div>
                      )}
                      <div className="col-12 mt-3">
                        <p>
                          <strong>Narration: </strong>{" "}
                          <mark style={{ backgroundColor: "yellow" }}>
                            {transportStatus[0]?.label}
                          </mark>{" "}
                          {[171, 224].includes(buId) && (
                            <>
                              , <strong> Unload by Company: </strong>{" "}
                              {transportStatus[0]?.labourstatus ? "Yes" : "No"}{" "}
                            </>
                          )}
                        </p>
                      </div>
                    </>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>

              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0">
                  {rowDto?.length >= 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-1 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "35px" }}>SL</th>
                            <th>Delivery Id</th>
                            <th>Delivery No</th>
                            {buId === 175 ? <th>Pump</th> : null}
                            <th>Ship To Party Name</th>
                            <th>Ship To Address</th>
                            <th>Transport Zone</th>
                            <th>Loading Point</th>
                            <th>Quantity</th>
                            <th>Net (KG)</th>
                            <th>Vol (CFT)</th>
                            {!isEdit && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, index) => (
                            <tr key={index}>
                              <td className="text-center">{++index}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm.deliveryId}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm.deliveryCode}
                                </div>
                              </td>
                              {buId === 175 ? (
                                <td>
                                  <div className="text-right pr-2">
                                    {itm?.pumpName || values?.pump?.label}
                                  </div>
                                </td>
                              ) : null}

                              <td>
                                <div className="pl-2">
                                  {itm.shipToPartnerName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.shipToPartnerAddress}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.transportZoneName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.loadingPointName}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm?.quantity}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm?.itemTotalNetWeight}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm?.itemTotalVolume}
                                </div>
                              </td>
                              {!isEdit && (
                                <td className="text-center">
                                  <i
                                    className="fa fa-trash"
                                    onClick={() =>
                                      remover(--index, setFieldValue)
                                    }
                                  ></i>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              <IViewModal
                modelSize="md"
                title="Challan Items Preview"
                show={open}
                onHide={() => setOpen(false)}
              >
                <ChallanItemsPreview rowData={previewItems} />
              </IViewModal>
              <IViewModal
                title="Zone Cost Rates"
                show={show}
                onHide={() => setShow(false)}
              >
                <ShipmentDetailsInfo rowDto={shipmentDetailInfo?.data} />
              </IViewModal>
              {QRCodeScannerModal && (
                <>
                  <IViewModal
                    show={QRCodeScannerModal}
                    onHide={() => {
                      setQRCodeScannerModal(false);
                    }}
                  >
                    <QRCodeScanner
                      QrCodeScannerCB={(result) => {
                        setFieldValue("strCardNo", result);
                        setQRCodeScannerModal(false);
                        qurScanHandler({
                          setFieldValue,
                          values: {
                            ...values,
                            strCardNo: result,
                          },
                        });
                      }}
                    />
                  </IViewModal>
                </>
              )}
              <button
                // type="submit"
                type="button"
                style={{ display: "none" }}
                ref={btnRef}
                // onSubmit={() => handleSubmit()}
                onClick={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
