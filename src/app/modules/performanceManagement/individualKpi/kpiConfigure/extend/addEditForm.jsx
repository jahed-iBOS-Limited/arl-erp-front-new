/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  getSingleKPIConfigureForExtend,
  SaveExtendKPIConfigure,
} from "../helper";

const initData = {
  id: undefined,
};

export default function KPIConfigureExtendForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  // const [loading, setLoading] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  useEffect(() => {
    // if (id) ExtendPartnerById(id, setSingleData);
    getSingleKPIConfigureForExtend(id, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addItemToTheGrid = (values) => {
    if (values.quantity < 0) {
      return toast.warn("Quantity must be greater than 0");
    }

    let data = rowDto.find(
      (item) => item?.Objective === values?.Objective?.label
    );
    if (data) {
      toast.error("Item already added");
    } else {
      let newObj = {
        Objective: values.Objective.label,
        ObjectiveId: values.Objective.value,
      };
      setRowDto([newObj, ...rowDto]);
    }
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = rowDto?.map((item) => ({
        intKpiId: +id,
        intObjectiveId: item?.ObjectiveId,
        strObjective: item?.Objective,
      }));
      if (payload?.length > 0) {
        SaveExtendKPIConfigure(payload, cb, setDisabled);
      } else {
        toast.warning("You must have to add atleast one item");
      }
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Extend KPI Configure"
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
