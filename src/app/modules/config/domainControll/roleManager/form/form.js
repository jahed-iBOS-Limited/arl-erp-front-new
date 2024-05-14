/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import { getFeatureDDL, getFeatureGroupDDL } from "../helper";
import { toast } from "react-toastify";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import Axios from "axios";
import {
  validationSchemaDeafult,
  validationSchemaForOne,
  validationSchemaForTwo,
  validationSchemaForThree,
  validationSchemaForFour,
} from "./validationSchema";
import { shallowEqual, useSelector } from "react-redux";

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  accountId,
  actionBy,
  // All DDL
  permissionTypeDDL,
  userDDL,
  userGroupDDL,
  moduleDDL,
  featureDDL,
  featureGroupDDL,
  // Other
  setDisabled,
  permissionType,
  setPermissionType,
  setFeatureDDL,
  setFeatureGroupDDL,
  allFeatureCheck,
  setAllFeatureCheck,
  rowData,
  setRowData,
  isEdit,
  // Select Related State
  allSelect,
  setAllSelect,
  allActivities,
  setAllActivities,
}) {
  const [allFeatureDisabled, setAllFeatureDisabled] = useState(false);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // Single Check per row data
  const gridDataCheckBoxHandler = (index, value, name) => {
    let newRowData = [...rowData];
    newRowData[index][name] = value;
    if (
      newRowData[index].isCreate ||
      newRowData[index].isEdit ||
      newRowData[index].isView ||
      newRowData[index].isClose
    ) {
      newRowData[index].isSelect = true;
    } else {
      newRowData[index].isSelect = false;
    }
    setRowData(newRowData);
  };

  // Selected Individual Item
  const selectIndividualItem = (index) => {
    if (!allActivities) {
      let newRowdata = [...rowData];
      if (newRowdata[index].isSelect) {
        newRowdata[index].isCreate = false;
        newRowdata[index].isEdit = false;
        newRowdata[index].isView = false;
        newRowdata[index].isClose = false;
      }
      newRowdata[index].isSelect = !newRowdata[index].isSelect;
      setRowData(newRowdata);
    } else {
      let newRowdata = [...rowData];
      if (newRowdata[index].isSelect) {
        newRowdata[index].isCreate = false;
        newRowdata[index].isEdit = false;
        newRowdata[index].isView = false;
        newRowdata[index].isClose = false;
        newRowdata[index].isSelect = false;
      } else {
        newRowdata[index].isCreate = true;
        newRowdata[index].isEdit = true;
        newRowdata[index].isView = true;
        newRowdata[index].isClose = true;
        newRowdata[index].isSelect = true;
      }
      setRowData(newRowdata);
    }
    const foundAllDataSelect = rowData?.filter((item) => item?.isSelect);
    if (foundAllDataSelect?.length === 0) {
      setAllSelect(false);
    } else if (foundAllDataSelect?.length === rowData?.length) {
      setAllSelect(true);
    }
  };

  useEffect(() => {
    if (allSelect) {
      let data = rowData?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setRowData(data);
    } else {
      let data = rowData?.map((item) => {
        return {
          ...item,
          isSelect: false,
          isCreate: false,
          isEdit: false,
          isView: false,
          isClose: false,
        };
      });
      setRowData(data);
    }
  }, [allSelect]);

  // All Activity Checkbox
  useEffect(() => {
    if (!allActivities) {
      let data = rowData?.map((item) => {
        if (item?.isSelect) {
          return {
            ...item,
            isCreate: false,
            isEdit: false,
            isView: false,
            isClose: false,
            isSelect: false,
          };
        }
        return item;
      });
      setRowData(data);
    } else {
      let data = rowData?.map((item) => {
        if (item?.isSelect) {
          return {
            ...item,
            isCreate: true,
            isEdit: true,
            isView: true,
            isClose: false,
          };
        }
        return item;
      });
      setRowData(data);
    }
  }, [allActivities]);

  const rowDataHandler = (values) => {
    if (values?.module?.value) {
      if (allFeatureCheck) {
        let foundData = rowData?.filter(
          (item) => item?.moduleId !== values?.module?.value
        );
        if (foundData.length > 0) {
          let totalData = featureDDL?.map((item) => {
            return {
              accountId: accountId,
              activityPermissionTypeId: values?.permissionType?.value,
              activityPermissionTypeName: values?.permissionType?.label,
              userReferenceId: values?.user?.value || values?.userGroup?.value,
              userReferenceName:
                values?.user?.label || values?.userGroup?.label,
              featureReferenceId: item?.value,
              featureReferenceName: item?.label,
              moduleId: values?.module?.value,
              moduleName: values?.module?.label,
              isCreate: false,
              isEdit: false,
              isView: false,
              isClose: false,
              isSelect: true,
              intActionBy: actionBy,
            };
          });
          setRowData([...foundData, ...totalData]);
          setAllFeatureDisabled(false);
          setAllFeatureCheck(false);
        } else {
          let totalData = featureDDL?.map((item) => {
            return {
              accountId: accountId,
              activityPermissionTypeId: values?.permissionType?.value,
              activityPermissionTypeName: values?.permissionType?.label,
              userReferenceId: values?.user?.value || values?.userGroup?.value,
              userReferenceName:
                values?.user?.label || values?.userGroup?.label,
              featureReferenceId: item?.value,
              featureReferenceName: item?.label,
              moduleId: values?.module?.value,
              moduleName: values?.module?.label,
              isCreate: false,
              isEdit: false,
              isView: false,
              isClose: false,
              isSelect: true,
              intActionBy: actionBy,
            };
          });
          setRowData(totalData);
          setAllFeatureDisabled(false);
          setAllFeatureCheck(false);
        }
      } else if (!allFeatureCheck && values?.feature?.value) {
        let foundData = rowData?.filter(
          (item) => item?.featureReferenceName === values?.feature?.label
        );
        if (foundData.length > 0) {
          toast.warning("Feature Name already exits", {
            toastId: "Feature Name already exits",
          });
        } else {
          const payload = {
            accountId: accountId,
            activityPermissionTypeId: values?.permissionType?.value,
            activityPermissionTypeName: values?.permissionType?.label,
            userReferenceId: values?.user?.value || values?.userGroup?.value,
            userReferenceName: values?.user?.label || values?.userGroup?.label,
            featureReferenceId: values?.feature?.value,
            featureReferenceName: values?.feature?.label,
            moduleId: values?.module?.value,
            moduleName: values?.module?.label,
            isCreate: false,
            isEdit: false,
            isView: false,
            isClose: false,
            isSelect: true,
            intActionBy: actionBy,
          };
          setRowData([...rowData, payload]);
          setAllFeatureDisabled(false);
          setAllFeatureCheck(false);
        }
      } else {
        toast.warning("Please select a feature", {
          toastId: "Please select a feature",
        });
        setAllFeatureDisabled(false);
        setAllFeatureCheck(false);
      }
    } else {
      toast.warning("Please select a module", {
        toastId: "Please select a module",
      });
      setAllFeatureDisabled(false);
      setAllFeatureCheck(false);
    }
  };
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/domain/CreateUser/GetUserListSearchDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        label: item?.label + ` [${item?.value}]`,
      }));
      return updateList;
    });
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={() => {
        switch (permissionType) {
          case 1:
            return validationSchemaForOne;
          case 2:
            return validationSchemaForTwo;
          case 3:
            return validationSchemaForThree;
          case 4:
            return validationSchemaForFour;
          default:
            return validationSchemaDeafult;
        }
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setRowData([]);
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
            <div className="global-form form-group row">
              <div className="col-lg-3">
                <NewSelect
                  name="permissionType"
                  options={permissionTypeDDL}
                  value={values?.permissionType}
                  label="Permission Type"
                  onChange={(valueOption) => {
                    setRowData([]);
                    setFieldValue("permissionType", valueOption);
                    setFieldValue("user", "");
                    setFieldValue("userGroup", "");
                    setFieldValue("feature", "");
                    setFieldValue("featureGroup", "");
                    setFieldValue("module", "");
                    let pId = +valueOption?.value;
                    setPermissionType(pId);
                  }}
                  placeholder="Permission Type"
                  errors={errors}
                  touched={touched}
                  isDisabled={isEdit}
                />
              </div>
              {(permissionType === 1 || permissionType === 2) && (
                // <div className="col-lg-3">
                //   <NewSelect
                //     name="user"
                //     options={userDDL}
                //     value={values?.user}
                //     label="User Name"
                //     onChange={(valueOption) => {
                //       setFieldValue("user", valueOption);
                //     }}
                //     placeholder="User Name"
                //     errors={errors}
                //     touched={touched}
                //     isDisabled={isEdit}
                //   />
                // </div>
                <div className="col-lg-3  ">
                  <label>User Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.user}
                    handleChange={(valueOption) => {
                      setFieldValue("user", valueOption);
                    }}
                    loadOptions={loadUserList}
                    disabled={true}
                  />
                  <FormikError errors={errors} name="user" touched={touched} />
                </div>
              )}
              {(permissionType === 3 || permissionType === 4) && (
                <div className="col-lg-3">
                  <NewSelect
                    name="userGroup"
                    options={userGroupDDL}
                    value={values?.userGroup}
                    label="User Group"
                    onChange={(valueOption) => {
                      setFieldValue("userGroup", valueOption);
                    }}
                    placeholder="User Group"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
              )}

              {(permissionType === 1 ||
                permissionType === 2 ||
                permissionType === 3 ||
                permissionType === 4) && (
                <div className="col-lg-3">
                  <NewSelect
                    name="module"
                    options={moduleDDL}
                    value={values?.module}
                    label="Module Name"
                    onChange={(valueOption) => {
                      setFieldValue("feature", "");
                      setFieldValue("featureGroup", "");
                      setAllFeatureDisabled(false);
                      setFieldValue("module", valueOption);
                      if (permissionType === 1 || permissionType === 3) {
                        getFeatureDDL(
                          valueOption?.value,
                          setFeatureDDL,
                          setDisabled
                        );
                      } else if (permissionType === 2 || permissionType === 4) {
                        getFeatureGroupDDL(
                          accountId,
                          valueOption?.value,
                          setFeatureGroupDDL,
                          setDisabled
                        );
                      }
                    }}
                    placeholder="Module Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      isEdit && (permissionType === 2 || permissionType === 4)
                    }
                  />
                </div>
              )}

              {(permissionType === 1 || permissionType === 3) && (
                <div className="col-lg-3">
                  <NewSelect
                    name="feature"
                    options={featureDDL}
                    value={values?.feature}
                    label="Feature Name"
                    onChange={(valueOption) => {
                      setFieldValue("feature", valueOption);
                      setAllFeatureDisabled(true);
                    }}
                    placeholder="Feature Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              )}
              {(permissionType === 2 || permissionType === 4) && (
                <div className="col-lg-3">
                  <NewSelect
                    name="featureGroup"
                    options={featureGroupDDL}
                    value={values?.featureGroup}
                    label="Feature Group"
                    onChange={(valueOption) => {
                      setFieldValue("featureGroup", valueOption);
                    }}
                    placeholder="Feature Group"
                    errors={errors}
                    touched={touched}
                    isDisabled={allFeatureCheck}
                  />
                </div>
              )}

              {/* Add All Checkbox and Add Button */}
              {(permissionType === 1 || permissionType === 3) && (
                <>
                  <div className="col-lg-2">
                    <span>
                      <label>All Feature</label>
                      <input
                        style={{ width: "15px", height: "15px" }}
                        name="isSelect"
                        checked={allFeatureCheck}
                        className="form-control ml-3"
                        type="checkbox"
                        onChange={(e) => setAllFeatureCheck(!allFeatureCheck)}
                        disabled={allFeatureDisabled}
                      />
                    </span>
                  </div>
                  <div
                    style={{ marginLeft: "-6.8rem" }}
                    className="col-lg-2 pt-5"
                  >
                    <button
                      type="button"
                      onClick={() => rowDataHandler(values)}
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                {rowData?.length > 0 && (
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th className="d-flex flex-column justify-content-center align-items-center text-center">
                        <span>
                          <label>Select</label>
                          <input
                            style={{ width: "15px", height: "15px" }}
                            name="isSelect"
                            checked={allSelect}
                            className="form-control ml-3"
                            type="checkbox"
                            onChange={(e) => setAllSelect(!allSelect)}
                          />
                        </span>
                      </th>
                      <th>Module Name</th>
                      <th className="position-relative">
                        Feature Name
                        <span className="position-absolute right-0 bottom-0 m-2">
                          <input
                            style={{ width: "15px", height: "15px" }}
                            name="isSelectAllSelected"
                            checked={allActivities}
                            className="form-control ml-3"
                            type="checkbox"
                            onChange={(e) => {
                              if (allActivities) {
                                setAllSelect(false);
                              }
                              setAllActivities(!allActivities);
                            }}
                          />
                        </span>
                      </th>
                      <th>Create</th>
                      <th>Edit</th>
                      <th>View</th>
                      <th>In Active</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rowData?.length > 0 &&
                    rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td
                            style={{ width: "70px" }}
                            className="text-center pl-2"
                          >
                            <span>
                              <input
                                style={{ width: "15px", height: "15px" }}
                                name="isSelect"
                                checked={item?.isSelect}
                                className="form-control ml-8"
                                type="checkbox"
                                onChange={(e) => selectIndividualItem(index)}
                              />
                            </span>
                          </td>
                          <td>
                            <div className="pl-2">{item?.moduleName}</div>
                          </td>
                          <td>
                            <span className="pl-2">
                              {item?.featureReferenceName}
                            </span>
                          </td>
                          <td
                            style={{ width: "50px" }}
                            className="text-center pl-2"
                          >
                            <span>
                              <input
                                style={{ width: "15px", height: "15px" }}
                                name="isCreate"
                                checked={item?.isCreate}
                                className="form-control ml-5"
                                type="checkbox"
                                onChange={(e) =>
                                  gridDataCheckBoxHandler(
                                    index,
                                    e.target.checked,
                                    e.target.name
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td
                            style={{ width: "50px" }}
                            className="text-center pl-2"
                          >
                            <span>
                              <input
                                style={{ width: "15px", height: "15px" }}
                                value={item?.isEdit}
                                name="isEdit"
                                checked={item?.isEdit}
                                className="form-control ml-5"
                                type="checkbox"
                                onChange={(e) =>
                                  gridDataCheckBoxHandler(
                                    index,
                                    e.target.checked,
                                    e.target.name
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td
                            style={{ width: "50px" }}
                            className="text-center pl-2"
                          >
                            <span>
                              <input
                                style={{ width: "15px", height: "15px" }}
                                value={item?.isView}
                                checked={item?.isView}
                                name="isView"
                                className="form-control ml-5"
                                type="checkbox"
                                onChange={(e) =>
                                  gridDataCheckBoxHandler(
                                    index,
                                    e.target.checked,
                                    e.target.name
                                  )
                                }
                              />
                            </span>
                          </td>
                          <td
                            style={{ width: "50px" }}
                            className="text-center pl-2"
                          >
                            <span>
                              <input
                                style={{ width: "15px", height: "15px" }}
                                value={item?.isClose}
                                checked={item?.isClose}
                                name="isClose"
                                className="form-control ml-5"
                                type="checkbox"
                                onChange={(e) =>
                                  gridDataCheckBoxHandler(
                                    index,
                                    e.target.checked,
                                    e.target.name
                                  )
                                }
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
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
  );
}

export default _Form;
