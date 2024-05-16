import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import Axios from "axios";
import {
  getAllMenuDetails,
  getAllSecondLevelMenu,
  getPermissionForUserById,
} from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  profileData,
  rowDto,
  setRowDto,
  setDataToRow,
  remover,
  type,
  changeActionStatus,
  // location,
}) {
  const [moduleNameDDL, setModuleNameDDL] = useState([]);
  const [featureDDL, setFeatureDDL] = useState([]);

  useEffect(() => {
    getAllMenuDetails(setModuleNameDDL);
  }, []);

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
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          const formValue = values;
          saveHandler(values, () => {
            resetForm();
            setFieldValue("requestType", formValue?.requestType);
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
              <div className="row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={selectedBusinessUnit.label}
                    name="businessUnitName"
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Select User</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                      if (valueOption) {
                        getPermissionForUserById(valueOption?.value, setRowDto);
                      }
                      setFieldValue("moduleName", "");
                      setFieldValue("featureName", "");
                      setRowDto([]);
                    }}
                    loadOptions={loadUserList}
                    disabled={true}
                  />
                  <FormikError
                    errors={errors}
                    name="employee"
                    touched={touched}
                  />
                </div>
              </div>
              {values?.employee?.value && (
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="moduleName"
                      options={moduleNameDDL || []}
                      value={values?.moduleName}
                      label="Module Name"
                      onChange={(valueOption) => {
                        setFieldValue("moduleName", valueOption);
                        getAllSecondLevelMenu(
                          valueOption?.value,
                          setFeatureDDL
                        );
                      }}
                      placeholder="Module Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="featureName"
                      options={featureDDL || []}
                      value={values?.featureName}
                      label="Feature Name"
                      onChange={(valueOption) => {
                        setFieldValue("featureName", valueOption);
                      }}
                      placeholder="Feature Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 align-self-end">
                    <button
                      className="btn btn-sm btn-primary "
                      type="button"
                      onClick={(e) => {
                        setDataToRow(values);
                      }}
                    >
                      add
                    </button>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-lg-12">
                <div className="table-responsive">
                <table className="global-table table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Module Name</th>
                        <th>Feature Name</th>
                        <th style={{ width: "80px" }}>View</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.firstLabelName}</td>
                          <td>{item?.secondLabelName}</td>
                          <td className="text-center" style={{ width: "80px" }}>
                            <span>
                              <input
                                value={item?.isView}
                                type="checkbox"
                                checked={item?.isView}
                                onChange={(e) => {
                                  changeActionStatus("isView", index);
                                }}
                              />
                            </span>
                          </td>
                          {/* <td className="text-center">
                            <span onClick={() => remover(index)}>
                              <IDelete />
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="button"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onClick={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
