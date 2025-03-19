/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { getEmployeeBankInformationById_api } from "./helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { editEmployeeBankInformation_api } from "./helper";
import { employeeBankInformation_api } from "./helper";
import { getImageFile_api } from "./../../../helper";
import Loading from "./../../../../../../_helper/_loading";
import { isUniq } from "./../../../../../../_helper/uniqChecker";

const initData = {
  accountName: "",
  accountNumber: "",
  bank: "",
  ibanNo: "",
  swiftCode: "",
  countryName: "",
  bankBranch: "",
  routingNumber: "",
};

export default function BankInformation({empName}) {
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
      bankId: values?.bank?.value || 0,
      bankName: values?.bank?.label || values?.bank,
      bankBranchId: values?.bankBranch?.value || 0,
      bankBranchName: values?.bankBranch?.label || values?.bankBranch || "",
      bankRoutingNumber:
        values?.bankBranch?.routingNo || values?.routingNumber || "0",
      accountNumber: values?.accountNumber,
      accountName: values?.accountName,
      documentPath: uploadImage[0]?.id || "",
      path: "",
      actionBy: profileData?.userId,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      isDefaultAccount: false,
      swiftCode: values?.swiftCode,
      countryId: values?.countryName?.value,
      countryName: values?.countryName?.label,
      ibanNo: values?.ibanNo,
      employeeBankInfoId: values?.employeeBankInfoId || 0,
    };
    return obj;
  };

  const rowDataAddHandler = (values) => {
    if (isUniq("accountNumber", values?.accountNumber, rowDto)) {
      const newRowData = [...rowDto, singleRowdtoFunc(values)];
      newRowData[0].isDefaultAccount =
        rowDto?.length === 0
          ? true
          : rowDto[0]?.isDefaultAccount === true
          ? true
          : false;
      setRowDto(newRowData);
      setUploadImage("");
    }
  };

  //remover row dto
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  useEffect(() => {
    getEmployeeBankInformationById_api(headerData?.employeeId, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData.length > 0) {
      setRowDto(singleData);
      setEdit(false);
    } else {
      // setEdit(true);
    }
  }, [singleData]);

  const getEmpBankInfoById = () => {
    getEmployeeBankInformationById_api(headerData?.employeeId, setSingleData);
  };

  // save btn Heandelar
  const saveHandler = async (values, cb) => {
    // accountName: "",
    //   accountNumber: "",
    //   bank: "",
    //   ibanNo: "",
    //   swiftCode: "",
    //   countryName: "",
    //   bankBranch: "",
    //   routingNumber: "",

    // check validation when single edit
    if (
      editClick &&
      (!values?.accountName ||
        !values?.accountNumber ||
        !values?.countryName ||
        !values?.bank ||
        !values?.bankBranch)
    )
      return toast.warn("Please fill up all fields");

    if (
      editClick &&
      values?.countryName?.label !== "Bangladesh" &&
      (!values?.ibanNo || !values?.swiftCode)
    )
      return toast.warn("Please fill up all fields");

    const isFoundIsDeafult = rowDto?.filter(
      (item) => item?.isDefaultAccount == true
    );

    if (isFoundIsDeafult?.length < 1)
      return toast.warn("Please add atleast one default account");
    if (singleData.length > 0) {
      // Edit api call
      const modifiedRowDto = rowDto.map((itm) => ({
        ...itm,
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
          editEmployeeBankInformation_api(copyRodto, cb, setDisabled).then(
            (data) => {
              getEmployeeBankInformationById_api(
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
          editEmployeeBankInformation_api(modifiedRowDto, cb, setDisabled).then(
            (data) => {
              getEmployeeBankInformationById_api(
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
        employeeBankInformation_api(rowDto, cb, setDisabled).then((data) => {
          getEmployeeBankInformationById_api(
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
    const obj = {
      employeeId: headerData?.employeeId,
      employeeCode: headerData?.employeeCode,
      // bankId: itm?.bank?.value || 0,
      // bankName: itm?.bank?.label || itm?.bankName,
      // bankBranchId: itm?.bankBranch?.value || 0,
      // bankBranchName: itm?.bankBranch?.label || itm?.bankBranchName,
      // bankRoutingNumber: itm?.bankBranch?.routingNo || itm?.bankRoutingNumber,
      // accountNumber: itm?.accountName,
      // accountName: itm?.accountName,
      // documentPath: itm?.documentPath,
      path: "",
      actionBy: profileData?.userId,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      isDefaultAccount: true,
      swiftCode: itm?.swiftCode,
      countryName: itm?.countryName?.value || {
        value: itm?.countryId,
        label: itm?.countryName,
      },
      ibanNo: itm?.ibanNo,
      accountName: itm?.accountName,
      accountNumber: itm?.accountNumber,
      bank: { value: itm?.bankId, label: itm?.bankName },
      bankBranch: { value: itm?.bankBranchId, label: itm?.bankBranchName },
      routingNumber: itm?.bankRoutingNumber,
      employeeBankInfoId: itm?.employeeBankInfoId || 0,
      documentPath: itm?.documentPath,
    };

    setValue(obj);
    setEditClick(true);
    setEditBtnIndex(index);

    console.log(obj, "obj");
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    const modifiedRowDto = rowDto?.map((itm) => ({
      ...itm,
      isDefaultAccount: false,
    }));
    modifiedRowDto[index].isDefaultAccount = !modifiedRowDto[index]
      .isDefaultAccount;
    setRowDto(modifiedRowDto);
  };

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
        setUploadImage={setUploadImage}
        editBtnHandler={editBtnHandler}
        setEditClick={setEditClick}
        editClick={editClick}
        remover={remover}
        itemSlectedHandler={itemSlectedHandler}
        singleData={singleData}
        setRowDto={setRowDto}
        isDisabled={isDisabled}
        getEmpBankInfoById={getEmpBankInfoById}
        empName={empName}
      />
    </div>
  );
}
