import axios from "axios";
import { Field, getIn } from "formik";
import React from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";


// Error message display field for field array of of tender submission create & edit page
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


// Inital data for tender submission create & edit page
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
    referenceNo:"",
    referenceDate:"",
    localTransportations: [{
        godownName: "",
        quantity: "",
        price: ""
    }]
};



// Validation schema for tender submission create & edit page
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


export const getMotherVesselDDL = async (accId, buId, setter) => {
    try {
        const res = await axios.get(
            `${imarineBaseUrl}/domain/LighterVessel/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
        );
        setter(res.data);
    } catch (error) {
        setter([]);
    }
};


export const getDischargePortDDL = async (setter) => {
    try {
        const res = await axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
        setter(res?.data);
    } catch (error) {
        setter([]);
    }
};

export const GetLoadPortDDL = async (setter) => {
    try {
        const res = await axios.get(
            `${imarineBaseUrl}/domain/Vessel/GetCountryDDL`
        );
        setter(res?.data);
    } catch (error) {
        setter([]);
    }
};