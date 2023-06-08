import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { validationSchema } from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  countryDDL,
  ownerDDL,
  costCenterDDL,
  sbuDDL,
  revenueCenterDDL,
  getCostCenter,
  profitCenterDDL,
}) {
  const history = useHistory();
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn px-3 py-2 ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary px-3 py-2 ml-2"}
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Vessel Name</label>
                    <FormikInput
                      value={values?.vesselName}
                      name="vesselName"
                      placeholder="Vessel Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.ownerName || ""}
                      isSearchable={true}
                      options={ownerDDL || []}
                      styles={customStyles}
                      name="ownerName"
                      placeholder="Owner Name"
                      label="Owner Name"
                      onChange={(valueOption) => {
                        setFieldValue("ownerName", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.flag || ""}
                      isSearchable={true}
                      options={countryDDL || []}
                      styles={customStyles}
                      name="flag"
                      placeholder="Flag"
                      label="Flag"
                      onChange={(valueOption) => {
                        setFieldValue("flag", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Dead Weight</label>
                    <FormikInput
                      value={values?.deadWeight}
                      name="deadWeight"
                      placeholder="Deadweight"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>IMO No</label>
                    <FormikInput
                      value={values?.imono}
                      name="imono"
                      placeholder="IMO No"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>GRT</label>
                    <FormikInput
                      value={values?.grt}
                      name="grt"
                      placeholder="GRT"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>{" "}
                  <div className="col-lg-3">
                    <label>NRT</label>
                    <FormikInput
                      value={values?.nrt}
                      name="nrt"
                      placeholder="NRT"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.sbu || ""}
                      isSearchable={true}
                      options={sbuDDL || []}
                      styles={customStyles}
                      name="sbu"
                      label="SBU"
                      placeholder="SBU"
                      onChange={(valueOption) => {
                        getCostCenter(valueOption?.value);
                        setFieldValue("sbu", valueOption);
                        setFieldValue("costCenter", "");
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.revenueCenter || ""}
                      isSearchable={true}
                      options={revenueCenterDDL || []}
                      styles={customStyles}
                      name="revenueCenter"
                      placeholder="Revenue Center"
                      label="Revenue Center"
                      onChange={(valueOption) => {
                        setFieldValue("revenueCenter", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.costCenter || ""}
                      isSearchable={true}
                      options={costCenterDDL || []}
                      styles={customStyles}
                      name="costCenter"
                      placeholder="Cost Center"
                      label="Cost Center"
                      onChange={(valueOption) => {
                        setFieldValue("costCenter", valueOption);
                      }}
                      isDisabled={viewType === "view" || !values?.sbu}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.profitCenter || ""}
                      isSearchable={true}
                      options={profitCenterDDL || []}
                      styles={customStyles}
                      name="profitCenter"
                      placeholder="Profit Center"
                      label="Profit Center"
                      onChange={(valueOption) => {
                        setFieldValue("profitCenter", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mt-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="isOwnVessel"
                      name="isOwnVessel"
                      value={values?.isOwnVessel}
                      checked={values?.isOwnVessel}
                      onChange={(e) => {
                        setFieldValue("isOwnVessel", e.target.checked);
                      }}
                      disabled={viewType === "view"}
                    />
                    <label htmlFor="isOwnVessel" className="pl-1">
                      Is Own Vessel
                    </label>
                  </div>
                  <div className="col-lg-3 mt-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="isOtherInfo"
                      value={values?.isOtherInfo}
                      checked={values?.isOtherInfo}
                      onChange={(e) =>
                        setFieldValue("isOtherInfo", e.target.checked)
                      }
                      name="isOtherInfo"
                      disabled={viewType === "view"}
                    />
                    <label htmlFor="isOtherInfo" className="pl-1">
                      Add Others Information
                    </label>
                  </div>
                </div>
              </div>
              {values?.isOtherInfo === true && (
                <div className="marine-form-card-content">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>Year of Built</label>
                      <FormikInput
                        value={values?.yearOfBuilt}
                        name="yearOfBuilt"
                        placeholder="Year of Built"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Ship Yard</label>
                      <FormikInput
                        value={values?.shipYard}
                        name="shipYard"
                        placeholder="Ship Yard"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Call Sign</label>
                      <FormikInput
                        value={values?.callSign}
                        name="callSign"
                        placeholder="Call Sign"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Class</label>
                      <FormikInput
                        value={values?.className}
                        name="className"
                        placeholder="Class"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>PI Club</label>
                      <FormikInput
                        value={values?.piclub}
                        name="piclub"
                        placeholder="PI Club"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>LOA</label>
                      <FormikInput
                        value={values?.loa}
                        name="loa"
                        placeholder="LOA"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>LBP</label>
                      <FormikInput
                        value={values?.lbp}
                        name="lbp"
                        placeholder="LBP"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Beam</label>
                      <FormikInput
                        value={values?.beam}
                        name="beam"
                        placeholder="Beam"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Depth</label>
                      <FormikInput
                        value={values?.depth}
                        name="depth"
                        placeholder="Depth"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>T.P.C on Summer Free Board</label>
                      <FormikInput
                        value={values?.tpconSummerFreeBoard}
                        name="tpconSummerFreeBoard"
                        placeholder="T.P.C on Summer Free Board"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    {/* <div className="col-lg-3">
                      <label>Actual</label>
                      <FormikInput
                        value={values?.actual}
                        name="actual"
                        placeholder="Actual"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "} */}
                    <div className="col-lg-3">
                      <label>Hold Cubic Grain</label>
                      <FormikInput
                        value={values?.holdCubicGrain}
                        name="holdCubicGrain"
                        placeholder="Hold Cubic Grain"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Hold Cubic Bale</label>
                      <FormikInput
                        value={values?.holdCubicBale}
                        name="holdCubicBale"
                        placeholder="Hold Cubic Bale"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>{" "}
                    <div className="col-lg-3">
                      <label>Holds Length Breadth</label>
                      <FormikInput
                        value={values?.holdsLengthBreadth}
                        name="holdsLengthBreadth"
                        placeholder="Holds Length Breadth"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Upper Deck Strength</label>
                      <FormikInput
                        value={values?.upperDeckStrength}
                        name="upperDeckStrength"
                        placeholder="Upper Deck Strength"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Hatch Cover</label>
                      <FormikInput
                        value={values?.hatchCover}
                        name="hatchCover"
                        placeholder="Hatch Cover"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Hatch Cover Length Breadth</label>
                      <FormikInput
                        value={values?.hatchCoverLengthBreadth}
                        name="hatchCoverLengthBreadth"
                        placeholder="Hatch Cover Length Breadth"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Hatch Cover Strength</label>
                      <FormikInput
                        value={values?.hatchCoverStrength}
                        name="hatchCoverStrength"
                        placeholder="Hatch Cover Strength"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Cranes</label>
                      <FormikInput
                        value={values?.cranes}
                        name="cranes"
                        placeholder="Cranes"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Grabs</label>
                      <FormikInput
                        value={values?.grabs}
                        name="grabs"
                        placeholder="Grabs"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Speed And Consumption At Sea</label>
                      <FormikInput
                        value={values?.speedAndConsumptionAtSea}
                        name="speedAndConsumptionAtSea"
                        placeholder="Speed And Consumption At Sea"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Eco And Consumption At Sea</label>
                      <FormikInput
                        value={values?.ecoAndConsumptionAtSea}
                        name="ecoAndConsumptionAtSea"
                        placeholder="Eco And Consumption At Sea"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>In Port Working</label>
                      <FormikInput
                        value={values?.inPortWorking}
                        name="inPortWorking"
                        placeholder="In Port Working"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Remarks</label>
                      <FormikInput
                        value={values?.remarks}
                        name="remarks"
                        placeholder="Remarks"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
