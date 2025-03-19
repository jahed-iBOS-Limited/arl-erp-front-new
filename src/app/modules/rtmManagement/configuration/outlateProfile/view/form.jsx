import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Field } from "formik";

// eslint-disable-next-line no-unused-vars
import FormikError from "../../../../_helper/_formikError";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getBusinessTypeDDL, getRouteNameDDL } from "../helper";
// eslint-disable-next-line no-unused-vars
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  attributes,
  imageDTO,
  collerCompanyDDL,
}) {
  // eslint-disable-next-line no-unused-vars

  const [businessTypeDDL, setBusinessDDL] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      getBusinessTypeDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBusinessDDL
      );

      getRouteNameDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setRouteNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const renderFields = (item, values, setFieldValue, errors, touched) => {
    if (item?.objAttribute?.uicontrolType === "DDL") {
      return (
        <div className="col-lg-3">
          <NewSelect
            label={item.objAttribute.outletAttributeName}
            name={item.objAttribute.outletAttributeName}
            options={item.objAttributeValue}
            value={values[item.objAttribute.outletAttributeName] || {}}
            onChange={(valueOption) => {
              setFieldValue(item.objAttribute.outletAttributeName, valueOption);
            }}
            placeholder={item.objAttribute.outletAttributeName}
            errors={errors}
            touched={touched}
            isDisabled={true}
          />
        </div>
      );
    }

    if (item?.objAttribute?.uicontrolType === "Date") {
      return (
        <div className="col-lg-3">
          <label>{item.objAttribute.outletAttributeName}</label>
          <InputField
            value={values[item.objAttribute.outletAttributeName]}
            name={item.objAttribute.outletAttributeName}
            placeholder={item.objAttribute.outletAttributeName}
            type="date"
            errors={errors}
            touched={touched}
            disabled={true}
          />
        </div>
      );
    }

    if (item?.objAttribute?.uicontrolType === "TextBox") {
      return (
        <div className="col-lg-3">
          <label>{item.objAttribute.outletAttributeName}</label>
          <InputField
            value={values[item.objAttribute.outletAttributeName] || ""}
            name={item.objAttribute.outletAttributeName}
            placeholder={item.objAttribute.outletAttributeName}
            type="text"
            errors={errors}
            touched={touched}
            disabled={true}
          />
        </div>
      );
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
            // setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-3">
                  {/* <label>Route Name</label> */}
                  <NewSelect
                    label="Route Name"
                    name="routeName"
                    options={routeNameDDL}
                    value={values?.routeName}
                    onChange={(valueOption) => {
                      setFieldValue("routeName", valueOption);
                    }}
                    placeholder="Select Route Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  {/* <label>Route Name</label> */}
                  <NewSelect
                    label="Market Name"
                    name="beatName"
                    options={[]}
                    value={values?.beatName}
                    onChange={(valueOption) => {
                      setFieldValue("beatName", valueOption);
                    }}
                    placeholder="Select Market Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Outlate Name</label>
                  <InputField
                    value={values?.outletName}
                    name="outletName"
                    placeholder="Outlate Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  {/* <label>Business Type</label> */}
                  <NewSelect
                    label="Outlet Type"
                    name="businessType"
                    options={businessTypeDDL}
                    value={values?.businessType}
                    onChange={(valueOption) => {
                      setFieldValue("businessType", valueOption);
                    }}
                    placeholder="Outlet Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Outlate Address</label>
                  <InputField
                    value={values?.outletAddress}
                    name="outletAddress"
                    placeholder="Outlate Address"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Owner Name</label>
                  <InputField
                    value={values?.ownerName}
                    name="ownerName"
                    placeholder="Owner Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Contact Type</label>
                  <InputField
                    value={values?.contactType}
                    name="contactType"
                    placeholder="Contact Type"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Mobile Number</label>
                  <InputField
                    value={values?.mobileNumber}
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    type="number"
                    errors={errors}
                    touched={touched}
                    min="0"
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Email Address</label>
                  <InputField
                    value={values?.emailAddress}
                    name="emailAddress"
                    placeholder="Email Address"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Owner NID</label>
                  <InputField
                    value={values?.ownerNid}
                    name="ownerNid"
                    placeholder="Owner NID"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Date of Birth</label>
                  <InputField
                    value={values?.dateOfBirth}
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    type="date"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  {/* <label>Route Name</label> */}
                  <NewSelect
                    label="Marriage Satus"
                    name="marriageSatus"
                    options={[]}
                    value={values?.marriageSatus}
                    onChange={(valueOption) => {
                      setFieldValue("marriageSatus", valueOption);
                    }}
                    placeholder="Select Marriage Satus"
                    errors={errors}
                    isDisabled={true}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Marriage Date</label>
                  <InputField
                    value={values?.marriageDate}
                    name="marriageDate"
                    placeholder="Marriage Date"
                    type="date"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Lattitude</label>
                  <InputField
                    value={values?.lattitude}
                    name="lattitude"
                    placeholder="Lattitude"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Longitude</label>
                  <InputField
                    value={values?.longitude}
                    name="longitude"
                    placeholder="Longitude"
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Trade License No.</label>
                  <InputField
                    value={values?.tradeLicense}
                    name="tradeLicense"
                    placeholder="Trade License No."
                    type="text"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="maxSales"
                    options={[]}
                    value={values?.maxSales || ""}
                    label="Max Sales Item"
                    onChange={(valueOption) => {
                      setFieldValue("maxSales", valueOption);
                    }}
                    placeholder="Max Sales Item"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Average Sales Amount</label>
                  <InputField
                    value={values?.avgSalesAmount}
                    name="avgSalesAmount"
                    placeholder="Average Sales Amount"
                    type="number"
                    min="0"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-2 pt-5">
                  <label className="px-2">Is Profile Complete</label>
                  <Field
                    checked={values?.isComplete}
                    name="isComplete"
                    type="checkbox"
                    errors={errors}
                    touched={touched}
                    disabled={true}
                  />
                </div>
                <div
                  className="col-xl-1 col-lg-2 d-flex"
                  style={{ marginTop: "20px" }}
                >
                  <input
                    style={{
                      width: "15px",
                      height: "15px",
                      position: "relative",
                      top: "3px",
                    }}
                    name="isColler"
                    checked={values?.isColler}
                    onChange={(e) => {
                      setFieldValue("collerCompany", "");
                      setFieldValue("isColler", e.target.checked);
                    }}
                    className=" mr-2"
                    type="checkbox"
                    disabled={true}
                  />
                  <label>Is Coller</label>
                </div>
                {values?.isColler === true && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="collerCompany"
                      options={collerCompanyDDL || []}
                      value={values?.collerCompany}
                      label="Coller Company"
                      onChange={(valueOption) => {
                        setFieldValue("collerCompany", valueOption);
                      }}
                      isDisabled={true}
                      placeholder="Coller Company"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
              </div>

              <div className="row">
                {attributes.map((item) =>
                  renderFields(item, values, setFieldValue, errors, touched)
                )}
              </div>

              <div className="row cash_journal">
                <div className="col-lg-12 pr-0 pl-0">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Attachment Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {imageDTO?.map((item, index) => (
                        <tr>
                          <td className="text-center"> {index + 1}</td>
                          <td>{item?.fileName}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className="pointer"
                                onClick={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(item.fileId)
                                  );
                                }}
                              >
                                <IView />
                              </span>
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
