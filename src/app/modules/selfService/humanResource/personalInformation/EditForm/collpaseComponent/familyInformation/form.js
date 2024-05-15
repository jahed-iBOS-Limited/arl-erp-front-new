import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import { DropzoneDialogBase } from "material-ui-dropzone";
//import { useDispatch } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { empAttachment_action } from "../../../helper";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
//import IView from './../../../../../../_helper/_helperIcons/_view'
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
//import {getDownlloadFileView_Action} from '../../../../../../_helper/_redux/Actions'

export default function _Form({
  initData,
  saveHandler,
  genderDDL,
  identificationTypeDDL,
  setEdit,
  setFileObjects,
  fileObjects,
  rowDataAddHandler,
  setUploadImage,
  edit,
  remover,
  rowDto,
  editBtnHandler,
  editClick,
  setEditClick,
  singleData,
  setRowDto,
  isDisabled,
  getFamilyInfoById,
}) {
  const [open, setOpen] = React.useState(false);
  // func to set gender according to Relation with Employee
  const setEmployeeRelationGender = (relation, setFieldValue) => {
    if (relation?.value === 1) {
      setFieldValue("gender", genderDDL[0]);
    } else if (relation?.value === 2) {
      setFieldValue("gender", genderDDL[1]);
    } else if (relation?.value === 4) {
      setFieldValue("gender", genderDDL[1]);
    } else if (relation?.value === 5) {
      setFieldValue("gender", genderDDL[0]);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
              <CardHeader title={"Create Family Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          getFamilyInfoById();
                          // !singleData.length > 0 && setRowDto([]);
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
                      <div className="col-lg-3">
                        <NewSelect
                          name="relation"
                          options={
                            [
                              { value: 1, label: "Father" },
                              { value: 2, label: "Mother" },
                              { value: 3, label: "Spouse" },
                              { value: 4, label: "Daughter" },
                              { value: 5, label: "Son" },
                            ] || []
                          }
                          value={values?.relation}
                          label="Relation With Employee"
                          onChange={(valueOption) => {
                            setFieldValue("relation", valueOption);
                            setEmployeeRelationGender(
                              valueOption,
                              setFieldValue
                            );
                          }}
                          placeholder="Relation"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 ">
                        <label>{values?.relation?.label} Name</label>
                        <InputField
                          value={values?.name}
                          name="name"
                          placeholder="Name"
                          type="text"
                          disabled={!edit}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="gender"
                          options={genderDDL}
                          value={values?.gender}
                          label="Gender"
                          onChange={(valueOption) => {
                            setFieldValue("gender", valueOption);
                          }}
                          placeholder="Gender"
                          errors={errors}
                          touched={touched}
                          // isDisabled={true}
                          isDisabled={
                            values?.relation?.value === 3 ? false : true
                          }
                        />
                      </div>
                      <div className="col-lg-3 ">
                        <label>Date of Birth</label>
                        <InputField
                          value={values?.dateOfBirth}
                          name="dateOfBirth"
                          placeholder="Date Of Birth"
                          type="date"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1 ">
                        <label>Occupation</label>
                        <InputField
                          value={values?.occupation}
                          name="occupation"
                          placeholder="Occupation"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
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
                      <div className={!edit ? "d-none" : "col-lg-3 mt-5"}>
                        <div className="d-flex" style={{ marginTop: "3px" }}>
                          {/* <button
                            className="btn btn-primary mr-2"
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
                                !values.relation ||
                                !values.gender ||
                                !values.name ||
                                !values.dateOfBirth ||
                                !values.occupation ||
                                !values.identificationNo ||
                                !values?.identificationType
                              }
                              onClick={() => rowDataAddHandler(values)}
                              label="Add"
                            />
                          )}
                        </div>
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
                                <th style={{ width: "35px" }}>Relation</th>
                                <th style={{ width: "35px" }}>Name</th>
                                <th style={{ width: "35px" }}>Gender</th>
                                <th style={{ width: "35px" }}>Date Of Birth</th>
                                <th style={{ width: "35px" }}>Occupation</th>
                                <th style={{ width: "35px" }}>
                                  Identification Type
                                </th>
                                <th style={{ width: "35px" }}>
                                  Identification Number
                                </th>
                                {/* <th style={{ width: '35px' }}>Attach</th> */}
                                {edit && (
                                  <th style={{ width: "35px" }}>Action</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((itm, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="">{itm?.relation}</td>
                                  <td className="">{itm?.familyPerson}</td>
                                  <td className="">{itm?.genderName}</td>
                                  <td className="">
                                    {_dateFormatter(itm?.dateOfBirth)}
                                  </td>
                                  <td className="">{itm?.occupation}</td>
                                  <td className="">
                                    {itm?.identificationType}
                                  </td>
                                  <td className="">{itm?.identificationNo}</td>
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
                                      <div className=" d-flex justify-content-around">
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
