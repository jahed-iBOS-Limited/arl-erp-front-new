/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getHSCodeDDL_api,
  getItemTypeListDDL_api,
  getItemUOMDDL_api,
  getSupplyTypeDDL_api,
  getTaxItemTypeDDL_api,
  GetVatItemView,
  saveEditedVatItem,
  saveVatItem,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

const initData = {
  taxItemGroupName: "",
  taxItemTypeId: "",
  taxItemCategoryId: "",
  supplyTypeId: "",
  itemTypeId: "",
  hsCode: "",
  uomName: "",
};

export default function VatItemForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const [supplyTypeDDL, setSupplyTypeDDL] = useState("");
  const [hsCodeDDL, setHsCodeDDL] = useState("");
  const [taxItemTypeDDL, setTaxItemTypeDDL] = useState("");
  const [itemTypeListDDL, setItemTypeListDDL] = useState("");
  const [itemUOMDDL, setItemUOMDDL] = useState("");
  const params = useParams();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");

  useEffect(() => {

    getSupplyTypeDDL_api(setSupplyTypeDDL);
    getHSCodeDDL_api(setHsCodeDDL);
    getTaxItemTypeDDL_api(setTaxItemTypeDDL);
    getItemTypeListDDL_api(setItemTypeListDDL);
  }, []);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getItemUOMDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemUOMDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);
  // get value addition view data
  useEffect(() => {
    if (params?.id) {
      GetVatItemView(params?.id, setSingleData, setDisabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          taxItemGroupId: +params?.id,
          currentTaxPrice: 0,
          taxItemGroupName: values?.taxItemGroupName,
          supplyTypeId: values?.supplyTypeId?.value,
          taxItemTypeId: values?.taxItemTypeId?.value,
          itemTypeId: values?.itemTypeId?.value,
          hsCode: values?.hsCode?.label,
          taxItemCategoryId: values?.taxItemCategoryId?.value,
          isTaxExemted: true,
          uomId: values?.uomName?.value,
          uomName: values?.uomName?.label,
          actionBy: profileData?.userId,
        };
        saveEditedVatItem(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          taxItemGroupName: values?.taxItemGroupName,
          supplyTypeId: values?.supplyTypeId?.value,
          taxItemTypeId: values?.taxItemTypeId?.value,
          itemTypeId: values?.itemTypeId?.value,
          hsCode: values?.hsCode?.label,
          taxItemCategoryId: values?.taxItemCategoryId?.value,
          uomId: values?.uomName?.value,
          uomName: values?.uomName?.label,
          actionBy: profileData?.userId,
        };
        saveVatItem(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
      
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <IForm
      title="Create Tax Item"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}

        supplyTypeDDL={supplyTypeDDL}
        hsCodeDDL={hsCodeDDL}
        taxItemTypeDDL={taxItemTypeDDL}
        itemTypeListDDL={itemTypeListDDL}
        itemUOMDDL={itemUOMDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
