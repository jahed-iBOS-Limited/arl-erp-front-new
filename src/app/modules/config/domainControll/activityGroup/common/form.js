import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  moduleName: Yup.object().shape({
    label: Yup.string().required("Module is required"),
    value: Yup.string().required("Module is required"),
  }),
  activityGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Activity Group is required"),
});

export default function _Form({
  tableData,
  remover,
  initData,
  product,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  // disableHandler,
  setDataToState,
  isEdit,
  accountId,
  selectedBusinessUnit,
}) {
  const [moduleList, setModuleList] = useState([]);
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    if (accountId && selectedBusinessUnit?.value) {
      getInfoData(accountId, selectedBusinessUnit.value);
    }
  }, [accountId, selectedBusinessUnit]);

  const getInfoData = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/domain/CreateActivityGroup/GetModuleList?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      const { data, status } = res;
      if (status === 200 && data) {
        const modules = [];
        data &&
          data.forEach((mod) => {
            let module = {
              value: mod.moduleId,
              label: mod.moduleName,
            };
            modules.push(module);
          });
        setModuleList(modules);
      }
    } catch (error) {
     
    }
  };

  const activityApiCaller = async (v) => {
    const res = await Axios.get(
      `/domain/CreateActivityGroup/GetModuleFeatureActivityList?ModuleId=${v}`
    );
    const { data, status } = res;
    if (status === 200 && data) {
      const activitys = [];
      data &&
        data.forEach((itm) => {
          let items = {
            value: itm.activityId,
            label: itm.activityName,
          };
          activitys.push(items);
        });
      setActivityList(activitys);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(initData);
          });
          // setSubmitting(false)
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {console.log(values)}
            {/* {disableHandler(!isValid || !tableData?.length)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values?.activityGroupName || ""}
                    name="activityGroupName"
                    component={Input}
                    placeholder="Activity Group Name"
                    label="Activity Group Name"
                    // errors={errors}
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values?.activityGroupCode || ""}
                    name="activityGroupCode"
                    component={Input}
                    placeholder="Activity Group Code"
                    label="Activity Group Code"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-4">
                  <label>Module Name</label>

                  <Select
                    options={moduleList}
                    placeholder="Select Module Name"
                    value={values.moduleName}
                    onChange={(valueOption) => {
                      setFieldValue("moduleName", valueOption);
                      activityApiCaller(valueOption?.value);
                    }}
                    isSearchable={true}
                    styles={customStyles}
                    name="moduleName"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors?.moduleName?.value}
                  </p>
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <div className="col-lg-4">
                  <label>Activity Name</label>
                  <Select
                    options={activityList}
                    placeholder="Select Activity"
                    value={values?.activityId}
                    onChange={(valueOption) => {
                      setFieldValue("activityId", valueOption);
                    }}
                    isSearchable={true}
                    isDisabled={!activityList.length || !moduleList.length}
                    styles={customStyles}
                    name="activityId"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.activityId &&
                    touched && touched.activityId
                      ? errors.activityId?.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <button
                    disabled={!values?.activityId?.value}
                    type="button"
                    onClick={() => {
                      const obj = {
                        activityId: values?.activityId?.value,
                        activityName: values?.activityId?.label,
                      };
                      setDataToState(obj);
                    }}
                    style={{ marginTop: "25px" }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              {tableData && tableData.length ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-2">
                  <thead>
                    <tr className="text-center">
                      <th>SL</th>
                      <th>Activity Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData &&
                      tableData.map((itm, idx) => (
                        <tr
                          key={idx}
                          style={{ marginBottom: "15px", textAlign: "center" }}
                        >
                          <td>{idx + 1}</td>
                          <td>{itm.activityName}</td>

                          <td>
                            <span
                              className="pointer alterUomDeleteIcon"
                              style={{
                                width: "50%",
                                marginTop: "3px",
                              }}
                            >
                              <i
                                onClick={() => remover(itm.activityId)}
                                className="fa fa-trash"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                </div>
              ) : null}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
                // disabled={true}
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
      {/* <ConfirmationModal title="Confirmation" body="Do you want to proceed" handleClose={handleClose} show={show} /> */}
    </>
  );
}
