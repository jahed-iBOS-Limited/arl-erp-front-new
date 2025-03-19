/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  editOutletAttribute,
  getOutletAttributeSigleData,
  saveOutletAttribute,
} from "../helper";

const initData = {
  profileTypeName: "",
  controlName: "",
  isMandatory: false,
};

export default function OutletAttributeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);

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

  // get value addition view data
  useEffect(() => {
    if (id) {
      getOutletAttributeSigleData(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  // Show when in edit mode, rowData
  useEffect(() => {
    const newData = singleData?.row?.map((item) => ({
      valueName: item?.outletAttributeValueName,
    }));
    if (id) {
      setRowDto(newData);
    } else {
      setRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const editRowDto = rowDto?.map((item, index) => ({
          outletAttributeId: +id,
          outletAttributeValueName: item?.valueName,
          isActive: true,
        }));
        const payload = {
          editAttribute: {
            outletAttributeId: +id,
            outletAttributeName: values?.profileTypeName,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            uicontrolType: values?.controlName?.label,
            isMandatory: values?.isMandatory,
            actionBy: profileData?.userId,
            dteLastActionDateTime: "2021-01-11T08:30:02.852Z",
          },
          editAttributeValue: editRowDto,
        };
        editOutletAttribute(payload, setDisabled);
      } else {
        const newRowDto = rowDto?.map((item, index) => ({
          outletAttributeId: id,
          outletAttributeValueName: item?.valueName,
          isActive: true,
        }));
        const payload = {
          objCreateOutletAttribute: {
            outletAttributeName: values?.profileTypeName,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            uicontrolType: values?.controlName?.label,
            isMandatory: values?.isMandatory,
            actionBy: profileData?.userId,
            dteLastActionDateTime: "2021-01-11T06:24:01.460Z",
          },
          objCreateOutletAttributeValue: newRowDto,
        };
        saveOutletAttribute(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
      
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <IForm
      title="Create Outlet Attribute"
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
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
      />
    </IForm>
  );
}
