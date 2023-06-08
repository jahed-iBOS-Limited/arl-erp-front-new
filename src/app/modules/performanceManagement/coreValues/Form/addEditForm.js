/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveEditedCoreValues,
  setCoreValuesEmpty,
  saveCoreValues,
  getCoreValuesById,
} from "../_redux/Actions";
import { toast } from "react-toastify";
import { isUniq } from "../../../_helper/uniqChecker";
import IForm from "../../../_helper/_form";

const initData = {
  id: undefined,
  coreValueName: "",
  coreValueDefinition: "",
  numDesiredValue: "",
  demonstratedBehaviour: "",
  isPositive: true
};

export default function CoreValuesForm({
  history,
  match: {
    params: { EditId },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  // if we get it as id, it will make our Edit title small letter , so we make id as EditId
  const id = EditId;

  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      singleData: state.coreValuesTwo?.singleData,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit, singleData } = storeData;

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getCoreValuesById(id));
    } else {
      dispatch(setCoreValuesEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    let data = singleData?.objListRow || [];
    let newData = data?.map(item => ({...item, isPositive : item?.isPositive}))
    setRowDto([...newData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        let row = rowDto.map((itm, index) => {
          return {
            configId: +itm?.configId || 0,
            demonstratedBehaviour: itm?.demonstratedBehaviour,
            isPositive: itm?.isPositive,
            actionBy: +profileData.userId,
          };
        });
        const payload = {
          objHeader: {
            coreValueId: +id,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            coreValueName: values?.coreValueName,
            coreValueDefinition: values?.coreValueDefinition,
            numDesiredValue: +values?.numDesiredValue,
            actionBy: +profileData.userId,
          },
          objListRow: row,
        };

        !rowDto.length
          ? toast.warning("Select all fields")
          : dispatch(saveEditedCoreValues(payload, cb));
      } else {
        let row = rowDto.map((itm, index) => {
          return {
            demonstratedBehaviour: itm?.demonstratedBehaviour,
            isPositive: itm?.isPositive,
            actionBy: +profileData.userId,
          };
        });
        const payload = {
          objHeader: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            coreValueName: values?.coreValueName,
            coreValueDefinition: values?.coreValueDefinition,
            numDesiredValue: +values?.numDesiredValue,
            actionBy: +profileData?.userId,
          },
          objListRow: row,
        };
        !rowDto.length
          ? toast.warning("Select all fields")
          : dispatch(saveCoreValues({ data: payload, cb, setRowDto }));
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  const setter = (values) => {
    if (
      isUniq("demonstratedBehaviour", values?.demonstratedBehaviour, rowDto)
    ) {
      let obj = {
        demonstratedBehaviour: values?.demonstratedBehaviour,
        isPositive: values?.isPositive
      };
      setRowDto([...rowDto, obj]);
    }
  };
  const remover = (demonstratedBehaviour) => {
    const filterArr = rowDto.filter(
      (itm) => itm.demonstratedBehaviour !== demonstratedBehaviour
    );
    setRowDto(filterArr);
  };
  console.log(rowDto);

  const rowDtoHandler = (name, index , value) => {
    const data = [...rowDto]
          data[index][name] = value
          setRowDto(data)
  }

  return (
    <IForm
      title={id ? "EDIT CORE VALUES" : "CREATE CORE VALUES"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={id ? singleData?.objHeader : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        setDisabled={setDisabled}
        id={id}
        rowDtoHandler={rowDtoHandler}
      />
    </IForm>
  );
}
