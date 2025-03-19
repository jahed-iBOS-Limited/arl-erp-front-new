import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getDifferenceBetweenTime } from "../../../msilProduction/meltingProduction/helper";

export default function ProductionBreakdownForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  validationSchema,
  id,
  shopFloorDDL,
  getShopFloorDDL,
  breakdownTypeDDL,
  getBreakdownTypeDDL,
  machineDDL,
  getMachineDDL,
  subMachineNameDDL,
  getSubMachineNameDDL,
  partsNameDDL,
  getPartsNameDDL,
}) {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getShopFloorDDL(
      `/mes/MSIL/GetAllMSIL?PartName=ShopFloorDDLByBusinessUnitId&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit?.value]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloorDDL || []}
                    value={values?.shopFloor}
                    label="Shop Floor"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shopFloor", valueOption);
                        setFieldValue("breakdownType", "");
                        setFieldValue("machineName", "");
                        setFieldValue("subMachineName", "");
                        setFieldValue("partsName", "");
                        getBreakdownTypeDDL(
                          `/mes/MSIL/GetAllMSIL?PartName=BreakDownTypeDDL&AutoId=${valueOption?.value}`
                        );
                        getMachineDDL(
                          `/mes/MSIL/GetAllMSIL?PartName=BreakDownMachineDDL&AutoId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("shopFloor", "");
                        setFieldValue("breakdownType", "");
                        setFieldValue("machineName", "");
                        setFieldValue("subMachineName", "");
                        setFieldValue("partsName", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="breakdownType"
                    options={breakdownTypeDDL || []}
                    value={values?.breakdownType}
                    label="Breakdown Type"
                    onChange={(valueOption) => {
                      setFieldValue("breakdownType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="machineName"
                    options={machineDDL || []}
                    value={values?.machineName}
                    label="Machine Name"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("machineName", valueOption);
                        setFieldValue("subMachineName", "");
                        setFieldValue("partsName", "");

                        getSubMachineNameDDL(
                          `/mes/MSIL/GetAllMSIL?PartName=BreakDownMachinePartsDDL&AutoId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("machineName", "");
                        setFieldValue("subMachineName", "");
                        setFieldValue("partsName", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {console.log("subMachineNameDDL", subMachineNameDDL)}
                <div className="col-lg-3">
                  <NewSelect
                    name="subMachineName"
                    options={subMachineNameDDL || []}
                    value={values?.subMachineName}
                    label="Sub Machine Name"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("subMachineName", valueOption);
                        setFieldValue("partsName", "");
                        getPartsNameDDL(
                          `/mes/MSIL/GetAllMSIL?PartName=BreakDownPartsDDL&AutoId=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("subMachineName", "");
                        setFieldValue("partsName", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="partsName"
                    options={partsNameDDL || []}
                    value={values?.partsName}
                    label="Parts Name"
                    onChange={(valueOption) => {
                      setFieldValue("partsName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Breakdown Date"
                    name="date"
                    type="date"
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: "A", label: "A" },
                      { value: "B", label: "B" },
                      { value: "C", label: "C" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      setFieldValue("shift", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.startTime}
                    label="Start Time"
                    name="startTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select Breakdown date");
                      setFieldValue("startTime", e.target.value);
                      if (values?.date && values?.endTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          e.target.value,
                          values?.endTime
                        );
                        setFieldValue("totalTime", difference);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.endTime}
                    label="End Time"
                    name="endTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select Breakdown date");
                      setFieldValue("endTime", e.target.value);
                      if (values?.date && values?.startTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          values?.startTime,
                          e.target.value
                        );
                        setFieldValue("totalTime", difference);
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.totalTime}
                    label="Total Time"
                    name="totalTime"
                    type="text"
                  />
                </div>

                <div className="col-lg-6">
                  <InputField
                    value={values?.details}
                    label="Breakdown Details"
                    name="details"
                    type="text"
                  />
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
