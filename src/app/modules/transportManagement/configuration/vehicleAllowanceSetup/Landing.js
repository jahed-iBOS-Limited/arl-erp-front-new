import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { NegetiveCheck } from "../../../_helper/_negitiveCheck";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import DailyAllowanceTable from "./components/componentTable/dailyAllowanceTable";
import MilageAllowanceTable from "./components/componentTable/milageAllowanceTable";
import CarryingAllowanceTable from "./components/componentTable/carryingAllowanceTable";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  vahicleCapacity: "",
  daamount: "",
  daComponent: "",
  downTripAllowance: "",
  allowance: "",
  localMillageRate: "",
  outerMillageRate: "",
  carrierAllowanceRate: "",
};

export default function KeyRegisterLanding() {
  const [objProps, setObjprops] = useState({});
  const [gridData, setGridData] = useState([]);
  const [vehicleDDL, getVehicleDDL, vehicleDDLLoading] = useAxiosGet();
  const [, createAllowance, createAllowanceLoading] = useAxiosPost();
  const [
    componentDDL,
    getComponentDDL,
    componentLoading,
    setComponentDDL,
  ] = useAxiosGet();
  const [
    downTripAllowanceDDL,
    getDownTripAllowanceDDL,
    downTripAllowanceDDLLoading,
  ] = useAxiosGet();

  const {
    selectedBusinessUnit: buId,
    profileData: { accountId: accId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const handlegetDownTripAllowanceDDL = async (componentId) => {
    await getDownTripAllowanceDDL(
      `/tms/AllowenceSetup/AllowanceSetupLanding?AccountId=${accId}&BusinessUnitId=${buId.value}&Componentid=${componentId}`,
      (data) => setGridData(data)
    );
  };

  //load ddls
  useEffect(() => {
    const handleGetVehicleDDL = async () => {
      await getVehicleDDL(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
    };

    const handleGetComponentDDL = async () => {
      await getComponentDDL(
        `/tms/TransportMgtDDL/GetComponentDDL?AccountId=${accId}`,
        (data) => {
          //this filteration is based on the requirement from backend(dev:Monir bhai)
          const filterByDA_costComponentId = data.filter(
            (item) => item.value === 50 || item.value === 51
          );
          setComponentDDL(filterByDA_costComponentId);
        }
      );
    };
    Promise.all([
      handleGetVehicleDDL(),
      handleGetComponentDDL(),
      // handlegetDownTripAllowanceDDL(48),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const isButtonDisabled = (values) => {
    const {
      daComponent,
      vahicleCapacity,
      localMillageRate,
      outerMillageRate,
      carrierAllowanceRate,
    } = values || {};

    if (daComponent?.value === 50) {
      return !vahicleCapacity || !localMillageRate || !outerMillageRate;
    } else if (daComponent?.value === 51) {
      return !vahicleCapacity || !carrierAllowanceRate;
    } else {
      return true;
    }
  };

  //add new allowance
  const AddAllowance = (newRowData, gridData, setGridData) => {
    let updatedGridData;
    const duplicate = gridData?.filter(
      (item) => item?.vehicleCapacityId === newRowData?.vehicleCapacityId
    );
    if (duplicate?.length > 0) {
      return toast.warning("You cannot add duplicate item.");
    } else {
      updatedGridData = [newRowData, ...gridData];
      setGridData(updatedGridData);
    }
  };

  const removeRowData = (nthItem) => {
    const filterArr = gridData.toSpliced(nthItem, 1);
    setGridData(filterArr);
  };

  const saveHandler = (values, cb) => {
    const api = `/tms/AllowenceSetup/CreateMilageAndCarryingAllowanceSetup`;
    createAllowance(api, gridData, undefined, true);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
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
          {(vehicleDDLLoading ||
            componentLoading ||
            downTripAllowanceDDLLoading ||
            createAllowanceLoading) && <Loading />}

          <IForm title="Vehicle Allowance Setup" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="daComponent"
                    options={componentDDL || []}
                    value={values?.daComponent}
                    label="DA Component"
                    onChange={(valueOption) => {
                      setFieldValue("daamount", "");
                      setFieldValue("downTripAllowance", "");
                      setFieldValue("localMillageRate", "");
                      setFieldValue("outerMillageRate", "");
                      setFieldValue("carrierAllowanceRate", "");
                      if (valueOption) {
                        setFieldValue("daComponent", valueOption);
                        handlegetDownTripAllowanceDDL(valueOption?.value);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vahicleCapacity"
                    options={vehicleDDL || []}
                    value={values?.vehicleCapacity}
                    label="Vahicle Capacity"
                    onChange={(valueOption) => {
                      setFieldValue("vahicleCapacity", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* this id (48) is currently disabled. but for future implementation we just need to activate the daComponentDDL */}
                {[48].includes(values?.daComponent?.value) && (
                  <>
                    <div className="col-lg-3 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>DA Amount</label>
                      <InputField
                        value={values?.daamount || ""}
                        name="daamount"
                        placeholder="DA Amount"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "daamount"
                          );
                        }}
                        type="number"
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Down Trip Allowance Amount</label>
                      <InputField
                        value={values?.downTripAllowance || ""}
                        name="downTripAllowance"
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "downTripAllowance"
                          );
                        }}
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="downTripAllowance"
                        options={componentDDL || []}
                        value={values?.downTripAllowance}
                        label="Down Trip Allowance Component"
                        onChange={(valueOption) => {
                          setFieldValue("downTripAllowance", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}

                {[50].includes(values?.daComponent?.value) && (
                  <>
                    <div className="col-lg-3 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Local Millage Rate</label>
                      <InputField
                        value={values?.localMillageRate || ""}
                        name="localMillageRate"
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "localMillageRate"
                          );
                        }}
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Outer Millage Rate </label>
                      <InputField
                        value={values?.outerMillageRate || ""}
                        name="outerMillageRate"
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "outerMillageRate"
                          );
                        }}
                        // disabled={isEdit}
                      />
                    </div>
                  </>
                )}
                {[51].includes(values?.daComponent?.value) && (
                  <>
                    <div className="col-lg-3 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Carring Allowance Rate </label>
                      <InputField
                        value={values?.carrierAllowanceRate || ""}
                        name="carrierAllowanceRate"
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "carrierAllowanceRate"
                          );
                        }}
                        // disabled={isEdit}
                      />
                    </div>
                  </>
                )}

                <div className="col-lg-1 pl-4 mt-2 bank-journal">
                  <button
                    style={{ marginTop: "10px" }}
                    type="button"
                    // disabled={isButtonDisabled(values)}
                    className="btn btn-primary"
                    onClick={() => {
                      const rowData = {
                        configId: 0,
                        vehicleCapacityId: values?.vahicleCapacity?.value || 0,
                        vehicleCapacityName:
                          values?.vahicleCapacity?.label || "",
                        daamount: +values?.daamount,
                        dacostComponentId: values?.daComponent?.value || 0,
                        dacostComponentName: values?.daComponent?.label || "",
                        downTripAllowance: +values?.downTripAllowance || 0,
                        downTripAllowanceId: values?.allowance?.value || 0,
                        downTripAllowanceName: values?.allowance?.label || "",
                        localMillageRate: +values?.localMillageRate || 0,
                        outerMillageRate: +values?.outerMillageRate || 0,
                        carrierAllowanceRate:
                          +values?.carrierAllowanceRate || 0,
                        isDeleted: true,
                      };
                      console.log({ rowData });
                      AddAllowance(rowData, gridData, setGridData);
                      setFieldValue("daamount", "");
                      setFieldValue("downTripAllowance", "");
                      setFieldValue("localMillageRate", "");
                      setFieldValue("outerMillageRate", "");
                      setFieldValue("outerMillageRate", "");
                      setFieldValue("carrierAllowanceRate", "");
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {[48].includes(values.daComponent?.value) && (
                <DailyAllowanceTable
                  gridData={gridData}
                  setGridData={setGridData}
                  removeRowData={removeRowData}
                  values={values}
                />
              )}
              {[50].includes(values.daComponent?.value) && (
                <MilageAllowanceTable
                  gridData={gridData}
                  setGridData={setGridData}
                  removeRowData={removeRowData}
                  values={values}
                />
              )}

              {[51].includes(values.daComponent?.value) && (
                <CarryingAllowanceTable
                  gridData={gridData}
                  setGridData={setGridData}
                  removeRowData={removeRowData}
                  values={values}
                />
              )}

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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
