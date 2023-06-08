import { Formik } from "formik";
import moment from "moment";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getVoyageDDLNew } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { getDifference } from "../../../_chartinghelper/_getDateDiff";
import { getItemRateForBunker, validationSchema } from "../helper";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  setLoading,
  voyageNoDDL,
  setVoyageNoDDL,
}) {
  const history = useHistory();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const dateHandler = (e, values, setFieldValue, type) => {
    /* Calculate Duration */
    const diff = getDifference(
      type === "endDate"
        ? moment(values?.ballastStartDate).format("YYYY-MM-DDTHH:mm:ss")
        : moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss"),
      type === "endDate"
        ? moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss")
        : moment(values?.ballastEndDate).format("YYYY-MM-DDTHH:mm:ss")
    );

    /* Set Ballast Duration */
    setFieldValue("ballastDuration", isNaN(diff) ? 0 : parseFloat(diff));

    /* Set Current Input Field Value */
    if (type === "endDate") {
      setFieldValue(
        "ballastEndDate",
        moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss")
      );
    } else {
      setFieldValue(
        "ballastStartDate",
        moment(e.target.value).format("YYYY-MM-DDTHH:mm:ss")
      );
    }

    const lsfoQty = (values?.lsfoperDayQty * diff).toFixed(2);
    const lsmgoQty = (values?.lsmgoperDayQty * diff).toFixed(2);

    setFieldValue("lsfoballastQty", lsfoQty);
    setFieldValue("lsmgoballastQty", lsmgoQty);

    setFieldValue(
      "lsfoballastAmount",
      (lsfoQty * values?.lsfoballastRate).toFixed(2)
    );
    setFieldValue(
      "lsmgoballastAmount",
      (lsmgoQty * values?.lsmgoballastRate).toFixed(2)
    );
  };

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
          setValues,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => history.goBack()}
                    className={"btn btn-secondary reset-btn ml-2 px-3 py-2"}
                  >
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
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setValues({ ...initData, vesselName: valueOption });
                        setFieldValue("voyageNo", "");
                        setVoyageNoDDL([]);
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 0,
                            voyageTypeId: 1,
                          });
                        }
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);
                        getItemRateForBunker({
                          accId: profileData?.accountId,
                          buId: selectedBusinessUnit?.value,
                          vesselId: values?.vesselName?.value,
                          voyageId: valueOption?.value,
                          setter: setFieldValue,
                          setLoading,
                        });
                      }}
                      isDisabled={viewType || !values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast Start Date-Time</label>
                    <FormikInput
                      value={values?.ballastStartDate}
                      name="ballastStartDate"
                      placeholder="Ballast Start Date-Time"
                      onChange={(e) => {
                        dateHandler(e, values, setFieldValue, "startDate");
                      }}
                      max={
                        values?.ballastEndDate
                          ? moment(values?.ballastEndDate).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            )
                          : ""
                      }
                      type="datetime-local"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Ballast End Date-Time</label>
                    <FormikInput
                      value={values?.ballastEndDate}
                      name="ballastEndDate"
                      placeholder="Ballast End Date-Time"
                      min={moment(values?.ballastStartDate).format(
                        "YYYY-MM-DDTHH:mm:ss"
                      )}
                      onChange={(e) => {
                        dateHandler(e, values, setFieldValue, "endDate");
                      }}
                      type="datetime-local"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast Duration</label>
                    <FormikInput
                      value={values?.ballastDuration}
                      name="ballastDuration"
                      placeholder="Ballast Duration"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  
                  <div className="col-lg-3">
                    <label>Per Day LSMGO QTY</label>
                    <FormikInput
                      value={values?.lsmgoperDayQty}
                      name="lsmgoperDayQty"
                      placeholder="Per Day LSMGO QTY"
                      onChange={(e) => {
                        let cal = Number(
                          values?.ballastDuration * e.target.value
                        );
                        setFieldValue("lsmgoballastQty", cal);
                        setFieldValue(
                          "lsmgoballastAmount",
                          values?.lsmgoballastRate * cal
                        );

                        setFieldValue("lsmgoperDayQty", Number(e.target.value));
                      }}
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Ballast LSMGO QTY</label>
                    <FormikInput
                      value={values?.lsmgoballastQty}
                      name="lsmgoballastQty"
                      placeholder="Ballast LSMGO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast LSMGO Rate</label>
                    <FormikInput
                      value={values?.lsmgoballastRate}
                      name="lsmgoballastRate"
                      placeholder="Ballast LSMGO Rate"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast LSMGO Value</label>
                    <FormikInput
                      value={values?.lsmgoballastAmount}
                      name="lsmgoballastAmount"
                      placeholder="Ballast LSMGO Value"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Per Day LSFO QTY</label>
                    <FormikInput
                      value={values?.lsfoperDayQty}
                      name="lsfoperDayQty"
                      placeholder="Per Day LSFO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      onChange={(e) => {
                        let cal = Number(
                          values?.ballastDuration * e.target.value
                        );
                        setFieldValue("lsfoballastQty", cal);
                        setFieldValue(
                          "lsfoballastAmount",
                          values?.lsfoballastRate * cal
                        );

                        setFieldValue("lsfoperDayQty", Number(e.target.value));
                      }}
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast LSFO QTY</label>
                    <FormikInput
                      value={values?.lsfoballastQty}
                      name="lsfoballastQty"
                      placeholder="Ballast LSFO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast LSFO Rate</label>
                    <FormikInput
                      value={values?.lsfoballastRate}
                      name="lsfoballastRate"
                      placeholder="Ballast LSFO Rate"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Ballast LSFO Value</label>
                    <FormikInput
                      value={values?.lsfoballastAmount}
                      name="lsfoballastAmount"
                      placeholder="Ballast LSFO Value"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
