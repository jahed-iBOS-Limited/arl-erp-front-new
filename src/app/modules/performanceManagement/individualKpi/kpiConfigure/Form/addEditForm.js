/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  createKPIConfigure,
  getSingleKPIConfigureById,
  SaveEditedKPIConfigure,
} from "../helper";

const initData = {
  id: undefined,
  BSCPerspective: "",
  KPIName: "",
  KPIFormat: "",
  Comments: "",
};

export default function KpiConfigureForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");

  console.log(rowDto, "rowDto");

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  useEffect(() => {
    getSingleKPIConfigureById(id, setSingleData);
  }, [id]);


  const addItemToTheGrid = (values) => {
    if (values.quantity < 0) {
      return toast.warn("Quantity must be greater than 0");
    }

    let data = rowDto.find(
      (data) =>
        data.BSCPerspective === values?.BSCPerspective.label &&
        data.KPIName === values?.KPIName
    );
    if (data) {
      toast.error("Item already added");
    } else {
      let itemRow = {
        BSCPerspective: values?.BSCPerspective.label,
        BSCPerspectiveId: values?.BSCPerspective.value,
        KPIName: values?.KPIName,
        KPIFormatId: values?.KPIFormat.value,
        KPIFormat: values?.KPIFormat.label,
        Comments: values?.Comments,
      };
      setRowDto([...rowDto, itemRow]);
    }
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const data = [
          {
            intKpiId: +id,
            strKpiName: values?.KPIName,
            intBscperspectiveId: values?.BSCPerspective.value,
            strBscperspective: values?.BSCPerspective.label,
            intKpiformatId: values?.KPIFormat.value,
            strKpiformat: values?.KPIFormat.label,
            strComments: values?.Comments,
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            intActionBy: 0,
          },
        ];
        SaveEditedKPIConfigure(data, setDisabled);
      } else {
        const payload = rowDto.map((item) => ({
          strKpiName: item?.KPIName,
          intBscperspectiveId: item?.BSCPerspectiveId,
          intKpiformatId: item?.KPIFormatId,
          strKpiformat: item?.KPIFormat,
          strComments: item?.Comments,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intActionBy: 0,
        }));
        createKPIConfigure(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create KPI Configure"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={type === "view"}
      isHiddenReset={type === "view"}
    >
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        addItemToTheGrid={addItemToTheGrid}
        remover={remover}
      />
    </IForm>
  );
}
