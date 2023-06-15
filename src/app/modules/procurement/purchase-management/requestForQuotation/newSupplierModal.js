import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
const initData = {
    supplierName: "",
    supplierContactNo: "",
    supplierEmail: "",
};
export default function NewSupplierModal() {
    const [objProps, setObjprops] = useState({});
    const saveHandler = (values, cb) => { };
    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
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
                isValid,
                errors,
                touched,
            }) => (
                <>
                    {false && <Loading />}
                    <IForm title="Add New Supplier" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">

                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.supplierName}
                                        label="Supplier Name"
                                        name="supplierName"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("supplierName", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.supplierContactNo}
                                        label="Supplier Contact No"
                                        name="supplierContactNo"
                                        type="number"
                                        onChange={(e) => {
                                            setFieldValue("supplierContactNo", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.supplierEmail}
                                        label="Date"
                                        name="supplierEmail"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("supplierEmail", e.target.value);
                                        }}
                                    />
                                </div>
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
            )}
        </Formik>
    );
}