import { Divider } from "@material-ui/core";
import { Form, Formik } from "formik";
import _ from "lodash";
import React from "react";
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
    agentName: Yup.string().required("Agent Name is required"),
    contact: Yup.string().required("Contact is required"),
    email: Yup.string().email("Email is not valid").required("Email is required"),
});
function CreateBusinessPartner() {
    const history = useHistory();
    const { id } = useParams()
    const formikRef = React.useRef(null);
    const [, saveDeliveryAgent, isLoading,] = useAxiosPost();
    const [getDeliveryAgentListByData, setDeliveryAgentListById] = useAxiosGet();

    const [countryList, getCountryList] = useAxiosGet();
    const [stateDDL, setStateDDL] = useAxiosGet();
    const [cityDDL, setCityDDL] = useAxiosGet();


    const saveHandler = (values, cb) => {
        const payload = {
            agentId: id ? id : 0,
            agentCode: values?.agentCode || 0,
            agentName: values?.agentName || "",
            contact: values?.contact || "",
            email: values?.email || "",
            vehicleType: "",
            rating: 0,
            isActive: true,
        };
        saveDeliveryAgent(`${imarineBaseUrl}/domain/ShippingService/SaveDeliveryAgent`, payload, () => {
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
        getCountryList(
            `${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`,
        );


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const debouncedGetCityList = _.debounce((value) => {
        setCityDDL(
            `${imarineBaseUrl}/domain/ShippingService/GetPreviousCityDDL?search=${value}`,
        );
    }, 300);

    const debouncedGetStateList = _.debounce((value) => {
        setStateDDL(
            `${imarineBaseUrl}/domain/ShippingService/GetPreviousStateDDL?search=${value}`,
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
            resetHandler={() => { formikRef.current.resetForm() }
            }
        >
            <Formik
                enableReinitialize={true}
                initialValues={{
                    agentName: "",
                    contact: "",
                    email: "",
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
                                    />
                                </div>

                                {/* Business Partner Type */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        label="Business Partner Type"
                                        options={[
                                            { value: "Shipper", label: "Shipper" },
                                            { value: "Consignee", label: "Consignee" },
                                            { value: "Delivery Agent", label: "Delivery Agent" },
                                            { value: "Notify Party", label: "Notify Party" },
                                        ]}

                                    />
                                </div>
                                {/* Country ddl */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        // name="consigneeCountry"
                                        options={countryList || []}
                                        // value={values?.consigneeCountry}
                                        label="Country"
                                        // onChange={(valueOption) => {
                                        //     setFieldValue('consigneeCountry', valueOption);
                                        //     // setFieldValue("consigneeDivisionAndState", "");
                                        //     // getConsigneeDivisionAndStateApi(valueOption?.value);
                                        // }}
                                        placeholder="Country"
                                    // errors={errors}
                                    // touched={touched}
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
                                    />
                                </div>
                                {/* Zip/Postal Code */}
                                <div className="col-lg-3">
                                    <InputField
                                        label="Zip/Postal Code"
                                        type="number"

                                    />
                                </div>
                                {/*  Address */}
                                <div className="col-lg-3">
                                    <InputField
                                        label="Address"
                                        type="text"
                                    />
                                </div>
                                {/* Contact Person */}
                                <div className="col-lg-3">
                                    <InputField
                                        label="Contact Person"
                                        type="text"
                                    />
                                </div>
                                {/* Contact Number  */}
                                <div className="col-lg-3">
                                    <InputField
                                        label="Contact Number"
                                        type="number"
                                    />
                                </div>
                                {/* Email */}
                                <div className="col-lg-3">
                                    <InputField
                                        label="Email"
                                        type="email"

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
