import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  GetDomesticPortDDL,
  GetLighterConsigneeDDL,
  GetLighterVesselDDL,
  getCargoDDL,
  getMotherVesselDDL,
} from "../../../helper";
import { validationSchemaTripCreate } from "../utils";
import { ExpenseSection } from "./components/expense";
import { HeaderSection } from "./components/header";
import { OperationSection } from "./components/operation";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  loading,
  setLoading,
  rowData,
  setRowData,
}) {
  const history = useHistory();
  const [lighterDDL, setLighterDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [voyageDDL, setVoyageDDL] = useState([]);
  const [consigneePartyDDL, setConsigneePartyDDL] = useState([]);
  const [cargoDDL, setCargoDDL] = useState([]);
  const [editMode, setEditMode] = useState({ mode: false });

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    GetLighterVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLighterDDL
    );
    GetLighterConsigneeDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setConsigneePartyDDL
    );
    getMotherVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setMotherVesselDDL
    );
    getCargoDDL(setCargoDDL);
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchemaTripCreate}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setEditMode({ mode: false });
            setRowData([]);
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
          setValues,
          setTouched,
          setErrors,
        }) => (
          <>
            <form>
              <div className="marine-form-card">
                <div className="marine-form-card-heading">
                  <p>
                    {title}{" "}
                    {values?.tripNo ? `(Trip No: ${values?.tripNo})` : ""}{" "}
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => history.goBack()}
                      className={"btn btn-secondary reset-btn ml-2 px-3 py-2"}
                    >
                      <i className="fa fa-arrow-left mr-1"></i>
                      Back
                    </button>
                    {viewType !== "view" && (
                      <button
                        type="button"
                        onClick={() => resetForm(initData)}
                        className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                      >
                        Reset
                      </button>
                    )}

                    {viewType !== "view" && (
                      <button
                        type="submit"
                        className={"btn btn-success ml-2 px-3 py-2"}
                        onClick={handleSubmit}
                        disabled={false}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
                <HeaderSection
                  viewType={viewType}
                  lighterDDL={lighterDDL}
                  setLighterDDL={setLighterDDL}
                  portDDL={portDDL}
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  setPortDDL={setPortDDL}
                />
              </div>

              <OperationSection
                viewType={viewType}
                setLoading={setLoading}
                rowData={rowData}
                setRowData={setRowData}
                motherVesselDDL={motherVesselDDL}
                voyageDDL={voyageDDL}
                setVoyageDDL={setVoyageDDL}
                cargoDDL={cargoDDL}
                consigneePartyDDL={consigneePartyDDL}
                editMode={editMode}
                setMotherVesselDDL={setMotherVesselDDL}
                setConsigneePartyDDL={setConsigneePartyDDL}
                setEditMode={setEditMode}
                profileData={profileData}
                selectedBusinessUnit={selectedBusinessUnit}
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                setValues={setValues}
                setTouched={setTouched}
                setErrors={setErrors}
              />
              {(!loading && values?.vesselType?.value === 2) ? (
                <ExpenseSection
                  viewType={viewType}
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                />
              ) : null}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
