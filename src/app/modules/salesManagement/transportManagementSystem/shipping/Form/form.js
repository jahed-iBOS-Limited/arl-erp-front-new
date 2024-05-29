import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useDispatch } from "react-redux";
import {
  getDeliveryItemVolumeInfoAction,
  GetPendingDeliveryDDLAction,
  GetTransportZoneDDLAction,
} from "../_redux/Actions";
import { getDeliveryeDatabyId } from "../_redux/Actions";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { getLoadingPointDDLAction } from "./../_redux/Actions";
import { _numberValidation } from "../../../../_helper/_numberValidation";

// Validation schema
const validationSchema = Yup.object().shape({
  lastDistance: Yup.number()
    .min(1, "Minimum 2 strings")
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

  shipmentdate: Yup.date().required("Shipment Date required"),

  estimatedTimeofArrival: Yup.date().required(
    "Estimated Time of Arrival required"
  ),
});
const validationSchemaEdit = Yup.object().shape({
  lastDistance: Yup.number()
    .min(1, "Minimum 2 strings")
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

  estimatedTimeofArrival: Yup.date().required(
    "Estimated Time of Arrival required"
  ),
  // planedLoadingTime: Yup.date().required("Planned Loading Time required"),
});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  rowDto,
  plantDDL,
  vehicleDDL,
  RouteListDDL,
  TransportModeDDL,
  TransportZoneDDL,
  ShipmentTypeDDL,
  salesOrgDDL,
  distributionChannelDDL,
  salesOfficeDDL,
  soldToPartyDDL,
  salesOfficeDDLDispatcher,
  addBtnHandler,
  ShippointDDL,
  PendingDeliveryDDL,
  remover,
  lastDistance,
  driverName,
  driverContactNo,
  driverId,
  vehicleSingeDataView,
  vehicleSingleData,
  deliveryItemVolume,
  deliveryItemVolumeInfo,
  accountId,
  selectedBusinessUnit,
  loadingPointDDL,
}) {
  const [controls, setControls] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setControls([
      {
        label: "Select Ship Point",
        name: "shipPoint",
        options: ShippointDDL,
        defaultValue: initData.shipPoint,
        isDisabled: false,
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
        },
      },
      {
        label: "Select Vehicle",
        name: "Vehicle",
        options: vehicleDDL,
        defaultValue: initData.Vehicle,
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
        options: RouteListDDL,
        defaultValue: initData.salesOrg,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          salesOfficeDDLDispatcher(currentValue);
          dispatch(
            GetTransportZoneDDLAction(currentValue, selectedBusinessUnit?.value)
          );
          setter("salesOffice", "");
          setter("BUsalesOrgIncoterm", "");
          setter("transportZone", "");
        },
      },
      {
        label: "Transport Zone",
        name: "transportZone",
        options: TransportZoneDDL,
        defaultValue: initData.transportZone,
        isDisabled: false,
      },
      {
        label: "Select Loading Point",
        name: "loadingPoint",
        options: loadingPointDDL,
        defaultValue: initData.loadingPoint,
        isDisabled: false,
      },
      // {
      //   label: "Select Pending Delivery",
      //   name: "pendingDelivery",
      //   options: PendingDeliveryDDL,
      //   defaultValue: initData.pendingDelivery,
      //   isDisabled: false,
      // }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ShippointDDL,
    vehicleDDL,
    ShipmentTypeDDL,
    RouteListDDL,
    TransportModeDDL,
    TransportZoneDDL,
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    salesOfficeDDL,
    soldToPartyDDL,
    loadingPointDDL,
  ]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? validationSchemaEdit : validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="row bank-journal bank-journal-custom bj-left"
                    style={{ paddingBottom: "10px" }}
                  >
                    <>
                      {controls.map((itm) => {
                        return (
                          <div className="col-lg-2">
                            <ISelect
                              label={itm.label}
                              placeholder={itm.label}
                              options={itm.options}
                              defaultValue={values[itm.name]}
                              name={itm.name}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              values={values}
                              touched={touched}
                              dependencyFunc={itm.dependencyFunc}
                              isDisabled={isEdit && itm?.isDisabled}
                            />
                          </div>
                        );
                      })}
                      <div className="col-lg-2">
                        <IInput
                          value={lastDistance || values.lastDistance}
                          label="Last Distance"
                          name="lastDistance"
                          type="tel"
                          defaultValue={lastDistance || ""}
                          onChange={(e) => {
                            setFieldValue("lastDistance", _numberValidation(e));
                          }}
                        />
                      </div>

                      <div className="col-lg-2">
                        <label>Estimated of Arrival Date </label>
                        <ICalendar
                          value={_dateFormatter(
                            values.estimatedTimeofArrival || ""
                          )}
                          name="estimatedTimeofArrival"
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>Planned Loading Time </label>
                        <ICalendar
                          value={_dateFormatter(values.planedLoadingTime || "")}
                          name="planedLoadingTime"
                        />
                      </div>
                      <div className="col-lg-2">
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
                      <div className="col-lg-2">
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
                      <div className="col-lg-2" style={{ display: "none" }}>
                        <Field
                          value={values.driverId || ""}
                          placeholder="Driver Id"
                          name="driverId"
                          label="Driver Id"
                          component={Input}
                          type="text"
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>Pending Delivery List</label>
                        <Field
                          name="pendingDelivery"
                          component={() => (
                            <Select
                              options={
                                PendingDeliveryDDL || { value: "", label: "" }
                              }
                              placeholder="Select Delivery List"
                              defaultValue={
                                values.pendingDelivery || {
                                  value: "",
                                  label: "",
                                }
                              }
                              onChange={(valueOption) => {
                                setFieldValue("pendingDelivery", valueOption);
                                dispatch(
                                  getDeliveryItemVolumeInfoAction(
                                    valueOption?.value
                                  )
                                );
                                dispatch(
                                  getDeliveryeDatabyId(valueOption?.value)
                                );
                              }}
                              // isSearchable={true}

                              styles={customStyles}
                              name="pendingDelivery"
                              isDisabled={!PendingDeliveryDDL}
                            />
                          )}
                          placeholder="Select delivery List"
                          label="Select delivery List"
                        />
                      </div>
                      <div className="col-lg-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => addBtnHandler(values)}
                          disabled={
                            !values.pendingDelivery ||
                            !values.transportZone ||
                            !values.shipPoint ||
                            !values.loadingPoint
                          }
                        >
                          Add
                        </button>
                      </div>
                      <div className="col-lg-12"></div>
                      <div className="col-lg-3" style={{ marginTop: "10px" }}>
                        <b className="mr-2">
                          Weight Capacity :{" "}
                          {rowDto?.length
                            ? values?.unloadVehicleWeight ||
                              vehicleSingleData?.weight
                            : 0}{" "}
                          Ton
                        </b>
                        <b>
                          Net Weight :{" "}
                          {rowDto?.length
                            ? values.itemTotalNetWeight ||
                              deliveryItemVolumeInfo.netWeight
                            : 0}
                        </b>
                      </div>
                      <div className="col-lg-3" style={{ marginTop: "10px" }}>
                        <b className="mr-2">
                          Volume Capacity :{" "}
                          {rowDto?.length
                            ? values?.unloadVehicleVolume ||
                              vehicleSingleData?.volume
                            : 0}{" "}
                          FT3
                        </b>
                        <b>
                          Volume :{" "}
                          {rowDto?.length
                            ? values.itemTotalVolume ||
                              deliveryItemVolumeInfo.volume
                            : 0}
                        </b>
                      </div>
                      <div className="col-lg-3" style={{ marginTop: "10px" }}>
                        <b className="mr-2">
                          Gross Weight :{" "}
                          {rowDto?.length
                            ? values?.itemTotalGrowssWeight ||
                              deliveryItemVolumeInfo.grossWeight
                            : 0}
                        </b>
                        <b>Total Challan : {rowDto?.length}</b>
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
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "35px" }}>SL</th>
                            <th>Delivery Id</th>
                            <th>Delivery No</th>
                            <th>Ship To Party Name</th>
                            <th>Ship To Address</th>
                            <th>Transport Zone</th>
                            <th>Loading Point</th>
                            <th>Net Weight</th>
                            <th>Volume</th>
                            <th>Action</th>
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
                                  {deliveryItemVolumeInfo.netWeight}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {deliveryItemVolumeInfo.volume}
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
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
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
