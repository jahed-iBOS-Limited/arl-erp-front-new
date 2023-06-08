/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  saveCashReceiveData_Action,
} from "../_redux/Actions";
import { singleDataById } from "../helper";

const initData = {
  comments: "",
  advanceCode: "",
  advAmount: "",
  receivedAmount: "",
  receivedDate: _todayDate(),
  paymentType: "",
};

export default function CashReceiveForm() {
  const [isDisabled, setDisabled] = useState(true);
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
    if (params?.cashreceive) {
      singleDataById(
        params?.cashreceive,

        setSingleData
      );
    }
  }, [params]);

 

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {

        const payload = {
          advanceId: +params?.cashreceive,
          advanceCode: location?.state?.item?.advanceCode,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          sbuid: location?.state?.item?.sbuid,
          sbuname: location?.state?.item?.sbuname,
          currencyId: location?.state?.item?.currencyId,
          currencyName: location?.state?.item?.currencyName,
          receivedDate: values.receivedDate ,
          employeeId: location?.state?.item?.employeeId,
          receivedAmount: values.receivedAmount,
          comments: values.comments,
          attachmentLink: "string",
          actionBy: profileData?.userId,
        };

        dispatch(saveCashReceiveData_Action({ data: payload, cb }));
      
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  useEffect(() => {
    // if not id, that means this is for create form, then we will check this..
    if (!location?.state && !params?.id) {
      history.push("financial-management/expense/advance/cashreceive");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      
      title="Repayment for Advance Internal Expense"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        jorunalType={location?.state?.selectedJournal?.value}
        state={location.state}
        isEdit={params?.id || false}
        singleData={singleData}
      />
    </IForm>
  );
}
