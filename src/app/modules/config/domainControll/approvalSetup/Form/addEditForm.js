/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  editApprovalSetup,
  getApprovalDataByIdAction,
  saveApprovalSetup,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

var initData = {
  activityName: "",
  isThreshold: "",
  userName: "",
  any: {},
  groupName:"",
  approvalOrder: "",
};

export default function ApprovalSetupCreate({
  history,
  match: {
    params: { approvalId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const [singleData, setSingleData] = useState("");

  const params = useParams();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (approvalId) {
        const tblApprovalConfigRow = rowDto?.map((item, index) => ({
          userId: item?.userName?.value,
          sequenceId: index + 1,
          approvalConfigId: 0,
          rowId: item?.rowId || 0,
          strUserName: item?.userName?.label,
          threshold: 0,//item?.isThreshold || 0,
          // plantId:item?.plant?.value,
          // plantName:item?.plant?.label,
        }));

        const payload = {
          approvalConfigId: values?.approvalConfigId,
          isActive: true,

          predisorActivityId: values?.activityName?.value,
          predisorActivityName: values?.activityName?.label,
          groupName: values?.groupName,
          isAnyOrder:
            values?.approvalOrder?.label === "Any Order" ? true : false,
          isInSequence:
            values?.approvalOrder?.label === "In Sequence" ? true : false,
          anyUsers: values?.any?.value || 1,
          accountId: profileData?.accountId,
          unitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
          lastActionDateTime: "2020-12-08T05:01:33.111Z",
          serverDateTime: "2020-12-10T09:12:12.040Z",
          plantId:values?.plant?.value,
          plantName:values?.plant?.label,
          tblApprovalConfigRow,
        };
        editApprovalSetup(payload, setDisabled);
      } else {
        if (
          !values?.activityName ||
          !values?.approvalOrder ||
          rowDto?.length === 0
        )
          return toast.warn("Select all fields");

        if (
          rowDto?.length > 1 &&
          values?.approvalOrder?.label === "Any Person" &&
          values?.any === ""
        )
          return toast.warn("Select Any");

        const approvalConfigRow = rowDto?.map((item, index) => ({
          userId: item?.userName?.value,
          userName: item?.userName?.label,
          numThreshold: 0,
          sequenceId: index + 1,

        }));

        console.log(rowDto);

        const payload = {
          predisorActivityId: values?.activityName?.value,
          predisorActivityName: values?.activityName?.label,
          groupName: values?.groupName,
          isAnyOrder:
            values?.approvalOrder?.label === "Any Order" ? true : false,
          isInSequence:
            values?.approvalOrder?.label === "In Sequence" ? true : false,
          anyUsers: values?.any?.value || 1,
          accountId: profileData?.accountId,
          unitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
          lastActionDateTime: "2020-12-08T05:01:33.111Z",
          plantId:values?.plant?.value,
          plantName:values?.plant?.label,
          approvalConfigRow,
        };
        saveApprovalSetup(payload, cb, setDisabled);
      }
    } else {
      // setDisabled(false);
      
    }
  };

  // get single data for edit and view page
  useEffect(() => {
    if (approvalId) {
      getApprovalDataByIdAction(approvalId, setSingleData);
    }
  }, [approvalId]);

  useEffect(() => {
    const data = singleData?.row?.map((item, index) => ({
      ...item,
      isThreshold: item?.threshold || 0,
      userName: { value: item?.userId, label: item?.strUserName },
    }));
    if (approvalId) {
      setRowDto(data);
    } else {
      setRowDto([]);
    }
  }, [singleData]);

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const [objProps, setObjprops] = useState({});

  const setter = (values) => {
    const arr = rowDto?.filter(
      (item) => item?.userName?.value === values?.userName?.value
    );
    if (arr?.length > 0) {
      toast.warn("Not allowed to duplicate items");
    } else {
      setRowDto([...rowDto, values]);
    }
  };

  const remover = (id) => {
    const filterArr = rowDto.filter((itm) => itm.userName?.value !== id);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title={
        params?.type
          ? "Setup Approval"
          : approvalId
          ? "Edit Approval Setup"
          : "Setup Approval"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={params?.type || approvalId}
      isHiddenSave={params?.type}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={approvalId ? singleData : initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        setRowDto={setRowDto}
        rowDto={rowDto}
        remover={remover}
        setter={setter}
        isDisabled={params?.type}
        selectedBusinessUnit={selectedBusinessUnit}
        profileData={profileData}
      />
    </IForm>
  );
}
