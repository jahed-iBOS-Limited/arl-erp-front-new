/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import {
  createDamageCategory,
  editDamageType,
  getDamageCategoryById,
  getDamageTypeDDL,
} from "../helper";

const initData = {
  damageType: "",
  categoryName: "",
};

const DamageCategoryForm = () => {
  const { id,view } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [damageTypeDDL, setDamageTypeDDL] = useState([])

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    getDamageTypeDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDamageTypeDDL
    );
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  // Get Single Data By Id
  useEffect(() => {
    if (id) {
      getDamageCategoryById(id, setSingleData);
    }
    if (view) {
      getDamageCategoryById(view, setSingleData);
    }
  }, [id]);

 // Save & Edit Handler
 const saveHandler = (values, cb) => {
  if (!id) {
    let payload = {
      damageTypeId: values?.damageType?.value,
      damageTypeName: values?.damageType?.label,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      dmgCatagoryName: values?.categoryName,
      actionBy: profileData.userId,
    };
    createDamageCategory(payload, setDisabled, cb);
  } else {
    let payload = {
      dmgCatagoryId: +id,
      damageTypeId: values?.damageType?.value,
      damageTypeName: values?.damageType?.label,
      dmgCatagoryName: values?.categoryName,
      actionBy:  profileData.userId,
    };
    editDamageType(payload, setDisabled);
  }
};

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={view ? "Damage Category" : !id ? "Create Damage Category" : "Edit Damage Category"}
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenReset={view}
        isHiddenSave={view}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setDisabled={setDisabled}
          isEdit={id}
          // All DDL
          damageTypeDDL={damageTypeDDL}
          view={view}
        />
      </IForm>
    </>
  );
};

export default DamageCategoryForm;
