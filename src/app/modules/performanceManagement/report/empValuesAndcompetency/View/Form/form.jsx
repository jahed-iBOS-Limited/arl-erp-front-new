import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ValuesTable from "../Table/_valuesTable";
import CompetencyTable from "../Table/_competencyTable";
import MeasuringScale from "../../../../_helper/_measuringScale";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getMeasuringScaleAction } from "../../../../_redux/Actions";
import { getMeasuringScaleBottomAction } from "./../../../../_redux/Actions";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  employeeBasicInfo,
  yearDDL,
  valueList,
  competencyList,
  vcData,
  year,
  valuesData,
  setValuesData,
  competencyData,
  setCompetencyData,
  profileData,
  headerData,
  measuringScaleButtom,
  measureScaleTop,
  selectedBusinessUnit,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getMeasuringScaleAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getMeasuringScaleBottomAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  const getApiTotalMeasureValueEmp = vcData
    ?.filter((itm) => itm?.typeId === 2)
    .reduce((acc, val) => acc + val?.numMeasureValueByEmployee, 0);

  const valueMeasureNameBySupervisor = vcData
    ?.filter((itm) => itm?.typeId === 2)
    .reduce((acc, val) => acc + val?.numMeasureValueBySupervisor, 0);

  //COMPETENCY calculation
  const getApiTotalCompetencyDataEmp = vcData
    ?.filter((itm) => itm?.typeId === 3)
    .reduce((acc, val) => acc + val?.numMeasureValueByEmployee, 0);
  const comMeasureNameBySupervisor = vcData
    ?.filter((itm) => itm?.typeId === 3)
    .reduce((acc, val) => acc + val?.numMeasureValueBySupervisor, 0);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let reportEmpValuesComp = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 282) {
      reportEmpValuesComp = userRole[i];
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
          searchEmployee: {
            value: profileData.userId,
            label: profileData.userName,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (reportEmpValuesComp?.isCreate) {
            saveHandler(values, () => {
              resetForm(initData);
            });
          } else {
            toast.warning("You don't have access");
          }
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
            {disableHandler(!isValid || vcData?.length)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <p className="mt-3 employee_info">
                    <b>Employee Name</b>: {headerData?.employeeName}
                  </p>
                </div>
                <div className="col-lg-3">
                  <p className="mt-3 employee_info">
                    <b>Year</b>: {headerData?.year}
                  </p>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-12">
                  {employeeBasicInfo && (
                    <p className="mt-3 employee_info">
                      <b>Designation</b>: {employeeBasicInfo?.designationName},{" "}
                      <b>Department</b>: {employeeBasicInfo?.departmentName},{" "}
                      <b>Supervisor</b>: {employeeBasicInfo?.supervisorName},{" "}
                      <b>Sbu</b>: {employeeBasicInfo?.sbuName},{" "}
                      <b>Business Unit</b>:{" "}
                      {employeeBasicInfo?.businessUnitName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h5 className="mb-1">VALUES</h5>
                <hr className="mt-0 p-0" />
                <div className="d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    <ValuesTable
                      headerName="Values Name"
                      isEmployee={true}
                      data={valueList}
                      vcData={vcData}
                      viewModalPath="/performance-management/employee-entry/view"
                      valuesData={valuesData}
                      setValuesData={setValuesData}
                    />
                  </div>

                  <MeasuringScale
                    measureByEmployee={getApiTotalMeasureValueEmp}
                    measureScale={measureScaleTop}
                    measureBySupervisor={valueMeasureNameBySupervisor}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h5 className="mb-1">COMPETENCIES</h5>
                <hr className="mt-0 p-0" />
                <div className="d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    <CompetencyTable
                      headerName="Competency Name"
                      isEmployee={true}
                      data={competencyList}
                      vcData={vcData}
                      competencyData={competencyData}
                      setCompetencyData={setCompetencyData}
                      viewModalPath="/performance-management/employee-entry/view"
                    />
                  </div>

                  <MeasuringScale
                    measureByEmployee={getApiTotalCompetencyDataEmp}
                    measureScale={measuringScaleButtom}
                    measureBySupervisor={comMeasureNameBySupervisor}
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
