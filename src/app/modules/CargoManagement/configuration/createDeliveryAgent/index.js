import { Divider } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const validationSchema = Yup.object().shape({
    agentName: Yup.string().required("Agent Name is required"),
    contact: Yup.string().required("Contact is required"),
    email: Yup.string().email("Email is not valid").required("Email is required"),
});
function CreateDeliveryAgent() {
    const history = useHistory();
    const { id } = useParams()
    const formikRef = React.useRef(null);
    const [, saveDeliveryAgent, isLoading,] = useAxiosPost();
    const [getDeliveryAgentListByData, setDeliveryAgentListById] = useAxiosGet();

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
    return (
        <ICustomCard
            title={id ? "Edit Delivery Agent" : "Create Delivery Agent"}
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

                                {/* agentName */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.agentName}
                                        label="Agent Name"
                                        name="agentName"
                                        placeholder="Agent Name"
                                        type="text"
                                    />
                                </div>

                                {/* contact */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.contact}
                                        label="Contact"
                                        name="contact"
                                        placeholder="Contact"
                                        type="text"
                                    />
                                </div>

                                {/* email */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.email}
                                        label="Email"
                                        name="email"
                                        placeholder="Email"
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

export default CreateDeliveryAgent;
