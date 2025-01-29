/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import {
  getDocumentAttachmentByEmployeeId_api,
  getImageFile_API,
} from "./helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { editDocManagement_api } from "./helper";
import { saveDocManagement_api } from "./helper";
import Loading from "./../../../../../../_helper/_loading";
import "./style.css";

const initData = {
  docType: "",
  effectiveDate: _todayDate(),
  createdDateTime: _todayDate(),
};

export default function DocumentManagement() {
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
  const { state: headerData } = useLocation();
  const [editClick, setEditClick] = useState(false);
  const [editBtnIndex, setEditBtnIndex] = useState("");

  console.log(rowDto, "rowDto");
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
      intDocTypeId: values?.docType?.value,
      strDocType: values?.docType?.label,
      intDocumentId: uploadImage[0]?.id || "",
      intEmployeeId: headerData?.employeeId,
      strEmployeeCode: headerData?.employeeCode,
      intAccountId: profileData?.accountId,
      intBusinessunitId: selectedBusinessUnit?.value,
      strComments: "string",
      createdByName: profileData?.userName,
      intActionBy: profileData?.userId,
      effectiveDate: values?.effectiveDate,
      createdDateTime: values?.createdDateTime,
    };
    return obj;
  };

  //rowDataAddHandler
  const rowDataAddHandler = (values) => {
    setRowDto([...rowDto, singleRowdtoFunc(values)]);
    setUploadImage("");
  };

  //remover row dto
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  useEffect(() => {
    getDocumentAttachmentByEmployeeId_api(
      headerData?.employeeId,
      setSingleData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDocAttachMentById = () => {
    getDocumentAttachmentByEmployeeId_api(
      headerData?.employeeId,
      setSingleData
    );
  };

  useEffect(() => {
    if (singleData.length > 0) {
      setRowDto(singleData);
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

  // save btn Heandelar
  const saveHandler = async (values, cb) => {
    if (singleData.length > 0) {
      // Edit api call
      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
        // intActionBy: profileData?.userId,
        employeeBankInfoId: itm.employeeBankInfoId || 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
      }));

      if (editClick) {
        // edit btn true
        if (rowDto.length > 0) {
          const copyRodto = modifiedRowDto;
          copyRodto[editBtnIndex] = {
            ...singleRowdtoFunc(values),
            isDefaultAccount: copyRodto[editBtnIndex].isDefaultAccount,
            documentPath: uploadImage[0]?.id
              ? uploadImage[0]?.id
              : values?.documentPath
              ? values?.documentPath
              : "",
          };
          editDocManagement_api(copyRodto, cb, setDisabled).then((data) => {
            getDocumentAttachmentByEmployeeId_api(
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
          editDocManagement_api(modifiedRowDto, cb, setDisabled).then(
            (data) => {
              getDocumentAttachmentByEmployeeId_api(
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
        saveDocManagement_api(rowDto, cb, setDisabled).then((data) => {
          getDocumentAttachmentByEmployeeId_api(
            headerData?.employeeId,
            setSingleData
          );
        });
      } else {
        toast.warn("Please add at least one");
      }
    }
  };

  //Edit Btn click form value set
  const editBtnHandler = (index, itm, setValue) => {
    const obj = [
      {
        intAttachmentId: 0,
        intDocTypeId: itm?.docType?.value,
        strDocType: itm?.docType?.label,
        intDocumentId: uploadImage[0]?.id || "",
        intEmployeeId: headerData?.employeeId,
        strEmployeeCode: headerData?.employeeCode,
        intAccountId: profileData?.accountId,
        intBusinessunitId: selectedBusinessUnit?.value,
        strComments: "string",
        intActionBy: profileData?.userId,
        effectiveDate: itm?.effectiveDate,
      },
    ];
    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    const modifiedRowDto = rowDto?.map((itm) => ({
      ...itm,
      isDefaultAccount: false,
    }));
    const copyRowDto = [...modifiedRowDto];
    copyRowDto[index].isDefaultAccount = !copyRowDto[index].isDefaultAccount;
    setRowDto(copyRowDto);
  };

  return (
    <div className="personal-info-with-document-mngt">
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
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        profileData={profileData}
        accountId={profileData?.accountId}
        remover={remover}
        itemSlectedHandler={itemSlectedHandler}
        singleData={singleData}
        setRowDto={setRowDto}
        isDisabled={isDisabled}
        uploadImage={uploadImage}
        getDocAttachMentById={getDocAttachMentById}
      />
    </div>
  );
}
