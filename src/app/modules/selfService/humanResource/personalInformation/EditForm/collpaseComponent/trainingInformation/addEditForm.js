/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  createEmployeeTrainingInfo_api,
  editEmployeeTrainingInfo_api,
} from "./helper";
import { toast } from "react-toastify";
import { getEmpTrainingInfoById_api } from "./helper";
import { useLocation } from "react-router-dom";
import { getImageFile_api } from "./../../../helper";
import Loading from "./../../../../../../_helper/_loading";

const initData = {
  trainingTitle: "",
  issuingOrganization: "",
  traningYear: "",
  duration: "",
  credential: false,
  issueDate: "",
  trainingCovered: "",
  months: "",
  year: "",
  months1: "",
  year1: "",
  credentialId: "",
};

export default function TrainingInformation() {
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [yearIncrementDDL, setYearIncrementDDL] = useState([]);
  const [yearDecrementDDL, setYearDecrementDDL] = useState([]);
  const [uploadImage, setUploadImage] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const [editBtnIndex, setEditBtnIndex] = useState("");
  const [singleData, setSingleData] = useState([]);
  const { state: headerData } = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // singleRowdto func
  const singleRowdtoFunc = (values) => {
    const obj = {
      trainingTitle: values.trainingTitle,
      issuingOrganization: values?.issuingOrganization,
      employeeId: headerData?.employeeId,
      employeeCode: headerData?.employeeCode,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      trainingYear: +values?.traningYear?.label,
      durationDays: +values?.duration,
      isExpired: values?.credential,
      monthOfIssue: values?.months?.label,
      yearOfIssue: +values?.year?.label,
      monthOfExpire: values?.credential ? "" : values?.months1?.label,
      yearOfExpire: values?.credential ? 0 : +values?.year1?.label,
      trainingCoveredOn: values?.trainingCovered,
      credentialId: values?.credentialId,
      actionBy: profileData?.userId,
      trainingInfoId: values?.trainingInfoId || 0,
      attachment: uploadImage[0]?.id || "",
    };
    return obj;
  };

  // year Increment
  const yearIncrement = () => {
    const date = new Date();
    let year = date.getFullYear();
    let yearIncrement = year + 40;
    let arry = [];
    for (let step = year; step < yearIncrement; step++) {
      arry.push(step);
    }
    const traningYear = arry.map((itm, inx) => ({
      value: ++inx,
      label: itm.toString(),
    }));
    return traningYear;
  };
  // year decrement
  const yearDecrement = () => {
    const date = new Date();
    let year = date.getFullYear();
    let yearIncrement = year - 40;
    let arry = [];
    for (let step = year; step > yearIncrement; step--) {
      arry.push(step);
    }
    const traningYear = arry.map((itm, inx) => ({
      value: ++inx,
      label: itm.toString(),
    }));
    return traningYear;
  };

  useEffect(() => {
    setYearIncrementDDL(yearIncrement());
    setYearDecrementDDL(yearDecrement());
  }, []);

  // saveHandler
  const saveHandler = async (values, cb) => {
    // validation for single edit

    if (
      editClick &&
      (!values?.trainingTitle ||
        !values?.issuingOrganization ||
        !values?.traningYear ||
        !values?.duration ||
        !values?.months ||
        !values?.year ||
        !values?.trainingCovered)
    )
      return toast.warn("Please fill up all fields");

    // trainingTitle: "",
    // issuingOrganization: "",
    // traningYear: "",
    // duration: "",
    // credential: false,
    // issueDate: "",
    // trainingCovered: "",
    // months: "",
    // year: "",
    // months1: "",
    // year1: "",
    // credentialId: "",

    if (singleData.length > 0) {
      // Edit api call

      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
        actionBy: profileData?.userId,
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

          editEmployeeTrainingInfo_api(copyRodto, cb, setDisabled).then(
            (data) => {
              getEmpTrainingInfoById_api(headerData?.employeeId, setSingleData);
              setEditClick(false);
            }
          );
        } else {
          toast.warn("Please add at least one");
        }
      } else {
        // edit btn false
        if (rowDto.length > 0) {
          editEmployeeTrainingInfo_api(modifiedRowDto, cb, setDisabled).then(
            (data) => {
              getEmpTrainingInfoById_api(
                headerData?.employeeId,
                setSingleData
              ).then((data) => {
                getEmpTrainingInfoById_api(
                  headerData?.employeeId,
                  setSingleData
                );
              });
            }
          );
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      if (rowDto.length > 0) {
        createEmployeeTrainingInfo_api(rowDto, cb, setDisabled).then((data) => {
          getEmpTrainingInfoById_api(headerData?.employeeId, setSingleData);
        });
      } else {
        toast.warn("Please add at least one");
      }
    }
  };

  const rowDataAddHandler = (values) => {
    // do not check with triple equal in : item?.trainingYear == values?.traningYear?.value
    const isFound = rowDto?.filter(
      (item) =>
        item?.trainingTitle === values?.trainingTitle &&
        item?.issuingOrganization === values?.issuingOrganization &&
        item?.trainingYear == values?.traningYear?.label
    );

    if (isFound?.length > 0) return toast.warn("Not allowed to duplicate item");

    setUploadImage("");
    setRowDto([...rowDto, singleRowdtoFunc(values)]);
  };

  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = {
      trainingTitle: itm?.trainingTitle,
      issuingOrganization: itm?.issuingOrganization,
      traningYear: { value: 1000, label: itm?.trainingYear },
      duration: itm?.durationDays,
      credential: itm?.isExpired,
      trainingCovered: itm?.trainingCoveredOn,
      months: { value: 222, label: itm?.monthOfIssue },
      year: { value: 222, label: itm?.yearOfIssue },
      months1: { value: 222, label: itm?.monthOfExpire },
      year1: { value: 222, label: itm?.yearOfExpire },
      trainingInfoId: itm?.trainingInfoId || 0,
      credentialId: itm?.credentialId,
    };
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  const getTrainingInfoById = () => {
    getEmpTrainingInfoById_api(headerData?.employeeId, setSingleData);
  };

  useEffect(() => {
    getTrainingInfoById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData.length > 0) {
      setRowDto(singleData);
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

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
        yearIncrementDDL={yearIncrementDDL}
        yearDecrementDDL={yearDecrementDDL}
        rowDataAddHandler={rowDataAddHandler}
        remover={remover}
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        singleData={singleData}
        isDisabled={isDisabled}
        getTrainingInfoById={getTrainingInfoById}
        setRowDto={setRowDto}
      />
    </div>
  );
}
