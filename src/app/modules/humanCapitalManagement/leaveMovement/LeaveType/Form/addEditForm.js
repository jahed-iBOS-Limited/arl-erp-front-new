import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import { createLeaveType, editLeaveType, LeaveTypeGetById } from "./../helper";

const initData = {
  leaveTypeCode: "",
  leaveType: "",
  isPayable: true,
};
export default function LeaveTypeCreateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (id) {
      const obj = {
        leaveTypeId: id,
        leaveTypeCode: values?.leaveTypeCode,
        leaveType: values?.leaveType,
        accountId: profileData?.accountId,
        isPayable: values?.isPayable,
        percentPayable: 10,
        actionBy: profileData?.userId,
      };
      editLeaveType(obj, setDisabled);
    } else {
      if (rowDto?.length < 1) return toast.warn("Please add at least one row");
      const newData = rowDto?.map((item) => ({
        leaveTypeCode: item?.leaveTypeCode,
        leaveType: item?.leaveType,
        accountId: profileData.accountId,
        isPayable: item?.isPayable,
        percentPayable: 0,
        actionBy: profileData?.userId,
      }));
      createLeaveType(newData, cb, setDisabled);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  //for adding data on table ......
  const rowDtoAddHandler = (values) => {
    const isFound = rowDto?.filter(
      (item) =>
        item?.leaveTypeCode === values?.leaveTypeCode ||
        item?.leaveType === values?.leaveType
    );

    if (isFound?.length > 0)
      return toast.warn("Not allowed to duplicate code or leave type name");

    const data = [...rowDto];
    data.push(values);
    setRowDto(data);
  };

  //for deleteting the row from table....
  const remover = (i) => {
    const filterData = rowDto?.filter((item, index) => index !== i);
    setRowDto(filterData);
  };

  useEffect(() => {
    LeaveTypeGetById(id, setLoading, setSingleData);
  }, [id]);

  return (
    <IForm
      title="Create Leave Type"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDtoAddHandler={rowDtoAddHandler}
        rowDto={rowDto}
        remover={remover}
        loading={loading}
        setLoading={setLoading}
        id={id}
      />
    </IForm>
  );
}
