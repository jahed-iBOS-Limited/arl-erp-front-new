/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import Loading from "./../../../../_helper/_loading";
import {
  getGeneralLedgerDDLAction,
  saveCostElement,
  setCostElementSingleEmpty,
  getCostCenterById,
  saveEditedCostElementData,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import {
  getCostCenterDDLAction,
  getControllingUnitDDLAction,
} from "../../../../_helper/_redux/Actions";
import { toast } from "react-toastify";
import { getBusinessTransactionDDL } from "./helper";

const initData = {
  id: undefined,
  costElementName: "",
  costElementCode: "",
  controllingUnit: "",
  costCenter: "",
  allocationBased: false,
  generalLedger: "",
  businessTransaction:""
};

export default function CostElementForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [businessTransactionDDL, setBusinessTransactionDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit ddl from store
  const controllingUnitDDL = useSelector((state) => {
    return state?.commonDDL?.controllingDDL;
  }, shallowEqual);

  // get cost center ddl from store
  const costCenterDDL = useSelector((state) => {
    return state?.commonDDL?.costCenterDDL;
  }, shallowEqual);

  // get general ledger ddl from store
  const generalLedgerDDL = useSelector((state) => {
    return state?.costElement?.generalLedgerDDL;
  }, shallowEqual);

  // get single cost element from store
  const singleData = useSelector((state) => {
    return state.costElement?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getCostCenterById(id));
    } else {
      dispatch(setCostElementSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(()=> {
    if(singleData){
      dispatch(
        getCostCenterDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          singleData?.controllingUnitId
        )
      );
      getBusinessTransactionDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        singleData?.generalLedgerId,
        setBusinessTransactionDDL
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[singleData, profileData, selectedBusinessUnit])

  // Dispatch action for ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getControllingUnitDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getGeneralLedgerDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const controllUniIdFunc = (cuId) => {
    dispatch(
      getCostCenterDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        cuId
      )
    );
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if(!values?.costCenter) return toast.warn("Cost Center is Required")
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          costElementName: values.costElementName,
          costElementId: +id,
          generalLedgerId: values.generalLedger?.value,
          costCenterId: values?.costCenter?.map((data)=>(data?.value)),
          allocationBased: false,
          actionBy: profileData.userId,
          businessTransactionId: values?.businessTransaction?.value,
        };

        dispatch(saveEditedCostElementData(payload, setDisabled));
      } else {
        const payload = {
          businessTransactionId: values?.businessTransaction?.value,
          costElementCode: "N/A",
          costElementName: values.costElementName,
          costCenterId: values?.costCenter?.map((data)=>(data?.value)),
          generalLedgerId: values.generalLedger?.value,
          controllingUnitId: values.controllingUnit?.value,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          allocationBased: false,
          actionBy: profileData.userId,
        };
        dispatch(saveCostElement({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      title="Create Cost Element"
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
        controllingUnitDDL={controllingUnitDDL}
        isEdit={id || false}
        controllUniIdFunc={(id) => controllUniIdFunc(id)}
        costCenterDDL={costCenterDDL}
        generalLedgerDDL={generalLedgerDDL}
        businessTransactionDDL={businessTransactionDDL}
        setBusinessTransactionDDL={setBusinessTransactionDDL}
      />
    </IForm>
  );
}
