import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
const initData = {
    strProductName: "OIL",
    strCluster: "",
    intEmployeeId: "",
    strEmployeeName: "",
    intDesignationId: 0,
    strDesignationName: "",
    intDepartmentId: 0,
    strDepartmentName: "",
    strMobile: "",
    numQuantity: 1,
    numRate: 455,
    numAmount: 0,
    isActive: true,
    intCreatedBy: 0,
    dteCreatedDate: _todayDate()
};


const AelReportCreate = () => {
    const [objProps, setObjprops] = useState({});
    const [, saveData] = useAxiosPost(); 
    const [, getData] = useAxiosGet();

    const { profileData } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);


    const saveHandler = async (values, cb) => {
        if (
            values?.strCluster.value !== "" && values?.intEmployeeId !== "" &&
            values?.strEmployeeName !== "" && values?.strDesignationName &&
            values?.strDepartmentName !== "" && values?.strMobile !== ""
        ) {
            saveData(
                `/hcm/Training/CreateAelEvent`,
                {
                    strProductName: values?.strProductName,
                    strCluster: values?.strCluster.label,
                    intCluster: values?.strCluster.value,
                    intEmployeeId: values?.intEmployeeId,
                    strEmployeeName: values?.strEmployeeName,
                    intDesignationId: values?.intDesignationId || 0,
                    strDesignationName: values?.strDesignationName || "",
                    intDepartmentId: values?.intDepartmentId || 0,
                    strDepartmentName: values?.strDepartmentName || "",
                    strMobile: values?.strMobile,
                    numQuantity: 1,
                    numRate: 455,
                    numAmount: 0,
                    isActive: true,
                    intCreatedBy: profileData?.userId,
                    dteCreatedDate: _todayDate()
                },
                cb,
                true
            );
        } else {
            toast.error(`Please fill up the required fields`);
        }

    };

    return (
        <IForm title="AEL Event Entry Form" getProps={setObjprops}
            isHiddenBack={true}
        >
            {false && <Loading />}
            <>
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
                            <Form className="form form-label-right">
                                {false && <Loading />}
                                <div className="form-group  global-form">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.strProductName}
                                                label="Product Name"
                                                name="strProductName"
                                                type="text"
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="strCluster"
                                                options={
                                                    [
                                                        {
                                                            label: "Akij Asset Ltd. (AAL)",
                                                            value : 1,
                                                        },
                                                        {
                                                            label: "Akij Holdings Ltd. (AHL)",
                                                            value: 2,
                                                        },
                                                        {
                                                            label: "Akij Insaf Ltd. (AIL)",
                                                            value : 3,
                                                        },
                                                        {
                                                            label: "Akij Resources Ltd. (ARL)",
                                                            value : 4,
                                                        },
                                                        {
                                                            label: "Akij Venture Ltd. (AVL)",
                                                            value : 5,
                                                        },
                                                        {
                                                            label: "SK Akij Uddin Ltd. (SAL)",
                                                            value : 6,
                                                        }
                                                    ]
                                                }
                                                value={values?.strCluster}
                                                label="Cluster *"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue("strCluster", valueOption);
                                                        setFieldValue("intEmployeeId", "");
                                                        setFieldValue("strEmployeeName", "");
                                                        setFieldValue("intDesignationId", 0);
                                                        setFieldValue("strDesignationName", "");
                                                        setFieldValue("intDepartmentId", 0);
                                                        setFieldValue("strDepartmentName", "");
                                                        setFieldValue("strMobile", "");

                                                    } else {
                                                        setFieldValue("strCluster", "");
                                                        setFieldValue("intEmployeeId", "");
                                                        setFieldValue("strEmployeeName", "");
                                                        setFieldValue("intDesignationId", 0);
                                                        setFieldValue("strDesignationName", "");
                                                        setFieldValue("intDepartmentId", 0);
                                                        setFieldValue("strDepartmentName", "");
                                                        setFieldValue("strMobile", "");
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3 d-flex">
                                            <div style={{ width: "inherit" }}>
                                                <InputField
                                                    value={values?.intEmployeeId}
                                                    label="Employee Id *"
                                                    name="intEmployeeId"
                                                    type="text"
                                                    onChange={(e) => {
                                                        setFieldValue("intEmployeeId", +e.target.value);

                                                    }}
                                                />
                                            </div>
                                            {(values?.strCluster.value === 4) &&
                                                <span style={{
                                                    height: "5px",
                                                    width: "5px",
                                                    marginTop: "15px",
                                                    marginLeft: "5px",
                                                }}>
                                                    <i
                                                        class="fas fa-search mr-2 pointer animate-bounce mt-3"
                                                        onClick={() => {
                                                            getData(`/hcm/EmployeeBasicInformation/GetEmployeeInformation?EmployeeId=${values?.intEmployeeId}`, (data) => {
                                                                setFieldValue("strEmployeeName", data[0]?.strEmployeeFullName);
                                                                setFieldValue("strDesignationName", data[0]?.strDesignationName);
                                                                setFieldValue("strDepartmentName", data[0]?.strDepartmentName);
                                                                setFieldValue("strDepartmentName", data[0]?.strDepartmentName);
                                                                setFieldValue("strMobile", data[0]?.employeeContactNo);
                                                                setFieldValue("intDesignationId", data[0]?.intDesignationId);
                                                                setFieldValue("intDepartmentId", data[0]?.intDepartmentId);
                                                            });

                                                        }}
                                                    ></i>
                                                </span>

                                            }
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.strEmployeeName}
                                                label="Employee Name *"
                                                name="strEmployeeName"
                                                type="text"
                                                // disabled={values?.strCluster?.value === "ARL"}
                                                onChange={(e) => {
                                                    setFieldValue("strEmployeeName", e.target.value);
                                                }}
                                            />

                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.strDesignationName}
                                                label="Designation *"
                                                name="strDesignationName"
                                                type="text"
                                                // disabled={values?.strCluster?.value === "ARL"}
                                                onChange={(e) => {
                                                    setFieldValue("strDesignationName", e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.strDepartmentName}
                                                label="Department *"
                                                name="strDepartmentName"
                                                type="text"
                                                // disabled={values?.strCluster?.value === "ARL"}
                                                onChange={(e) => {
                                                    setFieldValue("strDepartmentName", e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.strMobile}
                                                label="Mobile no *"
                                                name="strMobile"
                                                type="text"
                                                onChange={(e) => {
                                                    setFieldValue("strMobile", e.target.value)
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

export default AelReportCreate