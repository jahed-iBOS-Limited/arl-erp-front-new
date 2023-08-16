/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  setControllingUnitSingleEmpty,
  saveSalesOrganization,
  getSalesOrganizationById,
  saveExtendSalesOrganizationData,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  soName: "",
  soCode: "",
  soNameTwo: "",
  bUnit: "",
  sbu: "",
};

export default function SalesOrganizationForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const sbuDDL = useSelector((state) => {
    return state.commonDDL.sbuDDL;
  }, shallowEqual);

  const buDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const organizationName = useSelector((state) => {
    return state.salesOrganization.singleData?.objHeader?.salesOrganizationName;
  }, shallowEqual);

  const objRow = useSelector((state) => {
    return state.salesOrganization.singleData?.objRow;
  }, shallowEqual);

  const organizationId = useSelector((state) => {
    return state.salesOrganization.singleData?.objHeader?.salesOrganizationId;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesOrganizationById(profileData?.accountId, id,setDisabled ));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setRowDto(objRow);
  }, [objRow]);

 

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        dispatch(saveExtendSalesOrganizationData(rowDto,setDisabled));
      } else {
        const payload = {
          salesOrganizationCode: values.soCode,
          salesOrganizationName: values.soName,
          accountId: profileData.accountId,
          actionBy: profileData.userId,
        };
        dispatch(saveSalesOrganization({ data: payload, cb },setDisabled));
      }
    } else {
      
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const addHandler = (param) => {
    if (isUniq("sbuid", param?.sbuid, rowDto)) {
      setRowDto([...rowDto, param]);
    }
  };

  const remover = (param) => {
    const filtered = rowDto.filter((itm) => itm.businessUnitId !== param);
    setRowDto(filtered);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Extend Sales Organization" : "Create Sales Organization"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        sbuDDL={sbuDDL}
        buDDL={buDDL}
        id={id}
        accoundId={profileData.accountId}
        organizationName={organizationName}
        organizationId={organizationId}
        setter={addHandler}
        remover={remover}
        rowDto={rowDto}
      />
    </IForm>
  );
}
