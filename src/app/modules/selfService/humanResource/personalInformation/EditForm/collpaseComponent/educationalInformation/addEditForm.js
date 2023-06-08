import React, { useState, useEffect } from "react";
import Form from "./form";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { createEmployeeEducation_api } from "./helper";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Loading from "./../../../../../../_helper/_loading";
import {
  getEmployeeEducationByEmpId_api,
  editEmployeeEducation_api,
} from "./helper";

const initData = {
  levelofEducation: "",
  examDegree: "",
  majorGroup: "",
  durationYears: "",
  nameofInstitute: "",
  rorignInstitute: false,
  passingYear: "",
  result: "",
  mark: "",
  CGPA: "",
  CGPAScal: "",
  others: "",
};

export default function EducationalInformation() {
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const { state: headerData } = useLocation();

  const [editClick, setEditClick] = useState(false);
  const [editBtnIndex, setEditBtnIndex] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);


  // singleRowdto func
  const singleRowdtoFunc = (values) => {
    const obj = {
      employeeId: headerData?.employeeId,
      employeeCode: headerData?.employeeCode,
      educationLevelId: values?.levelofEducation?.value,
      educationLevel: values?.levelofEducation?.label,
      degreeId: values?.examDegree?.value,
      degree:
        values?.examDegree?.label === "Other"
          ? values?.others
          : values?.examDegree?.label,
      group: values?.majorGroup,
      durationYears: +values?.durationYears,
      institute: values?.nameofInstitute,
      isForeignInstitute: values?.rorignInstitute,
      passingYear: +values?.passingYear?.label,
      resultId: values?.result?.value,
      result: values?.result?.label,
      marks: +values?.mark || 0,
      cgpa: +values?.CGPA || 0,
      actionBy: profileData?.userId,
      accountId: profileData.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      cgpaScale: values?.CGPAScal?.label || "",
      attachment: uploadImage[0]?.id || "",
      employeeEducationInfoId: values?.employeeEducationInfoId || 0,
    };
    return obj;
  };

  const saveHandler = async (values, cb) => {
    if (
      editClick &&
      (!values?.levelofEducation ||
        !values?.examDegree ||
        !values?.durationYears ||
        !values?.nameofInstitute ||
        !values?.passingYear ||
        !values?.result)
    )
      return toast.warn("Please fill up all fields");

    if (singleData.length > 0) {
      // Edit api call
      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
        employeeEducationInfoId: itm?.employeeEducationInfoId || 0,
        actionBy: profileData?.userId,
        accountId: profileData.accountId,
      }));
      if (editClick) {
        // edit btn true
        if (rowDto.length > 0) {
          const copyRodto = modifiedRowDto;
          // copyRodto[editBtnIndex] = singleRowdtoFunc(values);
          copyRodto[editBtnIndex] = {
            ...singleRowdtoFunc(values),
            attachment: uploadImage[0]?.id
              ? uploadImage[0]?.id
              : values?.attachment
              ? values?.attachment
              : "",
          };
          editEmployeeEducation_api(copyRodto, cb, setDisabled).then((data) => {
            getEmployeeEducationByEmpId_api(
              headerData?.employeeId,
              setSingleData
            );
            setEditClick(false);
          });
        } else {
          toast.warn("Please add at least one");
        }
      } else {
        // edit btn false
        if (rowDto.length > 0) {
          editEmployeeEducation_api(modifiedRowDto, cb, setDisabled).then(
            (data) => {
              getEmployeeEducationByEmpId_api(
                headerData?.employeeId,
                setSingleData
              );
            }
          );
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      // create api call
      if (rowDto.length > 0) {
        createEmployeeEducation_api(rowDto, cb, setDisabled).then((data) => {
          getEmployeeEducationByEmpId_api(
            headerData?.employeeId,
            setSingleData
          );
        });
      } else {
        toast.warn("Please add at least one");
      }
    }
  };


  //******************old code. Now using a yearddl from db************
  // year decrement
  // const yearDecrement = () => {
  //   const date = new Date();
  //   let year = date.getFullYear();
  //   let yearIncrement = year - 40;
  //   let arry = [];
  //   for (let step = year; step > yearIncrement; step--) {
  //     arry.push(step);
  //   }
  //   const traningYear = arry.map((itm, inx) => ({
  //     value: ++inx,
  //     label: itm.toString(),
  //   }));

  //   // add next 10 years
  //   let arry2 = [];
  //   for (let step = year + 1; step < year + 10; step++) {
  //     arry2 = [step, ...arry2];
  //   }
  //   const next_10_years = arry2.map((itm, inx) => ({
  //     value: ++inx,
  //     label: itm.toString(),
  //   }));
  //   console.log(next_10_years, "check next 10 year");
  //   return [...next_10_years, ...traningYear];
  // };

  // useEffect(() => {
  //   setYearDecrementDDL(yearDecrement());
  // }, []);

  useEffect(() => {
    if (singleData.length > 0) {
      setRowDto(singleData);
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

  const getEduInfoById = () => {
    getEmployeeEducationByEmpId_api(headerData?.employeeId, setSingleData);
  };

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = {
      levelofEducation: {
        value: itm.educationLevelId,
        label: itm.educationLevel,
      },
      examDegree: { value: itm.degreeId, label: itm.degree },
      majorGroup: itm?.group,
      durationYears: itm?.durationYears,
      nameofInstitute: itm?.institute,
      rorignInstitute: itm?.isForeignInstitute,
      passingYear: { value: 1000, label: itm?.passingYear },
      result: { value: itm.resultId, label: itm.result },
      mark: itm?.marks,
      CGPA: itm?.cgpa,
      CGPAScal: itm?.cgpaScale ? { value: 100, label: itm?.cgpaScale } : "",
      employeeEducationInfoId: itm?.employeeEducationInfoId || 0,
      others: itm.degree,
    };
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  const rowDataAddHandler = (values) => {
    //******uniq check closed. If needed code is given below*****
    // const isFound = rowDto?.map(
    //   (item) =>
    //     item?.levelofEducation?.value === values?.levelofEducation?.value &&
    //     item?.examDegree?.value === values?.examDegree?.value
    // );
    // if (isFound?.length > 0) return toast.warn("Not allowed to duplicate item");
    setRowDto([...rowDto, singleRowdtoFunc(values)]);
    setUploadImage("");
  };

  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  useEffect(() => {
    getEmployeeEducationByEmpId_api(headerData?.employeeId, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        rowDto={rowDto}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        rowDataAddHandler={rowDataAddHandler}
        remover={remover}
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        editClick={editClick}
        setEditClick={setEditClick}
        singleData={singleData}
        setRowDto={setRowDto}
        isDisabled={isDisabled}
        getEduInfoById={getEduInfoById}
      />
    </div>
  );
}
