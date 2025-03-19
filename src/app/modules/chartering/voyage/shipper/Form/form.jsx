import React from "react";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { getChartererByVoyageId } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import {
  getCargoDDLbyChartererId,
  getShipperDDLbyVoyageId,
  validationSchema,
} from "../helper";
import CargoTable, { addCargoShipper } from "./cargoTable";

export default function _Form({
  modalData,
  title,
  setLoading,
  initData,
  saveHandler,
  viewType,
  cargoList,
  setCargoList,
}) {
  const { landingData } = modalData;

  const [chartererDDL, setChartererDDL] = useState([]);
  const [shipperDDL, setShipperDDL] = useState([]);
  const [cargoDDL, setCargoDDL] = useState([]);

  useEffect(() => {
    if (landingData?.voyageId) {
      getChartererByVoyageId(landingData?.voyageId, setChartererDDL, null);
      getShipperDDLbyVoyageId(landingData?.voyageId, setShipperDDL, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingData?.voyageId]);

  useEffect(() => {
    if (initData?.charterer?.value) {
      getCargoDDLbyChartererId(
        landingData?.voyageId,
        initData?.charterer?.value,
        setCargoDDL,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData?.charterer?.value]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
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
          setErrors,
          setTouched,
        }) => (
          <>
            <form style={{ border: "0px" }} className="marine-modal-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  {viewType !== "View" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}

                  {viewType !== "View" && (
                    <button
                      type="submit"
                      className={"btn btn-success ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                      {/* {viewType !== "Create" ? "Edit" : "Save"} */}
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.charterer || ""}
                      isSearchable={true}
                      options={chartererDDL || []}
                      styles={customStyles}
                      name="charterer"
                      placeholder="Charterer Name"
                      label="Charterer Name"
                      onChange={(valueOption) => {
                        setFieldValue(
                          "demurrageRate",
                          valueOption?.demurrageRate
                        );
                        setFieldValue(
                          "despatchRate",
                          valueOption?.dispatchRate
                        );
                        setFieldValue(
                          "deadFreightDetention",
                          valueOption?.deadFreight
                        );

                        setFieldValue("charterer", valueOption);
                        setCargoList([]);

                        getCargoDDLbyChartererId(
                          landingData?.voyageId,
                          valueOption?.value,
                          setCargoDDL,
                          setLoading
                        );
                      }}
                      isDisabled={viewType === "View" || viewType === "Edit"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.shipper || ""}
                      isSearchable={true}
                      options={shipperDDL || []}
                      styles={customStyles}
                      name="shipper"
                      placeholder="Shipper"
                      label="Shipper"
                      onChange={(valueOption) => {
                        setFieldValue("shipper", valueOption);
                      }}
                      isDisabled={viewType === "View"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>Demurrage Rate</label>
                    <FormikInput
                      value={values?.demurrageRate}
                      name="demurrageRate"
                      placeholder="Demurrage Rate"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>Despatch Rate</label>
                    <FormikInput
                      value={values?.despatchRate}
                      name="despatchRate"
                      placeholder="Despatch Rate"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className={"col-lg-2"}>
                    <label>Dead Freight</label>
                    <FormikInput
                      value={values?.deadFreightDetention}
                      name="deadFreightDetention"
                      placeholder="Dead Freight"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  {viewType !== "View" ? (
                    <>
                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.cargo || ""}
                          isSearchable={true}
                          options={cargoDDL || []}
                          styles={customStyles}
                          name="cargo"
                          placeholder="Cargo Name"
                          label="Cargo Name"
                          onChange={(valueOption) => {
                            setFieldValue("cargo", valueOption);
                          }}
                          isDisabled={viewType === "View"}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <button
                          type="button"
                          className="btn btn-primary mt-5 px-3 py-2"
                          onClick={() => {
                            if (!values?.cargo) {
                              setTouched({
                                cargo: true,
                              });
                              setTimeout(() => {
                                setErrors({
                                  cargo: "Cargo is required",
                                });
                              }, 50);
                            } else {
                              addCargoShipper(
                                values,
                                setFieldValue,
                                cargoList,
                                setCargoList
                              );
                            }
                          }}
                        >
                          + Add
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <CargoTable
                cargoList={cargoList}
                viewType={viewType}
                errors={errors}
                touched={touched}
                values={values}
                setFieldValue={setFieldValue}
                setCargoList={setCargoList}
              />
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
