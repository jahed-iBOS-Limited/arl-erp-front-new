/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form, Field } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Axios from "axios";
import { reason, validationSchema } from "../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import { useLocation } from "react-router-dom";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  remover,
  setter,
  pId,
  profileData,
  selectedBusinessUnit,
}) {
  const location = useLocation();
  const { warehouse, plant } = location?.state;
  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
    ).then((res) =>
      res?.data?.map((item) => ({
        label: `[${item?.label}] [${item?.employeeInfoDepartment}] [${item?.employeeInfoDesignation}]`,
        value: item?.value,
        lineManager: item?.lineManager,
        employeeBusinessUnit: item?.employeeBusinessUnit,
      }))
    );
  };
  // console.log("rowDto", rowDto);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values, plant, warehouse }, () => {
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
          setValues,
        }) => (
          <>
            {/* {console.log(values)} */}
            {/*  */}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-4">
                    <label>
                      <span className="mr-1">Date:</span>{" "}
                      <span className="mr-2" style={{ color: "red" }}>
                        *
                      </span>
                    </label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>
                      From Address:
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputField
                      value={pId ? initData?.fromAddress : warehouse?.address}
                      // value={values?.formAddress}
                      name="formAddress"
                      placeholder="Address"
                      type="text"
                      disabled={
                        warehouse?.address ||
                        initData?.fromAddress ||
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  {values?.others ? (
                    <div className="col-lg-6">
                      <label>
                        To Address: <span style={{ color: "red" }}>*</span>
                      </label>
                      <InputField
                        value={values?.toAddress}
                        name="toAddress"
                        placeholder="Address"
                        type="text"
                        disabled={
                          rowDto?.length > 0 ||
                          location?.state?.isApprove === true ||
                          location?.state?.isActive === false
                        }
                      />
                    </div>
                  ) : (
                    <div className="col-lg-6">
                      <label>To Address</label>
                      <SearchAsyncSelect
                        selectedValue={values?.toAddress}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("toAddress", valueOption);
                        }}
                        loadOptions={loadPartsList}
                        isDisabled={
                          rowDto?.length > 0 ||
                          location?.state?.isApprove === true ||
                          location?.state?.isActive === false
                        }
                      />
                      <FormikError
                        errors={errors}
                        name="assetNo"
                        touched={touched}
                      />
                    </div>
                  )}

                  <div className="col-lg-2">
                    <div
                      style={{ marginTop: "19px" }}
                      className="d-flex justify-content-center align-items-center col-lg-2"
                    >
                      <label className="d-flex justify-content-center align-items-center">
                        <Field
                          onClick={() => {
                            setFieldValue("toAddress", "");
                          }}
                          style={{ marginRight: "5px" }}
                          type="checkbox"
                          name="others"
                          checked={values?.others}
                          // onChange={(e) => {
                          //   setFieldValue("toAddress", "");
                          // }}
                          disabled={
                            values?.toAddress?.value ||
                            location?.state?.isApprove === true ||
                            location?.state?.isActive === false
                          }
                        />
                        Others
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <label>
                      Driver/Receiver Name:{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputField
                      value={values?.receiversName}
                      name="receiversName"
                      placeholder="Receivers Name"
                      type="text"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Vehicle:</label>
                    <InputField
                      value={values?.vehicle}
                      name="vehicle"
                      placeholder="Vehicle"
                      type="text"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <label>
                      Contact No: <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputField
                      value={values?.contactNo}
                      name="contactNo"
                      placeholder="Contact No"
                      type="text"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="reason"
                      options={reason}
                      value={values?.reason}
                      label="Reason"
                      onChange={(valueOption) => {
                        setFieldValue("reason", valueOption);
                      }}
                      placeholder="Select Reason"
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <label>
                      Remarks: <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      className="form-control"
                      type="text"
                      as="textarea"
                      id="remarks"
                      name="remarks"
                      placeholder="Remarks"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                    {errors && touched && (
                      <FormikError
                        errors={errors}
                        touched={touched}
                        name="remarks"
                      />
                    )}
                  </div>
                </div>
                <hr
                  style={{
                    background: "hsl(0, 0%, 80%)",
                    margin: "0",
                    marginTop: "10px",
                  }}
                />
                <div className="row">
                  <div className="col-lg-3">
                    <label>
                      Item List
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputField
                      value={values?.item}
                      name="item"
                      placeholder="Item List"
                      type="text"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>
                      UoM <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputField
                      value={values?.uom}
                      name="uom"
                      placeholder="UoM"
                      type="text"
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>
                      Quantity <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputField
                      value={values?.quantity}
                      name="quantity"
                      placeholder="Quantity"
                      type="number"
                      min="1"
                      step="any"
                      // onChange={(e, valueOption) => {
                      //   if (e.target.value > 0) {
                      //     setFieldValue("quantity", valueOption);
                      //   } else {
                      //     setFieldValue("quantity", "");
                      //   }
                      // }}
                      disabled={
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                    />
                  </div>
                  <div
                    style={{ marginTop: "6px" }}
                    className="d-flex justify-content-center align-items-center col-lg-2"
                  >
                    <label className="d-flex justify-content-center align-items-center">
                      <Field
                        onClick={() => {}}
                        style={{ marginRight: "5px" }}
                        type="checkbox"
                        name="returnable"
                        checked={values?.returnable}
                        disabled={
                          location?.state?.isApprove === true ||
                          location?.state?.isActive === false
                        }
                      />
                      <span>Returnable</span>
                    </label>
                  </div>
                  <div style={{ marginTop: "14px" }} className="col-lg-2">
                    <button
                      disabled={
                        !values?.quantity ||
                        !values?.item ||
                        !values?.uom ||
                        location?.state?.isApprove === true ||
                        location?.state?.isActive === false
                      }
                      className="btn btn-primary"
                      onClick={() => {
                        setter(values, setFieldValue);
                      }}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>UoM</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {item?.item?.label ? item?.item?.label : item?.item}
                        </td>
                        <td>
                          {item?.uom?.label ? item?.uom?.label : item?.uom}
                        </td>
                        <td className="text-center">{item?.quantity}</td>

                        <td className="text-center">
                          <IDelete remover={remover} id={index} />
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
