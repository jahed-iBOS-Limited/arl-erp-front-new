import React, { useState, useEffect } from "react";
import {
  religionDDL_api,
  getGenderDDL_api,
  getFamilyInfoById_api,
  editFamilyInfo_api,
} from "./helper";
import Form from "./form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { createFamilyInfo_api } from "./helper";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";
import Loading from "./../../../../../../_helper/_loading";
import { isUniq } from "../../../../../../_helper/uniqChecker";
const initData = {
  name: "",
  relation: "",
  gender: "",
  dateOfBirth: _todayDate(),
  occupation: "",
  identificationType: "",
  identificationNo: "",
  identificationDoc: "",
};

export default function FamilyInformation({ identificationTypeDDL }) {
  const [edit, setEdit] = useState(false);
  const [religionDDL, setReligionDDL] = useState([]);
  const [genderDDL, setGenderDDL] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [editClick, setEditClick] = useState(false);
  const [editBtnIndex, setEditBtnIndex] = useState("");
  const { state: headerData } = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [singleData, setSingleData] = useState([]);

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      religionDDL_api(setReligionDDL);
      getGenderDDL_api(setGenderDDL);
    }
  }, [edit]);

  // singleRowdto func
  const singleRowdtoFunc = (values) => {
    const obj = {
      employeeId: headerData?.employeeId,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      employeeCode: headerData?.employeeCode,
      familyPerson: values?.name,
      relation: values?.relation?.label,
      genderId: values?.gender?.value,
      genderName: values?.gender?.label,
      dateOfBirth: values?.dateOfBirth,
      occupation: values?.occupation,
      identificationTypeId: values?.identificationType?.value,
      identificationType: values?.identificationType?.label,
      identificationNo: values.identificationNo,
      identificationDocLink: uploadImage[0]?.id || "",
      actionBy: profileData?.userId,
    };
    return obj;
  };

  // save btn Heandelar
  const saveHandler = async (values, cb) => {
    //   name: "",
    // relation: "",
    // gender: "",
    // dateOfBirth: _todayDate(),
    // occupation: "",
    // identificationType: "",
    // identificationNo: "",
    // identificationDoc: "",

    // single edit validation
    if (
      editClick &&
      (!values?.relation ||
        !values?.name ||
        !values?.gender ||
        !values?.dateOfBirth ||
        !values?.occupation ||
        !values?.identificationType ||
        !values?.identificationNo)
    )
      return toast.warn("Please fill up all fields");
    if (singleData.length > 0) {
      // Edit api call
      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
        familyInfoId: itm?.familyInfoId || 0,
        // accountId: profileData?.accountId,
        // businessUnitId: selectedBusinessUnit?.value,
      }));

      if (editClick) {
        // edit btn true
        if (rowDto.length > 0) {
          const copyRodto = modifiedRowDto;
          copyRodto[editBtnIndex] = {
            ...singleRowdtoFunc(values),
            identificationDocLink: uploadImage[0]?.id
              ? uploadImage[0]?.id
              : values?.identificationDocLink
              ? values?.identificationDocLink
              : "",
          };
          editFamilyInfo_api(copyRodto, setDisabled).then((data) => {
            getFamilyInfoById_api(headerData?.employeeId, setSingleData);
            setEditClick(false);
          });
        } else {
          toast.warn("Please add at least one");
        }
      } else {
        // edit btn false
        if (rowDto.length > 0) {
          editFamilyInfo_api(modifiedRowDto, setDisabled).then((data) => {
            getFamilyInfoById_api(headerData?.employeeId, setSingleData);
          });
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      // create api call
      if (rowDto.length > 0) {
        createFamilyInfo_api(rowDto, cb, setDisabled).then((data) => {
          getFamilyInfoById_api(headerData?.employeeId, setSingleData);
        });
      } else {
        toast.warn("Please add at least one");
      }
    }
  };

  //rowDataAddHandler
  const rowDataAddHandler = (values) => {
    if (isUniq("identificationNo", values?.identificationNo, rowDto)) {
      setRowDto([...rowDto, singleRowdtoFunc(values)]);
      setUploadImage("");
    }
  };
  //remover row dto
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  const getFamilyInfoById = () => {
    getFamilyInfoById_api(headerData?.employeeId, setSingleData);
  };

  useEffect(() => {
    getFamilyInfoById();
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

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = {
      name: itm?.familyPerson,
      relation: { value: 100, label: itm.relation },
      gender: { value: itm?.genderId, label: itm?.genderName },
      dateOfBirth: _dateFormatter(itm?.dateOfBirth),
      occupation: itm?.occupation,
      identificationType: {
        value: itm?.identificationTypeId,
        label: itm?.identificationType,
      },
      identificationNo: itm?.identificationNo,
      identificationDoc: "",
      familyInfoId: itm?.familyInfoId || 0,
    };
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        religionDDL={religionDDL}
        genderDDL={genderDDL}
        identificationTypeDDL={identificationTypeDDL}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        rowDataAddHandler={rowDataAddHandler}
        setUploadImage={setUploadImage}
        rowDto={rowDto}
        remover={remover}
        singleData={singleData}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        setRowDto={setRowDto}
        isDisabled={isDisabled}
        getFamilyInfoById={getFamilyInfoById}
      />
    </div>
  );
}
