import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../../../_helper/_inputField";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import NewSelect from "./../../../../../../_helper/_select";
import { DropzoneDialogBase } from "material-ui-dropzone";
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
  getNationalityDDL,
} from "./helper";
import { empAttachment_action } from "../../../helper";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";

export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  setEdit,
  edit,
  rowDto,
  setFileObjects,
  fileObjects,
  remover,
  rowDataAddHandler,
  setUploadImage,
  editBtnHandler,
  editClick,
  setEditClick,
  singleData,
  isDisabled,
  identificationTypeDDL,
  setRowDto,
  getNomineeById,
  divisionDDLGlobal,
}) {
  const [countryDDL, setCountryDDL] = useState([]);
  const [policeStationDDL, setPoliceStationDDL] = useState([]);
  const [postCodeDD, setPostCodeDD] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [nationalityDDL, setNationalityDDL] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [divisionDDLLocal, setDivisionDDLLocal] = useState([]);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      getCountryDDL_api(setCountryDDL);

      getPostCodeDDL_api(setPostCodeDD);
      getNationalityDDL(setNationalityDDL);
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, country: countryDDL[17] }}
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
          setValues,
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Nominee Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          getNomineeById();
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
                        isDisabled={isDisabled}
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
                  {edit && (
                    <div className="row global-form global-form-custom bj-left pb-2">
                      <div className="col-lg-3">
                        <label>Name</label>
                        <InputField
                          value={values?.name}
                          name="name"
                          placeholder="Name"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Relationship (with Employee)</label>
                        <InputField
                          value={values?.relationship}
                          name="relationship"
                          placeholder="Relationship (with Employee)"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="country"
                          options={countryDDL || []}
                          value={values?.country}
                          label="Country"
                          onChange={(valueOption) => {
                            setFieldValue("country", valueOption);
                            setFieldValue("policeStation", "");
                            setFieldValue("stateDivision", "");
                            getDivisionDDL_api(
                              valueOption?.value,
                              setDivisionDDLLocal
                            );
                          }}
                          placeholder="Country"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="stateDivision"
                          options={
                            divisionDDLLocal?.length > 0
                              ? divisionDDLLocal
                              : divisionDDLGlobal
                          }
                          value={values?.stateDivision}
                          label="State/Division"
                          onChange={(valueOption) => {
                            setFieldValue("stateDivision", valueOption);
                            setFieldValue("policeStation", "");
                            setFieldValue("cityDistrict", "");
                            getDistrictDDL_api(
                              values?.country?.value,
                              valueOption?.value,
                              setDistrictDDL
                            );
                          }}
                          placeholder="State/Division"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit || !values?.country}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="cityDistrict"
                          options={districtDDL || []}
                          value={values?.cityDistrict}
                          label="City/District"
                          onChange={(valueOption) => {
                            setFieldValue("cityDistrict", valueOption);
                            setFieldValue("policeStation", "");
                            cityDistrictOnChangeHandler(
                              values?.country?.value,
                              values?.stateDivision?.value,
                              valueOption?.value
                            );
                          }}
                          placeholder="City/District"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit || !values?.stateDivision}
                        />
                      </div>
                      <div className="col-lg-3">
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
                          isDisabled={!edit || !values?.cityDistrict}
                        />
                      </div>
                      <div className="col-lg-3">
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
                      <div className="col-lg-3">
                        <label>Village/Street</label>
                        <InputField
                          value={values?.villageStreet}
                          name="villageStreet"
                          placeholder="Village/Street"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="nationality"
                          options={nationalityDDL || []}
                          value={values?.nationality}
                          label="Nationality"
                          onChange={(valueOption) => {
                            setFieldValue("nationality", valueOption);
                          }}
                          placeholder="Nationality"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="identificationType"
                          options={identificationTypeDDL}
                          value={values?.identificationType}
                          label="Identification Type"
                          onChange={(valueOption) => {
                            setFieldValue("identificationType", valueOption);
                          }}
                          placeholder="Identification Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Identification No</label>
                        <InputField
                          value={values?.identificationNo}
                          name="identificationNo"
                          placeholder="Identification No"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Percentage (%)</label>
                        <InputField
                          value={values?.percentage}
                          name="percentage"
                          placeholder="Percentage (%)"
                          type="number"
                          disabled={!edit || editClick}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Mobile No</label>
                        <InputField
                          value={values?.mobileNo}
                          name="mobileNo"
                          placeholder="Mobile No"
                          type="tel"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Alternative Mobile No</label>
                        <InputField
                          value={values?.alternativeMobileNo}
                          name="alternativeMobileNo"
                          placeholder="Alternative Mobile No"
                          type="tel"
                          disabled={!edit}
                        />
                      </div>
                      <div
                        style={{ marginTop: "16px" }}
                        className={!edit ? "d-none" : "col-lg-3"}
                      >
                        {!editClick && (
                          <ButtonStyleOne
                            className="btn btn-primary"
                            type="button"
                            onClick={() => rowDataAddHandler(values)}
                            disabled={
                              !values.name ||
                              !values.relationship ||
                              !values.country ||
                              !values.stateDivision ||
                              !values.cityDistrict ||
                              !values.policeStation ||
                              !values.postCode ||
                              !values.villageStreet ||
                              !values.nationality ||
                              !values.identificationType ||
                              !values.identificationNo ||
                              !values.percentage ||
                              !values.mobileNo ||
                              !values.alternativeMobileNo
                            }
                            label="Add"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Table Start */}
                  {!editClick && (
                    <div className="row global-form global-form-custom bg_none">
                      <div className="col-lg-12 pr-0 pl-0">
                        {rowDto?.length > 0 && (
                           <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "35px" }}>Nominee Name</th>
                                <th style={{ width: "35px" }}>Relationship</th>
                                <th style={{ width: "35px" }}>Address</th>
                                <th style={{ width: "35px" }}>
                                  Identification
                                </th>
                                <th style={{ width: "35px" }}>
                                  Percentage (%)
                                </th>
                                <th style={{ width: "35px" }}>Mobile No</th>
                                {/* <th style={{ width: "35px" }}>Attachment </th> */}
                                {edit && (
                                  <th style={{ width: "35px" }}>Action</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((itm, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="">{itm?.nomineeName}</td>
                                  <td className="">
                                    {itm?.relationWithEmployee}
                                  </td>
                                  <td className="">{`${itm?.countryName}, ${itm?.state}, ${itm?.policeStation}, ${itm?.city}`}</td>
                                  <td className="">
                                    {itm?.identificationType ||
                                      itm?.identificationTypeName}
                                  </td>
                                  <td className="text-center">
                                    {itm?.percentage}
                                  </td>
                                  <td className="">{itm?.mobileNumber}</td>
                                  {/* <td className="text-center">
                                    {itm?.identificationDocLink && (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              itm?.identificationDocLink
                                            )
                                          );
                                        }}
                                      />
                                    )}
                                  </td> */}
                                  {edit && (
                                    <td className="text-center">
                                      <div className="d-flex justify-content-around">
                                        {singleData.length > 0 && (
                                          <span
                                            onClick={() => {
                                              editBtnHandler(
                                                index,
                                                itm,
                                                setValues
                                              );
                                            }}
                                          >
                                            <IEdit />
                                          </span>
                                        )}
                                        <IDelete id={index} remover={remover} />
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Table End */}
                  <DropzoneDialogBase
                    filesLimit={1}
                    acceptedFiles={["image/*", "application/pdf"]}
                    fileObjects={fileObjects}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={1000000}
                    open={open}
                    onAdd={(newFileObjs) => {
                      setFileObjects([].concat(newFileObjs));
                    }}
                    onDelete={(deleteFileObj) => {
                      const newData = fileObjects.filter(
                        (item) => item.file.name !== deleteFileObj.file.name
                      );
                      setFileObjects(newData);
                    }}
                    onClose={() => setOpen(false)}
                    onSave={() => {
                      console.log("onSave", fileObjects);
                      setOpen(false);
                      empAttachment_action(fileObjects).then((data) => {
                        setUploadImage(data);
                      });
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
