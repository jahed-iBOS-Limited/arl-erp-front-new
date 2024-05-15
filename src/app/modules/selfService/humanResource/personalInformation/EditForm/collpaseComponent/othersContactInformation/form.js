import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import {
  employeeContactTypeDDL_api,
  getCountryDDL_api,
  getDivisionDDL_api,
  getDistrictDDL_api,
  getPostCodeDDL_api,
  getPoliceStationDDL_api,
} from "./helper";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { empAttachment_action } from "../../../helper";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  setFileObjects,
  fileObjects,
  rowDto,
  remover,
  rowDataAddHandler,
  setUploadImage,
  editBtnHandler,
  editClick,
  setEditClick,
  singleData,
  isDisabled,
  identificationTypeDDL,
  getEmpOthersConById,
  setRowDto,
  divisionDDLGlobal,
}) {
  const [contactTypeDDL, setContactTypeDDL] = useState([]);
  const [countryDDL, setCountryDDL] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [divisionDDLLocal, setDivisionDDLLocal] = useState([]);
  const [postCodeDD, setPostCodeDD] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [policeStationDDL, setPoliceStationDDL] = useState([]);

  useEffect(() => {
    if (edit) {
      employeeContactTypeDDL_api(setContactTypeDDL);
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

  const ddlForEdit = (value) => {
    getDistrictDDL_api(value?.countryId, value?.divisionId, setDistrictDDL);
    getPoliceStationDDL_api(
      value?.countryId,
      value?.divisionId,
      value?.districtId,
      setPoliceStationDDL
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          country: initData?.country ? initData?.country : countryDDL[17],
        }}
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
              <CardHeader title={"Create Others Contact Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          getEmpOthersConById();
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
                  {edit && (
                    <div className="row global-form global-form-custom bj-left pb-2">
                      <div className="col-lg-3 ">
                        <NewSelect
                          name="contactType"
                          value={values?.contactType}
                          options={contactTypeDDL || []}
                          label="Contact Type"
                          onChange={(valueOption) => {
                            setFieldValue("contactType", valueOption);
                          }}
                          placeholder="Contact Type"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Contact Person</label>
                        <InputField
                          value={values?.contactPerson}
                          name="contactPerson"
                          placeholder="Contact Person"
                          type="text"
                          disabled={!edit}
                          max="11"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Relation with Employee</label>
                        <InputField
                          value={values?.relationhwithEmployee}
                          name="relationhwithEmployee"
                          placeholder="Relation with Employee"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Contact No.</label>
                        <InputField
                          value={values?.contactNo}
                          name="contactNo"
                          placeholder="Contact No."
                          type="text"
                          disabled={!edit}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3 mt-1 ">
                        <NewSelect
                          name="country"
                          value={values?.country}
                          options={countryDDL || []}
                          label="Country"
                          onChange={(valueOption) => {
                            setFieldValue("policeStation", "");
                            setFieldValue("stateDivision", "");
                            getDivisionDDL_api(
                              valueOption?.value,
                              setDivisionDDLLocal
                            );

                            if (valueOption?.value !== 18) {
                              setFieldValue("stateDivision", {
                                value: 0,
                                label: "Division",
                              });
                            } else {
                              setFieldValue("stateDivision", "");
                            }

                            setFieldValue("country", valueOption);
                          }}
                          placeholder="Country"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>

                      {values?.country?.value === 18 && (
                        <>
                          <div className="col-lg-3 mt-1 ">
                            <NewSelect
                              name="stateDivision"
                              value={values?.stateDivision}
                              options={
                                divisionDDLLocal?.length > 0
                                  ? divisionDDLLocal
                                  : divisionDDLGlobal
                              }
                              label="State/Division"
                              onChange={(valueOption) => {
                                setFieldValue("policeStation", "");
                                setFieldValue("cityDistrict", "");
                                setFieldValue("postCode", "");
                                setFieldValue("stateDivision", valueOption);
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
                          <div className="col-lg-3 mt-1 ">
                            <NewSelect
                              name="cityDistrict"
                              value={values?.cityDistrict}
                              options={districtDDL || []}
                              label="City/District"
                              onChange={(valueOption) => {
                                setFieldValue("policeStation", "");
                                setFieldValue("postCode", "");
                                setFieldValue("cityDistrict", valueOption);                               
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
                              isDisabled={!edit || !values?.cityDistrict}
                            />
                          </div>
                          <div className="col-lg-3 mt-1 ">
                            <NewSelect
                              name="postCode"
                              value={values?.postCode}
                              options={postCodeDD || []}
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
                          value={values?.villageStreet}
                          name="villageStreet"
                          placeholder={
                            values?.country?.value === 18
                              ? "Village/Street"
                              : "Address"
                          }
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
                        <NewSelect
                          name="identificationType"
                          options={identificationTypeDDL || []}
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
                      <div className="col-lg-3 mt-1">
                        <label>Identification Number</label>
                        <InputField
                          value={values?.identificationNo}
                          name="identificationNo"
                          placeholder="Identification No"
                          type="text"
                          disabled={!edit}
                        />
                      </div>

                      <div className={!edit ? "d-none" : "col-lg-6 mt-4"}>
                        {/* <button
                          className="btn btn-primary mr-1"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          Identification Doc
                        </button> */}
                        {!editClick && (
                          <ButtonStyleOne
                            className="btn btn-primary"
                            type="button"
                            disabled={
                              !values.contactType ||
                              !values.contactPerson ||
                              !values.relationhwithEmployee ||
                              !values.contactNo ||
                              !values.country ||
                              !values.stateDivision ||
                              !values.cityDistrict ||
                              !values.postCode ||
                              !values.villageStreet ||
                              !values.identificationNo ||
                              !values.identificationType
                            }
                            onClick={() => rowDataAddHandler(values)}
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
                                <th style={{ width: "35px" }}>Contact Type</th>
                                <th style={{ width: "35px" }}>
                                  Contact Person
                                </th>
                                <th style={{ width: "35px" }}>Relation</th>
                                <th style={{ width: "35px" }}>Contact No.</th>
                                <th style={{ width: "35px" }}>Address</th>
                                <th style={{ width: "35px" }}>
                                  Identification Type
                                </th>
                                <th style={{ width: "35px" }}>
                                  Identification Number
                                </th>
                                {/* <th style={{ width: "35px" }}>Attachment</th> */}
                                {edit && (
                                  <th style={{ width: "35px" }}>Action</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((itm, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="">{itm?.contactType}</td>
                                  <td className="">{itm?.contactPerson}</td>
                                  <td className="">{itm?.relation}</td>
                                  <td className="">{itm?.contactNo}</td>
                                  <td className="">{itm?.address}</td>
                                  <td className="">
                                    {itm?.strIdentificationType}
                                  </td>
                                  <td className="">
                                    {itm?.strIdentificationNo}
                                  </td>
                                  {/* <td className="text-center">
                                    {itm?.otherDocLink && (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            (
                                              itm?.otherDocLink
                                            )
                                          );
                                        }}
                                      />
                                    )}
                                  </td> */}
                                  {edit && (
                                    <td className="text-center">
                                      <div className=" d-flex justify-content-around">
                                        {singleData.length > 0 && (
                                          <span
                                            onClick={() => {
                                              editBtnHandler(
                                                index,
                                                itm,
                                                setValues
                                              );
                                              ddlForEdit(itm);
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
