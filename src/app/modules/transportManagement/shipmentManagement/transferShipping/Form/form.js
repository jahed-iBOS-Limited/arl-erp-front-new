import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import customStyles from "../../../../selectCustomStyle";
import {
  GetPendingDeliveryDDLAction,
  getLoadingPointDDLAction,
} from "../_redux/Actions";
import IViewModal from "../../../../_helper/_viewModal";
import QRCodeScanner from "../../../../_helper/qrCodeScanner";
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
  // laborSupplierName: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Labor Supplier Name is required"),
  //     value: Yup.string().required("Labor Supplier Name is required"),
  //   })
  //   .typeError("Labor Supplier Name is required"),
  supplierName: Yup.object().when("Vehicle", (Vehicle, Schema) => {
    if (Vehicle?.isRental)
      return Schema.required("Vehicle Supplier Name is required");
  }),
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
  // laborSupplierName: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Labor Supplier Name is required"),
  //     value: Yup.string().required("Labor Supplier Name is required"),
  //   })
  //   .typeError("Labor Supplier Name is required"),
  // planedLoadingTime: Yup.date().required("Planned Loading Time required"),
});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  plantDDL,
  vehicleDDL,
  routeListDDL,
  TransportModeDDL,
  TransportZoneDDL,
  ShipmentTypeDDL,
  salesOrgDDL,
  distributionChannelDDL,
  salesOfficeDDL,
  soldToPartyDDL,
  pendingDeliveryOnchangeHandler,
  addBtnHandler,
  headerData,
  PendingDeliveryDDL,
  remover,
  vehicleSingeDataView,
  vehicleSingleData,
  accountId,
  selectedBusinessUnit,
  loadingPointDDL,
  ShippointDDL,
}) {
  const [QRCodeScannerModal, setQRCodeScannerModal] = useState(false);
  const [controls, setControls] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setControls([
      {
        label: "Select Ship Point",
        name: "shipPoint",
        options: ShippointDDL,
        value: initData.shipPoint,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          dispatch(
            GetPendingDeliveryDDLAction(
              currentValue,
              selectedBusinessUnit.value,
              accountId
            )
          );
          dispatch(
            getLoadingPointDDLAction(
              accountId,
              selectedBusinessUnit?.value,
              currentValue
            )
          );
          setter("loadingPoint", "");
          setter("pendingDelivery", "");
        },
      },
      {
        label: "Get Entry Card No",
        name: "strCardNo",
        value: initData.strCardNo,
        type: "cardInput",
      },
      {
        label: "Gate Entry Code",
        name: "gateEntryCode",
        value: initData.gateEntryCode,
        isDisabled: false,
        type: "asyncSelect",
      },
      {
        label: "Select Vehicle",
        name: "Vehicle",
        options: vehicleDDL,
        value: initData.Vehicle,
        dependencyFunc: (currentValue, values, setter, label) => {
          vehicleSingeDataView(
            label,
            accountId,
            selectedBusinessUnit?.value,
            setter
          );
        },
      },
      {
        label: "Select Route",
        name: "route",
        options: routeListDDL || [],
        value: initData.route,
        isDisabled: !routeListDDL?.length,
        dependencyFunc: (currentValue, values, setter) => {},
      },
      {
        label: "Loading Point",
        name: "loadingPoint",
        options: loadingPointDDL,
        value: initData.loadingPoint,
        isDisabled: false,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ShippointDDL,
    vehicleDDL,
    ShipmentTypeDDL,
    routeListDDL,
    TransportModeDDL,
    TransportZoneDDL,
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    salesOfficeDDL,
    soldToPartyDDL,
    loadingPointDDL,
  ]);

  const [, getEntryCodeDDL, entryCodeDDLloader] = useAxiosGet();
  const [, getVehicleEntryDDL, vehicleEntryDDLloader] = useAxiosGet();

  const isGateMaintain = ShippointDDL?.find(
    (i) => i.value === headerData?.pgiShippoint?.value
  )?.isGateMaintain;

  const qurScanHandler = ({ setFieldValue, values }) => {
    document.getElementById("cardNoInput").disabled = true;
    getEntryCodeDDL(
      `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForShipment&BusinessUnitId=${selectedBusinessUnit?.value}&search=${values?.strCardNo}`,
      (data) => {
        if (data[0]?.strEntryCode) {
          setFieldValue("gateEntryCode", {
            value: data[0]?.value,
            label: data[0]?.label,
          });
          vehicleSingeDataView(
            data[0]?.strTruckNumber,
            accountId,
            selectedBusinessUnit?.value,
            setFieldValue
          );
          getVehicleEntryDDL(
            `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accountId}&businessUnitId=${selectedBusinessUnit?.value}&EntryCode=${data[0]?.strEntryCode}`,
            (data) => {
              const find = vehicleDDL?.find(
                (i) => i.veichleId === data[0]?.vehicleId
              );
              if (find) {
                setFieldValue("laborSupplierName", "");
                vehicleSingeDataView(
                  find?.label,
                  accountId,
                  selectedBusinessUnit?.value,
                  setFieldValue
                );
                setFieldValue("Vehicle", find || "");
                setFieldValue("supplierName", "");
                setFieldValue("laborSupplierName", "");
                const controlsModify = [...controls];
                controlsModify[2].isDisabled = true;
                setControls(controlsModify);
              }
              // setFieldValue("Vehicle", { value: data[0]?.value, label: data[0]?.vehicleCode });
              const controlsModify = [...controls];
              controlsModify[2].isDisabled = true;
              setControls(controlsModify);
            }
          );
        } else {
          document.getElementById("cardNoInput").disabled = false;
          document.getElementById("cardNoInput").focus();
          setFieldValue("strCardNo", "");
          toast.warn("Card Number Not Found");
        }
      }
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                shipPoint: {
                  value: headerData?.pgiShippoint?.value,
                  label: headerData?.pgiShippoint?.label,
                },
                lastDistance: 0,
              }
        }
        validationSchema={isEdit ? validationSchemaEdit : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (isGateMaintain && !values?.gateEntryCode?.value)
            return toast.warn("Gate Entry Code is required");
          saveHandler(values, () => {
            resetForm(initData);
            document.getElementById("cardNoInput").disabled = false;
            document.getElementById("cardNoInput").focus();
            dispatch(
              GetPendingDeliveryDDLAction(
                values?.shipPoint?.value,
                selectedBusinessUnit?.value,
                accountId
              )
            );
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
            <Form className="form form-label-right">
              {(entryCodeDDLloader || vehicleEntryDDLloader) && <Loading />}
              <div className="row mt-1">
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
                                        accountId,
                                        selectedBusinessUnit?.value,
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
                                        `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accountId}&businessUnitId=${selectedBusinessUnit?.value}&EntryCode=${v}`
                                      )
                                      .then((res) => res?.data);
                                  }}
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
                                <i class="fa fa-qrcode" aria-hidden="true"></i>
                              </div>
                              <div style={{ width: "inherit" }}>
                                <InputField
                                  id="cardNoInput"
                                  autoFocus
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
                                        `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForShipment&BusinessUnitId=${selectedBusinessUnit?.value}&search=${values?.strCardNo}`,
                                        (data) => {
                                          if (data[0]?.strEntryCode) {
                                            setFieldValue("gateEntryCode", {
                                              value: data[0]?.value,
                                              label: data[0]?.label,
                                            });
                                            vehicleSingeDataView(
                                              data[0]?.strTruckNumber,
                                              accountId,
                                              selectedBusinessUnit?.value,
                                              setFieldValue
                                            );
                                            getVehicleEntryDDL(
                                              `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accountId}&businessUnitId=${selectedBusinessUnit?.value}&EntryCode=${data[0]?.strEntryCode}`,
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
                                                    accountId,
                                                    selectedBusinessUnit?.value,
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
                                                  setControls(controlsModify);
                                                }
                                                // setFieldValue("Vehicle", { value: data[0]?.value, label: data[0]?.vehicleCode });
                                                const controlsModify = [
                                                  ...controls,
                                                ];
                                                controlsModify[2].isDisabled = true;
                                                setControls(controlsModify);
                                              }
                                            );
                                          } else {
                                            document.getElementById(
                                              "cardNoInput"
                                            ).disabled = false;
                                            document
                                              .getElementById("cardNoInput")
                                              .focus();
                                            setFieldValue("strCardNo", "");
                                            toast.warn("Card Number Not Found");
                                          }
                                        }
                                      );
                                    }
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("strCardNo", e.target.value);
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
                                  document.getElementById(
                                    "cardNoInput"
                                  ).disabled = false;
                                  document
                                    .getElementById("cardNoInput")
                                    .focus();
                                  resetForm(initData);
                                  setFieldValue("strCardNo", "");
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
                        <IInput
                          value={values.lastDistance}
                          label="Last Distance (KM)"
                          name="lastDistance"
                          type="number"
                          disabled
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Estimated of Arrival Date </label>
                        <ICalendar
                          value={values.estimatedTimeofArrival || ""}
                          name="estimatedTimeofArrival"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Planned Loading Time </label>
                        <ICalendar
                          value={values.planedLoadingTime || ""}
                          name="planedLoadingTime"
                        />
                      </div>
                      <div className="col-lg-3">
                        <Field
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
                        <Field
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
                        <Field
                          value={values.driverId || ""}
                          placeholder="Driver Id"
                          name="driverId"
                          label="Driver Id"
                          component={Input}
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Pending Transfer List</label>
                        <Field
                          name="pendingDelivery"
                          component={() => (
                            <Select
                              options={
                                PendingDeliveryDDL || { value: "", label: "" }
                              }
                              placeholder="Select Transfer List"
                              value={
                                values.pendingDelivery || {
                                  value: "",
                                  label: "",
                                }
                              }
                              onChange={(valueOption) => {
                                pendingDeliveryOnchangeHandler(
                                  setFieldValue,
                                  valueOption
                                );
                              }}
                              styles={customStyles}
                              name="pendingDelivery"
                              isDisabled={!values?.Vehicle}
                            />
                          )}
                          placeholder="Select delivery List"
                          label="Select delivery List"
                        />
                      </div>

                      {values?.Vehicle?.isRental && (
                        <div className="col-lg-3">
                          <label>Vehicle Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.supplierName}
                            handleChange={(valueOption) => {
                              setFieldValue("supplierName", valueOption);
                              // setFieldValue("item", "");
                              // setFieldValue("referenceNo", "");
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${
                                    selectedBusinessUnit?.value
                                  }&SBUId=${0}`
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
                            name="supplierName"
                            touched={touched}
                          />
                        </div>
                      )}
                      <div style={{ marginTop: "18px" }}>
                        <label>
                          <input
                            type="checkbox"
                            onChange={() => {
                              setFieldValue(
                                "isRequiredLbrSplrName",
                                !values?.isRequiredLbrSplrName
                              );
                            }}
                            checked={values?.isRequiredLbrSplrName}
                          />
                          <span style={{ marginLeft: "5px" }}>
                            is Required Labor Supplier Name
                          </span>
                        </label>
                      </div>
                      {values?.isRequiredLbrSplrName ? (
                        <div className="col-lg-3">
                          <label>Labor Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.laborSupplierName || ""}
                            handleChange={(valueOption) => {
                              setFieldValue("laborSupplierName", valueOption);
                              // setFieldValue("item", "");
                              // setFieldValue("referenceNo", "");
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${
                                    selectedBusinessUnit?.value
                                  }&SBUId=${0}`
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
                      ) : null}
                      <div className="col-lg-12"></div>
                      <div
                        className={
                          "col d-flex justify-content-between align-items-center flex-4"
                        }
                        style={{ marginTop: "10px", flex: 4 }}
                      >
                        <div>
                          <b className="mr-2">
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
                        <div>
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
                        <div>
                          <b>Total Number Of Challan : {rowDto?.length}</b>
                        </div>
                      </div>

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
                    </>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>

              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0 ">
                  {rowDto?.length >= 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-1 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "35px" }}>SL</th>
                            <th>Transfer Id</th>
                            <th>Transfer No</th>
                            <th>Ship To Warehouse</th>
                            <th>Ship To Address</th>
                            <th>Transport Zone</th>
                            <th>Loading Point</th>
                            <th>Net (KG)</th>
                            <th>Vol (CFT)</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, index) => (
                            <tr key={index}>
                              <td className="text-center">{++index}</td>
                              <td>
                                <div className="text-center">
                                  {itm.deliveryId}
                                </div>
                              </td>
                              <td>
                                <div>{itm.deliveryCode}</div>
                              </td>
                              <td>
                                <div>{itm.shipToPartnerName}</div>
                              </td>
                              <td>
                                <div>{itm.shipToPartnerAddress}</div>
                              </td>
                              <td>
                                <div>{itm.transportZoneName}</div>
                              </td>
                              <td>
                                <div>{itm.loadingPointName}</div>
                              </td>
                              <td>
                                <div className="text-right">
                                  {itm?.itemTotalNetWeight}
                                </div>
                              </td>
                              <td>
                                <div className="text-right">
                                  {itm?.itemTotalVolume}
                                </div>
                              </td>
                              <td className="text-center">
                                <i
                                  className="fa fa-trash"
                                  onClick={() => remover(--index)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
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
                        setFieldValue("strCardNumber", result);
                        setQRCodeScannerModal(false);
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
              <button
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
