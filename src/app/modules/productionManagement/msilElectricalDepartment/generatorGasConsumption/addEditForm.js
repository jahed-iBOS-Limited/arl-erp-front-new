import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';

const initData = {
    dteDate: "",
    numPreviousReading: "",
    numPresentReading: "",
    numGasConsumption: "",
    numTotalGeneration: "",
    strRemarks: "",
};

const GeneratorGasConsumptionCreate = () => {
    const [objProps, setObjprops] = useState({});
    const [, saveData] = useAxiosPost();
    const [, getData, ] = useAxiosGet();
    const [modifyData, setModifyData] = useState("");
    const location = useLocation();
    const params = useParams();
    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);

    useEffect(() => {
        setModifyData({
            dteDate: _dateFormatter(location?.state?.dteDate),
            numPreviousReading: location?.state?.numPreviousReading,
            numPresentReading: location?.state?.numPresentReading,
            numGasConsumption: location?.state?.numGasConsumption,
            numTotalGeneration: location?.state?.numTotalGeneration,
            strRemarks: location?.state?.strRemarks,
        });
    }, [location]);

    const saveHandler = async (values, cb) => {
        const payload = {
            id: 0,
            dteDate: values?.dteDate,
            numPreviousReading: values?.numPreviousReading,
            numPresentReading: values?.numPresentReading,
            numGasConsumption: values?.numGasConsumption,
            numTotalGeneration: values?.numTotalGeneration,
            strRemarks: values?.strRemarks,
            intBusinessUnitId: selectedBusinessUnit?.value,
        }
        saveData(
            `/mes/MSIL/CreateEditElectricalGeneratorFuelConsumption`,
            payload,
            params?.id ? "" : cb,
            true
        );
    };

    return (
        <IForm
            title={"Gas Consumption Entry Form"}
            getProps={setObjprops}>
            {false && <Loading />}
            <>
                <Formik
                    enableReinitialize={true}
                    initialValues={params?.id ? modifyData : initData}
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
                            <Form className="form form-label-right">
                                {false && <Loading />}
                                <div className="form-group  global-form">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.dteDate}
                                                label="Date"
                                                name="dteDate"
                                                type="date"
                                                onChange={(e) => {
                                                    setFieldValue("dteDate", e.target.value);
                                                    getData(
                                                        `/mes/MSIL/GetPreviousGasReadingAndTotalGeneration?BusinessUnitId=${selectedBusinessUnit?.value}&Date=${e.target.value}`,
                                                        (data) => {
                                                            setFieldValue("numPreviousReading", data?.numPreviousReading);
                                                            setFieldValue("numTotalGeneration", data?.numTotalGeneration);
                                                        },
                                                    )

                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.numPreviousReading}
                                                label="Previous Reading"
                                                name="numPreviousReading"
                                                type="number"
                                                onChange={(e) => {
                                                    setFieldValue("numPreviousReading", +e.target.value);
                                                }}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.numPresentReading}
                                                label="Present Reading"
                                                name="numPresentReading"
                                                type="number"
                                                onChange={(e) => {
                                                    setFieldValue("numPresentReading", +e.target.value);
                                                    setFieldValue("numGasConsumption", +e.target.value - values?.numPreviousReading);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.numGasConsumption}
                                                label="Gas Consumption"
                                                name="numGasConsumption"
                                                type="number"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.numTotalGeneration}
                                                label="Total Generation"
                                                name="numTotalGeneration"
                                                type="number"
                                                onChange={(e) => {
                                                    setFieldValue("numTotalGeneration", +e.target.value);
                                                }}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.strRemarks}
                                                label="Remarks"
                                                name="strRemarks"
                                                type="text"
                                                onChange={(e) => {
                                                    setFieldValue("strRemarks", e.target.value);
                                                }}
                                            />
                                        </div>

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
                        </>
                    )}
                </Formik>
            </>
        </IForm>
    )
}

export default GeneratorGasConsumptionCreate