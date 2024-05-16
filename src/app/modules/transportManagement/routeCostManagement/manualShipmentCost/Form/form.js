/* eslint-disable eqeqeq */
import { Field, Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { GetSupplierFuelStationDDL_api, getComponentDDL } from "../helper";
import IView from "./../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";
import { compressfile } from "./../../../../_helper/compressfile";
import {
  GetSupplierListDDL_api,
  GetVehicleFuelTypeDDL_api,
  getBusinessUnitDDL_api,
  multipleAttachment_action,
} from "./../helper";
// Validation schema
const validationSchema = Yup.object().shape({
  whName: Yup.object().shape({
    label: Yup.string().required("WH Name required"),
    value: Yup.string().required("WH Name required"),
  }),
  routeName: Yup.object().shape({
    label: Yup.string().required("Route Name required"),
    value: Yup.string().required("Route Name required"),
  }),
  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("ShipPoint required"),
    value: Yup.string().required("ShipPoint required"),
  }),
  vehicle: Yup.object().shape({
    label: Yup.string().required("Vehicle required"),
    value: Yup.string().required("Vehicle required"),
  }),
  shipmentDate: Yup.date().required("Shipment Date Required"),
  customerName: Yup.string().required("Customer Name is required"),
  driverName: Yup.string().required("Driver Name Name is required"),
  downTripCash: Yup.number()
    .min(0, "Minimum 0 symbols")
    .nullable(),
  totalStandardCost: Yup.number()
    .min(1, "Minimum 1 symbols")
    .required("Total Standard Cost is required")
    .nullable(),
  totalActualCost: Yup.number()
    .min(1, "Minimum 1 symbols")
    .required("Total Actual is required")
    .nullable(),
  downTripCredit: Yup.number()
    .min(0, "Minimum 0 symbols")
    .required("Down Trip Credit is required")
    .nullable(),

  businessUnitName: Yup.object()
    .when("downTripCredit", (downTripCredit, Schema) => {
      if (+downTripCredit > 0)
        return Schema.required("BusinessUnit Name is required");
    })
    .nullable(),
  vehicleInDate: Yup.date().required("Instrument date is required"),
  vehicleInTime: Yup.string().required("Time is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  remover,
  setter,
  rowDto,
  setRowDto,
  profileData,
  dataHandler,
  downTripData,
  selectedBusinessUnit,
  fuleCost,
  setFuleCost,
  removerTwo,
  fuleCostHandler,
  extraMillageOnChangeHandler,
  fileObjects,
  setFileObjects,
  setUploadImage,
  netPayable,
  setNetPayable,
  dicrementNetPayable,
  setAdvanceAmount,
  netPayableCalculatorFunc,
  vehicleDDL,
  routeNameDDL,
  shipPointDDL,
  setVehicleId,
  whNameDDL,
  setDicrementNetPayable,
  totalStandardCost_TotalActualCalFunc,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState({});
  const [componentDDL, setComponentDDL] = useState([]);
  const [businessUnitName, setbusinessUnitName] = useState([]);
  const [vhicleFuelTypeDDL, setVhicleFuelTypeDDL] = useState([]);
  const [supplierListDDL, setSupplierListDDL] = useState([]);
  const [supplierFuelStationDDL, setSupplierFuelStationDDL] = useState([]);
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();
  const [costCenterDDL, getCostCenterDDL] = useAxiosGet();
  const [costElementDDL, getCostElementDDL] = useAxiosGet();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
});
const handleResize = () => {
  setWindowSize({
      width: window.innerWidth,
  });
};

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => {
      window.removeEventListener('resize', handleResize);
  };
}, []);



  useEffect(() => {
    getProfitCenterDDL(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        if (data?.length > 0) {
          const newData = data?.map((item) => ({
            value: item?.profitCenterId,
            label: item?.profitCenterName,
          }));
          setProfitCenterDDL(newData);
        }
      }
    );
    getCostCenterDDL(
      `/procurement/PurchaseOrder/GetCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}`
    );
    if (profileData.accountId) {
      getComponentDDL(profileData.accountId, setComponentDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    GetVehicleFuelTypeDDL_api(setVhicleFuelTypeDDL);
  }, []);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetSupplierListDDL_api(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setSupplierListDDL
      );
      getBusinessUnitDDL_api(
        profileData?.userId,
        profileData?.accountId,
        setbusinessUnitName
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const costComponenClickFunc = (values, setFieldValue) => {
    const isDailyAllowance = rowDto?.find(
      (itm) =>
        itm.transportRouteCostComponentId === downTripData?.daCostComponentId
    );
    const isTripAllowanceArry = rowDto?.find(
      (itm) =>
        itm.transportRouteCostComponentId === downTripData?.downTripAllowanceId
    );
    let data = [
      {
        transportRouteCostComponentId: downTripData?.daCostComponentId || 0,
        transportRouteCostComponent: downTripData?.daCostComponentName || "",
        standardCost: isDailyAllowance
          ? isDailyAllowance?.standardCost
          : values?.daAmount,
        actualCost: isDailyAllowance
          ? isDailyAllowance?.actualCost
          : values?.daAmount,
      },
    ];
    values?.downTraip &&
      data.push({
        transportRouteCostComponentId: downTripData?.downTripAllowanceId || 0,
        transportRouteCostComponent: downTripData?.downTripAllowanceName || "",
        standardCost: isTripAllowanceArry
          ? isTripAllowanceArry?.standardCost
          : values?.downTripAllowns,
        actualCost: isTripAllowanceArry
          ? isTripAllowanceArry?.actualCost
          : values?.downTripAllowns,
      });
    if (
      (isDailyAllowance ? false : values?.daAmount < 1) ||
      (isTripAllowanceArry
        ? false
        : values?.downTraip && values?.downTripAllowns < 1)
    )
      return toast.warn("Enter DA Quantity and Trip Allowance");

    const array1 = [...rowDto, ...data];
    const unique = [
      ...new Map(
        array1.map((item) => [item["transportRouteCostComponentId"], item])
      ).values(),
    ];
    setRowDto(unique);

    if (setFieldValue) {
      const {
        totalStandardCost,
        totalActual,
      } = totalStandardCost_TotalActualCalFunc(unique);
      setFieldValue("totalActualCost", totalActual);
      setFieldValue("totalStandardCost", totalStandardCost);
    }
  };

  const fileUploadFunc = async () => {
    const compressedFile = await compressfile([fileObjects[0].file]);
    multipleAttachment_action(compressedFile)
      .then((data) => {
        setUploadImage(open?.type === "fuelCost" && data?.[0]);
        setFileObjects([]);
      })
      .catch((err) => setFileObjects([]));
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          IConfirmModal({
            title: `Create manual Shipment`,
            message: `Are you sure to save ?`,
            yesAlertFunc: () => {
              saveHandler(values, () => {
                resetForm(initData);
                setRowDto([]);
                setFuleCost([]);
                setNetPayable(0);
                setDicrementNetPayable(0);
                setAdvanceAmount(0);
              });
            },
            noAlertFunc: () => {},
          });
          // saveHandler(values, () => {
          //   resetForm(initData);
          //   setRowDto([]);
          //   setFuleCost([]);
          //   setNetPayable(0);
          //   setDicrementNetPayable(0);
          //   setAdvanceAmount(0);
          // });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <ICustomCard
            title="Create Manual Shipment Cost"
            renderProps={() => (
              <>
                <button
                  type="button"
                  className={"btn btn-light"}
                  onClick={(e) => {
                    history.goBack();
                  }}
                >
                  <i className="fa fa-arrow-left"></i>
                  Back
                </button>
                <button
                  onClick={() => resetForm()}
                  className={"btn btn-light ml-2"}
                >
                  <i className="fa fa-redo"></i>
                  Reset
                </button>
                <button
                  type="submit"
                  className={"btn btn-primary ml-2"}
                  onClick={() => {
                    setFieldValue("handleType", "out");
                    handleSubmit();
                  }}
                >
                  Save
                </button>
              </>
            )}
          >
            <>
              <Form className="form form-label-right position-relative">
                <p style={windowSize?.width>1000 ? { position: "absolute", top: "-46px", left: "45%" } : {marginTop:"10px",textAlign:"center"}}>
                  <b>Pay to Driver: </b>
                  {netPayable || 0}
                </p>
                <div className="row global-form">
                  <div className="col-lg-12">
                    <div
                      className="row bank-journal  "
                      style={{ paddingBottom: "20px 0" }}
                    >
                      <div className="col-lg-3">
                        <NewSelect
                          name="whName"
                          options={whNameDDL}
                          value={values?.whName}
                          onChange={(valueOption) => {
                            setFieldValue("whName", valueOption);
                          }}
                          placeholder="WH Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={shipPointDDL}
                          value={values?.shipPoint}
                          label="Shippoint"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          placeholder="Shippoint"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <NewSelect
                          name="vehicle"
                          options={vehicleDDL}
                          value={values?.vehicle}
                          label="Vehicle"
                          onChange={(valueOption) => {
                            setFieldValue("vehicle", valueOption);
                            setFieldValue(
                              "driverName",
                              valueOption?.driverName
                            );
                            setVehicleId(valueOption?.value);
                          }}
                          placeholder="Select Vehicle"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Customer Name"
                          value={values?.customerName}
                          name="customerName"
                          placeholder="Customer Name"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Driver Name"
                          value={values?.driverName}
                          name="driverName"
                          placeholder="Driver Name"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <NewSelect
                          name="routeName"
                          options={routeNameDDL}
                          value={values?.routeName}
                          label="Route Name"
                          onChange={(valueOption) => {
                            setFieldValue("routeName", valueOption);
                          }}
                          placeholder="Route Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Distance (KM)"
                          value={values?.distanceKm}
                          name="distanceKm"
                          placeholder="Distance Km"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Vehicle Rent"
                          value={values?.vehicleRent}
                          name="vehicleRent"
                          placeholder="Vehicle Rent"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Extra Millage (KM)"
                          value={values?.extraMillage}
                          name="extraMillage"
                          placeholder="Extra Millage"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "extraMillage",
                              parseInt(e.target.value)
                            );
                            const totalMillage =
                              +values?.distanceKm + +e.target.value;
                            extraMillageOnChangeHandler(
                              setFieldValue,
                              totalMillage
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Reason For Extra Millage (KM)"
                          value={values?.extraMillageReason || ""}
                          name="extraMillageReason"
                          placeholder="Reason For Extra Millage"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          value={values?.shipmentDate}
                          label="Shipment Date"
                          type="date"
                          name="shipmentDate"
                          placeholder=""
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Start Millage"
                          value={values?.startMillage}
                          name="startMillage"
                          placeholder="Start Millage"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="End Millage"
                          value={values?.endMillage}
                          name="endMillage"
                          placeholder="End Millage"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Total Standard Cost"
                          value={values?.totalStandardCost}
                          name="totalStandardCost"
                          placeholder="Total Standard Cost"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Advance Amount"
                          value={values?.advanceAmount}
                          name="advanceAmount"
                          placeholder="Advane Amount"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("advanceAmount", e.target.value);
                            setAdvanceAmount(e.target.value);
                            setNetPayable(
                              dicrementNetPayable - +e.target.value
                            );
                          }}
                          min={0}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Total Actual"
                          value={values?.totalActualCost}
                          name="totalActualCost"
                          placeholder="Total Actual"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="DA Quantity"
                          value={values?.daQuantity}
                          name="daQuantity"
                          onChange={(e) => {
                            setFieldValue(
                              "daAmount",
                              e.target.value * downTripData?.daAmount
                            );
                            setFieldValue("daQuantity", e.target.value);
                          }}
                          placeholder="DA Quantity"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="DA Amount"
                          value={values?.daAmount}
                          name="daAmount"
                          placeholder="Total Actual"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Down Trip Cash"
                          value={values?.downTripCash}
                          name="downTripCash"
                          placeholder="Down Trip Cash"
                          type="number"
                          min="0"
                          onChange={(e) => {
                            setFieldValue("downTripCash", e.target.value);
                            netPayableCalculatorFunc(
                              fuleCost,
                              rowDto,
                              +values?.downTripCredit,
                              +e.target.value
                            );
                          }}
                        />
                      </div>
                      {netPayableCalculatorFunc(
                        fuleCost,
                        rowDto,
                        +values?.downTripCredit,
                        +values?.downTripCash
                      )}
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Down Trip Credit"
                          value={values?.downTripCredit}
                          onChange={(e) => {
                            setFieldValue("downTripCredit", e.target.value);
                          }}
                          name="downTripCredit"
                          placeholder="Down Trip Credit"
                          type="number"
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Vehicle In Date</label>
                        <InputField
                          value={values?.vehicleInDate}
                          name="vehicleInDate"
                          placeholder="Vehicle In Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Vehicle In Time</label>
                        <InputField
                          value={values?.vehicleInTime}
                          name="vehicleInTime"
                          placeholder="Vehicle In Time"
                          type="time"
                          required
                        />
                      </div>{" "}
                      {+values?.downTripCredit > 0 && (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <NewSelect
                            name="businessUnitName"
                            options={businessUnitName}
                            value={values?.businessUnitName}
                            label="Business Unit Name"
                            onChange={(valueOption) => {
                              setFieldValue("businessUnitName", valueOption);
                            }}
                            placeholder="Business Unit Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-3" style={{ marginTop: "18px" }}>
                        <Field
                          type="checkbox"
                          name="downTraip"
                          checked={values?.downTraip}
                        />
                        <label className="ml-2">is Down Trip Allowance?</label>
                      </div>
                      {values?.downTraip === true ? (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <InputField
                            label="Down Trip Allowance"
                            value={values?.downTripAllowns}
                            name="downTripAllowns"
                            placeholder="Down Trip Allowance"
                            type="number"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="col-lg-2 pl pr-1 mb-1">
                        <button
                          class="btn btn-primary ml-2"
                          type="button"
                          style={{ marginTop: "18px" }}
                          onClick={() => {
                            costComponenClickFunc(values, setFieldValue);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="profitCenter"
                      options={profitCenterDDL}
                      value={values?.profitCenter}
                      label="Profit Center"
                      onChange={(valueOption) => {
                        setFieldValue("profitCenter", valueOption);
                      }}
                      placeholder="Profit Center"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="costCenter"
                      options={costCenterDDL}
                      value={values?.costCenter}
                      label="Cost Center"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("costCenter", valueOption);
                          setFieldValue("costElement", "");
                          getCostElementDDL(
                            `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&CostCenterId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue("costCenter", "");
                          setFieldValue("costElement", "");
                        }
                      }}
                      placeholder="Cost Center"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="costElement"
                      options={costElementDDL}
                      value={values?.costElement}
                      label="Cost Element"
                      onChange={(valueOption) => {
                        setFieldValue("costElement", valueOption);
                      }}
                      placeholder="Cost Element"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Item Input */}
                  <div className="col-md-12">
                    <div className="row " style={{ paddingTop: "20px" }}>
                      <div className="col-lg-2 pl pr-1 mb-1">
                        <NewSelect
                          name="costComponent"
                          options={componentDDL}
                          value={values?.costComponent}
                          label="Cost Component"
                          onChange={(valueOption) => {
                            setFieldValue("costComponent", valueOption);
                          }}
                          placeholder="Cost Component"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-2 pl pr-1 mb-1">
                        <button
                          class="btn btn-primary ml-2"
                          type="button"
                          style={{ marginTop: "18px" }}
                          onClick={() => {
                            let obj = {
                              transportRouteCostComponentId:
                                values.costComponent.value,
                              transportRouteCostComponent:
                                values.costComponent.label,
                              standardCost: 0,
                              actualCost: 0,
                            };

                            setter(
                              obj,
                              () => {
                                setFieldValue("costComponent", "");
                              },
                              setFieldValue
                            );
                          }}
                          disabled={!values?.costComponent}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className={"table global-table"}>
                        <thead>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "120px" }}>Cost Component</th>
                            <th style={{ width: "100px" }}>Standard Amount</th>
                            <th style={{ width: "50px" }}>Actual Amount</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="align-middle">
                                <div className="text-left pl-2">
                                  {item?.transportRouteCostComponent}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={item.standardCost}
                                    name="standardCost"
                                    onChange={(e) => {
                                      dataHandler(
                                        "standardCost",
                                        e.target.value,
                                        index,
                                        setFieldValue
                                      );
                                    }}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={item.actualCost}
                                    name="actualCost"
                                    onChange={(e) => {
                                      dataHandler(
                                        "actualCost",
                                        e.target.value,
                                        index,
                                        setFieldValue
                                      );
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="text-center align-middle">
                                <span
                                  onClick={() => {
                                    remover(index, setFieldValue);
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <>
                  <h5 className="mt-1">Fuel Cost</h5>
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="Supplier"
                        options={supplierListDDL || []}
                        value={values?.supplier}
                        label="Supplier"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("supplier", valueOption);
                            GetSupplierFuelStationDDL_api(
                              valueOption?.value,
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              (ddlFromResponse) => {
                                setSupplierFuelStationDDL(ddlFromResponse);
                                if (ddlFromResponse?.length > 0) {
                                  setFieldValue(
                                    "fuelStationName",
                                    ddlFromResponse?.[0]
                                  );
                                }
                              }
                            );
                          } else {
                            setFieldValue("supplier", "");
                            setFieldValue("fuelStationName", "");
                          }
                        }}
                        placeholder="Supplier"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="fuelStationName"
                        options={supplierFuelStationDDL || []}
                        value={values?.fuelStationName}
                        label="Fuel Station Name"
                        onChange={(valueOption) => {
                          setFieldValue("fuelStationName", valueOption);
                        }}
                        placeholder="Fuel Station Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="fuelType"
                        options={vhicleFuelTypeDDL || []}
                        value={values?.fuelType}
                        label="Fuel Type"
                        onChange={(valueOption) => {
                          setFieldValue("fuelType", valueOption);
                        }}
                        placeholder="Fuel Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Litter</label>
                      <InputField
                        value={values?.fuelQty}
                        name="fuelQty"
                        placeholder="Litter"
                        type="number"
                        min={0}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Amount</label>
                      <InputField
                        value={values?.fuelAmount}
                        name="fuelAmount"
                        placeholder="Amount"
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (values?.purchaseType === "Credit") {
                            setFieldValue("credit", e.target.value);
                          }
                          setFieldValue("fuelAmount", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Memo No</label>
                      <InputField
                        value={values?.fuelMemoNo}
                        name="fuelMemoNo"
                        placeholder="Memo No"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Date</label>
                      <InputField
                        value={values?.fuelDate}
                        name="fuelDate"
                        placeholder="Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div
                        role="group"
                        aria-labelledby="my-radio-group"
                        className="d-flex justify-content-between mt-5"
                      >
                        <label className="d-flex">
                          <Field
                            type="radio"
                            name="purchaseType"
                            value="Cash"
                            id="Cash"
                            onChange={(e) => {
                              setFieldValue("credit", "");
                              setFieldValue("purchaseType", e.target.value);
                            }}
                          />
                          <span className="pl-1">Cash</span>
                        </label>
                        <label className="d-flex">
                          <Field
                            type="radio"
                            name="purchaseType"
                            value="Credit"
                            id="Credit"
                            onChange={(e) => {
                              setFieldValue("credit", values?.fuelAmount);
                              setFieldValue("purchaseType", e.target.value);
                            }}
                          />
                          <span className="pl-1">Credit</span>
                        </label>
                        <label className="d-flex">
                          <Field
                            type="radio"
                            name="purchaseType"
                            value="Both"
                            id="Both"
                            onChange={(e) => {
                              setFieldValue("credit", "");
                              setFieldValue("purchaseType", e.target.value);
                            }}
                          />
                          <span className="pl-1">Both</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "18px" }}
                        type="button"
                        onClick={() =>
                          setOpen({ type: "fuelCost", isOpen: true })
                        }
                      >
                        Attachment
                      </button>
                    </div>
                    {(values?.purchaseType === "Cash" ||
                      values?.purchaseType === "Both") && (
                      <div className="col-lg-3">
                        <label>Cash</label>
                        <InputField
                          value={values?.cash}
                          name="cash"
                          placeholder="Cash"
                          type="text"
                        />
                      </div>
                    )}
                    {(values?.purchaseType === "Credit" ||
                      values?.purchaseType === "Both") && (
                      <div className="col-lg-3">
                        <label>Credit</label>
                        <InputField
                          value={values?.credit}
                          name="credit"
                          placeholder="Credit"
                          type="text"
                        />
                      </div>
                    )}

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <button
                        class="btn btn-primary ml-2"
                        type="button"
                        style={{ marginTop: "18px" }}
                        onClick={() => {
                          // don't check fuel amount with triple equal, it will make issues / bug
                          if (
                            values?.purchaseType === "Credit" &&
                            +values?.fuelAmount != +values?.credit
                          )
                            return toast.warn(
                              "Credit should be equal to amount"
                            );
                          // don't check fuel amount with triple equal, it will make issues / bug
                          if (
                            values?.purchaseType === "Both" &&
                            +values?.fuelAmount !=
                              +values?.credit + +values?.cash
                          )
                            return toast.warn(
                              "Credit and cash should be equal to amount"
                            );

                          fuleCostHandler(values);
                          //setFieldValue("credit", 0);
                          setFieldValue("cash", 0);
                        }}
                        disabled={
                          !values?.fuelStationName ||
                          !values?.fuelType ||
                          !values?.fuelQty ||
                          !values?.fuelDate ||
                          !values?.fuelAmount ||
                          !values?.fuelMemoNo
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className={"table global-table"}>
                        <thead>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "120px" }}>
                              Fuel Station Name
                            </th>
                            <th style={{ width: "100px" }}>Fuel Type</th>
                            <th style={{ width: "50px" }}>Litter</th>
                            <th style={{ width: "50px" }}>Date</th>
                            <th style={{ width: "50px" }}>Payment Type</th>
                            <th style={{ width: "50px" }}>Cash Amount</th>
                            <th style={{ width: "50px" }}>Credit Amount</th>
                            <th style={{ width: "50px" }}>Fuel Memo No</th>
                            <th style={{ width: "50px" }}>Attachment</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fuleCost?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.fuelStationName}</td>
                              <td>{item?.fuelTypeName}</td>
                              <td>{item?.fuelQty}</td>
                              <td>{item?.fuelDate}</td>
                              <td>{item?.purchaseTypeName}</td>
                              <td>{item?.purchaseCashAmount}</td>
                              <td>{item?.purchaseCreditAmount}</td>
                              <td>{item?.fuelMemoNo || ""}</td>
                              <td className="text-center">
                                {item?.attachmentFileId && (
                                  <IView
                                    clickHandler={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.attachmentFileId
                                        )
                                      );
                                    }}
                                  />
                                )}
                              </td>
                              <td className="text-center align-middle">
                                <IDelete remover={removerTwo} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

                <DropzoneDialogBase
                  filesLimit={open?.type === "fuelCost" ? 1 : 5}
                  acceptedFiles={["image/*", "application/pdf"]}
                  fileObjects={fileObjects}
                  cancelButtonText={"cancel"}
                  submitButtonText={"submit"}
                  maxFileSize={5000000}
                  open={open?.isOpen}
                  onAdd={(newFileObjs) => {
                    setFileObjects([].concat(newFileObjs));
                  }}
                  onDelete={(deleteFileObj) => {
                    const newData = fileObjects.filter(
                      (item) => item.file.name !== deleteFileObj.file.name
                    );
                    setFileObjects(newData);
                  }}
                  onClose={() => {
                    setFileObjects([]);
                    setOpen({});
                  }}
                  onSave={() => {
                    setOpen({});
                    fileUploadFunc();
                  }}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                />
              </Form>
            </>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
