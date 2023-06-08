/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  createEmployeeNomineeInfo_api,
  editEmployeeNomineeInfo_api,
} from "./helper";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { getEmployeeNomineeById_api } from "./helper";
import { getImageFile_api } from "./../../../helper";
import Loading from "./../../../../../../_helper/_loading";
import { isUniq } from "../../../../../../_helper/uniqChecker";

const initData = {
  name: "",
  relationship: "",
  country: "",
  stateDivision: "",
  cityDistrict: "",
  policeStation: "",
  postCode: "",
  villageStreet: "",
  nationality: "",
  identificationType: "",
  identificationNo: "",
  percentage: "",
  mobileNo: "",
  alternativeMobileNo: "",
};

export default function NomineeInformation({ identificationTypeDDL, divisionDDLGlobal }) {
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
  const [editClick, setEditClick] = useState(false);
  const [editBtnIndex, setEditBtnIndex] = useState("");
  const { state: headerData } = useLocation();
  const [singleData, setSingleData] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // singleRowdto func
  const singleRowdtoFunc = (values) => {
    const obj = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      employeeId: headerData?.employeeId,
      employeeCode: headerData?.employeeCode,
      nomineeName: values?.name,
      relationWithEmployee: values?.relationship,
      state: values?.stateDivision?.label,
      city: values?.cityDistrict?.label,
      policeStation: values?.policeStation?.label,
      postCode: values?.postCode?.label,
      village: values?.villageStreet,
      countryId: values?.country?.value,
      countryName: values?.country?.label,
      identificationTypeId: values?.identificationType?.value,
      identificationType: values?.identificationType?.label,
      identificationNo: values?.identificationNo,
      percentage: +values?.percentage,
      mobileNumber: values?.mobileNo,
      alternateMobile: values?.alternativeMobileNo,
      actionBy: profileData?.userId,
      employeeNomineeId: values?.employeeNomineeId || 0,
      identificationDocLink: uploadImage[0]?.id || "",
    };
    return obj;
  };
  const saveHandler = async (values, cb) => {
    // single edit validation
    if (
      editClick &&
      (!values?.name ||
        !values?.relationship ||
        !values?.country ||
        !values?.stateDivision ||
        !values?.cityDistrict ||
        !values?.policeStation ||
        !values?.postCode ||
        !values?.villageStreet ||
        !values?.nationality ||
        !values?.identificationType ||
        !values?.identificationNo ||
        !values?.percentage ||
        !values?.mobileNo)
    )
      return toast.warn("Please fill up all fields");

    // Percentage 100 % calculation
    const percent = rowDto?.reduce((acc, cur) => {
      return acc + cur?.percentage;
    }, 0);
    if (singleData.length > 0) {
      // Edit api call
      // Edit api call
      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
        identificationType:
          itm?.identificationType || itm?.identificationTypeName,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
      }));

      if (editClick) {
        // edit btn true
        if (rowDto.length > 0) {
          const copyRodto = modifiedRowDto;
          //copyRodto[editBtnIndex] = singleRowdtoFunc(values);
          copyRodto[editBtnIndex] = {
            ...singleRowdtoFunc(values),
            identificationDocLink: uploadImage[0]?.id
              ? uploadImage[0]?.id
              : values?.identificationDocLink
              ? values?.identificationDocLink
              : "",
          };
          if (percent === 100) {
            editEmployeeNomineeInfo_api(copyRodto, cb, setDisabled).then(
              (data) => {
                getEmployeeNomineeById_api(
                  headerData?.employeeId,
                  setSingleData
                );
                setEditClick(false);
              }
            );
          } else {
            toast.warn("Please fill in total (100%) ");
          }
        } else {
          toast.warn("Please add at least one");
        }
      } else {
        // edit btn false
        if (rowDto.length > 0) {
          if (percent === 100) {
            editEmployeeNomineeInfo_api(modifiedRowDto, cb, setDisabled).then(
              (data) => {
                getEmployeeNomineeById_api(
                  headerData?.employeeId,
                  setSingleData
                );
              }
            );
          } else {
            toast.warn("Please fill in total (100%) ");
          }
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      // crate api call
      if (rowDto.length > 0) {
        if (percent === 100) {
          createEmployeeNomineeInfo_api(rowDto, cb, setDisabled).then(
            (data) => {
              getEmployeeNomineeById_api(headerData?.employeeId, setSingleData);
            }
          );
        } else {
          toast.warn(`Please fill in total (100%)`);
        }
      } else {
        toast.warn("Please add at least one");
      }
    }
  };

  const rowDataAddHandler = (values) => {

    
    let numberValidateRegex = /^[0-9]\d*$/;
    let validMobile = values?.mobileNo?.match(numberValidateRegex);
    let validAlternateMobile = values?.alternativeMobileNo?.match(
      numberValidateRegex
    );

    if (!validMobile || !validAlternateMobile)
      return toast.warn("Mobile number should be only digit");

    const percent = rowDto?.reduce((acc, cur) => {
      return acc + cur?.percentage;
    }, 0);

    // Percentage 100 % calculation
    if (percent + values?.percentage <= 100) {
      // attachment upload check
      // if (uploadImage[0]?.id) {
      const singleRowdto = singleRowdtoFunc(values);
      if (
        isUniq("identificationNo", singleRowdto?.identificationNo, rowDto) &&
        isUniq("nomineeName", singleRowdto?.name, rowDto)
      ) {
        setRowDto([...rowDto, singleRowdto]);
        setUploadImage("");
      }
    } else {
      toast.warn("Please fill in total (100%) ");
    }
  };

  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = {
      name: itm?.nomineeName,
      relationship: itm?.relationWithEmployee,
      country: { value: itm?.countryId, label: itm?.countryName },
      stateDivision: { value: itm?.stateId, label: itm?.state },
      cityDistrict: { value: itm?.cityId, label: itm?.city },
      policeStation: { value: itm?.policeStationId, label: itm?.policeStation },
      postCode: { value: 1000, label: itm?.postCode },
      villageStreet: itm?.village,
      nationality: { value: itm?.nationalityId, label: itm?.nationality },
      identificationType: {
        value: itm?.identificationTypeId,
        label: itm?.identificationTypeName,
      },
      identificationNo: itm?.identificationNo,
      percentage: itm?.percentage,
      mobileNo: itm?.mobileNumber,
      alternativeMobileNo: itm?.alternateMobile,
      employeeNomineeId: itm?.employeeNomineeId || 0,
    };
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  const getNomineeById = () => {
    getEmployeeNomineeById_api(headerData?.employeeId, setSingleData);
  };

  useEffect(() => {
    getNomineeById();
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
        remover={remover}
        rowDataAddHandler={rowDataAddHandler}
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        singleData={singleData}
        isDisabled={isDisabled}
        identificationTypeDDL={identificationTypeDDL}
        setRowDto={setRowDto}
        getNomineeById={getNomineeById}
        divisionDDLGlobal={divisionDDLGlobal}
      />
    </div>
  );
}
