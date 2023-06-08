import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import useAxiosGet from './../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from './../../../_helper/customHooks/useAxiosPost';
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { makePayload } from "./helper";

const initData = {
    date: "",
    shift: "",
    time: "",
    vrmName: "",
    initialTime: "",
    finalTime: "",
    remarks: "",
};


export default function PhysicalTestForm() {
    const [objProps, setObjprops] = useState({});
    const [fields, getFields, , setFields] = useAxiosGet();
    const [machineList, getMachineList] = useAxiosGet();
    const [, saveData, saveLoading] = useAxiosPost();
    const location = useLocation()
    const [modifieData, setModifieData] = useState({})


    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    useEffect(() => {
        if (!location?.state?.qcTransactionHeaderId) {
            getFields(`/hcm/QCTest/QCParameterByBusinessUnitId?BusinessUnitId=${selectedBusinessUnit?.value}&QcTestType=PhysicalTest`)

        }
        getMachineList(`/hcm/QCTest/GetTransactionMachineNameDDL?BusinessUnitId=${location?.state?.businessUnitId || selectedBusinessUnit?.value}`)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit])

    useEffect(() => {
        if (location?.state?.qcTransactionHeaderId) {
            const data = location?.state?.row.map((item) => ({ ...item, value: item?.quantity || "" }))
            setFields({ data })
            setModifieData({
                date: _dateFormatter(location?.state?.transactionDate) || "",
                shift: location?.state?.shiftId ? { value: location?.state?.shiftId, label: location?.state?.shiftName } : "",
                time: location?.state?.startTime || "",
                vrmName: location?.state?.machineId ? { value: location?.state?.machineId, label: location?.state?.machineName } : "",
                initialTime: location?.state?.durationInMinute1 || "",
                finalTime: location?.state?.durationInMinute2 || "",
                remarks: location?.state?.comments || "",
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.state?.qcTransactionHeaderId])

    const saveHandler = (values, cb) => {
        saveData(location?.state?.qcTransactionHeaderId ? `/hcm/QCTest/QCTransactionEdit` : `/hcm/QCTest/QCTransactionCreate`,
            makePayload({ isEdit: location?.state?.qcTransactionHeaderId ? true : false, values, buId: selectedBusinessUnit?.value, userId: profileData?.userId, fields, headerId: location?.state?.qcTransactionHeaderId || 0 }),
            location?.state?.qcTransactionHeaderId ? null : cb,
            true)
    };

    const rowDtoHandler = (value, fields, i, name) => {
        const data = { ...fields }
        data.data[i][name] = value;
        setFields(data)
    }
    return (
        <Formik
            enableReinitialize={true}
            initialValues={location?.state?.qcTransactionHeaderId ? modifieData : initData}
            // validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm(initData);
                    const data = fields?.data.map((item) => ({ ...item, quantity: "" }))
                    setFields({ data })
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
                    {saveLoading && <Loading />}
                    <IForm title="Create Physical Test" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.date}
                                        label="Date"
                                        name="date"
                                        type="date"
                                        disabled={location?.state?.qcTransactionHeaderId}
                                        onChange={(e) => {
                                            setFieldValue("date", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="shift"
                                        options={[
                                            { value: "1", label: "A" },
                                            { value: "2", label: "B" },
                                            { value: "3", label: "C" }]}
                                        value={values?.shift}
                                        label="Shift"
                                        isDisabled={location?.state?.qcTransactionHeaderId}
                                        onChange={(valueOption) => {
                                            setFieldValue("shift", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.time}
                                        label="Time"
                                        name="time"
                                        type="time"
                                        disabled = {location?.state?.qcTransactionHeaderId}
                                        onChange={(e) => {
                                            setFieldValue("time", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="vrmName"
                                        options={machineList || []}
                                        value={values?.vrmName}
                                        label="VRM Name"
                                        isDisabled={location?.state?.qcTransactionHeaderId}
                                        onChange={(valueOption) => {
                                            setFieldValue("vrmName", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                {fields?.data?.length > 0 && fields?.data.map((item, i) => (<div className="col-lg-3">
                                    <InputField
                                        value={item?.quantity || ""}
                                        label={`${item?.qcParameterName} [${item?.uoMname}]`}
                                        type="number"
                                        onChange={(e) => {
                                            if (+e.target.value < 0) return
                                            rowDtoHandler(+e.target.value, fields, i, "quantity");
                                        }}
                                    />
                                </div>))}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.initialTime}
                                        label="Initial Time(Min)"
                                        name="initialTime"
                                        type="number"
                                        onChange={(e) => {
                                            if (+e.target.value < 0) return
                                            setFieldValue("initialTime", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.finalTime}
                                        label="Final Time (MIn)"
                                        name="finalTime"
                                        type="number"
                                        onChange={(e) => {
                                            if (+e.target.value < 0) return
                                            setFieldValue("finalTime", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.remarks}
                                        label="Remarks"
                                        name="remarks"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("remarks", e.target.value);
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