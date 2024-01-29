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

const initData = {
  vahicleCapacity: "",
  daamount: "",
  daComponent: "",
  downTripAllowance: "",
  allowance: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()

//     .shape({
//       label: Yup.string().required("Item is required"),

//       value: Yup.string().required("Item is required"),
//     })

//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),

//   amount: Yup.number().required("Amount is required"),

//   date: Yup.date().required("Date is required"),
// });

export default function KeyRegisterLanding() {
  const [objProps, setObjprops] = useState({});
  const [vehicleDDL, getVehicleDDL, vehicleDDLLoading] = useAxiosGet();
  const [componentDDL, getComponentDDL, componentLoading] = useAxiosGet();
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
      `/tms/AllowenceSetup/AllowanceSetupLanding?AccountId=${accId}&BusinessUnitId=${buId.value}&Componentid=${componentId}`
    );
  };

  //load ddls
  useEffect(() => {
    const handleGetVehicleDDL = async () => {
      await getVehicleDDL(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
    };

    const handleGetComponentDDL = async () => {
      await getComponentDDL(
        `/tms/TransportMgtDDL/GetComponentDDL?AccountId=${accId}`
      );
    };
    Promise.all([
      handleGetVehicleDDL(),
      handleGetComponentDDL(),
      handlegetDownTripAllowanceDDL(48),
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  console.log({vehicleDDL, componentDDL, downTripAllowanceDDL})

  const saveHandler = (values, cb) => {
    alert("Working...");
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
          {(vehicleDDLLoading || componentLoading || downTripAllowanceDDLLoading) && <Loading />}

          <IForm title="Vehicle Allowance Setup" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="vehicleCapacity"
                    options={vehicleDDL || []}
                    value={values?.vehicleCapacity}
                    label="Vahicle Capacity"
                    onChange={(valueOption) => {
                      setFieldValue("vehicleCapacity", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="daComponent"
                    options={componentDDL || []}
                    value={values?.daComponent}
                    label="DA Component"
                    onChange={(valueOption) => {
                      setFieldValue("daComponent", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                  <label>DA Amount</label>
                  <InputField
                    value={values?.daamount || ""}
                    name="daamount"
                    placeholder="DA Amount"
                    onChange={(e) => {
                      NegetiveCheck(e.target.value, setFieldValue, "daamount");
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
                    options={downTripAllowanceDDL || []}
                    value={values?.downTripAllowance}
                    label="Down Trip Allowance Component"
                    onChange={(valueOption) => {
                      setFieldValue("downTripAllowance", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-1 pl-2 bank-journal">
                  <button
                    style={{ marginTop: "10px" }}
                    type="button"
                    disabled={
                      !values?.vahicleCapacity ||
                      !values?.daamount ||
                      !values?.daComponent ||
                      !values?.downTripAllowance ||
                      !values?.allowance
                    }
                    className="btn btn-primary"
                    onClick={() => {
                      const newValus = {
                        vehicleCapacityId: values?.vahicleCapacity?.value,
                        vehicleCapacityName: values?.vahicleCapacity?.label,
                        daamount: +values?.daamount,
                        dacostComponentId: values?.daComponent?.value,
                        dacostComponentName: values?.daComponent?.label,
                        downTripAllowance: +values?.downTripAllowance,
                        downTripAllowanceId: values?.allowance?.value,
                        downTripAllowanceName: values?.allowance?.label,
                        isDeleted: true,
                      };
                      //   setter(newValus);
                    }}
                  >
                    Add
                  </button>
                </div>
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
