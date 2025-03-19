/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getScaleForDDLAction,
  saveMeasuringScaleAction,
} from "../_redux/Actions";
import { isUniq } from "../../../_helper/uniqChecker";
import IForm from "../../../_helper/_form";
import { toast } from "react-toastify";

const initData = {
  scaleFor: "",
  scaleName: "",
  value: "",
};

export default function MeasuringScaleForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);

  // storeData
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      scaleForDDL: state.measuringScaleTwo.scaleForDDL,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit, scaleForDDL } = storeData;

  useEffect(() => {
    dispatch(getScaleForDDLAction());
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (!rowDto.length) {
        toast.warning("Please add scale name and value");
      } else {
        let payload = rowDto.map((itm, index) => {
          return {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            dimensionTypeId: values?.scaleFor?.value,
            measuringScaleName: itm?.scaleName,
            measuringScaleValue: +itm?.value,
            actionBy: +profileData.userId,
          };
        });
        dispatch(saveMeasuringScaleAction({ data: payload, cb, setRowDto }));
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    if (isUniq("scaleName", values?.scaleName, rowDto)) {
      let obj = {
        scaleName: values?.scaleName,
        value: values?.value,
      };
      setRowDto([...rowDto, obj]);
    }
  };
  const remover = (scaleName) => {
    const filterArr = rowDto.filter((itm) => itm.scaleName !== scaleName);
    setRowDto(filterArr);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="CREATE MEASURING SCALE"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        setter={setter}
        rowDto={rowDto}
        remover={remover}
        scaleForDDL={scaleForDDL}
      />
    </IForm>
  );
}
