/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useHistory } from "react-router-dom";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getComponentDDL, GetSupplierFuelStationDDL_api } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GetVehicleFuelTypeDDL_api,
  GetSupplierListDDL_api,
  multipleAttachment_action,
  getBusinessUnitDDL_api,
} from "./../helper";
import ChalanInfo from "./ChalanInfo";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import IView from "./../../../../_helper/_helperIcons/_view";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";
import AttachmentGrid from "./attachmentGrid";
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
  netPayableCalculatorFunc
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
  const [total, setTotal] = useState({ totalStandardCost: 0, totalActual: 0 });
  const dispatch = useDispatch();
  useEffect(() => {
    if (profileData.accountId) {
      getComponentDDL(profileData.accountId, setComponentDDL);
    }
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
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
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
              <Form className="form form-label-right position-relative">
                <p style={{ position: "absolute", top: "-46px", left: "45%" }}>
                  <b>Pay to Driver: </b>
                  {netPayable}
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
                          value={total.totalStandardCost}
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
                          value={total?.totalActual}
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
                            setFieldValue('downTripCash', e.target.value);
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
                            setFieldValue('downTripCredit', e.target.value);
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
                            let obj = {
                              transportRouteCostComponentId:
                                values.costComponent.value,
                              transportRouteCostComponent:
                                values.costComponent.label,
                              standardCost: 0,
                              actualCost: 0,
                            };

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
                  <div className="col-lg-12 table-responsive">
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
                                      index
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
                          !values?.fuelAmount
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </>

                <div className="row">
                  <div className="col-lg-12 table-responsive">
                    <table className={"table global-table"}>
                      <thead>
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Fuel Station Name</th>
                          <th style={{ width: "100px" }}>Fuel Type</th>
                          <th style={{ width: "50px" }}>Litter</th>
                          <th style={{ width: "50px" }}>Date</th>
                          <th style={{ width: "50px" }}>Payment Type</th>
                          <th style={{ width: "50px" }}>Cash Amount</th>
                          <th style={{ width: "50px" }}>Credit Amount</th>
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

                <div className="row">
                  <div className="col-lg-6 mt-2">
                    <h5 className="mt-1">Distance KM</h5>
                  </div>
                  <div className="col-lg-6 mt-2">
                    {" "}
                    <h5 className="mt-1">Vehicle Rent</h5>
                  </div>
                  {/* distanceKM talbe */}
                  <div className="col-lg-6 table-responsive">
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
                                <button
                                  class={
                                    item?.isUpdateBtnClick
                                      ? "btn btn-success"
                                      : "btn btn-primary"
                                  }
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
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                          {!reportTypeComplete && (
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
                                disabled={reportTypeComplete}
                              />
                            </td>
                            {!reportTypeComplete && (
                              <td className="text-center align-middle">
                                <button
                                  class={
                                    item?.isUpdateBtnClick
                                      ? "btn btn-success"
                                      : "btn btn-primary"
                                  }
                                  type="button"
                                  onClick={() => {
                                    vehicleReantUpdateFunc(item, index);
                                  }}
                                >
                                  Update
                                </button>
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
                    setFileObjects([])
                    setOpen({})
                  }}
                  onSave={() => {
                    setOpen({});
                    multipleAttachment_action(fileObjects).then((data) => {
                      setUploadImage(open?.type === "fuelCost" && data?.[0]);
                      setUploadImageTwo(
                        open?.type === "attachMentGrid" && data
                      );
                      setFileObjects([])
                    }).catch((err) => setFileObjects([]));
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
