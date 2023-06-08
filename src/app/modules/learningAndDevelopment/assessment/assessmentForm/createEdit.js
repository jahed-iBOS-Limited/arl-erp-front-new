import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import { _todayDate } from '../../../_helper/_todayDate';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import * as XLSX from "xlsx";
import axios from 'axios';
import Loading from '../../../_helper/_loading';
const initData = {
    dteLastActionDate: _todayDate(),
    intActionBy: 0,
    intOrder: 1,
    intScheduleId: 0,
    isActive: true,
    isPreAssesment: "",
    isRequired: true,
    options: [],
    strInputType: "radio",
    strQuestion: "",
};
const AssessmentFormCreateEdit = () => {
    const ref = useRef(null);
    const location = useLocation();
    const { profileData } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);
    const { id } = useParams();
    const [objProps, setObjprops] = useState({});
    const [modifyData, setModifyData] = useState([{ ...initData }]);
    const [optionObject, setOptionObject] = useState({
        intOptionId: 0,
        strOption: "",
        intQuestionId: 0,
        numPoints: 0,
        dteLastAction: _todayDate(),
        intActionBy: profileData?.userId,
        intOrder: 1,
    });
    const [, getData] = useAxiosGet()
    const [, saveData] = useAxiosPost()
    const [loading, setLoading] = useState(false);

    const rowDtoHandler = (index, key, value) => {
        const data = modifyData[index];
        data[key] = value;
        setModifyData([...modifyData]);
    };

    const saveHandler = async (values, cb) => {
        const payload = modifyData.map((item) => {
            item.isPreAssesment = location?.state?.isPreAssesment;
            delete item.strOption;
            delete item.numPoints;
            return item;
        });

        const isQuestionValid = payload.every((item) => item?.strQuestion !== "");
        if (isQuestionValid && payload.length > 0) {
            saveData(`/hcm/Training/EditTrainingAssesmentQuestion`,
                payload,
                cb,
                true,
            )
        } else if (payload.length === 0) {
            toast.error("please add question")
        } else {
            toast.error("Question is required")
        }

    };

    useEffect(() => {
        if (id) {
            getData(`/hcm/Training/GetTrainingAssesmentQuestionByScheduleId?intScheduleId=${id}&isPreAssessment=${location.state?.isPreAssesment}`,
                (data) => {
                    data.map((item) => (item.isPreAssesment = location?.state?.isPreAssesment))
                    setModifyData(data)
                    console.log("modify-data", data);
                }
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const downloadAssesmentQuesFormat = () => {
        setLoading(true);
        const url = `/domain/Document/DownlloadFile?id=638071461123892562_Assesment_Question_Format.xlsx`;
        axios({
            url: url,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Assesment_Question_Format.xlsx`);
                document.body.appendChild(link);
                link.click();
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err?.response?.data?.message, "Something went wrong");
            });
    };

    const readExcel = (file, cb) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            setModifyData(
                d.map((item) => {
                    const newObj = { ...initData };
                    newObj.dteLastActionDate = _todayDate();
                    newObj.intActionBy = 0;
                    newObj.intQuestionId = 0;
                    newObj.intOrder = 1;
                    newObj.isActive = true;
                    newObj.isPreAssesment = location?.state?.isPreAssesment;
                    newObj.isRequired = true;
                    newObj.strInputType = "radio";
                    newObj.strQuestion = item.Question;
                    newObj.intActionBy = profileData?.userId;
                    newObj.intScheduleId = +id;
                    newObj.options = [
                        {
                            intOptionId: 0,
                            strOption: item.Option_1,
                            intQuestionId: 0,
                            numPoints: Number(item?.Marks_1) || 0,
                            dteLastAction: _todayDate(),
                            intActionBy: profileData?.userId,
                            intOrder: 1,
                        },
                        {
                            intOptionId: 0,
                            strOption: item.Option_2,
                            intQuestionId: 0,
                            numPoints: Number(item?.Marks_2) || 0,
                            dteLastAction: _todayDate(),
                            intActionBy: profileData?.userId,
                            intOrder: 1,
                        },
                        {
                            intOptionId: 0,
                            strOption: item.Option_3,
                            intQuestionId: 0,
                            numPoints: Number(item?.Marks_3) || 0,
                            dteLastAction: _todayDate(),
                            intActionBy: profileData?.userId,
                            intOrder: 1,
                        },
                        {
                            intOptionId: 0,
                            strOption: item.Option_4,
                            intQuestionId: 0,
                            numPoints: Number(item?.Marks_4) || 0,
                            dteLastAction: _todayDate(),
                            intActionBy: profileData?.userId,
                            intOrder: 1,
                        },
                    ];
                    return newObj;
                })
            );
            cb();
        });
    };

    return (
        <IForm title={location?.state?.isPreAssesment ? "Edit Pre-Assessment Form" : "Edit Post-Assessment Form"} getProps={setObjprops} isHiddenReset={true}>
            {false && <Loading />}
            <>
                <Formik
                    enableReinitialize={true}
                    initialValues={id ? modifyData : initData}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        saveHandler(values, () => {
                            getData(`/hcm/Training/GetTrainingAssesmentQuestionByScheduleId?intScheduleId=${id}&isPreAssessment=${location.state?.isPreAssesment}`,
                                (data) => {
                                    setModifyData(data);
                                })
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
                                <div className="text-center">
                                    <h1 className='text-center'>{location?.state?.name}</h1>
                                    <h3 className='text-center'>From: {_dateFormatter(location?.state?.fromDate)} To: {_dateFormatter(location?.state?.toDate)}</h3>
                                </div>
                                {loading && <Loading />}
                                <div className="row w-100 ml-3">
                                    <div className="col-md-9 d-flex align-items-center mt-5 form-group">
                                        <h4 style={{ marginRight: "10px" }}>Add New Question</h4>
                                        <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Add Question"}</Tooltip>}>
                                            <span>
                                                <i style={{ fontSize: "20px" }}
                                                    className={`fas fa-plus-circle cursor-pointer`}
                                                    onClick={() => {
                                                        setModifyData([
                                                            ...modifyData,
                                                            {
                                                                ...initData,
                                                                intActionBy: profileData?.userId,
                                                                intScheduleId: id,
                                                                options: []
                                                            },
                                                        ]);
                                                    }}
                                                ></i>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                    <div className="col-md-3 d-flex justify-content-end mt-5">
                                        <button style={{
                                            height: "31px",
                                            backgroundColor: "#7f8386",
                                            color: "#FFF",
                                        }} className="btn mr-1"
                                            type='button'
                                            onClick={() => {
                                                downloadAssesmentQuesFormat()
                                            }}
                                        >
                                            Download Format
                                        </button>
                                        <div>
                                            <input
                                                id="assesment_excel_fileInput"
                                                className='pointer d-none'
                                                type="file"
                                                accept=".xlsx"
                                                ref={ref}
                                                onChange={(e) => {
                                                    let file = e.target.files[0];
                                                    readExcel(file, () => { ref.current.value = '' });
                                                }}
                                            />
                                            <label
                                                htmlFor="assesment_excel_fileInput"
                                                className="btn btn-primary"
                                            >
                                                Upload Question
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row w-100">
                                    {
                                        modifyData?.map((item, index) => (
                                            <div className='col-md-12 ml-5 mb-5 form-group global-form rounded'>
                                                <div className="d-flex mb-5">
                                                    <div key={index} className="ml-2 text-center" style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"
                                                    }} >
                                                        <label style={{ fontWeight: "bold", }}>Sl</label>
                                                        {index + 1}
                                                    </div>
                                                    <div key={index} className=" ml-3 text-center" style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"

                                                    }} >
                                                        <label style={{
                                                            fontWeight: "bold",
                                                        }}>Required</label>
                                                        <input
                                                            type="checkbox"
                                                            name='isRequired'
                                                            checked={item?.isRequired}
                                                            onChange={(e) => {
                                                                setFieldValue("isRequired", e.target.checked);
                                                                modifyData[index].isRequired = e.target.checked;
                                                                setModifyData([...modifyData]);
                                                            }}
                                                        />
                                                    </div>
                                                    <div key={index} className="col-md-5">
                                                        <label style={{
                                                            fontWeight: "bold",
                                                        }}>Question</label>
                                                        <InputField
                                                            value={item?.strQuestion}
                                                            type="text"
                                                            name='strQuestion'
                                                            onChange={(e) => {
                                                                setFieldValue("strQuestion", e.target.value);
                                                                modifyData[index].strQuestion = e.target.value;
                                                                setModifyData([...modifyData]);
                                                            }}
                                                        />
                                                    </div>
                                                    <div key={index} className="col-md-1"></div>
                                                    <div key={index} className="col-md-2">
                                                        <label style={{
                                                            fontWeight: "bold",
                                                        }}>Option</label>
                                                        <InputField
                                                            type="text"
                                                            value={item?.strOption}
                                                            name='strOption'
                                                            onChange={(e) => {
                                                                setFieldValue("strOption", e.target.value);
                                                                rowDtoHandler(
                                                                    index,
                                                                    "strOption",
                                                                    e?.target?.value
                                                                );
                                                                setOptionObject(
                                                                    {
                                                                        ...optionObject,
                                                                        strOption: e.target.value,
                                                                        intQuestionId: item.intQuestionId,
                                                                    }
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                    <div key={index} className="col-md-1">
                                                        <label style={{
                                                            fontWeight: "bold",
                                                        }}>Marks</label>
                                                        <InputField
                                                            value={item?.numPoints}
                                                            type="number"
                                                            name='numPoints'
                                                            onChange={(e) => {
                                                                setFieldValue("numPoints", +e.target.value);
                                                                rowDtoHandler(
                                                                    index,
                                                                    "numPoints",
                                                                    +e?.target?.value
                                                                );
                                                                setOptionObject(
                                                                    {
                                                                        ...optionObject,
                                                                        numPoints: +e.target.value,
                                                                        intQuestionId: item.intQuestionId,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div key={index} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"

                                                    }} className="col-md-1 text-center">
                                                        <label style={{
                                                            fontWeight: "bold",
                                                        }}>Add Option</label>
                                                        <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Add Option"}</Tooltip>}>
                                                            <span>
                                                                <i style={{ fontSize: "15px" }}
                                                                    className={`fas fa-plus-circle cursor-pointer`}
                                                                    onClick={() => {
                                                                        if (optionObject?.strOption === "") {
                                                                            toast.warning("Please enter option");
                                                                        } else {
                                                                            modifyData[index].options.push(optionObject);
                                                                            modifyData[index]["strOption"] = "";
                                                                            modifyData[index]["numPoints"] = "";
                                                                            setModifyData([...modifyData]);
                                                                            setOptionObject({
                                                                                intOptionId: 0,
                                                                                strOption: "",
                                                                                intQuestionId: 0,
                                                                                numPoints: 0,
                                                                                dteLastAction: _todayDate(),
                                                                                intActionBy: profileData?.userId,
                                                                                intOrder: 1,
                                                                            });
                                                                        }
                                                                    }}
                                                                ></i>
                                                            </span>
                                                        </OverlayTrigger>
                                                    </div>
                                                    <div key={index} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"

                                                    }} className="col-md-1 text-center">
                                                        <label style={{
                                                            fontWeight: "bold",
                                                        }}>Remove</label>
                                                        <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Remove question"}</Tooltip>}>
                                                            <span className="mx-1">
                                                                <i style={{ fontSize: "15px" }}
                                                                    className={`fas fa-close cursor-pointer`}
                                                                    onClick={() => {
                                                                        setModifyData(
                                                                            modifyData.filter(
                                                                                (data, i) => i !== index
                                                                            )
                                                                        );
                                                                    }}
                                                                ></i>
                                                            </span>
                                                        </OverlayTrigger>

                                                    </div>
                                                </div>
                                                {item?.options?.length > 0 && (
                                                    <div className="d-flex col-md-12 ml-3">
                                                        {
                                                            item?.options?.map((option, optionsIndex) => (
                                                                <div className='d-flex '
                                                                    style={{
                                                                        background: "#FFFFFF",
                                                                        padding: "4px 7px",
                                                                        marginTop: "3px",
                                                                        marginRight: "5px",
                                                                        marginLeft: "5px",
                                                                        fontWeight: "500",
                                                                        borderRadius: "10px",
                                                                    }}
                                                                >
                                                                    <span style={{ marginRight: "5px" }}>
                                                                        {option.strOption} ({option.numPoints})
                                                                    </span>
                                                                    <OverlayTrigger
                                                                        overlay={
                                                                            <Tooltip id="cs-icon">{"Delete"}</Tooltip>
                                                                        }
                                                                    >
                                                                        <span>
                                                                            <i style={{ fontSize: "12px" }}
                                                                                className={`fa fa-times cursor-pointer`}
                                                                                onClick={() => {
                                                                                    modifyData[index].options.splice(optionsIndex, 1);
                                                                                    setModifyData([...modifyData]);
                                                                                }}
                                                                            ></i>
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    }
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

export default AssessmentFormCreateEdit