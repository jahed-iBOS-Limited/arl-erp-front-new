import { Field, getIn } from "formik";
import React from "react";
import * as Yup from "yup";



export const ErrorMessage = ({ name }) => (
    <Field
        name={name}
        render={({ form }) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            return touch && error ? error : null;
        }}
    />
);

export const initData = {
    enquiry: "",
    submissionDate: "",
    foreignQnt: "",
    qntUnit: "",
    productName: "",
    loadPort: "",
    dischargePort: "",
    foreignPriceUSD: "",
    commercialDate: "",
    commercialNo: "",
    motherVessel: "",
    localTransportations: [{
        godownName: "",
        quantity: "",
        price: ""
    }]
};




export const validationSchema = Yup.object({
    enquiry: Yup.string().required("Enquiry is required"),
    submissionDate: Yup.date().required("Submission date is required"),
    foreignQnt: Yup.number().positive().min(0).required("Foreign qnt is required"),
    //   qntUnit: Yup.string().required("Qnt Unit is required"),
    productName: Yup.string().required("Product name is required"),
    loadPort: Yup.string().required("Load port is required"),
    dischargePort: Yup.string().required("Discharge port is required"),
    foreignPriceUSD: Yup.number().positive().min(0).required("Foreign price is required"),
    commercialDate: Yup.date().required("Commercial is required"),
    commercialNo: Yup.string().required("Commercial no is required"),
    motherVessel: Yup.string().required("Mother vessel is required"),
    localTransportations: Yup.array()
        .of(
            Yup.object({
                godownName: Yup.string().required("Godown is required"),
                quantity: Yup.number().positive().min(0).required("Quantity is required"),
                price: Yup.number().positive().min(0).required("Price is required")
            })
        )
        .required('Local transport is required')
        .min(1, 'Minimum 1 local transport')

});
