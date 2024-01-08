import * as Yup from "yup";
export const fuelCreateFormValidation = Yup.object().shape({
    fuel : Yup.object().shape({
        label:Yup.string().required("Fuel is required"),
        value:Yup.string().required("Fuel is required"),
    }),
    rate: Yup.number().required("Item Rate is required")
})