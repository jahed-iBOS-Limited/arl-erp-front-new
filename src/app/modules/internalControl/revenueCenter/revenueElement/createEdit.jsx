// eslint-disable-next-line no-unused-vars
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
// eslint-disable-next-line no-unused-vars
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
    revenueElementName: "",
    revenueElementCode: "",
    revenueCenter: [],
    generalLedger: "",
    controllingUnit: "",
};

export default function RevenueElementCreateEdit() {
    const [controllingDDL, getControllingDDL, controllingDDLloader] = useAxiosGet();
    const [, getSingleDataForEdit, getSingleDataForEditLoader] = useAxiosGet();
    const [revenueCenterDDL, getRevenueCenterDDL, revenueCenterDDLloader] = useAxiosGet();
    const [objProps, setObjprops] = useState({});
    const { id } = useParams();
    const [, saveData, saveDataLaoder] = useAxiosPost()

    const profileData = useSelector((state) => {
        return state.authData.profileData;
    }, shallowEqual);

    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);
    const [generalLedgerDDL, getGeneralLedgerDDL, generalLedgerDDLLoader, setGeneralLedgerDDL] = useAxiosGet();
    const [modifyData, setModifyData] = useState("");
    const saveHandler = (values, cb) => {
        if (!values?.revenueElementName) {
            return toast.warn("Revenue Element Name is required");
        }
        if (!values?.revenueElementCode) {
            return toast.warn("Revenue Element Code is required");
        }
        if (!values?.generalLedger) {
            return toast.warn("General Ledger is required");
        }
        if (!values?.controllingUnit) {
            return toast.warn("Controlling Unit is required");
        }
        if (!values?.revenueCenter) {
            return toast.warn("Revenue Center is required");
        }
        if (id) {
            const editPayload = {
                revenueElementId: values?.revenueElementId,
                revenueElementCode: values?.revenueElementCode,
                revenueElementName: values?.revenueElementName,
                // revenueCenterId: values?.revenueCenter?.map((item) => item?.value),
                revenueCenterId: [values?.revenueCenter?.value],
                generalLedgerId: values?.generalLedger?.value,
                businessTransactionId: 0,
                accountId: profileData?.accountId,
                businessUnitId: selectedBusinessUnit?.value,
                controllingUnitId: values?.controllingUnit?.value,
                isAllocationBased: true,
                intActionBy: profileData?.userId,
            }
            saveData("/costmgmt/Revenue/CreateRevenueElement", editPayload, cb, true)
        } else {
            const createPayload = {
                revenueElementCode: values?.revenueElementCode,
                revenueElementName: values?.revenueElementName,
                // revenueCenterId: values?.revenueCenter?.map((item) => item?.value),
                revenueCenterId: [values?.revenueCenter?.value],
                generalLedgerId: values?.generalLedger?.value,
                businessTransactionId: 0,
                accountId: profileData?.accountId,
                businessUnitId: selectedBusinessUnit?.value,
                controllingUnitId: values?.controllingUnit?.value,
                isAllocationBased: true,
                intActionBy: profileData?.userId,
            }
            saveData("/costmgmt/Revenue/CreateRevenueElement", createPayload, cb, true)
        }

    };
    useEffect(() => {
        if (id) {
            getSingleDataForEdit(`/costmgmt/Revenue/GetRevenueElementById?Id=${id}`, (data) => {
                console.log("data", data)
                getRevenueCenterDDL(`/costmgmt/Revenue/GetRevenueCenterDDL?accountId=${profileData?.accountId
                    }&businessUnitId=${data?.controllingUnitId}`)
                setModifyData({
                    revenueElementName: data?.revenueElementName,
                    revenueElementCode: data?.revenueElementCode,
                    revenueCenter: data?.revenueCenterId,
                    generalLedger: {
                        value: data?.generalLedgerId,
                        label: data?.generalLedgerName,
                    },
                    controllingUnit: {
                        value: data?.controllingUnitId,
                        label: data?.controllingUnitName,
                    },
                    revenueElementId: data?.revenueElementId,
                })
            })
        }
        getControllingDDL(`/costmgmt/ControllingUnit/GetControllingUnitDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`);
        getGeneralLedgerDDL(`/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${profileData?.accountId
            }&BusinessUnitId=${selectedBusinessUnit?.value
            }&AccountGroupId=12`, (data) => {
                const modifyData = data?.map((item) => ({
                    value: item?.generalLedgerId,
                    label: item?.generalLedgerName,
                }));
                setGeneralLedgerDDL(modifyData);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Formik
            enableReinitialize={true}
            initialValues={id ? modifyData : initData}
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
                    {(generalLedgerDDLLoader || controllingDDLloader || revenueCenterDDLloader || saveDataLaoder || getSingleDataForEditLoader) && <Loading />}
                    <IForm title={
                        id ? "Edit Revenue Element" : "Create Revenue Element"
                    } getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.revenueElementName}
                                        label="Revenue Element Name"
                                        name="revenueElementName"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("revenueElementName", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.revenueElementCode}
                                        label="Revenue Element Code"
                                        name="revenueElementCode"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("revenueElementCode", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="generalLedger"
                                        options={generalLedgerDDL || []}
                                        value={values?.generalLedger}
                                        label="General Ledger"
                                        onChange={(valueOption) => {
                                            setFieldValue("generalLedger", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={id}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="controllingUnit"
                                        options={controllingDDL || []}
                                        value={values?.controllingUnit}
                                        label="Controlling Unit"
                                        onChange={(valueOption) => {
                                            console.log("valueOption",valueOption);
                                            if (valueOption) {
                                                setFieldValue("controllingUnit", valueOption);
                                                setFieldValue("revenueCenter", "");
                                                getRevenueCenterDDL(`/costmgmt/Revenue/GetRevenueCenterDDL?accountId=${profileData?.accountId
                                                    }&businessUnitId=${selectedBusinessUnit?.value}`)
                                            } else {
                                                setFieldValue("controllingUnit", "");
                                                setFieldValue("revenueCenter", "");
                                            }
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={id}
                                    />
                                </div>
                                {/* <div className="col-lg-12">
                                    <label>Select Revenue Center</label>
                                    <Field
                                        name="revenueCenter"
                                        component={() => (
                                            <Select
                                                options={revenueCenterDDL}
                                                placeholder="Select Cost Center"
                                                value={values.revenueCenter || ""}
                                                onChange={(valueOption) => {
                                                    setFieldValue(
                                                        "revenueCenter",
                                                        valueOption || ""
                                                    );
                                                }}
                                                styles={{
                                                    control: (provided, state) => ({
                                                        ...provided,
                                                        minHeight: "30px",
                                                        height: "auto",
                                                    }),
                                                    valueContainer: (provided, state) => ({
                                                        ...provided,
                                                        height: "auto",
                                                        padding: "0 6px",
                                                    }),
                                                }}
                                                name="costCenter"
                                                isDisabled={!values?.controllingUnit}
                                                isMulti
                                            />
                                        )}
                                        placeholder="Select Cost Center"
                                        label="Select Cost Center"
                                    />
                                    <p
                                        style={{
                                            fontSize: "0.9rem",
                                            fontWeight: 400,
                                            width: "100%",
                                            marginTop: "0.25rem",
                                        }}
                                        className="text-danger"
                                    >
                                        {errors &&
                                            errors.costCenter &&
                                            touched &&
                                            touched.org
                                            ? errors.costCenter
                                            : ""}
                                    </p>
                                </div> */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="revenueCenter"
                                        options={revenueCenterDDL || []}
                                        value={values.revenueCenter || ""}
                                        label="Select Revenue Center"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("revenueCenter", valueOption);
                                            } else {
                                                setFieldValue("revenueCenter", "");
                                            }
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.controllingUnit}
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