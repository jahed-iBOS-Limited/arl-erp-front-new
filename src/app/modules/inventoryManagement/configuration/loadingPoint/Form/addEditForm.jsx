/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveEditDepartment,
  getDepartmentByIdAction,
  saveDepartment,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { getShippingDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  loadingPointName: "",
  shipPointName: "",
};

export function LoadingPointAddForm({
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

  const singleData = useSelector((state) => {
    return state.LoadingPoint?.singleData;
  }, shallowEqual);

  const ShipPointDDL = useSelector((state) => {
    return state.commonDDL?.shippingDDL;
  }, shallowEqual);

  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(
        getDepartmentByIdAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          id
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getShippingDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          loadingPointId: +id,
          loadingPointName: values.loadingPointName,
          shipPointId: values.shipPointName?.value,
          shipPointName: values.shipPointName?.label,
          isActive: true,
          actionBy: profileData.userId,
        };
     
        dispatch(saveEditDepartment(payload,setDisabled));
      } else {
        const payload = {
          loadingPointName: values.loadingPointName,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          shipPointId: values.shipPointName.value,
          shipPointName: values.shipPointName.label,
          actionBy: profileData.userId,
        };

        dispatch(saveDepartment({ data: payload, cb },setDisabled));
      }
    } else {
      console.log(values)
    }
  };


  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Loading Point"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          businessUnit={selectedBusinessUnit.label}
          ShipPointDDL={ShipPointDDL}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
