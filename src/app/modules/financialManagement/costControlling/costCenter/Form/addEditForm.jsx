/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getEmpDDLAction,
  saveControllingUnit,
  saveEditedControllingUnit,
  getCostCenterById,
  setControllingUnitSingleEmpty,
  getCostCenterTypeDDLAction,
  getCostCenterGroupDDLAction,
  getProfitCenterDDLAction,
} from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import {
  getSbuDDLAction,
  getControllingUnitDDLAction,
} from "../../../../_helper/_redux/Actions";

const initData = {
  id: undefined,
  costCenterName: "",
  costCenterCode: "",
  responsiblePerson: "",
  sbu: "",
  cu: "",
  ccGroupName: "",
  profitCenter: "",
};

export default function CostCenterForm({
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

  // get emplist ddl from store
  const empDDL = useSelector((state) => {
    return state?.costCenter?.empDDL;
  }, shallowEqual);
  const sbuDDL = useSelector((state) => {
    return state?.commonDDL?.sbuDDL;
  }, shallowEqual);
  const CuDDL = useSelector((state) => {
    return state?.commonDDL?.controllingDDL;
  }, shallowEqual);
  const CcTypeDDL = useSelector((state) => {
    return state?.costCenter?.costCenterTypeDDL;
  }, shallowEqual);
  const CcGroupNameDDL = useSelector((state) => {
    return state?.costCenter?.costCenterGroupDDL;
  }, shallowEqual);
  const ProfitCenterDDL = useSelector((state) => {
    return state?.costCenter?.profitCenterDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.costCenter?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getCostCenterById(id, profileData.accountId,selectedBusinessUnit.value ));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getEmpDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getControllingUnitDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const CostCenterType = (CostControlUnitId) => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getCostCenterTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          CostControlUnitId
        )
      );
    }
  };
  const CostCenterGroup = (ControllingUnitId) => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getCostCenterGroupDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          ControllingUnitId
        )
      );
    }
  };

  const profitCenter_Acion = (cuId) => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getProfitCenterDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          cuId
        )
      );
    }
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          costCenterId: +id,
          responsiblePersonId: values.responsiblePerson.value || 0,
          actionBy: profileData.userId,
        };
        dispatch(saveEditedControllingUnit(payload, setDisabled));
      } else {
        const payload = {
          costCenterCode: values.costCenterCode,
          costCenterName: values.costCenterName,
          controllingUnitId: values?.cu?.value,
          profitCenterId: values?.profitCenter?.value,
          sbuId: values?.sbu?.value,
          costCenterGroupId: values?.ccGroupName?.value,
          responsiblePersonId: values?.responsiblePerson?.value || 0,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
          actionBy: profileData.userId,
        };
        dispatch(saveControllingUnit({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Cost Center"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        empDDL={empDDL}
        sbuDDL={sbuDDL}
        CuDDL={CuDDL}
        CcTypeDDL={CcTypeDDL}
        CostCenterType={CostCenterType}
        CcGroupNameDDL={CcGroupNameDDL}
        CostCenterGroup={CostCenterGroup}
        ProfitCenterDDL={ProfitCenterDDL}
        isEdit={id || false}
        profitCenter_Acion={profitCenter_Acion}
      />
    </IForm>
  );
}
