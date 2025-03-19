import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
  editEmployeeProfessionalInfo_api,
  employeeProfessionalInfoId_api,
  employeeProfessionalInfo_api,
} from "./helper";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";
import Loading from "./../../../../../../_helper/_loading";
import { isUniq } from './../../../../../../_helper/uniqChecker';

const initData = {
  companyName: "",
  companyBusiness: "",
  companyLocation: "",
  designation: "",
  department: "",
  serviceLengthFrom: _todayDate(),
  currentlyWorking: false,
  serviceLengthTo: "",
  areaOfExperiences: "",
  responsibilities: "",
};

export default function ProfessionalInformation() {
  const { state: headerData } = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  const [singleData, setSingleData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const [editBtnIndex, setEditBtnIndex] = useState("");

  // singleRowdto func
  const singleRowdtoFunc = (values) => {
    const obj = {
      companyName: values?.companyName,
      companyBusiness: values?.companyBusiness,
      companyLocation: values?.companyLocation,
      designation: values?.designation,
      department: values?.department,
      fromServiceLength: values?.serviceLengthFrom,
      toServiceLength: values?.serviceLengthTo || null,
      areaOfExperiences: values?.areaOfExperiences,
      responsibilities: values?.responsibilities,
      documentLink: uploadImage[0]?.id || "",
      isCurrentlyWorking: values?.currentlyWorking,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      actionBy: profileData?.userId,
      employeeId: headerData?.employeeId,
      employeeCode: headerData?.employeeCode,
    };
    return obj;
  };

  const saveHandler = async (values, cb) => {

    if(editClick && (!values?.companyName || !values?.companyBusiness || !values?.companyLocation || !values?.designation || !values?.department || !values?.serviceLengthFrom)) return toast.warn("Please fill up all fields")

    if (singleData.length > 0) {
      // Edit api call

      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
        employeeProfessionalInfoId: itm?.employeeProfessionalInfoId || 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
      }));

      if (editClick) {
        // edit btn true
        if (rowDto.length > 0) {
          const copyRodto = modifiedRowDto;
          // copyRodto[editBtnIndex] = singleRowdtoFunc(values);
          copyRodto[editBtnIndex] = {
            ...singleRowdtoFunc(values),
            documentLink: uploadImage[0]?.id
              ? uploadImage[0]?.id
              : values?.documentLink
              ? values?.documentLink
              : "",
          };
          editEmployeeProfessionalInfo_api(copyRodto, cb, setDisabled).then(
            (data) => {
              employeeProfessionalInfoId_api(
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
          editEmployeeProfessionalInfo_api(
            modifiedRowDto,
            cb,
            setDisabled
          ).then((data) => {
            employeeProfessionalInfoId_api(
              headerData?.employeeId,
              setSingleData
            );
          });
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      // Create api call
      if (rowDto.length > 0) {
        employeeProfessionalInfo_api(rowDto, cb, setDisabled).then((data) => {
          employeeProfessionalInfoId_api(headerData?.employeeId, setSingleData);
        });
      } else {
        toast.warn("Please add at least one");
      }
    }
  };

  const rowDataAddHandler = (values) => {
    if(
      isUniq("companyName", values?.companyName, rowDto)
    ){
      setRowDto([...rowDto, singleRowdtoFunc(values)]);
      setUploadImage("");
    }

    
  };
  // const rowDataAddHandler = (payload) => {
  //   if (
  //     isUniq('intTaxItemGroupIdMat', payload.intTaxItemGroupIdMat, rowDto)
  //   ) {
  //     setRowDto([payload, ...rowDto])
  //     setUploadImage("");
  //   }
  // }

  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = {
      companyName: itm?.companyName,
      companyBusiness: itm?.companyBusiness,
      companyLocation: itm?.companyLocation,
      designation: itm?.designation,
      department: itm?.department,
      serviceLengthFrom: _dateFormatter(itm?.fromServiceLength),
      currentlyWorking: itm?.isCurrentlyWorking,
      serviceLengthTo: _dateFormatter(itm?.toServiceLength) || null,
      areaOfExperiences: itm?.areaOfExperiences,
      responsibilities: itm?.responsibilities,
      employeeProfessionalInfoId: itm?.employeeProfessionalInfoId,
    };
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  const empProfessionalInfoById = () => {
    employeeProfessionalInfoId_api(
      headerData?.employeeId,
      setSingleData
    );
  }

  useEffect(() => {
    employeeProfessionalInfoId_api(headerData?.employeeId, setSingleData);
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
        rowDataAddHandler={rowDataAddHandler}
        remover={remover}
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        singleData={singleData}
        isDisabled={isDisabled}
        empProfessionalInfoById={empProfessionalInfoById}
        setRowDto={setRowDto}
      />
    </div>
  );
}
