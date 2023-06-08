import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import { useSelector, shallowEqual } from "react-redux";
import { getWareHouseDDL } from "../helper";
import InputField from "./../../../../_helper/_inputField";
import { getCustomerListByGenderDDL } from "./../helper";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
// Validation schema
const validationSchema = Yup.object().shape({
  outletName: Yup.object().shape({
    label: Yup.string().required("Outlet Name is required"),
    value: Yup.string().required("Outlet Name is required"),
  }),
  gender: Yup.object().shape({
    label: Yup.string().required("Gender is required"),
    value: Yup.string().required("Gender is required"),
  }),
  customerGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Customer Group Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setter,
  removeHandler,
  setRowDto,
}) {
  const [WareHouseDDL, setWareHouseDDL] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [isCheck, setIsCheck] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.plantId,
        profileData?.userId,
        setWareHouseDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const genderDDL = [
    {
      label: "Male",
      value: "1",
    },
    {
      label: "Female",
      value: "2",
    },
    {
      label: "Both",
      value: "0",
    },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([])
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
            <Form className="form form-label-right mt-2">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="outletName"
                    options={WareHouseDDL || []}
                    value={values?.outletName}
                    label="Outlet Name"
                    onChange={(valueOption) => {
                      setFieldValue("outletName", valueOption);
                    }}
                    placeholder="Outlet Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Customer Group Name</label>
                  <InputField
                    value={values?.customerGroupName}
                    name="customerGroupName"
                    placeholder="Customer Group Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="gender"
                    options={genderDDL}
                    value={values?.gender}
                    label="Customer's Gender"
                    onChange={(valueOption) => {
                      setFieldValue("customer", '');
                      setFieldValue("gender", valueOption);
                      getCustomerListByGenderDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setCustomerDDL
                      );
                      
                    }}
                    placeholder="Customer's Gender"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="customer"
                    options={customerDDL || []}
                    value={values?.customer}
                    label="Customer "
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                      setIsCheck(false)
                    }}
                    placeholder="Customer "
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2 d-flex mt-5">
                  <label>Select All</label>
                  <input
                    style={{ width: "15px", height: "15px" }}
                    name="isSelect"
                    checked={isCheck}
                    className="form-control ml-5"
                    type="checkbox"
                    onChange={(e) => {
                      setIsCheck(!isCheck);
                      setFieldValue("customer", "");
                      setRowDto([])
                    }}
                    // disabled={allFeatureDisabled}
                  />
                </div>
                <div className="col-lg-3 d-flex  align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setter(values, customerDDL, isCheck);
                    }}
                    disabled={!isCheck && !values?.customer}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Customer Name</th>
                      <th>Gender</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.customer}</td>
                        <td>{item?.gender}</td>
                        <td style={{ textAlign: "center" }}>
                          <span onClick={(e) => removeHandler(index)}>
                            <IDelete />
                          </span>
                        </td>
                      </tr>
                    ))}
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
    </>
  );
}
