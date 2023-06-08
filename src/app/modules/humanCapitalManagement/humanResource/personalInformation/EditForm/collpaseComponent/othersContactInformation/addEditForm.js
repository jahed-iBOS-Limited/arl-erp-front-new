/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "./../../../../../../_helper/_loading";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { getImageFile_api } from "./../../../helper";
import {
  editEmpOthersContactInfo_api,
  createEmpOthersContactInfo_api,
  getEmpOthersContactInfoById_api,
} from "./helper";
import { isUniq } from "../../../../../../_helper/uniqChecker";

const initData = {
  contactType: "",
  contactPerson: "",
  relationhwithEmployee: "",
  contactNo: "",
  country: "",
  stateDivision: "",
  cityDistrict:"",
  postCode:"",
  villageStreet: "",
  otherDocLink: "",
  othersDoc: "",
  policeStation:"",
  identificationType: "",
  identificationNo: "",
};

export default function OthersContactInformation({ identificationTypeDDL, divisionDDLGlobal }) {
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
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
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      contactTypeId: values?.contactType?.value,
      contactType: values?.contactType?.label,
      contactPerson: values?.contactPerson,
      relation: values?.relationhwithEmployee,
      contactNo: values?.contactNo,
      countryId: values?.country?.value || 0,
      divisionId: values?.stateDivision?.value || 0,
      districtId: values?.cityDistrict?.value || 0,
      thanaId: values?.policeStation?.value || 0,
      postCode: values?.postCode?.label || "",
      villageStreet: values?.villageStreet,

      // Two Field Added | Assign by Mim Apu (BA)
      intIdentificationTypeId: values?.identificationType?.value || null,
      strIdentificationType: values?.identificationType?.label || null,
      strIdentificationNo: values?.identificationNo || null,
      identificationType: values?.identificationType?.label,

      identificationDocLink: "",
      otherDocLink: uploadImage[0]?.id || "",
      actionBy: profileData?.userId,
      address:
        values?.country?.value === 18
          ? `${values?.country?.label}, ${values?.stateDivision?.label}, ${values?.cityDistrict?.label}`
          : `${values?.villageStreet}`,
      othersContactInfoId: values?.othersContactInfoId || 0,
    };
    return obj;
  };

  const rowDataAddHandler = (values) => {
    if (isUniq("strIdentificationNo", values?.identificationNo, rowDto)) {
      setRowDto([...rowDto, singleRowdtoFunc(values)]);
      setUploadImage("");
    }
  };
  const remover = (id) => {
    let ccdata = rowDto?.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = {
      contactType: { value: itm?.contactTypeId, label: itm?.contactType },
      contactPerson: itm?.contactPerson,
      relationhwithEmployee: itm?.relation,
      contactNo: itm?.contactNo,
      country: { value: itm?.countryId, label: itm?.countryName },
      stateDivision: { value: itm?.divisionId, label: itm?.divisionName },
      cityDistrict: { value: itm?.districtId, label: itm?.districtName },
      postCode: { value: 10000, label: itm?.postCode },
      villageStreet: itm?.villageStreet,
      otherDocLink: itm?.otherDocLink,
      identificationType: {
        value: itm?.intIdentificationTypeId,
        label: itm?.strIdentificationType,
      },
      identificationNo: itm?.strIdentificationNo,
      othersDoc: "",
      address:
        itm?.country?.label === 18
          ? `${itm?.country?.label}, ${itm?.stateDivision?.label}, ${itm?.cityDistrict?.label}`
          : `${itm?.villageStreet}`,
      policeStation: { value: itm?.thanaId, label: itm?.thanaName },
      othersContactInfoId: itm?.othersContactInfoId,
    };
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  const getEmpOthersConById = () => {
    getEmpOthersContactInfoById_api(headerData?.employeeId, setSingleData);
  };

  useEffect(() => {
    getEmpOthersConById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData.length > 0) {
      const modifiedRowDto = singleData.map((itm) => ({
        ...itm,

        // Two Field Added | Assign by Mim Apu (BA)
        intIdentificationTypeId: itm?.intIdentificationTypeId,
        strIdentificationType: itm?.strIdentificationType,
        strIdentificationNo: itm?.strIdentificationNo,
        identificationType: itm?.strIdentificationType,

        address: `${itm?.countryName}, ${
          itm?.divisionName
        }, ${itm?.cityDistrict || itm?.districtName}`,
      }));
      setEdit(false);
      setRowDto(modifiedRowDto);
    } else {
      setEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    if (
      editClick &&
      (!values?.contactType ||
        !values?.contactPerson ||
        !values?.relationhwithEmployee ||
        !values?.contactNo ||
        !values?.country ||
        !values?.identificationType ||
        !values?.identificationNo ||
        !values?.villageStreet)
    )
      return toast.warn("Please fill up all fields");

    if (
      editClick &&
      values?.country?.label === "Bangladesh" &&
      (!values?.stateDivision ||
        !values?.cityDistrict ||
        !values?.postCode ||
        !values?.policeStation)
    )
      return toast.warn("Please fill up all fields");

    if (singleData.length > 0) {
      // Edit api call
      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,

        intIdentificationTypeId:
          itm?.intIdentificationTypeId || itm?.identificationType?.value,
        identificationType:
          itm?.identificationType || itm?.identificationType?.label,
        strIdentificationType:
          itm?.strIdentificationType || itm?.identificationType?.label,
        strIdentificationNo: itm?.strIdentificationNo || itm?.identificationNo,

        actionBy: profileData.userId,
      }));

      if (editClick) {
        // edit btn true
        if (rowDto.length > 0) {
          const copyRodto = modifiedRowDto;
          //copyRodto[editBtnIndex] = singleRowdtoFunc(values);
          copyRodto[editBtnIndex] = {
            ...singleRowdtoFunc(values),
            otherDocLink: "",
          };
          editEmpOthersContactInfo_api(copyRodto, cb, setDisabled).then(
            (data) => {
              getEmpOthersContactInfoById_api(
                headerData?.employeeId,
                setSingleData
              );
              setEditClick(false);
            }
          );
        } else {
          toast.warn("Please add at least one");
        }
      } else {
        // edit btn false
        if (rowDto.length > 0) {
          editEmpOthersContactInfo_api(modifiedRowDto, cb, setDisabled).then(
            (data) => {
              getEmpOthersContactInfoById_api(
                headerData?.employeeId,
                setSingleData,
                setDisabled
              );
            }
          );
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      if (rowDto.length > 0) {
        createEmpOthersContactInfo_api(rowDto, cb, setDisabled).then((data) => {
          getEmpOthersContactInfoById_api(
            headerData?.employeeId,
            setSingleData,
            setDisabled
          );
        });
      } else {
        toast.warn("Please add at least one");
      }
    }
  };

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        rowDataAddHandler={rowDataAddHandler}
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        singleData={singleData}
        isDisabled={isDisabled}
        identificationTypeDDL={identificationTypeDDL}
        getEmpOthersConById={getEmpOthersConById}
        divisionDDLGlobal={divisionDDLGlobal}
      />
    </div>
  );
}
