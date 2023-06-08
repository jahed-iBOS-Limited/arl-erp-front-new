import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getGLDDLAction,
  getOrgDDLAction,
  saveAccountingConfigAction,
  getPartnerTypeDDLFromAccoutingConfig,
  getBusinessTransDDLAction,
} from "../helper";
import { toast } from "react-toastify";

let initData = {
  partnerType: "",
  configType: "",
  gl: "",
  org: "",
  businessTrans: "",
};

export function AccountingConfigForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [orgDDL, setOrgDDL] = useState([]);
  const [glDDL, setGLDDL] = useState([]);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const [businessTransDDL, setBusinessTransDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getPartnerTypeDDLFromAccoutingConfig(setPartnerTypeDDL);
    getBusinessTransDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBusinessTransDDL
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getOrgDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOrgDDL
    );
    getGLDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGLDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const setter = (values) => {
    const { configType, org, gl } = values;
    if (!configType || !org || !gl)
      return toast.warn("Please select all fields");
    const data = [...rowDto];
    data.push(values);
    setRowDto(data);
  };

  const remover = (idx) => {
    const data = rowDto.filter((item, index) => index !== idx);
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length < 1) return toast.warn("Please add at least one row");
    const newData = rowDto?.map((item) => ({
      businessUnitId: selectedBusinessUnit?.value,
      configType: item?.configType?.label,
      glId: item?.gl?.value,
      glName: item?.gl?.label,
      glCode: item?.gl?.code,
      organizationId: item?.org?.value,
      organizationName: item?.org?.label,
      configTypeId: item?.configType?.value,
      partnerTypeId: item?.partnerType?.value,
      partnerType: item?.partnerType?.label,
      businessTransectionId: item?.businessTrans?.value,
      businessTransectionName: item?.businessTrans?.label,
      businessTransectionCode: item?.businessTrans?.code,
    }));
    saveAccountingConfigAction(newData, setDisabled, setRowDto);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Create Accounting Config"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          orgDDL={orgDDL}
          setter={setter}
          rowDto={rowDto}
          remover={remover}
          partnerTypeDDL={partnerTypeDDL}
          glDDL={glDDL}
          businessTransDDL={businessTransDDL}
        />
      </div>
    </IForm>
  );
}
