/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getComponentTypeDDL,
  getRumenarationComponentById,
  saveRumenarationComponent,
  editRumenarationComponent,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

let initData = {
  remunerationComponent: "",
  remunerationComponentCode: "",
  remunerationComponentTypeID: "",
  defaultPercentOnBasic: "",
  isOnBasic: false,
};
export function RumenarationComponentForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [componentTypeDDL, setComponentTypeDDL] = useState("");
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store;
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  useEffect(() => {
    getComponentTypeDDL(setComponentTypeDDL);
  }, []);

  useEffect(() => {
    getRumenarationComponentById(id, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    if (
      values?.isOnBasic &&
      (values?.defaultPercentOnBasic === "" ||
        values?.defaultPercentOnBasic === 0)
    ) {
      toast.warning("Percent On Basic Remuneration is required ");
    } else {
      if (values) {
        if (id) {
          const payload = {
            remunerationComponentId: +id,
            remunerationComponent: values?.remunerationComponent,
            remunerationComponentCode: values?.remunerationComponentCode,
            remunerationComponetTypeId: values?.remunerationComponetTypeId,
            defaultPercentOnBasic: values?.isOnBasic
              ? +values?.defaultPercentOnBasic
              : 0,
            isOnBasic: values?.isOnBasic,
            accountId: profileData?.accountId,
            actionBy: profileData?.userId,
          };
          editRumenarationComponent(payload, setDisabled);
        } else {
          const payload = {
            remunerationComponent: values?.remunerationComponent,
            remunerationComponentCode: values?.remunerationComponentCode,
            remunerationComponetTypeId:
              values?.remunerationComponentTypeID.value,
            defaultPercentOnBasic: values?.isOnBasic
              ? +values?.defaultPercentOnBasic
              : 0,
            isOnBasic: values?.isOnBasic,
            accountId: profileData?.accountId,
            actionBy: profileData?.userId,
          };
          saveRumenarationComponent(payload, cb, setDisabled);
        }
      } else {
        setDisabled(false);
      }
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={
        id ? "Edit Remuneration Component " : "Create Remuneration Component "
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          componentTypeDDL={componentTypeDDL}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
