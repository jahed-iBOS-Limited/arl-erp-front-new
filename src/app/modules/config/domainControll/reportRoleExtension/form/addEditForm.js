/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { postPermissionForUser } from "../helper";

const initData = {
  employee: "",
  moduleName: "",
  featureName: "",
};

export default function ReportRoleManagerCreateForm({ history }) {
  const location = useLocation();

  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  // const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (rowDto?.length < 1) return toast.warn("Please add item");
    postPermissionForUser(rowDto, setDisabled, cb);
  };

  const [objProps, setObjprops] = useState({});

  const setDataToRow = (values) => {
    if (
      rowDto?.find((item) => item?.secondLabelId === values?.featureName?.value)
    )
      return toast.warn("Feature already added");
    const obj = {
      firstLabelId: values?.moduleName?.value,
      firstLabelName: values?.moduleName?.label,
      secondLabelId: values?.featureName?.value,
      secondLabelName: values?.featureName?.label,
      userId: values?.employee?.value,
      userName: values?.employee?.label,
      accountId: profileData?.accountId,
      branchId: selectedBusinessUnit.value,
      isCreate: false,
      isView: true,
      isEdit: false,
      isDelete: false,
      isApprove: false,
      isActive: true,
      actionById: profileData?.userId,
      actionByName: profileData?.userName,
    };
    rowDto.push(obj);
    setRowDto([...rowDto]);
  };

  const changeActionStatus = (key, index) => {
    rowDto[index][key] = !rowDto[index][key];
    setRowDto([...rowDto]);
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((item, ind) => ind !== index);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title="Report Role"
      getProps={setObjprops}
      isHiddenSave={params?.type === "viewType"}
      isHiddenReset
      isHiddenBack
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setDataToRow={setDataToRow}
        remover={remover}
        type={params?.type}
        location={location}
        changeActionStatus={changeActionStatus}
      />
    </IForm>
  );
}
