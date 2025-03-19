/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveProductDivisionType,
  saveEditedProductDivisionType,
  getProductDivisionById,
  setControllingUnitSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  productDivisionTypeName: "",
  levelPosition: "",
};

export default function ProductDivisionTypeForm({
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

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.productDivisionType?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getProductDivisionById(id, setDisabled));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          ...values,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        }
        dispatch(saveEditedProductDivisionType(payload,setDisabled));
      } else {
        const payload = {
          ...values,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          accountId: profileData.accountId,
        }
        dispatch(saveProductDivisionType({ data: payload, cb },setDisabled));
      }
    } else {
      
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Product Division Type"
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
