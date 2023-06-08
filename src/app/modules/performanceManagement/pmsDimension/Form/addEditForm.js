/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getDimensionTypeAction,
  savePmsDimensionAction,
} from "../_redux/Actions";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";

const initData = {
  id: undefined,
};

export default function PmsDimensionForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [total, setTotal] = useState(0);

  // storeData
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData?.profileData,
      selectedBusinessUnit: state.authData?.selectedBusinessUnit,
      dimensionType: state.pmsDimensionTwo?.dimensionType,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, dimensionType } = storeData;

  useEffect(() => {
    dispatch(getDimensionTypeAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reducer = (ac, cv) => {
      return ac + +cv.weight;
    };
    setTotal(rowDto.reduce(reducer, 0));
  }, [rowDto]);

  useEffect(() => {
    let data = dimensionType?.map((itm, index) => {
      return {
        ...itm,
        weight: "",
      };
    });
    setRowDto([...data]);
  }, [dimensionType]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let payload = rowDto.map((itm, index) => {
        return {
          accountId: +profileData?.accountId,
          busniessUnitId: +selectedBusinessUnit?.value,
          pmsDimensionTypeId: itm?.dimentionTypeId,
          wieghtNumber: +itm?.weight,
          actionBy: +profileData.userId,
        };
      });
      if (total > 100 || total < 100) {
        toast.warn("Total must be 100");
      } else {
        dispatch(savePmsDimensionAction({ data: payload, cb }));
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    setRowDto(data);
  };

  return (
    <IForm
      title="CREATE PMS DIMENSION"
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
        rowDto={rowDto}
        rowDtoHandler={rowDtoHandler}
        total={total}
      />
    </IForm>
  );
}
