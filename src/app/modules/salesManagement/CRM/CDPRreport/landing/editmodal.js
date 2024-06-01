import React, { useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { Formik } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {};

function EditModal({ clickedRow, landingCB }) {
  const [, EditCDPMasterDataById, postLoading] = useAxiosPost();
  const formikRef = React.useRef(null);

  const saveHandler = (values) => {
    const payload = {
      intId: clickedRow?.intId || 0,
      no: clickedRow?.no || 0,
      productName: values?.productName || "",
      companyName: values?.companyName || "",
      contactPersonsName: values?.contactPersonName || "",
      contactNumber: values?.contactNumber || "",
      activeInactive: values?.activeInactive?.label || "",
      accountManager: values?.accountManager || "",
      jobTitle: values?.jobTitle || "",
      ageRange: values?.ageRange || "",
      gender: values?.gender?.label || "",
      industry: values?.industry || "",
      locationDistrict: values?.locationDistrict || "",
      employeeNumber: values?.employeeNumber || "",
      incomeLevel: values?.incomeLevel || "",
      painPoints: values?.painPoints || "",
      goals: values?.goals || "",
      whyTheyChooseUs: values?.whyTheyChooseUs || "",
      buyingBehavior: values?.buyingBehavior || "",
      preferredCommunicationChannels:
        values?.preferredCommunicationChannels || "",
      competitorsBrandUsages: values?.competitorsBrandUsages || "",
      enroll: values?.enroll || '',
      customerId: values?.customerId || '',
      channel: values?.channel?.label || "",
    };
    EditCDPMasterDataById(
      `/partner/PManagementCommonDDL/EditCDPMasterDataById`,
      payload,
      () => {
        landingCB();
      },
      true
    );
  };

  useEffect(() => {
    if (formikRef.current) {
      const defaultValues = clickedRow || {};
      formikRef.current.setFieldValue(
        "productName",
        defaultValues?.productName || ""
      );
      formikRef.current.setFieldValue(
        "companyName",
        defaultValues?.companyName || ""
      );
      formikRef.current.setFieldValue(
        "contactPersonName",
        defaultValues?.contactPersonsName || ""
      );
      formikRef.current.setFieldValue(
        "contactNumber",
        defaultValues?.contactNumber || ""
      );
      formikRef.current.setFieldValue(
        "activeInactive",
        defaultValues?.activeInactive
          ? {
              value: defaultValues?.activeInactive || "",
              label: defaultValues?.activeInactive || "",
            }
          : ""
      );
      formikRef.current.setFieldValue(
        "accountManager",
        defaultValues?.accountManager || ""
      );
      formikRef.current.setFieldValue(
        "jobTitle",
        defaultValues?.jobTitle || ""
      );
      formikRef.current.setFieldValue(
        "ageRange",
        defaultValues?.ageRange || ""
      );
      formikRef.current.setFieldValue(
        "gender",
        defaultValues?.gender
          ? {
              value: defaultValues?.gender || "",
              label: defaultValues?.gender || "",
            }
          : ""
      );
      formikRef.current.setFieldValue(
        "industry",
        defaultValues?.industry || ""
      );
      formikRef.current.setFieldValue(
        "locationDistrict",
        defaultValues?.locationDistrict || ""
      );
      formikRef.current.setFieldValue(
        "employeeNumber",
        defaultValues?.employeeNumber || ""
      );
      formikRef.current.setFieldValue(
        "incomeLevel",
        defaultValues?.incomeLevel || ""
      );
      formikRef.current.setFieldValue(
        "painPoints",
        defaultValues?.painPoints || ""
      );
      formikRef.current.setFieldValue("goals", defaultValues?.goals || "");
      formikRef.current.setFieldValue(
        "whyTheyChooseUs",
        defaultValues?.whyTheyChooseUs || ""
      );
      formikRef.current.setFieldValue(
        "buyingBehavior",
        defaultValues?.buyingBehavior || ""
      );
      formikRef.current.setFieldValue(
        "preferredCommunicationChannels",
        defaultValues?.preferredCommunicationChannels || ""
      );
      formikRef.current.setFieldValue(
        "competitorsBrandUsages",
        defaultValues?.competitorsBrandUsages || ""
      );
      formikRef.current.setFieldValue("enroll", defaultValues?.enroll || "");
      formikRef.current.setFieldValue(
        "channel",
        defaultValues?.channel
          ? {
              value: defaultValues?.channel || "",
              label: defaultValues?.channel || "",
            }
          : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        innerRef={formikRef}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title="CDP Rreport Edit"
              saveHandler={() => {
                saveHandler(values);
              }}
            >
              <div className="row global-form my-3">
                <div className="col-lg-3">
                  <InputField
                    value={values?.productName || ""}
                    label="Product Name"
                    name="productName"
                    placeholder="Product Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.companyName || ""}
                    label="Company Name"
                    name="companyName"
                    placeholder="Company Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.contactPersonName || ""}
                    label="Contact Person's Name"
                    name="contactPersonName"
                    placeholder="Contact Person's Name"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.contactNumber || ""}
                    label="Contact Number"
                    name="contactNumber"
                    placeholder="Contact Number"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="activeInactive"
                    options={
                      [
                        {
                          value: "Active",
                          label: "Active",
                        },
                        {
                          value: "Inactive",
                          label: "Inactive",
                        },
                      ] || []
                    }
                    value={values?.activeInactive}
                    label="Active/ Inactive"
                    onChange={(valueOption) => {
                      setFieldValue("activeInactive", valueOption || "");
                    }}
                    placeholder="Select Active/ Inactive"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.accountManager || ""}
                    label="Account Manager"
                    name="accountManager"
                    placeholder="Account Manager"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.jobTitle || ""}
                    label="Job Title"
                    name="jobTitle"
                    placeholder="Job Title"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Age Range input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.ageRange || ""}
                    label="Age Range"
                    name="ageRange"
                    placeholder="Age Range"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* Gender DDL */}
                <div className="col-lg-3">
                  <NewSelect
                    name="gender"
                    options={
                      [
                        {
                          value: "Male",
                          label: "Male",
                        },
                        {
                          value: "Female",
                          label: "Female",
                        },
                      ] || []
                    }
                    value={values?.gender}
                    label="Gender"
                    onChange={(valueOption) => {
                      setFieldValue("gender", valueOption || "");
                    }}
                    placeholder="Select Gender"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* Industry input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.industry || ""}
                    label="Industry"
                    name="industry"
                    placeholder="Industry"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Location District input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.locationDistrict || ""}
                    label="Location (District)"
                    name="locationDistrict"
                    placeholder="Location (District)"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Employee Number input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.employeeNumber || ""}
                    label="Employee Number"
                    name="employeeNumber"
                    placeholder="Employee Number"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Income Level input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.incomeLevel || ""}
                    label="Income Level"
                    name="incomeLevel"
                    placeholder="Income Level"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Pain Points input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.painPoints || ""}
                    label="Pain Points"
                    name="painPoints"
                    placeholder="Pain Points"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Goals input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.goals || ""}
                    label="Goals"
                    name="goals"
                    placeholder="Goals"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Why They Choose Us input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.whyTheyChooseUs || ""}
                    label="Why They Choose Us"
                    name="whyTheyChooseUs"
                    placeholder="Why They Choose Us"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Buying Behavior input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.buyingBehavior || ""}
                    label="Buying Behavior"
                    name="buyingBehavior"
                    placeholder="Buying Behavior"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Preferred Communication Channels input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.preferredCommunicationChannels || ""}
                    label="Preferred Communication Channels"
                    name="preferredCommunicationChannels"
                    placeholder="Preferred Communication Channels"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Competitors Brand Usages input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.competitorsBrandUsages || ""}
                    label="Competitors Brand Usages"
                    name="competitorsBrandUsages"
                    placeholder="Competitors Brand Usages"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Enroll input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.enroll || ""}
                    label="Enroll"
                    name="enroll"
                    placeholder="Enroll"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* customerId */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.customerId || ""}
                    label="Customer Id"
                    name="customerId"
                    placeholder="Customer Id"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Channel DDL */}
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    options={
                      [
                        {
                          value: "B2B",
                          label: "B2B",
                        },
                        {
                          value: "B2C",
                          label: "B2C",
                        },
                      ] || []
                    }
                    value={values?.channel}
                    label="Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption || "");
                    }}
                    placeholder="Select Channel"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
              </div>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}

export default EditModal;
