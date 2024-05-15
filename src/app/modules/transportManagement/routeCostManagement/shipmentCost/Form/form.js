/* eslint-disable eqeqeq */
import { Field, Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { GetSupplierFuelStationDDL_api, getComponentDDL } from "../helper";
import IView from "./../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";
import {
  GetSupplierListDDL_api,
  GetVehicleFuelTypeDDL_api,
  getBusinessUnitDDL_api,
  multipleAttachment_action,
} from "./../helper";
import ChalanInfo from "./ChalanInfo";
import AttachmentGrid from "./attachmentGrid";
import "./form.scss";
// Validation schema
const validationSchema = Yup.object().shape({
  extraMillage: Yup.string()
    .min(0, "Minimum 0 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Extra Millage is required")
    .nullable(),
  downTripCash: Yup.number()
    .min(0, "Minimum 0 symbols")
    .nullable(),
  downTripCredit: Yup.number()
    .min(0, "Minimum 0 symbols")
    .nullable(),
  businessUnitName: Yup.object()
    .when("downTripCredit", (downTripCredit, Schema) => {
      if (+downTripCredit > 0)
        return Schema.required("BusinessUnit Name is required");
    })
    .nullable(),
  vehicleInDate: Yup.string().when(
    "vehicleInDateValidation",
    (vehicleInDateValidation, Schema) => {
      if (vehicleInDateValidation)
        return Schema.required("Instrument date is required");
    }
  ),
  vehicleInTime: Yup.string().when(
    "vehicleInDateValidation",
    (vehicleInDateValidation, Schema) => {
      if (vehicleInDateValidation) return Schema.required("Time is required");
    }
  ),
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
  removerTwo,
  distanceKM,
  vehicleReant,
  vehicleReantUpdateFunc,
  vehicleReantOnChangeFunc,
  distanceKMOnChangeFunc,
  distanceKMOUpdateFunc,
  fuleCostHandler,
  shipmentId,
  extraMillageOnChangeHandler,
  fuelRateOnChangeHandler,
  fileObjects,
  setFileObjects,
  setUploadImage,
  setUploadImageTwo,
  setAttachmentGridFunc,
  attachmentGrid,
  uploadImageTwo,
  removerAttachmentGridRow,
  netPayable,
  setNetPayable,
  dicrementNetPayable,
  setAdvanceAmount,
  netPayableCalculatorFunc,
}) {
  const location = useLocation();
  const reportTypeComplete =
    location?.state?.values.reportType?.label === "Complete";
  const [open, setOpen] = React.useState({});
  const [componentDDL, setComponentDDL] = useState([]);
  const [businessUnitName, setbusinessUnitName] = useState([]);
  const [vhicleFuelTypeDDL, setVhicleFuelTypeDDL] = useState([]);
  const [supplierListDDL, setSupplierListDDL] = useState([]);
  const [supplierFuelStationDDL, setSupplierFuelStationDDL] = useState([]);
  const history = useHistory();

  const [
    profitCenterDDL,
    getProfitCenterDDL,
    profitCenterDDlloader,
    setProfitCenterDDL,
  ] = useAxiosGet();
  const [costCenterDDL, getCostCenterDDL, costCenterDDlloader] = useAxiosGet();
  const [
    costElementDDL,
    getCostElementDDL,
    costElementDDlloader,
  ] = useAxiosGet();

  const [total, setTotal] = useState({ totalStandardCost: 0, totalActual: 0 });
  const dispatch = useDispatch();
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

  //total amount calculation
  useEffect(() => {
    let totalStandardCost = 0;
    let totalActual = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalStandardCost += +rowDto[i].standardCost;
        totalActual += +rowDto[i].actualCost;
      }
    }
    setTotal({ totalStandardCost, totalActual });
  }, [rowDto]);

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
        transportRouteCostComponentId: downTripData?.daCostComponentId,
        transportRouteCostComponent: downTripData?.daCostComponentName,
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
        transportRouteCostComponentId: downTripData?.downTripAllowanceId,
        transportRouteCostComponent: downTripData?.downTripAllowanceName,
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
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          let confirmObject = {
            title: `Are you sure "transfer ${values?.handleType}" ?`,
            yesAlertFunc: () => {
              saveHandler(values, () => {
                resetForm(initData);
                setRowDto([]);
              });
            },
            noAlertFunc: () => {},
          };
          IConfirmModal(confirmObject);
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
            title="Create Shipment Cost"
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
                {reportTypeComplete ? (
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2"}
                    onClick={() => {
                      setFieldValue("handleType", "in");
                      handleSubmit();
                    }}
                  >
                    In
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2"}
                    onClick={() => {
                      setFieldValue("handleType", "out");
                      handleSubmit();
                    }}
                  >
                    Out
                  </button>
                )}
              </>
            )}
          >
            <>
              {(costElementDDlloader ||
                costCenterDDlloader ||
                profitCenterDDlloader) && <Loading />}
              <Form className="form form-label-right position-relative shipmentCostFormWrapper">
                <p
                  style={{
                    position: "absolute",
                    top: "-52px",
                    left: "40%",
                    border: "2px solid #ffa800",
                    padding: "2px 9px",
                    borderRadius: "4px",
                    fontSize: "18px",
                  }}
                >
                  <b>Pay to Driver: </b>
                  {_fixedPoint(netPayable || 0, true, 0)}
                </p>
                <div className="row global-form">
                  <div className="col-lg-12">
                    <div
                      className="row bank-journal  "
                      style={{ paddingBottom: "20px 0" }}
                    >
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Vehicle No"
                          value={values?.vehicleNo}
                          name="vehicleNo"
                          placeholder="vehial No"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Driver Name"
                          value={values?.driverName}
                          name="driverName"
                          placeholder="Driver Name"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Route Name"
                          value={values?.routeName}
                          name="routeName"
                          placeholder="Route Name"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Distance (KM)"
                          value={values?.distanceKm}
                          name="distanceKm"
                          placeholder="Distance Km"
                          type="number"
                          disabled={true}
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
                            setFieldValue("extraMillage", e.target.value);
                            extraMillageOnChangeHandler({
                              setFieldValue,
                              values: {
                                ...values,
                                extraMillage: e.target.value,
                              },
                            });
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
                          disabled={true}
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
                          value={_fixedPoint(total.totalStandardCost || 0)}
                          name="totalStandardCost"
                          placeholder="Total Standard Cost"
                          type="number"
                          disabled={true}
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
                          value={_fixedPoint(total?.totalActual || 0)}
                          name="totalActualCost"
                          placeholder="Total Actual"
                          type="number"
                          disabled={true}
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
                          disabled={true}
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
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <InputField
                          label="Down Trip Credit"
                          value={values?.downTripCredit}
                          onChange={(e) => {
                            setFieldValue("downTripCredit", e.target.value);
                            netPayableCalculatorFunc(
                              fuleCost,
                              rowDto,
                              +e.target.value,
                              +values?.downTripCash
                            );
                          }}
                          name="downTripCredit"
                          placeholder="Down Trip Credit"
                          type="number"
                          min="0"
                        />
                      </div>
                      {reportTypeComplete && (
                        <>
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
                        </>
                      )}
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
                      <div className="col-lg-3 fuelRate">
                        <label>Fuel Rate</label>
                        <InputField
                          value={values?.fuelRate}
                          name="fuelRate"
                          placeholder="Fuel Rate"
                          type="number"
                          onChange={(e) => {
                            // max fuel rate 200 check
                            if (+e.target.value > 200)
                              return toast.warn(
                                "Fuel rate can't be more than 200"
                              );
                            setFieldValue("fuelRate", e.target.value);
                            fuelRateOnChangeHandler({
                              setFieldValue,
                              values: {
                                ...values,
                                fuelRate: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Total Fuel Cost</label>
                        <InputField
                          value={values?.totalFuelCost}
                          name="totalFuelCost"
                          placeholder="Total Fuel Cost"
                          type="number"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Total Fuel Cost Liter</label>
                        <InputField
                          value={values?.totalFuelCostLtr}
                          name="totalFuelCostLtr"
                          placeholder="Total Fuel Cost Liter"
                          type="number"
                          disabled={true}
                        />
                      </div>{" "}
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
                          style={{ marginTop: "13px" }}
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
                          style={{ marginTop: "13px" }}
                          onClick={() => {
                            let standardCost = 0;
                            let actualCost = 0;
                            let componentId = +values?.costComponent?.value;
                            if (componentId === 47) {
                              standardCost = +values?.totalFuelCost || 0;
                              actualCost = +values?.totalFuelCost || 0;
                              // actualCost = +values?.totalFuelCost || 0;
                            }
                            console.log("standard", standardCost);
                            console.log("actual", actualCost);
                            let obj = {
                              transportRouteCostComponentId:
                                values.costComponent.value,
                              transportRouteCostComponent:
                                values.costComponent.label,
                              standardCost: standardCost,
                              actualCost: actualCost,
                            };
                            console.log("obj", obj);
                            setter(obj, () => {
                              setFieldValue("costComponent", "");
                            });
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
                                  {item?.standardCost}
                                  {/* <input
                                    type="number"
                                    className="form-control"
                                    value={item.standardCost}
                                    name="standardCost"
                                    onChange={(e) => {
                                      dataHandler(
                                        "standardCost",
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  /> */}
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
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="text-center align-middle">
                                <IDelete remover={remover} id={index} />
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
                          setFieldValue("supplier", valueOption);
                          setFieldValue("fuelStationName", "");
                          GetSupplierFuelStationDDL_api(
                            valueOption?.value,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setSupplierFuelStationDDL
                          );
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
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
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
                    <div className="col-lg-3">
                      <label>Fuel Memo No</label>
                      <InputField
                        value={values?.fuelMemoNo}
                        name="fuelMemoNo"
                        placeholder="Fuel Memo No"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-1">
                      <button
                        class="btn btn-primary ml-2"
                        type="button"
                        style={{ marginTop: "13px" }}
                        onClick={() => {
                          // don't check fuel amount with triple equal, it will make issues / bug
                          if (
                            values?.purchaseType === "Credit" &&
                            values?.fuelAmount != +values?.credit
                          )
                            return toast.warn(
                              "Credit should be equal to amount"
                            );
                          // don't check fuel amount with triple equal, it will make issues / bug
                          if (
                            values?.purchaseType === "Both" &&
                            values?.fuelAmount !=
                              +values?.credit + +values?.cash
                          )
                            return toast.warn(
                              "Credit and cash should be equal to amount"
                            );

                          fuleCostHandler(values);
                          setFieldValue("credit", 0);
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

                <div className="row">
                  <div className="col-lg-6 mt-2">
                    <h5 className="mt-1">Distance KM</h5>
                  </div>
                  <div className="col-lg-6 mt-2">
                    {" "}
                    <h5 className="mt-1">Vehicle Rent</h5>
                  </div>
                  {/* distanceKM talbe */}
                  <div className="col-lg-6">
                    <div className="table-responsive">
                      <table className={"table global-table"}>
                        <thead>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "120px" }}>Customer Name </th>
                            <th style={{ width: "100px" }}>Address</th>
                            <th style={{ width: "50px" }}>Distance KM</th>
                            {!reportTypeComplete && (
                              <th style={{ width: "50px" }}>Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {distanceKM?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strPartnerShippingName}</td>
                              <td>{item?.strPartnerShippingAddress}</td>
                              <td>
                                <InputField
                                  value={item?.numDistanceKM}
                                  name="names"
                                  placeholder="Distance KM"
                                  type="number"
                                  min="1"
                                  required
                                  onChange={(e) => {
                                    distanceKMOnChangeFunc(
                                      e?.target?.value,
                                      index
                                    );
                                  }}
                                  disabled={reportTypeComplete}
                                />
                              </td>
                              {!reportTypeComplete && (
                                <td className="text-center align-middle">
                                  {item?.isUpdateBtnClick ? null : (
                                    <button
                                      className="btn btn-danger"
                                      type="button"
                                      onClick={() => {
                                        distanceKMOUpdateFunc(
                                          item,
                                          index,
                                          values,
                                          setFieldValue
                                        );
                                      }}
                                    >
                                      Update
                                    </button>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vehicle Reant table */}
                  <div className="col-lg-6 table-responsive">
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Customer Name </th>
                          <th style={{ width: "100px" }}>Address</th>
                          <th style={{ width: "50px" }}>Rent Amount</th>
                          {!reportTypeComplete &&
                            selectedBusinessUnit?.value !== 4 && (
                              <th style={{ width: "50px" }}>Action</th>
                            )}
                        </tr>
                      </thead>
                      <tbody>
                        {vehicleReant?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.partnerShippingName}</td>
                            <td>{item?.partnerShippingAddress}</td>
                            <td>
                              <InputField
                                value={item?.rentAmount}
                                name="names"
                                placeholder="Rent Amount"
                                type="number"
                                min="1"
                                onChange={(e) => {
                                  vehicleReantOnChangeFunc(
                                    e?.target?.value,
                                    index
                                  );
                                }}
                                disabled={
                                  reportTypeComplete ||
                                  selectedBusinessUnit?.value === 4
                                }
                              />
                            </td>
                            {!reportTypeComplete &&
                              selectedBusinessUnit?.value !== 4 && (
                                <td className="text-center align-middle">
                                  {item?.isUpdateBtnClick ? null : (
                                    <button
                                      className="btn btn-danger"
                                      type="button"
                                      onClick={() => {
                                        vehicleReantUpdateFunc(item, index);
                                      }}
                                    >
                                      Update
                                    </button>
                                  )}
                                </td>
                              )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Chalan Info start */}
                  <ChalanInfo
                    shipmentId={shipmentId}
                    setAttachmentGridFunc={setAttachmentGridFunc}
                  />
                  {/* Chalan Info end */}

                  <AttachmentGrid
                    setOpen={setOpen}
                    attachmentGrid={attachmentGrid}
                    uploadImageTwo={uploadImageTwo}
                    values={values}
                    setAttachmentGridFunc={setAttachmentGridFunc}
                    removerAttachmentGridRow={removerAttachmentGridRow}
                  />
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
                  maxFileSize={1000000}
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
                    multipleAttachment_action(fileObjects)
                      .then((data) => {
                        setUploadImage(open?.type === "fuelCost" && data?.[0]);
                        setUploadImageTwo(
                          open?.type === "attachMentGrid" && data
                        );
                        setFileObjects([]);
                      })
                      .catch((err) => setFileObjects([]));
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
