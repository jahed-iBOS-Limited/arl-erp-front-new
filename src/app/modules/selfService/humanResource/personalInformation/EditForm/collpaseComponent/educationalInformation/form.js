import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import {
  getEmployeeEducationDegreeDDL_api,
  getEmployeeEducationLevelDDL_api,
  getResultDDL_api,
  getYearDDL_api
} from "./helper";
import { empAttachment_action } from "../../../helper";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  rowDto,
  setFileObjects,
  fileObjects,
  rowDataAddHandler,
  remover,
  setUploadImage,
  editBtnHandler,
  editClick,
  setEditClick,
  singleData,
  setRowDto,
  isDisabled,
  getEduInfoById,
}) {
  const [open, setOpen] = React.useState(false);
  const [employeeEducationLevelDDL, setEmployeeEducationLevelDDL] = useState(
    []
  );
  const [eployeeEducationDegreeDDL, setEmployeeEducationDegreeDDL] = useState(
    []
  );
  const [resultDDL, setResultDDL] = useState([]);
  const [yearDecrementDDL, setYearDecrementDDL] = useState([]);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      getEmployeeEducationLevelDDL_api(setEmployeeEducationLevelDDL);
      getResultDDL_api(setResultDDL);
      getYearDDL_api(setYearDecrementDDL);
    }
  }, [edit]);

  //FOR SINGLE EDIT
  const degreeOnChangeHandler = (value) => {
    getEmployeeEducationDegreeDDL_api(
      value?.educationLevelId,
      setEmployeeEducationDegreeDDL
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
          isValid,
          setValues,
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Educational Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          getEduInfoById();
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
                          name="levelofEducation"
                          value={values?.levelofEducation}
                          options={employeeEducationLevelDDL || []}
                          label="Level of Education"
                          onChange={(valueOption) => {
                            setFieldValue("levelofEducation", valueOption);
                            setFieldValue("majorGroup", "");
                            getEmployeeEducationDegreeDDL_api(
                              valueOption?.value,
                              setEmployeeEducationDegreeDDL
                            );
                            setFieldValue("examDegree", "");
                          }}
                          placeholder="Level of Education"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 ">
                        <NewSelect
                          name="examDegree"
                          value={values?.examDegree}
                          options={eployeeEducationDegreeDDL || []}
                          label="Exam/Degree"
                          onChange={(valueOption) => {
                            setFieldValue("examDegree", valueOption);
                          }}
                          placeholder="Exam/Degree"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>
                      {values?.examDegree?.label === "Other" && (
                        <div className="col-lg-3">
                          <label>Otehrs/Exam/Gegree Name</label>
                          <InputField
                            value={values?.others}
                            name="others"
                            placeholder="Otehrs/Exam/Gegree Name"
                            type="text"
                            disabled={!edit}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <label>Major/Group (Optional)</label>
                        <InputField
                          value={values?.majorGroup}
                          name="majorGroup"
                          placeholder="Major/Group"
                          type="text"
                          disabled={!edit}
                          // || values?.levelofEducation.value === 1
                          //     ? true
                          //     : values?.levelofEducation.value === 2
                          //     ? true
                          //     : false
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Duration (Years)</label>
                        <InputField
                          value={values?.durationYears}
                          name="durationYears"
                          placeholder="Duration (Years)"
                          type="number"
                          min="0"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
                        <label>Name of Institute</label>
                        <InputField
                          value={values?.nameofInstitute}
                          name="nameofInstitute"
                          placeholder="Name of Institute"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1 d-flex justify-content-start align-items-center">
                        <input
                          disabled={!edit}
                          type="checkbox"
                          id="checkbox_id"
                          checked={values?.rorignInstitute}
                          name="rorignInstitute"
                          onChange={(event) => {
                            setFieldValue(
                              "rorignInstitute",
                              event.target.checked
                            );
                          }}
                        />
                        <label for="checkbox_id" className="mr-2 ml-3">
                          Forign Institute
                        </label>
                      </div>
                      <div className="col-lg-3 mt-1 ">
                        <NewSelect
                          name="passingYear"
                          value={values?.passingYear}
                          options={yearDecrementDDL || []}
                          label="Passing Year"
                          onChange={(valueOption) => {
                            setFieldValue("passingYear", valueOption);
                          }}
                          placeholder="Passing Year"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1 ">
                        <NewSelect
                          name="result"
                          value={values?.result}
                          options={resultDDL || []}
                          label="Result"
                          onChange={(valueOption) => {
                            setFieldValue("result", valueOption);
                            setFieldValue("mark", "");
                            setFieldValue("CGPA", "");
                            setFieldValue("CGPAScal", "");
                          }}
                          placeholder="Result"
                          errors={errors}
                          touched={touched}
                          disabled={!edit}
                        />
                      </div>
                      {/*  result 5, 6, 8 (Appeared, Enrolled, Do not Mention") */}
                      {values?.result?.value === 5 ||
                        values?.result?.value === 6 ||
                        (values?.result?.value === 8 ? null : (
                          <>
                            {/* result 4 (Grade) */}
                            {values?.result?.value !== 4 && (
                              <div className="col-lg-3 mt-1">
                                <label>Mark (%)</label>
                                <InputField
                                  value={values?.mark}
                                  name="mark"
                                  min="0"
                                  placeholder="Mark (%)"
                                  type="number"
                                  // result (7, 9) disabled condition
                                  disabled={
                                    values?.result?.value === 7 ||
                                    values?.result?.value === 9
                                      ? values?.CGPA || values?.CGPAScal
                                      : false
                                  }
                                />
                              </div>
                            )}
                            {/*  result (1, 2, 3) 
                              First Devision/Class, 
                              second Devision / Class,
                              Third Devision / Class"  */}
                            {values?.result?.value === 1 ||
                            values?.result?.value === 2 ||
                            values?.result?.value === 3 ? null : (
                              <>
                                <div className="col-lg-3 mt-1">
                                  <label>CGPA</label>
                                  <InputField
                                    value={values?.CGPA}
                                    name="CGPA"
                                    placeholder="CGPA"
                                    type="number"
                                    // result (7, 9) disabled condition
                                    disabled={
                                      values?.result?.value === 7 ||
                                      values?.result?.value === 9
                                        ? values?.mark
                                        : false
                                    }
                                    min="0"
                                  />
                                </div>
                                <div className="col-lg-3 mt-1 ">
                                  <NewSelect
                                    name="CGPAScal"
                                    value={values?.CGPAScal}
                                    options={[
                                      { value: 1, label: "5.00" },
                                      { value: 2, label: "4.00" },
                                    ]}
                                    label="CGPA Scale"
                                    onChange={(valueOption) => {
                                      setFieldValue("CGPAScal", valueOption);
                                    }}
                                    placeholder="CGPA Scale"
                                    errors={errors}
                                    touched={touched}
                                    // result (7, 9) disabled condition
                                    isDisabled={
                                      values?.result?.value === 7 ||
                                      values?.result?.value === 9
                                        ? values?.mark
                                        : false
                                    }
                                  />
                                </div>{" "}
                              </>
                            )}
                          </>
                        ))}

                      <div
                        style={{ marginTop: "19px" }}
                        className={!edit ? "d-none" : "col-lg-3"}
                      >
                        <div className="d-flex global-othersContactBtn">
                          {/* <button
                            className="btn btn-primary mr-1"
                            type="button"
                            onClick={() => setOpen(true)}
                          >
                            Certificate Attachment
                          </button> */}

                          {!editClick && (
                            <ButtonStyleOne
                              className="btn btn-primary"
                              type="button"
                              onClick={() => rowDataAddHandler(values)}
                              disabled={
                                !values.levelofEducation ||
                                !values.examDegree ||
                                !values.durationYears ||
                                !values.nameofInstitute ||
                                !values.result ||
                                !values.passingYear
                              }
                              label="Add"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* row end */}
                  {!editClick && (
                    <div className="row global-form global-form-custom bg_none ">
                      <div className="col-lg-12 pr-0 pl-0">
                        {rowDto?.length > 0 && (
                           <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "35px" }}>
                                  Level of Education
                                </th>
                                <th style={{ width: "35px" }}>
                                  Exam/Degree Name
                                </th>
                                <th style={{ width: "35px" }}>Major/Group</th>
                                <th style={{ width: "35px" }}>
                                  Duration (Years)
                                </th>
                                <th style={{ width: "35px" }}>
                                  Name of Institute
                                </th>
                                <th style={{ width: "35px" }}>Passing Year</th>
                                <th style={{ width: "35px" }}>Result</th>
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
                                  <td className="">{itm?.educationLevel}</td>
                                  <td className="">{itm?.degree}</td>
                                  <td className="">{itm?.group}</td>
                                  <td className="text-center">
                                    {itm?.durationYears}
                                  </td>
                                  <td className="text-center">
                                    {itm?.institute}
                                  </td>
                                  <td className="text-center">
                                    {itm?.passingYear}
                                  </td>
                                  <td className="">{itm?.result}</td>
                                  {/* <td className="text-center">
                                    {itm?.attachment && (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              itm?.attachment
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
                                              degreeOnChangeHandler(itm);
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
