import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Axios from "axios";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { DropzoneDialogBase } from "material-ui-dropzone";
import SearchAsyncSelect from "./../../../../../../../_helper/SearchAsyncSelect";
import {
  getBusinessUnitDDL,
  getCostCenterDDL,
  getDepartmentDDL,
  getDesignationDDL,
  getEmployeeGradeDDL,
  getEmpStatusDDL,
  getEmpTypeDDL,
  getHRPositionDDL,
  getSBUDDL,
  getWorkplaceDDL_api,
} from "./helper";
import * as Yup from "yup";
import NewSelect from "../../../../../../../_helper/_select";
import InputField from "../../../../../../../_helper/_inputField";
import FormikError from "./../../../../../../../_helper/_formikError";
import { getEmpGroupDDL } from "../../../../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../../_metronic/_partials/controls";
import IView from "./../../../../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "./../../../../../../../_helper/_redux/Actions";

// Validation schema

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols")
    .required("First Name required"),
  middleName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols"),
  // .required("Middle Name required"),
  lastName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols"),
  // employeeCode: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Employee Code required"),

  businessUnit: Yup.object().shape({
    label: Yup.string().required("Business Unit required"),
    value: Yup.string().required("Business Unit required"),
  }),
  SBUName: Yup.object().shape({
    label: Yup.string().required("SBU Name required"),
    value: Yup.string().required("SBU Name required"),
  }),
  // costCenter: Yup.object().shape({
  //   label: Yup.string().required("Cost Center required"),
  //   value: Yup.string().required("Cost Center required"),
  // }),
  functionalDepartment: Yup.object().shape({
    label: Yup.string().required("Functional Department required"),
    value: Yup.string().required("Functional Department required"),
  }),
  HRposition: Yup.object().shape({
    label: Yup.string().required("HR Position required"),
    value: Yup.string().required("HR Position required"),
  }),
  designation: Yup.object().shape({
    label: Yup.string().required("Designation required"),
    value: Yup.string().required("Designation required"),
  }),
  // employeeGrade: Yup.object().shape({
  //   label: Yup.string().required("Employee Grade required"),
  //   value: Yup.string().required("Employee Grade required"),
  // }),
  workplace: Yup.object().shape({
    label: Yup.string().required("Workplace required"),
    value: Yup.string().required("Workplace required"),
  }),

  // lineManager: Yup.object().shape({
  //   label: Yup.string().required('Line Manager required'),
  //   value: Yup.string().required('Line Manager required'),
  // }),
  employmentType: Yup.object().shape({
    label: Yup.string().required("Employment Type required"),
    value: Yup.string().required("Employment Type required"),
  }),
  employeeStatus: Yup.object().shape({
    label: Yup.string().required("Employee Status required"),
    value: Yup.string().required("Employee Status required"),
  }),
});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  isDisabled,
  setFileObjects,
  fileObjects,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [HRPositionDDL, setHRPositionDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [employeeGradeDDL, setEmployeeGradeDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [employeeStatusDDL, setEmployeeStatusDDL] = useState([]);
  const [empLavelDDL, setEmpLavelDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      getBusinessUnitDDL(setBusinessUnitDDL);
      getDepartmentDDL(setDepartmentDDL);
      getHRPositionDDL(setHRPositionDDL);
      getDesignationDDL(setDesignationDDL);
      getEmployeeGradeDDL(setEmployeeGradeDDL);
      getEmpTypeDDL(setEmployeeTypeDDL);
      getEmpStatusDDL(setEmployeeStatusDDL);
      getEmpGroupDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmpLavelDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  const subOnChangeHandler = (sbuId) => {
    getCostCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuId,
      setCostCenterDDL
    );
  };
  const businessUnitOnChangeHandler = (buId) => {
    getSBUDDL(profileData?.accountId, buId, setSBUDDL);
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getWorkplaceDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWorkplaceDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/hcm/HCMDDL/GetLineManagerDDLSearch?AccountId=${profileData?.accountId}&Search=${v}`
    ).then((res) => res?.data);
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
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Basic Sales Force Information"}>
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
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3 ">
                      <label>First Name</label>
                      <InputField
                        value={values?.firstName || ""}
                        name="firstName"
                        placeholder="First Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Middle Name (Optional)</label>
                      <InputField
                        value={values?.middleName || ""}
                        name="middleName"
                        placeholder="Middle Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Last Name (Optional)</label>
                      <InputField
                        value={values?.lastName || ""}
                        name="lastName"
                        placeholder="Last Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <label>Employee Code</label>
                      <InputField
                        value={values?.employeeCode || ""}
                        name="employeeCode"
                        placeholder="Employee Code"
                        type="text"
                        // disabled={!edit}
                        disabled={true}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit || ""}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                          businessUnitOnChangeHandler(valueOption?.value);
                          setFieldValue("SBUName", "");
                        }}
                        placeholder="Business Unit"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit || true}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="SBUName"
                        options={SBUDDL || []}
                        value={values?.SBUName || ""}
                        label="SBU Name"
                        onChange={(valueOption) => {
                          setFieldValue("SBUName", valueOption);
                          subOnChangeHandler(valueOption?.value);
                          setFieldValue("costCenter", "");
                        }}
                        placeholder="SBU Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit || true}
                      />
                    </div>
                    {/* <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="costCenter"
                        options={costCenterDDL || []}
                        value={values?.costCenter || ""}
                        label="Cost Center"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", valueOption);
                        }}
                        placeholder="Cost Center"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="workplace"
                        options={workplaceDDL || []}
                        value={values?.workplace || ""}
                        label="Workplace"
                        onChange={(valueOption) => {
                          setFieldValue("workplace", valueOption);
                        }}
                        placeholder="Workplace"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="functionalDepartment"
                        options={departmentDDL || []}
                        value={values?.functionalDepartment}
                        label="Functional Department"
                        onChange={(valueOption) => {
                          setFieldValue("functionalDepartment", valueOption);
                        }}
                        placeholder="Functional Department"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="HRposition"
                        options={HRPositionDDL || []}
                        value={values?.HRposition || ""}
                        label="HR Position"
                        onChange={(valueOption) => {
                          setFieldValue("HRposition", valueOption);
                        }}
                        placeholder="HR Position"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="designation"
                        options={designationDDL || []}
                        value={values?.designation || ""}
                        label="Designation"
                        onChange={(valueOption) => {
                          setFieldValue("designation", valueOption);
                        }}
                        placeholder="Designation"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="employeeGrade"
                        options={employeeGradeDDL || []}
                        value={values?.employeeGrade || ""}
                        label="Employee Grade (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("employeeGrade", valueOption);
                        }}
                        placeholder="Employee Grade"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="employmentType"
                        options={employeeTypeDDL || []}
                        value={values?.employmentType || ""}
                        label="Employment Type"
                        onChange={(valueOption) => {
                          setFieldValue("employmentType", valueOption);
                        }}
                        placeholder="Employment Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <div className="newSelectWrapper">
                        <label>Line Manager (Optional)</label>
                        <SearchAsyncSelect
                          selectedValue={values?.lineManager}
                          handleChange={(valueOption) => {
                            setFieldValue("lineManager", valueOption);
                            setFieldValue("nanagerInfo", valueOption?.code);
                          }}
                          loadOptions={loadUserList}
                          name="lineManager"
                          isDisabled={!edit}
                        />
                        <i
                          class="far fa-times-circle "
                          style={{
                            position: "absolute",
                            zIndex: "99",
                            right: " 8%",
                            top: "53%",
                            fontSize: "13px",
                          }}
                          onClick={() => {
                            setFieldValue("lineManager", "");
                            setFieldValue("nanagerInfo", "");
                          }}
                        ></i>
                      </div>

                      <FormikError
                        errors={errors}
                        name="lineManager"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <label>Manager Info.</label>
                      <InputField
                        placeholder="Manager Info."
                        type="text"
                        disabled={true}
                        name="nanagerInfo"
                        value={values?.nanagerInfo}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="employeeStatus"
                        options={employeeStatusDDL || []}
                        value={values?.employeeStatus || ""}
                        label="Employee Status"
                        onChange={(valueOption) => {
                          setFieldValue("employeeStatus", valueOption);
                        }}
                        placeholder="Employee Status"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Joining Date</label>
                      <InputField
                        value={values?.joiningDate}
                        name="joiningDate"
                        placeholder="Joining Date"
                        type="date"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="empLavel"
                        options={empLavelDDL}
                        value={values?.empLavel}
                        label="Employee Group"
                        onChange={(valueOption) => {
                          setFieldValue("empLavel", valueOption);
                        }}
                        placeholder="Employee Group"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-6 mt-3 d-flex align-items-cente">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {values?.empProfileImage && (
                        <div style={{ position: "relative", top: "5px" }}>
                          <IView
                            classes="purchaseInvoiceAttachIcon"
                            clickHandler={() => {
                              dispatch(
                                getDownlloadFileView_Action(
                                  values?.empProfileImage
                                )
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Table End */}
                </Form>
              </CardBody>
            </Card>

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
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </div>
        )}
      </Formik>
    </>
  );
}
