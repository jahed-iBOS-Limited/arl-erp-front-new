/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  createSalesForceTaDa,
  getSalesForceTaDaById,
  editSalesForceTaDa,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

const initData = {
  employee: "",
  employeeFullName: "",
  designationName: "",
  departmentName: "",
  monthlyTaAmount: "",
  monthlyDaAmount: "",
  additionAmount: "",
  deductionAmount: "",
};

export default function SalesForceFixedTaDAForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (params?.id) {
      getSalesForceTaDaById(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          salesForceTadasetupId: params?.id,
          taamount: +values?.monthlyTaAmount,
          daamount: +values?.monthlyDaAmount,
          // additionAmount: +values?.additionAmount,
          // deductionAmount: +values?.deductionAmount,
          meetinExpense: +values?.meetinExpense,
          actionBy: profileData.userId,
        };

     
        editSalesForceTaDa(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          employeeId: values?.employee?.value,
          taamount: +values?.monthlyTaAmount,
          daamount: +values?.monthlyDaAmount,
          // additionAmount: +values?.additionAmount,
          // deductionAmount: +values?.deductionAmount,
          meetinExpense: +values?.meetinExpense,
          actionBy: profileData.userId,
        };

        createSalesForceTaDa(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title="Create Salesforce Fixed TA DA "
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id ? true : false}
      />
    </IForm>
  );
}
