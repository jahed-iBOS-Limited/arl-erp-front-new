import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../_helper/_inputField";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";

const initData = {
    vehicleType: "",
    renewalType: "",
};

export default function ConfigRenewalAttribute() {
    const [objProps, setObjprops] = useState({});
    const [renewalDDL, getRenewalDDL, renewalDDLLoader] = useAxiosGet();
    const [vehicleTypeDDL, getVehicleTypeDDL, vehicleTypeDDLLoader] = useAxiosGet();
    const [rwoData, getRwoData, rwoDataLoader, setRowData] = useAxiosGet();
    const [, saveData] = useAxiosPost();
    useEffect(() => {
        getRenewalDDL('/asset/DropDown/GetRenewalService')
        getVehicleTypeDDL(`/asset/DropDown/GetBRTAVehicleType`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const saveHandler = (values, cb) => {
        saveData(`/asset/Renewal/SaveRenewalAttributesValue`,
            rwoData,
            cb,
            true
        )
    };
    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    // resetForm(initData);
                    // setRowData([])
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
                    {(renewalDDLLoader || vehicleTypeDDLLoader || rwoDataLoader) && <Loading />}
                    <IForm isHiddenReset={true} isHiddenBack={true} title="Renewal Attribute Config" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="vehicleType"
                                        options={vehicleTypeDDL}
                                        value={values?.vehicleType}
                                        label="BRTA Vehicle Type"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("vehicleType", valueOption);
                                                setRowData([])
                                            } else {
                                                setRowData([]);
                                                setFieldValue("vehicleType", "");
                                            }
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="renewalType"
                                        options={renewalDDL}
                                        value={values?.renewalType}
                                        label="Renewal Type"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("renewalType", valueOption);
                                                setRowData([])
                                            } else {
                                                setRowData([])
                                                setFieldValue("renewalType", "");
                                            }
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-5"
                                        disabled={!values?.vehicleType || !values?.renewalType}
                                        onClick={() => {
                                            getRwoData(`/asset/Renewal/GetRenewalAttributesByType?renewalServiceId=${values?.renewalType?.value}&typeId=${values?.vehicleType?.value}`)
                                        }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                           <div className="table-responsive">
                           <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Renewal Attribute Name</th>
                                        <th>Attribute Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rwoData?.map((dataItem, dataIndex) => (
                                            <tr key={dataIndex}>
                                                <td>{dataIndex + 1}</td>
                                                <td>{dataItem?.strRenewalAttributeName}</td>
                                                <td>
                                                    <InputField
                                                        value={dataItem?.numAttributeValue}
                                                        name="numAttributeValue"
                                                        type="text"
                                                        disabled={false}
                                                        onChange={
                                                            (e) => {
                                                                let temp = [...rwoData];
                                                                temp[dataIndex].numAttributeValue = +e.target.value;
                                                                setRowData(temp);
                                                            }
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))

                                    }
                                </tbody>
                            </table>
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