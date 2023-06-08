/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { singleDataById } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/_loading";
import {
  saveAdvanceExpJournal_Action,
  saveEditedAdvanceExpGridData,
} from "./../_redux/Actions";

const initData = {
  comments: "",
  requestedAmount: "",
  paymentType: "",
  category: "",
  disbursementCenter: "",
  numRequestedAmount: "",
  dueDate: _todayDate(),
  requestedEmp: "",
  advExpCategoryName: "",
  disbursementCenterName: "",
  SBU: "",
  approval: "",
  expenseHead: "",
  expenseGroup: ""
};

export default function AdvanceCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  const dispatch = useDispatch();

  useEffect(() => {
    if (params?.id || params?.approval) {
      singleDataById(
        params?.id || params?.approval,

        setSingleData, setDisabled
      );
    }
  }, [params]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id || params?.approval) {
        const payload = {
          advanceId: +params?.id || +params?.approval,
          advanceCode: location?.state?.item?.advanceCode,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          sbuid: values.SBU.value,
          sbuname: values.SBU.label,
          currencyId: location?.state?.item?.currencyId,
          currencyName: location?.state?.item?.currencyName,
          advExpCategoryId: values.advExpCategoryName.value,
          advExpCategoryName: values.advExpCategoryName.label,
          employeeId: values.requestedEmp.value,
          requestDate: _todayDate(),
          dueDate: values.dueDate,
          instrumentId: values.paymentType.value,
          instrumentName: values.paymentType.label,
          disbursementCenterId: values.disbursementCenterName.value,
          disbursementCenterName: values.disbursementCenterName.label,
          numRequestedAmount: values.numRequestedAmount,
          comments: values.comments,
          actionBy: profileData?.userId,
          willApproved: location?.state?.approval ? true : false,
          plantId: location?.state?.selectedPlant?.value || 0,
          businessTransactionId: values?.expenseHead?.value || 0,
          expenseGroup: values?.expenseGroup?.value || "",
        };
        dispatch(
          saveEditedAdvanceExpGridData({ data: payload, cb, setDisabled })
        );
      } else {
        const payload = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          sbuid: values.SBU.value,
          sbuname: values.SBU.label,
          currencyId: location?.state?.selectedCurrency.value,
          currencyName: location?.state?.selectedCurrency.label,
          advExpCategoryId: values.advExpCategoryName.value,
          advExpCategoryName: values.advExpCategoryName.label,
          employeeId: values.requestedEmp.value,
          requestDate: _todayDate(),
          dueDate: values.dueDate,
          instrumentId: values.paymentType.value,
          instrumentName: values.paymentType.label,
          disbursementCenterId: values.disbursementCenterName.value,
          disbursementCenterName: values.disbursementCenterName.label,
          numRequestedAmount: values.numRequestedAmount,
          comments: values.comments,
          actionBy: profileData?.userId,
          plantId: location?.state?.selectedPlant?.value || 0,
          businessTransactionId: values?.expenseHead?.value || 0,
          expenseGroup: values?.expenseGroup?.value || ""
        };
        dispatch(
          saveAdvanceExpJournal_Action({ data: payload, cb, setDisabled })
        );
      }
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    // if not id, that means this is for create form, then we will check this..
    if (!location?.state && (!params?.id || params?.approval)) {
      history.push("/financial-management/expense/advance");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title= {params?.approval ? "Request For Advance Approval" : "Request For Advance" }
      getProps={setObjprops}
      isDisabled={isDisabled}
      submitBtnText={params?.approval  ? "Approval" : "Save"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={(params?.id || params?.approval) ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        jorunalType={location?.state?.selectedJournal?.value}
        state={location.state}
        isEdit={(params?.id || params?.approval) || false}
      />
    </IForm>
  );
}
