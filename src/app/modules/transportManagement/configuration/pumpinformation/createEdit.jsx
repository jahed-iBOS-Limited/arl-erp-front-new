import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import FormikError from "../../../_helper/_formikError";
import axios from "axios";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
    shipPointName: "",
    pumpModelName: "",
    pumpGroupHeadName: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()
//     .shape({
//       label: Yup.string().required("Item is required"),
//       value: Yup.string().required("Item is required"),
//     })
//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),
//   amount: Yup.number().required("Amount is required"),
//   date: Yup.date().required("Date is required"),
// });

export default function CreateEditPumpInformation() {
    const [objProps, setObjprops] = useState({});
    const [modifyData, setModifyData] = useState('')
    const {
        profileData: { userId, accountId },
        selectedBusinessUnit: { value: buUnId },
    } = useSelector((state) => state?.authData, shallowEqual);
    const [shipPoint, getShipPoint] = useAxiosGet()
    const [, onSave, loading] = useAxiosPost();
    const location = useLocation()

    useEffect(() => {
        getShipPoint(`/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buUnId}`)
        if (location?.state) {
            const { pumpModelName, shipPointId, shipPointName, pumpGroupHeadEnroll, pumpGroupHeadName } = location?.state

            const data = {
                shipPointName: { value: shipPointId, label: shipPointName },
                pumpModelName: pumpModelName,
                pumpGroupHeadName: { value: pumpGroupHeadEnroll, label: pumpGroupHeadName },
            }
            setModifyData(data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const saveHandler = (values, cb) => {
        const payload = {
            "pumpModelId": location?.state?.pumpModelId ? location?.state?.pumpModelId : 0,
            "pumpModelName": values.pumpModelName,
            "accountId": accountId,
            "businessUnitId": buUnId,
            "createdBy": userId,
            "shipPointId": values?.shipPointName?.value,
            "shipPointName": values?.shipPointName?.label,
            "pumpGroupHeadEnroll": values?.pumpGroupHeadName?.value,
            "pumpGroupHeadName": values?.pumpGroupHeadName?.label
        }
        onSave(`/tms/VehicleAllocation/SavePump`, payload, cb, true)
    };

    const loadPeopleGroupHeadName = (v) => {
        if (v?.length < 3) return []
        return axios.get(
            `/hcm/HCMDDL/GetEmployeeDDLSearch?AccountId=${accountId}&Search=${v}`
        ).then((res) => {
            return res?.data || []
        });
    };


    return (
        <Formik
            enableReinitialize={true}
            initialValues={location.state ? modifyData : initData}
            //   validationSchema={validationSchema}
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
                    {loading && <Loading />}
                    <IForm title="Create Pump Information" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="shipPointName"
                                        options={shipPoint}
                                        value={values?.shipPointName}
                                        label="Ship Point"
                                        onChange={(valueOption) => {
                                            setFieldValue("shipPointName", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.pumpModelName}
                                        label="Pump Model Name"
                                        name="pumpModelName"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("pumpModelName", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <label>Pump Group Head Name</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.pumpGroupHeadName}
                                        handleChange={(valueOption) => {
                                            setFieldValue("pumpGroupHeadName", valueOption);
                                        }}
                                        loadOptions={loadPeopleGroupHeadName}
                                        disabled={true}
                                    />
                                    <FormikError
                                        errors={errors}
                                        name="pumpGroupHeadName"
                                        touched={touched}
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