import { Form, Formik } from "formik";
import React from "react";
// import { useParams } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import TextArea from "../../../../_helper/TextArea";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.number().required("Phone is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Email is invalid"),
  storied: Yup.object().shape({
    value: Yup.number().required("Storied is required"),
    label: Yup.string().required("Storied is required"),
  }),
  projectStatus: Yup.object().shape({
    value: Yup.number().required("Project Status is required"),
    label: Yup.string().required("Project Status is required"),
  }),
  division: Yup.object().shape({
    value: Yup.number().required("Division is required"),
    label: Yup.string().required("Division is required"),
  }),
  district: Yup.object().shape({
    value: Yup.number().required("District is required"),
    label: Yup.string().required("District is required"),
  }),
  thana: Yup.object().shape({
    value: Yup.number().required("Thana is required"),
    label: Yup.string().required("Thana is required"),
  }),
  shop: Yup.string().required("Shop is required"),
  retailShopAddress: Yup.string().required("Retail Shop Address is required"),
  //   businessPartner: Yup.string().required("Business Partner is required"),
  //   deliveryAddress: Yup.string().required("Delivery Address is required"),
  //   sourceOrAdvertise: Yup.object().shape({
  //     value: Yup.number().required("Source/Advertise is required"),
  //     label: Yup.string().required("Source/Advertise is required"),
  //   }),
  //   reference: Yup.object().shape({
  //     value: Yup.number().required("Reference is required"),
  //     label: Yup.string().required("Reference is required"),
  //   }),

  //   item: Yup.object().shape({
  //     value: Yup.number().required("Item is required"),
  //     label: Yup.string().required("Item is required"),
  //   }),
  //   uom: Yup.string().required("UOM is required"),
  //   quantity: Yup.number().required("Quantity is required"),
});
function CreateCustomerLeadGeneration() {
  const history = useHistory();
  const [divisionDDL, getDivisionDDL] = useAxiosGet();
  const [districtDDL, getDistrictDDL] = useAxiosGet();
  const [thanaDDL, getThanaDDL] = useAxiosGet();
  const [storiedDDL, getStoriedDDL] = useAxiosGet();
  const [projectStatusDDL, getProjectStatusDDL] = useAxiosGet();
  const [referenceDDL, getReferenceDDL] = useAxiosGet();
  const [sourceOrAdvertiseDDL, getSourceOrAdvertiseDDL] = useAxiosGet();
  //   const { id } = useParams();
  const formikRef = React.useRef(null);

  const {
    profileData: { userId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData || {}, shallowEqual);
  const saveHandler = (values, cb) => {};

  React.useEffect(() => {
    getDivisionDDL("/oms/TerritoryInfo/GetDivisionDDL?countryId=18");
    getStoriedDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${selectedBusinessUnit?.value}&typeId=5&referenceId=5`
    );
    getProjectStatusDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${
        selectedBusinessUnit?.value === 4 ? 4 : 0
      }&typeId=2&referenceId=2`
    );
    // /hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=1&BusinessUnitId=232&Search=abdul
    getReferenceDDL(
      `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getSourceOrAdvertiseDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${selectedBusinessUnit?.value}&typeId=4&referenceId=4`
    );
  }, []);

  const getDistrict = (divisionId) => {
    getDistrictDDL(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=${divisionId}`
    );
  };

  const getThana = (districtId) => {
    getThanaDDL(
      `/oms/SalesQuotation/GetUserWiseShipToPartnerAndZoneDDL?partName=TransportZoneDDL&userId=${userId}&businessUnitId=${selectedBusinessUnit?.value}&districtId=${districtId}`
    );
  };

  return (
    <ICustomCard
      title={"Create Customer Lead Generation"}
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
      {/* {(bookingGlobalBankLoading || isLoading) && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          phone: "",
          email: "",
          storied: "",
          projectStatus: "",
          division: "",
          district: "",
          thana: "",
          shop: "",
          retailShopAddress: "",
          businessPartner: "",
          deliveryAddress: "",
          sourceOrAdvertise: "",
          reference: "",
          item: "",
          uom: "",
          quantity: "",
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
            {/* <h1>
                            {JSON.stringify(errors)}
                        </h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* name */}
                  <div className="col-lg-3">
                    <InputField
                      label="Name"
                      type="text"
                      name="name"
                      value={values?.name}
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                      }}
                    />
                  </div>
                  {/* phone */}
                  <div className="col-lg-3">
                    <InputField
                      label="Phone"
                      type="number"
                      name="phone"
                      value={values?.phone}
                      onChange={(e) => {
                        setFieldValue("phone", e.target.value);
                      }}
                    />
                  </div>
                  {/* email */}
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
                  {/* storied */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={
                        selectedBusinessUnit?.value === 4 ? "Storied" : "Type"
                      }
                      options={storiedDDL || []}
                      value={values?.storied}
                      name="storied"
                      onChange={(valueOption) => {
                        setFieldValue("storied", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* projectStatus */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Project Status"}
                      options={projectStatusDDL || []}
                      value={values?.projectStatus}
                      name="projectStatus"
                      onChange={(valueOption) => {
                        setFieldValue("projectStatus", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* division */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Division"}
                      options={divisionDDL || []}
                      value={values?.division}
                      name="division"
                      onChange={(valueOption) => {
                        setFieldValue("division", valueOption || "");
                        setFieldValue("district", "");
                        setFieldValue("thana", "");
                        valueOption?.value && getDistrict(valueOption?.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* district */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"District"}
                      options={districtDDL || []}
                      value={values?.district}
                      name="district"
                      onChange={(valueOption) => {
                        setFieldValue("district", valueOption || "");
                        setFieldValue("thana", "");
                        valueOption?.value && getThana(valueOption?.value);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.division?.value ? false : true}
                    />
                  </div>
                  {/* thana */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Thana"}
                      options={thanaDDL || []}
                      value={values?.thana}
                      name="thana"
                      onChange={(valueOption) => {
                        setFieldValue("thana", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        values?.division?.value && values?.district?.value
                          ? false
                          : true
                      }
                    />
                  </div>
                  {/* shop */}
                  <div className="col-lg-3">
                    <InputField
                      label="Shop"
                      type="text"
                      name="shop"
                      value={values?.shop}
                      onChange={(e) => {
                        setFieldValue("shop", e.target.value);
                      }}
                    />
                  </div>
                  {/* retailShopAddress */}
                  <div className="col-lg-6">
                    {/* <InputField
                      label="Retail Shop Address"
                      type="text"
                      name="retailShopAddress"
                      value={values?.retailShopAddress}
                      onChange={(e) => {
                        setFieldValue("retailShopAddress", e.target.value);
                      }}
                    /> */}
                    <label htmlFor="retailShopAddress">
                      Retail Shop Address
                    </label>

                    <TextArea
                      label="Retail Shop Address"
                      value={values?.retailShopAddress}
                      name="retailShopAddress"
                      placeholder="Retail Shop Address"
                      type="text"
                    />
                  </div>
                  {/* businessPartner */}
                  <div className="col-lg-3">
                    <InputField
                      label="Business Partner"
                      type="text"
                      name="businessPartner"
                      value={values?.businessPartner}
                      onChange={(e) => {
                        setFieldValue("businessPartner", e.target.value);
                      }}
                    />
                  </div>
                  {/* deliveryAddress */}
                  <div className="col-lg-3">
                    <InputField
                      label="Delivery Address"
                      type="text"
                      name="deliveryAddress"
                      value={values?.deliveryAddress}
                      onChange={(e) => {
                        setFieldValue("deliveryAddress", e.target.value);
                      }}
                    />
                  </div>
                  {/* sourceOrAdvertise */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Source/Advertise"}
                      options={sourceOrAdvertiseDDL || []}
                      value={values?.sourceOrAdvertise}
                      name="sourceOrAdvertise"
                      onChange={(valueOption) => {
                        setFieldValue("sourceOrAdvertise", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* reference */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Reference"}
                      options={referenceDDL || []}
                      value={values?.reference}
                      name="reference"
                      onChange={(valueOption) => {
                        setFieldValue("reference", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-12">
                    <hr />
                    <h3>Item Information</h3>
                  </div>
                  {/* item */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Item"}
                      options={[]}
                      value={values?.item}
                      name="item"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* uom */}
                  <div className="col-lg-3">
                    <InputField
                      label="UOM"
                      type="text"
                      name="uom"
                      value={values?.uom}
                      onChange={(e) => {
                        setFieldValue("uom", e.target.value);
                      }}
                      disabled
                    />
                  </div>
                  {/* quantity */}
                  <div className="col-lg-3">
                    <InputField
                      label="Quantity"
                      type="number"
                      name="quantity"
                      value={values?.quantity}
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default CreateCustomerLeadGeneration;
