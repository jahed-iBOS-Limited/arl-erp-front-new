/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { getModuleFeature } from "../helper";
import { useEffect } from "react";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  featureGroupName: Yup.string().required("Feature Group Name is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  // DDL
  moduleNameDDL,
  featureDDL,

  // Other
  rowData,
  setRowData,
  isEdit,
  setDisabled,
  allSelect,
  setAllSelect,
  allActivities,
  setAllActivities,
}) {
  // Single Activity Handler
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

  // Select Individual Item
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

  // All Select Handler
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

  // All Activity Handler
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

  // Add new feature in Row data
  const addNewFeatureHandler = (values) => {
    console.log("values => ", values);
    let foundData = rowData?.filter(
      (item) => item?.featureId === values?.feature?.value
    );
    if (foundData.length > 0) {
      toast.warning("Feature already exist", { toastId: "Fae" });
    } else {
      let payload = {
        featureId: values?.feature?.value,
        featureName: values?.feature?.label,
        isSelect: true,
        isCreate: false,
        isEdit: false,
        isView: false,
        isClose: false,
      };
      setRowData([...rowData, payload]);
    }
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
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Feature Group Name</label>
                  <InputField
                    value={values?.featureGroupName}
                    name="featureGroupName"
                    placeholder="Feature Group Name"
                    type="text"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="module"
                    options={moduleNameDDL}
                    value={values?.module}
                    label="Module Name"
                    onChange={(valueOption) => {
                      setFieldValue("module", valueOption);
                      getModuleFeature(
                        valueOption?.moduleId,
                        setRowData,
                        isEdit ? true : false,
                        setDisabled
                      );
                    }}
                    placeholder="Module Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                {isEdit && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="feature"
                        options={featureDDL}
                        value={values?.feature}
                        label="Feature"
                        onChange={(valueOption) => {
                          setFieldValue("feature", valueOption);
                        }}
                        placeholder="Feature"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pt-6">
                      <button
                        type="button"
                        disabled={!values?.feature}
                        className="btn btn-primary"
                        onClick={() => {
                          addNewFeatureHandler(values);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </>
                )}
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
                      onChange={(e) => {
                        if (allSelect) {
                          setAllActivities(false);
                        }
                        setAllSelect(!allSelect);
                      }}
                    />
                  </span>
                </th>
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
                    <td style={{ width: "70px" }} className="text-center pl-2">
                      <span>
                        <input
                          style={{ width: "15px", height: "15px" }}
                          name="isSelect"
                          checked={item?.isSelect}
                          className="form-control ml-8"
                          type="checkbox"
                          onChange={() => selectIndividualItem(index)}
                        />
                      </span>
                    </td>
                    <td>
                      <span className="pl-2">{item?.featureName}</span>
                    </td>
                    <td style={{ width: "50px" }} className="text-center pl-2">
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
                    <td style={{ width: "50px" }} className="text-center pl-2">
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
                    <td style={{ width: "50px" }} className="text-center pl-2">
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
                    <td style={{ width: "50px" }} className="text-center pl-2">
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
    </>
  );
}

export default _Form;
