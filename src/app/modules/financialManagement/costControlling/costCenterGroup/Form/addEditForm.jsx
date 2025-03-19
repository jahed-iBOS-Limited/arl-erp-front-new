/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getGroupParentDDL,
  saveCreatedCostCenterGroup,
  saveEditedCostCenterGroup,
  getCostCenterGroupById,
  setCostCenterGroupSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Form from "./form";
import { getControllingUnitDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from "./../../../../_helper/_loading";

const initData = {
  id: undefined,
  costCenterCenterGroupCode: "",
  costCenterCenterGroupName: "",
  controllingUnit: "",
  costCenterCenterGroupParent: "",
};

export default function CostCenterGroupForm({
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

  // get controllingUnitDDL from store
  const controllingUnitDDL = useSelector((state) => {
    return state?.commonDDL?.controllingDDL;
  }, shallowEqual);

  // get groupParentDDL ddl from store
  const groupParentDDL = useSelector((state) => {
    return state?.costCenterGroup?.groupParentDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.costCenterGroup?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getCostCenterGroupById(id));
    } else {
      dispatch(setCostCenterGroupSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //call groupParentDDL for edit
  useEffect(() => {
    if (id && profileData?.accountId && selectedBusinessUnit?.value) {
      dispatch(
        getGroupParentDDL(
          profileData.accountId,
          selectedBusinessUnit.value,
          singleData.controllingUnitId
        )
      );
    }
  }, [id, singleData, profileData, selectedBusinessUnit]);

  //Dispatch Get controlling;ist action for get controlling;ist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId && !id) {
      dispatch(
        getControllingUnitDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          costCenterGroupId: +id,
          costCenterGroupCode: values.costCenterGroupCode,
          costCenterGroupName: values.costCenterGroupName,
          costCenterGroupParantId: values?.costCenterGroupParent?.value,
          costCenterGroupParantName: values.costCenterGroupParent?.label,
          controllingUnitId: values?.controllingUnit?.value,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        };
        dispatch(saveEditedCostCenterGroup(payload, setDisabled));
      } else {
        const payload = {
          costCenterGroupCode: values.costCenterGroupCode,
          costCenterGroupName: values.costCenterGroupName,
          costCenterGroupParantId: values?.costCenterGroupParent?.value,
          costCenterGroupParantName: values.costCenterGroupParent?.label,
          controllingUnitId: values?.controllingUnit?.value,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        };
        dispatch(
          saveCreatedCostCenterGroup({ data: payload, cb, setDisabled })
        );
      }
    } else {
      setDisabled(false);
      
    }
  };

  let [objProps, setObjprops] = useState({});

  let getProps = (props) => {
    setObjprops(props);
    // return props;
  };
  const _getGroupParentDDL = (cuId) => {
    if (selectedBusinessUnit?.value && profileData?.accountId && cuId) {
      dispatch(
        getGroupParentDDL(
          profileData.accountId,
          selectedBusinessUnit.value,
          cuId
        )
      );
    }
  };

  return (
    <div>
      <IForm
        link="/financial-management/cost-controlling/costcenter-group"
        title="Create Cost Center Group"
        getProps={getProps}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          initData={singleData || initData}
          {...objProps}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          controllingUnitDDL={controllingUnitDDL}
          groupParentDDL={groupParentDDL}
          isEdit={id || false}
          getProps={getProps}
          getGroupParentDDL={_getGroupParentDDL}
        />
      </IForm>
    </div>
  );
}
