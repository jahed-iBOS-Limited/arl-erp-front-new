import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import {
  getCountryDDL_api,
  getDistrictDDL_api,
  getDivisionDDL_api,
  getPoliceStationDDL_api,
  getPostCodeDDL_api,
} from "./helper";

// Validation schema
// const validationSchema = Yup.object().shape({
//   country: Yup.object()
//     .shape({
//       label: Yup.string().required("Country is required"),
//       value: Yup.string().required("Country is required"),
//     })
//     .typeError("Country is required"),
//   divison: Yup.object()
//     .shape({
//       label: Yup.string().required("State/Divison is required"),
//       value: Yup.string().required("State/Divison is required"),
//     })
//     .typeError("State/Divison is required"),
//   district: Yup.object()
//     .shape({
//       label: Yup.string().required("City/District is required"),
//       value: Yup.string().required("City/District is required"),
//     })
//     .typeError("City/District is required"),
//   policeStation: Yup.object()
//     .shape({
//       label: Yup.string().required("Police Station is required"),
//       value: Yup.string().required("Police Station is required"),
//     })
//     .typeError("Police Station is required"),
//   postCode: Yup.object()
//     .shape({
//       label: Yup.string().required("Post code is required"),
//       value: Yup.string().required("Post code is required"),
//     })
//     .typeError("Post code is required"),
//   village: Yup.string()
//     .min(1, "Minimum 1 symbols")
//     .max(1000, "Maximum 100 symbols")
//     .required("Village/Address is required")
//     .typeError("Village/Address is required"),
// });

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  isDisabled,
  divisionDDLGlobal,
}) {
  const [countryDDL, setCountryDDL] = useState([]);
  const [divisionDDLLocal, setDivisionDDLLocal] = useState([]);
  const [policeStationDDL, setPoliceStationDDL] = useState([]);
  const [postCodeDD, setPostCodeDD] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      getCountryDDL_api(setCountryDDL);
      getPostCodeDDL_api(setPostCodeDD);
    }
  }, [edit]);

  const cityDistrictOnChangeHandler = (countryId, divisionId, districtId) => {
    getPoliceStationDDL_api(
      countryId,
      divisionId,
      districtId,
      setPoliceStationDDL
    );
  };

  useEffect(() => {
    if (
      initData?.country?.value &&
      initData?.divison?.value &&
      initData?.district?.value
    ) {
      getDivisionDDL_api(initData?.country?.value, setDivisionDDLLocal);
      getDistrictDDL_api(
        initData?.country?.value,
        initData?.divison?.value,
        setDistrictDDL
      );
      cityDistrictOnChangeHandler(
        initData?.country?.value,
        initData?.divison?.value,
        initData?.district?.value
      );
    }
  }, [initData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          country: initData?.country ? initData?.country : countryDDL[17],
          country2: initData?.country2 ? initData?.country : countryDDL[17],
        }}
        // validationSchema={validationSchema}
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
            
            <div className={!edit ? "editForm" : ""}>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Create Personal Contact Information"}>
                  <CardHeaderToolbar>
                    {edit ? (
                      <>
                        <button
                          onClick={() => {
                            setEdit(false);
                            resetForm(initData);
                          }}
                          className="btn btn-light "
                          type="button"
                        >
                          <i className="fas fa-times pointer"></i>
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary ml-2"
                          type="submit"
                          disabled={isDisabled}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEdit(true)}
                        className="btn btn-light"
                        type="button"
                      >
                        <i className="fas fa-pen-square pointer"></i>
                        Edit
                      </button>
                    )}
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <Form className="form form-label-right">
                    <h6 style={{ marginBottom: "6px" }}>Present Address</h6>
                    <div className="row global-form global-form-custom bj-left pb-2">
                      <div className="col-lg-3 ">
                        <NewSelect
                          name="country"
                          value={values?.country}
                          options={countryDDL || []}
                          label="Country"
                          onChange={(valueOption) => {
                            getDivisionDDL_api(
                              valueOption?.value,
                              setDivisionDDLLocal
                            );
                            if (valueOption?.value !== 18) {
                              setFieldValue("divison", {
                                value: 0,
                                label: "Division",
                              });
                            } else {
                              setFieldValue("divison", "");
                            }
                            setFieldValue("country", valueOption);
                          }}
                          placeholder="Country"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>
                      {/* values?.country?.value === 18 */}
                      {values?.country?.value === 18 && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="divison"
                              options={
                                divisionDDLLocal?.length > 0
                                  ? divisionDDLLocal
                                  : divisionDDLGlobal
                              }
                              value={values?.divison}
                              label="State/Division"
                              onChange={(valueOption) => {
                                setFieldValue("postCode", "");
                                setFieldValue("district", "");
                                setFieldValue("policeStation", "");
                                setFieldValue("divison", valueOption);
                                getDistrictDDL_api(
                                  values?.country?.value,
                                  valueOption?.value,
                                  setDistrictDDL
                                );
                              }}
                              placeholder="State/Divison"
                              errors={errors}
                              touched={touched}
                              isDisabled={!edit || !values?.country}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="district"
                              options={districtDDL || []}
                              value={values?.district}
                              label="City/District"
                              onChange={(valueOption) => {
                                setFieldValue("policeStation", "");
                                setFieldValue("postCode", "");
                                setFieldValue("district", valueOption);

                                cityDistrictOnChangeHandler(
                                  values?.country?.value,
                                  values?.divison?.value,
                                  valueOption?.value
                                );
                              }}
                              placeholder="City/District"
                              errors={errors}
                              touched={touched}
                              isDisabled={!edit || !values?.divison}
                            />
                          </div>
                          <div className="col-lg-3 ">
                            <NewSelect
                              name="policeStation"
                              options={policeStationDDL || []}
                              value={values?.policeStation}
                              label="Police Station"
                              onChange={(valueOption) => {
                                setFieldValue("policeStation", valueOption);
                                setFieldValue("postCode", {
                                  value: 1,
                                  label: valueOption?.code,
                                });
                              }}
                              placeholder="Police Station"
                              errors={errors}
                              touched={touched}
                              isDisabled={!edit || !values?.district}
                            />
                          </div>
                          <div className="col-lg-3 mt-1 ">
                            <NewSelect
                              name="postCode"
                              options={postCodeDD || []}
                              value={values?.postCode}
                              label="Post Code"
                              onChange={(valueOption) => {
                                setFieldValue("postCode", valueOption);
                              }}
                              placeholder="Post Code"
                              errors={errors}
                              touched={touched}
                              isDisabled={true}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-3 mt-1">
                        <label>
                          {values?.country?.value === 18
                            ? "Village/Street"
                            : "Address"}
                        </label>
                        <InputField
                          value={values?.village}
                          name="village"
                          placeholder={
                            values?.country?.value === 18
                              ? "Village/Street"
                              : "Address"
                          }
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                    </div>
                    <h6 style={{ margin: "6px 0px" }}>Permanent Address </h6>
                    <div className="row global-form global-form-custom pb-2">
                      <div className="col-lg-3 d-flex align-items-center">
                        <input
                          disabled={!edit}
                          type="checkbox"
                          id="checkbox_id"
                          checked={values?.samePresentAddress}
                          name="samePresentAddress"
                          onChange={(event) => {
                            setFieldValue(
                              "samePresentAddress",
                              event.target.checked
                            );
                          }}
                        />
                        <label for="checkbox_id" className="ml-2">
                          Same As Present Address
                        </label>
                      </div>
                    </div>
                    {!values?.samePresentAddress && (
                      <div className="row global-form global-form-custom bj-left pb-2">
                        <div className="col-lg-3 ">
                          <NewSelect
                            name="country2"
                            value={values?.country2}
                            options={countryDDL || []}
                            label="Country"
                            onChange={(valueOption) => {
                              setFieldValue("country2", valueOption);
                              setFieldValue("divison2", "");
                              getDivisionDDL_api(
                                valueOption?.value,
                                setDivisionDDLLocal
                              );
                            }}
                            placeholder="Country"
                            errors={errors}
                            touched={touched}
                            disabled={!edit}
                          />
                        </div>
                        {values?.country2?.value === 18 && (
                          <>
                            <div className="col-lg-3">
                              <NewSelect
                                name="divison2"
                                options={
                                  divisionDDLLocal?.length > 0
                                    ? divisionDDLLocal
                                    : divisionDDLGlobal
                                }
                                value={values?.divison2}
                                label="State/Divison"
                                onChange={(valueOption) => {
                                  setFieldValue("district2", "");
                                  setFieldValue("policeStation2", "");
                                  setFieldValue("postCode2", "");
                                  setFieldValue("divison2", valueOption);

                                  getDistrictDDL_api(
                                    values?.country2?.value,
                                    valueOption?.value,
                                    setDistrictDDL
                                  );
                                }}
                                placeholder="State/Divison"
                                errors={errors}
                                touched={touched}
                                isDisabled={!edit || !values?.country2}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="district2"
                                options={districtDDL || []}
                                value={values?.district2}
                                label="City/District"
                                onChange={(valueOption) => {
                                  setFieldValue("policeStation2", "");
                                  setFieldValue("postCode2", "");
                                  setFieldValue("district2", valueOption);

                                  cityDistrictOnChangeHandler(
                                    values?.country2?.value,
                                    values?.divison2?.value,
                                    valueOption?.value
                                  );
                                }}
                                placeholder="City/District"
                                errors={errors}
                                touched={touched}
                                isDisabled={!edit || !values?.divison2}
                              />
                            </div>
                            <div className="col-lg-3 ">
                              <NewSelect
                                name="policeStation2"
                                options={policeStationDDL || []}
                                value={values?.policeStation2}
                                label="Police Station"
                                onChange={(valueOption) => {
                                  setFieldValue("policeStation2", valueOption);
                                  setFieldValue("postCode2", {
                                    value: 1,
                                    label: valueOption?.code,
                                  });
                                }}
                                placeholder="Police Station"
                                errors={errors}
                                touched={touched}
                                isDisabled={!edit || !values?.district2}
                              />
                            </div>
                            <div className="col-lg-3 mt-1 ">
                              <NewSelect
                                name="postCode2"
                                options={postCodeDD || []}
                                value={values?.postCode2}
                                label="Post Code"
                                onChange={(valueOption) => {
                                  setFieldValue("postCode2", valueOption);
                                }}
                                placeholder="Post Code"
                                errors={errors}
                                touched={touched}
                                isDisabled={true}
                              />
                            </div>
                          </>
                        )}
                        <div className="col-lg-3 mt-1">
                          <label>
                            {values?.country2?.value === 18
                              ? "Village/Street"
                              : "Address"}
                          </label>
                          <InputField
                            value={values?.village2}
                            name="village2"
                            placeholder={
                              values?.country?.value === 18
                                ? "Village/Street"
                                : "Address"
                            }
                            type="text"
                            disabled={!edit}
                          />
                        </div>
                      </div>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
