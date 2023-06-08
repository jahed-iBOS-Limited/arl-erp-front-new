import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import { getActivityDDLByModule, getModuleDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  groupName: Yup.string().required("Group Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setRowDto,
  rowDto,
  remover,
  setter,
  isDisabled,
  selectedBusinessUnit,
  profileData,
}) {
  const [activityList, setActivityList] = useState([]);
  const [moduleNameDDL, setModuleNameDDL] = useState([]);
  //const [plantDDL, setPlantDDL] = useState([]);

  // const [employeeEnputValue, setEmployeeEnputValue] = useState("a");

  const generateAnyList = () => {
    let list = [];
    rowDto.forEach((item, index) => {
      let obj = { value: index + 1, label: index + 1 };
      list.push(obj);
    });
    //list.pop();
    return list;
  };

  console.log(rowDto)

  const getActivityListData = async () => {
    try {
      const res = await Axios.get(`/domain/Activity/GetActivityFeaturesList`);
      console.log(res);
      if (res.status === 200) {
        setActivityList(res?.data);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  // Load DDL
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getModuleDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setModuleNameDDL
      );
      //getPantDDL(profileData?.userId,profileData?.accountId,selectedBusinessUnit?.value,setPlantDDL)
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getActivityListData();
  }, []);

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/domain/EmployeeBasicInformation/GetEmpInfoByUserPermission?AccountId=${profileData.accountId}&UserId=${profileData.userId}&Search=${v}`
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
            setRowDto([]);
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
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  {/* <div className="col-lg-2">
                    <NewSelect
                      name="plant"
                      placeholder="Select Plant"
                      value={values?.plant}
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                      }}
                      options={plantDDL}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-2">
                    <NewSelect
                      name="moduleName"
                      placeholder="Select Module Name"
                      value={values?.moduleName}
                      onChange={(valueOption) => {
                        getActivityDDLByModule(
                          valueOption?.value,
                          setActivityList
                        );
                        setFieldValue("activityName", "");
                        setFieldValue("moduleName", valueOption);
                      }}
                      isSearchable={true}
                      options={moduleNameDDL}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="activityName"
                      options={activityList}
                      value={values?.activityName}
                      label="Activity Name"
                      isDisabled={isDisabled}
                      onChange={(valueOption) => {
                        setFieldValue("activityName", valueOption);
                      }}
                      placeholder="Activity Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="approvalOrder"
                      options={[
                        { value: "Any Order", label: "Any Order" },
                        { value: "In Sequence", label: "In Sequence" },
                        { value: "Any Person", label: "Any Person" },
                      ]}
                      value={values?.approvalOrder}
                      isDisabled={isDisabled}
                      label="Approval Order"
                      onChange={(valueOption) => {
                        setFieldValue("any", "");
                        setFieldValue("approvalOrder", valueOption);
                      }}
                      placeholder="Approval Order"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.approvalOrder?.label === "Any Person" && (
                    <div className="col-lg-2">
                      <NewSelect
                        name="any"
                        options={generateAnyList()}
                        value={values?.any || {value:1, label:1}}
                        isDisabled={isDisabled}
                        label="Any"
                        onChange={(valueOption) => {
                          setFieldValue("any", valueOption);
                        }}
                        placeholder="Any"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  <div className="col-lg-2">
                    <label>Group Name</label>
                    <InputField
                      value={values?.groupName}
                      name="groupName"
                      placeholder="Group Name"
                      type="text"
                      disabled={isDisabled}
                    />
                  </div>
                </div>

                {/* RowDto */}

                <div className="row mt-2">
                  <div className="col-lg-3">
                    <label>Select User</label>
                    <SearchAsyncSelect
                      selectedValue={values?.userName}
                      isDisabled={isDisabled}
                      handleChange={(valueOption) => {
                        setFieldValue("userName", valueOption);
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>

                  {/* <div className="col-lg-3">
                    <label>Threshold (Amount)</label>
                    <InputField
                      value={values?.isThreshold}
                      disabled={isDisabled}
                      name="isThreshold"
                      placeholder="Threshold (Amount)"
                      type="number"
                      min="0"
                    />
                  </div> */}
                  <div style={{ marginTop: "15px" }} className="col-lg-2">
                    <button
                      onClick={() => setter(values)}
                      className="btn btn-primary"
                      disabled={!values?.userName}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="mt-2">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>Approval Serial</th>
                        <th>User Name</th>
                        {/* <th>Is Threshold</th> */}
                        {/* isDisbled means this field is for view page */}
                        <th className={isDisabled ? "d-none" : ""}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.userName?.label}</td>
                          {/* <td className="text-center">{item?.isThreshold}</td> */}
                          {/* isDisbled means this field is for view page */}
                          <td className={isDisabled ? "d-none" : "text-center"}>
                            {/* <IDelete
                            remover={remover}
                            id={item?.userName?.value}
                          /> */}
                            <div>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="delete-icon">Delete</Tooltip>
                                }
                              >
                                <span>
                                  <i
                                    onClick={() => {
                                      remover(item?.userName?.value);
                                      setFieldValue("any", "");
                                    }}
                                    className="fa fa-trash deleteBtn text-danger"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
