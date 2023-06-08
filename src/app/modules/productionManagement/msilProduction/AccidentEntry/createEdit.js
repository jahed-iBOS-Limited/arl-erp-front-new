import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  date: _todayDate(),
  enroll: "",
  name: "",
  designation: "",
  department: "",
  contactNumber: "",
  age: "",
  gender: "",
  accidentDateTime: "",
  accidentPlace: "",
  accidentReason: "",
  nameOfInjuries: "",
  firstWitnessName: "",
  firstWitnessDesignation: "",
  firstWitnessDepartment: "",
  secondWitnessName: "",
  secondWitnessDesignation: "",
  secondWitnessDepartment: "",
};
const AccidentEntryCreate = () => {
  const [objProps, setObjprops] = useState({});
  const [viewType, setViewType] = useState(1);
  const [, saveData, saveLoader] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      console.log("location?.state", location?.state);
      location?.state?.employeeId === 0 ? setViewType(2) : setViewType(1);
      setModifyData({
        ...location?.state,
        enroll: {
          value: location?.state?.employeeId,
          label:
            location?.state?.employeeName +
            `[${location?.state?.employeeCode}]`,
        },
        name: location?.state?.employeeName,
        designation: location?.state?.designationName,
        department: location?.state?.departmentName,
        contactNumber: location?.state?.contactNumber,
      });
    }
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    const payload = {
      accidentEntryId: location?.state?.accidentEntryId
        ? location?.state?.accidentEntryId
        : 0,
      accidentDateTime: values?.accidentDateTime,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      employeeId: values?.enroll?.erpemployeeId || 0,
      employeeName: values?.enroll?.strEmployeeName || values?.name,
      designationId: values?.enroll?.employeeInfoDesignationId || 0,
      employeeCode: values?.enroll?.code || 0,
      designationName:
        values?.enroll?.employeeInfoDesignation || values?.designation,
      departmentId: values?.enroll?.employeeDepartmentId || 0,
      departmentName:
        values?.enroll?.employeeDepartmentName || values?.department,
      gender: values?.enroll?.gender || values?.gender,
      age: values?.age,
      contactNumber: values?.contactNumber,
      accidentPlace: values?.accidentPlace,
      accidentReason: values?.accidentReason,
      nameOfInjuries: values?.nameOfInjuries,
      firstWitnessName: values?.firstWitnessName,
      firstWitnessDesignation: values?.firstWitnessDesignation,
      firstWitnessDepartment: values?.firstWitnessDepartment,
      secondWitnessName: values?.secondWitnessName,
      secondWitnessDesignation: values?.secondWitnessDesignation,
      secondWitnessDepartment: values?.secondWitnessDepartment,
      actionBy: profileData?.userId,
      insertDateTime: _todayDate(),
      lastActionDateTime: _todayDate(),
      isActive: true,
    };
    saveData(
      "/mes/MSIL/AccidentEntryCreateAndEdit",
      payload,
      location?.state?.accidentEntryId ? "" : cb,
      true
    );
  };
  const loadEnrollList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/mes/MesDDL/GetAllEmployeeInfoCommonDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
  return (
    <IForm title="Accident Entry" getProps={setObjprops}>
      {saveLoader && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={id ? modifyData : initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <>
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 1}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setViewType(1);
                          setFieldValue("enroll", "");
                          setFieldValue("serviceRecipient", "");
                          setFieldValue("gender", "");
                          setFieldValue("designation", "");
                        }}
                        disabled={id && viewType !== 1}
                      />
                      ARL Employee
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 2}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setViewType(2);
                          setFieldValue("enroll", "");
                          setFieldValue("serviceRecipient", "");
                          setFieldValue("gender", "");
                          setFieldValue("designation", "");
                        }}
                        disabled={id && viewType !== 2}
                      />
                      Others
                    </label>
                  </div>
                </>
                <div className="form-group  global-form">
                  <div className="row">
                    {viewType === 1 ? (
                      <div className="col-lg-3">
                        <label>Enroll</label>
                        <SearchAsyncSelect
                          selectedValue={values?.enroll}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("enroll", valueOption);
                              setFieldValue(
                                "name",
                                valueOption?.strEmployeeName
                              );
                              setFieldValue("gender", valueOption?.gender);
                              setFieldValue(
                                "designation",
                                valueOption?.employeeInfoDesignation
                              );
                              setFieldValue(
                                "department",
                                valueOption?.employeeInfoDepartment
                              );
                              setFieldValue(
                                "contactNumber",
                                valueOption?.contactNumber
                              );
                            } else {
                              setFieldValue("enroll", "");
                              setFieldValue("name", "");
                              setFieldValue("gender", "");
                              setFieldValue("designation", "");
                            }
                          }}
                          loadOptions={loadEnrollList}
                        // isDisabled={id}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.name}
                        label="Name"
                        name="name"
                        type="text"
                        disabled={viewType === 1}
                        onChange={(e) => {
                          setFieldValue("name", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.designation}
                        label="Designation"
                        name="designation"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.department}
                        label="Department"
                        name="department"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.contactNumber}
                        label="Contact no"
                        name="contactNumber"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("contactNumber", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.age}
                        label="Age"
                        name="age"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("age", +e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.gender}
                        label="Gender"
                        name="gender"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.accidentDateTime}
                        label="Accident Date & Time"
                        name="accidentDateTime"
                        type="datetime-local"
                        onChange={(e) => {
                          setFieldValue("accidentDateTime", e.target.value);
                          //   setItemList([]);
                        }}
                      // disabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.accidentPlace}
                        label="Place of Accident"
                        name="accidentPlace"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("accidentPlace", e.target.value);
                          //   setItemList([]);
                        }}
                      // disabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.accidentReason}
                        label="Cause/Reason of Accident"
                        name="accidentReason"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("accidentReason", e.target.value);
                          //   setItemList([]);
                        }}
                      // disabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.nameOfInjuries}
                        label="Name of Injuries"
                        name="nameOfInjuries"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("nameOfInjuries", e.target.value);
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3"></div>
                  </div>

                  <div className="row">
                    <div className="col-lg-3 mt-3">
                      <h5>Witness 1</h5>
                    </div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3"></div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWitnessName}
                        label="Name"
                        name="firstWitnessName"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("firstWitnessName", e.target.value);
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWitnessDesignation}
                        label="Designation"
                        name="firstWitnessDesignation"
                        type="text"
                        onChange={(e) => {
                          setFieldValue(
                            "firstWitnessDesignation",
                            e.target.value
                          );
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWitnessDepartment}
                        label="Department"
                        name="firstWitnessDepartment"
                        type="text"
                        onChange={(e) => {
                          setFieldValue(
                            "firstWitnessDepartment",
                            e.target.value
                          );
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3"></div>

                    <div className="col-lg-3 mt-3">
                      <h5>Witness 2</h5>
                    </div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3"></div>
                    <div className="col-lg-3"></div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.secondWitnessName}
                        label="Name"
                        name="secondWitnessName"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("secondWitnessName", e.target.value);
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.secondWitnessDesignation}
                        label="Designation"
                        name="secondWitnessDesignation"
                        type="text"
                        onChange={(e) => {
                          setFieldValue(
                            "secondWitnessDesignation",
                            e.target.value
                          );
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.secondWitnessDepartment}
                        label="Department"
                        name="secondWitnessDepartment"
                        type="text"
                        onChange={(e) => {
                          setFieldValue(
                            "secondWitnessDepartment",
                            e.target.value
                          );
                          //   setItemList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3 d-flex justify-content-center align-items-center"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
};

export default AccidentEntryCreate;
