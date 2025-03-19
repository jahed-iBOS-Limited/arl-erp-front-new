/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveProductDivision,
  saveEditProductDivision,
  getParentDivisionTypeDDLAction,
  getProductDivisionTypeDDLAction,
  getProductDivisionChannelById,
  setProductDivisionSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  productDivisionCode: "",
  productDivisionName: "",
  businessUnitName: "",
  parentDivisionName: "",
  productDivisionType: "",
};

export function ProductDivisionAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const ProductDivisionTypeDDL = useSelector((state) => {
    return state.productDivision?.productDivisionTypDDL;
  }, shallowEqual);
  const ParentDivisionTypeDDLAc = useSelector((state) => {
    return state.productDivision?.parentDivisionTypeDDL;
  }, shallowEqual);

  const singleData = useSelector((state) => {
    return state.productDivision?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(
        getProductDivisionChannelById(
          profileData.accountId,
          selectedBusinessUnit.value,
          id,
          setDisabled
        )
      );
    } else {
      dispatch(setProductDivisionSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getProductDivisionTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getParentDivisionTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          productDivisionId: values.productDivisionId,
          accountId: profileData.accountId,
          productDivisionCode: values.productDivisionCode,
          productDivisionName: values.productDivisionName,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          parentDivisionId: values.parentDivisionName?.value,
          parentDivisionName: values.parentDivisionName?.label,
          productDivisionTypeId: values.productDivisionType?.value,
          productDivisionType: values.productDivisionType?.label,
          actionBy: profileData.userId,
        };
        dispatch(saveEditProductDivision(payload, setDisabled));
      } else {
        const payload = {
          accountId: profileData.accountId,
          productDivisionCode: values.productDivisionCode,
          productDivisionName: values.productDivisionName,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          parentDivisionId: values.parentDivisionName?.value,
          parentDivisionName: values.parentDivisionName?.label,
          productDivisionTypeId: values.productDivisionType?.value,
          productDivisionType: values.productDivisionType?.label,
          actionBy: profileData.userId,
        };

        dispatch(saveProductDivision({ data: payload, cb }, setDisabled));
      }
    } else {
      console.log(values);
    }
  };

  return (
    <IForm
      title={id ? "Edit Product Division" : "Create Product Division"}
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
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          ProductDivisionTypeDDL={ProductDivisionTypeDDL}
          ParentDivisionTypeDDLAc={ParentDivisionTypeDDLAc}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
