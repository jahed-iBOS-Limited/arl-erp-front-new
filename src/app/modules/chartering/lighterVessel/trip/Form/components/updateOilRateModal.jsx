import React from "react";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import Loading from "../../../../_chartinghelper/loading/_loading";
import { getOilRateApi } from "../../helper";
import { rateUpdateModalHandler } from "../../utils";

export function UpdateOilRateModal(props) {
  const {
    loading,
    setLoading,
    values,
    errors,
    touched,
    setFieldValue,
    setRateUpdateModal,
  } = props;

  return (
    <>
      {loading && <Loading />}
      <div className="marine-modal-form-card">
        <div className="marine-form-card-heading">
          <p>{"Update Oil Rate"}</p>

          <div>
            <button
              type="button"
              className="btn btn-success px-3 py-2 mr-2"
              onClick={() => {
                rateUpdateModalHandler(
                  values,
                  setRateUpdateModal,
                  setLoading,
                  () => {
                    getOilRateApi({
                      values,
                      setFieldValue: setFieldValue,
                    });
                  }
                );
              }}
            >
              Save
            </button>
          </div>
        </div>

        <div className="row marine-form-card-content mx-0 px-0 my-2">
          <div className="col-lg-8">
            <label>Diesel Rate</label>
            <FormikInput
              value={values?.numDiesel?.numOilRate}
              name="numDiesel"
              placeholder="Rate"
              onChange={(e) => {
                setFieldValue("numDiesel", {
                  ...values?.numDiesel,
                  numOilRate: e.target.value,
                });
              }}
              type="number"
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-8">
            <label>Lub Oil Rate</label>
            <FormikInput
              value={values?.numLub?.numOilRate}
              name="numLub"
              placeholder="Rate"
              type="number"
              onChange={(e) => {
                setFieldValue("numLub", {
                  ...values?.numLub,
                  numOilRate: e.target.value,
                });
              }}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-8">
            <label>Hydrolic Oil Rate</label>
            <FormikInput
              value={values?.numHydrolic?.numOilRate}
              name="numHydrolic"
              placeholder="Rate"
              onChange={(e) => {
                setFieldValue("numHydrolic", {
                  ...values?.numHydrolic,
                  numOilRate: e.target.value,
                });
              }}
              type="number"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
      </div>
    </>
  );
}
