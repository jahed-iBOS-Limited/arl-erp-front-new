import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { useParams } from "react-router-dom";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";

const initData = {
    revenueCenterName: "",
    revenueCenterCode: "",
    controllingUnit: "",
    profitCenter: "",
};

const validationSchema = Yup.object().shape({

});

export default function RevenueCenterCreateEdit() {
    const [, getSingleData, singleDataLoader] = useAxiosGet()
    const [modifyData, setModifyData] = useState("");
    const [controllingDDL, getControllingDDL, controllingDDLloader] = useAxiosGet();
    const [profitCenterDDL, getProfitCenterDDL, constControllingDDLloader, setProfitCenterDDL] = useAxiosGet();
    // eslint-disable-next-line no-unused-vars
    const [, saveData, saveDataLoader] = useAxiosPost();
    // 
    const profileData = useSelector((state) => {
        return state.authData.profileData;
    }, shallowEqual);

    // get selected business unit from store
    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);

    const [objProps, setObjprops] = useState({});
    const { id } = useParams();
    const saveHandler = (values, cb) => {
        if (!values?.revenueCenterName) {
            return toast.warn("Revenue Center Name is required");
        }
        if (!values?.revenueCenterCode) {
            return toast.warn("Revenue Center Code is required");
        }

        if (!values?.controllingUnit?.value) {
            return toast.warn("Controlling Unit is required");
        }

        if (!values?.profitCenter?.value) {
            return toast.warn("Profit Center is required");
        }

        if (id) {
            const editPayload = {
                revenueCenterId: values?.revenueCenterId,
                revenueCenterCode: values?.revenueCenterCode,
                revenueCenterName: values?.revenueCenterName,
                revenueCenterTypeId: values?.revenueCenterTypeId,
                controllingUnitId: values?.controllingUnit?.value,
                profitCenterId: values?.profitCenter?.value,
                sbuid: 0,
                revenueCenterGroupId: 0,
                responsiblePersonId: 0,
                accountId: profileData?.accountId,
                businessUnitId: selectedBusinessUnit?.value,
                actionBy: profileData?.userId,
            };
            saveData(`/costmgmt/Revenue/CreateRevenueCenterInformation`, editPayload, cb, true)
        } else {
            const createPayload = {
                revenueCenterCode: values?.revenueCenterCode,
                revenueCenterName: values?.revenueCenterName,
                revenueCenterTypeId: values?.revenueCenterTypeId,
                controllingUnitId: values?.controllingUnit?.value,
                profitCenterId: values?.profitCenter?.value,
                sbuid: 0,
                revenueCenterGroupId: 0,
                responsiblePersonId: 0,
                accountId: profileData?.accountId,
                businessUnitId: selectedBusinessUnit?.value,
                actionBy: profileData?.userId,
            };
            saveData(`/costmgmt/Revenue/CreateRevenueCenterInformation`, createPayload, cb, true)
        }
    };

    useEffect(() => {
        getControllingDDL(`/costmgmt/ControllingUnit/GetControllingUnitDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`);
        getProfitCenterDDL(`/fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`, (data) => {
            const modifiedData = data?.map((item) => ({
                value: item?.profitCenterId,
                label: item?.profitCenterName,
            }));
            setProfitCenterDDL(modifiedData);
        });

        if (id) {
            getSingleData(`/costmgmt/Revenue/GetRevenueCenterById?Id=${id}`, (data) => {
                setModifyData({
                    revenueCenterId: data?.revenueCenterId,
                    revenueCenterName: data?.revenueCenterName,
                    revenueCenterCode: data?.revenueCenterCode,
                    controllingUnit: { value: data?.controllingUnitId, label: data?.controllingUnitName },
                    profitCenter: { value: data?.profitCenterId, label: data?.profitCenter }
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={id ? modifyData : initData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    !id && resetForm(initData);
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
                    {(controllingDDLloader || constControllingDDLloader || saveDataLoader || singleDataLoader) && <Loading />}
                    <IForm title={
                        id ? "Edit Revenue Center" : "Create Revenue Center"
                    } getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.revenueCenterName}
                                        label="Revenue Center Name"
                                        name="revenueCenterName"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("revenueCenterName", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.revenueCenterCode}
                                        label="Revenue Center Code"
                                        name="revenueCenterCode"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("revenueCenterCode", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="controllingUnit"
                                        options={controllingDDL || []}
                                        value={values?.controllingUnit}
                                        label="Controlling Unit"
                                        onChange={(valueOption) => {
                                            setFieldValue("controllingUnit", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={id}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="profitCenter"
                                        options={profitCenterDDL || []}
                                        value={values?.profitCenter}
                                        label="Profit Center"
                                        onChange={(valueOption) => {
                                            setFieldValue("profitCenter", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={id}
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