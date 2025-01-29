/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getSalesTerritoryTypeById,
  saveEditedSalesTerritoryType,
  saveSalesTerritoryType,
  setControllingUnitSingleEmpty,
} from "../_redux/Actions";
import Form from "./form";

const initData = {
  id: undefined,
  territoryTypeName: "",
  levelPosition: "",
  ddlType:"",
  channel:""
};

export default function SalesTerritoryTypeForm({
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

  // get single territory type from store
  const singleData = useSelector((state) => {
    return state.salesTerritoryType?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesTerritoryTypeById(id));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      
    }
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          territoryTypeId: +id,
          territoryTypeName: values.territoryTypeName,
          levelPosition: +values.levelPosition,
          actionBy: profileData.userId
        }
        dispatch(saveEditedSalesTerritoryType(payload,setDisabled));
      } else {
        const payload = {
          accountId: profileData.accountId,
          territoryTypeName: values.territoryTypeName,
          businessUnitId: selectedBusinessUnit?.value,
          levelPosition: +values.levelPosition,
          actionBy: profileData.userId
        }
        dispatch(saveSalesTerritoryType({ data: payload, cb },setDisabled));
      }
    } else {
      
    }
  };


  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Sales Territory Type" : "Create Sales Territory Type"}
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
          isEdit={id || false}
        />
    </IForm>
  );
}
