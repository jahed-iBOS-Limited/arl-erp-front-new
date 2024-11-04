import axios from "axios";
import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import TextArea from "../../../../_helper/TextArea";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  attachment_action,
  customerListDDL,
  getBusinessUnitDDLApi,
  getComplainCategory,
  getComplainSubcategoryApi,
  getDistributionChannelDDL,
  getItemCategoryDDL,
  getSupplierDDLApi,
  respondentTypeDDL,
} from "../helper";
import RespondentModal from "./RespondentModal";
export const validationSchema = Yup.object().shape({
  occurrenceDate: Yup.date().required("Occurrence Date is required"),
  respondentType: Yup.object().shape({
    label: Yup.string().required("Respondent Type is required"),
    value: Yup.string().required("Respondent Type is required"),
  }),
  // respondentName: Yup.object().shape({
  //   label: Yup.string().required("Field is required"),
  //   value: Yup.string().required("Field is required"),
  // }),
  respondentName: Yup.object().when("respondentType.value", {
    is: (value) => value !== "4",
    then: Yup.object().shape({
      label: Yup.string().required("Field is required"),
      value: Yup.string().required("Field is required"),
    }),
  }),
  respondentBusinessUnit: Yup.object().shape({
    label: Yup.string().required("Respondent BusinessUnit is required"),
    value: Yup.string().required("Respondent BusinessUnit is required"),
  }),
  respondentContact: Yup.string()
    .required("Respondent Contact is required")
    .matches(/^[0-9]+$/, "Must be only number"),
  issueType: Yup.object().shape({
    label: Yup.string().required("Issue Type is required"),
    value: Yup.string().required("Issue Type is required"),
  }),
  issueSubType: Yup.object().shape({
    label: Yup.string().required("Sub Issue Type is required"),
    value: Yup.string().required("Sub Issue Type is required"),
  }),
  issueDetails: Yup.string().required("Issue Details is required"),
  respondent: Yup.string().required("Respondent Name is required"),
});

function Form({
  initData,
  saveHandler,
  history,
  fileObjects,
  setFileObjects,
  setLoading,
  accId,
  buId,
  view,
}) {
  const [open, setOpen] = useState(false);
  const [complainCategory, setComplainCategory] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [complainSubCategory, setComplainSubCategory] = useState([]);
  const [contactSourceDDL, getContactSourceDDL] = useAxiosGet();
  const [isRespondentModal, setShowRespondentModal] = useState(false);

  useEffect(() => {
    if (accId && buId) {
      getBusinessUnitDDLApi(accId, setBusinessUnitDDL);
      getComplainCategory(buId, setComplainCategory);
      getContactSourceDDL(`/oms/CustomerPoint/ContactSourceDDL`);
    }
  }, [accId, buId]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (initData?.respondentType?.value) {
      // if type supplier
      if (initData?.respondentType?.value === 2) {
        setSupplierDDL([]);
        getSupplierDDLApi(
          accId,
          initData?.respondentBusinessUnit?.value,
          setSupplierDDL
        );
      }
      // if type customer
      if (initData?.respondentType?.value === 3) {
        setCustomerDDL([]);
        customerListDDL(
          accId,
          initData?.respondentBusinessUnit?.value,
          setCustomerDDL
        );
      }
      getItemCategoryDDL(
        accId,
        initData?.respondentBusinessUnit?.value,
        setLoading,
        setItemCategoryDDL
      );
      getDistributionChannelDDL(
        accId,
        initData?.respondentBusinessUnit?.value,
        setDistributionChannelDDL
      );

      getComplainSubcategoryApi(
        initData?.respondentBusinessUnit?.value,
        initData?.issueType?.value,
        setComplainSubCategory
      );

      if (
        initData?.respondentBusinessUnit?.value &&
        initData?.issueType?.value
      ) {
        getComplainSubcategoryApi(
          initData?.respondentBusinessUnit?.value,
          initData?.issueType?.value,
          setComplainSubCategory
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <ICustomCard
            title={"Feedback Entry"}
            backHandler={() => {
              history.goBack();
            }}
            saveHandler={
              view
                ? false
                : () => {
                  handleSubmit();
                }
            }
            resetHandler={
              view
                ? false
                : () => {
                  resetForm(initData);
                }
            }
          >
            <form>
              <div className="row global-form">
                <div className="col-lg-12">
                  <h6>General Information</h6>
                </div>

                <div className="col-lg-3">
                  <label>
                    <b style={{ color: "red" }}>* </b>Occurrence Date
                  </label>
                  <InputField
                    value={values?.occurrenceDate}
                    placeholder="Occurrence Date"
                    name="occurrenceDate"
                    type="date"
                    disabled={view}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.occurrenceTime}
                    label="Occurrence Time"
                    placeholder="Occurrence Time"
                    name="occurrenceTime"
                    type="time"
                    disabled={view}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="respondentBusinessUnit"
                    options={businessUnitDDL || []}
                    value={values?.respondentBusinessUnit}
                    label="Respondent Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue(
                        "respondentBusinessUnit",
                        valueOption || ""
                      );
                      setItemCategoryDDL([]);
                      getItemCategoryDDL(
                        accId,
                        valueOption?.value,
                        setLoading,
                        setItemCategoryDDL
                      );
                      setDistributionChannelDDL([]);
                      getDistributionChannelDDL(
                        accId,
                        valueOption?.value,
                        setDistributionChannelDDL
                      );
                      setFieldValue("respondentType", "");
                      setFieldValue("respondentName", "");
                      setFieldValue("respondentContact", "");
                      setFieldValue("respondentContact", "");
                      setFieldValue("itemCategory", "");
                      setFieldValue("challanOrPO", "");
                      setFieldValue("distributionChannel", "");
                      setFieldValue("issueType", "");
                      setFieldValue("issueSubType", "");
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="respondentType"
                    options={respondentTypeDDL || []}
                    value={values?.respondentType}
                    label="Respondent Type"
                    onChange={(valueOption) => {
                      setFieldValue("respondentType", valueOption || "");
                      setFieldValue("respondentName", "");
                      setFieldValue("respondentContact", "");
                      setFieldValue("challanOrPO", "");
                      setFieldValue("respondent", "");
                      setFieldValue("deliveryDate", "");
                      setFieldValue("sourceCustomerType", "");

                      // if type supplier
                      if (valueOption?.value === 2) {
                        setSupplierDDL([]);
                        getSupplierDDLApi(
                          accId,
                          values?.respondentBusinessUnit?.value,
                          setSupplierDDL
                        );
                      }
                      // if type customer
                      if (valueOption?.value === 3) {
                        setCustomerDDL([]);
                        customerListDDL(
                          accId,
                          values?.respondentBusinessUnit?.value,
                          setCustomerDDL
                        );
                      }
                    }}
                    placeholder="Respondent Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.respondentBusinessUnit || view}
                  />
                </div>
                {/* if respondent type Customer "3" */}
                {values?.respondentType?.value === 3 && (
                  <div className="col-lg-3">
                    <NewSelect
                      isRequiredSymbol={true}
                      name="respondentName"
                      options={customerDDL || []}
                      value={values?.respondentName}
                      label={`${values?.respondentType?.label} Name`}
                      onChange={(valueOption) => {
                        setFieldValue("respondentName", valueOption || "");
                        setFieldValue(
                          "respondentContact",
                          valueOption?.contactNo || ""
                        );
                        setFieldValue(
                          "respondent",
                          valueOption?.propitor || ""
                        );
                      }}
                      placeholder={`${values?.respondentType?.label} Name`}
                      errors={errors}
                      touched={touched}
                      isDisabled={view}
                    />
                  </div>
                )}
                {/* if respondent type Supplier "2" */}
                {values?.respondentType?.value === 2 && (
                  <div className="col-lg-3">
                    <NewSelect
                      isRequiredSymbol={true}
                      name="respondentName"
                      options={supplierDDL || []}
                      value={values?.respondentName}
                      label={`${values?.respondentType?.label} Name`}
                      onChange={(valueOption) => {
                        setFieldValue("respondentName", valueOption || "");
                        setFieldValue(
                          "respondentContact",
                          valueOption?.contactNo || ""
                        );
                        setFieldValue(
                          "respondent",
                          valueOption?.propitor || ""
                        );
                      }}
                      placeholder={`${values?.respondentType?.label} Name`}
                      errors={errors}
                      touched={touched}
                      isDisabled={view}
                    />
                  </div>
                )}

                {/* if respondent type End User "1" */}
                {values?.respondentType?.value === 1 && (
                  <div className="col-lg-3">
                    <label>
                      {" "}
                      <b
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </b>{" "}
                      {`${values?.respondentType?.label} Name`}
                    </label>
                    <SearchAsyncSelect
                      selectedValue={values?.respondentName}
                      handleChange={(valueOption) => {
                        setFieldValue("respondentName", valueOption || "");
                        setFieldValue(
                          "designationOrRelationship",
                          valueOption?.employeeDesignatioName || ""
                        );
                        setFieldValue(
                          "respondentContact",
                          valueOption?.contactNumber || ""
                        );
                        setFieldValue("respondent", valueOption?.label || "");
                      }}
                      loadOptions={(v) => {
                        if (v?.length < 2) return [];
                        return axios
                          .get(
                            `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${accId}&BusinessUnitId=0&searchTearm=${v}`
                          )
                          .then((res) => {
                            return res?.data?.map((itm) => ({
                              ...itm,
                              value: itm?.value,
                              label: `${itm?.level} [${itm?.employeeCode}]`,
                            }));
                          })
                          .catch((err) => []);
                      }}
                      placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                    />
                    <FormikError
                      name="respondentName"
                      errors={errors}
                      touched={touched}
                    />
                    {values?.respondentName && (
                      <small
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "green",
                        }}
                      >
                        Work Place : {values?.respondentName?.workPlace}
                      </small>
                    )}
                  </div>
                )}
                {values?.respondentType?.value === 4 && (
                  <div className="col-lg-3">
                    <NewSelect
                      isRequiredSymbol={true}
                      name="sourceCustomerType"
                      options={[
                        { value: "Retailer", label: "Retailer" },
                        { value: "Distributor", label: "Distributor" },
                      ]}
                      value={values?.sourceCustomerType}
                      label="Source Customer Type"
                      onChange={(valueOption) => {
                        setFieldValue("respondent", "");
                        setFieldValue("customer", "");
                        setFieldValue("upazila", "");
                        setFieldValue("sourceCustomerType", valueOption);
                      }}
                      placeholder="Source Customer Type"
                    // errors={errors}
                    // touched={touched}
                    // isDisabled={!values?.respondentBusinessUnit || view}
                    />
                  </div>
                )}
                {values?.respondentType?.value === 4 && (
                  <div className="col-lg-3">
                    <div className="d-flex">
                      <NewSelect
                        name="customer"
                        value={values?.customer}
                        label="Customer Name"
                        placeholder="Customer"
                        // errors={errors}
                        // touched={touched}
                        isDisabled={true}
                      />
                      <div
                        style={{
                          marginTop: "23px",
                          paddingLeft: "3px",
                          display:
                            !values || !values.sourceCustomerType
                              ? "none"
                              : "block",
                        }}
                      >
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">
                              {"Add Respondent Name"}
                            </Tooltip>
                          }
                        >
                          <span>
                            <i
                              style={{ color: "#3699ff" }}
                              className={`fas fa-plus-square`}
                              onClick={() => setShowRespondentModal(true)}
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-lg-3">
                  <div
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className="d-flex"
                  >
                    <label style={{ display: "block" }}>
                      <b style={{ color: "red" }}>*</b> Respondent Name
                    </label>
                  </div>
                  <InputField
                    value={values?.respondent}
                    placeholder="Respondent Name"
                    name="respondent"
                    type="text"
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue("respondent", e.target.value);
                      if (values?.respondentType?.value === 4) {
                        setFieldValue("respondentName", {
                          label: e.target.value,
                          value: 0,
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    <b style={{ color: "red" }}>*</b> Respondent Contact
                  </label>
                  <InputField
                    value={values?.respondentContact}
                    placeholder="Respondent Contact"
                    name="respondentContact"
                    type="text"
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue("respondentContact", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.respondentOrg}
                    label="Respondent Organization"
                    placeholder="Respondent Organization"
                    name="respondentOrg"
                    type="text"
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue("respondentOrg", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.respondentAddress}
                    label="Respondent Address"
                    placeholder="Respondent Address"
                    name="respondentAddress"
                    type="text"
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue("respondentAddress", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.designationOrRelationship}
                    label="Designation/Relationship"
                    placeholder="Designation/Relationship"
                    name="designationOrRelationship"
                    type="text"
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue(
                        "designationOrRelationship",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Upazila Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.upazila}
                    handleChange={(valueOption) => {
                      setFieldValue("upazila", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 2) return [];
                      return axios
                        .get(
                          `/oms/CustomerPoint/GetUpazilaForComplain?search=${v}`
                        )
                        .then((res) => {
                          return res?.data?.map((itm) => ({
                            ...itm,
                            value: 0,
                            label: itm?.label,
                          }));
                        })
                        .catch((err) => []);
                    }}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                  />
                </div>
                {/* Contact Source DDL */}
                <div className="col-lg-3">
                  <NewSelect
                    name="contactSource"
                    options={contactSourceDDL || []}
                    value={values?.contactSource}
                    label="Contact Source"
                    onChange={(valueOption) => {
                      setFieldValue("contactSource", valueOption || "");
                    }}
                    placeholder="Contact Source"
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className="col-lg-3 d-flex align-items-center">
                  {!view && (
                    <div className="">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => setOpen(true)}
                        style={{ padding: "4px 5px", marginTop: "14px" }}
                      >
                        Attachment
                      </button>
                    </div>
                  )}

                  <div>
                    {values?.attachment && (
                      <button
                        style={{ padding: "4px 5px", marginTop: "14px" }}
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.attachment)
                          );
                        }}
                      >
                        Attachment View
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <hr />
                  <h6>Issue</h6>
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="issueType"
                    options={complainCategory || []}
                    value={values?.issueType}
                    label="Issue Category"
                    onChange={(valueOption) => {
                      setFieldValue("issueType", valueOption || "");
                      setFieldValue("issueSubType", "");
                      getComplainSubcategoryApi(
                        values?.respondentBusinessUnit?.value,
                        valueOption?.value,
                        setComplainSubCategory
                      );
                    }}
                    placeholder="Issue Category"
                    errors={errors}
                    touched={touched}
                    isDisabled={view || !values?.respondentBusinessUnit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="issueSubType"
                    options={complainSubCategory || []}
                    value={values?.issueSubType}
                    label="Issue Type"
                    onChange={(valueOption) => {
                      setFieldValue("issueSubType", valueOption || "");
                    }}
                    placeholder="Issue Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    <b
                      style={{
                        color: "red",
                      }}
                    >
                      *
                    </b>{" "}
                    Issue Details
                  </label>
                  <TextArea
                    name="issueDetails"
                    value={values?.issueDetails || ""}
                    label="Issue Details"
                    placeholder="Issue Details"
                    touched={touched}
                    rows="2"
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue("issueDetails", e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.additionalCommentAndSuggestion}
                    label="Additional Comment & Suggestion"
                    placeholder="Additional Comment & Suggestion"
                    name="additionalCommentAndSuggestion"
                    type="text"
                    disabled={view}
                  />
                </div>

                <div className="col-lg-12">
                  <hr />
                  <h6>Product Information</h6>
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={distributionChannelDDL || []}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("distributionChannel", valueOption || "");
                    }}
                    placeholder="Distribution Channel"
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemCategory"
                    options={itemCategoryDDL || []}
                    value={values?.itemCategory}
                    label="Product Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemCategory", valueOption);
                    }}
                    placeholder="Product Category"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.respondentBusinessUnit || view}
                  />
                </div>

                {[2, 3].includes(values?.respondentType?.value) && (
                  <div className="col-lg-3">
                    <label>
                      {values?.respondentType?.value === 2
                        ? "PO No"
                        : "Challan No"}
                    </label>
                    <SearchAsyncSelect
                      selectedValue={values?.challanOrPO}
                      handleChange={(valueOption) => {
                        setFieldValue("challanOrPO", valueOption || "");

                        if (values?.respondentType?.value === 2) {
                          const poDate = valueOption?.poDate
                            ? _dateFormatter(valueOption?.poDate)
                            : "";
                          setFieldValue("deliveryDate", poDate);
                        }

                        if (values?.respondentType?.value === 3) {
                          const deliveryDate = valueOption?.deliveryDate
                            ? _dateFormatter(valueOption?.deliveryDate)
                            : "";
                          setFieldValue("deliveryDate", deliveryDate);
                        }
                      }}
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        const apiPath =
                          values?.respondentType?.value === 2
                            ? `/wms/InventoryTransaction/GetAllPoWithGrnDDL?businessUnitId=${values?.respondentBusinessUnit?.value}&Search=${v}`
                            : `/oms/Shipment/GetCompletedShipmentList?Businessunitid=${values?.respondentBusinessUnit?.value}&AccountId=${accId}&Search=${v}`;

                        return axios
                          .get(apiPath)
                          .then((res) => {
                            return res?.data;
                          })
                          .catch((err) => []);
                      }}
                      placeholder="Search (min 3 letter)"
                      isDisabled={!values?.respondentBusinessUnit || view}
                    />
                    <FormikError
                      name="challanOrPO"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}

                <div className="col-lg-3">
                  <InputField
                    value={values?.deliveryDate}
                    label={`${values?.respondentType?.value === 2 ? "PO" : "Challan"
                      } Date`}
                    placeholder="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    disabled={view}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.reference}
                    label="Reference (Factory/Batch/Number)"
                    placeholder="Reference (Factory/Batch/Number)"
                    name="reference"
                    type="text"
                    disabled={view}
                  />
                </div>
              </div>
            </form>

            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={["image/*", "application/pdf"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={1000000}
              open={open}
              onAdd={(newFileObjs) => {
                setFileObjects([].concat(newFileObjs));
              }}
              onDelete={(deleteFileObj) => {
                const newData = fileObjects.filter(
                  (item) => item.file.name !== deleteFileObj.file.name
                );
                setFileObjects(newData);
              }}
              onClose={() => setOpen(false)}
              onSave={() => {
                setOpen(false);
                attachment_action(fileObjects, setFieldValue, setLoading);
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
            <IViewModal
              show={isRespondentModal}
              onHide={() => setShowRespondentModal(false)}
            >
              <RespondentModal
                title={values?.sourceCustomerType?.value}
                setter={setFieldValue}
                onHide={() => setShowRespondentModal(false)}
                respondedBuId={values?.respondentBusinessUnit?.value}
              />
            </IViewModal>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default Form;
