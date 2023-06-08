/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveSalesOffice,
  saveEditedSalesOffice,
  getSalesOfficeById,
  setSalesOfficeSingleEmpty,
  getSalesOrgDDL,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { getSalesOrgDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  salesOrganization: "",
  salesOfficeName: "",
};

export default function SalesOfficeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [salesOrgDDL,setOrgDDL] = useState([]);
  const [objProps, setObjprops] = useState({});
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get soList ddl from store
  // const saleOrgDDL = useSelector((state) => {
  //   return state?.commonDDL?.salesOrgDDL;
  // }, shallowEqual);

  // get single salesOffice from store
  const singleData = useSelector((state) => {
    return state.salesOffice?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesOfficeById(id, setDisabled));
    } else {
      dispatch(setSalesOfficeSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get SOlist action for get SOlist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSalesOrgDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      getSalesOrgDDL(profileData.accountId, selectedBusinessUnit.value,setOrgDDL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          salesOfficeId: values.salesOfficeId,
          salesOfficeName: values.salesOfficeName,
          salesOrganizationId: values.salesOrganization.value,
          salesOrganizationName: values.salesOrganization.label,
          actionBy: profileData.userId,
        };
        dispatch(saveEditedSalesOffice(payload,setDisabled));
      } else {
        const payload = {
          salesOfficeName: values.salesOfficeName,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          salesOrganizationId: values.salesOrganization.value,
          salesOrganizationName: values.salesOrganization.label,
          actionBy: profileData.userId,
        };

        dispatch(saveSalesOffice({ data: payload, cb },setDisabled));
      }
    } else {
      console.log(values)
    }
  };

  return (
    <IForm
      title={id ? "Edit Sales Office" : "Create Sales Office"}
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
        saleOrgDDL={salesOrgDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
