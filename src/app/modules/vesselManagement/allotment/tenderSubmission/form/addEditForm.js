import { FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { ErrorMessage, initData, validationSchema } from "../helper";


export default function TenderSubmissionCreateEditForm() {
    const [objProps, setObjprops] = useState({});

    const saveHandler = (values, cb) => {
        alert(JSON.stringify(values, null, 2));
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm(initData);
                });
            }}
        >
            {({
                handleSubmit,
                resetForm,
                values,
                setFieldValue,
                errors,
                touched,
            }) => (
                <>
                    {false && <Loading />}
                    <IForm title="Tender Submission Create" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-12">
                                    <h4>Foreign Part</h4>
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.enquiry}
                                        label="Enquiry"
                                        name="enquiry"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("enquiry", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.submissionDate}
                                        label="Submission Date"
                                        name="submissionDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("submissionDate", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.foreignQnt}
                                        label="Foreign Quantity"
                                        name="foreignQnt"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("foreignQnt", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.productName}
                                        label="Product Name"
                                        name="productName"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("productName", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="loadPort"
                                        options={[
                                            { value: 1, label: "Item-1" },
                                            { value: 2, label: "Item-2" },
                                        ]}
                                        value={values?.loadPort}
                                        label="Load Port"
                                        onChange={(valueOption) => {
                                            setFieldValue("loadPort", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="dischargePort"
                                        options={[
                                            { value: 1, label: "Item-1" },
                                            { value: 2, label: "Item-2" },
                                        ]}
                                        value={values?.dischargePort}
                                        label="Discharge Port"
                                        onChange={(valueOption) => {
                                            setFieldValue("dischargePort", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.foreignPriceUSD}
                                        label="Foreign Price (USD)"
                                        name="foreignPriceUSD"
                                        type="number"
                                        onChange={(e) => {
                                            setFieldValue("foreignPriceUSD", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.commercialDate}
                                        label="Commercial Date"
                                        name="commercialDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("commercialDate", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.commercialNo}
                                        label="Commercial No"
                                        name="commercialNo"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("commercialNo", e.target.value);
                                        }}
                                    />
                                </div><div className="col-lg-3">
                                    <NewSelect
                                        name="motherVessel"
                                        options={[
                                            { value: 1, label: "Item-1" },
                                            { value: 2, label: "Item-2" },
                                        ]}
                                        value={values?.motherVessel}
                                        label="Mother Vessel"
                                        onChange={(valueOption) => {
                                            setFieldValue("motherVessel", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>


                                <div className="col-lg-12 mt-2">
                                    <h4>Local Transport</h4>
                                </div>
                                <FieldArray
                                    name="localTransportations"
                                    render={arrayHelpers => (
                                        <>
                                            {
                                                values.localTransportations.map((localTransport, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <div className="col-lg-3">
                                                                <NewSelect
                                                                    name={`localTransportations[${index}].godownName`}
                                                                    options={[
                                                                        { value: 1, label: "Item-1" },
                                                                        { value: 2, label: "Item-2" },
                                                                    ]}
                                                                    value={values?.localTransportations[index].godownName}
                                                                    label="Godowns"
                                                                    onChange={(valueOption) => {
                                                                        setFieldValue(`localTransportations[${index}].godownName`, valueOption);
                                                                    }}
                                                                    errors={errors}
                                                                    touched={touched}
                                                                />
                                                                <p className="text-danger"><ErrorMessage name={`localTransportations[${index}].godownName`} /></p>
                                                                {errors.localTransportations && typeof errors.localTransportations === 'string' && (
                                                                    <p className="text-danger">{errors.localTransportations}</p>
                                                                )}
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <InputField
                                                                    value={values?.localTransportations[index].quantity}
                                                                    label="Quantity (Ton)"
                                                                    name={`localTransportations[${index}].quantity`}
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        setFieldValue(`localTransportations[${index}].quantity`, e.target.value);
                                                                    }}
                                                                />
                                                                <p className="text-danger"><ErrorMessage name={`localTransportations[${index}].quantity`} /></p>

                                                            </div>
                                                            <div className="col-lg-3">
                                                                <InputField
                                                                    value={values?.localTransportations[index].price}
                                                                    label="Price"
                                                                    name={`localTransportations[${index}].price`}
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        setFieldValue(`localTransportations[${index}].price`, e.target.value);
                                                                    }}
                                                                />
                                                                <p className="text-danger"><ErrorMessage name={`localTransportations[${index}].price`} /></p>

                                                            </div>

                                                            {
                                                                values?.localTransportations.length > 1 ? <span type="button" className="px-2 py-1 ml-2 align-self-end rounded font-xl" onClick={() => arrayHelpers.remove(index)}>
                                                                    <i class="fa fa-times text-danger" style={{ fontSize: '18px' }} aria-hidden="true"></i>
                                                                </span> : <></>
                                                            }


                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                            <span
                                                type="button"
                                                className="px-2 py-1 text-success ml-2 align-self-end rounded font-xl"
                                                onClick={() => arrayHelpers.push({ godownName: '', quantity: '', price: '' })}
                                            >
                                                <i class="fa fa-plus text-success" style={{ fontSize: '18px' }} aria-hidden="true"></i>
                                            </span>
                                        </>
                                    )}
                                ></FieldArray>

                            </div>

                            <button
                                type="submit"
                                style={{ display: "none" }}
                                ref={objProps?.btnRef}
                                onSubmit={() => handleSubmit()}
                            ></button>

                            <button
                                type="reset"
                                style={{ display: "none" }}
                                ref={objProps?.resetBtnRef}
                                onSubmit={() => resetForm(initData)}
                            ></button>
                        </Form>
                    </IForm>
                </>
            )
            }
        </Formik >
    );
}


