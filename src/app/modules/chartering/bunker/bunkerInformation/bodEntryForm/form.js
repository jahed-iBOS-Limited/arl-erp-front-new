import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import FormikSelect from "../../../../helper/common/formikSelect";
import customStyles from "../../../selectCustomStyle";
import FormikInput from "../../../../helper/common/formikInput";
import { getVoyageDDLByVesselId } from "../../helper";
import { validationSchema } from "../helper";
import { toast } from "react-toastify";

export default function Form({
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  setLoading,
}) {
  const history = useHistory();
  const [voyageNoDDL, setVoyageNoDDL] = React.useState([]);

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
            <form className="form-card">
              <div className="form-card-heading">
                <p>{`BOD Entry`}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => resetForm(initData)}
                    className={"btn btn-info reset-btn ml-2"}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2"}
                    onClick={handleSubmit}
                    disabled={false}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="form-card-content">
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
                        setFieldValue("voyageNo", "");
                        setVoyageNoDDL([]);
                        if (valueOption) {
                          getVoyageDDLByVesselId(
                            valueOption?.value,
                            setLoading,
                            setVoyageNoDDL
                          );
                        } else {
                          resetForm(initData);
                          // setEmptyString(setFieldValue);
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
                        if (valueOption?.label !== "1") {
                          toast.warn(
                            "BOD information for this voyage is already exist"
                          );
                        }
                        setValues({
                          ...initData,
                          voyageNo: valueOption,
                          vesselName: values?.vesselName,
                          voyageType: valueOption?.voyageTypeName,
                        });
                      }}
                      isDisabled={viewType || !values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Voyage Type</label>
                    <FormikInput
                      value={values?.voyageType || ""}
                      name="voyageType"
                      placeholder="Voyage Type"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  {values?.voyageNo?.label === "1" && (
                    <>
                      <div className="col-lg-12 mt-3">
                        <h6>BOD</h6>
                      </div>
                      <div className="col-lg-2">
                        <label>LSMGO QTY</label>
                        <FormikInput
                          value={values?.bodLsmgoQty}
                          name="bodLsmgoQty"
                          placeholder="LSMGO QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-1 QTY</label>
                        <FormikInput
                          value={values?.bodLsfo1Qty}
                          name="bodLsfo1Qty"
                          placeholder="LSFO-1 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>LSFO-2 QTY</label>
                        <FormikInput
                          value={values?.bodLsfo2Qty}
                          name="bodLsfo2Qty"
                          placeholder="LSFO-2 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
