import { Divider } from "@material-ui/core";
import { Form, Formik } from "formik";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const validationSchema = Yup.object().shape({
  participantsName: Yup.string().required("Business Partner Name is required"),
  participantType: Yup.object().shape({
    value: Yup.string().required("Business Partner Type is required"),
  }),
  country: Yup.object().shape({
    value: Yup.string().required("Country is required"),
  }),
  state: Yup.object().shape({
    value: Yup.string().required("State is required"),
  }),
  city: Yup.object().shape({
    value: Yup.string().required("City is required"),
  }),
  zipCode: Yup.string().required("Zip/Postal Code is required"),
  address: Yup.string().required("Address is required"),
  contactPerson: Yup.string().required("Contact Person is required"),
  contactNumber: Yup.string().required("Contact Number is required"),
  email: Yup.string()
    .email()
    .required("Email is required"),
});
function CreateBusinessPartner() {
  const history = useHistory();
  const { id } = useParams();
  const formikRef = React.useRef(null);
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [, SaveShippingParticipants, isLoading] = useAxiosPost();
  const [getDeliveryAgentListByData, setDeliveryAgentListById] = useAxiosGet();

  const [countryList, getCountryList] = useAxiosGet();
  const [stateDDL, setStateDDL] = useAxiosGet();
  const [cityDDL, setCityDDL] = useAxiosGet();
  const [
    participantTypeListDDL,
    GetParticipantTypeListDDL,
    ,
    setParticipantTypeList,
  ] = useAxiosGet();

  const saveHandler = (values, cb) => {
    const payload = {
      participantId: 0,
      participantCode: "",
      participantTypeId: values?.participantType?.value || 0,
      participantType: values?.participantType?.label || "label",
      participantsName: values?.participantsName || "",
      companyName: values?.companyName || "",
      contactPerson: values?.contactPerson || "",
      contactNumber: values?.contactNumber || "",
      email: values?.email || "",
      countryId: values?.country?.value || 0,
      country: values?.country?.label || "",
      stateId:
        typeof values?.state?.value === "string"
          ? 0
          : values?.state?.value || 0,
      state: values?.state?.label || 0,
      cityId:
        typeof values?.city?.value === "string" ? 0 : values?.city?.value || 0,
      city: values?.city?.label || "",
      address: values?.address || "",
      zipCode: values?.zipCode || "",
      isActive: true,
      createdBy: userId,
      createdAt: moment().format("YYYY-MM-DDTHH:mm:ss"),
    };
    console.log("payload", payload);
    SaveShippingParticipants(
      `${imarineBaseUrl}/domain/ShippingService/SaveShippingParticipants`,
      payload,
      () => {
        formikRef.current.resetForm();
      }
    );
  };
  React.useEffect(() => {
    if (!id) return;
    setDeliveryAgentListById(
      `${imarineBaseUrl}/domain/ShippingService/GetDeliveryAgentById?AgentId=${id}`,
      (data) => {
        if (formikRef.current) {
          formikRef.current.setFieldValue("agentName", data?.agentName || "");
          formikRef.current.setFieldValue("contact", data?.contact || "");
          formikRef.current.setFieldValue("email", data?.email || "");
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getCountryList(`${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`);

    GetParticipantTypeListDDL(
      `${imarineBaseUrl}/domain/ShippingService/GettblParticipantType`,
      (redData) => {
        const updatedData = redData?.filter(item => item.value !== 4);
        setParticipantTypeList(updatedData);
      },
    );


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const debouncedGetCityList = _.debounce((value) => {
    setCityDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousCityDDL?search=${value}`
    );
  }, 300);

  const debouncedGetStateList = _.debounce((value) => {
    setStateDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousStateDDL?search=${value}`
    );
  }, 300);
  return (
    <ICustomCard
      title={id ? "Edit Business Partner" : "Create Business Partner"}
      backHandler={() => {
        history.goBack();
      }}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          participantType: { value: "", label: "" },
          participantsName: "",
          contactPerson: "",
          contactNumber: "",
          country: { value: "", label: "", countryId: "" },
          state: { value: "", label: "" },
          city: { value: "", label: "" },
          zipCode: "",
          email: "",
          address: "",
          companyName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                {/* Business Partner Name */}
                <div className="col-lg-3">
                  <InputField
                    label="Business Partner Name"
                    placeholder="Business Partner Name"
                    type="text"
                    name="participantsName"
                    value={values?.participantsName}
                    onChange={(e) => {
                      setFieldValue("participantsName", e.target.value);
                    }}
                  />
                </div>

                {/* Business Partner Type */}
                <div className="col-lg-3">
                  <NewSelect
                    label="Business Partner Type"
                    options={participantTypeListDDL || []}
                    name="participantType"
                    placeholder="Business Partner Type"
                    value={values?.participantType}
                    onChange={(valueOption) => {
                      setFieldValue("participantType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Country ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="country"
                    options={countryList || []}
                    value={values?.country}
                    label="Country"
                    onChange={(valueOption) => {
                      setFieldValue("country", valueOption);
                    }}
                    placeholder="Country"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* State/Province/Region ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    options={stateDDL || []}
                    label="State/Province/Region"
                    placeholder="Select or Create New Option"
                    isCreatableSelect={true}
                    onInputChange={(inputValue) => {
                      debouncedGetStateList(inputValue);
                    }}
                    name="state"
                    value={values?.state}
                    onChange={(valueOption) => {
                      setFieldValue("state", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* city */}
                <div className="col-lg-3">
                  <NewSelect
                    options={cityDDL || []}
                    label="City"
                    placeholder="Select or Create New Option"
                    isCreatableSelect={true}
                    onInputChange={(inputValue) => {
                      debouncedGetCityList(inputValue);
                    }}
                    value={values?.city}
                    name="city"
                    onChange={(valueOption) => {
                      setFieldValue("city", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Zip/Postal Code */}
                <div className="col-lg-3">
                  <InputField
                    label="Zip/Postal Code"
                    type="number"
                    name="zipCode"
                    value={values?.zipCode}
                    onChange={(e) => {
                      setFieldValue("zipCode", e.target.value);
                    }}
                  />
                </div>
                {/*  Address */}
                <div className="col-lg-3">
                  <InputField
                    label="Address"
                    type="text"
                    name="address"
                    value={values?.address}
                    onChange={(e) => {
                      setFieldValue("address", e.target.value);
                    }}
                  />
                </div>
                {/* Contact Person */}
                <div className="col-lg-3">
                  <InputField
                    label="Contact Person"
                    type="text"
                    name="contactPerson"
                    value={values?.contactPerson}
                    onChange={(e) => {
                      setFieldValue("contactPerson", e.target.value);
                    }}
                  />
                </div>
                {/* Contact Number  */}
                <div className="col-lg-3">
                  <InputField
                    label="Contact Number"
                    type="number"
                    name="contactNumber"
                    value={values?.contactNumber}
                    onChange={(e) => {
                      setFieldValue("contactNumber", e.target.value);
                    }}
                  />
                </div>
                {/* Email */}
                <div className="col-lg-3">
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={values?.email}
                    onChange={(e) => {
                      setFieldValue("email", e.target.value);
                    }}
                  />
                </div>
                {/* company name */}
                <div className="col-lg-3">
                  <InputField
                    label="Company Name (Optional)"
                    type="text"
                    name="companyName"
                    value={values?.companyName}
                    onChange={(e) => {
                      setFieldValue("companyName", e.target.value);
                    }}
                  />
                </div>
              </div>
              <Divider />
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default CreateBusinessPartner;
