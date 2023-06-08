/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getCodeTypeDDLAction,
  saveCodeGenerate,
  saveEditedCodeGenerate,
  getSingleById,
  setCodeGenerateSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  codeType: "",
  prefix: "",
  monthLength: "",
  yearLength: "",
  refreshType: "",
  startLengthId: "",
};

export default function CodeGenerateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get codeType ddl from store
  const codeTypeDDL = useSelector((state) => {
    return state?.codeGenerate?.codeTypeDDL;
  }, shallowEqual);

  //Dispatch Get codeType action for get codeType ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getCodeTypeDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const monthLengthDDL = [
    { value: 1, label: "M (1)" },
    { value: 2, label: "MM (01)" },
    { value: 3, label: "MMM (Jul)" },
  ];

  const yearLengthDDL = [
    { value: 1, label: "yy (21)" },
    { value: 2, label: "YY (2021)" },
  ];

  const refreshTypeDDL = [
    { value: 1, label: "Monthly" },
    { value: 2, label: "Yearly" },
    { value: 3, label: "Never" },
  ];

  // get single vehicleUnit from store
  const singleData = useSelector((state) => {
    return state.codeGenerate?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSingleById(id));
    } else {
      dispatch(setCodeGenerateSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          configId: singleData.configId,
          codegeneratorId: +id,
          prefix: values?.prefix,
          startLengthId: values?.startLengthId,
          actionBy: profileData.userId,
        };
        dispatch(saveEditedCodeGenerate(payload, setDisabled));
      } else {
        const payload = {
          codegeneratorId: values?.codeType?.value,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          prefix: values?.prefix,
          monthLengthTypeId: values?.monthLength?.value,
          monthLengthType: values?.monthLength?.label,
          yearLengthTypeId: values?.yearLength?.value,
          yearLengthType: values?.yearLength?.label,
          startLengthId: values?.startLengthId,
          refreshType: values?.refreshType?.label,
          refreshTypeId: values?.refreshType?.value,
          actionBy: profileData.userId,
        };
        dispatch(saveCodeGenerate({ data: payload, cb, setDisabled }));
      }
    } else {
      // setDisabled(false);
      
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Code Generate"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        codeTypeDDL={codeTypeDDL}
        monthLengthDDL={monthLengthDDL}
        yearLengthDDL={yearLengthDDL}
        refreshTypeDDL={refreshTypeDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
