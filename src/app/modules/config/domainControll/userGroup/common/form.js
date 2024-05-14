/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import { useSelector, shallowEqual } from "react-redux";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  userId: Yup.object().shape({
    label: Yup.string().required("User is required"),
    value: Yup.string().required("User is required"),
  }),
  userGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("User Group is required"),
  userGroupCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("User Group Code is required"),
});

// Validation schema Edit
const ProductEditSchemaEdit = Yup.object().shape({
  userGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("User Group is required"),
  userGroupCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("User Group Code is required"),
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
  // selectedBusinessUnit,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, setUserList] = useState([]);
  useEffect(() => {
    if (accountId) {
      getInfoData(accountId);
    }
  }, [accountId]);

  const getInfoData = async (accId) => {
    try {
      const res = await Axios.get(
        `/domain/CreateUser/GetUserDDL?AccountId=${accId}&UnitId=${selectedBusinessUnit?.value}`
      );
      const { data, status } = res;
      if (status === 200 && data) {
        setUserList(data);
      }
    } catch (error) {}
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
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? ProductEditSchemaEdit : ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(initData);
          });
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
            {/* {disableHandler(!isValid || !tableData?.length)} */}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values?.userGroupName || ""}
                    name="userGroupName"
                    component={Input}
                    placeholder="User Group Name"
                    label="User Group Name"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values?.userGroupCode || ""}
                    name="userGroupCode"
                    component={Input}
                    placeholder="User Group Code"
                    label="User Group Code"
                    disabled={isEdit}
                  />
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <div className="col-lg-3 mt-1">
                  <label>User Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.user}
                    handleChange={(valueOption) => {
                      setFieldValue("userId", valueOption);
                    }}
                    loadOptions={loadUserList}
                    disabled={true}
                  />
                  <FormikError errors={errors} name="user" touched={touched} />
                </div>
                <div className="col-lg-4">
                  <button
                    disabled={!values?.userId?.value}
                    type="button"
                    onClick={() => {
                      const obj = {
                        userId: values?.userId?.value,
                        userName: values?.userId?.label,
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
                      <th>User Name</th>
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
                          <td>{itm?.userName}</td>
                          <td>
                            <span
                              className="pointer alterUomDeleteIcon"
                              style={{
                                width: "50%",
                                marginTop: "3px",
                              }}
                            >
                              <i
                                onClick={() => remover(itm?.userId)}
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
